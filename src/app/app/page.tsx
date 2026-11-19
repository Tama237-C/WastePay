import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AppInstallCard } from "@/components/app/install-app-card";
import { ConsumerAppShell } from "@/components/app/consumer-app-shell";
import { CollectionRequestForm } from "@/components/marketing/collection-request-form";
import { createAdminClient } from "@/lib/supabase/admin";
import { CollectionTracking } from "@/components/app/collection-tracking";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "WastePay App",
  description: "Book and track plastic collection with WastePay.",
};

export default async function ConsumerAppPage() {
  const supabase = await createClient();
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();
  const authResult =
    session && !sessionError ? await supabase.auth.getUser() : null;
  const user = authResult?.data.user ?? null;
  const authError = sessionError ?? authResult?.error ?? null;

  if (authError) {
    console.error(
      "WastePay could not verify the current sign-in; showing the guest app.",
      authError,
    );
  }

  if (user && !authError) {
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role, is_active, must_change_password")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError) {
      throw new Error("WastePay could not load the signed-in user’s role.", {
        cause: profileError,
      });
    }

    const dashboardPaths: Record<string, string> = {
      admin: "/admin/overview",
      manager: "/app/manager",
      agent: "/app/agent",
      driver: "/app/driver",
      collector: "/app/collector",
    };
    const dashboardPath = profile ? dashboardPaths[profile.role] : undefined;

    if (dashboardPath && profile?.is_active) {
      if (profile.must_change_password) {
        redirect("/app/change-password");
      }

      redirect(dashboardPath);
    }
  }

  const adminClient = createAdminClient();
  const { data: systemSettings } = await adminClient
    .from("system_settings")
    .select(
      "minimum_pickup_weight_kg, maximum_schedule_days, public_collection_requests_enabled, maintenance_message",
    )
    .eq("id", true)
    .maybeSingle();

  return (
    <ConsumerAppShell>
      <main className="wp-consumer-app">
        <section id="home" className="wp-consumer-app__hero">
          {authError ? (
            <p
              role="status"
              className="mb-6 rounded-2xl border border-amber-400/20 bg-amber-400/[0.08] p-4 text-sm leading-6 text-amber-100"
            >
              We could not check your sign-in just now, so this is the guest
              app. You can still book a pickup. Please try your account again
              shortly.
            </p>
          ) : null}
          <p className="wp-overline">Your WastePay app</p>
          <h1>Make recovery part of your day.</h1>
          <p>
            Book a plastic pickup, follow its progress, and take part in
            Cameroon’s circular economy.
          </p>
          <div className="wp-consumer-app__actions">
            <Link href="#pickup" className="wp-primary-button">
              Book a pickup <span aria-hidden="true">→</span>
            </Link>
            <Link href="#track" className="wp-secondary-button">
              Track a pickup
            </Link>
          </div>
          <p className="wp-consumer-app__guest-note">
            You can book as a guest. Keep your reference and phone number to
            track your request.
          </p>
        </section>

        <section id="install" className="scroll-mt-6">
          <AppInstallCard />
        </section>

        <section id="pickup" className="wp-consumer-app__section scroll-mt-6">
          <div className="wp-consumer-app__section-heading">
            <p className="wp-overline">Request a collection</p>
            <h2>Book a plastic pickup.</h2>
            <p>
              Tell us what you have, choose a preferred pickup window, and
              share the pickup location.
            </p>
          </div>
          {systemSettings?.public_collection_requests_enabled === false ? (
            <div className="rounded-3xl border border-amber-400/20 bg-amber-400/[0.08] p-6 text-sm leading-7 text-amber-100">
              {systemSettings.maintenance_message ||
                "Collection requests are temporarily paused. Please check back soon."}
            </div>
          ) : (
            <CollectionRequestForm
              minimumPickupWeightKg={Number(
                systemSettings?.minimum_pickup_weight_kg ?? 15,
              )}
              maximumScheduleDays={Number(
                systemSettings?.maximum_schedule_days ?? 30,
              )}
              maintenanceMessage={systemSettings?.maintenance_message}
            />
          )}
        </section>

        <section id="track" className="wp-consumer-app__section scroll-mt-6">
          <div className="wp-consumer-app__section-heading">
            <p className="wp-overline">Pickup tracking</p>
            <h2>See where your pickup stands.</h2>
            <p>
              Enter the reference from your booking and the phone number you
              used to submit it.
            </p>
          </div>
          <CollectionTracking />
        </section>
      </main>
    </ConsumerAppShell>
  );
}
