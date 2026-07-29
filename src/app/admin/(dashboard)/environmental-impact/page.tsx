import { createAdminClient } from "@/lib/supabase/admin";

function formatNumber(value: number, maximumFractionDigits = 0) {
  return value.toLocaleString("en-CM", { maximumFractionDigits });
}

export default async function EnvironmentalImpactPage() {
  const adminClient = createAdminClient();
  const [
    { data: completedRequests, error: requestsError },
    { data: successfulTransactions, error: transactionsError },
    { count: activeDepots, error: depotsError },
  ] = await Promise.all([
    adminClient
      .from("collection_requests")
      .select("actual_weight_kg, completed_at")
      .eq("status", "COMPLETED"),
    adminClient
      .from("transactions")
      .select("total_weight_kg, total_payout_cfa")
      .eq("status", "SUCCESSFUL"),
    adminClient
      .from("depots")
      .select("id", { count: "exact", head: true })
      .eq("status", "active"),
  ]);

  const verifiedCollectionWeight = (completedRequests ?? []).reduce(
    (total, request) => total + Number(request.actual_weight_kg ?? 0),
    0,
  );
  const paidBuybackWeight = (successfulTransactions ?? []).reduce(
    (total, transaction) => total + Number(transaction.total_weight_kg ?? 0),
    0,
  );
  const totalPayout = (successfulTransactions ?? []).reduce(
    (total, transaction) => total + Number(transaction.total_payout_cfa ?? 0),
    0,
  );
  const hasError = requestsError || transactionsError || depotsError;

  const metrics = [
    {
      label: "Verified plastic recovered",
      value: `${formatNumber(verifiedCollectionWeight + paidBuybackWeight, 2)} KG`,
      detail: "Completed pickups and successful buybacks",
      color: "text-emerald-300",
    },
    {
      label: "Completed pickups",
      value: formatNumber(completedRequests?.length ?? 0),
      detail: "Collection requests completed at depots",
      color: "text-sky-300",
    },
    {
      label: "Collector value distributed",
      value: `${formatNumber(totalPayout)} CFA`,
      detail: "Successful, settled buyback transactions",
      color: "text-amber-300",
    },
    {
      label: "Active recovery depots",
      value: formatNumber(activeDepots ?? 0),
      detail: "Operational recovery locations",
      color: "text-violet-300",
    },
  ];

  return (
    <div className="space-y-7">
      <section className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-7 shadow-2xl backdrop-blur-xl sm:p-9">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-emerald-400">
          Environmental accountability
        </p>
        <h1 className="mt-5 text-4xl font-black tracking-[-0.05em] text-white sm:text-5xl">
          Environmental impact
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-slate-400">
          Live recovery totals calculated from completed collection requests
          and successfully settled plastic buyback transactions.
        </p>
      </section>

      {hasError ? (
        <p className="rounded-2xl border border-red-400/20 bg-red-400/[0.08] p-5 text-sm text-red-200">
          Some impact figures could not be loaded. Refresh the page and check
          the Supabase connection if this continues.
        </p>
      ) : null}

      <section className="grid gap-5 md:grid-cols-2">
        {metrics.map((metric) => (
          <article
            key={metric.label}
            className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-7 shadow-2xl"
          >
            <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
              {metric.label}
            </p>
            <p className={`mt-5 text-4xl font-black ${metric.color}`}>
              {metric.value}
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              {metric.detail}
            </p>
          </article>
        ))}
      </section>

      <section className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-7">
        <h2 className="text-2xl font-black text-white">How totals are counted</h2>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-400">
          Draft, rejected, cancelled, and unpaid records are excluded. This
          prevents unverified estimates from being presented as environmental
          impact.
        </p>
      </section>
    </div>
  );
}
