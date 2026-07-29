"use client";

import { useActionState } from "react";
import Image from "next/image";
import { updateWebsiteContent, type WebsiteContentState } from "@/actions/admin/update-website-content";

const initialState: WebsiteContentState = { status: "idle", message: "" };

export function WebsiteContentForm({ content, heroImageUrl, footerImageUrl }: { content: Record<string, string>; heroImageUrl?: string | null; footerImageUrl?: string | null }) {
  const [state, formAction, pending] = useActionState(updateWebsiteContent, initialState);
  return (
    <form action={formAction} className="space-y-6">
      <div className="grid gap-5 md:grid-cols-2">
        {[
          ["homepageHeroTitle", "Homepage hero title", content.homepage_hero_title],
          ["homepageHeroDescription", "Homepage hero description", content.homepage_hero_description],
          ["homepageFooterTitle", "Before-footer title", content.homepage_footer_title],
          ["homepageFooterText", "Before-footer text", content.homepage_footer_text],
        ].map(([name, label, value]) => (
          <label key={name} className="block text-sm text-slate-300">
            {label}
            <textarea name={name} rows={name.includes("Title") ? 2 : 4} defaultValue={value} required className="mt-3 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-400/50" />
          </label>
        ))}
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <label className="block text-sm text-slate-300">Homepage hero image{heroImageUrl ? <Image src={heroImageUrl} alt="Current homepage hero" width={700} height={320} className="my-3 h-40 w-full rounded-2xl object-cover" /> : null}<input name="homepageHeroImage" type="file" accept="image/*" className="mt-3 block w-full text-sm text-slate-400" />{heroImageUrl ? <span className="mt-3 flex items-center gap-2"><input name="removeHomepageHeroImage" type="checkbox" /> Remove current image</span> : null}</label>
        <label className="block text-sm text-slate-300">Before-footer image{footerImageUrl ? <Image src={footerImageUrl} alt="Current before-footer" width={700} height={320} className="my-3 h-40 w-full rounded-2xl object-cover" /> : null}<input name="homepageFooterImage" type="file" accept="image/*" className="mt-3 block w-full text-sm text-slate-400" />{footerImageUrl ? <span className="mt-3 flex items-center gap-2"><input name="removeHomepageFooterImage" type="checkbox" /> Remove current image</span> : null}</label>
      </div>
      {state.message ? <p className={state.status === "success" ? "text-emerald-300" : "text-red-300"}>{state.message}</p> : null}
      <button disabled={pending} className="rounded-2xl bg-emerald-400 px-6 py-4 text-xs font-black uppercase tracking-[0.18em] text-slate-950 disabled:opacity-50">{pending ? "Saving..." : "Save website content"}</button>
    </form>
  );
}
