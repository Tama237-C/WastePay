import { WebsiteSectionEditor } from "@/components/admin/website-section-editor";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function WebsiteSectionsPage() {
  const adminClient = createAdminClient();
  const { data: sections, error } = await adminClient
    .from("website_sections")
    .select("*")
    .order("page_key")
    .order("sort_order");
  return <div className="space-y-7"><section className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-8"><p className="text-xs font-black uppercase tracking-[0.3em] text-violet-400">Page sections</p><h1 className="mt-4 text-4xl font-black text-white">Edit website sections</h1><p className="mt-4 text-slate-400">Manage text, images, and visibility across the homepage, impact, about, programs, and contact pages.</p></section>{error ? <p className="rounded-2xl border border-rose-400/30 bg-rose-400/10 p-5 text-rose-200">Could not load website sections: {error.message}</p> : null}<div className="space-y-4">{(sections ?? []).map((section) => <WebsiteSectionEditor key={section.id} section={section} imageUrl={section.image_path ? adminClient.storage.from("website-images").getPublicUrl(section.image_path).data.publicUrl : null} />)}</div></div>;
}
