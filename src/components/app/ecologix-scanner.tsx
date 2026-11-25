"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";

import { BarcodeScanner } from "@/components/shared/barcode-scanner";
import { LivePhotoCapture } from "@/components/app/live-photo-capture";
import {
  lookupEcologixProduct,
  recordEcologixScan,
  type EcologixProductLookup,
  type EcologixScanState,
} from "@/actions/public/ecologix-scans";

type ScanPoint = {
  latitude: number;
  longitude: number;
  brandName: string;
};

type EcologixScannerProps = {
  scanCount: number;
  brandCount: number;
  auditCount: number;
  points: ScanPoint[];
};

const initialState: EcologixScanState = {
  status: "idle",
  message: "",
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="min-h-14 w-full rounded-2xl border border-emerald-300/20 bg-emerald-400 px-5 py-4 text-xs font-black uppercase tracking-[0.16em] text-slate-950 shadow-2xl shadow-emerald-500/20 transition-all duration-300 hover:-translate-y-1 hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Recording contribution" : "Add scan to ECOLOGIX"}
    </button>
  );
}

function projectPosition(
  latitude: number,
  longitude: number,
): { left: number; top: number } {
  const left = ((longitude + 180) / 360) * 100;
  const top = ((90 - latitude) / 180) * 100;

  return {
    left: Math.max(4, Math.min(96, left)),
    top: Math.max(6, Math.min(94, top)),
  };
}

export function EcologixScanner({
  scanCount,
  brandCount,
  auditCount,
  points,
}: EcologixScannerProps) {
  const [state, formAction] = useActionState(recordEcologixScan, initialState);
  const [barcodeNumber, setBarcodeNumber] = useState("");
  const [lookup, setLookup] = useState<EcologixProductLookup | null>(null);
  const [productName, setProductName] = useState("");
  const [brandName, setBrandName] = useState("");
  const [manufacturerName, setManufacturerName] = useState("");
  const [productVolume, setProductVolume] = useState("");
  const [materialType, setMaterialType] = useState("");
  const [countryOfManufacture, setCountryOfManufacture] = useState("");
  const [sellerName, setSellerName] = useState("");
  const [auditAreaName, setAuditAreaName] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [locationMessage, setLocationMessage] = useState(
    "Location will be captured when you allow phone location access.",
  );

  useEffect(() => {
    if (!navigator.geolocation) {
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude.toFixed(6));
        setLongitude(position.coords.longitude.toFixed(6));
        setLocationMessage("Location captured. It will be attached to this scan.");
      },
      () => {
        setLocationMessage(
          "Location was not shared. The contribution can still be recorded.",
        );
      },
      {
        enableHighAccuracy: true,
        maximumAge: 60_000,
        timeout: 12_000,
      },
    );
  }, []);

  async function handleBarcodeScan(decodedText: string) {
    setBarcodeNumber(decodedText);

    const result = await lookupEcologixProduct(decodedText);
    setLookup(result);

    if (result.found) {
      setProductName(result.productName);
      setBrandName(result.brandName);
      setManufacturerName(result.manufacturerName);
      setProductVolume(result.productVolume);
      setMaterialType(result.materialType);
      setCountryOfManufacture(result.countryOfManufacture);
    }
  }

  async function handleBarcodeLookup() {
    if (!barcodeNumber.trim()) {
      return;
    }

    const result = await lookupEcologixProduct(barcodeNumber);
    setLookup(result);

    if (result.found) {
      setProductName(result.productName);
      setBrandName(result.brandName);
      setManufacturerName(result.manufacturerName);
      setProductVolume(result.productVolume);
      setMaterialType(result.materialType);
      setCountryOfManufacture(result.countryOfManufacture);
    }
  }

  function captureLocation() {
    if (!navigator.geolocation) {
      setLocationMessage("This browser cannot capture location.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude.toFixed(6));
        setLongitude(position.coords.longitude.toFixed(6));
        setLocationMessage("Location captured. It will be attached to this scan.");
      },
      () => {
        setLocationMessage("Location permission was denied or unavailable.");
      },
      {
        enableHighAccuracy: true,
        maximumAge: 60_000,
        timeout: 12_000,
      },
    );
  }

  return (
    <main className="wp-consumer-app">
      <section className="wp-consumer-app__hero scroll-mt-20">
        <p className="wp-overline">ECOLOGIX plastic intelligence</p>
        <h1>Scan waste. Build the evidence.</h1>
        <p>
          Scan packaging to identify plastic products, contribute verified
          location data, and reveal where brands and materials appear.
        </p>
      </section>

      <section className="grid min-w-0 gap-3 md:grid-cols-3">
        <article className="rounded-[1.75rem] border border-emerald-400/15 bg-emerald-400/[0.06] p-5">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-300">
            Items scanned
          </p>
          <strong className="mt-3 block text-4xl text-white">{scanCount}</strong>
          <p className="mt-2 text-sm text-slate-400">Recorded contributions</p>
        </article>
        <article className="rounded-[1.75rem] border border-sky-400/15 bg-sky-400/[0.06] p-5">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-sky-300">
            Products
          </p>
          <strong className="mt-3 block text-4xl text-white">{brandCount}</strong>
          <p className="mt-2 text-sm text-slate-400">Known brands</p>
        </article>
        <article className="rounded-[1.75rem] border border-violet-400/15 bg-violet-400/[0.06] p-5">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-violet-300">
            Audit areas
          </p>
          <strong className="mt-3 block text-4xl text-white">{auditCount}</strong>
          <p className="mt-2 text-sm text-slate-400">Named datasets</p>
        </article>
      </section>

      <section className="wp-consumer-app__section">
        <div className="wp-consumer-app__section-heading">
          <p className="wp-overline">Barcode scanning</p>
          <h2>Point your camera at the packaging.</h2>
        </div>

        <div className="rounded-[2rem] border border-emerald-400/15 bg-slate-950/50 p-5 sm:p-7">
          <label
            htmlFor="ecologixBarcode"
            className="text-xs font-black uppercase tracking-[0.18em] text-slate-400"
          >
            Barcode
          </label>
          <div className="mt-3 flex gap-3">
            <input
              id="ecologixBarcode"
              name="barcodeNumber"
              value={barcodeNumber}
              onChange={(event) => setBarcodeNumber(event.target.value)}
              type="text"
              inputMode="numeric"
              placeholder="Scan or enter barcode"
              className="min-h-14 min-w-0 flex-1 rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-white outline-none focus:border-emerald-400/50"
            />
            <button
              type="button"
              onClick={() => void handleBarcodeLookup()}
              className="min-h-14 rounded-2xl border border-sky-400/20 bg-sky-400/10 px-4 text-xs font-black uppercase tracking-[0.12em] text-sky-200"
            >
              Lookup
            </button>
          </div>
          <BarcodeScanner
            inputId="ecologixBarcode"
            onScan={(decodedText) => void handleBarcodeScan(decodedText)}
          />

          {lookup ? (
            <div
              className={`mt-5 rounded-2xl border p-5 ${
                lookup.found
                  ? "border-emerald-400/20 bg-emerald-400/[0.07]"
                  : "border-amber-400/20 bg-amber-400/[0.07]"
              }`}
            >
              <p className="text-xs font-black uppercase tracking-[0.18em]">
                {lookup.found ? "Known ECOLOGIX product" : "New product"}
              </p>
              {lookup.found ? (
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  <strong>{lookup.productName}</strong> by{" "}
                  <strong>{lookup.brandName}</strong>
                  {lookup.productVolume ? ` (${lookup.productVolume})` : ""}. Manufacturer:{" "}
                  {lookup.manufacturerName}. {lookup.scanCount} items recorded.
                </p>
              ) : (
                <p className="mt-3 text-sm leading-7 text-amber-100">
                  This barcode is not in the catalog yet. Complete the product
                  details below and add it with your scan.
                </p>
              )}
              {lookup.contributorNames.length > 0 ? (
                <p className="mt-3 text-sm text-sky-200">
                  Contributors: {lookup.contributorNames.join(", ")}
                </p>
              ) : null}
              {lookup.auditAreaNames.length > 0 ? (
                <p className="mt-2 text-sm text-violet-200">
                  Audit areas: {lookup.auditAreaNames.join(", ")}
                </p>
              ) : null}
            </div>
          ) : null}
        </div>
      </section>

      <section className="wp-consumer-app__section">
        <div className="wp-consumer-app__section-heading">
          <p className="wp-overline">Contribute data</p>
          <h2>Complete the product record.</h2>
        </div>

        <form action={formAction} className="grid gap-5 sm:grid-cols-2">
          <input type="hidden" name="barcodeNumber" value={barcodeNumber} />
          <input type="hidden" name="latitude" value={latitude} />
          <input type="hidden" name="longitude" value={longitude} />

          <label className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
            Number of items
            <input
              name="quantity"
              type="number"
              min="1"
              max="200"
              defaultValue="1"
              required
              inputMode="numeric"
              className="mt-3 min-h-12 w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 text-white outline-none focus:border-emerald-400/50"
            />
            <span className="mt-2 block text-xs font-normal normal-case tracking-normal text-slate-500">
              Enter how many matching items this scan represents.
            </span>
          </label>
          <label className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
            Tags
            <input
              name="tags"
              type="text"
              maxLength={500}
              placeholder="beach cleanup, PET bottle"
              className="mt-3 min-h-12 w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 text-white outline-none focus:border-emerald-400/50"
            />
            <span className="mt-2 block text-xs font-normal normal-case tracking-normal text-slate-500">
              Optional; separate tags with commas.
            </span>
          </label>

          <label className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
            Product name
            <input
              name="productName"
              value={productName}
              onChange={(event) => setProductName(event.target.value)}
              required
              placeholder="Plastic bottle"
              className="mt-3 min-h-12 w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 text-white outline-none focus:border-emerald-400/50"
            />
          </label>
          <label className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
            Brand
            <input
              name="brandName"
              value={brandName}
              onChange={(event) => setBrandName(event.target.value)}
              required
              placeholder="Brand name"
              className="mt-3 min-h-12 w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 text-white outline-none focus:border-emerald-400/50"
            />
          </label>
          <label className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
            Manufacturer / parent company
            <input
              name="manufacturerName"
              value={manufacturerName}
              onChange={(event) => setManufacturerName(event.target.value)}
              required
              placeholder="Manufacturer or parent company"
              className="mt-3 min-h-12 w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 text-white outline-none focus:border-emerald-400/50"
            />
          </label>
          <label className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
            Volume / size
            <input
              name="productVolume"
              value={productVolume}
              onChange={(event) => setProductVolume(event.target.value)}
              placeholder="500 ml"
              className="mt-3 min-h-12 w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 text-white outline-none focus:border-emerald-400/50"
            />
          </label>
          <label className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
            Plastic type
            <select
              name="materialType"
              value={materialType}
              onChange={(event) => setMaterialType(event.target.value)}
              required
              className="mt-3 min-h-12 w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 text-white outline-none focus:border-emerald-400/50"
            >
              <option value="" disabled>Select plastic</option>
              <option value="PET_CLEAR">PET clear</option>
              <option value="PET_COLORED">PET colored</option>
              <option value="HDPE">HDPE</option>
              <option value="PP">PP</option>
            </select>
          </label>
          <label className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
            Country of manufacture
            <input
              name="countryOfManufacture"
              value={countryOfManufacture}
              onChange={(event) => setCountryOfManufacture(event.target.value)}
              placeholder="Cameroon"
              className="mt-3 min-h-12 w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 text-white outline-none focus:border-emerald-400/50"
            />
          </label>
          <label className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
            Seller / location source
            <input
              name="sellerName"
              value={sellerName}
              onChange={(event) => setSellerName(event.target.value)}
              placeholder="Shop, person, or seller"
              className="mt-3 min-h-12 w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 text-white outline-none focus:border-emerald-400/50"
            />
          </label>
          <label className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
            Audit area
            <input
              name="auditAreaName"
              value={auditAreaName}
              onChange={(event) => setAuditAreaName(event.target.value)}
              placeholder="Market, street, beach, or neighbourhood"
              className="mt-3 min-h-12 w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 text-white outline-none focus:border-emerald-400/50"
            />
          </label>

          <div className="sm:col-span-2">
            <label
              htmlFor="ecologixScanPhoto"
              className="mb-3 block text-xs font-black uppercase tracking-[0.16em] text-slate-400"
            >
              Photo evidence (optional)
            </label>
            <LivePhotoCapture
              id="ecologixScanPhoto"
              name="scanPhoto"
            />
            <p className="mt-2 text-xs text-slate-500">
              Take a live photo of the product so we can help identify it. Photos are optional.
            </p>
          </div>

          <div className="sm:col-span-2">
            <button
              type="button"
              onClick={captureLocation}
              className="min-h-12 w-full rounded-2xl border border-sky-400/20 bg-sky-400/[0.07] px-5 text-xs font-black uppercase tracking-[0.16em] text-sky-200"
            >
              {latitude && longitude
                ? "Update captured location"
                : "Capture current location"}
            </button>
            <p className="mt-3 text-sm leading-6 text-slate-400" role="status">
              {locationMessage}
            </p>
          </div>

          <div className="sm:col-span-2">
            <SubmitButton />
          </div>

          {state.message ? (
            <p
              role={state.status === "error" ? "alert" : "status"}
              className={`sm:col-span-2 rounded-2xl border px-5 py-4 text-sm ${
                state.status === "success"
                  ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-100"
                  : "border-red-400/20 bg-red-400/10 text-red-200"
              }`}
            >
              {state.message}
            </p>
          ) : null}
        </form>
      </section>

      <section className="wp-consumer-app__section">
        <div className="wp-consumer-app__section-heading">
          <p className="wp-overline">Live scan map</p>
          <h2>Where plastic was found.</h2>
          <p>
            Red dots represent scan locations. The map updates after new scans
            are recorded.
          </p>
        </div>
        <div className="relative min-h-[420px] overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_50%_40%,rgba(56,189,248,0.12),transparent_42%),linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[length:100%_100%,32px_32px,32px_32px]">
          <div className="absolute left-5 top-5 flex gap-2">
            <span className="rounded-full border border-red-400/20 bg-red-400/10 px-3 py-2 text-[0.64rem] font-black uppercase tracking-[0.12em] text-red-200">
              Red: scan found
            </span>
          </div>
          {points.map((point, index) => {
            const position = projectPosition(
              point.latitude,
              point.longitude,
            );

            return (
              <span
                key={`${point.latitude}-${point.longitude}-${index}`}
                title={`${point.brandName}: scan location`}
                className="absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-400 shadow-[0_0_20px_rgba(248,113,113,0.9)]"
                style={{ left: `${position.left}%`, top: `${position.top}%` }}
              />
            );
          })}
          {points.length === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center px-8 text-center">
              <p className="max-w-sm text-sm leading-7 text-slate-400">
                No located scans are available yet. The first scan with location
                enabled will appear here.
              </p>
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
