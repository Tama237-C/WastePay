"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { createBuybackTransaction, type CreateBuybackState } from "@/actions/auth/create-buyback-transaction";
import { BarcodeScanner } from "@/components/shared/barcode-scanner";

const initialState: CreateBuybackState = { status: "idle", message: "", receiptCode: null };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="min-h-12 rounded-2xl border border-violet-300/20 bg-violet-400 px-5 py-3 text-xs font-black uppercase tracking-[0.16em] text-slate-950 disabled:opacity-50">
      {pending ? "Creating draft" : "Create buyback draft"}
    </button>
  );
}

export function BuybackIntakeForm() {
  const [state, formAction] = useActionState(createBuybackTransaction, initialState);
  return (
    <section className="rounded-[2rem] border border-violet-400/15 bg-violet-400/[0.05] p-6 shadow-2xl sm:p-8">
      <p className="text-xs font-black uppercase tracking-[0.25em] text-violet-300">Buyback intake</p>
      <h2 className="mt-3 text-2xl font-black text-white">Create a draft transaction</h2>
      <form action={formAction} className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label htmlFor="collectorPhoneNumber" className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">Collector phone</label>
          <input id="collectorPhoneNumber" name="collectorPhoneNumber" type="tel" required placeholder="+2376XXXXXXXX" className="mt-3 min-h-12 w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 text-white outline-none focus:border-violet-400/50" />
        </div>
        <div>
          <label htmlFor="barcodeNumber" className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">Barcode (optional)</label>
          <input id="barcodeNumber" name="barcodeNumber" type="text" placeholder="Scan or enter barcode" className="mt-3 min-h-12 w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 text-white outline-none focus:border-violet-400/50" />
          <BarcodeScanner inputId="barcodeNumber" />
        </div>
        <div>
          <label htmlFor="productName" className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">Product name</label>
          <input id="productName" name="productName" type="text" placeholder="Only for unknown barcode" className="mt-3 min-h-12 w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 text-white outline-none focus:border-violet-400/50" />
        </div>
        <div>
          <label htmlFor="brandName" className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">Brand name</label>
          <input id="brandName" name="brandName" type="text" placeholder="Only for unknown barcode" className="mt-3 min-h-12 w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 text-white outline-none focus:border-violet-400/50" />
        </div>
        <div>
          <label htmlFor="materialType" className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">Material</label>
          <select id="materialType" name="materialType" defaultValue="" required className="mt-3 min-h-12 w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 text-white outline-none focus:border-violet-400/50">
            <option value="" disabled>Select material</option>
            <option value="PET_CLEAR">PET clear</option>
            <option value="PET_COLORED">PET colored</option>
            <option value="HDPE">HDPE</option>
            <option value="PP">PP</option>
          </select>
        </div>
        <div>
          <label htmlFor="weightKg" className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">Weight KG</label>
          <input id="weightKg" name="weightKg" type="number" min="0.01" max="50000" step="0.01" required placeholder="10" className="mt-3 min-h-12 w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 text-white outline-none focus:border-violet-400/50" />
        </div>
        <SubmitButton />
      </form>
      {state.status !== "idle" ? <p role="status" className={`mt-4 text-sm ${state.status === "success" ? "text-emerald-300" : "text-red-300"}`}>{state.message}{state.receiptCode ? ` ${state.receiptCode}` : ""}</p> : null}
    </section>
  );
}
