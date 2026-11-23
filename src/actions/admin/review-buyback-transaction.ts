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
    return { status: "error", message: "Only an active depot manager can review buyback drafts." };
  }
  if (manager.must_change_password) {
    return {
      status: "error",
      message: "Change your temporary password before reviewing buyback drafts.",
    };
  }
  if (intent === "reject" && (reason.length < 5 || reason.length > 500)) {
    return { status: "error", message: "Enter a rejection reason between 5 and 500 characters." };
  }

  const adminClient = createAdminClient();
  const { data: transaction, error: transactionError } = await adminClient
    .from("transactions")
    .select("id, status, depot_id")
    .eq("id", id)
    .maybeSingle();
  if (transactionError) {
    console.error("ECOLOGIX could not load the buyback draft.", {
      code: transactionError.code,
      message: transactionError.message,
      transactionId: id,
    });
    return {
      status: "error",
      message: `ECOLOGIX could not verify this buyback draft${transactionError.code ? ` (error ${transactionError.code})` : ""}.`,
    };
  }
  if (!transaction || transaction.depot_id !== manager.assigned_depot_id) {
    return { status: "error", message: "This transaction is not assigned to your depot." };
  }
  if (transaction.status !== "DRAFT") {
    return { status: "error", message: "This transaction has already been reviewed." };
  }

  const nextStatus = intent === "approve" ? "APPROVED" : "REJECTED";
  const { data: updatedTransactions, error: updateError } = await adminClient
    .from("transactions")
    .update({
      status: nextStatus,
      approved_by: intent === "approve" ? user.id : null,
      approved_at: intent === "approve" ? new Date().toISOString() : null,
      rejection_reason: intent === "reject" ? reason : null,
    })
    .eq("id", id)
    .eq("depot_id", manager.assigned_depot_id)
    .eq("status", "DRAFT")
    .select("id");
  if (updateError) {
    console.error("ECOLOGIX could not review the buyback transaction.", {
      code: updateError.code,
      message: updateError.message,
      transactionId: id,
    });
    return {
      status: "error",
      message: `ECOLOGIX could not update this transaction${updateError.code ? ` (error ${updateError.code})` : ""}.`,
    };
  }
  if (!updatedTransactions || updatedTransactions.length !== 1) {
    return {
      status: "error",
      message:
        "This transaction changed before it could be reviewed. Refresh the manager workspace and try again.",
    };
  }

  revalidatePath("/app/manager");
  revalidatePath("/app/agent");
  revalidatePath("/app/collector");
  revalidatePath("/admin/transactions");
  revalidatePath("/admin/overview");
  return {
    status: "success",
    message: intent === "approve" ? "Buyback transaction approved." : "Buyback transaction rejected.",
  };
}
