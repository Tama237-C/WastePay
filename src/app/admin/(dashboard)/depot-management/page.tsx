import { CreateDepot } from "@/components/admin/create-depot";
import { createClient } from "@/lib/supabase/server";

type DepotStatus =
  | "planned"
  | "active"
  | "temporarily_closed"
  | "inactive";

type DepotRecord = {
  id: string;
  name: string;
  code: string;
  city: string;
  region_name: string | null;
  address_text: string | null;
  contact_phone_number: string | null;
  maximum_storage_capacity_kg: number | null;
  mtn_float_balance_cfa: number;
  orange_float_balance_cfa: number;
  status: DepotStatus;
  created_at: string;
};

function formatStatus(status: DepotStatus): string {
  switch (status) {
    case "active":
      return "Active";

    case "temporarily_closed":
      return "Temporarily closed";

    case "inactive":
      return "Inactive";

    default:
      return "Planned";
  }
}

function getStatusStyles(status: DepotStatus): string {
  switch (status) {
    case "active":
      return "border-emerald-400/20 bg-emerald-400/[0.08] text-emerald-300";

    case "temporarily_closed":
      return "border-amber-400/20 bg-amber-400/[0.08] text-amber-300";

    case "inactive":
      return "border-red-400/20 bg-red-400/[0.08] text-red-300";

    default:
      return "border-sky-400/20 bg-sky-400/[0.08] text-sky-300";
  }
}

function formatCfa(amount: number): string {
  return new Intl.NumberFormat("fr-CM", {
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(dateValue: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(dateValue));
}

export default async function DepotManagementPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
  .from("depots")
  .select(
    `
      id,
      name,
      code,
      city,
      region_name,
      address_text,
      contact_phone_number,
      maximum_storage_capacity_kg,
      mtn_float_balance_cfa,
      orange_float_balance_cfa,
      status,
      created_at
    `,
  )
  .order("created_at", { ascending: false });

const depots: DepotRecord[] = (data ?? []).map((depot) => ({
  id: depot.id,
  name: depot.name,
  code: depot.code,
  city: depot.city,
  region_name: depot.region_name,
  address_text: depot.address_text,
  contact_phone_number: depot.contact_phone_number,
  maximum_storage_capacity_kg:
    depot.maximum_storage_capacity_kg === null
      ? null
      : Number(depot.maximum_storage_capacity_kg),
  mtn_float_balance_cfa: Number(depot.mtn_float_balance_cfa),
  orange_float_balance_cfa: Number(depot.orange_float_balance_cfa),
  status: depot.status as DepotStatus,
  created_at: depot.created_at,
}));

  const activeDepotCount = depots.filter(
    (depot) => depot.status === "active",
  ).length;

  const plannedDepotCount = depots.filter(
    (depot) => depot.status === "planned",
  ).length;

  const totalStorageCapacity = depots.reduce(
    (total, depot) =>
      total + Number(depot.maximum_storage_capacity_kg ?? 0),
    0,
  );

  const totalFloatBalance = depots.reduce(
    (total, depot) =>
      total +
      Number(depot.mtn_float_balance_cfa) +
      Number(depot.orange_float_balance_cfa),
    0,
  );

  return (
    <div>
      <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.035] p-7 shadow-2xl backdrop-blur-xl sm:p-9">
        <div className="pointer-events-none absolute right-0 top-0 h-72 w-72 translate-x-1/3 -translate-y-1/3 rounded-full bg-emerald-400/10 blur-[110px]" />

        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-emerald-400">
              Recovery network
            </p>

            <h2 className="mt-5 text-4xl font-black tracking-[-0.05em] text-white sm:text-5xl">
              Depot management
            </h2>

            <p className="mt-5 max-w-2xl text-base font-light leading-8 text-slate-400">
              Register and supervise WastePay recovery centres, operational
              capacity, regional coverage, and Mobile Money float positions.
            </p>
          </div>

         <CreateDepot />
        </div>
      </section>

      <section className="mt-7 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 shadow-2xl">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
            Total depots
          </p>

          <p className="mt-5 text-4xl font-black tracking-[-0.05em] text-white">
            {depots.length}
          </p>

          <p className="mt-3 text-sm text-slate-500">
            Registered recovery centres
          </p>
        </article>

        <article className="rounded-3xl border border-emerald-400/15 bg-emerald-400/[0.06] p-6 shadow-2xl">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-500/70">
            Active depots
          </p>

          <p className="mt-5 text-4xl font-black tracking-[-0.05em] text-white">
            {activeDepotCount}
          </p>

          <p className="mt-3 text-sm text-emerald-200/70">
            Currently operational
          </p>
        </article>

        <article className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 shadow-2xl">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
            Planned depots
          </p>

          <p className="mt-5 text-4xl font-black tracking-[-0.05em] text-white">
            {plannedDepotCount}
          </p>

          <p className="mt-3 text-sm text-slate-500">
            Awaiting activation
          </p>
        </article>

        <article className="rounded-3xl border border-sky-400/15 bg-sky-400/[0.06] p-6 shadow-2xl">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-sky-500/70">
            Storage capacity
          </p>

          <p className="mt-5 text-4xl font-black tracking-[-0.05em] text-white">
            {formatCfa(totalStorageCapacity)}
          </p>

          <p className="mt-3 text-sm text-sky-200/70">
            Kilograms across the network
          </p>
        </article>
      </section>

      <section className="mt-7 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.035] shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col gap-4 border-b border-white/10 px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-emerald-400">
              Depot directory
            </p>

            <h3 className="mt-3 text-2xl font-black tracking-[-0.035em] text-white">
              WastePay recovery centres
            </h3>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
            <p className="text-[0.6rem] font-black uppercase tracking-[0.18em] text-slate-600">
              Network float
            </p>

            <p className="mt-2 text-sm font-black text-white">
              {formatCfa(totalFloatBalance)} CFA
            </p>
          </div>
        </div>

        {error ? (
          <div className="m-6 rounded-3xl border border-red-400/20 bg-red-400/10 p-6 sm:m-8">
            <p className="text-sm font-bold text-red-200">
              WastePay could not load the depot directory.
            </p>

            <p className="mt-2 text-sm leading-6 text-red-200/70">
              {error.message}
            </p>
          </div>
        ) : depots.length === 0 ? (
          <div className="flex min-h-80 items-center justify-center px-6 py-16 text-center">
            <div className="max-w-md">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl border border-white/10 bg-white/[0.035] text-xs font-black tracking-[0.18em] text-slate-600">
                HUB
              </div>

              <h3 className="mt-6 text-xl font-black text-white">
                No depots registered yet
              </h3>

              <p className="mt-3 text-sm font-light leading-7 text-slate-500">
                The first WastePay recovery centre will appear here after it
                is registered through the secure depot creation workflow.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-5 p-6 sm:p-8 xl:grid-cols-2">
            {depots.map((depot) => (
              <article
                key={depot.id}
                className="group rounded-3xl border border-white/10 bg-slate-900/60 p-6 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-emerald-400/20 hover:shadow-2xl hover:shadow-emerald-500/[0.07]"
              >
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-400">
                      {depot.code}
                    </p>

                    <h4 className="mt-3 text-2xl font-black tracking-[-0.035em] text-white">
                      {depot.name}
                    </h4>

                    <p className="mt-3 text-sm font-light leading-6 text-slate-500">
                      {[depot.region_name, depot.city]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  </div>

                  <span
                    className={`inline-flex w-fit rounded-full border px-3 py-1.5 text-xs font-bold ${getStatusStyles(
                      depot.status,
                    )}`}
                  >
                    {formatStatus(depot.status)}
                  </span>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-4">
                    <p className="text-[0.6rem] font-black uppercase tracking-[0.18em] text-slate-600">
                      Storage capacity
                    </p>

                    <p className="mt-2 text-sm font-bold text-white">
                      {depot.maximum_storage_capacity_kg
                        ? `${formatCfa(
                            depot.maximum_storage_capacity_kg,
                          )} KG`
                        : "Not configured"}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-4">
                    <p className="text-[0.6rem] font-black uppercase tracking-[0.18em] text-slate-600">
                      Combined float
                    </p>

                    <p className="mt-2 text-sm font-bold text-white">
                      {formatCfa(
                        Number(depot.mtn_float_balance_cfa) +
                          Number(depot.orange_float_balance_cfa),
                      )}{" "}
                      CFA
                    </p>
                  </div>
                </div>

                <div className="mt-6 border-t border-white/10 pt-5">
                  <p className="text-sm leading-6 text-slate-500">
                    {depot.address_text ?? "No physical address recorded"}
                  </p>

                  <div className="mt-4 flex flex-col gap-2 text-xs text-slate-600 sm:flex-row sm:items-center sm:justify-between">
                    <span>
                      {depot.contact_phone_number ??
                        "No contact number recorded"}
                    </span>

                    <span>Created {formatDate(depot.created_at)}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}