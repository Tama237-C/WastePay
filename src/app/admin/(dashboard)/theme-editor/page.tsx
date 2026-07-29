import { SiteThemeForm } from "@/components/admin/site-theme-form";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function ThemeEditorPage() {
  const adminClient = createAdminClient();
  const { data } = await adminClient.from("site_theme").select("*").eq("id", true).maybeSingle();
  const theme = data ?? { primary_color: "#00d6a3", secondary_color: "#172554", accent_color: "#facc15", background_color: "#020617", surface_color: "#0f172a", text_color: "#f8fafc", muted_text_color: "#94a3b8", font_family: "Inter", base_font_size_px: 16, heading_scale: 1, border_radius_px: 24, logo_path: null };
  const logoUrl = data?.logo_path ? adminClient.storage.from("website-branding").getPublicUrl(data.logo_path).data.publicUrl : null;
  return <div className="space-y-7"><section className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-8"><p className="text-xs font-black uppercase tracking-[0.3em] text-violet-400">Visual system</p><h1 className="mt-4 text-4xl font-black text-white">Theme editor</h1><p className="mt-4 text-slate-400">Control the global colors, typography, corners, and logo.</p></section><section className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-8"><SiteThemeForm theme={theme} logoUrl={logoUrl} /></section></div>;
}
