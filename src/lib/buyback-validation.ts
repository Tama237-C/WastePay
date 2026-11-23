export type BuybackCatalogBarcode = {
  material_type: string;
  verification_status: string;
};

export function normalizeCameroonPhoneNumber(value: string): string | null {
  const cleanedValue = value.replace(/[\s()-]/g, "");

  if (/^\+2376\d{8}$/.test(cleanedValue)) {
    return cleanedValue;
  }

  if (/^6\d{8}$/.test(cleanedValue)) {
    return `+237${cleanedValue}`;
  }

  return null;
}

export function isValidBuybackBarcode(value: string): boolean {
  return (
    value.length <= 128 &&
    (value.length === 0 || !/\s/.test(value))
  );
}

export function getBuybackBarcodeError(
  existingBarcode: BuybackCatalogBarcode,
  selectedMaterial: string,
): "archived" | "material-mismatch" | null {
  if (existingBarcode.verification_status === "ARCHIVED") {
    return "archived";
  }

  if (existingBarcode.material_type !== selectedMaterial) {
    return "material-mismatch";
  }

  return null;
}
