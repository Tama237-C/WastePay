import { redirect } from "next/navigation";

import { logoutStaff } from "@/actions/auth/logout";
import { PickupStatusActions } from "@/components/driver/pickup-status-actions";
import { createClient } from "@/lib/supabase/server";

type DriverPickupStatus =
  | "ASSIGNED"
  | "IN_TRANSIT"
  | "COLLECTED_PENDING_DEPOT"
  | "COMPLETED";

type DriverPickup = {
  id: string;
  requester_name: string;
  phone_number: string;
  neighbourhood: string;
  estimated_weight_kg: number | null;
  estimated_bag_count: number | null;
  assigned_depot_id: string | null;
  status: DriverPickupStatus;
  requested_at: string;
};

type DepotRecord = {
  id: string;
  name: string;
  code: string;
  address_text: string | null;
  contact_phone_number: string | null;
};

function formatStatus(status: DriverPickupStatus): string {
  switch (status) {
    case "IN_TRANSIT":
      return "In transit";

    case "COLLECTED_PENDING_DEPOT":
      return "Deliver to depot";

    case "COMPLETED":
      return "Completed";

    default:
      return "Assigned";
  }
}

function getStatusStyles(status: DriverPickupStatus): string {
  switch (status) {
    case "COMPLETED":
      return "border-emerald-400/20 bg-emerald-400/[0.08] text-emerald-300";

    case "IN_TRANSIT":
      return "border-sky-400/20 bg-sky-400/[0.08] text-sky-300";

    case "COLLECTED_PENDING_DEPOT":
      return "border-amber-400/20 bg-amber-400/[0.08] text-amber-300";

    default:
      return "border-violet-400/20 bg-violet-400/[0.08] text-violet-300";
  }
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

export default async function DriverDashboardPage() {
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
      "full_name, role, is_active, must_change_password, active_location_zone",
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

  if (profile.role !== "driver") {
    await supabase.auth.signOut();
    redirect("/app/staff-login");
  }

  const { data: pickupData, error: pickupError } = await supabase
    .from("collection_requests")
    .select(
      `
        id,
        requester_name,
        phone_number,
        neighbourhood,
        estimated_weight_kg,
        estimated_bag_count,
        assigned_depot_id,
        status,
        requested_at
      `,
    )
    .eq("assigned_driver_id", user.id)
    .in("status", [
      "ASSIGNED",
      "IN_TRANSIT",
      "COLLECTED_PENDING_DEPOT",
      "COMPLETED",
    ])
    .order("requested_at", { ascending: false });

  const pickups: DriverPickup[] = (pickupData ?? []).map(
    (pickup) => ({
      id: pickup.id,
      requester_name: pickup.requester_name,
      phone_number: pickup.phone_number,
      neighbourhood: pickup.neighbourhood,
      estimated_weight_kg:
        pickup.estimated_weight_kg === null
          ? null
          : Number(pickup.estimated_weight_kg),
      estimated_bag_count: pickup.estimated_bag_count,
      assigned_depot_id: pickup.assigned_depot_id,
      status: pickup.status as DriverPickupStatus,
      requested_at: pickup.requested_at,
    }),
  );

  const depotIds = Array.from(
    new Set(
      pickups
        .map((pickup) => pickup.assigned_depot_id)
        .filter((depotId): depotId is string => Boolean(depotId)),
    ),
  );

  let depots: DepotRecord[] = [];
  let depotError: { message: string } | null = null;

  if (depotIds.length > 0) {
    const depotResponse = await supabase
      .from("depots")
      .select(
        "id, name, code, address_text, contact_phone_number",
      )
      .in("id", depotIds);

    depotError = depotResponse.error;

    depots = (depotResponse.data ?? []).map((depot) => ({
      id: depot.id,
      name: depot.name,
      code: depot.code,
      address_text: depot.address_text,
      contact_phone_number: depot.contact_phone_number,
    }));
  }

  const pageError = pickupError ?? depotError;

  const depotsById = new Map(
    depots.map((depot) => [depot.id, depot]),
  );

  const activePickupCount = pickups.filter(
    (pickup) =>
      pickup.status === "ASSIGNED" ||
      pickup.status === "IN_TRANSIT",
  ).length;

  const depotDeliveryCount = pickups.filter(
    (pickup) =>
      pickup.status === "COLLECTED_PENDING_DEPOT",
  ).length;

  const completedCount = pickups.filter(
    (pickup) => pickup.status === "COMPLETED",
  ).length;

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 px-5 py-6 text-slate-100 sm:px-8 sm:py-8">
      <div className="pointer-events-none fixed -left-40 top-0 h-[34rem] w-[34rem] rounded-full bg-sky-400/[0.08] blur-[150px]" />

      <div className="pointer-events-none fixed -right-40 bottom-0 h-[38rem] w-[38rem] rounded-full bg-violet-400/[0.07] blur-[170px]" />

      <div className="relative mx-auto w-full max-w-6xl">
        <header className="flex flex-col gap-5 rounded-[2rem] border border-white/10 bg-slate-900/60 p-6 shadow-2xl backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-2.5 w-2.5 rounded-full bg-sky-400 shadow-[0_0_18px_rgba(56,189,248,0.9)]" />

              <p className="text-xs font-black uppercase tracking-[0.3em] text-sky-400">
                WastePay field logistics
              </p>
            </div>

            <h1 className="mt-5 text-3xl font-black tracking-[-0.045em] text-white sm:text-4xl">
              Welcome, {profile.full_name ?? "WastePay Driver"}.
            </h1>

            <p className="mt-3 text-sm font-light text-slate-400">
              {profile.active_location_zone ??
                "No operational zone assigned"}
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

        <section className="mt-6 grid gap-5 sm:grid-cols-3">
          <article className="rounded-3xl border border-sky-400/15 bg-sky-400/[0.06] p-6 shadow-2xl">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-sky-400/70">
              Active pickups
            </p>

            <p className="mt-5 text-4xl font-black tracking-[-0.05em] text-white">
              {activePickupCount}
            </p>

            <p className="mt-3 text-sm text-sky-200/70">
              Assigned or currently in transit
            </p>
          </article>

          <article className="rounded-3xl border border-amber-400/15 bg-amber-400/[0.06] p-6 shadow-2xl">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-amber-400/70">
              Depot delivery
            </p>

            <p className="mt-5 text-4xl font-black tracking-[-0.05em] text-white">
              {depotDeliveryCount}
            </p>

            <p className="mt-3 text-sm text-amber-200/70">
              Collected material awaiting intake
            </p>
          </article>

          <article className="rounded-3xl border border-emerald-400/15 bg-emerald-400/[0.06] p-6 shadow-2xl">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-400/70">
              Completed
            </p>

            <p className="mt-5 text-4xl font-black tracking-[-0.05em] text-white">
              {completedCount}
            </p>

            <p className="mt-3 text-sm text-emerald-200/70">
              Reconciled pickup history
            </p>
          </article>
        </section>

        <section className="mt-6 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.035] shadow-2xl backdrop-blur-xl">
          <div className="border-b border-white/10 px-6 py-6 sm:px-8">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-violet-400">
              My pickup queue
            </p>

            <h2 className="mt-3 text-2xl font-black tracking-[-0.035em] text-white">
              Assigned collection requests
            </h2>
          </div>

          {pageError ? (
            <div className="m-6 rounded-3xl border border-red-400/20 bg-red-400/10 p-6 sm:m-8">
              <p className="text-sm font-bold text-red-200">
                WastePay could not load your pickup queue.
              </p>

              <p className="mt-2 text-sm leading-6 text-red-200/70">
                {pageError.message}
              </p>
            </div>
          ) : pickups.length === 0 ? (
            <div className="flex min-h-80 items-center justify-center px-6 py-16 text-center">
              <div className="max-w-md">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl border border-white/10 bg-white/[0.035] text-xs font-black tracking-[0.18em] text-slate-600">
                  ROUTE
                </div>

                <h3 className="mt-6 text-xl font-black text-white">
                  No pickups assigned
                </h3>

                <p className="mt-3 text-sm font-light leading-7 text-slate-500">
                  New approved pickups will appear here when WastePay dispatch
                  assigns them to your driver account.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid gap-5 p-6 sm:p-8 lg:grid-cols-2">
              {pickups.map((pickup) => {
                const depot = pickup.assigned_depot_id
                  ? depotsById.get(pickup.assigned_depot_id)
                  : undefined;

                return (
                  <article
                    key={pickup.id}
                    className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-sky-400/20 hover:shadow-2xl hover:shadow-sky-500/[0.06]"
                  >
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-xs font-black uppercase tracking-[0.22em] text-sky-400">
                          {pickup.neighbourhood}
                        </p>

                        <h3 className="mt-3 text-2xl font-black tracking-[-0.035em] text-white">
                          {pickup.requester_name}
                        </h3>

                        <p className="mt-3 text-sm text-slate-500">
                          {pickup.phone_number}
                        </p>
                      </div>

                      <span
                        className={`inline-flex w-fit rounded-full border px-3 py-1.5 text-xs font-bold ${getStatusStyles(
                          pickup.status,
                        )}`}
                      >
                        {formatStatus(pickup.status)}
                      </span>
                    </div>

                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                      <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-4">
                        <p className="text-[0.6rem] font-black uppercase tracking-[0.18em] text-slate-600">
                          Estimated weight
                        </p>

                        <p className="mt-2 text-sm font-bold text-white">
                          {formatWeight(
                            pickup.estimated_weight_kg,
                          )}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-4">
                        <p className="text-[0.6rem] font-black uppercase tracking-[0.18em] text-slate-600">
                          Estimated bags
                        </p>

                        <p className="mt-2 text-sm font-bold text-white">
                          {pickup.estimated_bag_count ??
                            "Not provided"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 rounded-2xl border border-violet-400/15 bg-violet-400/[0.06] p-5">
                      <p className="text-[0.62rem] font-black uppercase tracking-[0.2em] text-violet-300">
                        Assigned depot
                      </p>

                      <p className="mt-3 font-bold text-white">
                        {depot?.name ?? "WastePay depot"}
                      </p>

                      <p className="mt-2 text-sm leading-6 text-slate-500">
                        {depot?.address_text ??
                          "Depot address unavailable"}
                      </p>

                      {depot?.contact_phone_number ? (
                        <p className="mt-2 text-sm text-slate-500">
                          {depot.contact_phone_number}
                        </p>
                      ) : null}
                    </div>

                    <p className="mt-5 text-xs text-slate-600">
                      Requested {formatDate(pickup.requested_at)}
                    </p>

                    {pickup.status === "ASSIGNED" ||
                    pickup.status === "IN_TRANSIT" ? (
                      <PickupStatusActions
                        requestId={pickup.id}
                        requestStatus={pickup.status}
                      />
                    ) : pickup.status ===
                      "COLLECTED_PENDING_DEPOT" ? (
                      <div className="mt-6 rounded-2xl border border-amber-400/20 bg-amber-400/[0.08] p-5">
                        <p className="text-sm font-bold text-amber-200">
                          Deliver the collected plastic to{" "}
                          {depot?.name ?? "the assigned depot"}.
                        </p>

                        <p className="mt-2 text-sm leading-6 text-amber-100/60">
                          A depot agent must weigh and verify the material before
                          the pickup can be completed.
                        </p>
                      </div>
                    ) : (
                      <div className="mt-6 rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.08] p-5">
                        <p className="text-sm font-bold text-emerald-200">
                          Pickup completed and reconciled.
                        </p>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}