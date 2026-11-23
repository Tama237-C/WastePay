"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";

import {
  createDepot,
  type CreateDepotState,
} from "@/actions/admin/create-depot";

const initialCreateDepotState: CreateDepotState = {
  status: "idle",
  message: "",
  createdDepotName: null,
  createdDepotCode: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="flex min-h-14 w-full items-center justify-center rounded-2xl border border-emerald-300/20 bg-emerald-400 px-6 py-4 text-xs font-black uppercase tracking-[0.18em] text-slate-950 shadow-2xl shadow-emerald-500/20 transition-all duration-300 hover:-translate-y-1 hover:bg-emerald-300 focus:outline-none focus:ring-4 focus:ring-emerald-400/20 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 sm:w-auto"
    >
      {pending ? (
        <>
          <span>Registering depot</span>

          <span
            aria-hidden="true"
            className="ml-3 h-5 w-5 animate-spin rounded-full border-2 border-slate-950/30 border-t-slate-950"
          />
        </>
      ) : (
        "Register depot"
      )}
    </button>
  );
}

export function CreateDepot() {
  const [isOpen, setIsOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const [state, formAction] = useActionState(
    createDepot,
    initialCreateDepotState,
  );

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state.status]);

  function closeModal() {
    setIsOpen(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="min-h-12 rounded-2xl border border-emerald-300/20 bg-emerald-400 px-6 py-3 text-xs font-black uppercase tracking-[0.18em] text-slate-950 shadow-2xl shadow-emerald-500/20 transition-all duration-300 hover:-translate-y-1 hover:bg-emerald-300 focus:outline-none focus:ring-4 focus:ring-emerald-400/20"
      >
        Register depot
      </button>

      {isOpen ? (
        <div className="fixed inset-0 z-[9999] overflow-y-auto bg-black/80 backdrop-blur-md px-4 py-6">
          <button
            type="button"
            aria-label="Close depot registration"
            onClick={closeModal}
            className="absolute inset-0 bg-slate-950/85 backdrop-blur-md"
          />

          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="register-depot-title"
           className="
relative
mx-auto
w-full
max-w-6xl
rounded-[2rem]
border
border-white/10
bg-slate-950
shadow-[0_40px_120px_rgba(0,0,0,0.65)]
"
          >
            <header className="sticky top-0 z-10 flex items-start justify-between gap-6 border-b border-white/10 bg-slate-950/90 px-6 py-6 backdrop-blur-xl sm:px-8">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.28em] text-emerald-400">
                  Recovery network expansion
                </p>

                <h2
                  id="register-depot-title"
                  className="mt-3 text-3xl font-black tracking-[-0.04em] text-white"
                >
                  Register ECOLOGIX depot
                </h2>

                <p className="mt-3 max-w-2xl text-sm font-light leading-6 text-slate-400">
                  Create a physical recovery centre with verified operational,
                  financial, and geographic information.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                aria-label="Close"
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-2xl font-light text-slate-400 transition-all duration-300 hover:border-red-400/30 hover:bg-red-400/10 hover:text-red-200"
              >
                Ã—
              </button>
            </header>

            <div className="max-h-[75vh] overflow-y-auto p-6 sm:p-8">
              {state.status === "success" ? (
                <div className="rounded-3xl border border-emerald-400/20 bg-emerald-400/[0.07] p-7">
                  <div className="flex items-center gap-3">
                    <span className="h-3 w-3 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.9)]" />

                    <p className="text-xs font-black uppercase tracking-[0.24em] text-emerald-300">
                      Depot registered
                    </p>
                  </div>

                  <h3 className="mt-6 text-3xl font-black tracking-[-0.04em] text-white">
                    {state.createdDepotName}
                  </h3>

                  <p className="mt-3 text-sm font-bold uppercase tracking-[0.18em] text-emerald-300">
                    {state.createdDepotCode}
                  </p>

                  <p className="mt-5 text-sm leading-7 text-emerald-100/80">
                    {state.message}
                  </p>

                  <button
                    type="button"
                    onClick={closeModal}
                    className="mt-7 min-h-12 rounded-2xl border border-emerald-300/20 bg-emerald-400 px-6 py-3 text-xs font-black uppercase tracking-[0.18em] text-slate-950 transition-all duration-300 hover:-translate-y-1 hover:bg-emerald-300"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <form
                  ref={formRef}
                  action={formAction}
                  className="space-y-8"
                >
                  <fieldset>
                    <legend className="text-xs font-black uppercase tracking-[0.25em] text-emerald-400">
                      Depot identity
                    </legend>

                    <div className="mt-5 grid gap-6 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="name"
                          className="text-xs font-black uppercase tracking-[0.2em] text-slate-500"
                        >
                          Depot name
                        </label>

                        <input
                          id="name"
                          name="name"
                          type="text"
                          required
                          placeholder="Douala Akwa Recovery Hub"
                          className="mt-3 min-h-14 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-white outline-none transition-all placeholder:text-slate-700 focus:border-emerald-400/50 focus:ring-4 focus:ring-emerald-400/10"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="code"
                          className="text-xs font-black uppercase tracking-[0.2em] text-slate-500"
                        >
                          Depot code
                        </label>

                        <input
                          id="code"
                          name="code"
                          type="text"
                          required
                          placeholder="DLA-AKWA-01"
                          className="mt-3 min-h-14 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 uppercase text-white outline-none transition-all placeholder:text-slate-700 focus:border-emerald-400/50 focus:ring-4 focus:ring-emerald-400/10"
                        />
                      </div>
                    </div>
                  </fieldset>

                  <fieldset>
                    <legend className="text-xs font-black uppercase tracking-[0.25em] text-sky-400">
                      Location
                    </legend>

                    <div className="mt-5 grid gap-6 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="regionName"
                          className="text-xs font-black uppercase tracking-[0.2em] text-slate-500"
                        >
                          Region
                        </label>

                        <input
                          id="regionName"
                          name="regionName"
                          type="text"
                          required
                          placeholder="Littoral"
                          className="mt-3 min-h-14 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-white outline-none placeholder:text-slate-700 focus:border-sky-400/50 focus:ring-4 focus:ring-sky-400/10"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="city"
                          className="text-xs font-black uppercase tracking-[0.2em] text-slate-500"
                        >
                          City
                        </label>

                        <input
                          id="city"
                          name="city"
                          type="text"
                          required
                          placeholder="Douala"
                          className="mt-3 min-h-14 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-white outline-none placeholder:text-slate-700 focus:border-sky-400/50 focus:ring-4 focus:ring-sky-400/10"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label
                          htmlFor="addressText"
                          className="text-xs font-black uppercase tracking-[0.2em] text-slate-500"
                        >
                          Physical address
                        </label>

                        <input
                          id="addressText"
                          name="addressText"
                          type="text"
                          required
                          placeholder="Akwa, near the central market"
                          className="mt-3 min-h-14 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-white outline-none placeholder:text-slate-700 focus:border-sky-400/50 focus:ring-4 focus:ring-sky-400/10"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="latitude"
                          className="text-xs font-black uppercase tracking-[0.2em] text-slate-500"
                        >
                          Latitude
                        </label>

                        <input
                          id="latitude"
                          name="latitude"
                          type="number"
                          required
                          step="any"
                          placeholder="4.0511"
                          className="mt-3 min-h-14 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-white outline-none placeholder:text-slate-700 focus:border-sky-400/50 focus:ring-4 focus:ring-sky-400/10"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="longitude"
                          className="text-xs font-black uppercase tracking-[0.2em] text-slate-500"
                        >
                          Longitude
                        </label>

                        <input
                          id="longitude"
                          name="longitude"
                          type="number"
                          required
                          step="any"
                          placeholder="9.7679"
                          className="mt-3 min-h-14 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-white outline-none placeholder:text-slate-700 focus:border-sky-400/50 focus:ring-4 focus:ring-sky-400/10"
                        />
                      </div>
                    </div>
                  </fieldset>

                  <fieldset>
                    <legend className="text-xs font-black uppercase tracking-[0.25em] text-violet-400">
                      Operations
                    </legend>

                    <div className="mt-5 grid gap-6 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="contactPhoneNumber"
                          className="text-xs font-black uppercase tracking-[0.2em] text-slate-500"
                        >
                          Depot contact number
                        </label>

                        <input
                          id="contactPhoneNumber"
                          name="contactPhoneNumber"
                          type="tel"
                          required
                          placeholder="+2376XXXXXXXX"
                          className="mt-3 min-h-14 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-white outline-none placeholder:text-slate-700 focus:border-violet-400/50 focus:ring-4 focus:ring-violet-400/10"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="maximumStorageCapacityKg"
                          className="text-xs font-black uppercase tracking-[0.2em] text-slate-500"
                        >
                          Maximum storage capacity KG
                        </label>

                        <input
                          id="maximumStorageCapacityKg"
                          name="maximumStorageCapacityKg"
                          type="number"
                          required
                          min="0.001"
                          step="0.001"
                          placeholder="5000"
                          className="mt-3 min-h-14 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-white outline-none placeholder:text-slate-700 focus:border-violet-400/50 focus:ring-4 focus:ring-violet-400/10"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="openingTime"
                          className="text-xs font-black uppercase tracking-[0.2em] text-slate-500"
                        >
                          Opening time
                        </label>

                        <input
                          id="openingTime"
                          name="openingTime"
                          type="time"
                          required
                          defaultValue="08:00"
                          className="mt-3 min-h-14 w-full rounded-2xl border border-white/10 bg-slate-900 px-5 py-4 text-white outline-none focus:border-violet-400/50 focus:ring-4 focus:ring-violet-400/10"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="closingTime"
                          className="text-xs font-black uppercase tracking-[0.2em] text-slate-500"
                        >
                          Closing time
                        </label>

                        <input
                          id="closingTime"
                          name="closingTime"
                          type="time"
                          required
                          defaultValue="17:00"
                          className="mt-3 min-h-14 w-full rounded-2xl border border-white/10 bg-slate-900 px-5 py-4 text-white outline-none focus:border-violet-400/50 focus:ring-4 focus:ring-violet-400/10"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="status"
                          className="text-xs font-black uppercase tracking-[0.2em] text-slate-500"
                        >
                          Initial status
                        </label>

                        <select
                          id="status"
                          name="status"
                          defaultValue="planned"
                          required
                          className="mt-3 min-h-14 w-full rounded-2xl border border-white/10 bg-slate-900 px-5 py-4 text-white outline-none focus:border-violet-400/50 focus:ring-4 focus:ring-violet-400/10"
                        >
                          <option value="planned">Planned</option>
                          <option value="active">Active</option>
                          <option value="temporarily_closed">
                            Temporarily Closed
                          </option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </div>
                    </div>
                  </fieldset>

                  <fieldset>
                    <legend className="text-xs font-black uppercase tracking-[0.25em] text-amber-400">
                      Opening float balances
                    </legend>

                    <div className="mt-5 grid gap-6 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="mtnFloatBalanceCfa"
                          className="text-xs font-black uppercase tracking-[0.2em] text-slate-500"
                        >
                          MTN MoMo float CFA
                        </label>

                        <input
                          id="mtnFloatBalanceCfa"
                          name="mtnFloatBalanceCfa"
                          type="number"
                          required
                          min="0"
                          step="1"
                          defaultValue="0"
                          className="mt-3 min-h-14 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-white outline-none focus:border-amber-400/50 focus:ring-4 focus:ring-amber-400/10"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="orangeFloatBalanceCfa"
                          className="text-xs font-black uppercase tracking-[0.2em] text-slate-500"
                        >
                          Orange Money float CFA
                        </label>

                        <input
                          id="orangeFloatBalanceCfa"
                          name="orangeFloatBalanceCfa"
                          type="number"
                          required
                          min="0"
                          step="1"
                          defaultValue="0"
                          className="mt-3 min-h-14 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-white outline-none focus:border-amber-400/50 focus:ring-4 focus:ring-amber-400/10"
                        />
                      </div>
                    </div>
                  </fieldset>

                  {state.status === "error" ? (
                    <div
                      role="alert"
                      className="rounded-2xl border border-red-400/20 bg-red-400/10 p-5"
                    >
                      <p className="text-sm font-medium leading-6 text-red-200">
                        {state.message}
                      </p>
                    </div>
                  ) : null}

                  <div className="flex flex-col-reverse gap-4 border-t border-white/10 pt-7 sm:flex-row sm:items-center sm:justify-between">
                    <p className="max-w-xl text-xs leading-5 text-slate-600">
                      Longitude and latitude will be stored as a PostGIS
                      geographic point for future zoning and routing.
                    </p>

                    <SubmitButton />
                  </div>
                </form>
              )}
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}