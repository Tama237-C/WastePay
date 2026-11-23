"use client";

import { useActionState } from "react";
import { queueBuybackPayout, type QueuePayoutState } from "@/actions/admin/queue-buyback-payout";

const initialState: QueuePayoutState = { status: "idle", message: "" };

export function QueuePayoutAction({ transactionId }: { transactionId: string }) {
  const [state, formAction] = useActionState(queueBuybackPayout, initialState);
  return (
    <form action={formAction} className="mt-5">
      <input type="hidden" name="transactionId" value={transactionId} />
      <button type="submit" className="min-h-11 w-full rounded-2xl bg-sky-400 px-4 py-3 text-xs font-black uppercase tracking-[0.16em] text-slate-950">
        Check payout setup
      </button>
      {state.status !== "idle" ? <p role="status" className={`mt-3 text-sm ${state.status === "success" ? "text-emerald-300" : "text-red-300"}`}>{state.message}</p> : null}
    </form>
  );
}
