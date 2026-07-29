"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export type CompleteDepotIntakeState = {
  status: "idle" | "error" | "success";
  message: string;
};

export async function completeDepotIntake(
  _previousState: CompleteDepotIntakeState,
  formData: FormData,
): Promise<CompleteDepotIntakeState> {
  const requestId = formData.get("requestId");
  const actualWeightValue = formData.get("actualWeightKg");
  const verificationPhoto = formData.get("verificationPhoto");
  const normalizedRequestId =
    typeof requestId === "string" ? requestId.trim() : "";
  if (!normalizedRequestId) {
    return { status: "error", message: "WastePay could not identify this delivery." };
  }
  const actualWeightKg =
    typeof actualWeightValue === "string" ? Number(actualWeightValue) : NaN;
  if (!Number.isFinite(actualWeightKg) || actualWeightKg <= 0 || actualWeightKg > 50000) {
    return { status: "error", message: "Enter a verified weight between 0.01 and 50,000 KG." };
  }
  if (!(verificationPhoto instanceof File) || verificationPhoto.size === 0) {
    return { status: "error", message: "Upload a verification photo of the weighed plastic." };
  }
  const adminClient = createAdminClient();
  const { data: systemSettings } = await adminClient
    .from("system_settings")
    .select("pickup_photo_max_mb")
    .eq("id", true)
    .maybeSingle();
  const maximumPhotoMb = Number(systemSettings?.pickup_photo_max_mb ?? 5);
  if (!verificationPhoto.type.startsWith("image/") || verificationPhoto.size > maximumPhotoMb * 1024 * 1024) {
    return { status: "error", message: `The verification photo must be an image under ${maximumPhotoMb} MB.` };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { status: "error", message: "Your session has expired. Sign in again." };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, is_active, assigned_depot_id")
    .eq("id", user.id)
    .single();
  if (!profile || profile.role !== "agent" || !profile.is_active || !profile.assigned_depot_id) {
    return { status: "error", message: "Your account is not authorized to complete depot intake." };
  }

  const { data: request } = await supabase
    .from("collection_requests")
    .select("id, status, assigned_depot_id")
    .eq("id", normalizedRequestId)
    .single();
  if (!request || request.assigned_depot_id !== profile.assigned_depot_id) {
    return { status: "error", message: "This delivery is not assigned to your depot." };
  }
  if (request.status !== "COLLECTED_PENDING_DEPOT") {
    return { status: "error", message: "Only collected deliveries can be completed at depot intake." };
  }

  const photoPath = `${profile.assigned_depot_id}/${normalizedRequestId}-${Date.now()}`;
  const { error: uploadError } = await supabase.storage
    .from("pickup-photos")
    .upload(photoPath, verificationPhoto, {
      contentType: verificationPhoto.type,
      upsert: false,
    });
  if (uploadError) {
    return {
      status: "error",
      message: "WastePay could not save the verification photo. Check the pickup-photos storage bucket.",
    };
  }

  const { data: updatedRequests, error } = await supabase
    .from("collection_requests")
    .update({
      status: "COMPLETED",
      actual_weight_kg: actualWeightKg,
      completion_photo_path: photoPath,
      completed_at: new Date().toISOString(),
    })
    .eq("id", normalizedRequestId)
    .eq("assigned_depot_id", profile.assigned_depot_id)
    .eq("status", "COLLECTED_PENDING_DEPOT")
    .select("id");
  if (error || !updatedRequests || updatedRequests.length !== 1) {
    return { status: "error", message: "WastePay could not complete this depot intake." };
  }
  await supabase.from("collection_request_events").insert({
    collection_request_id: normalizedRequestId,
    previous_status: "COLLECTED_PENDING_DEPOT",
    new_status: "COMPLETED",
    actor_id: user.id,
    reason: `Verified weight: ${actualWeightKg} KG`,
  });

  revalidatePath("/app/agent");
  revalidatePath("/app/driver");
  revalidatePath("/admin/collection-requests");
  revalidatePath("/admin/overview");
  return { status: "success", message: "Depot intake completed. The collection is now marked complete." };
}
