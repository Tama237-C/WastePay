import { ServiceWorkerRegistration } from "@/components/marketing/service-worker-registration";
import type { ReactNode } from "react";

import { PublicFooter } from "@/components/marketing/public-footer";
import { PublicNavigation } from "@/components/marketing/public-navigation";
import { createAdminClient } from "@/lib/supabase/admin";

type MarketingLayoutProps = {
  children: ReactNode;
};

export default async function MarketingLayout({
  children,
}: MarketingLayoutProps) {
  const { data: theme } = await createAdminClient().from("site_theme").select("logo_path").eq("id", true).maybeSingle();
  const logoUrl = theme?.logo_path
    ? createAdminClient().storage.from("website-branding").getPublicUrl(theme.logo_path).data.publicUrl
    : null;
  return (
    <div className="wp-page-shell">
        <ServiceWorkerRegistration />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 wp-grid-background opacity-70"
      />

      <div
        aria-hidden="true"
        className="wp-emerald-glow fixed -left-56 -top-40 h-[38rem] w-[38rem]"
      />

      <div
        aria-hidden="true"
        className="wp-sky-glow fixed -right-56 top-[38rem] h-[42rem] w-[42rem]"
      />

      <PublicNavigation logoUrl={logoUrl} />

      <div className="relative z-10 min-h-screen pt-24 sm:pt-28">
        {children}
      </div>

      <div className="relative z-10">
        <PublicFooter />
      </div>
    </div>
  );
}
