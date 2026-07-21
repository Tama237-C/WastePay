"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";

import {
  assignCollectionDriver,
  type AssignCollectionDriverState,
} from "@/actions/admin/assign-collection-driver";

type DriverOption = {
  id: string;
  fullName: string;
  phoneNumber: string | null;
  locationZone: string | null;
};

type AssignCollectionDriverProps = {
  requestId: string;
  drivers: DriverOption[];
};

const initialState: AssignCollectionDriverState = {
  status: "idle",
  message: "",
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="flex min-h-12 w-full items-center justify-center rounded-2xl border border-sky-300/20 bg-sky-400 px-5 py-3 text-xs font-black uppercase tracking-[0.17em] text-slate-950 shadow-xl shadow-sky-500/10 transition-all duration-300 hover:-translate-y-1 hover:bg-sky-300 focus:outline-none focus:ring-4 focus:ring-sky-400/15 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
    >
      {pending ? "Assigning driver" : "Confirm driver assignment"}
    </button>
  );
}

export function AssignCollectionDriver({
  requestId,
  drivers,
}: AssignCollectionDriverProps) {
  const [isOpen, setIsOpen] = useState(false);

  const [state, formAction] = useActionState(
    assignCollectionDriver,
    initialState,
  );

  function closePanel() {
    setIsOpen(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="min-h-11 w-full rounded-2xl border border-sky-400/20 bg-sky-400/[0.08] px-5 py-3 text-xs font-black uppercase tracking-[0.17em] text-sky-200 transition-all duration-300 hover:-translate-y-1 hover:border-sky-400/35 hover:bg-sky-400/15 focus:outline-none focus:ring-4 focus:ring-sky-400/10"
      >
        Assign pickup driver
      </button>

      {isOpen ? (
        <div className="fixed inset-0 z-[9999] overflow-y-auto bg-slate-950/90 px-4 py-6 backdrop-blur-md sm:px-6">
          <button
            type="button"
            aria-label="Close driver assignment"
            onClick={closePanel}
            className="absolute inset-0 cursor-default"
          />

          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby={`assign-driver-${requestId}`}
            className="relative mx-auto w-full max-w-2xl rounded-[2rem] border border-white/10 bg-slate-950 shadow-[0_40px_120px_rgba(0,0,0,0.7)]"
          >
            <header className="flex items-start justify-between gap-6 border-b border-white/10 px-6 py-6 sm:px-8">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.27em] text-sky-400">
                  Logistics dispatch
                </p>

                <h2
                  id={`assign-driver-${requestId}`}
                  className="mt-3 text-3xl font-black tracking-[-0.04em] text-white"
                >
                  Assign pickup driver
                </h2>

                <p className="mt-3 max-w-xl text-sm font-light leading-6 text-slate-400">
                  Select an active WastePay driver to execute this approved
                  collection request.
                </p>
              </div>

              <button
                type="button"
                onClick={closePanel}
                aria-label="Close"
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-2xl font-light text-slate-400 transition-all duration-300 hover:border-red-400/30 hover:bg-red-400/10 hover:text-red-200"
              >
                ×
              </button>
            </header>

            <form action={formAction} className="space-y-7 p-6 sm:p-8">
              <input type="hidden" name="requestId" value={requestId} />

              <div>
                <label
                  htmlFor={`driver-${requestId}`}
                  className="text-xs font-black uppercase tracking-[0.2em] text-slate-500"
                >
                  Active WastePay driver
                </label>

                <select
                  id={`driver-${requestId}`}
                  name="driverId"
                  required
                  defaultValue=""
                  className="mt-3 min-h-14 w-full rounded-2xl border border-white/10 bg-slate-900 px-5 py-4 text-base text-white outline-none transition-all focus:border-sky-400/50 focus:ring-4 focus:ring-sky-400/10"
                >
                  <option value="" disabled>
                    Select a pickup driver
                  </option>

                  {drivers.map((driver) => (
                    <option key={driver.id} value={driver.id}>
                      {driver.fullName}
                      {driver.locationZone
                        ? ` — ${driver.locationZone}`
                        : ""}
                    </option>
                  ))}
                </select>

                {drivers.length === 0 ? (
                  <div className="mt-4 rounded-2xl border border-amber-400/20 bg-amber-400/[0.08] p-4">
                    <p className="text-sm leading-6 text-amber-200">
                      No active driver account exists yet. Create a Pickup
                      Driver from Staff Management before dispatching this
                      request.
                    </p>
                  </div>
                ) : null}
              </div>

              <SubmitButton />

              {state.status !== "idle" ? (
                <div
                  role="status"
                  className={`rounded-2xl border p-5 ${
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

                  {state.status === "success" ? (
                    <button
                      type="button"
                      onClick={closePanel}
                      className="mt-4 min-h-11 rounded-2xl border border-white/10 bg-white/[0.05] px-5 py-3 text-xs font-black uppercase tracking-[0.17em] text-slate-300 transition-all hover:border-white/20 hover:bg-white/[0.08]"
                    >
                      Close assignment
                    </button>
                  ) : null}
                </div>
              ) : null}
            </form>
          </section>
        </div>
      ) : null}
    </>
  );
}