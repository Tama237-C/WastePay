import { ConsumerAppShell } from "@/components/app/consumer-app-shell";

export default function AppLoading() {
  return (
    <ConsumerAppShell>
      <div className="wp-app-loading" role="status" aria-live="polite">
        <span className="wp-app-spinner" aria-hidden="true" />
        <p>Loading ECOLOGIX… Please wait if your connection is slow.</p>
      </div>
    </ConsumerAppShell>
  );
}
