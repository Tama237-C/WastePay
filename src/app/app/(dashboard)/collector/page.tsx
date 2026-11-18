import Link from "next/link";
import { redirect } from "next/navigation";

import { logoutStaff } from "@/actions/auth/logout";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { AccountSettings } from "@/components/collector/account-settings";

export default async function CollectorDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/app/staff-login");

  const { data: profile } = await supabase.from("profiles").select("full_name, role, is_active, must_change_password, phone_number, mobile_money_provider").eq("id", user.id).single();
  if (!profile || profile.role !== "collector" || !profile.is_active) { await supabase.auth.signOut(); redirect("/app/staff-login"); }
  if (profile.must_change_password) redirect("/app/change-password");

  const { data: transactions } = await createAdminClient().from("transactions").select("receipt_code, total_weight_kg, total_payout_cfa, status, created_at").eq("collector_profile_id", user.id).order("created_at", { ascending: false });
  const records = transactions ?? [];
  const paid = records.filter((item) => item.status === "PAID" || item.status === "COMPLETED").reduce((sum, item) => sum + Number(item.total_payout_cfa), 0);
  const pending = records.filter((item) => item.status !== "PAID" && item.status !== "COMPLETED").reduce((sum, item) => sum + Number(item.total_payout_cfa), 0);
  const weight = records.reduce((sum, item) => sum + Number(item.total_weight_kg), 0);

  return <main className="wp-mobile-page">
    <section className="wp-wallet-card wp-fade-up">
      <div className="wp-wallet-card__orb" />
      <div className="relative flex items-start justify-between gap-4"><div><p className="wp-overline">Available wallet</p><p className="wp-wallet-card__amount">{(paid + pending).toLocaleString("en-CM")}<small> CFA</small></p></div><span className="wp-wallet-card__chip">WP</span></div>
      <div className="relative mt-8 flex items-end justify-between text-sm"><div><p className="text-white/50">{profile.mobile_money_provider === "MTN_MOMO" ? "MTN Mobile Money" : "Orange Money"}</p><p className="mt-1 font-semibold tracking-wide">{profile.phone_number ?? "Payment account"}</p></div><span className="wp-status-dot">Verified</span></div>
    </section>

    <section className="wp-primary-action wp-fade-up-delay-1" id="work"><div><p className="wp-overline text-emerald-200">Ready to recycle?</p><h1>Turn plastic into value.</h1><p>Visit a WastePay depot to weigh your recyclables and receive your payout.</p></div><Link href="#wallet" className="wp-round-action" aria-label="View your wallet">→</Link></section>

    <section className="wp-quick-actions" aria-label="Quick actions"><a href="#wallet"><span>◈</span><small>Wallet</small></a><a href="#collection"><span>⌁</span><small>Pickup</small></a><a href="#history"><span>↗</span><small>Activity</small></a><form action={logoutStaff}><button aria-label="Sign out"><span>⎋</span><small>Sign out</small></button></form></section>

    <section className="wp-stat-row" id="wallet"><article><p>Pending payout</p><strong>{pending.toLocaleString("en-CM")} CFA</strong><span>Processing securely</span></article><article><p>Plastic recovered</p><strong>{weight.toLocaleString("en-CM")} KG</strong><span>{records.length} recorded intakes</span></article></section>

    <section className="wp-account-summary" id="profile"><div className="wp-account-summary__avatar">{(profile.full_name ?? "W").trim().slice(0, 1).toUpperCase()}</div><div><p className="wp-overline">Collector account</p><h2>{profile.full_name ?? "WastePay collector"}</h2><span>Identity verified · {profile.mobile_money_provider === "MTN_MOMO" ? "MTN MoMo" : "Orange Money"} linked</span></div><span className="wp-status-dot">Active</span></section>
    <AccountSettings fullName={profile.full_name} phoneNumber={profile.phone_number} provider={profile.mobile_money_provider === "MTN_MOMO" || profile.mobile_money_provider === "ORANGE_MONEY" ? profile.mobile_money_provider : null} />

    <section className="wp-activity-section" id="history"><div className="wp-section-heading"><div><p className="wp-overline">Recent activity</p><h2>Your transactions</h2></div><span>{records.length} total</span></div>{records.length > 0 ? <div className="wp-activity-list">{records.map((item) => <article key={item.receipt_code} className="wp-activity-item"><span className="wp-activity-item__icon">♻</span><div><p>Recycling payout</p><small>{item.receipt_code} · {Number(item.total_weight_kg).toLocaleString("en-CM")} KG</small></div><div className="text-right"><strong>+{Number(item.total_payout_cfa).toLocaleString("en-CM")} CFA</strong><small className="wp-transaction-status">{item.status.replaceAll("_", " ")}</small></div></article>)}</div> : <div className="wp-empty-state"><span>♻</span><h3>Your wallet is ready</h3><p>Your recycling rewards will appear here after your first depot intake.</p></div>}</section>
  </main>;
}
