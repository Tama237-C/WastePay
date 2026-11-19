"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";

const navigationItems = [
  { label: "Home", href: "#home", icon: "M3 10 12 3l9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V10Z" },
  { label: "Book", href: "#pickup", icon: "M8 2v4m8-4v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14H3V6a2 2 0 0 1 2-2Z" },
  { label: "Track", href: "#track", icon: "M3 12h4l3-8 4 16 3-8h4" },
  { label: "Staff", href: "/app/workspaces", icon: "M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2m6-10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm8-3v6m3-3h-6" },
] as const;

export function ConsumerAppShell({ children }: { children: ReactNode }) {
  const [hash, setHash] = useState("");

  useEffect(() => {
    const syncHash = () => setHash(window.location.hash || "#home");
    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, []);

  return (
    <div className="wp-app-shell">
      <header className="wp-app-header">
        <Link href="/app#home" className="wp-app-brand" aria-label="WastePay app home">
          <span className="wp-app-brand__mark">W</span>
          <span>WastePay</span>
        </Link>
        <div className="wp-app-header__context">
          <p>Your circular recovery app</p>
          <span>Cameroon</span>
        </div>
        <Link href="/app/workspaces" className="wp-consumer-app__staff-link">
          Staff
        </Link>
      </header>

      <div className="wp-app-shell__content">{children}</div>

      <nav className="wp-bottom-nav wp-bottom-nav--consumer" aria-label="App navigation">
        {navigationItems.map((item) => {
          const active = item.href.startsWith("#") && item.href === hash;
          return (
            <Link
              key={item.label}
              href={item.href.startsWith("#") ? `/app${item.href}` : item.href}
              className={`wp-bottom-nav__item ${active ? "is-active" : ""}`}
              aria-current={active ? "page" : undefined}
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
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
