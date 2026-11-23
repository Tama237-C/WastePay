import type { Metadata } from "next";

import { EcologixScanner } from "@/components/app/ecologix-scanner";
import { ConsumerAppShell } from "@/components/app/consumer-app-shell";
import { createAdminClient } from "@/lib/supabase/admin";

export const metadata: Metadata = {
  title: "Scan Plastic | ECOLOGIX",
  description:
    "Scan plastic packaging, identify products, and contribute geographic plastic intelligence.",
};

export const dynamic = "force-dynamic";

export default async function EcologixScanPage() {
  const adminClient = createAdminClient();
  const [
    { data: scans, error: scansError },
    { data: allScans, error: allScansError },
    { data: barcodes, error: barcodesError },
    { data: audits, error: auditsError },
  ] = await Promise.all([
    adminClient
      .from("ecologix_scans")
      .select("latitude, longitude, brand_name")
      .not("latitude", "is", null)
      .not("longitude", "is", null)
      .order("scanned_at", { ascending: false })
      .limit(250),
    adminClient
      .from("ecologix_scans")
      .select("id")
      .limit(1000),
    adminClient
      .from("barcodes")
      .select("brand_name")
      .limit(1000),
    adminClient
      .from("ecologix_audit_areas")
      .select("id")
      .limit(1000),
  ]);

  const locatedScans = scansError
    ? []
    : (scans ?? [])
        .filter(
          (scan) =>
            scan.latitude !== null &&
            scan.longitude !== null &&
            Number.isFinite(Number(scan.latitude)) &&
            Number.isFinite(Number(scan.longitude)),
        )
        .map((scan) => ({
          latitude: Number(scan.latitude),
          longitude: Number(scan.longitude),
          brandName: scan.brand_name,
        }));

  const knownBrands = barcodesError
    ? 0
    : new Set(
        (barcodes ?? [])
          .map((barcode) => barcode.brand_name)
          .filter((brand): brand is string => Boolean(brand)),
      ).size;

  return (
    <ConsumerAppShell>
      <EcologixScanner
        scanCount={allScansError ? 0 : (allScans?.length ?? 0)}
        brandCount={knownBrands}
        auditCount={auditsError ? 0 : (audits?.length ?? 0)}
        points={locatedScans}
      />
    </ConsumerAppShell>
  );
}
