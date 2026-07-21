"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import {
  changeTemporaryPassword,
  type ChangePasswordState,
} from "@/actions/auth/change-password";

const initialState: ChangePasswordState = {
  status: "idle",
  message: "",
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="flex min-h-14 w-full items-center justify-center rounded-2xl border border-emerald-300/20 bg-emerald-400 px-6 py-4 text-xs font-black uppercase tracking-[0.18em] text-slate-950 shadow-2xl shadow-emerald-500/20 transition-all duration-300 ease-out hover:-translate-y-1 hover:bg-emerald-300 hover:shadow-emerald-500/30 focus:outline-none focus:ring-4 focus:ring-emerald-400/20 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
    >
      {pending ? (
        <>
          <span>Securing account</span>

          <span
            aria-hidden="true"
            className="ml-3 h-5 w-5 animate-spin rounded-full border-2 border-slate-950/30 border-t-slate-950"
          />
        </>
      ) : (
        "Save permanent password"
      )}
    </button>
  );
}

export function ChangePasswordForm() {
  const [state, formAction] = useActionState(
    changeTemporaryPassword,
    initialState,
  );

  return (
    <form action={formAction} className="mt-9 space-y-6">
      <div>
        <label
          htmlFor="password"
          className="text-xs font-black uppercase tracking-[0.22em] text-slate-400"
        >
          New permanent password
        </label>

        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={12}
          autoComplete="new-password"
          placeholder="Enter a strong private password"
          className="mt-3 min-h-14 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-base text-white outline-none transition-all duration-300 ease-out placeholder:text-slate-600 hover:border-white/20 focus:border-emerald-400/50 focus:bg-white/[0.07] focus:ring-4 focus:ring-emerald-400/10"
        />
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          className="text-xs font-black uppercase tracking-[0.22em] text-slate-400"
        >
          Confirm new password
        </label>

        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          minLength={12}
          autoComplete="new-password"
          placeholder="Repeat the same password"
          className="mt-3 min-h-14 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-base text-white outline-none transition-all duration-300 ease-out placeholder:text-slate-600 hover:border-white/20 focus:border-emerald-400/50 focus:bg-white/[0.07] focus:ring-4 focus:ring-emerald-400/10"
        />
      </div>

      <div className="rounded-2xl border border-sky-400/15 bg-sky-400/[0.07] p-5">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-sky-300">
          Password requirements
        </p>

        <p className="mt-3 text-sm font-light leading-6 text-sky-100/70">
          Use at least 12 characters, including uppercase and lowercase
          letters, a number, and a symbol. Do not reuse the temporary password.
        </p>
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

      <SubmitButton />
    </form>
  );
}