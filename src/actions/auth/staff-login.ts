"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export type StaffLoginState = {
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

export async function signInStaff(
  _previousState: StaffLoginState,
  formData: FormData,
): Promise<StaffLoginState> {
  const emailValue = formData.get("email");
  const passwordValue = formData.get("password");

  const email =
    typeof emailValue === "string" ? emailValue.trim().toLowerCase() : "";

  const password =
    typeof passwordValue === "string" ? passwordValue : "";

  if (!email) {
    return {
      message: "Enter your WastePay staff email address.",
    };
  }

  if (!password) {
    return {
      message: "Enter your WastePay account password.",
    };
  }

  const supabase = await createClient();

  const { data: signInData, error: signInError } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    });

  if (signInError || !signInData.user) {
    return {
      message:
        "The email address or password is incorrect. Check both fields and try again.",
    };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role, is_active, must_change_password")
    .eq("id", signInData.user.id)
    .single();

  if (profileError || !profile) {
    await supabase.auth.signOut();

    return {
      message:
        "WastePay could not find a staff profile for this account. Contact the system administrator.",
    };
  }

  if (!profile.is_active) {
    await supabase.auth.signOut();

    return {
      message:
        "This WastePay account is inactive. Contact the system administrator.",
    };
  }

  const dashboardPath = getDashboardPath(profile.role);

  if (!dashboardPath) {
    await supabase.auth.signOut();

    return {
      message:
        "This login page is reserved for WastePay operational staff and administrators.",
    };
  }

  if (profile.must_change_password) {
    redirect("/app/change-password");
  }

  redirect(dashboardPath);
}