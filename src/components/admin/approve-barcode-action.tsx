"use client";

import { useActionState } from "react";
import { approveBarcode, type ApproveBarcodeState } from "@/actions/admin/approve-barcode";

const initialState: ApproveBarcodeState = { status: "idle", message: "" };

export function ApproveBarcodeAction({ barcodeNumber }: { barcodeNumber: string }) {
  const [state, formAction] = useActionState(approveBarcode, initialState);
  return (
    <form action={formAction} className="mt-5">
      <input type="hidden" name="barcodeNumber" value={barcodeNumber} />
      <button type="submit" className="min-h-11 rounded-2xl bg-emerald-400 px-5 py-3 text-xs font-black uppercase tracking-[0.16em] text-slate-950">
        Approve barcode
      </button>
      {state.status !== "idle" ? <p role="status" className={`mt-3 text-sm ${state.status === "success" ? "text-emerald-300" : "text-red-300"}`}>{state.message}</p> : null}
    </form>
  );
}
