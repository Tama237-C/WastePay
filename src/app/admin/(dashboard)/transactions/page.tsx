import { createAdminClient } from "@/lib/supabase/admin";

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("en-CM", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export default async function TransactionsPage() {
  const adminClient = createAdminClient();
  const { data: transactions, error } = await adminClient
    .from("transactions")
    .select(
      "id, receipt_code, collector_profile_id, depot_id, payout_provider, payout_phone_number, total_weight_kg, total_payout_cfa, status, created_at",
    )
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-7">
      <section className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-7 shadow-2xl backdrop-blur-xl sm:p-9">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-sky-400">
          Financial control
        </p>
        <h1 className="mt-5 text-4xl font-black tracking-[-0.05em] text-white sm:text-5xl">
          Buyback transactions
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-8 text-slate-400">
          Review the immutable operational ledger before Mobile Money
          reconciliation is connected.
        </p>
      </section>

      {error ? (
        <p className="rounded-2xl border border-red-400/20 bg-red-400/[0.08] p-5 text-sm text-red-200">
          WastePay could not load the transaction ledger.
        </p>
      ) : null}

      <section className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 shadow-2xl backdrop-blur-xl sm:p-8">
        {transactions && transactions.length > 0 ? (
          <div className="grid gap-4">
            {transactions.map((transaction) => (
              <article
                key={transaction.id}
                className="rounded-3xl border border-white/10 bg-slate-950/50 p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="font-mono text-sm font-bold text-emerald-300">
                      {transaction.receipt_code}
                    </p>
                    <p className="mt-2 text-xs text-slate-600">
                      {formatDate(transaction.created_at)}
                    </p>
                  </div>
                  <span className="rounded-full border border-sky-400/20 bg-sky-400/[0.08] px-3 py-1 text-xs font-black uppercase tracking-[0.14em] text-sky-300">
                    {transaction.status}
                  </span>
                </div>
                <div className="mt-5 grid gap-4 text-sm sm:grid-cols-4">
                  <div>
                    <p className="text-slate-600">Weight</p>
                    <p className="mt-1 text-slate-200">
                      {Number(transaction.total_weight_kg).toLocaleString("en-CM")} KG
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-600">Payout</p>
                    <p className="mt-1 text-slate-200">
                      {Number(transaction.total_payout_cfa).toLocaleString("en-CM")} CFA
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-600">Provider</p>
                    <p className="mt-1 text-slate-200">{transaction.payout_provider}</p>
                  </div>
                  <div>
                    <p className="text-slate-600">Payout number</p>
                    <p className="mt-1 text-slate-200">{transaction.payout_phone_number}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="text-sm leading-7 text-slate-500">
            No buyback transactions have been recorded yet.
          </p>
        )}
      </section>
    </div>
  );
}
