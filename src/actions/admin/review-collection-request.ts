"use server";

import { revalidatePath } from "next/cache";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

type ReviewIntent = "approve" | "reject";

export type ReviewCollectionRequestState = {
  status: "idle" | "error" | "success";
  message: string;
};

function normalizeText(value: FormDataEntryValue | null): string {
  return typeof value === "string" ? value.trim() : "";
}

function isReviewIntent(value: string): value is ReviewIntent {
  return value === "approve" || value === "reject";
}

async function verifyCurrentAdministrator(): Promise<
  | {
      authorized: true;
      administratorId: string;
    }
  | {
      authorized: false;
      message: string;
    }
> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      authorized: false,
      message: "Your administrator session has expired. Sign in again.",
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
    profile.role !== "admin" ||
    !profile.is_active
  ) {
    return {
      authorized: false,
      message:
        "Your account is not authorized to review collection requests.",
    };
  }

  if (profile.must_change_password) {
    return {
      authorized: false,
      message: "Change your temporary password before reviewing collection requests.",
    };
  }

  return {
    authorized: true,
    administratorId: user.id,
  };
}

export async function reviewCollectionRequest(
  _previousState: ReviewCollectionRequestState,
  formData: FormData,
): Promise<ReviewCollectionRequestState> {
  const authorization = await verifyCurrentAdministrator();

  if (!authorization.authorized) {
    return {
      status: "error",
      message: authorization.message,
    };
  }

  const requestId = normalizeText(formData.get("requestId"));
  const intentInput = normalizeText(formData.get("intent"));
  const depotId = normalizeText(formData.get("depotId"));
  const rejectionReason = normalizeText(formData.get("rejectionReason"));

  if (!requestId) {
    return {
      status: "error",
      message: "ECOLOGIX could not identify this collection request.",
    };
  }

  if (!isReviewIntent(intentInput)) {
    return {
      status: "error",
      message: "Select a valid collection-request action.",
    };
  }

  const adminClient = createAdminClient();

  const { data: existingRequest, error: requestLookupError } =
    await adminClient
      .from("collection_requests")
      .select("id, status")
      .eq("id", requestId)
      .maybeSingle();

  if (requestLookupError) {
    return {
      status: "error",
      message: "ECOLOGIX could not verify this collection request.",
    };
  }

  if (!existingRequest) {
    return {
      status: "error",
      message: "This collection request no longer exists.",
    };
  }

  if (existingRequest.status !== "PENDING_REVIEW") {
    return {
      status: "error",
      message:
        "This request has already been reviewed. Refresh the page to see its current status.",
    };
  }

  if (intentInput === "approve") {
    if (!depotId) {
      return {
        status: "error",
        message: "Select the ECOLOGIX depot that will handle this request.",
      };
    }

    const { data: selectedDepot, error: depotLookupError } =
      await adminClient
        .from("depots")
        .select("id, name, status")
        .eq("id", depotId)
        .maybeSingle();

    if (depotLookupError) {
      return {
        status: "error",
        message: "ECOLOGIX could not verify the selected depot.",
      };
    }

    if (!selectedDepot) {
      return {
        status: "error",
        message: "The selected depot no longer exists.",
      };
    }

    if (
      selectedDepot.status !== "active" &&
      selectedDepot.status !== "planned"
    ) {
      return {
        status: "error",
        message:
          "The selected depot is closed or inactive and cannot receive this request.",
      };
    }

    const { error: approvalError } = await adminClient
      .from("collection_requests")
      .update({
        assigned_depot_id: selectedDepot.id,
        status: "APPROVED",
        assigned_at: null,
        rejection_reason: null,
      })
      .eq("id", requestId)
      .eq("status", "PENDING_REVIEW");

    if (approvalError) {
      return {
        status: "error",
        message:
          "ECOLOGIX could not approve and assign this collection request.",
      };
    }
    const { error: eventError } = await adminClient
      .from("collection_request_events")
      .insert({
      collection_request_id: requestId,
      previous_status: "PENDING_REVIEW",
      new_status: "APPROVED",
      actor_id: authorization.administratorId,
      reason: `Approved for ${selectedDepot.name}`,
    });
    if (eventError) {
      console.error("ECOLOGIX could not record the collection approval event.", {
        code: eventError.code,
        message: eventError.message,
        requestId,
      });
    }

    revalidatePath("/admin/collection-requests");
    revalidatePath("/admin/logistics");
    revalidatePath("/admin/overview");
    revalidatePath("/app/manager");

    return {
      status: "success",
      message: eventError
        ? `The request was approved for ${selectedDepot.name}, but its status history could not be recorded. Refresh the request timeline or contact support.`
        : `The request was approved for ${selectedDepot.name} and is ready for manager dispatch.`,
    };
  }

  if (rejectionReason.length < 5) {
    return {
      status: "error",
      message:
        "Enter a clear rejection reason containing at least five characters.",
    };
  }

  if (rejectionReason.length > 500) {
    return {
      status: "error",
      message: "The rejection reason cannot exceed 500 characters.",
    };
  }

  const { error: rejectionError } = await adminClient
    .from("collection_requests")
    .update({
      status: "REJECTED",
      rejection_reason: rejectionReason,
      assigned_depot_id: null,
      assigned_driver_id: null,
      assigned_at: null,
    })
    .eq("id", requestId)
    .eq("status", "PENDING_REVIEW");

  if (rejectionError) {
    return {
      status: "error",
      message: "ECOLOGIX could not reject this collection request.",
    };
  }
  const { error: eventError } = await adminClient
    .from("collection_request_events")
    .insert({
    collection_request_id: requestId,
    previous_status: "PENDING_REVIEW",
    new_status: "REJECTED",
    actor_id: authorization.administratorId,
    reason: rejectionReason,
  });
  if (eventError) {
    console.error("ECOLOGIX could not record the collection rejection event.", {
      code: eventError.code,
      message: eventError.message,
      requestId,
    });
  }

  revalidatePath("/admin/collection-requests");
  revalidatePath("/admin/overview");

  return {
    status: "success",
    message: eventError
      ? "The collection request was rejected, but its status history could not be recorded. Refresh the request timeline or contact support."
      : "The collection request was rejected successfully.",
  };
}
