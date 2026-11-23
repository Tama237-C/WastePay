"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import {
  updateRecoveredStaffPassword,
  type StaffPasswordUpdateState,
} from "@/actions/auth/staff-password-recovery";

const initialState: StaffPasswordUpdateState = {
  status: "idle",
  message: "",
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="flex min-h-14 w-full items-center justify-center rounded-2xl border border-emerald-300/20 bg-emerald-400 px-6 py-4 text-xs font-black uppercase tracking-[0.18em] text-slate-950 shadow-2xl shadow-emerald-500/20 transition-all duration-300 hover:-translate-y-1 hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Updating password" : "Save new password"}
    </button>
  );
}

export function StaffPasswordUpdateForm() {
  const [state, formAction] = useActionState(
    updateRecoveredStaffPassword,
    initialState,
  );

  return (
    <form action={formAction} className="mt-9 space-y-5">
      <label
        htmlFor="password"
        className="block text-xs font-black uppercase tracking-[0.2em] text-slate-400"
      >
        New password
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={12}
          autoComplete="new-password"
          className="mt-3 min-h-14 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-base font-normal normal-case tracking-normal text-white outline-none transition-all duration-300 placeholder:text-slate-600 focus:border-emerald-400/50 focus:ring-4 focus:ring-emerald-400/10"
        />
      </label>

      <label
        htmlFor="confirmPassword"
        className="block text-xs font-black uppercase tracking-[0.2em] text-slate-400"
      >
        Confirm new password
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          minLength={12}
          autoComplete="new-password"
          className="mt-3 min-h-14 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-base font-normal normal-case tracking-normal text-white outline-none transition-all duration-300 placeholder:text-slate-600 focus:border-emerald-400/50 focus:ring-4 focus:ring-emerald-400/10"
        />
      </label>

      <div className="rounded-2xl border border-sky-400/15 bg-sky-400/[0.07] p-4">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-sky-300">
          Password requirements
        </p>
        <p className="mt-3 text-sm leading-6 text-sky-100/70">
          Use at least 12 characters, including uppercase and lowercase
          letters, a number, and a symbol. Keep it private.
        </p>
      </div>

      {state.message ? (
        <p
          role="alert"
          className="rounded-2xl border border-red-400/20 bg-red-400/10 px-5 py-4 text-sm leading-6 text-red-200"
        >
          {state.message}
        </p>
      ) : null}

      <SubmitButton />

      <Link
        href="/app/password-recovery"
        className="block py-2 text-center text-sm font-bold text-emerald-300 transition-colors duration-300 hover:text-emerald-200"
      >
        Request a new recovery link
      </Link>
    </form>
  );
}
