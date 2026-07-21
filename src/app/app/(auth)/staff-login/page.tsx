import type { Metadata } from "next";

import { StaffLoginForm } from "./staff-login-form";

export const metadata: Metadata = {
  title: "Staff Login | WastePay",
  description:
    "Secure operational access for WastePay depot agents, managers, and administrators.",
};

export default function StaffLoginPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 px-5 py-10 text-slate-100 sm:px-8 lg:px-12">
      <div className="pointer-events-none absolute -left-32 top-20 h-96 w-96 rounded-full bg-emerald-400/10 blur-[130px]" />

      <div className="pointer-events-none absolute -right-32 bottom-10 h-[28rem] w-[28rem] rounded-full bg-sky-400/10 blur-[150px]" />

      <div className="relative mx-auto grid min-h-[calc(100vh-5rem)] w-full max-w-7xl overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/50 shadow-2xl backdrop-blur-xl lg:grid-cols-[1.08fr_0.92fr]">
        <section className="relative hidden min-h-full overflow-hidden border-r border-white/10 p-12 lg:flex lg:flex-col lg:justify-between">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(52,211,153,0.12),transparent_42%),radial-gradient(circle_at_bottom_right,rgba(56,189,248,0.1),transparent_38%)]" />

          <div className="relative">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 backdrop-blur-md">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.9)]" />

              <span className="text-xs font-black uppercase tracking-[0.28em] text-emerald-300">
                WastePay operations
              </span>
            </div>

            <h1 className="mt-14 max-w-xl text-6xl font-black uppercase leading-[0.92] tracking-[-0.055em] text-white xl:text-7xl">
              Plastic recovery,
              <span className="block font-light text-slate-400">
                intelligently managed.
              </span>
            </h1>

            <p className="mt-8 max-w-lg text-lg font-light leading-8 text-slate-300">
              Secure access for depot agents, operational managers, and
              platform administrators coordinating WastePay’s circular economy
              infrastructure.
            </p>
          </div>

          <div className="relative grid gap-4 sm:grid-cols-2">
            <article className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-emerald-400/20 hover:shadow-2xl hover:shadow-emerald-500/10">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500">
                Protected access
              </p>

              <p className="mt-3 text-xl font-bold text-white">
                Role-aware routing
              </p>
            </article>

            <article className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-sky-400/20 hover:shadow-2xl hover:shadow-sky-500/10">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500">
                Infrastructure
              </p>

              <p className="mt-3 text-xl font-bold text-white">
                Supabase secured
              </p>
            </article>
          </div>
        </section>

        <section className="flex items-center px-6 py-12 sm:px-10 lg:px-14 xl:px-16">
          <div className="mx-auto w-full max-w-md">
            <div className="flex items-center gap-3 lg:hidden">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.9)]" />

              <span className="text-xs font-black uppercase tracking-[0.28em] text-emerald-300">
                WastePay operations
              </span>
            </div>

            <p className="mt-10 text-xs font-bold uppercase tracking-[0.28em] text-slate-500 lg:mt-0">
              Authorized personnel
            </p>

            <h2 className="mt-5 text-4xl font-black tracking-[-0.045em] text-white sm:text-5xl">
              Staff sign in
            </h2>

            <p className="mt-5 text-base font-light leading-7 text-slate-400">
              Enter the credentials assigned to your WastePay operational
              account.
            </p>

            <StaffLoginForm />

            <div className="mt-8 border-t border-white/10 pt-6">
              <p className="text-sm leading-6 text-slate-500">
                Access attempts are monitored. Unauthorized use of WastePay
                operational systems is prohibited.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}