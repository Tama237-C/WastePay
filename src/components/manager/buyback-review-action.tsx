"use client";

import { useActionState } from "react";
import { reviewBuybackTransaction, type ReviewBuybackState } from "@/actions/admin/review-buyback-transaction";

const initialState: ReviewBuybackState = { status: "idle", message: "" };

export function BuybackReviewAction({ transactionId }: { transactionId: string }) {
  const [state, formAction] = useActionState(reviewBuybackTransaction, initialState);
  return (
    <form action={formAction} className="mt-5 space-y-3">
      <input type="hidden" name="transactionId" value={transactionId} />
      <textarea name="rejectionReason" maxLength={500} rows={2} placeholder="Optional reason if rejecting" className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none focus:border-red-400/40" />
      <div className="grid gap-3 sm:grid-cols-2">
        <button name="intent" value="approve" className="min-h-11 rounded-2xl bg-emerald-400 px-4 py-3 text-xs font-black uppercase tracking-[0.16em] text-slate-950">
          Approve draft
        </button>
        <button name="intent" value="reject" className="min-h-11 rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-xs font-black uppercase tracking-[0.16em] text-red-200">
          Reject draft
        </button>
      </div>
      {state.status !== "idle" ? <p role="status" className={`text-sm ${state.status === "success" ? "text-emerald-300" : "text-red-300"}`}>{state.message}</p> : null}
    </form>
  );
}
