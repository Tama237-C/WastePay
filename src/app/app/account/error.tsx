"use client";

import Link from "next/link";
import { useEffect } from "react";
import { ConsumerAppShell } from "@/components/app/consumer-app-shell";

export default function CustomerAccountError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("WastePay account page encountered an unexpected error.", {
      digest: error.digest,
      message: error.message,
    });
  }, [error]);

  return (
    <ConsumerAppShell>
      <main className="wp-consumer-app">
        <section className="wp-consumer-app__hero">
          <p className="wp-overline">Account unavailable</p>
          <h1>We could not load your account.</h1>
          <p role="alert">
            The account page encountered an unexpected problem. Try again. If
            it happens again, contact WastePay support
            {error.digest ? ` and share reference ${error.digest}` : ""}.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={reset}
              className="wp-primary-button"
            >
              Try again
            </button>
            <Link href="/app" className="wp-secondary-button">
              Return to the app
            </Link>
          </div>
        </section>
      </main>
    </ConsumerAppShell>
  );
}
