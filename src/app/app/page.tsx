import type { Metadata } from "next";
import Link from "next/link";

import { ConsumerAppShell } from "@/components/app/consumer-app-shell";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAppProfileSummary } from "@/lib/auth/app-profile-summary";

export const metadata: Metadata = {
  title: "ECOLOGIX Home",
  description: "Your ECOLOGIX dashboard for scans, pickups, and account activity.",
};

export const dynamic = "force-dynamic";

const homeActions = [
  {
    title: "Scan packaging",
    detail: "Identify materials and contribute a scan.",
    href: "/app/scan",
    icon: "M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3M8 12h8",
    tint: "border-sky-300/20 bg-sky-300/[0.07] text-sky-200",
  },
  {
    title: "Book a trash pickup",
    detail: "Choose what you need collected and a pickup time.",
    href: "/app/book",
    icon: "M8 2v4m8-4v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14H3V6a2 2 0 0 1 2-2Z",
    tint: "border-emerald-300/20 bg-emerald-300/[0.07] text-emerald-200",
  },
  {
    title: "Track a pickup",
    detail: "Check the latest status of a collection request.",
    href: "/app/track",
    icon: "M3 12h4l3-8 4 16 3-8h4",
    tint: "border-violet-300/20 bg-violet-300/[0.07] text-violet-200",
  },
  {
    title: "Your profile",
    detail: "Manage sign-in and review your ECOLOGIX activity.",
    href: "/app/account",
    icon: "M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2m6-10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z",
    tint: "border-amber-300/20 bg-amber-300/[0.07] text-amber-200",
  },
];

export default async function ConsumerAppPage() {
  const adminClient = createAdminClient();
  const [{ data: systemSettings }, profile] = await Promise.all([
    adminClient
      .from("system_settings")
      .select("public_collection_requests_enabled, maintenance_message")
      .eq("id", true)
      .maybeSingle(),
    getAppProfileSummary(),
  ]);

  return (
    <ConsumerAppShell profileName={profile.name} profileEmail={profile.email}>
      <main className="wp-consumer-app">
        <section className="wp-consumer-app__hero">
          <p className="wp-overline">Your ECOLOGIX dashboard</p>
          <h1>{profile.email ? `Welcome back, ${profile.name}.` : "Welcome to ECOLOGIX."}</h1>
          <p>Choose what you want to do today. Each action opens its own screen.</p>
        </section>

        {systemSettings?.public_collection_requests_enabled === false ? (
          <p role="status" className="rounded-2xl border border-amber-300/20 bg-amber-300/[0.08] px-4 py-3 text-sm leading-6 text-amber-100">
            {systemSettings.maintenance_message || "Pickup requests are temporarily paused. Please check again soon."}
          </p>
        ) : null}

        <section aria-label="Quick actions" className="grid grid-cols-2 gap-3">
          {homeActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className={`flex min-h-36 flex-col rounded-2xl border p-4 transition hover:-translate-y-0.5 hover:bg-white/[0.08] ${action.tint}`}
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d={action.icon} />
              </svg>
              <span className="mt-5 text-sm font-extrabold text-white">{action.title}</span>
              <span className="mt-1 text-xs leading-5 text-slate-400">{action.detail}</span>
            </Link>
          ))}
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">How ECOLOGIX works</p>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            Request a pickup, tell us what waste you have, and our operations team will review the request and confirm collection details.
          </p>
          <Link href="/app/explore" className="mt-3 inline-flex text-sm font-bold text-sky-300 hover:text-sky-200">
            Explore ECOLOGIX <span aria-hidden="true" className="ml-2">→</span>
          </Link>
        </section>
      </main>
    </ConsumerAppShell>
  );
}
