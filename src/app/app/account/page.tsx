import type { Metadata } from "next";
import { ConsumerAppShell } from "@/components/app/consumer-app-shell";
import { CustomerAuthForm } from "@/components/app/customer-auth-form";
import { createClient } from "@/lib/supabase/server";
import { logoutCustomer } from "@/actions/auth/customer-auth";

export const metadata: Metadata = {
  title: "WastePay Account",
  description: "Sign in or create a general WastePay account.",
};

export default async function CustomerAccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, phone_number, role")
      .eq("id", user.id)
      .maybeSingle();

    if (profile?.role === "resident") {
      const { data: requests } = await supabase
        .from("collection_requests")
        .select(
          "id, status, neighbourhood, estimated_bag_count, estimated_weight_kg, requested_at, preferred_pickup_start, preferred_pickup_end",
        )
        .eq("resident_profile_id", user.id)
        .order("requested_at", { ascending: false });

      return (
        <ConsumerAppShell>
          <main className="wp-consumer-app">
            <section className="wp-consumer-app__hero">
              <p className="wp-overline">WastePay account</p>
              <h1>{profile.full_name || "Your account"}</h1>
              <p>{profile.phone_number || "Phone number not provided"}</p>
              <form action={logoutCustomer} className="mt-6">
                <button type="submit" className="wp-secondary-button">
                  Sign out
                </button>
              </form>
            </section>
            <section className="wp-consumer-app__section">
              <div className="wp-consumer-app__section-heading">
                <p className="wp-overline">My pickups</p>
                <h2>Your collection requests</h2>
              </div>
              {requests?.length ? (
                <div className="wp-my-pickups">
                  {requests.map((request) => (
                    <article key={request.id}>
                      <div>
                        <p className="wp-overline">
                          WP-PICKUP-{request.id.slice(0, 8).toUpperCase()}
                        </p>
                        <h3>{request.neighbourhood}</h3>
                        <p>
                          {request.estimated_bag_count} bags ·{" "}
                          {Number(request.estimated_weight_kg).toLocaleString(
                            "en-CM",
                          )}{" "}
                          KG
                        </p>
                      </div>
                      <span className="wp-status-dot">{request.status}</span>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="wp-my-pickups__empty">
                  Your pickup requests will appear here after you book one.
                </p>
              )}
            </section>
          </main>
        </ConsumerAppShell>
      );
    }
  }

  return (
    <ConsumerAppShell>
      <main className="wp-consumer-app">
        <section className="wp-consumer-app__hero">
          <p className="wp-overline">WastePay account</p>
          <h1>Sign in or create your account.</h1>
          <p>
            Save your pickup details and keep your WastePay activity together.
          </p>
        </section>
        <CustomerAuthForm />
      </main>
    </ConsumerAppShell>
  );
}
