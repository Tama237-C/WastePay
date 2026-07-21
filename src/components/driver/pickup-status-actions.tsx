"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import {
  updateDriverPickup,
  type UpdateDriverPickupState,
} from "@/actions/auth/update-driver-pickup";

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

  return (
    <form action={formAction} className="mt-6">
      <input type="hidden" name="requestId" value={requestId} />

      <PickupActionButton
        intent={
          requestStatus === "ASSIGNED"
            ? "start"
            : "collected"
        }
      />

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
  );
}