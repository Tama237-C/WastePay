import { WebsiteContentForm } from "@/components/admin/website-content-form";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function WebsiteContentPage() {
  const adminClient = createAdminClient();
  const { data } = await adminClient.from("website_content").select("homepage_hero_title, homepage_hero_description, homepage_footer_title, homepage_footer_text, homepage_hero_image_path, homepage_footer_image_path").eq("id", true).maybeSingle();
  const content = data ?? {
    homepage_hero_title: "Plastic waste becomes value.",
    homepage_hero_description: "",
    homepage_footer_title: "Build a cleaner circular economy.",
    homepage_footer_text: "",
  };
  const heroImageUrl = data?.homepage_hero_image_path ? adminClient.storage.from("website-images").getPublicUrl(data.homepage_hero_image_path).data.publicUrl : null;
  const footerImageUrl = data?.homepage_footer_image_path ? adminClient.storage.from("website-images").getPublicUrl(data.homepage_footer_image_path).data.publicUrl : null;
  return <div className="space-y-7"><section className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-8"><p className="text-xs font-black uppercase tracking-[0.3em] text-violet-400">Website content</p><h1 className="mt-4 text-4xl font-black text-white">Edit public website</h1><p className="mt-4 text-slate-400">Update approved homepage text and image positions.</p></section><section className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-8"><WebsiteContentForm content={content} heroImageUrl={heroImageUrl} footerImageUrl={footerImageUrl} /></section></div>;
}
