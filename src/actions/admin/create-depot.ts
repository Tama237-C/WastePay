"use server";

import { revalidatePath } from "next/cache";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

const allowedDepotStatuses = [
  "planned",
  "active",
  "temporarily_closed",
  "inactive",
] as const;

type DepotStatus = (typeof allowedDepotStatuses)[number];

export type CreateDepotState = {
  status: "idle" | "error" | "success";
  message: string;
  createdDepotName: string | null;
  createdDepotCode: string | null;
};

function isDepotStatus(value: string): value is DepotStatus {
  return allowedDepotStatuses.some((status) => status === value);
}

function normalizeText(value: FormDataEntryValue | null): string {
  return typeof value === "string" ? value.trim() : "";
}

function parseNonNegativeInteger(value: string): number | null {
  if (!/^\d+$/.test(value)) {
    return null;
  }

  const parsedValue = Number(value);

  if (!Number.isSafeInteger(parsedValue) || parsedValue < 0) {
    return null;
  }

  return parsedValue;
}

function parsePositiveDecimal(value: string): number | null {
  const parsedValue = Number(value);

  if (!Number.isFinite(parsedValue) || parsedValue <= 0) {
    return null;
  }

  return parsedValue;
}

function parseLatitude(value: string): number | null {
  const parsedValue = Number(value);

  if (
    !Number.isFinite(parsedValue) ||
    parsedValue < -90 ||
    parsedValue > 90
  ) {
    return null;
  }

  return parsedValue;
}

function parseLongitude(value: string): number | null {
  const parsedValue = Number(value);

  if (
    !Number.isFinite(parsedValue) ||
    parsedValue < -180 ||
    parsedValue > 180
  ) {
    return null;
  }

  return parsedValue;
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

async function verifyCurrentAdministrator(): Promise<
  | {
      authorized: true;
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
      message: "Your account is not authorized to register ECOLOGIX depots.",
    };
  }

  return {
    authorized: true,
  };
}

export async function createDepot(
  _previousState: CreateDepotState,
  formData: FormData,
): Promise<CreateDepotState> {
  const authorization = await verifyCurrentAdministrator();

  if (!authorization.authorized) {
    return {
      status: "error",
      message: authorization.message,
      createdDepotName: null,
      createdDepotCode: null,
    };
  }

  const name = normalizeText(formData.get("name"));
  const code = normalizeText(formData.get("code")).toUpperCase();
  const regionName = normalizeText(formData.get("regionName"));
  const city = normalizeText(formData.get("city"));
  const addressText = normalizeText(formData.get("addressText"));
  const contactPhoneInput = normalizeText(formData.get("contactPhoneNumber"));
  const storageCapacityInput = normalizeText(
    formData.get("maximumStorageCapacityKg"),
  );
  const mtnFloatInput = normalizeText(formData.get("mtnFloatBalanceCfa"));
  const orangeFloatInput = normalizeText(
    formData.get("orangeFloatBalanceCfa"),
  );
  const openingTime = normalizeText(formData.get("openingTime"));
  const closingTime = normalizeText(formData.get("closingTime"));
  const latitudeInput = normalizeText(formData.get("latitude"));
  const longitudeInput = normalizeText(formData.get("longitude"));
  const statusInput = normalizeText(formData.get("status"));

  if (name.length < 3) {
    return {
      status: "error",
      message: "Enter the depot’s complete operational name.",
      createdDepotName: null,
      createdDepotCode: null,
    };
  }

  if (!/^[A-Z0-9-]{4,30}$/.test(code)) {
    return {
      status: "error",
      message:
        "Use a depot code containing only uppercase letters, numbers, and hyphens.",
      createdDepotName: null,
      createdDepotCode: null,
    };
  }

  if (regionName.length < 3) {
    return {
      status: "error",
      message: "Enter the Cameroon region containing the depot.",
      createdDepotName: null,
      createdDepotCode: null,
    };
  }

  if (city.length < 2) {
    return {
      status: "error",
      message: "Enter the city containing the depot.",
      createdDepotName: null,
      createdDepotCode: null,
    };
  }

  if (addressText.length < 5) {
    return {
      status: "error",
      message: "Enter a clear physical address for the depot.",
      createdDepotName: null,
      createdDepotCode: null,
    };
  }

  const contactPhoneNumber =
    normalizeCameroonPhoneNumber(contactPhoneInput);

  if (!contactPhoneNumber) {
    return {
      status: "error",
      message:
        "Enter a valid Cameroon contact number, such as +2376XXXXXXXX.",
      createdDepotName: null,
      createdDepotCode: null,
    };
  }

  const maximumStorageCapacityKg =
    parsePositiveDecimal(storageCapacityInput);

  if (!maximumStorageCapacityKg) {
    return {
      status: "error",
      message: "Storage capacity must be greater than zero kilograms.",
      createdDepotName: null,
      createdDepotCode: null,
    };
  }

  const mtnFloatBalanceCfa = parseNonNegativeInteger(mtnFloatInput);
  const orangeFloatBalanceCfa = parseNonNegativeInteger(orangeFloatInput);

  if (mtnFloatBalanceCfa === null || orangeFloatBalanceCfa === null) {
    return {
      status: "error",
      message:
        "Mobile Money float balances must be whole numbers equal to or greater than zero.",
      createdDepotName: null,
      createdDepotCode: null,
    };
  }

  if (!openingTime || !closingTime || openingTime >= closingTime) {
    return {
      status: "error",
      message: "The closing time must be later than the opening time.",
      createdDepotName: null,
      createdDepotCode: null,
    };
  }

  const latitude = parseLatitude(latitudeInput);
  const longitude = parseLongitude(longitudeInput);

  if (latitude === null || longitude === null) {
    return {
      status: "error",
      message: "Enter valid latitude and longitude coordinates.",
      createdDepotName: null,
      createdDepotCode: null,
    };
  }

  if (!isDepotStatus(statusInput)) {
    return {
      status: "error",
      message: "Select a valid depot operating status.",
      createdDepotName: null,
      createdDepotCode: null,
    };
  }

  const adminClient = createAdminClient();

  const { data: existingDepot, error: lookupError } = await adminClient
    .from("depots")
    .select("id")
    .eq("code", code)
    .maybeSingle();

  if (lookupError) {
    return {
      status: "error",
      message: "ECOLOGIX could not verify the depot code.",
      createdDepotName: null,
      createdDepotCode: null,
    };
  }

  if (existingDepot) {
    return {
      status: "error",
      message: "Another ECOLOGIX depot already uses this depot code.",
      createdDepotName: null,
      createdDepotCode: null,
    };
  }

  const location = `POINT(${longitude} ${latitude})`;

  const { error: insertError } = await adminClient.from("depots").insert({
    name,
    code,
    region_name: regionName,
    city,
    address_text: addressText,
    contact_phone_number: contactPhoneNumber,
    maximum_storage_capacity_kg: maximumStorageCapacityKg,
    opening_time: openingTime,
    closing_time: closingTime,
    mtn_float_balance_cfa: mtnFloatBalanceCfa,
    orange_float_balance_cfa: orangeFloatBalanceCfa,
    location,
    status: statusInput,
  });

  if (insertError) {
    return {
      status: "error",
      message:
        "ECOLOGIX could not register this depot. Review the details and try again.",
      createdDepotName: null,
      createdDepotCode: null,
    };
  }

  revalidatePath("/admin/depot-management");
  revalidatePath("/admin/overview");

  return {
    status: "success",
    message: "The ECOLOGIX depot was registered successfully.",
    createdDepotName: name,
    createdDepotCode: code,
  };
}