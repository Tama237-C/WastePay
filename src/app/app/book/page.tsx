import type { Metadata } from "next";

import { ConsumerAppShell } from "@/components/app/consumer-app-shell";
import { CollectionRequestForm } from "@/components/marketing/collection-request-form";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAppProfileSummary } from "@/lib/auth/app-profile-summary";

export const metadata: Metadata = { title: "Book a Pickup | ECOLOGIX" };
export const dynamic = "force-dynamic";

export default async function BookPickupPage() {
  const admin = createAdminClient();
  const [{ data: settings }, profile] = await Promise.all([
    admin.from("system_settings").select("minimum_pickup_weight_kg, maximum_schedule_days, public_collection_requests_enabled, maintenance_message").eq("id", true).maybeSingle(),
    getAppProfileSummary(),
  ]);

  return (
    <ConsumerAppShell profileName={profile.name} profileEmail={profile.email}>
      <main className="wp-consumer-app">
        <section className="wp-consumer-app__hero">
          <p className="wp-overline">Collection booking</p>
          <h1>Book a trash pickup.</h1>
          <p>Tell us what you need collected and when. Our operations team will review your request and confirm the collection details.</p>
        </section>
        <CollectionRequestForm
          minimumPickupWeightKg={Number(settings?.minimum_pickup_weight_kg ?? 15)}
          maximumScheduleDays={Number(settings?.maximum_schedule_days ?? 30)}
          maintenanceMessage={settings?.maintenance_message}
        />
      </main>
    </ConsumerAppShell>
  );
}
