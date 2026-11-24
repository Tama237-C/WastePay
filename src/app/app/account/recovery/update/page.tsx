import type { Metadata } from "next";
import Link from "next/link";

import { ConsumerAppShell } from "@/components/app/consumer-app-shell";
import { CustomerPasswordUpdateForm } from "@/components/app/customer-password-recovery-form";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Set a new ECOLOGIX password",
  description: "Choose a new password for your general ECOLOGIX account.",
};

export default async function CustomerPasswordUpdatePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  let canUpdate = false;

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, is_active")
      .eq("id", user.id)
      .maybeSingle();
    canUpdate = profile?.role === "resident" && profile.is_active;
  }

  return (
    <ConsumerAppShell>
      <main className="wp-consumer-app">
        <section className="wp-consumer-app__hero">
          <p className="wp-overline">Account recovery</p>
          <h1>Choose a new password.</h1>
          <p>
            {canUpdate
              ? "Set a new password to continue to your ECOLOGIX dashboard."
              : "This recovery link is invalid or expired. Request a fresh link to continue."}
          </p>
        </section>
        <section className="wp-account-auth-card">
          {canUpdate ? (
            <CustomerPasswordUpdateForm />
          ) : (
            <Link href="/app/account/recovery" className="wp-primary-button">
              Request a new recovery link
            </Link>
          )}
        </section>
      </main>
    </ConsumerAppShell>
  );
}
