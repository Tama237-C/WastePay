"use server";

import { randomInt } from "node:crypto";

import { revalidatePath } from "next/cache";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

const allowedStaffRoles = ["manager", "agent", "driver"] as const;

type StaffRole = (typeof allowedStaffRoles)[number];

export type CreateStaffAccountState = {
  status: "idle" | "error" | "success";
  message: string;
  temporaryPassword: string | null;
  createdEmail: string | null;
};



function isStaffRole(value: string): value is StaffRole {
  return allowedStaffRoles.some((role) => role === value);
}

function normalizeCameroonPhoneNumber(value: string): string | null {
  const cleanedValue = value.replace(/[\s()-]/g, "");

  if (/^\+2376\d{8}$/.test(cleanedValue)) {
    return cleanedValue;
  }

  if (/^6\d{8}$/.test(cleanedValue)) {
    return `+237${cleanedValue}`;
  }

  return null;
}

function generateTemporaryPassword(role: StaffRole): string {
  const rolePrefix: Record<StaffRole, string> = {
    manager: "MGR",
    agent: "AGT",
    driver: "DRV",
  };

  const numericSection = randomInt(100000, 1000000);
  const symbolOptions = ["!", "@", "#", "$", "%"];
  const symbol = symbolOptions[randomInt(0, symbolOptions.length)];

  return `WP-${rolePrefix[role]}-${numericSection}${symbol}aZ`;
}

async function verifyCurrentAdministrator(): Promise<
  | {
      authorized: true;
      administratorId: string;
    }
  | {
      authorized: false;
      message: string;
    }
> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      authorized: false,
      message: "Your administrator session has expired. Sign in again.",
    };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role, is_active")
    .eq("id", user.id)
    .single();

  if (
    profileError ||
    !profile ||
    profile.role !== "admin" ||
    !profile.is_active
  ) {
    return {
      authorized: false,
      message:
        "Your account is not authorized to create WastePay staff accounts.",
    };
  }

  return {
    authorized: true,
    administratorId: user.id,
  };
}

export async function createStaffAccount(
  _previousState: CreateStaffAccountState,
  formData: FormData,
): Promise<CreateStaffAccountState> {
  const authorization = await verifyCurrentAdministrator();

  if (!authorization.authorized) {
    return {
      status: "error",
      message: authorization.message,
      temporaryPassword: null,
      createdEmail: null,
    };
  }

  const fullNameValue = formData.get("fullName");
  const emailValue = formData.get("email");
  const phoneNumberValue = formData.get("phoneNumber");
  const roleValue = formData.get("role");
  const locationZoneValue = formData.get("locationZone");

  const fullName =
    typeof fullNameValue === "string" ? fullNameValue.trim() : "";

  const email =
    typeof emailValue === "string" ? emailValue.trim().toLowerCase() : "";

  const phoneNumberInput =
    typeof phoneNumberValue === "string" ? phoneNumberValue.trim() : "";

  const role = typeof roleValue === "string" ? roleValue.trim() : "";

  const locationZone =
    typeof locationZoneValue === "string" ? locationZoneValue.trim() : "";

  if (fullName.length < 3) {
    return {
      status: "error",
      message: "Enter the staff member’s complete legal name.",
      temporaryPassword: null,
      createdEmail: null,
    };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return {
      status: "error",
      message: "Enter a valid staff email address.",
      temporaryPassword: null,
      createdEmail: null,
    };
  }

  const normalizedPhoneNumber =
    normalizeCameroonPhoneNumber(phoneNumberInput);

  if (!normalizedPhoneNumber) {
    return {
      status: "error",
      message:
        "Enter a valid Cameroon mobile number, such as +2376XXXXXXXX.",
      temporaryPassword: null,
      createdEmail: null,
    };
  }

  if (!isStaffRole(role)) {
    return {
      status: "error",
      message: "Select Depot Manager, Depot Agent, or Pickup Driver.",
      temporaryPassword: null,
      createdEmail: null,
    };
  }

  if (locationZone.length < 2) {
    return {
      status: "error",
      message: "Enter the staff member’s city or operational location zone.",
      temporaryPassword: null,
      createdEmail: null,
    };
  }

  const adminClient = createAdminClient();

  const { data: existingProfiles, error: phoneLookupError } = await adminClient
    .from("profiles")
    .select("id")
    .eq("phone_number", normalizedPhoneNumber)
    .limit(1);

  if (phoneLookupError) {
    return {
      status: "error",
      message:
        "WastePay could not verify whether this phone number already exists.",
      temporaryPassword: null,
      createdEmail: null,
    };
  }

  if (existingProfiles && existingProfiles.length > 0) {
    return {
      status: "error",
      message:
        "This phone number is already connected to another WastePay account.",
      temporaryPassword: null,
      createdEmail: null,
    };
  }

  const temporaryPassword = generateTemporaryPassword(role);

  const { data: createdUserData, error: createUserError } =
    await adminClient.auth.admin.createUser({
      email,
      password: temporaryPassword,
      email_confirm: true,
      user_metadata: {
        full_name: fullName,
        created_by_administrator_id: authorization.administratorId,
        requires_password_change: true,
      },
    });

  if (createUserError || !createdUserData.user) {
    const normalizedErrorMessage = createUserError?.message.toLowerCase() ?? "";

    if (
      normalizedErrorMessage.includes("already") ||
      normalizedErrorMessage.includes("registered")
    ) {
      return {
        status: "error",
        message:
          "An authentication account already exists with this email address.",
        temporaryPassword: null,
        createdEmail: null,
      };
    }

    return {
      status: "error",
      message:
        "Supabase could not create this staff account. Check the details and try again.",
      temporaryPassword: null,
      createdEmail: null,
    };
  }

  const createdUserId = createdUserData.user.id;

  const { error: profileUpdateError } = await adminClient
  .from("profiles")
  .update({
    full_name: fullName,
    phone_number: normalizedPhoneNumber,
    role,
    active_location_zone: locationZone,
    is_active: true,
    must_change_password: true,
  })
  .eq("id", createdUserId);

  if (profileUpdateError) {
    await adminClient.auth.admin.deleteUser(createdUserId);

    return {
      status: "error",
      message:
        "The authentication account was cancelled because WastePay could not complete its staff profile.",
      temporaryPassword: null,
      createdEmail: null,
    };
  }

  revalidatePath("/admin/staff-management");

  return {
    status: "success",
    message:
      "The staff account was created successfully. Copy the temporary credentials now.",
    temporaryPassword,
    createdEmail: email,
  };
}