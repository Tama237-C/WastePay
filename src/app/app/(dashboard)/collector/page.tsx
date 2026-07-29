import { redirect } from "next/navigation";

import { logoutStaff } from "@/actions/auth/logout";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export default async function CollectorDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/app/staff-login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role, is_active, must_change_password, phone_number, mobile_money_provider")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "collector" || !profile.is_active) {
    await supabase.auth.signOut();
    redirect("/app/staff-login");
  }
  if (profile.must_change_password) redirect("/app/change-password");

  const adminClient = createAdminClient();
  const { data: transactions } = await adminClient
    .from("transactions")
    .select("receipt_code, total_weight_kg, total_payout_cfa, status, created_at")
    .eq("collector_profile_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-slate-950 px-5 py-8 text-white sm:px-8">
      <section className="mx-auto max-w-5xl rounded-[2rem] border border-white/10 bg-white/[0.035] p-7 shadow-2xl sm:p-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-emerald-400">
              WastePay collector account
            </p>
            <h1 className="mt-5 text-4xl font-black tracking-[-0.05em] sm:text-5xl">
              Welcome, {profile.full_name ?? "collector"}
            </h1>
            <p className="mt-4 text-base leading-7 text-slate-400">
              Your verified collector profile is ready for depot buyback
              transactions.
            </p>
          </div>
          <form action={logoutStaff}>
            <button className="min-h-12 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-xs font-black uppercase tracking-[0.16em] text-slate-300">
              Sign out
            </button>
          </form>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
              Mobile Money
            </p>
            <p className="mt-3 text-lg font-bold text-white">
              {profile.mobile_money_provider === "MTN_MOMO"
                ? "MTN Mobile Money"
                : "Orange Money"}
            </p>
            <p className="mt-2 text-sm text-slate-500">{profile.phone_number}</p>
          </div>
          <div className="rounded-2xl border border-amber-400/15 bg-amber-400/[0.06] p-5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-300/70">
              Buyback history
            </p>
            <p className="mt-3 text-lg font-bold text-white">
              {transactions?.length ?? 0} recorded transaction
              {(transactions?.length ?? 0) === 1 ? "" : "s"}
            </p>
          </div>
        </div>
        <section className="mt-8 rounded-3xl border border-white/10 bg-slate-950/50 p-6">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-sky-400">
            Transaction history
          </p>
          <h2 className="mt-3 text-2xl font-black text-white">
            Your buyback records
          </h2>
          {transactions && transactions.length > 0 ? (
            <div className="mt-6 grid gap-4">
              {transactions.map((transaction) => (
                <article
                  key={transaction.receipt_code}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="font-mono text-sm font-bold text-emerald-300">
                      {transaction.receipt_code}
                    </p>
                    <span className="rounded-full border border-white/10 px-3 py-1 text-xs font-bold text-slate-300">
                      {transaction.status}
                    </span>
                  </div>
                  <p className="mt-4 text-sm text-slate-400">
                    {Number(transaction.total_weight_kg).toLocaleString("en-CM")} KG
                    {" · "}
                    {Number(transaction.total_payout_cfa).toLocaleString("en-CM")} CFA
                  </p>
                </article>
              ))}
            </div>
          ) : (
            <p className="mt-5 text-sm leading-7 text-slate-500">
              No buyback transactions have been recorded for this collector yet.
            </p>
          )}
        </section>
      </section>
    </main>
  );
}
