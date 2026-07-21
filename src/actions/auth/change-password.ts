"use server";

import { redirect } from "next/navigation";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export type ChangePasswordState = {
  status: "idle" | "error";
  message: string;
};

function getDashboardPath(role: string): string | null {
  switch (role) {
    case "admin":
      return "/admin/overview";

    case "manager":
      return "/app/manager";

    case "agent":
      return "/app/agent";

    case "driver":
      return "/app/driver";

    default:
      return null;
  }
}

function validatePassword(password: string): string | null {
  if (password.length < 12) {
    return "Your new password must contain at least 12 characters.";
  }

  if (!/[A-Z]/.test(password)) {
    return "Your new password must contain at least one uppercase letter.";
  }

  if (!/[a-z]/.test(password)) {
    return "Your new password must contain at least one lowercase letter.";
  }

  if (!/[0-9]/.test(password)) {
    return "Your new password must contain at least one number.";
  }

  if (!/[^A-Za-z0-9]/.test(password)) {
    return "Your new password must contain at least one symbol.";
  }

  return null;
}

export async function changeTemporaryPassword(
  _previousState: ChangePasswordState,
  formData: FormData,
): Promise<ChangePasswordState> {
  const passwordValue = formData.get("password");
  const confirmationValue = formData.get("confirmPassword");

  const password =
    typeof passwordValue === "string" ? passwordValue : "";

  const confirmation =
    typeof confirmationValue === "string" ? confirmationValue : "";

  const validationMessage = validatePassword(password);

  if (validationMessage) {
    return {
      status: "error",
      message: validationMessage,
    };
  }

  if (password !== confirmation) {
    return {
      status: "error",
      message: "The two password entries do not match.",
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
      message: "Your session has expired. Return to the login page.",
    };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role, is_active, must_change_password")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    return {
      status: "error",
      message: "WastePay could not locate your staff profile.",
    };
  }

  if (!profile.is_active) {
    await supabase.auth.signOut();

    return {
      status: "error",
      message: "This WastePay account is inactive.",
    };
  }

  const dashboardPath = getDashboardPath(profile.role);

  if (!dashboardPath) {
    await supabase.auth.signOut();

    return {
      status: "error",
      message: "This account does not have an operational dashboard.",
    };
  }

  const { error: passwordUpdateError } = await supabase.auth.updateUser({
    password,
  });

  if (passwordUpdateError) {
    return {
      status: "error",
      message:
        "WastePay could not update your password. Choose a different password and try again.",
    };
  }

  const adminClient = createAdminClient();

  const { error: profileUpdateError } = await adminClient
    .from("profiles")
    .update({
      must_change_password: false,
    })
    .eq("id", user.id);

  if (profileUpdateError) {
    return {
      status: "error",
      message:
        "Your password changed, but WastePay could not complete the account activation. Contact the administrator.",
    };
  }

  redirect(dashboardPath);
}