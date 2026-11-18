"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type UpdateCollectorAccountState = { status: "idle" | "error" | "success"; message: string };

function normalisePhone(value: string): string | null {
  const cleaned = value.replace(/[\s()-]/g, "");
  if (/^\+2376\d{8}$/.test(cleaned)) return cleaned;
  if (/^6\d{8}$/.test(cleaned)) return `+237${cleaned}`;
  return null;
}

export async function updateCollectorAccount(_previous: UpdateCollectorAccountState, formData: FormData): Promise<UpdateCollectorAccountState> {
  const fullName = String(formData.get("fullName") ?? "").trim();
  const phoneNumber = normalisePhone(String(formData.get("phoneNumber") ?? "").trim());
  const provider = String(formData.get("provider") ?? "");
  if (fullName.length < 3 || fullName.length > 120) return { status: "error", message: "Enter your full name." };
  if (!phoneNumber) return { status: "error", message: "Enter a valid Cameroon Mobile Money number." };
  if (provider !== "MTN_MOMO" && provider !== "ORANGE_MONEY") return { status: "error", message: "Choose a supported Mobile Money provider." };
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { status: "error", message: "Your session has ended. Sign in again to update your account." };
  const { error } = await supabase.from("profiles").update({ full_name: fullName, phone_number: phoneNumber, mobile_money_provider: provider }).eq("id", user.id).eq("role", "collector");
  if (error) return { status: "error", message: error.code === "23505" ? "This phone number is already linked to another WastePay account." : "We could not update your account. Try again shortly." };
  revalidatePath("/app/collector");
  return { status: "success", message: "Your payout account has been updated." };
}
