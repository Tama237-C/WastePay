import { CollectionRequestActions } from "@/components/admin/collection-request-actions";
import { createClient } from "@/lib/supabase/server";

type CollectionRequestStatus =
  | "PENDING_REVIEW"
  | "APPROVED"
  | "ASSIGNED"
  | "IN_TRANSIT"
  | "COLLECTED_PENDING_DEPOT"
  | "COMPLETED"
  | "REJECTED"
  | "UNREACHABLE"
  | "CANCELLED"
  | "RESCHEDULED";

type RequesterType = "RESIDENT" | "SCHOOL" | "OFFICE" | "HOTEL";

type CollectionRequestRecord = {
  id: string;
  requester_type: RequesterType;
  requester_name: string;
  phone_number: string;
  neighbourhood: string;
  estimated_weight_kg: number | null;
  estimated_bag_count: number | null;
  assigned_driver_id: string | null;
  assigned_depot_id: string | null;
  actual_weight_kg: number | null;
  rejection_reason: string | null;
  status: CollectionRequestStatus;
  requested_at: string;
  assigned_at: string | null;
  completed_at: string | null;
};
type DepotOption = {
  id: string;
  name: string;
  code: string;
  status: string;
};

function formatStatus(status: CollectionRequestStatus): string {
  switch (status) {
    case "PENDING_REVIEW":
      return "Pending review";

    case "APPROVED":
      return "Approved";

    case "ASSIGNED":
      return "Assigned";

    case "IN_TRANSIT":
      return "In transit";

    case "COLLECTED_PENDING_DEPOT":
      return "Collected — pending depot";

    case "COMPLETED":
      return "Completed";

    case "REJECTED":
      return "Rejected";

    case "UNREACHABLE":
      return "Customer unreachable";

    case "CANCELLED":
      return "Cancelled";

    case "RESCHEDULED":
      return "Rescheduled";

    default:
      return status;
  }
}

function getStatusStyles(status: CollectionRequestStatus): string {
  switch (status) {
    case "COMPLETED":
      return "border-emerald-400/20 bg-emerald-400/[0.08] text-emerald-300";

    case "IN_TRANSIT":
    case "COLLECTED_PENDING_DEPOT":
      return "border-sky-400/20 bg-sky-400/[0.08] text-sky-300";

    case "APPROVED":
    case "ASSIGNED":
      return "border-violet-400/20 bg-violet-400/[0.08] text-violet-300";

    case "REJECTED":
    case "CANCELLED":
      return "border-red-400/20 bg-red-400/[0.08] text-red-300";

    case "UNREACHABLE":
    case "RESCHEDULED":
      return "border-orange-400/20 bg-orange-400/[0.08] text-orange-300";

    default:
      return "border-amber-400/20 bg-amber-400/[0.08] text-amber-300";
  }
}

function formatRequesterType(requesterType: RequesterType): string {
  switch (requesterType) {
    case "SCHOOL":
      return "School";

    case "OFFICE":
      return "Office";

    case "HOTEL":
      return "Hotel";

    default:
      return "Resident";
  }
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

function formatWeight(weight: number | null): string {
  if (weight === null) {
    return "Not provided";
  }

  return `${new Intl.NumberFormat("en-CM", {
    maximumFractionDigits: 3,
  }).format(weight)} KG`;
}

export default async function CollectionRequestsPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("collection_requests")
    .select(
      `
        id,
        requester_type,
        requester_name,
        phone_number,
        neighbourhood,
        estimated_weight_kg,
        estimated_bag_count,
        assigned_driver_id,
        assigned_depot_id,
        actual_weight_kg,
        rejection_reason,
        status,
        requested_at,
        assigned_at,
        completed_at
      `,
    )
    .order("requested_at", { ascending: false });

  const requests: CollectionRequestRecord[] = (data ?? []).map((request) => ({
    id: request.id,
    requester_type: request.requester_type as RequesterType,
    requester_name: request.requester_name,
    phone_number: request.phone_number,
    neighbourhood: request.neighbourhood,
    estimated_weight_kg:
      request.estimated_weight_kg === null
        ? null
        : Number(request.estimated_weight_kg),
    estimated_bag_count: request.estimated_bag_count,
    assigned_driver_id: request.assigned_driver_id,
    assigned_depot_id: request.assigned_depot_id,
    actual_weight_kg:
      request.actual_weight_kg === null
        ? null
        : Number(request.actual_weight_kg),
    rejection_reason: request.rejection_reason,
    status: request.status as CollectionRequestStatus,
    requested_at: request.requested_at,
    assigned_at: request.assigned_at,
    completed_at: request.completed_at,
  }));
  const { data: depotData, error: depotError } = await supabase
  .from("depots")
  .select("id, name, code, status")
  .order("name", { ascending: true });

const depots: DepotOption[] = (depotData ?? []).map((depot) => ({
  id: depot.id,
  name: depot.name,
  code: depot.code,
  status: depot.status,
}));

const pageError = error ?? depotError;
const depotNamesById = new Map<string, string>(
  depots.map((depot) => [depot.id, depot.name]),
);

  const pendingCount = requests.filter(
    (request) => request.status === "PENDING_REVIEW",
  ).length;

  const assignedCount = requests.filter(
    (request) =>
      request.status === "ASSIGNED" ||
      request.status === "APPROVED",
  ).length;

  const activeRouteCount = requests.filter(
    (request) =>
      request.status === "IN_TRANSIT" ||
      request.status === "COLLECTED_PENDING_DEPOT",
  ).length;

  const completedCount = requests.filter(
    (request) => request.status === "COMPLETED",
  ).length;

  return (
    <div>
      <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.035] p-7 shadow-2xl backdrop-blur-xl sm:p-9">
        <div className="pointer-events-none absolute right-0 top-0 h-72 w-72 translate-x-1/3 -translate-y-1/3 rounded-full bg-sky-400/10 blur-[110px]" />

        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-sky-400">
              Residential logistics
            </p>

            <h2 className="mt-5 text-4xl font-black tracking-[-0.05em] text-white sm:text-5xl">
              Collection requests
            </h2>

            <p className="mt-5 max-w-2xl text-base font-light leading-8 text-slate-400">
              Review home, office, school, and hospitality pickup requests
              before routing them into the WastePay depot and driver network.
            </p>
          </div>

          <button
            type="button"
            disabled
            className="min-h-12 cursor-not-allowed rounded-2xl border border-sky-300/15 bg-sky-400/50 px-6 py-3 text-xs font-black uppercase tracking-[0.18em] text-slate-950 opacity-60"
          >
            Public booking form — next
          </button>
        </div>
      </section>

      <section className="mt-7 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-3xl border border-amber-400/15 bg-amber-400/[0.06] p-6 shadow-2xl">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-amber-500/70">
            Pending review
          </p>

          <p className="mt-5 text-4xl font-black tracking-[-0.05em] text-white">
            {pendingCount}
          </p>

          <p className="mt-3 text-sm text-amber-200/70">
            Awaiting administrative review
          </p>
        </article>

        <article className="rounded-3xl border border-violet-400/15 bg-violet-400/[0.06] p-6 shadow-2xl">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-violet-500/70">
            Approved or assigned
          </p>

          <p className="mt-5 text-4xl font-black tracking-[-0.05em] text-white">
            {assignedCount}
          </p>

          <p className="mt-3 text-sm text-violet-200/70">
            Waiting for field execution
          </p>
        </article>

        <article className="rounded-3xl border border-sky-400/15 bg-sky-400/[0.06] p-6 shadow-2xl">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-sky-500/70">
            Active routes
          </p>

          <p className="mt-5 text-4xl font-black tracking-[-0.05em] text-white">
            {activeRouteCount}
          </p>

          <p className="mt-3 text-sm text-sky-200/70">
            In transit or awaiting depot intake
          </p>
        </article>

        <article className="rounded-3xl border border-emerald-400/15 bg-emerald-400/[0.06] p-6 shadow-2xl">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-500/70">
            Completed
          </p>

          <p className="mt-5 text-4xl font-black tracking-[-0.05em] text-white">
            {completedCount}
          </p>

          <p className="mt-3 text-sm text-emerald-200/70">
            Successfully reconciled pickups
          </p>
        </article>
      </section>

      <section className="mt-7 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.035] shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col gap-4 border-b border-white/10 px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-sky-400">
              Request queue
            </p>

            <h3 className="mt-3 text-2xl font-black tracking-[-0.035em] text-white">
              Incoming WastePay pickups
            </h3>
          </div>

          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />

            <span className="text-[0.62rem] font-black uppercase tracking-[0.18em] text-slate-400">
              Live Supabase data
            </span>
          </span>
        </div>

        {pageError ? (
          <div className="m-6 rounded-3xl border border-red-400/20 bg-red-400/10 p-6 sm:m-8">
            <p className="text-sm font-bold text-red-200">
              WastePay could not load the collection request queue.
            </p>

            <p className="mt-2 text-sm leading-6 text-red-200/70">
             {pageError?.message ?? "An unexpected database error occurred."}
            </p>
          </div>
        ) : requests.length === 0 ? (
          <div className="flex min-h-80 items-center justify-center px-6 py-16 text-center">
            <div className="max-w-md">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl border border-white/10 bg-white/[0.035] text-xs font-black tracking-[0.18em] text-slate-600">
                PICKUP
              </div>

              <h3 className="mt-6 text-xl font-black text-white">
                No collection requests yet
              </h3>

              <p className="mt-3 text-sm font-light leading-7 text-slate-500">
                Residential and commercial requests will appear here after the
                public WastePay booking form is connected.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-5 p-6 sm:p-8 xl:grid-cols-2">
            {requests.map((request) => (
              <article
                key={request.id}
                className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-sky-400/20 hover:shadow-2xl hover:shadow-sky-500/[0.06]"
              >
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.22em] text-sky-400">
                      {formatRequesterType(request.requester_type)}
                    </p>

                    <h4 className="mt-3 text-2xl font-black tracking-[-0.035em] text-white">
                      {request.requester_name}
                    </h4>

                    <p className="mt-3 text-sm font-light text-slate-500">
                      {request.neighbourhood}
                    </p>
                  </div>

                  <span
                    className={`inline-flex w-fit rounded-full border px-3 py-1.5 text-xs font-bold ${getStatusStyles(
                      request.status,
                    )}`}
                  >
                    {formatStatus(request.status)}
                  </span>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-4">
                    <p className="text-[0.6rem] font-black uppercase tracking-[0.18em] text-slate-600">
                      Estimated weight
                    </p>

                    <p className="mt-2 text-sm font-bold text-white">
                      {formatWeight(request.estimated_weight_kg)}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-4">
                    <p className="text-[0.6rem] font-black uppercase tracking-[0.18em] text-slate-600">
                      Estimated bags
                    </p>

                    <p className="mt-2 text-sm font-bold text-white">
                      {request.estimated_bag_count ?? "Not provided"}
                    </p>
                  </div>
                </div>

                <div className="mt-6 border-t border-white/10 pt-5">
                  <p className="text-sm text-slate-400">
                    {request.phone_number}
                  </p>

                  <div className="mt-4 flex flex-col gap-2 text-xs text-slate-600 sm:flex-row sm:items-center sm:justify-between">
                    <span>
                      Depot:{" "}
                     {request.assigned_depot_id
  ? depotNamesById.get(request.assigned_depot_id) ??
    "Assigned depot"
  : "Unassigned"}
                    </span>

                    <span>{formatDate(request.requested_at)}</span>
                  </div>
                </div>
                {request.status === "PENDING_REVIEW" ? (
  <CollectionRequestActions
    requestId={request.id}
    depots={depots}
  />
) : request.rejection_reason ? (
  <div className="mt-5 rounded-2xl border border-red-400/15 bg-red-400/[0.07] p-4">
    <p className="text-[0.62rem] font-black uppercase tracking-[0.2em] text-red-300">
      Rejection reason
    </p>

    <p className="mt-3 text-sm leading-6 text-red-100/75">
      {request.rejection_reason}
    </p>
  </div>
) : null}
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}