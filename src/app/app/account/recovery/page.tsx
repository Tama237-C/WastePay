import type { Metadata } from "next";

import { ConsumerAppShell } from "@/components/app/consumer-app-shell";
import { CustomerPasswordRecoveryForm } from "@/components/app/customer-password-recovery-form";

export const metadata: Metadata = {
  title: "Recover your ECOLOGIX account",
  description: "Request a secure password recovery link for your ECOLOGIX account.",
};

export default function CustomerPasswordRecoveryPage() {
  return (
    <ConsumerAppShell>
      <main className="wp-consumer-app">
        <section className="wp-consumer-app__hero">
          <p className="wp-overline">Account recovery</p>
          <h1>Get back into ECOLOGIX.</h1>
          <p>
            Enter the email linked to your general account. We’ll send a secure
            link if an account uses it.
          </p>
          <p className="mt-3 text-sm text-slate-400">
            If a recovery link has expired, use this form to request another.
          </p>
        </section>
        <section className="wp-account-auth-card">
          <CustomerPasswordRecoveryForm />
        </section>
      </main>
    </ConsumerAppShell>
  );
}
