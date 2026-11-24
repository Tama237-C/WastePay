"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import {
  requestCustomerPasswordRecovery,
  updateRecoveredCustomerPassword,
  type CustomerPasswordRecoveryState,
} from "@/actions/auth/customer-password-recovery";

const initialState: CustomerPasswordRecoveryState = {
  status: "idle",
  message: "",
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="wp-primary-button w-full">
      {pending ? "Sending recovery link" : "Send recovery link"}
    </button>
  );
}

export function CustomerPasswordRecoveryForm() {
  const [state, formAction] = useActionState(
    requestCustomerPasswordRecovery,
    initialState,
  );

  return (
    <form action={formAction} className="wp-account-auth-card__form">
      <label>
        Email
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          className="mt-2"
        />
      </label>
      {state.message ? (
        <p
          role={state.status === "error" ? "alert" : "status"}
          className={
            state.status === "success"
              ? "wp-account-auth-card__success"
              : "wp-account-auth-card__error"
          }
        >
          {state.message}
        </p>
      ) : null}
      <SubmitButton />
      <Link href="/app/account" className="block text-center text-sm text-emerald-300">
        Return to sign in
      </Link>
    </form>
  );
}

export function CustomerPasswordUpdateForm() {
  const [state, formAction] = useActionState(
    updateRecoveredCustomerPassword,
    initialState,
  );

  return (
    <form action={formAction} className="wp-account-auth-card__form">
      <label>
        New password
        <input
          name="password"
          type="password"
          minLength={8}
          maxLength={128}
          required
          autoComplete="new-password"
          className="mt-2"
        />
      </label>
      <label>
        Confirm password
        <input
          name="confirmPassword"
          type="password"
          minLength={8}
          maxLength={128}
          required
          autoComplete="new-password"
          className="mt-2"
        />
      </label>
      {state.message ? (
        <p role="alert" className="wp-account-auth-card__error">
          {state.message}
        </p>
      ) : null}
      <SubmitButton />
      <Link
        href="/app/account/recovery"
        className="block text-center text-sm text-emerald-300"
      >
        Request a new recovery link
      </Link>
    </form>
  );
}
