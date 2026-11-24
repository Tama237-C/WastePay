"use client";

import Link from "next/link";
import { useActionState, useState } from "react";

import {
  signInCustomer,
  signInCustomerWithGoogle,
  signUpCustomer,
  type CustomerAuthState,
} from "@/actions/auth/customer-auth";
import { EcologixMark } from "@/components/brand/ecologix-mark";

type AccountMode = "welcome" | "sign-in" | "sign-up";

const initialState: CustomerAuthState = {
  status: "idle",
  message: "",
};

function GoogleSignInButton() {
  const [state, formAction, pending] = useActionState(
    signInCustomerWithGoogle,
    initialState,
  );

  return (
    <div>
      <form action={formAction}>
        <button
          type="submit"
          disabled={pending}
          className="flex min-h-12 w-full items-center justify-center gap-3 rounded-xl bg-white px-4 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-100 disabled:opacity-60"
        >
          <span
            aria-hidden="true"
            className="grid h-6 w-6 place-items-center rounded-full border border-slate-200 font-black text-[#4285F4]"
          >
            G
          </span>
          {pending ? "Connecting to Google" : "Continue with Google"}
        </button>
      </form>
      {state.message ? (
        <p
          role="alert"
          className="mt-3 rounded-xl bg-red-950/40 px-3 py-2 text-center text-xs text-red-100"
        >
          {state.message}
        </p>
      ) : null}
    </div>
  );
}

function BrandHeader({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex items-center justify-between">
      <button
        type="button"
        onClick={onBack}
        className="rounded-full border border-white/20 px-3 py-2 text-xs font-bold text-white/90 transition hover:bg-white/10"
      >
        Back
      </button>
      <Link href="/" className="flex items-center gap-2" aria-label="ECOLOGIX home">
        <EcologixMark className="h-8 w-8" />
        <span className="text-sm font-black tracking-wide text-white">ECOLOGIX</span>
      </Link>
      <span className="w-[3.3rem]" aria-hidden="true" />
    </div>
  );
}

function CustomerCredentials({
  mode,
  onChangeMode,
}: {
  mode: "sign-in" | "sign-up";
  onChangeMode: (mode: AccountMode) => void;
}) {
  const action = mode === "sign-in" ? signInCustomer : signUpCustomer;
  const [state, formAction, pending] = useActionState(action, initialState);
  const [showPassword, setShowPassword] = useState(false);

  const isSignUp = mode === "sign-up";
  const inputClassName =
    "min-h-12 w-full rounded-xl border border-white/40 bg-white px-4 py-3 text-sm font-medium text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-300 focus:ring-4 focus:ring-emerald-200/20";

  return (
    <form action={formAction} className="mt-7 grid gap-3.5">
      {isSignUp ? (
        <>
          <label className="grid gap-1.5 text-xs font-bold text-white/90">
            Full Name
            <input
              name="fullName"
              type="text"
              required
              autoComplete="name"
              placeholder="Your full name"
              className={inputClassName}
            />
          </label>
          <label className="grid gap-1.5 text-xs font-bold text-white/90">
            Phone Number
            <input
              name="phoneNumber"
              type="tel"
              required
              inputMode="tel"
              placeholder="Optimized for Cameroon (+237)"
              autoComplete="tel"
              className={inputClassName}
            />
          </label>
        </>
      ) : null}

      <label className="grid gap-1.5 text-xs font-bold text-white/90">
        {isSignUp ? "Email Address" : "Phone Number or Email"}
        <input
          name="email"
          type={isSignUp ? "email" : "text"}
          required
          inputMode={isSignUp ? "email" : "text"}
          autoComplete={isSignUp ? "email" : "username"}
          placeholder={isSignUp ? "name@example.com" : "+2376… or name@example.com"}
          className={inputClassName}
        />
      </label>

      <label className="grid gap-1.5 text-xs font-bold text-white/90">
        {isSignUp ? "Create Password" : "Password"}
        <span className="relative block">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            required
            minLength={isSignUp ? 8 : 1}
            maxLength={128}
            autoComplete={isSignUp ? "new-password" : "current-password"}
            placeholder="Password"
            className={`${inputClassName} pr-16`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((visible) => !visible)}
            className="absolute inset-y-0 right-3 my-auto h-9 px-2 text-xs font-semibold text-slate-500"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </span>
      </label>

      {!isSignUp ? (
        <div className="-mt-1 text-right">
          <Link
            href="/app/account/recovery"
            className="text-xs font-semibold text-white/90 underline underline-offset-2 hover:text-white"
          >
            Forgot Password?
          </Link>
        </div>
      ) : (
        <>
          <label className="grid gap-1.5 text-xs font-bold text-white/90">
            Confirm Password
            <input
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              required
              minLength={8}
              maxLength={128}
              autoComplete="new-password"
              placeholder="Confirm password"
              className={inputClassName}
            />
          </label>
          <label className="flex items-start gap-2 text-[0.7rem] leading-5 text-white/90">
            <input
              name="acceptTerms"
              type="checkbox"
              required
              className="mt-1 h-4 w-4 shrink-0 accent-emerald-400"
            />
            <span>
              I agree to the ECOLOGIX{" "}
              <Link href="/terms" className="underline underline-offset-2">
                Terms
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="underline underline-offset-2">
                Privacy Policy
              </Link>
              .
            </span>
          </label>
        </>
      )}

      {state.message ? (
        <p
          role={state.status === "error" ? "alert" : "status"}
          className={`rounded-xl px-3 py-2 text-xs leading-5 ${
            state.status === "success"
              ? "bg-emerald-950/45 text-emerald-100"
              : "bg-red-950/45 text-red-100"
          }`}
        >
          {state.message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="mt-1 min-h-12 w-full rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-950/20 transition hover:brightness-110 disabled:opacity-60"
      >
        {pending
          ? "Please wait"
          : isSignUp
            ? "Register"
            : "Sign In"}
      </button>

      {isSignUp ? (
        <p className="pt-1 text-center text-xs text-white/85">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => onChangeMode("sign-in")}
            className="font-bold underline underline-offset-2"
          >
            Log In
          </button>
        </p>
      ) : (
        <>
          <p className="pt-1 text-center text-xs text-white/85">
            Don&apos;t have an account?{" "}
            <button
              type="button"
              onClick={() => onChangeMode("sign-up")}
              className="font-bold underline underline-offset-2"
            >
              Create One
            </button>
          </p>
        </>
      )}
    </form>
  );
}

export function CustomerAuthForm({ initialNotice }: { initialNotice?: string }) {
  const [mode, setMode] = useState<AccountMode>("welcome");

  if (mode === "welcome") {
    return (
      <main className="min-h-dvh overflow-hidden bg-gradient-to-b from-[#0757a7] via-[#075bb1] to-[#03498f] text-white">
        <section className="flex min-h-[39svh] flex-col items-center justify-center rounded-b-[2.5rem] bg-white px-6 pb-8 pt-12 text-center text-slate-900 shadow-xl shadow-blue-950/15">
          <div className="flex items-center gap-1.5 text-emerald-700">
            <EcologixMark className="h-10 w-10" />
            <span className="text-lg font-black tracking-[-0.04em]">ECOLOGIX</span>
          </div>
          <h1 className="mt-7 text-3xl font-bold leading-tight tracking-[-0.04em]">
            Welcome to
            <br />
            ECOLOGIX
          </h1>
          <p className="mt-3 max-w-xs text-sm leading-6 text-slate-600">
            From waste to value, digitally.
          </p>
        </section>

        <section className="mx-auto grid w-full max-w-md gap-3 px-5 pb-10 pt-7">
          {initialNotice ? (
            <p role="status" className="rounded-xl bg-amber-950/45 px-3 py-2 text-xs leading-5 text-amber-100">
              {initialNotice}
            </p>
          ) : null}
          <button
            type="button"
            onClick={() => setMode("sign-up")}
            className="min-h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-950/15 transition hover:brightness-110"
          >
            Create Account
          </button>
          <button
            type="button"
            onClick={() => setMode("sign-in")}
            className="min-h-12 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-950/20 transition hover:bg-blue-500"
          >
            Log In
          </button>

          <div className="flex items-center gap-3 py-1 text-xs text-white/80">
            <span className="h-px flex-1 bg-white/25" />
            or
            <span className="h-px flex-1 bg-white/25" />
          </div>

          <GoogleSignInButton />

          <div className="pt-2 text-center">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.13em] text-white/65">
              Mobile money payment options
            </p>
            <div className="mt-2 flex justify-center gap-2">
              <span className="rounded-lg bg-[#ffcc00] px-3 py-2 text-[0.7rem] font-black text-slate-900">
                MTN MoMo
              </span>
              <span className="rounded-lg bg-[#f47b20] px-3 py-2 text-[0.7rem] font-black text-white">
                Orange Money
              </span>
            </div>
            <p className="mt-2 text-[0.65rem] text-white/65">
              Payment services are separate from account sign-in.
            </p>
          </div>

          <Link
            href="/app/account/recovery"
            className="mt-1 justify-self-center py-2 text-xs font-semibold text-white/90 underline underline-offset-2 hover:text-white"
          >
            Forgot Password?
          </Link>
        </section>
      </main>
    );
  }

  const isSignUp = mode === "sign-up";

  return (
    <main className="min-h-dvh overflow-hidden bg-gradient-to-b from-[#0757a7] via-[#075bb1] to-[#03498f] px-5 pb-10 pt-5 text-white">
      <div className="mx-auto w-full max-w-md">
        <BrandHeader onBack={() => setMode("welcome")} />
        <h1 className="mt-9 text-center text-2xl font-bold tracking-[-0.03em]">
          {isSignUp ? "Join the Circular Economy" : "Welcome Back"}
        </h1>
        {initialNotice ? (
          <p role="status" className="mt-4 rounded-xl bg-amber-950/45 px-3 py-2 text-xs leading-5 text-amber-100">
            {initialNotice}
          </p>
        ) : null}
        {isSignUp ? (
          <p className="mt-2 text-center text-xs text-white/75">
            Create your ECOLOGIX account to keep your activity together.
          </p>
        ) : null}
        <CustomerCredentials
          key={mode}
          mode={mode}
          onChangeMode={setMode}
        />
        {!isSignUp ? (
          <div className="mt-4 grid gap-3">
            <div className="flex items-center gap-3 text-[0.65rem] text-white/75">
              <span className="h-px flex-1 bg-white/25" />
              or sign in with
              <span className="h-px flex-1 bg-white/25" />
            </div>
            <GoogleSignInButton />
          </div>
        ) : null}
      </div>
    </main>
  );
}
