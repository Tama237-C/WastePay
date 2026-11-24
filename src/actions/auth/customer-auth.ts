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
  const identifier = normalizeText(formData.get("email"));
  const password = normalizeText(formData.get("password"));

  if (!identifier || !password) {
    return {
      status: "error",
      message: "Enter your phone number or email, and password.",
    };
  }

  const supabase = await createClient();
  let email = identifier.toLowerCase();

  if (!identifier.includes("@")) {
    const phoneNumber = normalizeCameroonPhoneNumber(identifier);
    if (!phoneNumber) {
      return {
        status: "error",
        message: "Enter a valid email address or Cameroon phone number.",
      };
    }

    const adminClient = createAdminClient();
    const { data: profile, error: profileLookupError } = await adminClient
      .from("profiles")
      .select("id")
      .eq("phone_number", phoneNumber)
      .maybeSingle();

    if (profileLookupError) {
      console.error("ECOLOGIX could not look up a customer sign-in number.", {
        code: profileLookupError.code,
        message: profileLookupError.message,
      });
      return {
        status: "error",
        message: "The phone number or password is incorrect.",
      };
    }

    if (!profile) {
      return {
        status: "error",
        message: "The phone number or password is incorrect.",
      };
    }

    const { data: authUser, error: authUserError } =
      await adminClient.auth.admin.getUserById(profile.id);
    email = authUserError ? "" : authUser.user.email ?? "";
  }

  if (!email) {
    return {
      status: "error",
      message: "The phone number or password is incorrect.",
    };
  }

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
      throw new Error("ECOLOGIX could not close the unverified sign-in session.", {
        cause: signOutError,
      });
    }
    throw new Error("ECOLOGIX could not verify the customer account.", {
      cause: profileError,
    });
  }

  if (!profile || !profile.is_active) {
    const { error: signOutError } = await supabase.auth.signOut();
    if (signOutError) {
      throw new Error("ECOLOGIX could not close the inactive account session.", {
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
      throw new Error("ECOLOGIX could not close the staff account session.", {
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
  const confirmPassword = normalizeText(formData.get("confirmPassword"));
  const acceptedTerms = formData.get("acceptTerms") === "on";
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

  if (password !== confirmPassword) {
    return { status: "error", message: "The passwords do not match." };
  }

  if (!acceptedTerms) {
    return {
      status: "error",
      message: "Agree to the ECOLOGIX Terms and Privacy Policy to continue.",
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    console.error("ECOLOGIX customer sign-up failed.", {
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
    console.error("ECOLOGIX sign-up returned no user and no error.");
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
    console.error("ECOLOGIX could not save the new customer profile.", {
      code: profileError.code,
      message: profileError.message,
    });
    const profileFailureMessage =
      describeCustomerProfileSaveError(profileError);
    const { error: deleteUserError } = await adminClient.auth.admin.deleteUser(
      data.user.id,
    );
    if (deleteUserError) {
      console.error("ECOLOGIX could not remove the incomplete customer login.", {
        code: deleteUserError.code,
        message: deleteUserError.message,
      });
      return {
        status: "error",
        message: `${profileFailureMessage} ECOLOGIX also could not remove the incomplete sign-in (cleanup error ${deleteUserError.code ?? "unknown"}). Contact support before trying again.`,
      };
    }
    const { error: signOutError } = await supabase.auth.signOut();
    if (signOutError) {
      console.error("ECOLOGIX could not close the incomplete customer session.", {
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

function getCustomerOAuthRedirectUrl(): string | null {
  const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const siteUrl =
    configuredSiteUrl ||
    (process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://wastepay.netlify.app");

  try {
    const parsedSiteUrl = new URL(siteUrl);
    if (
      (parsedSiteUrl.protocol !== "http:" &&
        parsedSiteUrl.protocol !== "https:") ||
      parsedSiteUrl.username ||
      parsedSiteUrl.password
    ) {
      return null;
    }

    return new URL(
      "/auth/callback?flow=customer_google",
      parsedSiteUrl.origin,
    ).toString();
  } catch {
    return null;
  }
}

export async function signInCustomerWithGoogle(
  _previousState: CustomerAuthState,
  _formData: FormData,
): Promise<CustomerAuthState> {
  void _previousState;
  void _formData;

  const redirectTo = getCustomerOAuthRedirectUrl();
  if (!redirectTo) {
    return {
      status: "error",
      message: "Google sign-in is not configured for this ECOLOGIX site.",
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo },
  });

  if (error || !data.url) {
    console.error("ECOLOGIX could not start Google customer sign-in.", {
      code: error?.code,
      message: error?.message,
    });
    return {
      status: "error",
      message:
        "Google sign-in is unavailable. Try your phone number or email and password.",
    };
  }

  redirect(data.url);
}

export async function logoutCustomer(): Promise<never> {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error("ECOLOGIX could not sign out this account.", { cause: error });
  }
  redirect("/app/account");
}
