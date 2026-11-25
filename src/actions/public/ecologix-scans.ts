"use server";

import { revalidatePath } from "next/cache";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { isValidBuybackBarcode } from "@/lib/buyback-validation";

export type EcologixScanState = {
  status: "idle" | "error" | "success";
  message: string;
};

const MAX_SCAN_PHOTO_BYTES = 5 * 1024 * 1024;
const scanPhotoMimeTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

export type EcologixProductLookup = {
  barcodeNumber: string;
  found: boolean;
  productName: string;
  brandName: string;
  manufacturerName: string;
  productVolume: string;
  materialType: "PET_CLEAR" | "PET_COLORED" | "HDPE" | "PP";
  countryOfManufacture: string;
  scanCount: number;
  contributorNames: string[];
  auditAreaNames: string[];
};

function text(value: FormDataEntryValue | null): string {
  return typeof value === "string" ? value.trim() : "";
}

function finiteCoordinate(value: FormDataEntryValue | null): number | null {
  if (typeof value !== "string" || value.trim() === "") {
    return null;
  }

  const coordinate = Number(value);
  return Number.isFinite(coordinate) ? coordinate : null;
}

export async function lookupEcologixProduct(
  barcodeNumberInput: string,
): Promise<EcologixProductLookup> {
  const barcodeNumber = barcodeNumberInput.trim();

  if (!isValidBuybackBarcode(barcodeNumber)) {
    return {
      barcodeNumber,
      found: false,
      productName: "",
      brandName: "",
      manufacturerName: "",
      productVolume: "",
      materialType: "PET_CLEAR",
      countryOfManufacture: "",
      scanCount: 0,
      contributorNames: [],
      auditAreaNames: [],
    };
  }

  const adminClient = createAdminClient();
  const [{ data: product }, { data: scans }] = await Promise.all([
    adminClient
      .from("barcodes")
      .select(
        "barcode_number, product_name, brand_name, manufacturer_name, product_volume, material_type, country_of_manufacture",
      )
      .eq("barcode_number", barcodeNumber)
      .maybeSingle(),
    adminClient
      .from("ecologix_scans")
      .select("scanner_profile_id, audit_area_name, quantity")
      .eq("barcode_number", barcodeNumber)
      .order("scanned_at", { ascending: false })
      .limit(100),
  ]);

  if (!product) {
    return {
      barcodeNumber,
      found: false,
      productName: "",
      brandName: "",
      manufacturerName: "",
      productVolume: "",
      materialType: "PET_CLEAR",
      countryOfManufacture: "",
      scanCount: (scans ?? []).reduce((total, scan) => total + (scan.quantity ?? 1), 0),
      contributorNames: [],
      auditAreaNames: [
        ...new Set(
          (scans ?? [])
            .map((scan) => scan.audit_area_name)
            .filter((area): area is string => Boolean(area)),
        ),
      ],
    };
  }

  const contributorIds = [
    ...new Set(
      (scans ?? [])
        .map((scan) => scan.scanner_profile_id)
        .filter((id): id is string => Boolean(id)),
    ),
  ];

  const { data: profiles } =
    contributorIds.length > 0
      ? await adminClient
          .from("profiles")
          .select("full_name")
          .in("id", contributorIds)
      : { data: [] };

  return {
    barcodeNumber,
    found: true,
    productName: product.product_name,
    brandName: product.brand_name,
    manufacturerName: product.manufacturer_name,
    productVolume: product.product_volume ?? "",
    materialType: product.material_type,
    countryOfManufacture: product.country_of_manufacture ?? "",
    scanCount: (scans ?? []).reduce((total, scan) => total + (scan.quantity ?? 1), 0),
    contributorNames: [
      ...new Set(
        (profiles ?? [])
          .map((profile) => profile.full_name)
          .filter((name): name is string => Boolean(name)),
      ),
    ],
    auditAreaNames: [
      ...new Set(
        (scans ?? [])
          .map((scan) => scan.audit_area_name)
          .filter((area): area is string => Boolean(area)),
      ),
    ],
  };
}

export async function recordEcologixScan(
  _previousState: EcologixScanState,
  formData: FormData,
): Promise<EcologixScanState> {
  const barcodeNumber = text(formData.get("barcodeNumber"));
  const productName = text(formData.get("productName"));
  const brandName = text(formData.get("brandName"));
  const manufacturerName = text(formData.get("manufacturerName"));
  const productVolume = text(formData.get("productVolume"));
  const materialType = text(formData.get("materialType"));
  const countryOfManufacture = text(formData.get("countryOfManufacture"));
  const sellerName = text(formData.get("sellerName"));
  const auditAreaName = text(formData.get("auditAreaName"));
  const quantityText = text(formData.get("quantity"));
  const quantity = Number(quantityText);
  const tagsInput = text(formData.get("tags"));
  const tags = [...new Set(tagsInput.split(",").map((tag) => tag.trim()).filter(Boolean))];
  const photoEntry = formData.get("scanPhoto");
  const scanPhoto = photoEntry instanceof File && photoEntry.size > 0 ? photoEntry : null;
  const latitude = finiteCoordinate(formData.get("latitude"));
  const longitude = finiteCoordinate(formData.get("longitude"));
  const validMaterials = ["PET_CLEAR", "PET_COLORED", "HDPE", "PP"];

  if (!isValidBuybackBarcode(barcodeNumber)) {
    return {
      status: "error",
      message: "Enter a valid barcode before recording this scan.",
    };
  }

  if (
    !productName ||
    !brandName ||
    !manufacturerName ||
    !validMaterials.includes(materialType)
  ) {
    return {
      status: "error",
      message:
        "Add the product name, brand, manufacturer, and plastic material.",
    };
  }

  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 200) {
    return {
      status: "error",
      message: "Enter a quantity from 1 to 200.",
    };
  }

  if (tagsInput.length > 500 || tags.length > 20 || tags.some((tag) => tag.length > 60)) {
    return {
      status: "error",
      message: "Use up to 20 tags, with each tag 60 characters or fewer.",
    };
  }

  if (scanPhoto && (!scanPhotoMimeTypes.has(scanPhoto.type) || scanPhoto.size > MAX_SCAN_PHOTO_BYTES)) {
    return {
      status: "error",
      message: "Use a JPG, PNG, or WebP photo smaller than 5 MB.",
    };
  }

  if (
    (latitude !== null && (latitude < -90 || latitude > 90)) ||
    (longitude !== null && (longitude < -180 || longitude > 180))
  ) {
    return {
      status: "error",
      message: "The captured location is outside valid geographic limits.",
    };
  }

  let scannerProfileId: string | null = null;

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    scannerProfileId = user?.id ?? null;
  } catch {
    scannerProfileId = null;
  }

  const adminClient = createAdminClient();
  let photoPath: string | null = null;

  if (scanPhoto) {
    const extension =
      scanPhoto.type === "image/png"
        ? "png"
        : scanPhoto.type === "image/webp"
          ? "webp"
          : "jpg";
    photoPath = `${scannerProfileId ?? "anonymous"}/${crypto.randomUUID()}.${extension}`;
    const { error: uploadError } = await adminClient.storage
      .from("ecologix-scan-photos")
      .upload(photoPath, scanPhoto, {
        contentType: scanPhoto.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("ECOLOGIX could not upload scan photo.", {
        code: uploadError.name,
        message: uploadError.message,
      });
      return {
        status: "error",
        message: "The photo could not be saved. Please try again or submit without it.",
      };
    }
  }

  const { data: existingProduct } = await adminClient
    .from("barcodes")
    .select("barcode_number")
    .eq("barcode_number", barcodeNumber)
    .maybeSingle();

  if (!existingProduct) {
    const { error: barcodeInsertError } = await adminClient
      .from("barcodes")
      .insert({
        barcode_number: barcodeNumber,
        product_name: productName,
        brand_name: brandName,
        manufacturer_name: manufacturerName,
        product_volume: productVolume || null,
        material_type: materialType,
        country_of_manufacture: countryOfManufacture || null,
        verification_status: "UNVERIFIED",
      });

    if (barcodeInsertError) {
      if (photoPath) {
        await adminClient.storage.from("ecologix-scan-photos").remove([photoPath]);
      }
      console.error("ECOLOGIX could not create the new barcode product.", {
        code: barcodeInsertError.code,
        message: barcodeInsertError.message,
      });
      return {
        status: "error",
        message:
          "ECOLOGIX could not save this product. Check the information and try again.",
      };
    }
  }

  const scanInsert: Record<string, unknown> = {
    barcode_number: barcodeNumber,
    scanner_profile_id: scannerProfileId,
    audit_area_name: auditAreaName || null,
    product_name: productName,
    brand_name: brandName,
    manufacturer_name: manufacturerName,
    product_volume: productVolume || null,
    material_type: materialType,
    country_of_manufacture: countryOfManufacture || null,
    seller_name: sellerName || null,
    scan_source: "COMMUNITY",
    quantity,
    tags,
    photo_path: photoPath,
    latitude,
    longitude,
  };

  if (latitude !== null && longitude !== null) {
    scanInsert.scanned_location = `SRID=4326;POINT(${longitude} ${latitude})`;
  }

  const { error: scanInsertError } = await adminClient
    .from("ecologix_scans")
    .insert(scanInsert);

  if (scanInsertError) {
    if (photoPath) {
      await adminClient.storage.from("ecologix-scan-photos").remove([photoPath]);
    }
    console.error("ECOLOGIX could not record the scan.", {
      code: scanInsertError.code,
      message: scanInsertError.message,
    });
    return {
      status: "error",
      message:
        "ECOLOGIX could not record this contribution. Please try again.",
    };
  }

  revalidatePath("/app/scan");
  revalidatePath("/app");

  return {
    status: "success",
    message: "Scan recorded. Your product contribution is now in ECOLOGIX.",
  };
}
