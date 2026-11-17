"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { completeDepotIntake, type CompleteDepotIntakeState } from "@/actions/auth/complete-depot-intake";
import { CompressedImageInput } from "@/components/shared/compressed-image-input";

const initialState: CompleteDepotIntakeState = { status: "idle", message: "" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="mt-6 min-h-14 w-full rounded-2xl border border-emerald-300/20 bg-emerald-400 px-6 py-4 text-xs font-black uppercase tracking-[0.18em] text-slate-950 shadow-2xl shadow-emerald-500/20 transition-all hover:-translate-y-1 hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-50">
      {pending ? "Completing intake" : "Complete depot intake"}
    </button>
  );
}

export function DepotIntakeAction({ requestId }: { requestId: string }) {
  const [state, formAction] = useActionState(completeDepotIntake, initialState);
  return (
    <form action={formAction} encType="multipart/form-data">
      <input type="hidden" name="requestId" value={requestId} />
      <label
        htmlFor={`actual-weight-${requestId}`}
        className="mt-6 block text-xs font-black uppercase tracking-[0.18em] text-slate-500"
      >
        Verified weight (KG)
      </label>
      <input
        id={`actual-weight-${requestId}`}
        name="actualWeightKg"
        type="number"
        min="0.01"
        max="50000"
        step="0.01"
        required
        placeholder="Enter scale reading"
        className="mt-3 min-h-14 w-full rounded-2xl border border-white/10 bg-slate-900 px-5 py-4 text-base text-white outline-none focus:border-emerald-400/50 focus:ring-4 focus:ring-emerald-400/10"
      />
      <label
        htmlFor={`verification-photo-${requestId}`}
        className="mt-6 block text-xs font-black uppercase tracking-[0.18em] text-slate-500"
      >
        Scale verification photo
      </label>
      <CompressedImageInput id={`verification-photo-${requestId}`} name="verificationPhoto" required className="mt-3 block w-full rounded-2xl border border-white/10 bg-slate-900 px-5 py-4 text-sm text-slate-300 file:mr-4 file:rounded-xl file:border-0 file:bg-emerald-400 file:px-4 file:py-2 file:font-bold file:text-slate-950" />
      <SubmitButton />
      {state.status !== "idle" ? (
        <p role="status" className={`mt-4 rounded-2xl border p-4 text-sm leading-6 ${state.status === "success" ? "border-emerald-400/20 bg-emerald-400/[0.08] text-emerald-200" : "border-red-400/20 bg-red-400/[0.08] text-red-200"}`}>
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
