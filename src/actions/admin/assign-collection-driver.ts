"use server";

import { revalidatePath } from "next/cache";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export type AssignCollectionDriverState = {
  status: "idle" | "error" | "success";
  message: string;
};

function normalizeText(value: FormDataEntryValue | null): string {
  return typeof value === "string" ? value.trim() : "";
}

async function verifyCurrentAdministrator(): Promise<
  | {
      authorized: true;
      role: "admin" | "manager";
      assignedDepotId: string | null;
      actorId: string;
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
    .select("role, is_active, assigned_depot_id")
    .eq("id", user.id)
    .single();

  if (
    profileError ||
    !profile ||
    (profile.role !== "admin" && profile.role !== "manager") ||
    !profile.is_active
  ) {
    return {
      authorized: false,
      message:
        "Your account is not authorized to dispatch WastePay drivers.",
    };
  }

  return {
    authorized: true,
    role: profile.role,
    assignedDepotId: profile.assigned_depot_id,
    actorId: user.id,
  };
}

export async function assignCollectionDriver(
  _previousState: AssignCollectionDriverState,
  formData: FormData,
): Promise<AssignCollectionDriverState> {
  const authorization = await verifyCurrentAdministrator();

  if (!authorization.authorized) {
    return {
      status: "error",
      message: authorization.message,
    };
  }

  const requestId = normalizeText(formData.get("requestId"));
  const driverId = normalizeText(formData.get("driverId"));

  if (!requestId) {
    return {
      status: "error",
      message: "WastePay could not identify this collection request.",
    };
  }

  if (!driverId) {
    return {
      status: "error",
      message: "Select the driver responsible for this pickup.",
    };
  }

  const adminClient = createAdminClient();

  const { data: request, error: requestError } = await adminClient
    .from("collection_requests")
    .select("id, status, assigned_depot_id")
    .eq("id", requestId)
    .maybeSingle();

  if (requestError) {
    return {
      status: "error",
      message: "WastePay could not verify this collection request.",
    };
  }

  if (!request) {
    return {
      status: "error",
      message: "This collection request no longer exists.",
    };
  }

  if (!request.assigned_depot_id) {
    return {
      status: "error",
      message:
        "Assign this request to a depot before selecting a driver.",
    };
  }

  if (
    authorization.role === "manager" &&
    authorization.assignedDepotId !== request.assigned_depot_id
  ) {
    return {
      status: "error",
      message: "Managers can only dispatch requests assigned to their depot.",
    };
  }

  if (
    request.status !== "ASSIGNED" &&
    request.status !== "APPROVED"
  ) {
    return {
      status: "error",
      message:
        "Only approved or assigned requests can be dispatched to a driver.",
    };
  }

  const { data: driver, error: driverError } = await adminClient
    .from("profiles")
    .select("id, full_name, role, is_active, assigned_depot_id")
    .eq("id", driverId)
    .maybeSingle();

  if (driverError) {
    return {
      status: "error",
      message: "WastePay could not verify the selected driver.",
    };
  }

  if (!driver) {
    return {
      status: "error",
      message: "The selected driver account no longer exists.",
    };
  }

  if (driver.role !== "driver") {
    return {
      status: "error",
      message: "The selected account is not a WastePay pickup driver.",
    };
  }

  if (!driver.is_active) {
    return {
      status: "error",
      message: "The selected driver account is inactive.",
    };
  }

  if (driver.assigned_depot_id !== request.assigned_depot_id) {
    return {
      status: "error",
      message: "The selected driver belongs to a different depot.",
    };
  }

  const { data: updatedRequests, error: updateError } = await adminClient
    .from("collection_requests")
    .update({
      assigned_driver_id: driver.id,
      status: "ASSIGNED",
      assigned_at: new Date().toISOString(),
    })
    .eq("id", requestId)
    .in("status", ["ASSIGNED", "APPROVED"])
    .select("id");

  if (updateError) {
    return {
      status: "error",
      message:
        "WastePay could not assign this collection request to the driver.",
    };
  }

  if (!updatedRequests || updatedRequests.length !== 1) {
    return {
      status: "error",
      message:
        "The request changed before the driver could be assigned. Refresh the page and try again.",
    };
  }
  await adminClient.from("collection_request_events").insert({
    collection_request_id: requestId,
    previous_status: request.status,
    new_status: "ASSIGNED",
    actor_id: authorization.actorId,
    reason: `Assigned to ${driver.full_name?.trim() || "selected driver"}`,
  });

  revalidatePath("/admin/logistics");
  revalidatePath("/admin/collection-requests");
  revalidatePath("/admin/overview");
  revalidatePath("/app/manager");

  return {
    status: "success",
    message: `The pickup was assigned to ${
      driver.full_name?.trim() || "the selected WastePay driver"
    }.`,
  };
}
