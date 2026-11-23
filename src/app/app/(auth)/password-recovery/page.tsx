import type { Metadata } from "next";

import { StaffPasswordRecoveryForm } from "@/components/app/staff-password-recovery-form";

export const metadata: Metadata = {
  title: "Recover Staff Password | WastePay",
  description: "Securely recover access to your WastePay staff account.",
};

export default async function StaffPasswordRecoveryPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;

  return (
    <main className="wp-auth-page">
      <div className="wp-auth-page__glow wp-auth-page__glow--one" />
      <div className="wp-auth-page__glow wp-auth-page__glow--two" />
      <section className="wp-auth-card">
        <header className="wp-auth-brand">
          <span className="wp-app-brand__mark">W</span>
          <span>WastePay</span>
          <em>Account recovery</em>
        </header>

        <div className="wp-auth-intro">
          <p className="wp-overline">Secure staff access</p>
          <h1>Recover your account.</h1>
          <p>
            Enter your WastePay staff email. We’ll send a secure link if it
            belongs to an active staff account.
          </p>
        </div>

        {status === "invalid" ? (
          <p
            role="alert"
            className="mt-7 rounded-2xl border border-amber-400/20 bg-amber-400/10 px-5 py-4 text-sm leading-6 text-amber-100"
          >
            This recovery link is invalid or expired. Request a new one below.
          </p>
        ) : null}

        <StaffPasswordRecoveryForm />

        <footer className="wp-auth-footnote">
          <span>●</span> Recovery links are private and can only be used once.
        </footer>
      </section>
    </main>
  );
}
