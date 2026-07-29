"use client";

import { useActionState } from "react";
import Image from "next/image";
import { updateWebsiteSection } from "@/actions/admin/update-website-section";

type SectionState = { status: "idle" | "error" | "success"; message: string };

export function WebsiteSectionEditor({
  section,
  imageUrl,
}: {
  section: Record<string, string | number | boolean | null>;
  imageUrl?: string | null;
}) {
  const [state, action, pending] = useActionState<SectionState, FormData>(updateWebsiteSection, {
    status: "idle",
    message: "",
  });
  return (
    <form action={action} className="rounded-3xl border border-white/10 bg-slate-950/40 p-5">
      <input type="hidden" name="id" value={String(section.id)} />
      <input type="hidden" name="currentImagePath" value={String(section.image_path ?? "")} />
      <p className="text-xs font-black uppercase tracking-[0.2em] text-violet-300">
        {String(section.page_key)} / {String(section.section_key)}
      </p>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <input name="eyebrow" defaultValue={String(section.eyebrow ?? "")} placeholder="Eyebrow" className="rounded-xl bg-slate-900 px-3 py-3 text-white" />
        <input name="title" defaultValue={String(section.title ?? "")} placeholder="Title" className="rounded-xl bg-slate-900 px-3 py-3 text-white" />
        <textarea name="body" defaultValue={String(section.body ?? "")} placeholder="Body text" rows={2} className="rounded-xl bg-slate-900 px-3 py-3 text-white" />
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-4">
        <input name="image" type="file" accept="image/*" className="text-sm text-slate-400" />
        <label className="flex items-center gap-2 text-sm text-slate-300"><input name="enabled" type="checkbox" defaultChecked={Boolean(section.enabled)} /> Enabled</label>
        <button disabled={pending} className="rounded-xl bg-emerald-400 px-4 py-3 text-xs font-black uppercase text-slate-950">{pending ? "Saving..." : "Save section"}</button>
      </div>
      {imageUrl ? <Image src={imageUrl} alt="" width={224} height={128} className="mt-4 h-32 w-56 rounded-xl object-cover" /> : null}
      {state.message ? <p className="mt-3 text-sm text-emerald-300">{state.message}</p> : null}
    </form>
  );
}
