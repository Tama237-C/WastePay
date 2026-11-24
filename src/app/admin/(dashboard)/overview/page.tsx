import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";

function buildMetricCards(values: {
  recoveredKg: number;
  payoutCfa: number;
  collectors: number;
  depots: number;
}) {
  return [
  {
    label: "Plastic recovered",
    value: (values.recoveredKg / 1000).toFixed(2),
    unit: "metric tons",
    detail: "Awaiting live depot transactions",
    accent: "emerald",
  },
  {
    label: "Capital disbursed",
    value: values.payoutCfa.toLocaleString("en-CM"),
    unit: "CFA",
    detail: "MTN and Orange payouts",
    accent: "sky",
  },
  {
    label: "Registered collectors",
    value: values.collectors.toLocaleString("en-CM"),
    unit: "accounts",
    detail: "Verified recovery participants",
    accent: "violet",
  },
  {
    label: "Active depots",
    value: values.depots.toLocaleString("en-CM"),
    unit: "locations",
    detail: "Cameroon operating network",
    accent: "amber",
  },
  ];
}

const quickActions = [
  {
    title: "Register a depot",
    description:
      "Create a new physical recovery centre and define its operational region.",
    href: "/admin/depot-management",
    code: "DEPOT",
  },
  {
    title: "Manage staff",
    description:
      "Provision manager, depot-agent, and driver operational accounts.",
    href: "/admin/staff-management",
    code: "TEAM",
  },
  {
    title: "Configure pricing",
    description:
      "Review material rates, regional multipliers, and campaign bonuses.",
    href: "/admin/financial-control",
    code: "RATES",
  },
];

function getMetricAccent(accent: string): string {
  switch (accent) {
    case "sky":
      return "border-sky-400/20 bg-sky-400/[0.07] text-sky-300";

    case "violet":
      return "border-violet-400/20 bg-violet-400/[0.07] text-violet-300";

    case "amber":
      return "border-amber-400/20 bg-amber-400/[0.07] text-amber-300";

    default:
      return "border-emerald-400/20 bg-emerald-400/[0.07] text-emerald-300";
  }
}

export default async function AdminOverviewPage() {
  const adminClient = createAdminClient();
  const [{ data: transactions }, { count: collectorCount }, { count: depotCount }, { data: events }] =
    await Promise.all([
      adminClient
        .from("transactions")
        .select("total_weight_kg, total_payout_cfa")
        .in("status", ["APPROVED", "PAYOUT_PROCESSING", "SUCCESSFUL"]),
      adminClient
        .from("profiles")
        .select("id", { count: "exact", head: true })
        .eq("role", "collector")
        .eq("is_active", true),
      adminClient
        .from("depots")
        .select("id", { count: "exact", head: true })
        .eq("status", "active"),
      adminClient
        .from("collection_request_events")
        .select("id, new_status, reason, created_at")
        .order("created_at", { ascending: false })
        .limit(8),
    ]);
  const metricCards = buildMetricCards({
    recoveredKg: (transactions ?? []).reduce(
      (total, transaction) => total + Number(transaction.total_weight_kg ?? 0),
      0,
    ),
    payoutCfa: (transactions ?? []).reduce(
      (total, transaction) => total + Number(transaction.total_payout_cfa ?? 0),
      0,
    ),
    collectors: collectorCount ?? 0,
    depots: depotCount ?? 0,
  });
  return (
    <div>
      <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.035] p-7 shadow-2xl backdrop-blur-xl sm:p-9 lg:p-11">
        <div className="pointer-events-none absolute right-0 top-0 h-72 w-72 translate-x-1/3 -translate-y-1/3 rounded-full bg-emerald-400/10 blur-[100px]" />

        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.9)]" />

              <p className="text-xs font-black uppercase tracking-[0.3em] text-emerald-400">
                National operations
              </p>
            </div>

            <h2 className="mt-7 text-4xl font-black tracking-[-0.05em] text-white sm:text-5xl lg:text-6xl">
              Circular recovery,
              <span className="block font-light text-slate-400">
                under one command.
              </span>
            </h2>

            <p className="mt-6 max-w-2xl text-base font-light leading-8 text-slate-400 sm:text-lg">
              Monitor financial movement, material recovery, depot activity,
              corporate plastic intelligence, and field logistics across the
              ECOLOGIX network.
            </p>
          </div>

          <div className="grid min-w-[16rem] gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <div className="rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.07] px-5 py-4">
              <p className="text-[0.62rem] font-black uppercase tracking-[0.22em] text-emerald-500/70">
                Infrastructure state
              </p>

              <p className="mt-2 text-sm font-bold text-emerald-200">
                Authentication and database online
              </p>
            </div>

            <div className="rounded-2xl border border-amber-400/15 bg-amber-400/[0.07] px-5 py-4">
              <p className="text-[0.62rem] font-black uppercase tracking-[0.22em] text-amber-500/70">
                Operational state
              </p>

              <p className="mt-2 text-sm font-bold text-amber-200">
                Awaiting first live depot
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-7 grid gap-5 sm:grid-cols-2 2xl:grid-cols-4">
        {metricCards.map((metric) => (
          <article
            key={metric.label}
            className="group rounded-3xl border border-white/10 bg-slate-900/60 p-6 shadow-2xl backdrop-blur-md transition-all duration-300 ease-out hover:-translate-y-1 hover:border-white/15 hover:shadow-slate-950/50"
          >
            <div className="flex items-start justify-between gap-4">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
                {metric.label}
              </p>

              <span
                className={`rounded-full border px-2.5 py-1 text-[0.58rem] font-black uppercase tracking-[0.16em] ${getMetricAccent(
                  metric.accent,
                )}`}
              >
                Live
              </span>
            </div>

            <div className="mt-7 flex items-end gap-3">
              <p className="text-4xl font-black tracking-[-0.05em] text-white">
                {metric.value}
              </p>

              <p className="pb-1 text-xs font-bold uppercase tracking-[0.16em] text-slate-600">
                {metric.unit}
              </p>
            </div>

            <div className="mt-6 h-px bg-gradient-to-r from-white/10 to-transparent" />

            <p className="mt-4 text-sm font-light leading-6 text-slate-500">
              {metric.detail}
            </p>
          </article>
        ))}
      </section>

      <div className="mt-7 grid gap-7 2xl:grid-cols-[1.28fr_0.72fr]">
        <section className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 shadow-2xl backdrop-blur-xl sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.28em] text-sky-400">
                Network activity
              </p>

              <h2 className="mt-4 text-3xl font-black tracking-[-0.04em] text-white">
                Real-time operations feed
              </h2>
            </div>

            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2">
              <span className="h-2 w-2 rounded-full bg-amber-400" />

              <span className="text-[0.62rem] font-black uppercase tracking-[0.18em] text-slate-400">
                Waiting for activity
              </span>
            </span>
          </div>

          {events && events.length > 0 ? (
            <div className="mt-8 space-y-3">
              {events.map((event) => (
                <article key={event.id} className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm font-bold text-white">{event.new_status}</p>
                    <p className="text-xs text-slate-600">
                      {new Intl.DateTimeFormat("en-CM", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(event.created_at))}
                    </p>
                  </div>
                  {event.reason ? <p className="mt-2 text-sm text-slate-400">{event.reason}</p> : null}
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-8 flex min-h-72 items-center justify-center rounded-3xl border border-dashed border-white/10 bg-slate-950/40 px-6 py-12 text-center">
              <div className="max-w-md">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl border border-white/10 bg-white/[0.035] text-sm font-black tracking-[0.18em] text-slate-600">
                  LIVE
                </div>
                <h3 className="mt-6 text-xl font-black text-white">No operational events yet</h3>
                <p className="mt-3 text-sm font-light leading-7 text-slate-500">
                  Collection activity will appear here as ECOLOGIX operations begin.
                </p>
              </div>
            </div>
          )}
        </section>

        <section className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 shadow-2xl backdrop-blur-xl sm:p-8">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-emerald-400">
            Executive actions
          </p>

          <h2 className="mt-4 text-3xl font-black tracking-[-0.04em] text-white">
            Build the network
          </h2>

          <div className="mt-7 space-y-4">
            {quickActions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="group block rounded-3xl border border-white/10 bg-slate-900/60 p-5 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-emerald-400/25 hover:shadow-2xl hover:shadow-emerald-500/[0.07]"
              >
                <div className="flex items-start gap-4">
                  <span className="flex h-12 min-w-12 items-center justify-center rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.07] px-3 text-[0.56rem] font-black uppercase tracking-[0.13em] text-emerald-300">
                    {action.code}
                  </span>

                  <span>
                    <span className="flex items-center gap-3">
                      <span className="text-base font-black text-white">
                        {action.title}
                      </span>

                      <span className="text-emerald-400 transition-transform duration-300 ease-out group-hover:translate-x-1">
                        →
                      </span>
                    </span>

                    <span className="mt-2 block text-sm font-light leading-6 text-slate-500">
                      {action.description}
                    </span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
