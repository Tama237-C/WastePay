"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

type WorkspaceRole = "agent" | "collector" | "driver" | "manager";

type MobileAppShellProps = {
  children: ReactNode;
  role: WorkspaceRole | null;
  name?: string | null;
};

const roleLabels: Record<WorkspaceRole, string> = {
  agent: "Depot intake",
  collector: "My wallet",
  driver: "Field collection",
  manager: "Depot control",
};

function Icon({ name }: { name: "home" | "scan" | "collection" | "wallet" | "profile" | "bell" }) {
  const paths = {
    home: <path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V10Z" />,
    scan: <path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3M8 12h8" />,
    collection: <path d="M4 5h16v12H4zM8 17v3m8-3v3M7 9h10" />,
    wallet: <path d="M4 7a3 3 0 0 1 3-3h10v16H7a3 3 0 0 1-3-3V7Zm0 1h16v9H7a3 3 0 0 0-3 3" />,
    profile: <path d="M20 21a8 8 0 0 0-16 0M12 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />,
    bell: <path d="M18 10a6 6 0 1 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM10 22h4" />,
  };

  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}

export function MobileAppShell({ children, role, name }: MobileAppShellProps) {
  const pathname = usePathname();
  const [hash, setHash] = useState("");
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  useEffect(() => {
    const syncHash = () => setHash(window.location.hash);
    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, []);
  const homeHref = role ? `/app/${role}` : "/app/staff-login";
  const firstName = name?.trim().split(/\s+/)[0] || "there";
  const workspace = role ? roleLabels[role] : "ECOLOGIX";
  const navigationCopy = role === "driver"
    ? { work: "Route", collection: "Pickups", wallet: "History", profile: "Account" }
    : role === "agent"
      ? { work: "Scan", collection: "Intake", wallet: "Queue", profile: "Account" }
      : role === "manager"
        ? { work: "Review", collection: "Dispatch", wallet: "Payouts", profile: "Account" }
        : { work: "Recycle", collection: "Pickup", wallet: "Wallet", profile: "Profile" };
  const items = [
    { label: "Home", href: homeHref, icon: "home" as const },
    { label: navigationCopy.work, href: `${homeHref}#work`, icon: "scan" as const },
    { label: navigationCopy.collection, href: `${homeHref}#collection`, icon: "collection" as const },
    { label: navigationCopy.wallet, href: `${homeHref}#wallet`, icon: "wallet" as const },
    { label: navigationCopy.profile, href: `${homeHref}#profile`, icon: "profile" as const },
  ];

  return (
    <div className="wp-app-shell">
      <div className="wp-app-shell__glow wp-app-shell__glow--one" />
      <div className="wp-app-shell__glow wp-app-shell__glow--two" />
      <header className="wp-app-header">
        <Link href={homeHref} className="wp-app-brand" aria-label="ECOLOGIX home">
          <span className="wp-app-brand__mark">W</span>
          <span>ECOLOGIX</span>
        </Link>
        <div className="wp-app-header__context">
          <p>Good to see you, {firstName}</p>
          <span>{workspace}</span>
        </div>
        <button type="button" className="wp-icon-button" aria-label="Notifications" aria-expanded={isNotificationsOpen} onClick={() => setIsNotificationsOpen((isOpen) => !isOpen)}>
          <Icon name="bell" />
          <i />
        </button>
        {isNotificationsOpen ? <aside className="wp-notification-popover" aria-label="Notifications">
          <div className="wp-notification-popover__header"><div><p>Activity</p><span>Latest account updates</span></div><button type="button" onClick={() => setIsNotificationsOpen(false)} aria-label="Close notifications">Ã—</button></div>
          <div className="wp-notification-popover__item"><span>âœ“</span><div><strong>Workspace connected</strong><p>Your live ECOLOGIX workspace is ready.</p></div></div>
          <div className="wp-notification-popover__empty">New payout, pickup, and intake updates will appear here.</div>
        </aside> : null}
      </header>

      <div className="wp-app-shell__content">{children}</div>

      <nav className="wp-bottom-nav" aria-label="Workspace navigation">
        {items.map((item) => {
          const active = item.href === homeHref
            ? pathname === homeHref && !hash
            : pathname === homeHref && item.href.endsWith(hash);
          return (
            <Link key={item.label} href={item.href} className={`wp-bottom-nav__item ${active ? "is-active" : ""}`}>
              <Icon name={item.icon} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
