import Link from "next/link";
import { AppInstallCard } from "@/components/app/install-app-card";

const workspaces = [
  { key: "collector", icon: "♻", title: "Collector", description: "Track recycling value, payouts, and your Mobile Money wallet.", tone: "emerald" },
  { key: "agent", icon: "⌁", title: "Depot agent", description: "Scan materials, verify weights, and complete depot intake.", tone: "violet" },
  { key: "driver", icon: "↗", title: "Driver", description: "Manage collection routes and submit proof of pickup.", tone: "sky" },
  { key: "manager", icon: "◎", title: "Depot manager", description: "Dispatch pickups, review transactions, and prepare payouts.", tone: "amber" },
  { key: "admin", icon: "◇", title: "Administrator", description: "Manage network operations, users, controls, and reporting.", tone: "slate" },
] as const;

export function WorkspaceGateway() {
  return (
    <main className="wp-gateway-page">
      <div className="wp-gateway-page__glow wp-gateway-page__glow--one" />
      <div className="wp-gateway-page__glow wp-gateway-page__glow--two" />
      <section className="wp-gateway">
        <header className="wp-gateway__header">
          <Link href="/" className="wp-auth-brand">
            <span className="wp-app-brand__mark">W</span>
            <span>WastePay</span>
          </Link>
          <Link href="/" className="wp-gateway__back">
            ← Website
          </Link>
        </header>
        <div className="wp-gateway__intro">
          <p className="wp-overline">WastePay app</p>
          <h1>
            Choose your
            <br />
            <span>workspace.</span>
          </h1>
          <p>
            One secure sign-in. Your verified account opens the right WastePay
            app automatically.
          </p>
        </div>
        <div className="mb-8">
          <AppInstallCard />
        </div>
        <div className="wp-gateway__workspaces">
          {workspaces.map((workspace) => (
            <Link
              key={workspace.key}
              href={`/app/staff-login?workspace=${workspace.key}`}
              className={`wp-workspace-card wp-workspace-card--${workspace.tone}`}
            >
              <span className="wp-workspace-card__icon">{workspace.icon}</span>
              <span className="wp-workspace-card__copy">
                <strong>{workspace.title}</strong>
                <small>{workspace.description}</small>
              </span>
              <i>→</i>
            </Link>
          ))}
        </div>
        <footer className="wp-gateway__footnote">
          <span>●</span> Your role is verified when you sign in. You will only
          access your assigned workspace.
        </footer>
      </section>
    </main>
  );
}
