import type { Metadata } from "next";
import { StaffLoginForm } from "./staff-login-form";

export const metadata: Metadata = { title: "Sign in | WastePay", description: "Secure access to the WastePay collection network." };
const workspaceLabels: Record<string, string> = { collector: "Collector", agent: "Depot agent", driver: "Driver", manager: "Depot manager", admin: "Administrator" };

export default async function StaffLoginPage({ searchParams }: { searchParams: Promise<{ workspace?: string }> }) {
  const { workspace } = await searchParams;
  const workspaceLabel = workspace ? workspaceLabels[workspace] : null;
  return <main className="wp-auth-page"><div className="wp-auth-page__glow wp-auth-page__glow--one" /><div className="wp-auth-page__glow wp-auth-page__glow--two" /><section className="wp-auth-card"><header className="wp-auth-brand"><span className="wp-app-brand__mark">W</span><span>WastePay</span><em>Secure network</em></header><div className="wp-auth-intro"><p className="wp-overline">{workspaceLabel ? `${workspaceLabel} workspace` : "Welcome back"}</p><h1>Work that leaves<br />a lighter footprint.</h1><p>{workspaceLabel ? `Sign in to continue to the ${workspaceLabel.toLowerCase()} workspace.` : "Sign in to manage collections, recovery, and transparent payouts."}</p></div><StaffLoginForm /><footer className="wp-auth-footnote"><span>●</span> Your account and operational data are protected.</footer></section></main>;
}
