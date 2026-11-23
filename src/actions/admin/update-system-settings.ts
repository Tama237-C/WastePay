"use server";

import { revalidatePath } from "next/cache";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export type UpdateSystemSettingsState = {
  status: "idle" | "error" | "success";
  message: string;
};

function parseInteger(value: FormDataEntryValue | null) {
  if (typeof value !== "string" || !/^\d+$/.test(value.trim())) return null;
  return Number(value);
}

export async function updateSystemSettings(
  _previousState: UpdateSystemSettingsState,
  formData: FormData,
): Promise<UpdateSystemSettingsState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { status: "error", message: "Your session has expired. Sign in again." };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, is_active")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin" || !profile.is_active) {
    return { status: "error", message: "Only an active administrator can change system settings." };
  }

  const minimumWeight = Number(formData.get("minimumPickupWeightKg"));
  const maximumScheduleDays = parseInteger(formData.get("maximumScheduleDays"));
  const pickupPhotoMaxMb = parseInteger(formData.get("pickupPhotoMaxMb"));
  const maintenanceMessageValue = formData.get("maintenanceMessage");
  const maintenanceMessage =
    typeof maintenanceMessageValue === "string"
      ? maintenanceMessageValue.trim()
      : "";

  if (!Number.isFinite(minimumWeight) || minimumWeight <= 0 || minimumWeight > 1000) {
    return { status: "error", message: "Minimum pickup weight must be between 0 and 1,000 KG." };
  }
  if (maximumScheduleDays === null || maximumScheduleDays < 1 || maximumScheduleDays > 90) {
    return { status: "error", message: "Maximum scheduling period must be between 1 and 90 days." };
  }
  if (pickupPhotoMaxMb === null || pickupPhotoMaxMb < 1 || pickupPhotoMaxMb > 20) {
    return { status: "error", message: "Photo limit must be between 1 and 20 MB." };
  }
  if (maintenanceMessage.length > 500) {
    return { status: "error", message: "Maintenance message cannot exceed 500 characters." };
  }

  const adminClient = createAdminClient();
  const { error } = await adminClient
    .from("system_settings")
    .upsert({
      id: true,
      minimum_pickup_weight_kg: minimumWeight,
      maximum_schedule_days: maximumScheduleDays,
      pickup_photo_max_mb: pickupPhotoMaxMb,
      default_currency: "XAF",
      require_manager_payout_approval:
        formData.get("requireManagerPayoutApproval") === "on",
      public_collection_requests_enabled:
        formData.get("publicCollectionRequestsEnabled") === "on",
      payout_queue_enabled: formData.get("payoutQueueEnabled") === "on",
      maintenance_message: maintenanceMessage || null,
      updated_by: user.id,
      updated_at: new Date().toISOString(),
    }, { onConflict: "id" });

  if (error) {
    return {
      status: "error",
      message: `ECOLOGIX could not save the system settings (${error.code}: ${error.message}).`,
    };
  }

  revalidatePath("/admin/settings");
  return { status: "success", message: "System configuration saved." };
}
