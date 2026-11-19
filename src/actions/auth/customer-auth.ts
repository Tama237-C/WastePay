"use server";

import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import {
  describeCustomerProfileSaveError,
  describeCustomerSignupError,
} from "@/actions/auth/customer-signup-errors";

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

  if (!fullName || fullName.length > 120) {
    return {
      status: "error",
      message: "Enter your full name using no more than 120 characters.",
    };
  }

  if (!phoneNumber) {
    return {
      status: "error",
      message: "Enter a valid Cameroon phone number, such as +2376XXXXXXXX.",
    };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return {
      status: "error",
      message: "Enter a valid email address.",
    };
  }

  if (password.length < 8 || password.length > 128) {
    return {
      status: "error",
      message: "Your password must be between 8 and 128 characters.",
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    console.error("WastePay customer sign-up failed.", {
      code: error.code,
      status: error.status,
      message: error.message,
    });
    return {
      status: "error",
      message: describeCustomerSignupError(error),
    };
  }

  if (!data.user) {
    console.error("WastePay sign-up returned no user and no error.");
    return {
      status: "error",
      message: describeCustomerSignupError({
        message: "The sign-up service did not return a user record.",
      }),
    };
  }

  if (data.user.identities && data.user.identities.length === 0) {
    return {
      status: "error",
      message:
        "An account with this email already exists. Choose Sign in, or use a different email address.",
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
    console.error("WastePay could not save the new customer profile.", {
      code: profileError.code,
      message: profileError.message,
    });
    const profileFailureMessage =
      describeCustomerProfileSaveError(profileError);
    const { error: deleteUserError } = await adminClient.auth.admin.deleteUser(
      data.user.id,
    );
    if (deleteUserError) {
      console.error("WastePay could not remove the incomplete customer login.", {
        code: deleteUserError.code,
        message: deleteUserError.message,
      });
      return {
        status: "error",
        message: `${profileFailureMessage} WastePay also could not remove the incomplete sign-in (cleanup error ${deleteUserError.code ?? "unknown"}). Contact support before trying again.`,
      };
    }
    const { error: signOutError } = await supabase.auth.signOut();
    if (signOutError) {
      console.error("WastePay could not close the incomplete customer session.", {
        code: signOutError.code,
        message: signOutError.message,
      });
      return {
        status: "error",
        message: `${profileFailureMessage} The incomplete account was removed, but the sign-in session could not be closed (error ${signOutError.code ?? "unknown"}). Refresh the page and contact support if the problem continues.`,
      };
    }
    return {
      status: "error",
      message: profileFailureMessage,
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
