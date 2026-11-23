"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import {
  signInStaff,
  type StaffLoginState,
} from "@/actions/auth/staff-login";

const initialState: StaffLoginState = {
  message: "",
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="group relative flex min-h-14 w-full items-center justify-center overflow-hidden rounded-2xl border border-emerald-300/20 bg-emerald-400 px-6 py-4 text-sm font-black uppercase tracking-[0.18em] text-slate-950 shadow-2xl shadow-emerald-500/20 transition-all duration-300 ease-out hover:-translate-y-1 hover:bg-emerald-300 hover:shadow-emerald-500/30 focus:outline-none focus:ring-4 focus:ring-emerald-400/20 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
    >
      <span className="relative z-10">
        {pending ? "Verifying account" : "Enter ECOLOGIX"}
      </span>

      {pending ? (
        <span
          aria-hidden="true"
          className="ml-3 h-5 w-5 animate-spin rounded-full border-2 border-slate-950/30 border-t-slate-950"
        />
      ) : (
        <span
          aria-hidden="true"
          className="relative z-10 ml-3 transition-transform duration-300 ease-out group-hover:translate-x-1"
        >
          â†’
        </span>
      )}
    </button>
  );
}

export function StaffLoginForm() {
  const [state, formAction] = useActionState(signInStaff, initialState);

  return (
    <form action={formAction} className="mt-10 space-y-6">
      <div>
        <label
          htmlFor="email"
          className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400"
        >
          Staff email address
        </label>

        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="name@ecologix.org"
          className="mt-3 min-h-14 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-base text-white outline-none transition-all duration-300 ease-out placeholder:text-slate-600 hover:border-white/20 focus:border-emerald-400/50 focus:bg-white/[0.07] focus:ring-4 focus:ring-emerald-400/10"
        />
      </div>

      <div>
        <div className="flex items-center justify-between gap-4">
          <label
            htmlFor="password"
            className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400"
          >
            Password
          </label>

          <span className="text-xs font-medium text-slate-600">
            Internal staff access
          </span>
        </div>

        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          placeholder="Enter your secure password"
          className="mt-3 min-h-14 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-base text-white outline-none transition-all duration-300 ease-out placeholder:text-slate-600 hover:border-white/20 focus:border-emerald-400/50 focus:bg-white/[0.07] focus:ring-4 focus:ring-emerald-400/10"
        />
      </div>

      <div className="flex justify-end">
        <Link
          href="/app/password-recovery"
          className="text-sm font-bold text-emerald-300 transition-colors duration-300 hover:text-emerald-200"
        >
          Forgot password?
        </Link>
      </div>

      {state.message ? (
        <div
          role="alert"
          className="rounded-2xl border border-red-400/20 bg-red-400/10 px-5 py-4"
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