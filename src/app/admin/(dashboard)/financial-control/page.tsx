import { createAdminClient } from "@/lib/supabase/admin";

export default async function FinancialControlPage() {
  const adminClient = createAdminClient();
  const { data: rules, error } = await adminClient
    .from("pricing_rules")
    .select(
      "id, rule_name, material_type, base_rate_cfa, regional_multiplier, campaign_bonus_cfa, city_name, status, start_date, expiration_date",
    )
    .order("start_date", { ascending: false });

  return (
    <div className="space-y-7">
      <section className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-7 shadow-2xl backdrop-blur-xl sm:p-9">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-amber-400">
          Financial control
        </p>
        <h1 className="mt-5 text-4xl font-black tracking-[-0.05em] text-white sm:text-5xl">
          Pricing rules
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-8 text-slate-400">
          Review the versioned material rates used by the buyback pricing
          engine. Editing will be enabled after approval and audit controls are
          complete.
        </p>
      </section>

      {error ? (
        <p className="rounded-2xl border border-red-400/20 bg-red-400/[0.08] p-5 text-sm text-red-200">
          ECOLOGIX could not load pricing rules.
        </p>
      ) : null}

      <section className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 shadow-2xl backdrop-blur-xl sm:p-8">
        {rules && rules.length > 0 ? (
          <div className="grid gap-4">
            {rules.map((rule) => (
              <article key={rule.id} className="rounded-3xl border border-white/10 bg-slate-950/50 p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-lg font-black text-white">{rule.rule_name}</p>
                    <p className="mt-2 text-sm text-slate-500">
                      {rule.material_type} {rule.city_name ? `· ${rule.city_name}` : ""}
                    </p>
                  </div>
                  <span className="rounded-full border border-amber-400/20 bg-amber-400/[0.08] px-3 py-1 text-xs font-black uppercase tracking-[0.14em] text-amber-300">
                    {rule.status}
                  </span>
                </div>
                <div className="mt-5 grid gap-4 text-sm sm:grid-cols-4">
                  <div><p className="text-slate-600">Base rate</p><p className="mt-1 text-slate-200">{Number(rule.base_rate_cfa).toLocaleString("en-CM")} CFA/KG</p></div>
                  <div><p className="text-slate-600">Multiplier</p><p className="mt-1 text-slate-200">{rule.regional_multiplier}Ã—</p></div>
                  <div><p className="text-slate-600">Campaign bonus</p><p className="mt-1 text-slate-200">{Number(rule.campaign_bonus_cfa).toLocaleString("en-CM")} CFA</p></div>
                  <div><p className="text-slate-600">Valid until</p><p className="mt-1 text-slate-200">{new Intl.DateTimeFormat("en-CM", { dateStyle: "medium" }).format(new Date(rule.expiration_date))}</p></div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="text-sm leading-7 text-slate-500">No pricing rules have been configured yet.</p>
        )}
      </section>
    </div>
  );
}
