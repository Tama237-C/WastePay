import type { Metadata } from "next";
import Link from "next/link";

import { StaffPasswordUpdateForm } from "@/components/app/staff-password-update-form";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Choose a New Staff Password | ECOLOGIX",
  description: "Choose a new password for your ECOLOGIX staff account.",
};

function RecoveryUnavailable({ message }: { message: string }) {
  return (
    <main className="wp-auth-page">
      <div className="wp-auth-page__glow wp-auth-page__glow--one" />
      <div className="wp-auth-page__glow wp-auth-page__glow--two" />
      <section className="wp-auth-card">
        <header className="wp-auth-brand">
          <span className="wp-app-brand__mark">W</span>
          <span>ECOLOGIX</span>
          <em>Account recovery</em>
        </header>
        <div className="wp-auth-intro">
          <p className="wp-overline">Recovery unavailable</p>
          <h1>We could not verify this link.</h1>
          <p role="alert">{message}</p>
        </div>
        <Link
          href="/app/password-recovery"
          className="mt-8 flex min-h-14 items-center justify-center rounded-2xl border border-emerald-300/20 bg-emerald-400 px-6 py-4 text-xs font-black uppercase tracking-[0.18em] text-slate-950 shadow-2xl shadow-emerald-500/20 transition-all duration-300 hover:-translate-y-1 hover:bg-emerald-300"
        >
          Request another recovery link
        </Link>
      </section>
    </main>
  );
}

export default async function UpdateRecoveredStaffPasswordPage() {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    console.error("ECOLOGIX could not verify a recovered staff session.", {
      code: userError.code,
      message: userError.message,
    });
  }

  if (!user || userError) {
    return (
      <RecoveryUnavailable message="The recovery link may have expired. Request a new link and try again." />
    );
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role, is_active")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    console.error("ECOLOGIX could not verify the recovered staff profile.", {
      code: profileError.code,
      message: profileError.message,
    });
    return (
      <RecoveryUnavailable message="ECOLOGIX could not verify your staff account. Contact the administrator." />
    );
  }

  const staffRoles = new Set([
    "admin",
    "manager",
    "agent",
    "driver",
    "collector",
  ]);

  if (!profile || !profile.is_active || !staffRoles.has(profile.role)) {
    const { error: signOutError } = await supabase.auth.signOut();

    if (signOutError) {
      throw new Error(
        "ECOLOGIX could not close an unverified password recovery session.",
        { cause: signOutError },
      );
    }

    return (
      <RecoveryUnavailable message="This recovery link is not valid for an active ECOLOGIX staff account." />
    );
  }

  return (
    <main className="wp-auth-page">
      <div className="wp-auth-page__glow wp-auth-page__glow--one" />
      <div className="wp-auth-page__glow wp-auth-page__glow--two" />
      <section className="wp-auth-card">
        <header className="wp-auth-brand">
          <span className="wp-app-brand__mark">W</span>
          <span>ECOLOGIX</span>
          <em>Account recovery</em>
        </header>
        <div className="wp-auth-intro">
          <p className="wp-overline">Verified recovery link</p>
          <h1>Choose a new password.</h1>
          <p>
            Use a strong password that you have not used for another account.
          </p>
        </div>
        <StaffPasswordUpdateForm />
      </section>
    </main>
  );
}
