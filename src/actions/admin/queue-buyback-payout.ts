"use server";

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
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) {
    return { status: "error", message: "Your session has expired. Sign in again." };
  }
  const { data: manager, error: managerError } = await supabase
    .from("profiles")
    .select("role, is_active, assigned_depot_id, must_change_password")
    .eq("id", user.id)
    .single();
  if (managerError) {
    console.error("ECOLOGIX could not load the depot manager profile.", {
      code: managerError.code,
      message: managerError.message,
    });
    return {
      status: "error",
      message: `ECOLOGIX could not verify your manager account${managerError.code ? ` (error ${managerError.code})` : ""}.`,
    };
  }
  if (!manager || manager.role !== "manager" || !manager.is_active || !manager.assigned_depot_id) {
    return { status: "error", message: "Only an active depot manager can queue a payout." };
  }
  if (manager.must_change_password) {
    return {
      status: "error",
      message: "Change your temporary password before reviewing payout setup.",
    };
  }

  const adminClient = createAdminClient();
  const { data: systemSettings, error: settingsError } = await adminClient
    .from("system_settings")
    .select("payout_queue_enabled")
    .eq("id", true)
    .maybeSingle();
  if (settingsError) {
    console.error("ECOLOGIX could not load payout settings.", {
      code: settingsError.code,
      message: settingsError.message,
    });
    return {
      status: "error",
      message: `ECOLOGIX could not verify payout settings${settingsError.code ? ` (error ${settingsError.code})` : ""}. No payout was sent.`,
    };
  }
  if (!systemSettings) {
    return {
      status: "error",
      message: "Payout settings are missing. No payout was sent; contact an administrator.",
    };
  }
  if (!systemSettings.payout_queue_enabled) {
    return {
      status: "error",
      message: "The payout queue is disabled in system settings. No payout was sent.",
    };
  }

  const { data: transaction, error: transactionError } = await adminClient
    .from("transactions")
    .select("id, status, depot_id")
    .eq("id", id)
    .maybeSingle();
  if (transactionError) {
    console.error("ECOLOGIX could not load the approved buyback.", {
      code: transactionError.code,
      message: transactionError.message,
      transactionId: id,
    });
    return {
      status: "error",
      message: `ECOLOGIX could not verify this approved transaction${transactionError.code ? ` (error ${transactionError.code})` : ""}. No payout was sent.`,
    };
  }
  if (!transaction || transaction.depot_id !== manager.assigned_depot_id) {
    return { status: "error", message: "This transaction is not assigned to your depot." };
  }
  if (transaction.status !== "APPROVED") {
    return { status: "error", message: "Only approved transactions can be queued for payout." };
  }

  return {
    status: "error",
    message:
      "Mobile Money settlement is not connected yet. No payout was sent, and this transaction remains approved.",
  };
}
