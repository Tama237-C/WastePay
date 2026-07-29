"use client";

import Image from "next/image";
import { useActionState } from "react";
import { updateSiteTheme, type SiteThemeState } from "@/actions/admin/update-site-theme";

const initial: SiteThemeState = { status: "idle", message: "" };

export function SiteThemeForm({ theme, logoUrl }: {
  theme: Record<string, string | number | null>;
  logoUrl?: string | null;
}) {
  const [state, action, pending] = useActionState(updateSiteTheme, initial);
  const colors = [
    ["primaryColor", "Primary", theme.primary_color],
    ["secondaryColor", "Secondary", theme.secondary_color],
    ["accentColor", "Accent", theme.accent_color],
    ["backgroundColor", "Background", theme.background_color],
    ["surfaceColor", "Surface", theme.surface_color],
    ["textColor", "Text", theme.text_color],
    ["mutedTextColor", "Muted text", theme.muted_text_color],
  ];

  return (
    <form action={action} className="space-y-7">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {colors.map(([name, label, value]) => (
          <label key={String(name)} className="text-sm text-slate-300">
            {String(label)}
            <input name={String(name)} type="color" defaultValue={String(value ?? "#000000")} className="mt-3 h-12 w-full rounded-xl bg-slate-950" />
          </label>
        ))}
      </div>
      <div className="grid gap-5 md:grid-cols-4">
        <label className="text-sm text-slate-300">Font<select name="fontFamily" defaultValue={String(theme.font_family ?? "Inter")} className="mt-3 min-h-12 w-full rounded-xl bg-slate-950 px-3 text-white"><option>Inter</option><option>Georgia</option></select></label>
        <label className="text-sm text-slate-300">Base size<input name="baseFontSizePx" type="number" min="12" max="22" defaultValue={String(theme.base_font_size_px ?? 16)} className="mt-3 min-h-12 w-full rounded-xl bg-slate-950 px-3 text-white" /></label>
        <label className="text-sm text-slate-300">Heading scale<input name="headingScale" type="number" min="0.8" max="1.4" step="0.05" defaultValue={String(theme.heading_scale ?? 1)} className="mt-3 min-h-12 w-full rounded-xl bg-slate-950 px-3 text-white" /></label>
        <label className="text-sm text-slate-300">Corner radius<input name="borderRadiusPx" type="number" min="0" max="48" defaultValue={String(theme.border_radius_px ?? 24)} className="mt-3 min-h-12 w-full rounded-xl bg-slate-950 px-3 text-white" /></label>
      </div>
      <label className="block text-sm text-slate-300">
        Logo
        {logoUrl ? <Image src={logoUrl} alt="Current WastePay logo" width={96} height={96} className="my-3 h-24 w-24 rounded-2xl object-cover" /> : null}
        <input name="logo" type="file" accept="image/*" className="mt-3 block text-sm text-slate-400" />
        {logoUrl ? <span className="mt-3 flex items-center gap-2"><input name="removeLogo" type="checkbox" /> Remove current logo</span> : null}
      </label>
      <label className="flex items-center gap-3 text-sm text-amber-200"><input name="resetTheme" type="checkbox" className="h-5 w-5 accent-amber-400" />Reset to WastePay defaults</label>
      {state.message ? <p className={state.status === "success" ? "text-emerald-300" : "text-red-300"}>{state.message}</p> : null}
      <button disabled={pending} className="rounded-2xl bg-emerald-400 px-6 py-4 text-xs font-black uppercase tracking-[0.18em] text-slate-950 disabled:opacity-50">{pending ? "Saving..." : "Save theme"}</button>
    </form>
  );
}
