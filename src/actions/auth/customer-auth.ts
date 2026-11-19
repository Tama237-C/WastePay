"use server";

import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export type CustomerAuthState = {
  status: "idle" | "error" | "success";
  message: string;
};

function normalizeText(value: FormDataEntryValue | null): string {
  return typeof value === "string" ? value.trim() : "";
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

export async function signInCustomer(
  _previousState: CustomerAuthState,
  formData: FormData,
): Promise<CustomerAuthState> {
  const email = normalizeText(formData.get("email")).toLowerCase();
  const password = normalizeText(formData.get("password"));

  if (!email || !password) {
    return { status: "error", message: "Enter your email and password." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    return {
      status: "error",
      message: "The email address or password is incorrect.",
    };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role, is_active")
    .eq("id", data.user.id)
    .maybeSingle();

  if (profileError) {
    const { error: signOutError } = await supabase.auth.signOut();
    if (signOutError) {
      throw new Error("WastePay could not close the unverified sign-in session.", {
        cause: signOutError,
      });
    }
    throw new Error("WastePay could not verify the customer account.", {
      cause: profileError,
    });
  }

  if (!profile || !profile.is_active) {
    const { error: signOutError } = await supabase.auth.signOut();
    if (signOutError) {
      throw new Error("WastePay could not close the inactive account session.", {
        cause: signOutError,
      });
    }
    return {
      status: "error",
      message: "This account is inactive or not available.",
    };
  }

  if (profile.role !== "resident") {
    const { error: signOutError } = await supabase.auth.signOut();
    if (signOutError) {
      throw new Error("WastePay could not close the staff account session.", {
        cause: signOutError,
      });
    }
    return {
      status: "error",
      message: "Use the staff workspace for this account.",
    };
  }

  redirect("/app");
}

export async function signUpCustomer(
  _previousState: CustomerAuthState,
  formData: FormData,
): Promise<CustomerAuthState> {
  const fullName = normalizeText(formData.get("fullName"));
  const phoneNumberInput = normalizeText(formData.get("phoneNumber"));
  const email = normalizeText(formData.get("email")).toLowerCase();
  const password = normalizeText(formData.get("password"));
  const phoneNumber = normalizeCameroonPhoneNumber(phoneNumberInput);

  if (
    !fullName ||
    fullName.length > 120 ||
    !phoneNumber ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    password.length < 8 ||
    password.length > 128
  ) {
    return {
      status: "error",
      message: "Enter a valid name, Cameroon phone number, email, and a password between 8 and 128 characters.",
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error || !data.user) {
    return {
      status: "error",
      message: "Your account could not be created. Check the details or try signing in.",
    };
  }

  const adminClient = createAdminClient();
  const { error: profileError } = await adminClient.from("profiles").upsert({
    id: data.user.id,
    full_name: fullName,
    phone_number: phoneNumber,
    role: "resident",
    is_active: true,
    must_change_password: false,
  });

  if (profileError) {
    const { error: deleteUserError } = await adminClient.auth.admin.deleteUser(
      data.user.id,
    );
    if (deleteUserError) {
      throw new Error(
        "The customer profile could not be saved, and the incomplete account could not be removed.",
        { cause: deleteUserError },
      );
    }
    return {
      status: "error",
      message: "A WastePay account could not be created with those details. Check the phone number or try another email.",
    };
  }

  if (data.session) {
    redirect("/app");
  }

  return {
    status: "success",
    message: "Account created. Check your email to confirm your account, then sign in.",
  };
}

export async function logoutCustomer(): Promise<never> {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error("WastePay could not sign out this account.", { cause: error });
  }
  redirect("/app");
}
