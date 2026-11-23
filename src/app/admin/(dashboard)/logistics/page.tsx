import { AssignCollectionDriver } from "@/components/admin/assign-collection-driver";
import { createClient } from "@/lib/supabase/server";

type LogisticsRequestStatus =
  | "APPROVED"
  | "ASSIGNED"
  | "IN_TRANSIT"
  | "COLLECTED_PENDING_DEPOT"
  | "COMPLETED";

type LogisticsRequest = {
  id: string;
  requester_name: string;
  phone_number: string;
  neighbourhood: string;
  estimated_weight_kg: number | null;
  estimated_bag_count: number | null;
  assigned_depot_id: string | null;
  assigned_driver_id: string | null;
  status: LogisticsRequestStatus;
  requested_at: string;
  assigned_at: string | null;
};

type DepotOption = {
  id: string;
  name: string;
  code: string;
};

type DriverOption = {
  id: string;
  fullName: string;
  phoneNumber: string | null;
  locationZone: string | null;
};

function formatStatus(status: LogisticsRequestStatus): string {
  switch (status) {
    case "IN_TRANSIT":
      return "In transit";

    case "COLLECTED_PENDING_DEPOT":
      return "Collected — pending depot";

    case "COMPLETED":
      return "Completed";

    case "ASSIGNED":
      return "Assigned";

    default:
      return "Approved";
  }
}

function getStatusStyles(status: LogisticsRequestStatus): string {
  switch (status) {
    case "COMPLETED":
      return "border-emerald-400/20 bg-emerald-400/[0.08] text-emerald-300";

    case "IN_TRANSIT":
    case "COLLECTED_PENDING_DEPOT":
      return "border-sky-400/20 bg-sky-400/[0.08] text-sky-300";

    case "ASSIGNED":
      return "border-violet-400/20 bg-violet-400/[0.08] text-violet-300";

    default:
      return "border-amber-400/20 bg-amber-400/[0.08] text-amber-300";
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

export default async function LogisticsPage() {
  const supabase = await createClient();

  const { data: requestData, error: requestError } = await supabase
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
        assigned_driver_id,
        status,
        requested_at,
        assigned_at
      `,
    )
    .in("status", [
      "APPROVED",
      "ASSIGNED",
      "IN_TRANSIT",
      "COLLECTED_PENDING_DEPOT",
      "COMPLETED",
    ])
    .order("requested_at", { ascending: false });

  const { data: depotData, error: depotError } = await supabase
    .from("depots")
    .select("id, name, code")
    .order("name", { ascending: true });

  const { data: driverData, error: driverError } = await supabase
    .from("profiles")
    .select("id, full_name, phone_number, active_location_zone")
    .eq("role", "driver")
    .eq("is_active", true)
    .order("full_name", { ascending: true });

  const requests: LogisticsRequest[] = (requestData ?? []).map(
    (request) => ({
      id: request.id,
      requester_name: request.requester_name,
      phone_number: request.phone_number,
      neighbourhood: request.neighbourhood,
      estimated_weight_kg:
        request.estimated_weight_kg === null
          ? null
          : Number(request.estimated_weight_kg),
      estimated_bag_count: request.estimated_bag_count,
      assigned_depot_id: request.assigned_depot_id,
      assigned_driver_id: request.assigned_driver_id,
      status: request.status as LogisticsRequestStatus,
      requested_at: request.requested_at,
      assigned_at: request.assigned_at,
    }),
  );

  const depots: DepotOption[] = (depotData ?? []).map((depot) => ({
    id: depot.id,
    name: depot.name,
    code: depot.code,
  }));

  const drivers: DriverOption[] = (driverData ?? []).map((driver) => ({
    id: driver.id,
    fullName: driver.full_name?.trim() || "Unnamed ECOLOGIX driver",
    phoneNumber: driver.phone_number,
    locationZone: driver.active_location_zone,
  }));

  const pageError = requestError ?? depotError ?? driverError;

  const depotNamesById = new Map(
    depots.map((depot) => [depot.id, depot.name]),
  );

  const driverNamesById = new Map(
    drivers.map((driver) => [driver.id, driver.fullName]),
  );

  const awaitingDriverCount = requests.filter(
    (request) => !request.assigned_driver_id,
  ).length;

  const assignedCount = requests.filter(
    (request) =>
      request.status === "ASSIGNED" && request.assigned_driver_id,
  ).length;

  const inTransitCount = requests.filter(
    (request) => request.status === "IN_TRANSIT",
  ).length;

  const completedCount = requests.filter(
    (request) => request.status === "COMPLETED",
  ).length;

  return (
    <div>
      <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.035] p-7 shadow-2xl backdrop-blur-xl sm:p-9">
        <div className="pointer-events-none absolute right-0 top-0 h-72 w-72 translate-x-1/3 -translate-y-1/3 rounded-full bg-violet-400/10 blur-[110px]" />

        <div className="relative max-w-3xl">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-violet-400">
            Field execution
          </p>

          <h2 className="mt-5 text-4xl font-black tracking-[-0.05em] text-white sm:text-5xl">
            Logistics dispatch
          </h2>

          <p className="mt-5 max-w-2xl text-base font-light leading-8 text-slate-400">
            Assign approved collection requests to active ECOLOGIX drivers and
            monitor pickups as they move through field operations.
          </p>
        </div>
      </section>

      <section className="mt-7 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-3xl border border-amber-400/15 bg-amber-400/[0.06] p-6 shadow-2xl">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-amber-500/70">
            Awaiting driver
          </p>

          <p className="mt-5 text-4xl font-black tracking-[-0.05em] text-white">
            {awaitingDriverCount}
          </p>

          <p className="mt-3 text-sm text-amber-200/70">
            Approved pickups without a driver
          </p>
        </article>

        <article className="rounded-3xl border border-violet-400/15 bg-violet-400/[0.06] p-6 shadow-2xl">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-violet-500/70">
            Assigned
          </p>

          <p className="mt-5 text-4xl font-black tracking-[-0.05em] text-white">
            {assignedCount}
          </p>

          <p className="mt-3 text-sm text-violet-200/70">
            Driver responsibility confirmed
          </p>
        </article>

        <article className="rounded-3xl border border-sky-400/15 bg-sky-400/[0.06] p-6 shadow-2xl">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-sky-500/70">
            In transit
          </p>

          <p className="mt-5 text-4xl font-black tracking-[-0.05em] text-white">
            {inTransitCount}
          </p>

          <p className="mt-3 text-sm text-sky-200/70">
            Drivers actively executing pickups
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
            Pickups fully reconciled
          </p>
        </article>
      </section>

      <section className="mt-7 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.035] shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col gap-4 border-b border-white/10 px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-violet-400">
              Dispatch queue
            </p>

            <h3 className="mt-3 text-2xl font-black tracking-[-0.035em] text-white">
              Approved ECOLOGIX pickups
            </h3>
          </div>

          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />

            <span className="text-[0.62rem] font-black uppercase tracking-[0.18em] text-slate-400">
              {drivers.length} active drivers
            </span>
          </span>
        </div>

        {pageError ? (
          <div className="m-6 rounded-3xl border border-red-400/20 bg-red-400/10 p-6 sm:m-8">
            <p className="text-sm font-bold text-red-200">
              ECOLOGIX could not load the logistics queue.
            </p>

            <p className="mt-2 text-sm leading-6 text-red-200/70">
              {pageError.message}
            </p>
          </div>
        ) : requests.length === 0 ? (
          <div className="flex min-h-80 items-center justify-center px-6 py-16 text-center">
            <div className="max-w-md">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl border border-white/10 bg-white/[0.035] text-xs font-black tracking-[0.18em] text-slate-600">
                ROUTE
              </div>

              <h3 className="mt-6 text-xl font-black text-white">
                No approved pickups yet
              </h3>

              <p className="mt-3 text-sm font-light leading-7 text-slate-500">
                Requests will enter this dispatch queue after an administrator
                approves them and assigns an ECOLOGIX depot.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-5 p-6 sm:p-8 xl:grid-cols-2">
            {requests.map((request) => {
              const assignedDepotName = request.assigned_depot_id
                ? depotNamesById.get(request.assigned_depot_id) ??
                  "Assigned depot"
                : "Unassigned";

              const assignedDriverName = request.assigned_driver_id
                ? driverNamesById.get(request.assigned_driver_id) ??
                  "Assigned driver"
                : "Awaiting driver";

              return (
                <article
                  key={request.id}
                  className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-violet-400/20 hover:shadow-2xl hover:shadow-violet-500/[0.06]"
                >
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.22em] text-violet-400">
                        {assignedDepotName}
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

                  <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.025] p-4">
                    <p className="text-[0.6rem] font-black uppercase tracking-[0.18em] text-slate-600">
                      Assigned driver
                    </p>

                    <p className="mt-2 text-sm font-bold text-white">
                      {assignedDriverName}
                    </p>
                  </div>

                  <div className="mt-6 border-t border-white/10 pt-5">
                    <p className="text-sm text-slate-400">
                      {request.phone_number}
                    </p>

                    <div className="mt-4 flex flex-col gap-2 text-xs text-slate-600 sm:flex-row sm:items-center sm:justify-between">
                      <span>{assignedDepotName}</span>

                      <span>{formatDate(request.requested_at)}</span>
                    </div>
                  </div>

                  {!request.assigned_driver_id &&
                  (request.status === "ASSIGNED" ||
                    request.status === "APPROVED") ? (
                    <div className="mt-5">
                      <AssignCollectionDriver
                        requestId={request.id}
                        drivers={drivers}
                      />
                    </div>
                  ) : null}
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}