import { CreateStaffAccount } from "@/components/admin/create-staff-account";
import { createClient } from "@/lib/supabase/server";

type StaffProfile = {
  id: string;
  full_name: string | null;
  phone_number: string | null;
  role:
    | "resident"
    | "collector"
    | "agent"
    | "manager"
    | "driver"
    | "admin";
  active_location_zone: string | null;
  is_active: boolean;
  created_at: string;
};

type DepotOption = {
  id: string;
  name: string;
  code: string;
  status: string;
};

const staffRoles = new Set([
  "agent",
  "manager",
  "driver",
  "collector",
  "admin",
]);

function formatRole(role: StaffProfile["role"]): string {
  switch (role) {
    case "admin":
      return "Super Administrator";

    case "manager":
      return "Depot Manager";

    case "agent":
      return "Depot Agent";

    case "driver":
      return "Pickup Driver";

    case "collector":
      return "Plastic Collector";

    default:
      return role;
  }
}

function formatDate(dateValue: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(dateValue));
}

export default async function StaffManagementPage() {
  const supabase = await createClient();

  const [{ data, error }, { data: depotData }] =
    await Promise.all([
      supabase
        .from("profiles")
        .select(
          "id, full_name, phone_number, role, active_location_zone, is_active, created_at",
        )
        .order("created_at", { ascending: false }),
      supabase
        .from("depots")
        .select("id, name, code, status")
        .order("name", { ascending: true }),
    ]);

  const profiles = (data ?? []) as StaffProfile[];
  const depots = (depotData ?? []) as DepotOption[];

  const staffProfiles = profiles.filter((profile) =>
    staffRoles.has(profile.role),
  );

  const activeStaffCount = staffProfiles.filter(
    (profile) => profile.is_active,
  ).length;

  const managerCount = staffProfiles.filter(
    (profile) => profile.role === "manager",
  ).length;

  const agentCount = staffProfiles.filter(
    (profile) => profile.role === "agent",
  ).length;

  return (
    <div>
      <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.035] p-7 shadow-2xl backdrop-blur-xl sm:p-9">
        <div className="pointer-events-none absolute right-0 top-0 h-72 w-72 translate-x-1/3 -translate-y-1/3 rounded-full bg-sky-400/10 blur-[110px]" />

        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-sky-400">
              Workforce governance
            </p>

            <h2 className="mt-5 text-4xl font-black tracking-[-0.05em] text-white sm:text-5xl">
              Staff management
            </h2>

            <p className="mt-5 max-w-2xl text-base font-light leading-8 text-slate-400">
              Review operational accounts, staff roles, account status, and
              regional assignments across the ECOLOGIX network.
            </p>
          </div>

          <CreateStaffAccount depots={depots} />
        </div>
      </section>

      <section className="mt-7 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 shadow-2xl">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
            Total staff
          </p>

          <p className="mt-5 text-4xl font-black tracking-[-0.05em] text-white">
            {staffProfiles.length}
          </p>

          <p className="mt-3 text-sm text-slate-500">
            Operational accounts
          </p>
        </article>

        <article className="rounded-3xl border border-emerald-400/15 bg-emerald-400/[0.06] p-6 shadow-2xl">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-500/70">
            Active staff
          </p>

          <p className="mt-5 text-4xl font-black tracking-[-0.05em] text-white">
            {activeStaffCount}
          </p>

          <p className="mt-3 text-sm text-emerald-200/70">
            Access currently enabled
          </p>
        </article>

        <article className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 shadow-2xl">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
            Managers
          </p>

          <p className="mt-5 text-4xl font-black tracking-[-0.05em] text-white">
            {managerCount}
          </p>

          <p className="mt-3 text-sm text-slate-500">
            Depot oversight accounts
          </p>
        </article>

        <article className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 shadow-2xl">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
            Agents
          </p>

          <p className="mt-5 text-4xl font-black tracking-[-0.05em] text-white">
            {agentCount}
          </p>

          <p className="mt-3 text-sm text-slate-500">
            Plastic intake operators
          </p>
        </article>
      </section>

      <section className="mt-7 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.035] shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col gap-4 border-b border-white/10 px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-emerald-400">
              Account directory
            </p>

            <h3 className="mt-3 text-2xl font-black tracking-[-0.035em] text-white">
              ECOLOGIX operational personnel
            </h3>
          </div>

          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />

            <span className="text-[0.62rem] font-black uppercase tracking-[0.18em] text-slate-400">
              Live Supabase data
            </span>
          </span>
        </div>

        {error ? (
          <div className="m-6 rounded-3xl border border-red-400/20 bg-red-400/10 p-6 sm:m-8">
            <p className="text-sm font-bold text-red-200">
              ECOLOGIX could not load the staff directory.
            </p>

            <p className="mt-2 text-sm leading-6 text-red-200/70">
              {error.message}
            </p>
          </div>
        ) : staffProfiles.length === 0 ? (
          <div className="flex min-h-72 items-center justify-center px-6 py-14 text-center">
            <div className="max-w-md">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl border border-white/10 bg-white/[0.035] text-xs font-black tracking-[0.18em] text-slate-600">
                TEAM
              </div>

              <h3 className="mt-6 text-xl font-black text-white">
                No staff profiles found
              </h3>

              <p className="mt-3 text-sm font-light leading-7 text-slate-500">
                Staff accounts will appear here after they are securely created
                through the ECOLOGIX administration workflow.
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse text-left">
              <thead>
                <tr className="border-b border-white/10 bg-slate-950/40">
                  <th className="px-8 py-4 text-[0.62rem] font-black uppercase tracking-[0.2em] text-slate-600">
                    Staff member
                  </th>

                  <th className="px-5 py-4 text-[0.62rem] font-black uppercase tracking-[0.2em] text-slate-600">
                    Role
                  </th>

                  <th className="px-5 py-4 text-[0.62rem] font-black uppercase tracking-[0.2em] text-slate-600">
                    Location zone
                  </th>

                  <th className="px-5 py-4 text-[0.62rem] font-black uppercase tracking-[0.2em] text-slate-600">
                    Status
                  </th>

                  <th className="px-8 py-4 text-right text-[0.62rem] font-black uppercase tracking-[0.2em] text-slate-600">
                    Created
                  </th>
                </tr>
              </thead>

              <tbody>
                {staffProfiles.map((profile) => {
                  const displayName =
                    profile.full_name?.trim() || "Unnamed staff account";

                  return (
                    <tr
                      key={profile.id}
                      className="border-b border-white/[0.06] transition-all duration-300 hover:bg-white/[0.025]"
                    >
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-sky-400/15 bg-sky-400/[0.07] text-sm font-black text-sky-300">
                            {displayName.charAt(0).toUpperCase()}
                          </span>

                          <div>
                            <p className="font-bold text-white">
                              {displayName}
                            </p>

                            <p className="mt-1 text-xs text-slate-600">
                              {profile.phone_number ?? "No phone recorded"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-5">
                        <span className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-bold text-slate-300">
                          {formatRole(profile.role)}
                        </span>
                      </td>

                      <td className="px-5 py-5 text-sm text-slate-400">
                        {profile.active_location_zone ?? "Unassigned"}
                      </td>

                      <td className="px-5 py-5">
                        <span
                          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold ${
                            profile.is_active
                              ? "border-emerald-400/15 bg-emerald-400/[0.07] text-emerald-300"
                              : "border-red-400/15 bg-red-400/[0.07] text-red-300"
                          }`}
                        >
                          <span
                            className={`h-2 w-2 rounded-full ${
                              profile.is_active
                                ? "bg-emerald-400"
                                : "bg-red-400"
                            }`}
                          />

                          {profile.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td className="px-8 py-5 text-right text-sm text-slate-500">
                        {formatDate(profile.created_at)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
