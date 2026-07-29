"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export type SiteThemeState = { status: "idle" | "error" | "success"; message: string };

const color = (value: FormDataEntryValue | null, fallback: string) =>
  typeof value === "string" && /^#[0-9a-fA-F]{6}$/.test(value) ? value : fallback;

export async function updateSiteTheme(
  _previousState: SiteThemeState,
  formData: FormData,
): Promise<SiteThemeState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { status: "error", message: "Your session has expired." };
  const { data: profile } = user
    ? await supabase.from("profiles").select("role, is_active").eq("id", user.id).single()
    : { data: null };
  if (!profile || profile.role !== "admin" || !profile.is_active) {
    return { status: "error", message: "Only an active administrator can edit the theme." };
  }
  const adminClient = createAdminClient();
  const { data: current } = await adminClient.from("site_theme").select("*").eq("id", true).maybeSingle();
  const reset = formData.get("resetTheme") === "on";
  const file = formData.get("logo");
  let logoPath = current?.logo_path ?? null;
  if (formData.get("removeLogo") === "on" && logoPath) {
    await adminClient.storage.from("website-branding").remove([logoPath]);
    logoPath = null;
  }
  if (file instanceof File && file.size > 0) {
    if (!file.type.startsWith("image/") || file.size > 3 * 1024 * 1024) {
      return { status: "error", message: "Logo must be an image under 3 MB." };
    }
    const path = `logo/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "-")}`;
    const upload = await adminClient.storage.from("website-branding").upload(path, file, { contentType: file.type, upsert: false });
    if (upload.error) return { status: "error", message: "Logo upload failed." };
    logoPath = path;
  }
  const { error } = await adminClient.from("site_theme").upsert({
    id: true,
    primary_color: reset ? "#00d6a3" : color(formData.get("primaryColor"), current?.primary_color ?? "#00d6a3"),
    secondary_color: reset ? "#172554" : color(formData.get("secondaryColor"), current?.secondary_color ?? "#172554"),
    accent_color: reset ? "#facc15" : color(formData.get("accentColor"), current?.accent_color ?? "#facc15"),
    background_color: reset ? "#020617" : color(formData.get("backgroundColor"), current?.background_color ?? "#020617"),
    surface_color: reset ? "#0f172a" : color(formData.get("surfaceColor"), current?.surface_color ?? "#0f172a"),
    text_color: reset ? "#f8fafc" : color(formData.get("textColor"), current?.text_color ?? "#f8fafc"),
    muted_text_color: reset ? "#94a3b8" : color(formData.get("mutedTextColor"), current?.muted_text_color ?? "#94a3b8"),
    font_family: reset ? "Inter" : (formData.get("fontFamily") === "Georgia" ? "Georgia" : "Inter"),
    base_font_size_px: reset ? 16 : Number(formData.get("baseFontSizePx")) || 16,
    heading_scale: reset ? 1 : Number(formData.get("headingScale")) || 1,
    border_radius_px: reset ? 24 : Number(formData.get("borderRadiusPx")) || 24,
    logo_path: logoPath,
    updated_by: user.id,
    updated_at: new Date().toISOString(),
  }, { onConflict: "id" });
  if (error) return { status: "error", message: "Theme could not be saved." };
  revalidatePath("/");
  revalidatePath("/admin/theme-editor");
  return { status: "success", message: "Theme saved." };
}
