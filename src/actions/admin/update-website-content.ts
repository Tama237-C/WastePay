"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export type WebsiteContentState = { status: "idle" | "error" | "success"; message: string };

export async function updateWebsiteContent(
  _previousState: WebsiteContentState,
  formData: FormData,
): Promise<WebsiteContentState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { status: "error", message: "Your session has expired." };
  const { data: profile } = await supabase.from("profiles").select("role, is_active").eq("id", user.id).single();
  if (!profile || profile.role !== "admin" || !profile.is_active) {
    return { status: "error", message: "Only an active administrator can edit website content." };
  }

  const text = (name: string, fallback: string) => {
    const value = formData.get(name);
    return typeof value === "string" && value.trim() ? value.trim() : fallback;
  };
  const adminClient = createAdminClient();
  const current = await adminClient.from("website_content").select("homepage_hero_image_path, homepage_footer_image_path").eq("id", true).maybeSingle();
  const uploads: Record<string, string | null> = {
    homepage_hero_image_path: current.data?.homepage_hero_image_path ?? null,
    homepage_footer_image_path: current.data?.homepage_footer_image_path ?? null,
  };

  for (const [removeField, path] of [
    ["removeHomepageHeroImage", "homepage_hero_image_path"],
    ["removeHomepageFooterImage", "homepage_footer_image_path"],
  ] as const) {
    if (formData.get(removeField) === "on" && uploads[path]) {
      await adminClient.storage.from("website-images").remove([uploads[path]!]);
      uploads[path] = null;
    }
  }

  for (const [field, path] of [
    ["homepageHeroImage", "homepage_hero_image_path"],
    ["homepageFooterImage", "homepage_footer_image_path"],
  ] as const) {
    const file = formData.get(field);
    if (file instanceof File && file.size > 0) {
      if (!file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) {
        return { status: "error", message: "Images must be image files under 5 MB." };
      }
      const objectPath = `${path}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "-")}`;
      const upload = await adminClient.storage.from("website-images").upload(objectPath, file, { contentType: file.type, upsert: false });
      if (upload.error) return { status: "error", message: "The image could not be uploaded." };
      uploads[path] = objectPath;
    }
  }

  const { error } = await adminClient.from("website_content").upsert({
    id: true,
    homepage_hero_title: text("homepageHeroTitle", "Plastic waste becomes value."),
    homepage_hero_description: text("homepageHeroDescription", ""),
    homepage_footer_title: text("homepageFooterTitle", "Build a cleaner circular economy."),
    homepage_footer_text: text("homepageFooterText", ""),
    homepage_hero_image_path: uploads.homepage_hero_image_path,
    homepage_footer_image_path: uploads.homepage_footer_image_path,
    updated_by: user.id,
    updated_at: new Date().toISOString(),
  }, { onConflict: "id" });
  if (error) return { status: "error", message: "Website content could not be saved." };
  revalidatePath("/");
  revalidatePath("/admin/website-content");
  return { status: "success", message: "Website content saved." };
}
