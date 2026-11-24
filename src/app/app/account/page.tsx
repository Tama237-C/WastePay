import type { Metadata } from "next";
import Link from "next/link";
import { ConsumerAppShell } from "@/components/app/consumer-app-shell";
import { CustomerAuthForm } from "@/components/app/customer-auth-form";
import { createClient } from "@/lib/supabase/server";
import { logoutCustomer } from "@/actions/auth/customer-auth";

export const metadata: Metadata = {
  title: "ECOLOGIX Account",
  description: "Sign in or create a general ECOLOGIX account.",
};

export const dynamic = "force-dynamic";

function AccountLoadError({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  return (
    <ConsumerAppShell>
      <main className="wp-consumer-app">
        <section className="wp-consumer-app__hero">
          <p className="wp-overline">Account unavailable</p>
          <h1>{title}</h1>
          <p role="alert">{message}</p>
          <Link href="/app" className="wp-primary-button mt-6">
            Return to the app
          </Link>
        </section>
      </main>
    </ConsumerAppShell>
  );
}

function describeAccountReadError(
  area: "profile" | "pickup history",
  code: string | undefined,
): string {
  if (area === "pickup history" && (code === "42703" || code === "PGRST204")) {
    return `ECOLOGIX could not load pickup history because a required database field is missing (error ${code}). Ask the administrator to verify the customer-account migration in Supabase.`;
  }

  if (code === "42501") {
    return `The database denied access to your ${area} (error ${code}). Contact ECOLOGIX support and share this code.`;
  }

  return code
    ? `ECOLOGIX could not load your ${area} (error ${code}). Refresh the page; if the problem continues, contact support and share this code.`
    : `ECOLOGIX could not load your ${area}. Refresh the page; if the problem continues, contact support.`;
}

export default async function CustomerAccountPage() {
  let supabase;

  try {
    supabase = await createClient();
  } catch (error) {
    console.error("ECOLOGIX could not initialize the account service.", {
      message: error instanceof Error ? error.message : "Unknown configuration error",
    });
    return (
      <AccountLoadError
        title="We could not load your sign-in."
        message="The account service is not configured correctly. Refresh the page; if the problem continues, contact ECOLOGIX support."
      />
    );
  }

  let sessionResult;

  try {
    sessionResult = await supabase.auth.getSession();
  } catch (error) {
    console.error("ECOLOGIX could not connect to the account service.", {
      message: error instanceof Error ? error.message : "Unknown connection error",
    });
    return (
      <AccountLoadError
        title="We could not connect to your account."
        message="ECOLOGIX could not reach the sign-in service. Check your internet connection and refresh the page."
      />
    );
  }

  const {
    data: { session },
    error: sessionError,
  } = sessionResult;

  if (sessionError) {
    console.error("ECOLOGIX could not load the account page session.", {
      code: sessionError.code,
      message: sessionError.message,
    });
    return (
      <AccountLoadError
        title="We could not load your sign-in."
        message={
          sessionError.code
            ? `The account service returned error ${sessionError.code}. Refresh the page or sign in again.`
            : "The account service could not verify your sign-in. Refresh the page or sign in again."
        }
      />
    );
  }

  let authResult;

  if (session) {
    try {
      authResult = await supabase.auth.getUser();
    } catch (error) {
      console.error("ECOLOGIX could not verify the account page user.", {
        message: error instanceof Error ? error.message : "Unknown connection error",
      });
      return (
        <AccountLoadError
          title="We could not verify your sign-in."
          message="ECOLOGIX could not reach the account service. Check your internet connection and refresh the page."
        />
      );
    }
  }
  const userError = authResult?.error;
  const user = authResult?.data.user ?? null;

  if (userError) {
    console.error("ECOLOGIX could not verify the account page user.", {
      code: userError.code,
      message: userError.message,
    });
    return (
      <AccountLoadError
        title="We could not verify your sign-in."
        message={
          userError.code
            ? `The account service returned error ${userError.code}. Refresh the page or sign in again.`
            : "The account service could not verify your sign-in. Refresh the page or sign in again."
        }
      />
    );
  }

  if (user) {
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("full_name, phone_number, role")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError) {
      console.error("ECOLOGIX could not load the customer account profile.", {
        code: profileError.code,
        message: profileError.message,
      });
      return (
        <AccountLoadError
          title="We could not load your account."
          message={describeAccountReadError("profile", profileError.code)}
        />
      );
    }

    if (profile?.role === "resident") {
      const { data: requests, error: requestsError } = await supabase
        .from("collection_requests")
        .select(
          "id, status, neighbourhood, estimated_bag_count, estimated_weight_kg, requested_at, preferred_pickup_start, preferred_pickup_end",
        )
        .eq("resident_profile_id", user.id)
        .order("requested_at", { ascending: false });

      if (requestsError) {
        console.error("ECOLOGIX could not load customer pickup history.", {
          code: requestsError.code,
          message: requestsError.message,
        });
        return (
          <AccountLoadError
            title="We could not load your pickups."
            message={describeAccountReadError(
              "pickup history",
              requestsError.code,
            )}
          />
        );
      }

      return (
        <ConsumerAppShell>
          <main className="wp-consumer-app">
            <section className="wp-consumer-app__hero">
              <p className="wp-overline">ECOLOGIX account</p>
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

    if (profile) {
      const staffRoleLabels: Record<string, string> = {
        admin: "Administrator",
        manager: "Depot manager",
        agent: "Depot agent",
        driver: "Driver",
        collector: "Collector",
      };

      return (
        <ConsumerAppShell>
          <main className="wp-consumer-app">
            <section className="wp-consumer-app__hero">
              <p className="wp-overline">Staff account</p>
              <h1>{profile.full_name || "Your ECOLOGIX staff account"}</h1>
              <p>
                This is your {staffRoleLabels[profile.role] ?? "staff"} account.
                Staff and customer accounts are separate. You can still book a
                pickup from the app home as a guest.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/app/workspaces" className="wp-primary-button">
                  Open my staff workspace
                </Link>
                <form action={logoutCustomer}>
                  <button type="submit" className="wp-secondary-button">
                    Sign out
                  </button>
                </form>
              </div>
            </section>
          </main>
        </ConsumerAppShell>
      );
    }
  }

  return <CustomerAuthForm />;
}
