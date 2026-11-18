"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import {
  updateDriverPickup,
  type UpdateDriverPickupState,
} from "@/actions/auth/update-driver-pickup";
import { CompressedImageInput } from "@/components/shared/compressed-image-input";

type PickupStatusActionsProps = {
  requestId: string;
  requestStatus: "ASSIGNED" | "IN_TRANSIT";
};

const initialState: UpdateDriverPickupState = {
  status: "idle",
  message: "",
};

function PickupActionButton({
  intent,
}: {
  intent: "start" | "collected";
}) {
  const { pending } = useFormStatus();

  const isStartAction = intent === "start";

  return (
    <button
      type="submit"
      name="intent"
      value={intent}
      disabled={pending}
      className={`flex min-h-14 w-full items-center justify-center rounded-2xl border px-6 py-4 text-xs font-black uppercase tracking-[0.18em] shadow-2xl transition-all duration-300 ease-out hover:-translate-y-1 focus:outline-none focus:ring-4 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 ${
        isStartAction
          ? "border-sky-300/20 bg-sky-400 text-slate-950 shadow-sky-500/20 hover:bg-sky-300 focus:ring-sky-400/20"
          : "border-emerald-300/20 bg-emerald-400 text-slate-950 shadow-emerald-500/20 hover:bg-emerald-300 focus:ring-emerald-400/20"
      }`}
    >
      {pending
        ? "Updating pickup"
        : isStartAction
          ? "Start pickup route"
          : "Confirm plastic collected"}
    </button>
  );
}

export function PickupStatusActions({
  requestId,
  requestStatus,
}: PickupStatusActionsProps) {
  const [state, formAction] = useActionState(
    updateDriverPickup,
    initialState,
  );
  const [failureState, failureAction] = useActionState(
    updateDriverPickup,
    initialState,
  );

  return (
    <>
      <form action={formAction} className="mt-6">
        <input type="hidden" name="requestId" value={requestId} />

        {requestStatus === "IN_TRANSIT" ? (
          <div className="mt-5 space-y-4 rounded-3xl border border-emerald-400/15 bg-emerald-400/[0.045] p-4">
            <div><p className="text-[0.62rem] font-black uppercase tracking-[0.2em] text-emerald-300">Collection proof</p><p className="mt-1 text-xs leading-5 text-slate-500">Record the measured weight and one clear photo before handoff.</p></div>
            <label className="block text-xs font-black uppercase tracking-[0.16em] text-slate-400">Collected weight (KG)<input name="driverReportedWeightKg" type="number" inputMode="decimal" min="0.01" max="50000" step="0.01" required placeholder="0.00" className="mt-2 block min-h-14 w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 text-white outline-none focus:border-emerald-400/50" /></label>
            <label className="block text-xs font-black uppercase tracking-[0.16em] text-slate-400">Collection photo<CompressedImageInput id={`driver-photo-${requestId}`} name="collectionPhoto" required className="mt-2 block w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-slate-300" /></label>
          </div>
        ) : null}
        <PickupActionButton intent={requestStatus === "ASSIGNED" ? "start" : "collected"} />

        {state.status !== "idle" ? (
          <div
          role="status"
          className={`mt-4 rounded-2xl border p-4 ${
            state.status === "success"
              ? "border-emerald-400/20 bg-emerald-400/[0.08]"
              : "border-red-400/20 bg-red-400/[0.08]"
          }`}
        >
          <p
            className={`text-sm font-medium leading-6 ${
              state.status === "success"
                ? "text-emerald-200"
                : "text-red-200"
            }`}
          >
            {state.message}
          </p>
          </div>
        ) : null}
      </form>

      <form
        action={failureAction}
        className="mt-4 rounded-2xl border border-red-400/15 bg-red-400/[0.05] p-4"
      >
        <input type="hidden" name="requestId" value={requestId} />
        <input type="hidden" name="intent" value="unreachable" />
        <label
          htmlFor={`failure-reason-${requestId}`}
          className="text-xs font-black uppercase tracking-[0.18em] text-red-300/70"
        >
          Pickup could not be completed
        </label>
        <textarea
          id={`failure-reason-${requestId}`}
          name="failureReason"
          required
          minLength={5}
          maxLength={500}
          rows={3}
          placeholder="Resident unavailable, incorrect location, unsafe conditions..."
          className="mt-3 w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-700 focus:border-red-400/40"
        />
        <button
          type="submit"
          className="mt-3 min-h-11 w-full rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-xs font-black uppercase tracking-[0.16em] text-red-200 hover:bg-red-400/15"
        >
          Mark customer unreachable
        </button>
        {failureState.status !== "idle" ? (
          <p
            role="status"
            className={`mt-3 text-sm ${
              failureState.status === "success"
                ? "text-emerald-300"
                : "text-red-300"
            }`}
          >
            {failureState.message}
          </p>
        ) : null}
      </form>
    </>
  );
}
