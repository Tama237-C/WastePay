import type { Metadata } from "next";

import { ConsumerAppShell } from "@/components/app/consumer-app-shell";
import { CollectionTracking } from "@/components/app/collection-tracking";
import { getAppProfileSummary } from "@/lib/auth/app-profile-summary";

export const metadata: Metadata = { title: "Track a Pickup | ECOLOGIX" };
export const dynamic = "force-dynamic";

export default async function TrackPickupPage() {
  const profile = await getAppProfileSummary();
  return (
    <ConsumerAppShell profileName={profile.name} profileEmail={profile.email}>
      <main className="wp-consumer-app">
        <section className="wp-consumer-app__hero">
          <p className="wp-overline">Pickup tracking</p>
          <h1>Track your request.</h1>
          <p>Enter the collection reference and phone number used when booking to see the latest status.</p>
        </section>
        <CollectionTracking />
      </main>
    </ConsumerAppShell>
  );
}
