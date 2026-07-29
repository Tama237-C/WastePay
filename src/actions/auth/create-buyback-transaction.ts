"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

type MaterialType = "PET_CLEAR" | "PET_COLORED" | "HDPE" | "PP";

export type CreateBuybackState = {
  status: "idle" | "error" | "success";
  message: string;
  receiptCode: string | null;
};

function text(value: FormDataEntryValue | null): string {
  return typeof value === "string" ? value.trim() : "";
}

export async function createBuybackTransaction(
  _previousState: CreateBuybackState,
  formData: FormData,
): Promise<CreateBuybackState> {
  const phoneNumber = text(formData.get("collectorPhoneNumber"));
  const materialType = text(formData.get("materialType")) as MaterialType;
  const weightKg = Number(text(formData.get("weightKg")));
  const barcodeNumber = text(formData.get("barcodeNumber"));
  const productName = text(formData.get("productName"));
  const brandName = text(formData.get("brandName"));
  const validMaterials: MaterialType[] = [
    "PET_CLEAR",
    "PET_COLORED",
    "HDPE",
    "PP",
  ];

  if (!phoneNumber || !validMaterials.includes(materialType)) {
    return { status: "error", message: "Enter a collector phone number and material type.", receiptCode: null };
  }
  if (!Number.isFinite(weightKg) || weightKg <= 0 || weightKg > 50000) {
    return { status: "error", message: "Enter a valid weight between 0.01 and 50,000 KG.", receiptCode: null };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { status: "error", message: "Your session has expired. Sign in again.", receiptCode: null };

  const { data: agent } = await supabase
    .from("profiles")
    .select("role, is_active, assigned_depot_id")
    .eq("id", user.id)
    .single();
  if (!agent || agent.role !== "agent" || !agent.is_active || !agent.assigned_depot_id) {
    return { status: "error", message: "Your account is not authorized for buyback intake.", receiptCode: null };
  }

  const adminClient = createAdminClient();
  const { data: collector } = await adminClient
    .from("profiles")
    .select("id, phone_number, mobile_money_provider")
    .eq("phone_number", phoneNumber)
    .eq("role", "collector")
    .eq("is_active", true)
    .maybeSingle();
  if (!collector) {
    return { status: "error", message: "No active collector was found with that phone number.", receiptCode: null };
  }

  const { data: pricingRule } = await adminClient
    .from("pricing_rules")
    .select("base_rate_cfa, regional_multiplier, campaign_bonus_cfa")
    .eq("material_type", materialType)
    .eq("status", "ACTIVE")
    .order("start_date", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (!pricingRule) {
    return { status: "error", message: "No active pricing rule exists for this material.", receiptCode: null };
  }

  const baseRate = Number(pricingRule.base_rate_cfa);
  const multiplier = Number(pricingRule.regional_multiplier);
  const bonus = Number(pricingRule.campaign_bonus_cfa);
  const itemPayout = Math.round(weightKg * baseRate * multiplier + bonus);
  const receiptCode = `WP-${new Date().getFullYear()}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;

  let catalogBarcode: string | null = null;
  if (barcodeNumber) {
    const { data: existingBarcode } = await adminClient
      .from("barcodes")
      .select("barcode_number")
      .eq("barcode_number", barcodeNumber)
      .maybeSingle();
    if (existingBarcode) {
      catalogBarcode = existingBarcode.barcode_number;
    } else if (productName.length >= 2 && brandName.length >= 2) {
      const { data: createdBarcode } = await adminClient
        .from("barcodes")
        .insert({
          barcode_number: barcodeNumber,
          product_name: productName,
          brand_name: brandName,
          manufacturer_name: "Unverified",
          material_type: materialType,
          verification_status: "UNVERIFIED",
        })
        .select("barcode_number")
        .single();
      catalogBarcode = createdBarcode?.barcode_number ?? null;
    }
  }

  const { data: transaction, error: transactionError } = await adminClient
    .from("transactions")
    .insert({
      receipt_code: receiptCode,
      collector_profile_id: collector.id,
      agent_profile_id: user.id,
      depot_id: agent.assigned_depot_id,
      payout_provider: collector.mobile_money_provider,
      payout_phone_number: collector.phone_number,
      total_weight_kg: weightKg,
      total_payout_cfa: itemPayout,
      status: "DRAFT",
    })
    .select("id")
    .single();
  if (transactionError || !transaction) {
    return { status: "error", message: "WastePay could not create the buyback transaction.", receiptCode: null };
  }

  const { error: itemError } = await adminClient.from("transaction_items").insert({
    transaction_id: transaction.id,
    barcode_number: catalogBarcode,
    material_type: materialType,
    weight_kg: weightKg,
    base_rate_cfa: baseRate,
    regional_multiplier: multiplier,
    campaign_bonus_cfa: bonus,
    item_payout_cfa: itemPayout,
  });
  if (itemError) {
    return { status: "error", message: "The transaction was created but its material item could not be saved.", receiptCode };
  }

  revalidatePath("/app/agent");
  revalidatePath("/app/collector");
  return { status: "success", message: "Draft buyback transaction created.", receiptCode };
}
