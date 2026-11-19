"use client";

import { useActionState, useState } from "react";
import {
  signInCustomer,
  signUpCustomer,
  type CustomerAuthState,
} from "@/actions/auth/customer-auth";

const initialState: CustomerAuthState = {
  status: "idle",
  message: "",
};

export function CustomerAuthForm() {
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
  const action = mode === "sign-in" ? signInCustomer : signUpCustomer;
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <section className="wp-account-auth-card">
      <div className="wp-account-auth-card__tabs" aria-label="Customer account mode">
        <button
          type="button"
          className={mode === "sign-in" ? "is-active" : ""}
          onClick={() => setMode("sign-in")}
        >
          Sign in
        </button>
        <button
          type="button"
          className={mode === "sign-up" ? "is-active" : ""}
          onClick={() => setMode("sign-up")}
        >
          Create account
        </button>
      </div>

      <form action={formAction} className="wp-account-auth-card__form">
        {mode === "sign-up" ? (
          <>
            <label>
              Full name
              <input name="fullName" type="text" required autoComplete="name" />
            </label>
            <label>
              Phone number
              <input
                name="phoneNumber"
                type="tel"
                required
                inputMode="tel"
                placeholder="+2376XXXXXXXX"
                autoComplete="tel"
              />
            </label>
          </>
        ) : null}

        <label>
          Email
          <input name="email" type="email" required autoComplete="email" />
        </label>

        <label>
          Password
          <input
            name="password"
            type="password"
            required
            minLength={mode === "sign-up" ? 8 : 1}
            autoComplete={mode === "sign-in" ? "current-password" : "new-password"}
          />
        </label>

        {state.message ? (
          <p
            className={
              state.status === "success"
                ? "wp-account-auth-card__success"
                : "wp-account-auth-card__error"
            }
          >
            {state.message}
          </p>
        ) : null}

        <button type="submit" disabled={pending} className="wp-primary-button">
          {pending
            ? "Please wait"
            : mode === "sign-in"
              ? "Sign in"
              : "Create WastePay account"}
        </button>
      </form>
    </section>
  );
}
