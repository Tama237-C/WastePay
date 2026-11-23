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
    return { status: "error", message: "ECOLOGIX could not identify this delivery." };
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
  const { data: systemSettings, error: settingsError } = await adminClient
    .from("system_settings")
    .select("pickup_photo_max_mb")
    .eq("id", true)
    .maybeSingle();
  if (settingsError) {
    console.error("ECOLOGIX could not load depot photo settings.", {
      code: settingsError.code,
      message: settingsError.message,
    });
    return {
      status: "error",
      message: "ECOLOGIX could not verify the depot photo upload limit. Try again shortly.",
    };
  }
  const maximumPhotoMb = Number(systemSettings?.pickup_photo_max_mb ?? 5);
  if (!Number.isFinite(maximumPhotoMb) || maximumPhotoMb <= 0) {
    return {
      status: "error",
      message: "ECOLOGIX has an invalid depot photo upload limit. Contact an administrator.",
    };
  }
  if (!verificationPhoto.type.startsWith("image/") || verificationPhoto.size > maximumPhotoMb * 1024 * 1024) {
    return { status: "error", message: `The verification photo must be an image under ${maximumPhotoMb} MB.` };
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) {
    return { status: "error", message: "Your session has expired. Sign in again." };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role, is_active, assigned_depot_id, must_change_password")
    .eq("id", user.id)
    .single();
  if (profileError) {
    console.error("ECOLOGIX could not verify the depot-agent profile.", {
      code: profileError.code,
      message: profileError.message,
    });
    return {
      status: "error",
      message: `ECOLOGIX could not verify your depot-agent profile${profileError.code ? ` (error ${profileError.code})` : ""}.`,
    };
  }
  if (!profile || profile.role !== "agent" || !profile.is_active || !profile.assigned_depot_id) {
    return { status: "error", message: "Your account is not authorized to complete depot intake." };
  }
  if (profile.must_change_password) {
    return {
      status: "error",
      message: "Change your temporary password before completing depot intake.",
    };
  }

  const { data: request, error: requestError } = await supabase
    .from("collection_requests")
    .select("id, status, assigned_depot_id")
    .eq("id", normalizedRequestId)
    .maybeSingle();
  if (requestError) {
    console.error("ECOLOGIX could not load the depot intake request.", {
      code: requestError.code,
      message: requestError.message,
      requestId: normalizedRequestId,
    });
    return {
      status: "error",
      message: `ECOLOGIX could not verify this delivery${requestError.code ? ` (error ${requestError.code})` : ""}.`,
    };
  }
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
    console.error("ECOLOGIX could not upload the depot verification photo.", {
      code: uploadError.name,
      message: uploadError.message,
      requestId: normalizedRequestId,
    });
    return {
      status: "error",
      message: `ECOLOGIX could not save the verification photo${uploadError.name ? ` (error ${uploadError.name})` : ""}. Check the pickup-photos storage bucket.`,
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
    if (error) {
      console.error("ECOLOGIX could not complete the depot intake.", {
        code: error.code,
        message: error.message,
        requestId: normalizedRequestId,
      });
    }

    const { error: photoCleanupError } = await adminClient.storage
      .from("pickup-photos")
      .remove([photoPath]);

    if (photoCleanupError) {
      console.error("ECOLOGIX could not remove an unused depot photo.", {
        message: photoCleanupError.message,
        requestId: normalizedRequestId,
      });
      return {
        status: "error",
        message: `ECOLOGIX could not complete the depot intake${error?.code ? ` (error ${error.code})` : ""}, and the unused verification photo could not be removed. Contact an administrator.`,
      };
    }

    return {
      status: "error",
      message: `ECOLOGIX could not complete this depot intake${error?.code ? ` (error ${error.code})` : ""}. The unused verification photo was removed; refresh and try again.`,
    };
  }
  const { error: eventError } = await supabase
    .from("collection_request_events")
    .insert({
      collection_request_id: normalizedRequestId,
      previous_status: "COLLECTED_PENDING_DEPOT",
      new_status: "COMPLETED",
      actor_id: user.id,
      reason: `Verified weight: ${actualWeightKg} KG`,
    });
  if (eventError) {
    console.error("ECOLOGIX could not record the depot completion event.", {
      code: eventError.code,
      message: eventError.message,
      requestId: normalizedRequestId,
    });
  }

  revalidatePath("/app/agent");
  revalidatePath("/app/driver");
  revalidatePath("/admin/collection-requests");
  revalidatePath("/admin/overview");
  return {
    status: "success",
    message: eventError
      ? "Depot intake completed, but its status history could not be recorded. Contact support if the tracking timeline does not update."
      : "Depot intake completed. The collection is now marked complete.",
  };
}
