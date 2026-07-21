"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";

import {
  createStaffAccount,
  type CreateStaffAccountState,
} from "@/actions/admin/create-staff-account";
const initialCreateStaffAccountState: CreateStaffAccountState = {
  status: "idle",
  message: "",
  temporaryPassword: null,
  createdEmail: null,
};
function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="flex min-h-14 w-full items-center justify-center rounded-2xl border border-emerald-300/20 bg-emerald-400 px-6 py-4 text-xs font-black uppercase tracking-[0.18em] text-slate-950 shadow-2xl shadow-emerald-500/20 transition-all duration-300 ease-out hover:-translate-y-1 hover:bg-emerald-300 hover:shadow-emerald-500/30 focus:outline-none focus:ring-4 focus:ring-emerald-400/20 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 sm:w-auto"
    >
      {pending ? (
        <>
          <span>Creating account</span>

          <span
            aria-hidden="true"
            className="ml-3 h-5 w-5 animate-spin rounded-full border-2 border-slate-950/30 border-t-slate-950"
          />
        </>
      ) : (
        "Create staff account"
      )}
    </button>
  );
}

export function CreateStaffAccount() {
  const [isOpen, setIsOpen] = useState(false);
  const [copyStatus, setCopyStatus] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const [state, formAction] = useActionState(
    createStaffAccount,
    initialCreateStaffAccountState,
  );

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state.status]);

  async function copyCredentials() {
    if (!state.createdEmail || !state.temporaryPassword) {
      return;
    }

    const credentials = [
      "WastePay staff access",
      `Email: ${state.createdEmail}`,
      `Temporary password: ${state.temporaryPassword}`,
      "Login: http://localhost:3000/app/staff-login",
      "The staff member must keep these credentials private.",
    ].join("\n");

    try {
      await navigator.clipboard.writeText(credentials);
      setCopyStatus("Credentials copied");
    } catch {
      setCopyStatus("Copy failed — select the credentials manually");
    }
  }

  function closeModal() {
    setIsOpen(false);
    setCopyStatus("");
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="min-h-12 rounded-2xl border border-emerald-300/20 bg-emerald-400 px-6 py-3 text-xs font-black uppercase tracking-[0.18em] text-slate-950 shadow-2xl shadow-emerald-500/20 transition-all duration-300 ease-out hover:-translate-y-1 hover:bg-emerald-300 hover:shadow-emerald-500/30 focus:outline-none focus:ring-4 focus:ring-emerald-400/20"
      >
        Add staff account
      </button>

      {isOpen ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6 sm:px-6">
          <button
            type="button"
            aria-label="Close staff account window"
            onClick={closeModal}
            className="absolute inset-0 bg-slate-950/85 backdrop-blur-md"
          />

          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-staff-title"
            className="relative max-h-[calc(100vh-29rem)] w-full max-w-3xl overflow-y-auto rounded-[2rem] border border-white/10 bg-slate-950/95 shadow-[0_40px_120px_rgba(0,0,0,0.65)]"
          >
            <header className="sticky top-0 z-10 flex items-start justify-between gap-6 border-b border-white/10 bg-slate-950/90 px-6 py-6 backdrop-blur-xl sm:px-8">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.28em] text-emerald-400">
                  Workforce provisioning
                </p>

                <h2
                  id="create-staff-title"
                  className="mt-3 text-3xl font-black tracking-[-0.04em] text-white"
                >
                  Create staff account
                </h2>

                <p className="mt-3 max-w-xl text-sm font-light leading-6 text-slate-400">
                  Provision secure access for a depot manager, depot agent, or
                  pickup driver.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                aria-label="Close"
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-2xl font-light text-slate-400 transition-all duration-300 hover:border-red-400/30 hover:bg-red-400/10 hover:text-red-200"
              >
                ×
              </button>
            </header>

            <div className="p-6 sm:p-8">
              {state.status === "success" &&
              state.createdEmail &&
              state.temporaryPassword ? (
                <div className="rounded-3xl border border-emerald-400/20 bg-emerald-400/[0.07] p-6">
                  <div className="flex items-center gap-3">
                    <span className="h-3 w-3 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.9)]" />

                    <p className="text-xs font-black uppercase tracking-[0.24em] text-emerald-300">
                      Account created
                    </p>
                  </div>

                  <p className="mt-5 text-sm font-medium leading-6 text-emerald-100">
                    {state.message}
                  </p>

                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-5">
                      <p className="text-[0.62rem] font-black uppercase tracking-[0.2em] text-slate-600">
                        Staff email
                      </p>

                      <p className="mt-3 break-all font-mono text-sm font-bold text-white">
                        {state.createdEmail}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-5">
                      <p className="text-[0.62rem] font-black uppercase tracking-[0.2em] text-slate-600">
                        Temporary password
                      </p>

                      <p className="mt-3 break-all font-mono text-sm font-bold text-amber-300">
                        {state.temporaryPassword}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4">
                    <p className="text-sm leading-6 text-amber-100">
                      This password is displayed only in this response. Copy it
                      before closing the window and send it through a private
                      channel.
                    </p>
                  </div>

                  <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={copyCredentials}
                      className="min-h-12 rounded-2xl border border-emerald-300/20 bg-emerald-400 px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-slate-950 transition-all duration-300 hover:-translate-y-1 hover:bg-emerald-300"
                    >
                      Copy credentials
                    </button>

                    <button
                      type="button"
                      onClick={closeModal}
                      className="min-h-12 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-slate-300 transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.07]"
                    >
                      Close
                    </button>
                  </div>

                  {copyStatus ? (
                    <p className="mt-4 text-sm font-medium text-sky-300">
                      {copyStatus}
                    </p>
                  ) : null}
                </div>
              ) : (
                <form
                  ref={formRef}
                  action={formAction}
                  className="space-y-7"
                >
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label
                        htmlFor="fullName"
                        className="text-xs font-black uppercase tracking-[0.2em] text-slate-500"
                      >
                        Full legal name
                      </label>

                      <input
                        id="fullName"
                        name="fullName"
                        type="text"
                        required
                        autoComplete="name"
                        placeholder="Jean Pierre Ndzana"
                        className="mt-3 min-h-14 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-base text-white outline-none transition-all duration-300 placeholder:text-slate-700 hover:border-white/20 focus:border-emerald-400/50 focus:ring-4 focus:ring-emerald-400/10"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="text-xs font-black uppercase tracking-[0.2em] text-slate-500"
                      >
                        Staff email
                      </label>

                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        autoComplete="off"
                        placeholder="staff@wastepay.org"
                        className="mt-3 min-h-14 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-base text-white outline-none transition-all duration-300 placeholder:text-slate-700 hover:border-white/20 focus:border-emerald-400/50 focus:ring-4 focus:ring-emerald-400/10"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="phoneNumber"
                        className="text-xs font-black uppercase tracking-[0.2em] text-slate-500"
                      >
                        Cameroon phone number
                      </label>

                      <input
                        id="phoneNumber"
                        name="phoneNumber"
                        type="tel"
                        required
                        autoComplete="off"
                        placeholder="+2376XXXXXXXX"
                        className="mt-3 min-h-14 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-base text-white outline-none transition-all duration-300 placeholder:text-slate-700 hover:border-white/20 focus:border-emerald-400/50 focus:ring-4 focus:ring-emerald-400/10"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="role"
                        className="text-xs font-black uppercase tracking-[0.2em] text-slate-500"
                      >
                        Operational role
                      </label>

                      <select
                        id="role"
                        name="role"
                        required
                        defaultValue=""
                        className="mt-3 min-h-14 w-full rounded-2xl border border-white/10 bg-slate-900 px-5 py-4 text-base text-white outline-none transition-all duration-300 hover:border-white/20 focus:border-emerald-400/50 focus:ring-4 focus:ring-emerald-400/10"
                      >
                        <option value="" disabled>
                          Select a role
                        </option>

                        <option value="manager">Depot Manager</option>
                        <option value="agent">Depot Agent</option>
                        <option value="driver">Pickup Driver</option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="locationZone"
                        className="text-xs font-black uppercase tracking-[0.2em] text-slate-500"
                      >
                        City or operational zone
                      </label>

                      <input
                        id="locationZone"
                        name="locationZone"
                        type="text"
                        required
                        placeholder="Douala — Akwa"
                        className="mt-3 min-h-14 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-base text-white outline-none transition-all duration-300 placeholder:text-slate-700 hover:border-white/20 focus:border-emerald-400/50 focus:ring-4 focus:ring-emerald-400/10"
                      />
                    </div>
                  </div>

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

                  <div className="flex flex-col-reverse gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
                    <p className="max-w-md text-xs leading-5 text-slate-600">
                      The new account receives a generated temporary password.
                      Account creation is permanently recorded by Supabase.
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