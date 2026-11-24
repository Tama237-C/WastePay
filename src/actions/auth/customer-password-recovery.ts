"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export type CustomerPasswordRecoveryState = {
  status: "idle" | "error" | "success";
  message: string;
};

function getCustomerRecoveryRedirectUrl(): string | null {
  const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const siteUrl =
    configuredSiteUrl ||
    (process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://ecologix.netlify.app");

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
      "/auth/callback?flow=customer",
      parsedSiteUrl.origin,
    ).toString();
  } catch {
    return null;
  }
}

export async function requestCustomerPasswordRecovery(
  _previousState: CustomerPasswordRecoveryState,
  formData: FormData,
): Promise<CustomerPasswordRecoveryState> {
  const emailValue = formData.get("email");
  const email =
    typeof emailValue === "string" ? emailValue.trim().toLowerCase() : "";

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { status: "error", message: "Enter a valid email address." };
  }

  const redirectTo = getCustomerRecoveryRedirectUrl();
  if (!redirectTo) {
    return {
      status: "error",
      message:
        "Account recovery is not configured for this site. Contact ECOLOGIX support.",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo,
  });

  if (error) {
    console.error("ECOLOGIX could not request customer password recovery.", {
      code: error.code,
      message: error.message,
    });
    return {
      status: "error",
      message:
        "ECOLOGIX could not send the recovery request. Check your connection and try again.",
    };
  }

  return {
    status: "success",
    message:
      "If an ECOLOGIX account uses that email, a recovery link has been sent. Check your inbox and spam folder.",
  };
}

export async function updateRecoveredCustomerPassword(
  _previousState: CustomerPasswordRecoveryState,
  formData: FormData,
): Promise<CustomerPasswordRecoveryState> {
  const passwordValue = formData.get("password");
  const confirmationValue = formData.get("confirmPassword");
  const password = typeof passwordValue === "string" ? passwordValue : "";
  const confirmation =
    typeof confirmationValue === "string" ? confirmationValue : "";

  if (password.length < 8 || password.length > 128) {
    return {
      status: "error",
      message: "Choose a password between 8 and 128 characters.",
    };
  }

  if (password !== confirmation) {
    return { status: "error", message: "The passwords do not match." };
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      status: "error",
      message:
        "This recovery link is invalid or expired. Request a new recovery link.",
    };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role, is_active")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    console.error("ECOLOGIX could not verify a customer recovery account.", {
      code: profileError.code,
      message: profileError.message,
    });
    return {
      status: "error",
      message: "ECOLOGIX could not verify this account. Try the recovery link again.",
    };
  }

  if (!profile || profile.role !== "resident" || !profile.is_active) {
    return {
      status: "error",
      message:
        "This recovery link is not valid for an active general ECOLOGIX account.",
    };
  }

  const { error: updateError } = await supabase.auth.updateUser({ password });
  if (updateError) {
    console.error("ECOLOGIX could not update a customer password.", {
      code: updateError.code,
      message: updateError.message,
    });
    return {
      status: "error",
      message: "ECOLOGIX could not update the password. Choose another and try again.",
    };
  }

  redirect("/app");
}
