import { redirect } from "next/navigation";

import { logoutStaff } from "@/actions/auth/logout";
import { BuybackIntakeForm } from "@/components/agent/buyback-intake-form";
import { DepotIntakeAction } from "@/components/agent/depot-intake-action";
import { createClient } from "@/lib/supabase/server";

type IncomingDeliveryStatus =
  | "COLLECTED_PENDING_DEPOT"
  | "COMPLETED";

type IncomingDelivery = {
  id: string;
  requester_name: string;
  phone_number: string;
  neighbourhood: string;
  estimated_weight_kg: number | null;
  estimated_bag_count: number | null;
  actual_weight_kg: number | null;
  assigned_depot_id: string | null;
  assigned_driver_id: string | null;
  status: IncomingDeliveryStatus;
  requested_at: string;
  completed_at: string | null;
};

type AssignedDepot = {
  id: string;
  name: string;
  code: string;
  city: string;
  address_text: string | null;
  contact_phone_number: string | null;
};

function formatStatus(status: IncomingDeliveryStatus): string {
  switch (status) {
    case "COMPLETED":
      return "Intake completed";

    default:
      return "Waiting for intake";
  }
}

function getStatusStyles(status: IncomingDeliveryStatus): string {
  if (status === "COMPLETED") {
    return "border-emerald-400/20 bg-emerald-400/[0.08] text-emerald-300";
  }

  return "border-amber-400/20 bg-amber-400/[0.08] text-amber-300";
}

function formatWeight(weight: number | null): string {
  if (weight === null) {
    return "Not provided";
  }

  return `${new Intl.NumberFormat("en-CM", {
    maximumFractionDigits: 3,
  }).format(weight)} KG`;
}

function formatDate(dateValue: string): string {
  return new Intl.DateTimeFormat("en-CM", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateValue));
}

export default async function AgentDashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/app/staff-login");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select(
      `
        full_name,
        role,
        is_active,
        must_change_password,
        assigned_depot_id
      `,
    )
    .eq("id", user.id)
    .single();

  if (profileError || !profile || !profile.is_active) {
    await supabase.auth.signOut();
    redirect("/app/staff-login");
  }

  if (profile.must_change_password) {
    redirect("/app/change-password");
  }

  if (profile.role !== "agent") {
    await supabase.auth.signOut();
    redirect("/app/staff-login");
  }

  if (!profile.assigned_depot_id) {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-6 py-20 text-slate-100">
        <div className="pointer-events-none absolute -left-32 top-0 h-[30rem] w-[30rem] rounded-full bg-amber-400/10 blur-[140px]" />

        <section className="relative w-full max-w-3xl rounded-[2rem] border border-amber-400/20 bg-amber-400/[0.06] p-8 shadow-2xl backdrop-blur-xl sm:p-12">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-amber-400">
            Depot assignment required
          </p>

          <h1 className="mt-7 text-4xl font-black tracking-[-0.05em] text-white sm:text-5xl">
            Your account is not connected to an ECOLOGIX depot.
          </h1>

          <p className="mt-6 text-lg font-light leading-8 text-amber-100/70">
            Ask an ECOLOGIX administrator to assign your agent account to an
            operational recovery centre.
          </p>

          <form action={logoutStaff} className="mt-9">
            <button
              type="submit"
              className="min-h-12 rounded-2xl border border-white/10 bg-white/[0.05] px-6 py-3 text-xs font-black uppercase tracking-[0.18em] text-slate-300 transition-all duration-300 hover:-translate-y-1 hover:border-red-400/25 hover:bg-red-400/10 hover:text-red-200"
            >
              Sign out securely
            </button>
          </form>
        </section>
      </main>
    );
  }

  const { data: depotData, error: depotError } = await supabase
    .from("depots")
    .select(
      `
        id,
        name,
        code,
        city,
        address_text,
        contact_phone_number
      `,
    )
    .eq("id", profile.assigned_depot_id)
    .single();

  const depot: AssignedDepot | null = depotData
    ? {
        id: depotData.id,
        name: depotData.name,
        code: depotData.code,
        city: depotData.city,
        address_text: depotData.address_text,
        contact_phone_number: depotData.contact_phone_number,
      }
    : null;

  const { data: deliveryData, error: deliveryError } = await supabase
    .from("collection_requests")
    .select(
      `
        id,
        requester_name,
        phone_number,
        neighbourhood,
        estimated_weight_kg,
        estimated_bag_count,
        actual_weight_kg,
        assigned_depot_id,
        assigned_driver_id,
        status,
        requested_at,
        completed_at
      `,
    )
    .eq("assigned_depot_id", profile.assigned_depot_id)
    .in("status", [
      "COLLECTED_PENDING_DEPOT",
      "COMPLETED",
    ])
    .order("requested_at", {
      ascending: false,
    });

  const deliveries: IncomingDelivery[] = (deliveryData ?? []).map(
    (delivery) => ({
      id: delivery.id,
      requester_name: delivery.requester_name,
      phone_number: delivery.phone_number,
      neighbourhood: delivery.neighbourhood,
      estimated_weight_kg:
        delivery.estimated_weight_kg === null
          ? null
          : Number(delivery.estimated_weight_kg),
      estimated_bag_count: delivery.estimated_bag_count,
      actual_weight_kg:
        delivery.actual_weight_kg === null
          ? null
          : Number(delivery.actual_weight_kg),
      assigned_depot_id: delivery.assigned_depot_id,
      assigned_driver_id: delivery.assigned_driver_id,
      status: delivery.status as IncomingDeliveryStatus,
      requested_at: delivery.requested_at,
      completed_at: delivery.completed_at,
    }),
  );

  const pageError = depotError ?? deliveryError;

  const waitingCount = deliveries.filter(
    (delivery) =>
      delivery.status === "COLLECTED_PENDING_DEPOT",
  ).length;

  const completedCount = deliveries.filter(
    (delivery) => delivery.status === "COMPLETED",
  ).length;

  const estimatedIncomingWeight = deliveries
    .filter(
      (delivery) =>
        delivery.status === "COLLECTED_PENDING_DEPOT",
    )
    .reduce(
      (total, delivery) =>
        total + Number(delivery.estimated_weight_kg ?? 0),
      0,
    );

  return (
    <main className="wp-operational-page relative min-h-screen overflow-hidden bg-slate-950 px-5 py-6 text-slate-100 sm:px-8 sm:py-8">
      <div className="pointer-events-none fixed -left-40 top-0 h-[34rem] w-[34rem] rounded-full bg-emerald-400/[0.08] blur-[150px]" />

      <div className="pointer-events-none fixed -right-40 bottom-0 h-[38rem] w-[38rem] rounded-full bg-sky-400/[0.07] blur-[170px]" />

      <div className="wp-operational-content relative mx-auto w-full max-w-7xl">
        <header id="profile" className="flex flex-col gap-6 rounded-[2rem] border border-white/10 bg-slate-900/60 p-6 shadow-2xl backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.9)]" />

              <p className="text-xs font-black uppercase tracking-[0.3em] text-emerald-400">
                ECOLOGIX depot operations
              </p>
            </div>

            <h1 className="mt-5 text-3xl font-black tracking-[-0.045em] text-white sm:text-4xl">
              Welcome, {profile.full_name ?? "ECOLOGIX Agent"}.
            </h1>

            <p className="mt-3 text-sm font-light text-slate-400">
              {depot
                ? `${depot.code} · ${depot.name}`
                : "Assigned depot unavailable"}
            </p>
          </div>

          <form action={logoutStaff}>
            <button
              type="submit"
              className="min-h-12 w-full rounded-2xl border border-white/10 bg-white/[0.05] px-6 py-3 text-xs font-black uppercase tracking-[0.18em] text-slate-300 transition-all duration-300 hover:-translate-y-1 hover:border-red-400/25 hover:bg-red-400/10 hover:text-red-200 sm:w-auto"
            >
              Sign out securely
            </button>
          </form>
        </header>

        <div className="mt-6">
          <BuybackIntakeForm />
        </div>

        <section id="collection" className="mt-6 grid gap-5 sm:grid-cols-3">
          <article className="rounded-3xl border border-amber-400/15 bg-amber-400/[0.06] p-6 shadow-2xl">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-amber-400/70">
              Waiting for intake
            </p>

            <p className="mt-5 text-4xl font-black tracking-[-0.05em] text-white">
              {waitingCount}
            </p>

            <p className="mt-3 text-sm text-amber-200/70">
              Driver deliveries at this depot
            </p>
          </article>

          <article className="rounded-3xl border border-sky-400/15 bg-sky-400/[0.06] p-6 shadow-2xl">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-sky-400/70">
              Estimated incoming
            </p>

            <p className="mt-5 text-4xl font-black tracking-[-0.05em] text-white">
              {new Intl.NumberFormat("en-CM", {
                maximumFractionDigits: 3,
              }).format(estimatedIncomingWeight)}
            </p>

            <p className="mt-3 text-sm text-sky-200/70">
              Kilograms awaiting verification
            </p>
          </article>

          <article className="rounded-3xl border border-emerald-400/15 bg-emerald-400/[0.06] p-6 shadow-2xl">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-400/70">
              Completed intake
            </p>

            <p className="mt-5 text-4xl font-black tracking-[-0.05em] text-white">
              {completedCount}
            </p>

            <p className="mt-3 text-sm text-emerald-200/70">
              Verified depot deliveries
            </p>
          </article>
        </section>

        <section id="wallet" className="mt-6 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.035] shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col gap-4 border-b border-white/10 px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.28em] text-amber-400">
                Incoming deliveries
              </p>

              <h2 className="mt-3 text-2xl font-black tracking-[-0.035em] text-white">
                Material awaiting depot intake
              </h2>
            </div>

            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />

              <span className="text-[0.62rem] font-black uppercase tracking-[0.18em] text-slate-400">
                Live Supabase queue
              </span>
            </span>
          </div>

          {pageError ? (
            <div className="m-6 rounded-3xl border border-red-400/20 bg-red-400/10 p-6 sm:m-8">
              <p className="text-sm font-bold text-red-200">
                ECOLOGIX could not load the depot delivery queue.
              </p>

              <p className="mt-2 text-sm leading-6 text-red-200/70">
                {pageError.message}
              </p>
            </div>
          ) : deliveries.length === 0 ? (
            <div className="flex min-h-80 items-center justify-center px-6 py-16 text-center">
              <div className="max-w-md">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl border border-white/10 bg-white/[0.035] text-xs font-black tracking-[0.18em] text-slate-600">
                  INTAKE
                </div>

                <h3 className="mt-6 text-xl font-black text-white">
                  No deliveries waiting
                </h3>

                <p className="mt-3 text-sm font-light leading-7 text-slate-500">
                  Collected plastic will appear here after an assigned driver
                  confirms collection and travels to this depot.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid gap-5 p-6 sm:p-8 xl:grid-cols-2">
              {deliveries.map((delivery) => (
                <article
                  key={delivery.id}
                  className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-amber-400/20 hover:shadow-2xl hover:shadow-amber-500/[0.06]"
                >
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.22em] text-amber-400">
                        {delivery.neighbourhood}
                      </p>

                      <h3 className="mt-3 text-2xl font-black tracking-[-0.035em] text-white">
                        {delivery.requester_name}
                      </h3>

                      <p className="mt-3 text-sm text-slate-500">
                        {delivery.phone_number}
                      </p>
                    </div>

                    <span
                      className={`inline-flex w-fit rounded-full border px-3 py-1.5 text-xs font-bold ${getStatusStyles(
                        delivery.status,
                      )}`}
                    >
                      {formatStatus(delivery.status)}
                    </span>
                  </div>

                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-4">
                      <p className="text-[0.6rem] font-black uppercase tracking-[0.18em] text-slate-600">
                        Estimated weight
                      </p>

                      <p className="mt-2 text-sm font-bold text-white">
                        {formatWeight(
                          delivery.estimated_weight_kg,
                        )}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-4">
                      <p className="text-[0.6rem] font-black uppercase tracking-[0.18em] text-slate-600">
                        Estimated bags
                      </p>

                      <p className="mt-2 text-sm font-bold text-white">
                        {delivery.estimated_bag_count ??
                          "Not provided"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.025] p-4">
                    <p className="text-[0.6rem] font-black uppercase tracking-[0.18em] text-slate-600">
                      Assigned depot
                    </p>

                    <p className="mt-2 text-sm font-bold text-white">
                      {depot?.name ?? "ECOLOGIX depot"}
                    </p>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {depot?.address_text ??
                        "Depot address unavailable"}
                    </p>
                  </div>

                  <p className="mt-5 text-xs text-slate-600">
                    Requested {formatDate(delivery.requested_at)}
                  </p>

                  {delivery.status ===
                  "COLLECTED_PENDING_DEPOT" ? (
                    <DepotIntakeAction requestId={delivery.id} />
                  ) : (
                    <>
                    <button
                      type="button"
                      disabled
                      className="mt-6 min-h-14 w-full cursor-not-allowed rounded-2xl border border-emerald-300/15 bg-emerald-400/50 px-6 py-4 text-xs font-black uppercase tracking-[0.18em] text-slate-950 opacity-60"
                    >
                      Start depot intake — next
                    </button>
                    <div className="mt-6 rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.08] p-5">
                      <p className="text-sm font-bold text-emerald-200">
                        This delivery has completed depot intake.
                      </p>

                      {delivery.actual_weight_kg !== null ? (
                        <p className="mt-2 text-sm text-emerald-100/60">
                          Verified weight:{" "}
                          {formatWeight(delivery.actual_weight_kg)}
                        </p>
                      ) : null}
                    </div>
                    </>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
