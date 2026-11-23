"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import {
  requestStaffPasswordRecovery,
  type StaffPasswordRecoveryState,
} from "@/actions/auth/staff-password-recovery";

const initialState: StaffPasswordRecoveryState = {
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
      {pending ? "Requesting recovery link" : "Send recovery link"}
    </button>
  );
}

export function StaffPasswordRecoveryForm() {
  const [state, formAction] = useActionState(
    requestStaffPasswordRecovery,
    initialState,
  );

  return (
    <form action={formAction} className="mt-9 space-y-5">
      <label
        htmlFor="email"
        className="block text-xs font-black uppercase tracking-[0.2em] text-slate-400"
      >
        Staff email address
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="name@ecologix.org"
          className="mt-3 min-h-14 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-base font-normal normal-case tracking-normal text-white outline-none transition-all duration-300 placeholder:text-slate-600 focus:border-emerald-400/50 focus:ring-4 focus:ring-emerald-400/10"
        />
      </label>

      <p className="text-sm leading-6 text-slate-400">
        If this email belongs to an active ECOLOGIX staff account, we’ll send a
        password recovery link.
      </p>

      {state.message ? (
        <p
          role={state.status === "error" ? "alert" : "status"}
          className={`rounded-2xl border px-5 py-4 text-sm leading-6 ${
            state.status === "success"
              ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-100"
              : "border-red-400/20 bg-red-400/10 text-red-200"
          }`}
        >
          {state.message}
        </p>
      ) : null}

      <SubmitButton />

      <Link
        href="/app/staff-login"
        className="block py-2 text-center text-sm font-bold text-emerald-300 transition-colors duration-300 hover:text-emerald-200"
      >
        Return to staff sign in
      </Link>
    </form>
  );
}
