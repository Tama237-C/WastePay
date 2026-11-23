import { createAdminClient } from "@/lib/supabase/admin";
import { ApproveBarcodeAction } from "@/components/admin/approve-barcode-action";

export default async function BarcodeCatalogPage() {
  const adminClient = createAdminClient();
  const { data: barcodes, error } = await adminClient
    .from("barcodes")
    .select(
      "barcode_number, product_name, brand_name, manufacturer_name, product_volume, material_type, country_of_manufacture, verification_status, created_at",
    )
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-7">
      <section className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-7 shadow-2xl backdrop-blur-xl sm:p-9">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-violet-400">
          Plastic intelligence
        </p>
        <h1 className="mt-5 text-4xl font-black tracking-[-0.05em] text-white sm:text-5xl">
          Barcode catalog
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-8 text-slate-400">
          Review verified product, brand, manufacturer and material records
          collected across the ECOLOGIX network.
        </p>
      </section>

      {error ? (
        <p className="rounded-2xl border border-red-400/20 bg-red-400/[0.08] p-5 text-sm text-red-200">
          ECOLOGIX could not load the barcode catalog.
        </p>
      ) : null}

      <section className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 shadow-2xl backdrop-blur-xl sm:p-8">
        {barcodes && barcodes.length > 0 ? (
          <div className="grid gap-4">
            {barcodes.map((barcode) => (
              <article
                key={barcode.barcode_number}
                className="rounded-3xl border border-white/10 bg-slate-950/50 p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="font-mono text-sm font-bold text-violet-300">
                      {barcode.barcode_number}
                    </p>
                    <h2 className="mt-3 text-xl font-black text-white">
                      {barcode.product_name}
                    </h2>
                  </div>
                  <span className="rounded-full border border-emerald-400/20 bg-emerald-400/[0.08] px-3 py-1 text-xs font-black uppercase tracking-[0.14em] text-emerald-300">
                    {barcode.verification_status}
                  </span>
                </div>
                <div className="mt-5 grid gap-4 text-sm sm:grid-cols-4">
                  <div>
                    <p className="text-slate-600">Brand</p>
                    <p className="mt-1 text-slate-200">{barcode.brand_name}</p>
                  </div>
                  <div>
                    <p className="text-slate-600">Manufacturer</p>
                    <p className="mt-1 text-slate-200">{barcode.manufacturer_name}</p>
                  </div>
                  <div>
                    <p className="text-slate-600">Material</p>
                    <p className="mt-1 text-slate-200">{barcode.material_type}</p>
                  </div>
                  <div>
                    <p className="text-slate-600">Country</p>
                    <p className="mt-1 text-slate-200">{barcode.country_of_manufacture ?? "Not provided"}</p>
                  </div>
                </div>
                {barcode.verification_status === "UNVERIFIED" ? (
                  <ApproveBarcodeAction barcodeNumber={barcode.barcode_number} />
                ) : null}
              </article>
            ))}
          </div>
        ) : (
          <p className="text-sm leading-7 text-slate-500">
            No barcode products have been cataloged yet.
          </p>
        )}
      </section>
    </div>
  );
}
