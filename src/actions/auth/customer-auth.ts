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

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, is_active")
    .eq("id", data.user.id)
    .maybeSingle();

  if (!profile || !profile.is_active) {
    await supabase.auth.signOut();
    return {
      status: "error",
      message: "This account is inactive or not available.",
    };
  }

  if (profile.role !== "resident") {
    await supabase.auth.signOut();
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
  const phoneNumber = normalizeText(formData.get("phoneNumber"));
  const email = normalizeText(formData.get("email")).toLowerCase();
  const password = normalizeText(formData.get("password"));

  if (!fullName || !phoneNumber || !email || password.length < 8) {
    return {
      status: "error",
      message: "Enter your name, phone number, email, and a password of at least 8 characters.",
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
      message: error?.message || "Your account could not be created.",
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
    await supabase.auth.signOut();
    return {
      status: "error",
      message: "Your account was created, but your WastePay profile could not be saved.",
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
  await supabase.auth.signOut();
  redirect("/app");
}
