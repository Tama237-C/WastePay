"use server";

import { redirect } from "next/navigation";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { getStaffPasswordValidationError } from "@/lib/auth/staff-password-validation";

export type StaffPasswordRecoveryState = {
  status: "idle" | "error" | "success";
  message: string;
};

export type StaffPasswordUpdateState = {
  status: "idle" | "error";
  message: string;
};

function getRecoveryRedirectUrl(): string | null {
  const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const siteUrl =
    configuredSiteUrl ||
    (process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://ecologix.netlify.app");

  if (!siteUrl) {
    return null;
  }

  let parsedSiteUrl: URL;

  try {
    parsedSiteUrl = new URL(siteUrl);
  } catch {
    return null;
  }

  if (
    (parsedSiteUrl.protocol !== "http:" &&
      parsedSiteUrl.protocol !== "https:") ||
    parsedSiteUrl.username ||
    parsedSiteUrl.password
  ) {
    return null;
  }

  return new URL("/auth/callback", parsedSiteUrl.origin).toString();
}

function getStaffDashboardPath(role: string): string | null {
  switch (role) {
    case "admin":
      return "/admin/overview";
    case "manager":
      return "/app/manager";
    case "agent":
      return "/app/agent";
    case "driver":
      return "/app/driver";
    case "collector":
      return "/app/collector";
    default:
      return null;
  }
}

export async function requestStaffPasswordRecovery(
  _previousState: StaffPasswordRecoveryState,
  formData: FormData,
): Promise<StaffPasswordRecoveryState> {
  const emailValue = formData.get("email");
  const email =
    typeof emailValue === "string" ? emailValue.trim().toLowerCase() : "";

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return {
      status: "error",
      message: "Enter a valid ECOLOGIX staff email address.",
    };
  }

  const redirectTo = getRecoveryRedirectUrl();

  if (!redirectTo) {
    console.error("ECOLOGIX staff password recovery has no valid site URL.");
    return {
      status: "error",
      message:
        "Password recovery is not configured for this site. Contact the administrator.",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo,
  });

  if (error) {
    console.error("ECOLOGIX could not send a staff password recovery email.", {
      code: error.code,
      message: error.message,
    });
    return {
      status: "error",
      message:
        "ECOLOGIX could not request a recovery email. Check the Supabase email and redirect settings, then try again.",
    };
  }

  return {
    status: "success",
    message:
      "If an active ECOLOGIX staff account uses that email, a recovery link has been sent. Check the inbox and spam folder.",
  };
}

export async function updateRecoveredStaffPassword(
  _previousState: StaffPasswordUpdateState,
  formData: FormData,
): Promise<StaffPasswordUpdateState> {
  const passwordValue = formData.get("password");
  const confirmationValue = formData.get("confirmPassword");
  const password =
    typeof passwordValue === "string" ? passwordValue : "";
  const confirmation =
    typeof confirmationValue === "string" ? confirmationValue : "";
  const validationError = getStaffPasswordValidationError(
    password,
    confirmation,
  );

  if (validationError) {
    return {
      status: "error",
      message: validationError,
    };
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
    .select("role, is_active, must_change_password")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    console.error("ECOLOGIX could not verify a password recovery account.", {
      code: profileError.code,
      message: profileError.message,
    });
    return {
      status: "error",
      message:
        `ECOLOGIX could not verify this staff account${profileError.code ? ` (error ${profileError.code})` : ""}. Contact the administrator.`,
    };
  }

  const dashboardPath = profile
    ? getStaffDashboardPath(profile.role)
    : null;

  if (!profile || !profile.is_active || !dashboardPath) {
    const { error: signOutError } = await supabase.auth.signOut();

    if (signOutError) {
      throw new Error(
        "ECOLOGIX could not close an unverified password recovery session.",
        { cause: signOutError },
      );
    }

    return {
      status: "error",
      message:
        "This recovery link is not valid for an active ECOLOGIX staff account.",
    };
  }

  const { error: passwordUpdateError } = await supabase.auth.updateUser({
    password,
  });

  if (passwordUpdateError) {
    console.error("ECOLOGIX could not update a recovered staff password.", {
      code: passwordUpdateError.code,
      message: passwordUpdateError.message,
    });
    return {
      status: "error",
      message:
        "ECOLOGIX could not update the password. Choose a different password and try again.",
    };
  }

  if (profile.must_change_password) {
    const adminClient = createAdminClient();
    const { error: profileUpdateError } = await adminClient
      .from("profiles")
      .update({ must_change_password: false })
      .eq("id", user.id);

    if (profileUpdateError) {
      console.error(
        "ECOLOGIX changed a recovered password but could not finish staff activation.",
        {
          code: profileUpdateError.code,
          message: profileUpdateError.message,
        },
      );
      return {
        status: "error",
        message:
          `Your password changed, but ECOLOGIX could not finish activating the account${profileUpdateError.code ? ` (error ${profileUpdateError.code})` : ""}. Contact the administrator.`,
      };
    }
  }

  redirect(dashboardPath);
}
