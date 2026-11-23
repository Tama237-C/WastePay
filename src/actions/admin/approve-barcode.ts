"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export type ApproveBarcodeState = {
  status: "idle" | "error" | "success";
  message: string;
};

export async function approveBarcode(
  _previousState: ApproveBarcodeState,
  formData: FormData,
): Promise<ApproveBarcodeState> {
  const barcodeNumber = formData.get("barcodeNumber");
  const barcode = typeof barcodeNumber === "string" ? barcodeNumber.trim() : "";
  if (!barcode) return { status: "error", message: "Barcode could not be identified." };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { status: "error", message: "Your session has expired. Sign in again." };
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, is_active")
    .eq("id", user.id)
    .single();
  if (!profile || profile.role !== "admin" || !profile.is_active) {
    return { status: "error", message: "Only an active administrator can approve barcodes." };
  }

  const adminClient = createAdminClient();
  const { error } = await adminClient
    .from("barcodes")
    .update({
      verification_status: "VERIFIED",
      created_by_admin_id: user.id,
      updated_at: new Date().toISOString(),
    })
    .eq("barcode_number", barcode)
    .eq("verification_status", "UNVERIFIED");
  if (error) return { status: "error", message: "ECOLOGIX could not approve this barcode." };

  revalidatePath("/admin/barcode-catalog");
  return { status: "success", message: "Barcode approved into the verified catalog." };
}
