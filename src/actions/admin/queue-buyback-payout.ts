"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export type QueuePayoutState = {
  status: "idle" | "error" | "success";
  message: string;
};

export async function queueBuybackPayout(
  _previousState: QueuePayoutState,
  formData: FormData,
): Promise<QueuePayoutState> {
  const transactionId = formData.get("transactionId");
  const id = typeof transactionId === "string" ? transactionId.trim() : "";
  if (!id) return { status: "error", message: "Transaction could not be identified." };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { status: "error", message: "Your session has expired. Sign in again." };
  const { data: manager } = await supabase
    .from("profiles")
    .select("role, is_active, assigned_depot_id")
    .eq("id", user.id)
    .single();
  if (!manager || manager.role !== "manager" || !manager.is_active || !manager.assigned_depot_id) {
    return { status: "error", message: "Only an active depot manager can queue a payout." };
  }

  const adminClient = createAdminClient();
  const { data: systemSettings } = await adminClient
    .from("system_settings")
    .select("payout_queue_enabled")
    .eq("id", true)
    .maybeSingle();
  if (systemSettings && !systemSettings.payout_queue_enabled) {
    return {
      status: "error",
      message: "The payout queue is temporarily disabled in system settings.",
    };
  }

  const { data: transaction } = await adminClient
    .from("transactions")
    .select("id, status, depot_id")
    .eq("id", id)
    .maybeSingle();
  if (!transaction || transaction.depot_id !== manager.assigned_depot_id) {
    return { status: "error", message: "This transaction is not assigned to your depot." };
  }
  if (transaction.status !== "APPROVED") {
    return { status: "error", message: "Only approved transactions can be queued for payout." };
  }

  const { error } = await adminClient
    .from("transactions")
    .update({ status: "PAYOUT_PROCESSING" })
    .eq("id", id)
    .eq("status", "APPROVED");
  if (error) return { status: "error", message: "WastePay could not queue this payout." };

  revalidatePath("/app/manager");
  revalidatePath("/app/collector");
  return { status: "success", message: "Payout queued. Telecom settlement is not connected yet." };
}
