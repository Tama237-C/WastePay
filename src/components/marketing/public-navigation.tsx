"use client";

import Link from "next/link";
import Image from "next/image";
import { EcologixMark } from "@/components/brand/ecologix-mark";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navigationItems = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "About",
    href: "/about",
  },
  {
    label: "How it works",
    href: "/how-it-works",
  },
  {
    label: "Impact",
    href: "/impact",
  },
  {
    label: "Programs",
    href: "/programs",
  },
  {
    label: "Partners",
    href: "/partners",
  },
  {
    label: "Contact",
    href: "/contact",
  },
  {
    label: "Track pickup",
    href: "/app#track",
  },
];

function isNavigationItemActive(
  pathname: string,
  href: string,
): boolean {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function PublicNavigation({ logoUrl }: { logoUrl?: string | null }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setIsMobileMenuOpen(false);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [pathname]);

  useEffect(() => {
    if (!isMobileMenuOpen) {
      document.body.style.overflow = "";

      return;
    }

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-[100] px-4 pt-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between rounded-[1.6rem] border border-white/10 bg-slate-950/75 px-4 py-3 shadow-2xl shadow-black/30 backdrop-blur-2xl sm:px-5">
          <Link
            href="/"
            aria-label="ECOLOGIX homepage"
            className="group flex min-w-0 items-center gap-3"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-emerald-200/20 bg-emerald-400 text-sm font-black tracking-[-0.05em] text-slate-950 shadow-lg shadow-emerald-500/20 transition-transform duration-300 group-hover:-translate-y-1 sm:h-12 sm:w-12">
              {logoUrl ? <Image src={logoUrl} alt="" width={48} height={48} className="h-full w-full object-cover" /> : <EcologixMark className="h-9 w-9" />}
            </span>

            <span className="min-w-0">
              <span className="block truncate text-sm font-black uppercase tracking-[0.24em] text-white sm:text-base">
                ECOLOGIX
              </span>

              <span className="mt-1 block truncate text-[0.55rem] font-black uppercase tracking-[0.22em] text-emerald-400 sm:text-[0.62rem]">
                Circular plastic economy
              </span>
            </span>
          </Link>

          <nav
            aria-label="Primary navigation"
            className="hidden items-center gap-1 xl:flex"
          >
            {navigationItems.map((item) => {
              const isActive = isNavigationItemActive(
                pathname,
                item.href,
              );

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-xl px-3 py-2.5 text-[0.68rem] font-black uppercase tracking-[0.12em] transition-all duration-300 ${
                    isActive
                      ? "bg-white/[0.08] text-emerald-300"
                      : "text-slate-400 hover:bg-white/[0.045] hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="/app/launch"
              className="wp-ghost-button min-h-11 px-4 py-3 text-[0.65rem]"
            >
              Go to App
            </Link>

          </div>

          <Link
            href="/app/launch"
            className="flex min-h-11 items-center justify-center rounded-2xl border border-emerald-300/20 bg-emerald-400 px-4 text-[0.68rem] font-black uppercase tracking-[0.12em] text-slate-950 shadow-lg shadow-emerald-500/15 transition-all duration-300 hover:bg-emerald-300 md:hidden"
          >
            App
          </Link>

          <button
            type="button"
            aria-label={
              isMobileMenuOpen
                ? "Close navigation menu"
                : "Open navigation menu"
            }
            aria-expanded={isMobileMenuOpen}
            onClick={() =>
              setIsMobileMenuOpen((currentState) => !currentState)
            }
            className="flex h-11 w-11 shrink-0 flex-col items-center justify-center gap-1.5 rounded-2xl border border-white/10 bg-white/[0.045] text-white transition-all duration-300 hover:border-emerald-400/25 hover:bg-emerald-400/10 xl:hidden"
          >
            <span
              className={`h-0.5 w-5 rounded-full bg-current transition-transform duration-300 ${
                isMobileMenuOpen
                  ? "translate-y-2 rotate-45"
                  : ""
              }`}
            />

            <span
              className={`h-0.5 w-5 rounded-full bg-current transition-opacity duration-300 ${
                isMobileMenuOpen ? "opacity-0" : "opacity-100"
              }`}
            />

            <span
              className={`h-0.5 w-5 rounded-full bg-current transition-transform duration-300 ${
                isMobileMenuOpen
                  ? "-translate-y-2 -rotate-45"
                  : ""
              }`}
            />
          </button>
        </div>
      </header>

      {isMobileMenuOpen ? (
        <div className="fixed inset-0 z-[90] overflow-y-auto bg-slate-950/96 px-5 pb-10 pt-28 backdrop-blur-2xl xl:hidden">
          <div className="mx-auto w-full max-w-2xl">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-emerald-400">
              Explore ECOLOGIX
            </p>

            <nav
              aria-label="Mobile navigation"
              className="mt-7 space-y-2"
            >
              {navigationItems.map((item, index) => {
                const isActive = isNavigationItemActive(
                  pathname,
                  item.href,
                );

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`group flex min-h-16 items-center justify-between rounded-2xl border px-5 py-4 transition-all duration-300 ${
                      isActive
                        ? "border-emerald-400/25 bg-emerald-400/[0.09]"
                        : "border-white/10 bg-white/[0.035] hover:border-white/20 hover:bg-white/[0.06]"
                    }`}
                  >
                    <span className="flex items-center gap-4">
                      <span
                        className={`font-mono text-xs font-black ${
                          isActive
                            ? "text-emerald-400"
                            : "text-slate-700"
                        }`}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <span
                        className={`text-base font-black ${
                          isActive
                            ? "text-white"
                            : "text-slate-300"
                        }`}
                      >
                        {item.label}
                      </span>
                    </span>

                    <span
                      aria-hidden="true"
                      className="text-slate-600 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-emerald-300"
                    >
                      →
                    </span>
                  </Link>
                );
              })}
            </nav>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <Link
                href="/app/launch"
                className="wp-primary-button"
              >
                Go to App
              </Link>
            </div>

            <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.035] p-6">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
                ECOLOGIX Cameroon
              </p>

              <p className="mt-4 text-sm font-light leading-7 text-slate-400">
                Technology, logistics, and instant value for a circular
                plastic economy.
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
