import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { ChangePasswordForm } from "./change-password-form";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Secure Your Account | WastePay",
  description:
    "Replace your temporary WastePay staff password before entering the operational platform.",
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

      default:
        await supabase.auth.signOut();
        redirect("/app/staff-login");
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-5 py-10 text-slate-100 sm:px-8">
      <div className="pointer-events-none absolute -left-32 top-0 h-[30rem] w-[30rem] rounded-full bg-emerald-400/10 blur-[140px]" />

      <div className="pointer-events-none absolute -right-32 bottom-0 h-[32rem] w-[32rem] rounded-full bg-sky-400/10 blur-[150px]" />

      <section className="relative w-full max-w-xl rounded-[2rem] border border-white/10 bg-slate-900/60 p-7 shadow-2xl backdrop-blur-xl sm:p-10">
        <div className="flex items-center gap-3">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.9)]" />

          <p className="text-xs font-black uppercase tracking-[0.3em] text-emerald-400">
            WastePay account security
          </p>
        </div>

        <h1 className="mt-8 text-4xl font-black tracking-[-0.05em] text-white sm:text-5xl">
          Replace your temporary password.
        </h1>

        <p className="mt-5 text-base font-light leading-7 text-slate-400">
          Before accessing WastePay operations, create a permanent password
          known only to you.
        </p>

        <ChangePasswordForm />

        <p className="mt-7 border-t border-white/10 pt-6 text-sm font-light leading-6 text-slate-600">
          WastePay administrators cannot view your new permanent password.
        </p>
      </section>
    </main>
  );
}