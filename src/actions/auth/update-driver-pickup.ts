"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

type DriverPickupIntent = "start" | "collected" | "unreachable";

export type UpdateDriverPickupState = {
  status: "idle" | "error" | "success";
  message: string;
};

function normalizeText(value: FormDataEntryValue | null): string {
  return typeof value === "string" ? value.trim() : "";
}

function isDriverPickupIntent(
  value: string,
): value is DriverPickupIntent {
  return (
    value === "start" ||
    value === "collected" ||
    value === "unreachable"
  );
}

export async function updateDriverPickup(
  _previousState: UpdateDriverPickupState,
  formData: FormData,
): Promise<UpdateDriverPickupState> {
  const requestId = normalizeText(formData.get("requestId"));
  const intent = normalizeText(formData.get("intent"));
  const failureReason = normalizeText(formData.get("failureReason"));
  const driverReportedWeightValue = normalizeText(formData.get("driverReportedWeightKg"));
  const collectionPhoto = formData.get("collectionPhoto");

  if (!requestId) {
    return {
      status: "error",
      message: "WastePay could not identify this pickup.",
    };
  }

  if (!isDriverPickupIntent(intent)) {
    return {
      status: "error",
      message: "Select a valid pickup action.",
    };
  }

  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      status: "error",
      message: "Your driver session has expired. Sign in again.",
    };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role, is_active, must_change_password")
    .eq("id", user.id)
    .single();

  if (
    profileError ||
    !profile ||
    profile.role !== "driver" ||
    !profile.is_active
  ) {
    return {
      status: "error",
      message:
        "Your account is not authorized to update WastePay pickups.",
    };
  }

  if (profile.must_change_password) {
    return {
      status: "error",
      message:
        "Replace your temporary password before performing pickup operations.",
    };
  }

  const { data: request, error: requestError } = await supabase
    .from("collection_requests")
    .select("id, status, assigned_driver_id")
    .eq("id", requestId)
    .eq("assigned_driver_id", user.id)
    .maybeSingle();

  if (requestError) {
    return {
      status: "error",
      message: "WastePay could not verify this assigned pickup.",
    };
  }

  if (!request) {
    return {
      status: "error",
      message:
        "This pickup is not assigned to your WastePay driver account.",
    };
  }

  if (intent === "start") {
    if (request.status !== "ASSIGNED") {
      return {
        status: "error",
        message:
          "Only an assigned pickup can be marked as in transit.",
      };
    }

    const { data: updatedRequests, error: updateError } =
      await supabase
        .from("collection_requests")
        .update({
          status: "IN_TRANSIT",
        })
        .eq("id", requestId)
        .eq("assigned_driver_id", user.id)
        .eq("status", "ASSIGNED")
        .select("id");

    if (updateError) {
      return {
        status: "error",
        message: "WastePay could not start this pickup.",
      };
    }

    if (!updatedRequests || updatedRequests.length !== 1) {
      return {
        status: "error",
        message:
          "This pickup changed before it could be started. Refresh and try again.",
      };
    }

    revalidatePath("/app/driver");
    revalidatePath("/admin/logistics");
    revalidatePath("/admin/collection-requests");

    return {
      status: "success",
      message:
        "Pickup started. WastePay now shows this route as in transit.",
    };
  }

  if (intent === "unreachable") {
    if (request.status !== "ASSIGNED" && request.status !== "IN_TRANSIT") {
      return {
        status: "error",
        message: "Only an assigned or in-transit pickup can be marked unreachable.",
      };
    }
    await supabase.from("collection_request_events").insert({
      collection_request_id: requestId,
      previous_status: "ASSIGNED",
      new_status: "IN_TRANSIT",
      actor_id: user.id,
    });

    if (failureReason.length < 5 || failureReason.length > 500) {
      return {
        status: "error",
        message: "Enter a clear reason between 5 and 500 characters.",
      };
    }

    const { data: updatedRequests, error: updateError } = await supabase
      .from("collection_requests")
      .update({
        status: "UNREACHABLE",
        rejection_reason: failureReason,
      })
      .eq("id", requestId)
      .eq("assigned_driver_id", user.id)
      .in("status", ["ASSIGNED", "IN_TRANSIT"])
      .select("id");

    if (updateError || !updatedRequests || updatedRequests.length !== 1) {
      return {
        status: "error",
        message: "WastePay could not record the unsuccessful pickup.",
      };
    }
    await supabase.from("collection_request_events").insert({
      collection_request_id: requestId,
      previous_status: request.status,
      new_status: "UNREACHABLE",
      actor_id: user.id,
      reason: failureReason,
    });

    revalidatePath("/app/driver");
    revalidatePath("/admin/logistics");
    revalidatePath("/admin/collection-requests");

    return {
      status: "success",
      message: "The pickup was marked unreachable and the reason was recorded.",
    };
  }

  if (request.status !== "IN_TRANSIT") {
    return {
      status: "error",
      message:
        "Start the pickup before marking the plastic as collected.",
    };
  }

  const driverReportedWeightKg = Number(driverReportedWeightValue);
  if (!Number.isFinite(driverReportedWeightKg) || driverReportedWeightKg <= 0 || driverReportedWeightKg > 50000) return { status: "error", message: "Enter a collected weight between 0.01 and 50,000 KG." };
  if (!(collectionPhoto instanceof File) || collectionPhoto.size === 0 || !collectionPhoto.type.startsWith("image/") || collectionPhoto.size > 5 * 1024 * 1024) return { status: "error", message: "Capture an image under 5 MB before confirming the pickup." };
  const photoPath = `driver/${user.id}/${requestId}-${Date.now()}`;
  const { error: photoError } = await supabase.storage.from("pickup-photos").upload(photoPath, collectionPhoto, { contentType: collectionPhoto.type, upsert: false });
  if (photoError) return { status: "error", message: "WastePay could not upload the collection photo." };

  const { data: updatedRequests, error: updateError } =
    await supabase
      .from("collection_requests")
      .update({
        status: "COLLECTED_PENDING_DEPOT",
        driver_reported_weight_kg: driverReportedWeightKg,
        driver_collection_photo_path: photoPath,
        driver_collected_at: new Date().toISOString(),
      })
      .eq("id", requestId)
      .eq("assigned_driver_id", user.id)
      .eq("status", "IN_TRANSIT")
      .select("id");

  if (updateError) {
    return {
      status: "error",
      message:
        "WastePay could not confirm that this plastic was collected.",
    };
  }

  if (!updatedRequests || updatedRequests.length !== 1) {
    return {
      status: "error",
      message:
        "This pickup changed before collection could be confirmed. Refresh and try again.",
    };
  }
  await supabase.from("collection_request_events").insert({
    collection_request_id: requestId,
    previous_status: "IN_TRANSIT",
    new_status: "COLLECTED_PENDING_DEPOT",
    actor_id: user.id,
  });

  revalidatePath("/app/driver");
  revalidatePath("/admin/logistics");
  revalidatePath("/admin/collection-requests");

  return {
    status: "success",
    message:
      "Plastic collection confirmed. Deliver the material to the assigned depot.",
  };
}
