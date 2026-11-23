import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { ChangePasswordForm } from "./change-password-form";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Secure Your Account | ECOLOGIX",
  description:
    "Replace your temporary ECOLOGIX staff password before entering the operational platform.",
};

export default async function ChangePasswordPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/app/staff-login");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role, is_active, must_change_password")
    .eq("id", user.id)
    .single();

  if (profileError || !profile || !profile.is_active) {
    await supabase.auth.signOut();
    redirect("/app/staff-login");
  }

  if (!profile.must_change_password) {
    switch (profile.role) {
      case "admin":
        redirect("/admin/overview");

      case "manager":
        redirect("/app/manager");

      case "agent":
        redirect("/app/agent");

      case "driver":
        redirect("/app/driver");

      case "collector":
        redirect("/app/collector");

      default:
        await supabase.auth.signOut();
        redirect("/app/staff-login");
    }
  }

  return <main className="wp-auth-page">
    <div className="wp-auth-page__glow wp-auth-page__glow--one" />
    <div className="wp-auth-page__glow wp-auth-page__glow--two" />
    <section className="wp-auth-card">
      <div className="wp-auth-brand"><span className="wp-app-brand__mark">W</span><span>ECOLOGIX</span><em>Account security</em></div>
      <div className="wp-auth-intro"><p className="wp-overline">One last step</p><h1>Make this account yours.</h1><p>Replace your temporary password before entering the ECOLOGIX operational network.</p></div>
      <ChangePasswordForm />
      <p className="wp-auth-footnote"><span>â—</span> ECOLOGIX administrators cannot view your permanent password.</p>
    </section>
  </main>;
}
