"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export type ReviewBuybackState = {
  status: "idle" | "error" | "success";
  message: string;
};

export async function reviewBuybackTransaction(
  _previousState: ReviewBuybackState,
  formData: FormData,
): Promise<ReviewBuybackState> {
  const transactionId = formData.get("transactionId");
  const intent = formData.get("intent");
  const rejectionReason = formData.get("rejectionReason");
  const id = typeof transactionId === "string" ? transactionId.trim() : "";
  const reason = typeof rejectionReason === "string" ? rejectionReason.trim() : "";
  if (!id || (intent !== "approve" && intent !== "reject")) {
    return { status: "error", message: "Choose a valid transaction action." };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { status: "error", message: "Your session has expired. Sign in again." };
  const { data: manager } = await supabase
    .from("profiles")
    .select("role, is_active, assigned_depot_id")
    .eq("id", user.id)
    .single();
  if (!manager || manager.role !== "manager" || !manager.is_active || !manager.assigned_depot_id) {
    return { status: "error", message: "Only an active depot manager can review buyback drafts." };
  }
  if (intent === "reject" && (reason.length < 5 || reason.length > 500)) {
    return { status: "error", message: "Enter a rejection reason between 5 and 500 characters." };
  }

  const adminClient = createAdminClient();
  const { data: transaction } = await adminClient
    .from("transactions")
    .select("id, status, depot_id")
    .eq("id", id)
    .maybeSingle();
  if (!transaction || transaction.depot_id !== manager.assigned_depot_id) {
    return { status: "error", message: "This transaction is not assigned to your depot." };
  }
  if (transaction.status !== "DRAFT") {
    return { status: "error", message: "This transaction has already been reviewed." };
  }

  const nextStatus = intent === "approve" ? "APPROVED" : "REJECTED";
  const { error } = await adminClient
    .from("transactions")
    .update({
      status: nextStatus,
      manager_profile_id: user.id,
      manager_approved_at: intent === "approve" ? new Date().toISOString() : null,
      rejection_reason: intent === "reject" ? reason : null,
    })
    .eq("id", id)
    .eq("status", "DRAFT");
  if (error) return { status: "error", message: "WastePay could not update this transaction." };

  revalidatePath("/app/manager");
  revalidatePath("/app/agent");
  revalidatePath("/app/collector");
  return {
    status: "success",
    message: intent === "approve" ? "Buyback transaction approved." : "Buyback transaction rejected.",
  };
}
