import { AssignCollectionDriver } from "@/components/admin/assign-collection-driver";
import { BuybackReviewAction } from "@/components/manager/buyback-review-action";
import { QueuePayoutAction } from "@/components/manager/queue-payout-action";
import { redirect } from "next/navigation";

import { logoutStaff } from "@/actions/auth/logout";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

type CollectionRequest = {
  id: string;
  requester_name: string;
  requester_type: string;
  phone_number: string;
  neighbourhood: string;
  estimated_weight_kg: number | null;
  estimated_bag_count: number | null;
  status: string;
  requested_at: string;
  preferred_pickup_start: string | null;
  preferred_pickup_end: string | null;
};

type Driver = {
  id: string;
  full_name: string | null;
  phone_number: string | null;
  active_location_zone: string | null;
};

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("en-CM", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatWeight(value: number | null): string {
  return value === null ? "Not provided" : `${Number(value).toLocaleString("en-CM")} KG`;
}

export default async function ManagerDashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/app/staff-login");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("full_name, role, is_active, must_change_password, assigned_depot_id")
    .eq("id", user.id)
    .single();

  if (
    profileError ||
    !profile ||
    profile.role !== "manager" ||
    !profile.is_active ||
    !profile.assigned_depot_id
  ) {
    await supabase.auth.signOut();
    redirect("/app/staff-login");
  }

  if (profile.must_change_password) {
    redirect("/app/change-password");
  }

  const adminClient = createAdminClient();

  const [{ data: depot }, { data: requestsData, error: requestsError }, { data: driversData, error: driversError }, { data: buybackData, error: buybackError }, { data: approvedBuybacks }] =
    await Promise.all([
      adminClient
        .from("depots")
        .select("name, code")
        .eq("id", profile.assigned_depot_id)
        .single(),
      adminClient
        .from("collection_requests")
        .select(
          "id, requester_name, requester_type, phone_number, neighbourhood, estimated_weight_kg, estimated_bag_count, status, requested_at, preferred_pickup_start, preferred_pickup_end",
        )
        .eq("assigned_depot_id", profile.assigned_depot_id)
        .eq("status", "APPROVED")
        .order("requested_at", { ascending: true }),
      adminClient
        .from("profiles")
        .select("id, full_name, phone_number, active_location_zone")
        .eq("role", "driver")
        .eq("is_active", true)
        .eq("assigned_depot_id", profile.assigned_depot_id)
        .order("full_name", { ascending: true }),
      adminClient
        .from("transactions")
        .select("id, receipt_code, collector_profile_id, total_weight_kg, total_payout_cfa, status, created_at")
        .eq("depot_id", profile.assigned_depot_id)
        .eq("status", "DRAFT")
        .order("created_at", { ascending: true }),
      adminClient
        .from("transactions")
        .select("id, receipt_code, total_weight_kg, total_payout_cfa, status")
        .eq("depot_id", profile.assigned_depot_id)
        .eq("status", "APPROVED")
        .order("created_at", { ascending: true }),
    ]);

  const requests = (requestsData ?? []) as CollectionRequest[];
  const drivers = (driversData ?? []) as Driver[];
  const pageError = requestsError ?? driversError ?? buybackError;

  return (
    <div className="space-y-7">
      <section className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-7 shadow-2xl backdrop-blur-xl sm:p-9">
        <div className="flex flex-col gap-7 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-emerald-400">
              Depot manager workspace
            </p>
            <h1 className="mt-5 text-4xl font-black tracking-[-0.05em] text-white sm:text-5xl">
              Review collection requests
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-400">
              {depot?.name ?? "Your assigned depot"} ({depot?.code ?? "Depot"}) —
              review requests assigned to your depot and prepare them for dispatch.
            </p>
          </div>
          <form action={logoutStaff}>
            <button
              type="submit"
              className="min-h-12 rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-3 text-xs font-black uppercase tracking-[0.18em] text-slate-300 transition-all hover:border-red-400/30 hover:bg-red-400/10 hover:text-red-200"
            >
              Sign out securely
            </button>
          </form>
        </div>
      </section>

      {approvedBuybacks && approvedBuybacks.length > 0 ? (
        <section className="rounded-[2rem] border border-sky-400/15 bg-sky-400/[0.04] p-6 shadow-2xl backdrop-blur-xl sm:p-8">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-sky-300">
            Approved payouts
          </p>
          <div className="mt-5 grid gap-5 xl:grid-cols-2">
            {approvedBuybacks.map((transaction) => (
              <article key={transaction.id} className="rounded-3xl border border-white/10 bg-slate-950/50 p-6">
                <p className="font-mono text-sm font-bold text-sky-300">{transaction.receipt_code}</p>
                <p className="mt-4 text-sm text-slate-400">
                  {Number(transaction.total_weight_kg).toLocaleString("en-CM")} KG · {Number(transaction.total_payout_cfa).toLocaleString("en-CM")} CFA
                </p>
                <QueuePayoutAction transactionId={transaction.id} />
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {pageError ? (
        <section className="rounded-3xl border border-red-400/20 bg-red-400/[0.08] p-6 text-sm leading-7 text-red-200">
          WastePay could not load the manager workspace. Refresh the page or
          contact an administrator if the problem continues.
        </section>
      ) : null}

      <section className="grid gap-5 sm:grid-cols-2">
        <article className="rounded-3xl border border-amber-400/15 bg-amber-400/[0.06] p-6">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-amber-300/70">
            Awaiting dispatch
          </p>
          <p className="mt-5 text-4xl font-black text-white">{requests.length}</p>
          <p className="mt-3 text-sm text-amber-100/70">
            Approved requests assigned to this depot
          </p>
        </article>
        <article className="rounded-3xl border border-sky-400/15 bg-sky-400/[0.06] p-6">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-sky-300/70">
            Active drivers
          </p>
          <p className="mt-5 text-4xl font-black text-white">{drivers.length}</p>
          <p className="mt-3 text-sm text-sky-100/70">
            Drivers available at this depot
          </p>
        </article>
      </section>

      <section className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 shadow-2xl backdrop-blur-xl sm:p-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-emerald-400">
              Queue
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-white">
              Waiting for a driver
            </h2>
          </div>
          <p className="text-sm text-slate-500">
            Assign an active driver when a request is ready for dispatch.
          </p>
        </div>

        {requests.length === 0 ? (
          <p className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-sm leading-7 text-slate-400">
            No collection requests are waiting for review at this depot.
          </p>
        ) : (
          <div className="mt-8 grid gap-5 xl:grid-cols-2">
            {requests.map((request) => (
              <article
                key={request.id}
                className="rounded-3xl border border-white/10 bg-slate-950/50 p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-lg font-black text-white">
                      {request.requester_name}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {request.requester_type} · {request.phone_number}
                    </p>
                  </div>
                  <span className="rounded-full border border-amber-400/20 bg-amber-400/[0.08] px-3 py-1 text-[0.62rem] font-black uppercase tracking-[0.16em] text-amber-300">
                    Approved
                  </span>
                </div>
                <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="text-slate-600">Neighbourhood</dt>
                    <dd className="mt-1 text-slate-200">{request.neighbourhood}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-600">Submitted</dt>
                    <dd className="mt-1 text-slate-200">{formatDate(request.requested_at)}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-600">Estimated bags</dt>
                    <dd className="mt-1 text-slate-200">{request.estimated_bag_count ?? "Not provided"}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-600">Estimated weight</dt>
                    <dd className="mt-1 text-slate-200">{formatWeight(request.estimated_weight_kg)}</dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-slate-600">Preferred pickup window</dt>
                    <dd className="mt-1 text-slate-200">
                      {request.preferred_pickup_start &&
                      request.preferred_pickup_end
                        ? `${formatDate(request.preferred_pickup_start)} — ${formatDate(request.preferred_pickup_end)}`
                        : "Not scheduled"}
                    </dd>
                  </div>
                </dl>
                <div className="mt-6">
                  <AssignCollectionDriver
                    requestId={request.id}
                    drivers={drivers.map((driver) => ({
                      id: driver.id,
                      fullName:
                        driver.full_name?.trim() ||
                        "Unnamed WastePay driver",
                      phoneNumber: driver.phone_number,
                      locationZone: driver.active_location_zone,
                    }))}
                  />
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-[2rem] border border-violet-400/15 bg-violet-400/[0.04] p-6 shadow-2xl backdrop-blur-xl sm:p-8">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-violet-300">
          Buyback review
        </p>
        <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-white">
          Draft transactions
        </h2>
        {buybackData && buybackData.length > 0 ? (
          <div className="mt-6 grid gap-5 xl:grid-cols-2">
            {buybackData.map((transaction) => (
              <article key={transaction.id} className="rounded-3xl border border-white/10 bg-slate-950/50 p-6">
                <p className="font-mono text-sm font-bold text-violet-300">{transaction.receipt_code}</p>
                <p className="mt-4 text-sm text-slate-400">
                  {Number(transaction.total_weight_kg).toLocaleString("en-CM")} KG · {Number(transaction.total_payout_cfa).toLocaleString("en-CM")} CFA
                </p>
                <BuybackReviewAction transactionId={transaction.id} />
              </article>
            ))}
          </div>
        ) : (
          <p className="mt-5 text-sm leading-7 text-slate-500">No buyback drafts are waiting for review.</p>
        )}
      </section>
    </div>
  );
}
