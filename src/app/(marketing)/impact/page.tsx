import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

import { createAdminClient } from "@/lib/supabase/admin";
import { EditablePageSections } from "@/components/marketing/editable-page-sections";

export const metadata: Metadata = {
  title: "Our Impact | ECOLOGIX",
  description:
    "Explore live ECOLOGIX recovery metrics, operational reach, verified plastic movement, and the infrastructure supporting Cameroon’s circular plastic economy.",
  keywords: [
    "ECOLOGIX impact",
    "plastic recovery Cameroon",
    "circular economy impact",
    "plastic recycling data",
    "environmental impact Cameroon",
    "plastic collection statistics",
  ],
  openGraph: {
    title: "ECOLOGIX Impact",
    description:
      "Live recovery infrastructure, collection, community, and verified plastic metrics from the ECOLOGIX network.",
    type: "website",
    locale: "en_CM",
    siteName: "ECOLOGIX",
  },
  twitter: {
    card: "summary_large_image",
    title: "ECOLOGIX Impact",
    description:
      "Explore the measurable recovery activity behind Cameroon’s emerging circular plastic economy.",
  },
};

export const dynamic = "force-dynamic";

type DepotRecord = {
  id: string;
  status: string;
  maximum_storage_capacity_kg: number | string | null;
};

type CollectionRequestRecord = {
  id: string;
  status: string;
  neighbourhood: string;
  estimated_weight_kg: number | string | null;
  actual_weight_kg: number | string | null;
};

type OperationalProfileRecord = {
  id: string;
  role: string;
  is_active: boolean;
};

type ImpactSnapshot = {
  registeredDepots: number;
  operationalDepots: number;
  collectionRequests: number;
  completedPickups: number;
  verifiedPlasticKg: number;
  estimatedPlasticKg: number;
  communitiesReached: number;
  activeOperationalStaff: number;
  networkStorageCapacityKg: number;
  dataAvailable: boolean;
};

function safeNumber(value: number | string | null): number {
  if (value === null) {
    return 0;
  }

  const convertedValue = Number(value);

  if (!Number.isFinite(convertedValue)) {
    return 0;
  }

  return convertedValue;
}

function formatWholeNumber(value: number): string {
  return new Intl.NumberFormat("en-CM", {
    maximumFractionDigits: 0,
  }).format(value);
}

function formatWeight(value: number): string {
  return new Intl.NumberFormat("en-CM", {
    minimumFractionDigits: value > 0 && value < 1 ? 2 : 0,
    maximumFractionDigits: 3,
  }).format(value);
}

async function getImpactSnapshot(): Promise<ImpactSnapshot> {
  const supabase = createAdminClient();

  const [
    depotResponse,
    collectionRequestResponse,
    operationalProfileResponse,
  ] = await Promise.all([
    supabase
      .from("depots")
      .select(
        `
          id,
          status,
          maximum_storage_capacity_kg
        `,
      ),

    supabase
      .from("collection_requests")
      .select(
        `
          id,
          status,
          neighbourhood,
          estimated_weight_kg,
          actual_weight_kg
        `,
      ),

    supabase
      .from("profiles")
      .select(
        `
          id,
          role,
          is_active
        `,
      )
      .in("role", ["admin", "manager", "agent", "driver"]),
  ]);

  const pageHasError = Boolean(
    depotResponse.error ||
      collectionRequestResponse.error ||
      operationalProfileResponse.error,
  );

  if (pageHasError) {
    return {
      registeredDepots: 0,
      operationalDepots: 0,
      collectionRequests: 0,
      completedPickups: 0,
      verifiedPlasticKg: 0,
      estimatedPlasticKg: 0,
      communitiesReached: 0,
      activeOperationalStaff: 0,
      networkStorageCapacityKg: 0,
      dataAvailable: false,
    };
  }

  const depots = (depotResponse.data ?? []) as DepotRecord[];

  const requests = (collectionRequestResponse.data ??
    []) as CollectionRequestRecord[];

  const profiles = (operationalProfileResponse.data ??
    []) as OperationalProfileRecord[];

  const verifiedPlasticKg = requests.reduce(
    (total, request) =>
      total + safeNumber(request.actual_weight_kg),
    0,
  );

  const estimatedPlasticKg = requests.reduce(
    (total, request) =>
      total + safeNumber(request.estimated_weight_kg),
    0,
  );

  const completedPickups = requests.filter(
    (request) => request.status === "COMPLETED",
  ).length;

  const operationalDepots = depots.filter(
    (depot) => depot.status === "active",
  ).length;

  const networkStorageCapacityKg = depots.reduce(
    (total, depot) =>
      total + safeNumber(depot.maximum_storage_capacity_kg),
    0,
  );

  const activeOperationalStaff = profiles.filter(
    (profile) => profile.is_active,
  ).length;

  const normalizedCommunities = requests
    .map((request) => request.neighbourhood.trim().toLowerCase())
    .filter((neighbourhood) => neighbourhood.length > 0);

  const communitiesReached = new Set(normalizedCommunities).size;

  return {
    registeredDepots: depots.length,
    operationalDepots,
    collectionRequests: requests.length,
    completedPickups,
    verifiedPlasticKg,
    estimatedPlasticKg,
    communitiesReached,
    activeOperationalStaff,
    networkStorageCapacityKg,
    dataAvailable: true,
  };
}

const impactPillars = [
  {
    number: "01",
    title: "Environmental recovery",
    description:
      "Plastic is redirected from uncontrolled disposal toward verified collection, sorting, aggregation, and recycling pathways.",
    accentClass:
      "border-emerald-400/15 bg-emerald-400/[0.055] text-emerald-400",
  },
  {
    number: "02",
    title: "Local economic value",
    description:
      "ECOLOGIX is designed to connect verified material recovery with transparent pricing and secure financial settlement.",
    accentClass:
      "border-amber-400/15 bg-amber-400/[0.055] text-amber-400",
  },
  {
    number: "03",
    title: "Operational visibility",
    description:
      "Collection requests, drivers, depots, material weights, staff actions, and transactions remain connected in one system.",
    accentClass:
      "border-sky-400/15 bg-sky-400/[0.055] text-sky-400",
  },
  {
    number: "04",
    title: "Corporate accountability",
    description:
      "Product and barcode intelligence can help brands understand the post-consumer plastic associated with their portfolios.",
    accentClass:
      "border-violet-400/15 bg-violet-400/[0.055] text-violet-400",
  },
];

const measurementLayers = [
  {
    label: "Collection activity",
    title: "Requests and completed pickups",
    description:
      "ECOLOGIX records how recovery demand enters the network and how requests progress through field execution.",
  },
  {
    label: "Material movement",
    title: "Estimated and verified kilograms",
    description:
      "Initial resident estimates can later be compared against the weight verified by an authorized depot agent.",
  },
  {
    label: "Geographic reach",
    title: "Communities and depot coverage",
    description:
      "Location and neighbourhood information helps reveal where collection demand and recovery capacity are developing.",
  },
  {
    label: "Operational participation",
    title: "Authenticated recovery teams",
    description:
      "Administrators, depot managers, agents, and drivers operate through protected role-specific accounts.",
  },
  {
    label: "Financial distribution",
    title: "Pricing and Mobile Money",
    description:
      "Future transaction records will connect verified weight, material category, pricing rules, payout status, and telecom references.",
  },
  {
    label: "Product intelligence",
    title: "Brands, barcodes, and materials",
    description:
      "Product-level records will help identify which packaging types and producers appear most often in recovered plastic.",
  },
];

const futureIndicators = [
  "Verified plastic recovered by month",
  "CFA distributed through Mobile Money",
  "Collector and household participation",
  "PET, HDPE, PP, and LDPE material breakdown",
  "Recovery activity by city and region",
  "Brand and manufacturer recovery footprints",
  "Depot processing and reconciliation performance",
  "Estimated carbon and landfill-diversion outcomes",
];

export default async function ImpactPage() {
  const impact = await getImpactSnapshot();

  const primaryMetrics = [
    {
      label: "Registered depots",
      value: formatWholeNumber(impact.registeredDepots),
      unit:
        impact.registeredDepots === 1
          ? "recovery centre"
          : "recovery centres",
      detail:
        "Physical ECOLOGIX recovery infrastructure recorded in the live network.",
      accentClass:
        "border-emerald-400/15 bg-emerald-400/[0.055]",
      labelClass: "text-emerald-400",
    },
    {
      label: "Collection requests",
      value: formatWholeNumber(impact.collectionRequests),
      unit: "requests received",
      detail:
        "Residential and institutional pickup requests recorded through the ECOLOGIX app.",
      accentClass:
        "border-sky-400/15 bg-sky-400/[0.055]",
      labelClass: "text-sky-400",
    },
    {
      label: "Communities represented",
      value: formatWholeNumber(impact.communitiesReached),
      unit:
        impact.communitiesReached === 1
          ? "neighbourhood"
          : "neighbourhoods",
      detail:
        "Unique neighbourhood names represented across ECOLOGIX collection demand.",
      accentClass:
        "border-violet-400/15 bg-violet-400/[0.055]",
      labelClass: "text-violet-400",
    },
    {
      label: "Operational team",
      value: formatWholeNumber(impact.activeOperationalStaff),
      unit: "active staff accounts",
      detail:
        "Authenticated administrators, managers, depot agents, and pickup drivers.",
      accentClass:
        "border-amber-400/15 bg-amber-400/[0.055]",
      labelClass: "text-amber-400",
    },
  ];

  return (
    <main>
      <section className="relative overflow-hidden pb-20 pt-28 sm:pb-28 sm:pt-32 lg:pt-36">
        <div
          aria-hidden="true"
          className="wp-emerald-glow -left-52 top-0 h-[36rem] w-[36rem]"
        />

        <div
          aria-hidden="true"
          className="wp-sky-glow -right-48 top-24 h-[40rem] w-[40rem]"
        />

        <div className="wp-page-container">
          <div className="grid gap-14 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:gap-12 xl:gap-16">
            <div className="relative z-10 max-w-5xl">
              <p className="wp-eyebrow wp-fade-up">
                ECOLOGIX impact
              </p>

              <h1 className="wp-display-title wp-fade-up-delay-1 mt-8">
                Impact that can
                <span className="wp-gradient-text block">
                  be measured.
                </span>
              </h1>

              <p className="wp-body-large wp-fade-up-delay-2 mt-8 max-w-3xl">
                ECOLOGIX is designed to turn recovery activity into credible
                environmental, operational, geographic, and economic
                intelligence—not isolated claims or disconnected reports.
              </p>

              <div className="wp-fade-up-delay-3 mt-9 flex flex-col gap-3 sm:flex-row">
                <Link href="/app/launch" className="wp-primary-button">
                  Go to App
                  <span aria-hidden="true">→</span>
                </Link>

                <Link href="/partners" className="wp-secondary-button">
                  Build an impact program
                </Link>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-2xl lg:mx-0">
              <div
                aria-hidden="true"
                className="absolute inset-10 rounded-full bg-emerald-400/10 blur-[110px]"
              />

              <div className="wp-glass-panel-strong relative overflow-hidden rounded-[2.5rem] p-6 sm:p-8">
                <div className="pointer-events-none absolute inset-0 wp-grid-background opacity-55" />

                <div className="relative">
                  <Image
                    src="/images/ecologix-community-impact.jpg"
                    alt="Community members and ECOLOGIX workers collecting plastic from a coastal shoreline"
                    width={1280}
                    height={543}
                    className="mb-6 h-48 w-full rounded-2xl object-cover sm:h-56"
                  />

                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-[0.62rem] font-black uppercase tracking-[0.23em] text-emerald-400">
                        Live network snapshot
                      </p>

                      <p className="mt-2 text-sm text-slate-500">
                        Aggregated from ECOLOGIX operations
                      </p>
                    </div>

                    <span
                      className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-2 ${
                        impact.dataAvailable
                          ? "border-emerald-400/20 bg-emerald-400/[0.08]"
                          : "border-amber-400/20 bg-amber-400/[0.08]"
                      }`}
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${
                          impact.dataAvailable
                            ? "bg-emerald-400 shadow-[0_0_14px_rgba(52,211,153,0.85)]"
                            : "bg-amber-400"
                        }`}
                      />

                      <span
                        className={`text-[0.58rem] font-black uppercase tracking-[0.16em] ${
                          impact.dataAvailable
                            ? "text-emerald-300"
                            : "text-amber-300"
                        }`}
                      >
                        {impact.dataAvailable
                          ? "Live data"
                          : "Data unavailable"}
                      </span>
                    </span>
                  </div>

                  <div className="mt-8 rounded-3xl border border-white/10 bg-slate-950/60 p-6 sm:p-7">
                    <p className="text-[0.62rem] font-black uppercase tracking-[0.2em] text-slate-600">
                      Verified plastic recorded
                    </p>

                    <div className="mt-5 flex flex-wrap items-end gap-3">
                      <p className="text-5xl font-black tracking-[-0.06em] text-white sm:text-7xl">
                        {formatWeight(impact.verifiedPlasticKg)}
                      </p>

                      <p className="pb-2 text-xs font-black uppercase tracking-[0.18em] text-emerald-400">
                        KG
                      </p>
                    </div>

                    <p className="mt-5 text-sm font-light leading-7 text-slate-500">
                      This figure increases when an ECOLOGIX depot records an
                      actual verified delivery weight.
                    </p>
                  </div>

                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <article className="rounded-2xl border border-sky-400/15 bg-sky-400/[0.06] p-5">
                      <p className="text-[0.58rem] font-black uppercase tracking-[0.18em] text-sky-400/70">
                        Estimated pipeline
                      </p>

                      <p className="mt-3 text-2xl font-black text-white">
                        {formatWeight(impact.estimatedPlasticKg)} KG
                      </p>
                    </article>

                    <article className="rounded-2xl border border-violet-400/15 bg-violet-400/[0.06] p-5">
                      <p className="text-[0.58rem] font-black uppercase tracking-[0.18em] text-violet-400/70">
                        Completed pickups
                      </p>

                      <p className="mt-3 text-2xl font-black text-white">
                        {formatWholeNumber(impact.completedPickups)}
                      </p>
                    </article>
                  </div>

                  <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.025] p-5">
                    <div className="flex items-center justify-between gap-5">
                      <div>
                        <p className="text-[0.58rem] font-black uppercase tracking-[0.18em] text-slate-600">
                          Network storage capacity
                        </p>

                        <p className="mt-3 text-xl font-black text-white">
                          {formatWeight(
                            impact.networkStorageCapacityKg,
                          )}{" "}
                          KG
                        </p>
                      </div>

                      <p className="text-right text-xs leading-5 text-slate-600">
                        Across all registered
                        <br />
                        ECOLOGIX depots
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-6 -left-3 hidden rounded-2xl border border-white/10 bg-slate-950/90 p-5 shadow-2xl backdrop-blur-xl sm:block">
                <p className="text-[0.56rem] font-black uppercase tracking-[0.18em] text-slate-600">
                  Measurement principle
                </p>

                <p className="mt-2 text-sm font-black text-white">
                  No verified operation, no impact claim.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.018]">
        <div className="wp-page-container py-8">
          <div className="flex flex-col gap-4 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
            <p className="text-[0.62rem] font-black uppercase tracking-[0.22em] text-slate-600">
              Public metrics exclude names, phone numbers, exact GPS locations,
              and private transaction details.
            </p>

            <span className="shrink-0 rounded-full border border-emerald-400/15 bg-emerald-400/[0.06] px-3 py-2 text-[0.58rem] font-black uppercase tracking-[0.16em] text-emerald-300">
              Aggregate data only
            </span>
          </div>
        </div>
      </section>

      <section className="wp-section">
        <div className="wp-page-container">
          <div className="max-w-5xl">
            <p className="wp-eyebrow">
              Live platform indicators
            </p>

            <h2 className="wp-section-title mt-7">
              The recovery network
              <span className="block font-light text-slate-500">
                as it exists today.
              </span>
            </h2>

            <p className="wp-body-large mt-7 max-w-4xl">
              These figures come from the same operational records used by
              ECOLOGIX administrators, depot teams, and field logistics.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {primaryMetrics.map((metric) => (
              <article
                key={metric.label}
                className={`group min-h-[20rem] rounded-[2rem] border p-7 shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${metric.accentClass}`}
              >
                <p className="text-5xl font-black tracking-[-0.06em] text-white sm:text-6xl">
                  {metric.value}
                </p>

                <p
                  className={`mt-4 text-xs font-black uppercase tracking-[0.2em] ${metric.labelClass}`}
                >
                  {metric.unit}
                </p>

                <h3 className="mt-9 text-2xl font-black tracking-[-0.04em] text-white">
                  {metric.label}
                </h3>

                <p className="mt-4 text-sm font-light leading-7 text-slate-500">
                  {metric.detail}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <article className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-7 shadow-2xl sm:p-8">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-400">
                Operational depots
              </p>

              <div className="mt-6 flex flex-wrap items-end gap-3">
                <p className="text-5xl font-black tracking-[-0.06em] text-white">
                  {formatWholeNumber(impact.operationalDepots)}
                </p>

                <p className="pb-1 text-xs font-black uppercase tracking-[0.18em] text-slate-600">
                  active locations
                </p>
              </div>

              <p className="mt-5 text-sm font-light leading-7 text-slate-500">
                Depots currently marked active inside ECOLOGIX’s operational
                database.
              </p>
            </article>

            <article className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-7 shadow-2xl sm:p-8">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-sky-400">
                Completed collection cycle
              </p>

              <div className="mt-6 flex flex-wrap items-end gap-3">
                <p className="text-5xl font-black tracking-[-0.06em] text-white">
                  {formatWholeNumber(impact.completedPickups)}
                </p>

                <p className="pb-1 text-xs font-black uppercase tracking-[0.18em] text-slate-600">
                  reconciled pickups
                </p>
              </div>

              <p className="mt-5 text-sm font-light leading-7 text-slate-500">
                Requests that have reached the final completed state in the
                ECOLOGIX workflow.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="wp-section border-y border-white/10 bg-slate-900/25">
        <div className="wp-page-container">
          <div className="max-w-5xl">
            <p className="wp-eyebrow">
              Four dimensions of impact
            </p>

            <h2 className="wp-section-title mt-7">
              Recovery creates more than
              <span className="block font-light text-slate-500">
                an environmental outcome.
              </span>
            </h2>
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-2">
            {impactPillars.map((pillar) => (
              <article
                key={pillar.number}
                className="group rounded-[2rem] border border-white/10 bg-white/[0.03] p-7 shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:border-white/20 sm:p-8"
              >
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl border font-mono text-xs font-black ${pillar.accentClass}`}
                >
                  {pillar.number}
                </div>

                <h3 className="mt-7 text-2xl font-black tracking-[-0.04em] text-white sm:text-3xl">
                  {pillar.title}
                </h3>

                <p className="mt-5 text-base font-light leading-8 text-slate-500">
                  {pillar.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="wp-section">
        <div className="wp-page-container">
          <div className="grid gap-12 xl:grid-cols-[0.82fr_1.18fr]">
            <div className="xl:sticky xl:top-36 xl:self-start">
              <p className="wp-eyebrow">
                How impact is measured
              </p>

              <h2 className="wp-section-title mt-7">
                One operating system.
                <span className="block font-light text-slate-500">
                  Multiple evidence layers.
                </span>
              </h2>

              <p className="wp-body-large mt-7">
                Each stage of the recovery process contributes a different
                piece of evidence. Together, those records create a more
                credible account of environmental and economic impact.
              </p>
            </div>

            <div className="space-y-5">
              {measurementLayers.map((layer, index) => (
                <article
                  key={layer.title}
                  className="group grid gap-5 rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:border-emerald-400/20 sm:grid-cols-[auto_1fr] sm:p-8"
                >
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-slate-950/55 font-mono text-xs font-black text-slate-600">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-400">
                      {layer.label}
                    </p>

                    <h3 className="mt-3 text-2xl font-black tracking-[-0.035em] text-white">
                      {layer.title}
                    </h3>

                    <p className="mt-4 text-sm font-light leading-7 text-slate-500 sm:text-base">
                      {layer.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="wp-section overflow-hidden border-y border-white/10 bg-slate-900/25">
        <div className="wp-page-container">
          <div className="grid gap-12 xl:grid-cols-[1fr_1fr] xl:items-center">
            <div>
              <p className="wp-eyebrow">
                Expanding the public dashboard
              </p>

              <h2 className="wp-section-title mt-7">
                The data becomes richer
                <span className="wp-gradient-text block">
                  as operations mature.
                </span>
              </h2>

              <p className="wp-body-large mt-7 max-w-3xl">
                ECOLOGIX will publish additional indicators only after the
                underlying operational records and verification workflows are
                ready.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link href="/partners" className="wp-primary-button">
                  Sponsor recovery
                  <span aria-hidden="true">→</span>
                </Link>

                <Link
                  href="/how-it-works"
                  className="wp-secondary-button"
                >
                  Understand the process
                </Link>
              </div>
            </div>

            <div className="relative">
              <div
                aria-hidden="true"
                className="wp-violet-glow left-1/2 top-1/2 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2"
              />

              <div className="wp-glass-panel-strong relative rounded-[2.5rem] p-6 sm:p-8">
                <p className="text-[0.62rem] font-black uppercase tracking-[0.22em] text-violet-400">
                  Planned public indicators
                </p>

                <div className="mt-7 space-y-3">
                  {futureIndicators.map((indicator, index) => (
                    <article
                      key={indicator}
                      className="flex items-center gap-4 rounded-2xl border border-white/10 bg-slate-950/55 p-4"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-violet-400/15 bg-violet-400/[0.07] font-mono text-[0.62rem] font-black text-violet-400">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <p className="text-sm font-bold text-slate-300">
                        {indicator}
                      </p>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="wp-section">
        <div className="wp-page-container">
          <div className="relative overflow-hidden rounded-[2.75rem] border border-white/10 bg-[linear-gradient(135deg,rgba(16,185,129,0.13),rgba(15,23,42,0.78)_48%,rgba(14,165,233,0.1))] px-7 py-14 shadow-2xl sm:px-12 sm:py-20 lg:px-16">
            <div
              aria-hidden="true"
              className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-emerald-400/15 blur-[100px]"
            />

            <div className="relative grid gap-10 xl:grid-cols-[1fr_auto] xl:items-end">
              <div className="max-w-5xl">
                <p className="wp-eyebrow">
                  Create measurable recovery
                </p>

                <h2 className="mt-7 text-4xl font-black tracking-[-0.06em] text-white sm:text-5xl lg:text-7xl">
                  Build an impact record
                  <span className="block font-light text-slate-400">
                    one verified collection at a time.
                  </span>
                </h2>

                <p className="wp-body-large mt-7 max-w-3xl">
                  Participate as a household, institution, municipality,
                  recovery partner, corporate sponsor, or development
                  organization.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row xl:flex-col">
                <Link href="/app/launch" className="wp-primary-button">
                  Go to App
                  <span aria-hidden="true">→</span>
                </Link>

                <Link href="/partners" className="wp-secondary-button">
                  Discuss a partnership
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      <EditablePageSections pageKey="impact" />
    </main>
  );
}
