"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode, type TouchEvent } from "react";

import { logoutCustomer } from "@/actions/auth/customer-auth";
import { EcologixMark } from "@/components/brand/ecologix-mark";

const bottomItems = [
  { label: "Home", href: "/app", icon: "M3 10 12 3l9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V10Z" },
  { label: "Scan", href: "/app/scan", icon: "M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3M8 12h8" },
  { label: "Book", href: "/app/book", icon: "M8 2v4m8-4v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14H3V6a2 2 0 0 1 2-2Z" },
  { label: "Profile", href: "/app/account", icon: "M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2m6-10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" },
] as const;

const drawerItems = [
  { label: "Home", href: "/app", icon: "M3 10 12 3l9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V10Z" },
  { label: "Explore", href: "/app/explore", icon: "M12 3v3m0 12v3m9-9h-3M6 12H3m15.36-6.36-2.12 2.12M7.76 16.24l-2.12 2.12m12.72 0-2.12-2.12M7.76 7.76 5.64 5.64M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" },
  { label: "Events", href: "/app/events", icon: "M8 2v4m8-4v4M4 9h16M5 4h14a2 2 0 0 1 2 2v13H3V6a2 2 0 0 1 2-2Z" },
  { label: "Account", href: "/app/account", icon: "M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2m6-10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" },
  { label: "About us", href: "/app/about", icon: "M12 17v-5m0-4h.01M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z" },
  { label: "Contact", href: "/app/contact", icon: "M3 5h18v14H3zM3 6l9 7 9-7" },
  { label: "Help", href: "/app/help", icon: "M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3m.1 4h.01M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z" },
  { label: "Settings", href: "/app/settings", icon: "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm0-5v2m0 14v2m9-9h-2M5 12H3m15.36-6.36-1.41 1.41M7.05 16.95l-1.41 1.41m12.72 0-1.41-1.41M7.05 7.05 5.64 5.64" },
] as const;

function isActivePath(pathname: string, href: string): boolean {
  if (href === "/app") return pathname === "/app";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function ConsumerAppShell({
  children,
  profileName,
  profileEmail,
}: {
  children: ReactNode;
  profileName?: string | null;
  profileEmail?: string | null;
}) {
  const pathname = usePathname();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const displayName = profileName?.trim() || "ECOLOGIX guest";
  const displayEmail = profileEmail?.trim() || "Sign in to manage your account";
  const avatarLetter = displayName.charAt(0).toUpperCase() || "E";
  const isSignedIn = Boolean(profileEmail);

  useEffect(() => {
    if (!isDrawerOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsDrawerOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isDrawerOpen]);

  function handleTouchStart(event: TouchEvent<HTMLDivElement>) {
    const startX = event.touches[0]?.clientX;
    if (startX === undefined) return;
    touchStartX.current = isDrawerOpen || startX <= 28 ? startX : null;
  }

  function handleTouchEnd(event: TouchEvent<HTMLDivElement>) {
    const startX = touchStartX.current;
    const endX = event.changedTouches[0]?.clientX;
    touchStartX.current = null;
    if (startX === null || endX === undefined) return;

    const deltaX = endX - startX;
    if (!isDrawerOpen && startX <= 28 && deltaX >= 64) {
      setIsDrawerOpen(true);
    } else if (isDrawerOpen && deltaX <= -72) {
      setIsDrawerOpen(false);
    }
  }

  return (
    <div
      className="wp-app-shell"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={() => { touchStartX.current = null; }}
    >
      <header className="wp-app-header">
        <div className="wp-app-header__inner">
          <button
            type="button"
            onClick={() => setIsDrawerOpen(true)}
            aria-label="Open navigation menu"
            aria-expanded={isDrawerOpen}
            aria-controls="ecologix-app-drawer"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-white transition hover:bg-white/10"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <Link href="/app" className="wp-app-brand" aria-label="ECOLOGIX app home">
            <span className="wp-app-brand__mark" style={{ background: "linear-gradient(145deg, #0d79d2, #03498f)" }}>
              <EcologixMark className="h-8 w-8" />
            </span>
            <span>ECOLOGIX</span>
          </Link>

          <div className="wp-app-header__actions">
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsNotificationsOpen((open) => !open)}
                aria-label="Notifications"
                aria-expanded={isNotificationsOpen}
                className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-200 transition hover:bg-white/10"
              >
                <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" />
                </svg>
              </button>
              {isNotificationsOpen ? (
                <div role="status" className="absolute right-0 top-12 z-[70] w-64 rounded-2xl border border-white/10 bg-slate-900 p-4 shadow-2xl">
                  <p className="text-sm font-bold text-white">Notifications</p>
                  <p className="mt-2 text-xs leading-5 text-slate-300">
                    Updates will appear here. Notifications are being connected to your ECOLOGIX account.
                  </p>
                </div>
              ) : null}
            </div>
            <Link
              href="/app/account"
              onClick={() => setIsNotificationsOpen(false)}
              aria-label={`Open ${displayName} profile`}
              className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-full border-2 border-sky-300/60 bg-gradient-to-br from-emerald-400 to-sky-500 text-sm font-black text-slate-950 shadow-lg shadow-blue-950/30"
            >
              {avatarLetter}
            </Link>
          </div>
        </div>
      </header>

      <main className="wp-app-shell__content">{children}</main>

      {isDrawerOpen ? (
        <>
          <button
            type="button"
            onClick={() => setIsDrawerOpen(false)}
            aria-label="Close navigation menu"
            className="wp-app-drawer-backdrop fixed inset-x-0 top-0 z-40 bg-slate-950/45 backdrop-blur-md"
          />
          <aside
            id="ecologix-app-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="ECOLOGIX navigation"
            className="fixed inset-y-0 left-0 z-[60] flex w-[min(86vw,21rem)] flex-col overflow-y-auto border-r border-white/10 bg-[#0b1423] px-5 pb-5 pt-[max(1rem,env(safe-area-inset-top))] shadow-[24px_0_80px_rgba(0,0,0,0.5)]"
          >
            <div className="flex items-center justify-between">
              <Link href="/app" onClick={() => setIsDrawerOpen(false)} className="flex items-center gap-2.5">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-blue-700">
                  <EcologixMark className="h-9 w-9" />
                </span>
                <span>
                  <span className="block text-sm font-black tracking-[0.12em] text-white">ECOLOGIX</span>
                  <span className="mt-1 block text-[0.58rem] text-slate-400">From Waste to Value, Digitally.</span>
                </span>
              </Link>
              <button type="button" onClick={() => setIsDrawerOpen(false)} aria-label="Close menu" className="grid h-9 w-9 place-items-center rounded-xl text-slate-300 hover:bg-white/10">
                <span aria-hidden="true" className="text-2xl leading-none">×</span>
              </button>
            </div>

            <Link
              href="/app/account"
              onClick={() => setIsDrawerOpen(false)}
              className="mt-7 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3.5"
            >
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-sky-300/50 bg-gradient-to-br from-emerald-400 to-sky-500 text-lg font-black text-slate-950">
                {avatarLetter}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-bold text-white">{displayName}</span>
                <span className="mt-1 block truncate text-xs text-slate-400">{displayEmail}</span>
              </span>
            </Link>

            <nav aria-label="Main menu" className="mt-6 grid gap-1">
              {drawerItems.map((item) => {
                const active = isActivePath(pathname, item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsDrawerOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={`flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold transition ${active ? "bg-sky-400/15 text-sky-200" : "text-slate-300 hover:bg-white/[0.06] hover:text-white"}`}
                  >
                    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-[1.15rem] w-[1.15rem] shrink-0" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                      <path d={item.icon} />
                    </svg>
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <Link href="/app/workspaces" onClick={() => setIsDrawerOpen(false)} className="mt-4 flex min-h-11 items-center gap-3 rounded-xl border border-white/10 px-3 text-sm font-semibold text-slate-300 transition hover:bg-white/[0.06] hover:text-white">
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-[1.15rem] w-[1.15rem]" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18M5 21V7l8-4v18m0-12h6v12M8 9v.01M8 12v.01M8 15v.01M16 13v.01M16 16v.01" /></svg>
              Staff workspace
            </Link>

            <div className="mt-auto pt-7">
              {isSignedIn ? (
                <form action={logoutCustomer}>
                  <button type="submit" className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-left text-sm font-bold text-red-300 transition hover:bg-red-400/10 hover:text-red-200">
                    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-[1.15rem] w-[1.15rem]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M10 17l5-5-5-5m5 5H3m9-9h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7" /></svg>
                    Log out
                  </button>
                </form>
              ) : (
                <Link href="/app/account" onClick={() => setIsDrawerOpen(false)} className="flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-bold text-emerald-300 transition hover:bg-emerald-400/10">
                  Sign in
                </Link>
              )}
              <p className="mt-5 px-3 text-[0.65rem] font-medium tracking-[0.08em] text-slate-600">Version 2.4.2</p>
            </div>
          </aside>
        </>
      ) : null}

      <nav className="wp-bottom-nav wp-bottom-nav--consumer" aria-label="App navigation">
        {bottomItems.map((item) => {
          const active = isActivePath(pathname, item.href);
          return (
            <Link
              key={item.label}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`wp-bottom-nav__item ${active ? "is-active" : ""}`}
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d={item.icon} />
              </svg>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
