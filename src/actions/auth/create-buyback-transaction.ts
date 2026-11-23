"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import {
  getBuybackBarcodeError,
  isValidBuybackBarcode,
  normalizeCameroonPhoneNumber,
} from "@/lib/buyback-validation";

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
  const phoneNumberInput = text(formData.get("collectorPhoneNumber"));
  const phoneNumber = normalizeCameroonPhoneNumber(phoneNumberInput);
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
    return {
      status: "error",
      message:
        "Enter a valid Cameroon collector phone number and select a material type.",
      receiptCode: null,
    };
  }

  if (!Number.isFinite(weightKg) || weightKg <= 0 || weightKg > 50000) {
    return { status: "error", message: "Enter a valid weight between 0.01 and 50,000 KG.", receiptCode: null };
  }

  if (!isValidBuybackBarcode(barcodeNumber)) {
    return {
      status: "error",
      message:
        "Enter a material barcode without spaces and no longer than 128 characters.",
      receiptCode: null,
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
      message: "Your session could not be verified. Sign in again.",
      receiptCode: null,
    };
  }

  const { data: agent, error: agentError } = await supabase
    .from("profiles")
    .select("role, is_active, assigned_depot_id, must_change_password")
    .eq("id", user.id)
    .single();

  if (agentError) {
    console.error("ECOLOGIX could not load the depot agent profile.", {
      code: agentError.code,
      message: agentError.message,
    });
    return {
      status: "error",
      message: `ECOLOGIX could not verify your depot-agent profile${agentError.code ? ` (error ${agentError.code})` : ""}.`,
      receiptCode: null,
    };
  }

  if (
    !agent ||
    agent.role !== "agent" ||
    !agent.is_active ||
    !agent.assigned_depot_id
  ) {
    return {
      status: "error",
      message:
        "Your account is not authorized for buyback intake or has no assigned depot.",
      receiptCode: null,
    };
  }

  if (agent.must_change_password) {
    return {
      status: "error",
      message:
        "Change your temporary password before creating a buyback transaction.",
      receiptCode: null,
    };
  }

  const adminClient = createAdminClient();
  const { data: collector, error: collectorError } = await adminClient
    .from("profiles")
    .select("id, phone_number, mobile_money_provider, assigned_depot_id")
    .eq("phone_number", phoneNumber)
    .eq("role", "collector")
    .eq("is_active", true)
    .maybeSingle();

  if (collectorError) {
    console.error("ECOLOGIX could not look up the buyback collector.", {
      code: collectorError.code,
      message: collectorError.message,
    });
    return {
      status: "error",
      message: `ECOLOGIX could not check the collector account${collectorError.code ? ` (error ${collectorError.code})` : ""}.`,
      receiptCode: null,
    };
  }

  if (!collector) {
    return { status: "error", message: "No active collector was found with that phone number.", receiptCode: null };
  }

  if (collector.assigned_depot_id !== agent.assigned_depot_id) {
    return {
      status: "error",
      message:
        "This collector is assigned to a different depot. Ask an administrator to verify the collector and depot assignments.",
      receiptCode: null,
    };
  }

  if (!collector.mobile_money_provider) {
    return {
      status: "error",
      message:
        "This collector does not have a Mobile Money provider set up. Update the collector account before creating a buyback.",
      receiptCode: null,
    };
  }

  const { data: pricingRule, error: pricingError } = await adminClient
    .from("pricing_rules")
    .select("base_rate_cfa, regional_multiplier, campaign_bonus_cfa")
    .eq("material_type", materialType)
    .eq("status", "ACTIVE")
    .order("start_date", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (pricingError) {
    console.error("ECOLOGIX could not load buyback pricing.", {
      code: pricingError.code,
      message: pricingError.message,
    });
    return {
      status: "error",
      message: `ECOLOGIX could not load material pricing${pricingError.code ? ` (error ${pricingError.code})` : ""}.`,
      receiptCode: null,
    };
  }

  if (!pricingRule) {
    return { status: "error", message: "No active pricing rule exists for this material.", receiptCode: null };
  }

  const baseRate = Number(pricingRule.base_rate_cfa);
  const multiplier = Number(pricingRule.regional_multiplier);
  const bonus = Number(pricingRule.campaign_bonus_cfa);
  const itemPayout = Math.round(weightKg * baseRate * multiplier + bonus);
  if (
    !Number.isFinite(baseRate) ||
    !Number.isFinite(multiplier) ||
    !Number.isFinite(bonus) ||
    !Number.isSafeInteger(itemPayout) ||
    itemPayout < 0
  ) {
    return {
      status: "error",
      message:
        "The active pricing rule contains an invalid payout amount. Contact an administrator before recording this intake.",
      receiptCode: null,
    };
  }
  const receiptCode = `WP-${new Date().getFullYear()}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;

  let catalogBarcode: string | null = null;
  if (barcodeNumber) {
    const { data: existingBarcode, error: barcodeLookupError } = await adminClient
      .from("barcodes")
      .select("barcode_number, material_type, verification_status")
      .eq("barcode_number", barcodeNumber)
      .maybeSingle();

    if (barcodeLookupError) {
      console.error("ECOLOGIX could not look up the material barcode.", {
        code: barcodeLookupError.code,
        message: barcodeLookupError.message,
      });
      return {
        status: "error",
        message: `ECOLOGIX could not verify this material code${barcodeLookupError.code ? ` (error ${barcodeLookupError.code})` : ""}.`,
        receiptCode: null,
      };
    }

    if (existingBarcode) {
      const barcodeError = getBuybackBarcodeError(
        existingBarcode,
        materialType,
      );

      if (barcodeError === "archived") {
        return {
          status: "error",
          message:
            "This material code has been archived and cannot be used for a buyback.",
          receiptCode: null,
        };
      }

      if (barcodeError === "material-mismatch") {
        return {
          status: "error",
          message: `This code is catalogued as ${existingBarcode.material_type.replace("_", " ")}. Select that material type or ask an administrator to correct the barcode record.`,
          receiptCode: null,
        };
      }

      catalogBarcode = existingBarcode.barcode_number;
    } else {
      if (
        productName.length < 2 ||
        productName.length > 120 ||
        brandName.length < 2 ||
        brandName.length > 120
      ) {
        return {
          status: "error",
          message:
            "This code is not in the catalogue. Enter the product name and brand so the code can be saved for verification.",
          receiptCode: null,
        };
      }

      const { data: createdBarcode, error: barcodeInsertError } =
        await adminClient
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

      if (barcodeInsertError || !createdBarcode) {
        console.error("ECOLOGIX could not save the new material barcode.", {
          code: barcodeInsertError?.code,
          message: barcodeInsertError?.message,
        });
        return {
          status: "error",
          message: `ECOLOGIX could not save this material code${barcodeInsertError?.code ? ` (error ${barcodeInsertError.code})` : ""}. Check the code or contact an administrator.`,
          receiptCode: null,
        };
      }

      catalogBarcode = createdBarcode.barcode_number;
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
    console.error("ECOLOGIX could not create the buyback transaction.", {
      code: transactionError?.code,
      message: transactionError?.message,
    });
    return {
      status: "error",
      message: `ECOLOGIX could not create the buyback transaction${transactionError?.code ? ` (error ${transactionError.code})` : ""}.`,
      receiptCode: null,
    };
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
    console.error("ECOLOGIX could not save the buyback transaction item.", {
      code: itemError.code,
      message: itemError.message,
      transactionId: transaction.id,
    });
    const { error: cleanupError } = await adminClient
      .from("transactions")
      .delete()
      .eq("id", transaction.id)
      .eq("status", "DRAFT");

    if (cleanupError) {
      console.error("ECOLOGIX could not remove the incomplete buyback draft.", {
        code: cleanupError.code,
        message: cleanupError.message,
        transactionId: transaction.id,
      });
      return {
        status: "error",
        message: `The buyback item could not be saved (error ${itemError.code ?? "unknown"}) and its draft could not be removed (error ${cleanupError.code ?? "unknown"}). Do not prepare a payout for receipt ${receiptCode}; contact an administrator.`,
        receiptCode,
      };
    }

    return {
      status: "error",
      message: `The buyback material item could not be saved${itemError.code ? ` (error ${itemError.code})` : ""}. The incomplete draft was removed; check the material details and try again.`,
      receiptCode: null,
    };
  }

  revalidatePath("/app/agent");
  revalidatePath("/app/collector");
  return { status: "success", message: "Draft buyback transaction created.", receiptCode };
}
