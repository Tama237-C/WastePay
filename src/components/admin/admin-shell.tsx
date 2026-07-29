"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { logoutStaff } from "@/actions/auth/logout";

type AdminShellProps = {
  children: ReactNode;
  administratorName: string;
  administratorEmail: string;
};

type NavigationItem = {
  label: string;
  shortLabel: string;
  description: string;
  href: string;
};

const navigationItems: NavigationItem[] = [
  {
    label: "Global overview",
    shortLabel: "01",
    description: "Executive impact and activity",
    href: "/admin/overview",
  },
  {
    label: "Financial control",
    shortLabel: "02",
    description: "Wallet floats, pricing and fraud",
    href: "/admin/financial-control",
  },
  {
    label: "Barcode catalog",
    shortLabel: "03",
    description: "Plastic intelligence approvals",
    href: "/admin/barcode-catalog",
  },
  {
    label: "Depot management",
    shortLabel: "04",
    description: "Centres, managers and inventory",
    href: "/admin/depot-management",
  },
  {
    label: "Logistics dispatch",
    shortLabel: "05",
    description: "Routes, drivers and requests",
    href: "/admin/logistics",
  },
  {
    label: "Staff management",
    shortLabel: "06",
    description: "Operational account control",
    href: "/admin/staff-management",
  },
  {
    label: "Transactions",
    shortLabel: "07",
    description: "Buyback and payout ledger",
    href: "/admin/transactions",
  },
  {
    label: "Collection requests",
    shortLabel: "08",
    description: "Residential pickup operations",
    href: "/admin/collection-requests",
  },
  {
    label: "Environmental impact",
    shortLabel: "09",
    description: "Recovery and accountability data",
    href: "/admin/environmental-impact",
  },
  {
    label: "System settings",
    shortLabel: "10",
    description: "Platform configuration",
    href: "/admin/settings",
  },
  {
    label: "Website content",
    shortLabel: "11",
    description: "Public text and homepage images",
    href: "/admin/website-content",
  },
  {
    label: "Theme editor",
    shortLabel: "12",
    description: "Global colors, type and branding",
    href: "/admin/theme-editor",
  },
  {
    label: "Page sections",
    shortLabel: "13",
    description: "Text and images across public pages",
    href: "/admin/website-sections",
  },
];

function getPageTitle(pathname: string): string {
  const activeItem = navigationItems.find((item) => pathname === item.href);

  return activeItem?.label ?? "WastePay administration";
}

function MenuIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <span className="relative block h-5 w-6" aria-hidden="true">
      <span
        className={`absolute left-0 top-0 h-0.5 w-6 rounded-full bg-current transition-all duration-300 ease-out ${
          isOpen ? "translate-y-[9px] rotate-45" : ""
        }`}
      />

      <span
        className={`absolute left-0 top-[9px] h-0.5 w-6 rounded-full bg-current transition-all duration-300 ease-out ${
          isOpen ? "opacity-0" : "opacity-100"
        }`}
      />

      <span
        className={`absolute bottom-0 left-0 h-0.5 w-6 rounded-full bg-current transition-all duration-300 ease-out ${
          isOpen ? "-translate-y-[9px] -rotate-45" : ""
        }`}
      />
    </span>
  );
}

export function AdminShell({
  children,
  administratorName,
  administratorEmail,
}: AdminShellProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const currentPageTitle = getPageTitle(pathname);

  function closeMobileMenu() {
    setIsMobileMenuOpen(false);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 top-0 h-[34rem] w-[34rem] rounded-full bg-emerald-400/[0.07] blur-[150px]" />

        <div className="absolute -right-48 bottom-0 h-[38rem] w-[38rem] rounded-full bg-sky-400/[0.06] blur-[170px]" />

        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:72px_72px]" />
      </div>

      <aside className="fixed inset-y-0 left-0 z-40 hidden w-80 border-r border-white/10 bg-slate-950/90 backdrop-blur-2xl xl:flex xl:flex-col">
        <div className="border-b border-white/10 px-7 py-8">
          <Link
            href="/admin/overview"
            className="group flex items-center gap-4"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-300/20 bg-emerald-400 text-sm font-black tracking-[-0.04em] text-slate-950 shadow-2xl shadow-emerald-500/20 transition-all duration-300 ease-out group-hover:-translate-y-1 group-hover:shadow-emerald-500/30">
              WP
            </span>

            <span>
              <span className="block text-sm font-black uppercase tracking-[0.24em] text-white">
                WastePay
              </span>

              <span className="mt-1 block text-[0.65rem] font-bold uppercase tracking-[0.2em] text-emerald-400">
                Command center
              </span>
            </span>
          </Link>
        </div>

        <nav
          aria-label="Administrator navigation"
          className="flex-1 overflow-y-auto px-4 py-6"
        >
          <p className="px-3 text-[0.62rem] font-black uppercase tracking-[0.28em] text-slate-600">
            Operational control
          </p>

          <div className="mt-4 space-y-2">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex items-center gap-4 rounded-2xl border px-3 py-3.5 transition-all duration-300 ease-out ${
                    isActive
                      ? "border-emerald-400/25 bg-emerald-400/10 shadow-lg shadow-emerald-500/[0.06]"
                      : "border-transparent hover:-translate-y-0.5 hover:border-white/10 hover:bg-white/[0.04]"
                  }`}
                >
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border text-[0.65rem] font-black tracking-[0.12em] transition-all duration-300 ${
                      isActive
                        ? "border-emerald-300/20 bg-emerald-400 text-slate-950"
                        : "border-white/10 bg-white/[0.04] text-slate-500 group-hover:border-white/20 group-hover:text-slate-300"
                    }`}
                  >
                    {item.shortLabel}
                  </span>

                  <span className="min-w-0">
                    <span
                      className={`block truncate text-sm font-bold ${
                        isActive ? "text-white" : "text-slate-300"
                      }`}
                    >
                      {item.label}
                    </span>

                    <span className="mt-1 block truncate text-[0.68rem] font-medium text-slate-600">
                      {item.description}
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="border-t border-white/10 p-4">
          <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-4">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-sky-300/20 bg-sky-400/10 text-sm font-black text-sky-300">
                {administratorName.charAt(0).toUpperCase()}
              </span>

              <span className="min-w-0">
                <span className="block truncate text-sm font-bold text-white">
                  {administratorName}
                </span>

                <span className="mt-1 block truncate text-xs text-slate-500">
                  {administratorEmail}
                </span>
              </span>
            </div>

            <div className="mt-4 flex items-center gap-2 rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.07] px-3 py-2.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(52,211,153,0.9)]" />

              <span className="text-[0.62rem] font-black uppercase tracking-[0.2em] text-emerald-300">
                Secure session active
              </span>
            </div>

            <form action={logoutStaff} className="mt-3">
              <button
                type="submit"
                className="min-h-11 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-xs font-black uppercase tracking-[0.18em] text-slate-400 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-red-400/25 hover:bg-red-400/10 hover:text-red-200 hover:shadow-xl hover:shadow-red-500/[0.08] focus:outline-none focus:ring-4 focus:ring-red-400/10"
              >
                Sign out securely
              </button>
            </form>
          </div>
        </div>
      </aside>

      <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/80 px-5 py-4 backdrop-blur-2xl sm:px-8 xl:ml-80 xl:px-10">
        <div className="mx-auto flex max-w-[100rem] items-center justify-between gap-5">
          <div className="flex min-w-0 items-center gap-4">
            <button
              type="button"
              aria-label={
                isMobileMenuOpen
                  ? "Close administrator menu"
                  : "Open administrator menu"
              }
              aria-expanded={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen((current) => !current)}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-slate-300 transition-all duration-300 ease-out hover:border-emerald-400/30 hover:bg-emerald-400/10 hover:text-emerald-300 focus:outline-none focus:ring-4 focus:ring-emerald-400/10 xl:hidden"
            >
              <MenuIcon isOpen={isMobileMenuOpen} />
            </button>

            <div className="min-w-0">
              <p className="text-[0.62rem] font-black uppercase tracking-[0.26em] text-emerald-400">
                WastePay administration
              </p>

              <h1 className="mt-1 truncate text-xl font-black tracking-[-0.035em] text-white sm:text-2xl">
                {currentPageTitle}
              </h1>
            </div>
          </div>

          <div className="hidden items-center gap-3 sm:flex">
            <div className="rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-2.5">
              <p className="text-[0.58rem] font-bold uppercase tracking-[0.2em] text-slate-600">
                Environment
              </p>

              <p className="mt-1 text-xs font-black uppercase tracking-[0.16em] text-amber-300">
                Production
              </p>
            </div>

            <div className="rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.07] px-4 py-2.5">
              <p className="text-[0.58rem] font-bold uppercase tracking-[0.2em] text-emerald-500/70">
                System state
              </p>

              <div className="mt-1 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.9)]" />

                <p className="text-xs font-black uppercase tracking-[0.16em] text-emerald-300">
                  Operational
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {isMobileMenuOpen ? (
        <div className="fixed inset-0 z-50 xl:hidden">
          <button
            type="button"
            aria-label="Close administrator navigation"
            onClick={closeMobileMenu}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
          />

          <aside className="absolute inset-y-0 left-0 flex w-[min(88vw,23rem)] flex-col border-r border-white/10 bg-slate-950 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-5">
              <Link
                href="/admin/overview"
                onClick={closeMobileMenu}
                className="flex items-center gap-3"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400 text-sm font-black text-slate-950">
                  WP
                </span>

                <span>
                  <span className="block text-sm font-black uppercase tracking-[0.2em] text-white">
                    WastePay
                  </span>

                  <span className="mt-1 block text-[0.6rem] font-bold uppercase tracking-[0.18em] text-emerald-400">
                    Command center
                  </span>
                </span>
              </Link>

              <button
                type="button"
                aria-label="Close menu"
                onClick={closeMobileMenu}
                className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-slate-400 transition-all duration-300 hover:border-red-400/30 hover:bg-red-400/10 hover:text-red-200"
              >
                <MenuIcon isOpen />
              </button>
            </div>

            <nav
              aria-label="Mobile administrator navigation"
              className="flex-1 overflow-y-auto px-4 py-5"
            >
              <div className="space-y-2">
                {navigationItems.map((item) => {
                  const isActive = pathname === item.href;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={closeMobileMenu}
                      className={`flex items-center gap-4 rounded-2xl border px-3 py-3.5 transition-all duration-300 ${
                        isActive
                          ? "border-emerald-400/25 bg-emerald-400/10"
                          : "border-transparent hover:border-white/10 hover:bg-white/[0.04]"
                      }`}
                    >
                      <span
                        className={`flex h-10 w-10 items-center justify-center rounded-xl border text-[0.65rem] font-black ${
                          isActive
                            ? "border-emerald-300/20 bg-emerald-400 text-slate-950"
                            : "border-white/10 bg-white/[0.04] text-slate-500"
                        }`}
                      >
                        {item.shortLabel}
                      </span>

                      <span>
                        <span className="block text-sm font-bold text-white">
                          {item.label}
                        </span>

                        <span className="mt-1 block text-[0.68rem] text-slate-600">
                          {item.description}
                        </span>
                      </span>
                    </Link>
                  );
                })}
              </div>
            </nav>

            <div className="border-t border-white/10 p-4">
              <p className="truncate text-sm font-bold text-white">
                {administratorName}
              </p>

              <p className="mt-1 truncate text-xs text-slate-500">
                {administratorEmail}
              </p>

              <form action={logoutStaff} className="mt-4">
                <button
                  type="submit"
                  className="min-h-12 w-full rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-xs font-black uppercase tracking-[0.18em] text-red-200 transition-all duration-300 hover:-translate-y-0.5 hover:bg-red-400/15"
                >
                  Sign out securely
                </button>
              </form>
            </div>
          </aside>
        </div>
      ) : null}

      <div className="relative xl:ml-80">
        <main className="mx-auto w-full max-w-[100rem] px-5 py-7 sm:px-8 sm:py-9 xl:px-10 xl:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}
