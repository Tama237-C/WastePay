"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";

import {
  reviewCollectionRequest,
  type ReviewCollectionRequestState,
} from "@/actions/admin/review-collection-request";

type DepotOption = {
  id: string;
  name: string;
  code: string;
  status: string;
};

type CollectionRequestActionsProps = {
  requestId: string;
  depots: DepotOption[];
};

const initialState: ReviewCollectionRequestState = {
  status: "idle",
  message: "",
};

function ApproveButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      name="intent"
      value="approve"
      disabled={pending}
      className="flex min-h-12 w-full items-center justify-center rounded-2xl border border-emerald-300/20 bg-emerald-400 px-5 py-3 text-xs font-black uppercase tracking-[0.17em] text-slate-950 shadow-xl shadow-emerald-500/10 transition-all duration-300 hover:-translate-y-1 hover:bg-emerald-300 focus:outline-none focus:ring-4 focus:ring-emerald-400/15 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
    >
      {pending ? "Processing request" : "Approve and assign"}
    </button>
  );
}

function RejectButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      name="intent"
      value="reject"
      disabled={pending}
      className="flex min-h-12 w-full items-center justify-center rounded-2xl border border-red-400/20 bg-red-400/10 px-5 py-3 text-xs font-black uppercase tracking-[0.17em] text-red-200 transition-all duration-300 hover:-translate-y-1 hover:border-red-400/35 hover:bg-red-400/15 focus:outline-none focus:ring-4 focus:ring-red-400/10 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
    >
      {pending ? "Processing request" : "Reject request"}
    </button>
  );
}

export function CollectionRequestActions({
  requestId,
  depots,
}: CollectionRequestActionsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const [state, formAction] = useActionState(
    reviewCollectionRequest,
    initialState,
  );

  const availableDepots = depots.filter(
    (depot) => depot.status === "active" || depot.status === "planned",
  );

  function closePanel() {
    setIsOpen(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="mt-5 min-h-11 w-full rounded-2xl border border-sky-400/20 bg-sky-400/[0.08] px-5 py-3 text-xs font-black uppercase tracking-[0.17em] text-sky-200 transition-all duration-300 hover:-translate-y-1 hover:border-sky-400/35 hover:bg-sky-400/15 focus:outline-none focus:ring-4 focus:ring-sky-400/10"
      >
        Review request
      </button>

      {isOpen ? (
        <div className="fixed inset-0 z-[9999] overflow-y-auto bg-slate-950/90 px-4 py-6 backdrop-blur-md sm:px-6">
          <button
            type="button"
            aria-label="Close request review"
            onClick={closePanel}
            className="absolute inset-0 cursor-default"
          />

          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby={`review-request-${requestId}`}
            className="relative mx-auto w-full max-w-2xl rounded-[2rem] border border-white/10 bg-slate-950 shadow-[0_40px_120px_rgba(0,0,0,0.7)]"
          >
            <header className="flex items-start justify-between gap-6 border-b border-white/10 px-6 py-6 sm:px-8">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.27em] text-sky-400">
                  Administrative review
                </p>

                <h2
                  id={`review-request-${requestId}`}
                  className="mt-3 text-3xl font-black tracking-[-0.04em] text-white"
                >
                  Review collection request
                </h2>

                <p className="mt-3 max-w-xl text-sm font-light leading-6 text-slate-400">
                  Assign the request to an ECOLOGIX recovery centre or record a
                  clear rejection reason.
                </p>
              </div>

              <button
                type="button"
                onClick={closePanel}
                aria-label="Close"
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-2xl font-light text-slate-400 transition-all duration-300 hover:border-red-400/30 hover:bg-red-400/10 hover:text-red-200"
              >
                Ã—
              </button>
            </header>

            <form action={formAction} className="space-y-7 p-6 sm:p-8">
              <input type="hidden" name="requestId" value={requestId} />

              <div>
                <label
                  htmlFor={`depot-${requestId}`}
                  className="text-xs font-black uppercase tracking-[0.2em] text-slate-500"
                >
                  Assign ECOLOGIX depot
                </label>

                <select
                  id={`depot-${requestId}`}
                  name="depotId"
                  defaultValue=""
                  className="mt-3 min-h-14 w-full rounded-2xl border border-white/10 bg-slate-900 px-5 py-4 text-base text-white outline-none transition-all focus:border-emerald-400/50 focus:ring-4 focus:ring-emerald-400/10"
                >
                  <option value="" disabled>
                    Select a recovery centre
                  </option>

                  {availableDepots.map((depot) => (
                    <option key={depot.id} value={depot.id}>
                      {depot.code} — {depot.name}
                    </option>
                  ))}
                </select>

                {availableDepots.length === 0 ? (
                  <p className="mt-3 text-sm leading-6 text-amber-300">
                    No planned or active ECOLOGIX depot is currently available.
                  </p>
                ) : null}
              </div>

              <ApproveButton />

              <div className="flex items-center gap-4">
                <span className="h-px flex-1 bg-white/10" />

                <span className="text-[0.62rem] font-black uppercase tracking-[0.22em] text-slate-700">
                  Or reject
                </span>

                <span className="h-px flex-1 bg-white/10" />
              </div>

              <div>
                <label
                  htmlFor={`rejection-${requestId}`}
                  className="text-xs font-black uppercase tracking-[0.2em] text-slate-500"
                >
                  Rejection reason
                </label>

                <textarea
                  id={`rejection-${requestId}`}
                  name="rejectionReason"
                  rows={4}
                  maxLength={500}
                  placeholder="Explain why this pickup cannot be accepted..."
                  className="mt-3 w-full resize-y rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-base leading-7 text-white outline-none transition-all placeholder:text-slate-700 hover:border-white/20 focus:border-red-400/40 focus:ring-4 focus:ring-red-400/10"
                />
              </div>

              <RejectButton />

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
                      Close review
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