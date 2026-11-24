import Link from "next/link";

import { ConsumerAppShell } from "@/components/app/consumer-app-shell";
import { getAppProfileSummary } from "@/lib/auth/app-profile-summary";

export async function AppInfoPage({ title, description, children }: { title: string; description: string; children?: React.ReactNode }) {
  const profile = await getAppProfileSummary();
  return (
    <ConsumerAppShell profileName={profile.name} profileEmail={profile.email}>
      <main className="wp-consumer-app">
        <section className="wp-consumer-app__hero">
          <p className="wp-overline">ECOLOGIX</p>
          <h1>{title}</h1>
          <p>{description}</p>
        </section>
        {children ? <section className="wp-consumer-app__section">{children}</section> : null}
        <Link href="/app" className="text-sm font-bold text-sky-300">Back to Home →</Link>
      </main>
    </ConsumerAppShell>
  );
}
