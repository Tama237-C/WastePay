"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function updateWebsiteSection(
  _previousState: { status: "idle" | "error" | "success"; message: string },
  formData: FormData,
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { status: "error" as const, message: "Your session has expired." };
  const { data: profile } = user ? await supabase.from("profiles").select("role,is_active").eq("id", user.id).single() : { data: null };
  if (!profile || profile.role !== "admin" || !profile.is_active) return { status: "error" as const, message: "Only an active administrator can edit sections." };
  const id = String(formData.get("id") ?? "");
  const adminClient = createAdminClient();
  const image = formData.get("image");
  let imagePath = String(formData.get("currentImagePath") ?? "") || null;
  if (image instanceof File && image.size > 0) {
    if (!image.type.startsWith("image/") || image.size > 5 * 1024 * 1024) return { status: "error" as const, message: "Images must be under 5 MB." };
    const path = `sections/${Date.now()}-${image.name.replace(/[^a-zA-Z0-9._-]/g, "-")}`;
    const upload = await adminClient.storage.from("website-images").upload(path, image, { contentType: image.type, upsert: false });
    if (upload.error) return { status: "error" as const, message: "Image upload failed." };
    imagePath = path;
  }
  const { error } = await adminClient.from("website_sections").update({
    eyebrow: String(formData.get("eyebrow") ?? "").trim(),
    title: String(formData.get("title") ?? "").trim(),
    body: String(formData.get("body") ?? "").trim(),
    enabled: formData.get("enabled") === "on",
    image_path: imagePath,
    updated_by: user.id,
    updated_at: new Date().toISOString(),
  }).eq("id", id);
  if (error) return { status: "error" as const, message: "Section could not be saved." };
  revalidatePath("/");
  revalidatePath("/impact");
  revalidatePath("/about");
  revalidatePath("/programs");
  revalidatePath("/contact");
  revalidatePath("/admin/website-sections");
  return { status: "success" as const, message: "Section saved." };
}
