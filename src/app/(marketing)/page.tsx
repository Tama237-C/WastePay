import { EditablePageSections } from "@/components/marketing/editable-page-sections";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "ECOLOGIX | Cameroon’s Circular Plastic Economy",
  description:
    "ECOLOGIX connects households, collectors, drivers, recovery depots, brands, and Mobile Money infrastructure to turn plastic waste into measurable economic value.",
  keywords: [
    "ECOLOGIX",
    "plastic recycling Cameroon",
    "home waste collection",
    "plastic buyback",
    "circular economy Africa",
    "Mobile Money recycling",
    "plastic recovery Cameroon",
  ],
  openGraph: {
    title: "ECOLOGIX | Cameroon’s Circular Plastic Economy",
    description:
      "Schedule plastic collection, support transparent recovery, and help build Cameroon’s circular plastic economy.",
    type: "website",
    locale: "en_CM",
    siteName: "ECOLOGIX",
  },
  twitter: {
    card: "summary_large_image",
    title: "ECOLOGIX | Cameroon’s Circular Plastic Economy",
    description:
      "Technology, logistics, and financial inclusion for transparent plastic recovery.",
  },
};

const impactMetrics = [
  {
    value: "01",
    unit: "live depot",
    label: "Recovery infrastructure",
    detail:
      "ECOLOGIX’s first recovery hub is connected to the operational network.",
  },
  {
    value: "100%",
    unit: "traceable",
    label: "Digital recovery records",
    detail:
      "Collection requests, drivers, depots, weights, and future payouts remain connected.",
  },
  {
    value: "< 60",
    unit: "seconds",
    label: "Collection booking",
    detail:
      "Residents can request plastic collection through the ECOLOGIX app.",
  },
  {
    value: "24/7",
    unit: "data visibility",
    label: "Operational intelligence",
    detail:
      "ECOLOGIX turns every collection event into structured circular-economy data.",
  },
];

const recoverySteps = [
  {
    number: "01",
    title: "Request a collection",
    description:
      "A household, school, office, or hotel signs in to the ECOLOGIX app and submits its collection request and pickup location.",
    accent: "emerald",
  },
  {
    number: "02",
    title: "ECOLOGIX dispatches",
    description:
      "Operations reviews the request, assigns a recovery depot, and dispatches an authorized pickup driver.",
    accent: "sky",
  },
  {
    number: "03",
    title: "Plastic is verified",
    description:
      "Depot agents weigh the delivery, identify materials, scan products, and create a transparent intake record.",
    accent: "violet",
  },
  {
    number: "04",
    title: "Value returns locally",
    description:
      "Verified plastic is priced, reconciled, and prepared for secure Mobile Money settlement and onward recycling.",
    accent: "amber",
  },
];

const programs = [
  {
    eyebrow: "For households",
    title: "Home plastic collection",
    description:
      "Open the ECOLOGIX app to request pickup for sorted plastic waste from your home or residential community.",
    href: "/app/launch",
    callToAction: "Open ECOLOGIX app",
    accentClass:
      "border-emerald-400/15 bg-emerald-400/[0.055] hover:border-emerald-400/30 hover:shadow-emerald-500/[0.08]",
    labelClass: "text-emerald-400",
  },
  {
    eyebrow: "For organizations",
    title: "Business recovery programs",
    description:
      "Build measurable waste-diversion programs for offices, hotels, campuses, retailers, and industrial facilities.",
    href: "/programs/business-collection",
    callToAction: "Explore business recovery",
    accentClass:
      "border-sky-400/15 bg-sky-400/[0.055] hover:border-sky-400/30 hover:shadow-sky-500/[0.08]",
    labelClass: "text-sky-400",
  },
  {
    eyebrow: "For producers",
    title: "Brand recovery partnerships",
    description:
      "Support transparent post-consumer plastic recovery with product-level data and measurable environmental reporting.",
    href: "/partners",
    callToAction: "Partner with ECOLOGIX",
    accentClass:
      "border-violet-400/15 bg-violet-400/[0.055] hover:border-violet-400/30 hover:shadow-violet-500/[0.08]",
    labelClass: "text-violet-400",
  },
];

const intelligenceFeatures = [
  {
    number: "01",
    title: "Barcode intelligence",
    description:
      "Connect recovered packaging to products, brands, manufacturers, and material categories.",
  },
  {
    number: "02",
    title: "Geographic traceability",
    description:
      "Use PostGIS-enabled location records to understand where recovery demand and material flows originate.",
  },
  {
    number: "03",
    title: "Weight verification",
    description:
      "Compare estimated collection volumes with verified depot scale measurements and transaction records.",
  },
  {
    number: "04",
    title: "Financial accountability",
    description:
      "Connect pricing, payout status, telecom references, depot float, and operational audit history.",
  },
];

const partnershipTypes = [
  "Households",
  "Schools",
  "Hotels",
  "Businesses",
  "Municipalities",
  "Consumer brands",
  "Development partners",
  "Recovery depots",
];

export default async function HomePage() {
  const { data: websiteContent } = await createAdminClient()
    .from("website_content")
    .select("homepage_hero_title, homepage_hero_description, homepage_footer_title, homepage_footer_text, homepage_hero_image_path, homepage_footer_image_path")
    .eq("id", true)
    .maybeSingle();
  const footerImage = websiteContent?.homepage_footer_image_path
    ? createAdminClient().storage.from("website-images").getPublicUrl(websiteContent.homepage_footer_image_path).data.publicUrl
    : null;
  const heroImage = websiteContent?.homepage_hero_image_path
    ? createAdminClient().storage.from("website-images").getPublicUrl(websiteContent.homepage_hero_image_path).data.publicUrl
    : "/images/ecologix-recovery-depot.jpg";
  return (
    <main>
      <section className="relative overflow-hidden pb-20 pt-28 sm:pb-28 sm:pt-32 lg:min-h-[calc(100vh-7rem)] lg:pb-24 lg:pt-36">
        <div
          aria-hidden="true"
          className="wp-emerald-glow -left-56 top-0 h-[34rem] w-[34rem]"
        />

        <div
          aria-hidden="true"
          className="wp-sky-glow -right-52 top-28 h-[38rem] w-[38rem]"
        />

        <div className="wp-page-container">
          <div className="grid items-center gap-14 lg:grid-cols-[1.08fr_0.92fr] lg:gap-12 xl:gap-16">
            <div className="relative z-10 max-w-5xl">
              <div className="wp-eyebrow wp-fade-up">
                Built for circular recovery
              </div>

              <h1 className="wp-display-title wp-fade-up-delay-1 mt-8">
                {websiteContent?.homepage_hero_title ?? "Plastic waste becomes value."}
              </h1>

              <p className="wp-body-large wp-fade-up-delay-2 mt-8 max-w-3xl">
                {websiteContent?.homepage_hero_description ?? "ECOLOGIX is building Cameroon’s digital circular-plastic infrastructure—connecting residents, collectors, drivers, recovery depots, brands, data, and secure payments in one transparent operating network."}
              </p>

              <div className="wp-fade-up-delay-3 mt-9 flex flex-col gap-3 sm:flex-row">
                <Link href="/app/launch" className="wp-primary-button">
                  Open ECOLOGIX app
                  <span aria-hidden="true">→</span>
                </Link>

                <Link href="/how-it-works" className="wp-secondary-button">
                  See how ECOLOGIX works
                </Link>
              </div>

              <div className="mt-10 flex flex-wrap gap-3">
                {[
                  "Home collection",
                  "Plastic buyback",
                  "Mobile Money ready",
                  "PostGIS logistics",
                ].map((feature) => (
                  <span
                    key={feature}
                    className="rounded-full border border-white/10 bg-white/[0.035] px-3.5 py-2 text-[0.64rem] font-black uppercase tracking-[0.16em] text-slate-500 backdrop-blur-md"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-2xl lg:mx-0">
              <div
                aria-hidden="true"
                className="absolute inset-10 rounded-full bg-emerald-400/10 blur-[100px]"
              />

              <div className="wp-glass-panel-strong relative overflow-hidden rounded-[2.5rem] p-5 sm:p-7">
                <Image src={heroImage} alt="Workers sorting and preparing recyclable plastic at a recovery depot" width={1280} height={543} className="mb-5 h-56 w-full rounded-3xl object-cover" />
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:48px_48px]" />

                <div className="relative">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-[0.62rem] font-black uppercase tracking-[0.22em] text-emerald-400">
                        ECOLOGIX recovery network
                      </p>

                      <p className="mt-2 text-sm text-slate-500">
                        Live operational architecture
                      </p>
                    </div>

                    <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.08] px-3 py-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(52,211,153,0.85)]" />

                      <span className="text-[0.58rem] font-black uppercase tracking-[0.16em] text-emerald-300">
                        Connected
                      </span>
                    </span>
                  </div>

                  <div className="mt-7 space-y-3">
                    {[
                      {
                        number: "01",
                        label: "Collection request received",
                        detail: "Resident · Secure GPS",
                        status: "Verified",
                      },
                      {
                        number: "02",
                        label: "Pickup assigned",
                        detail: "Driver · Depot network",
                        status: "Dispatched",
                      },
                      {
                        number: "03",
                        label: "Material delivered",
                        detail: "Weight · Barcode · Photo",
                        status: "Traceable",
                      },
                      {
                        number: "04",
                        label: "Circular value created",
                        detail: "Pricing · Payment · Impact",
                        status: "Reconciled",
                      },
                    ].map((item) => (
                      <article
                        key={item.number}
                        className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-slate-950/55 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-400/20 hover:bg-slate-950/75 sm:p-5"
                      >
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] font-mono text-xs font-black text-slate-600">
                          {item.number}
                        </span>

                        <div className="min-w-0 flex-1">
                          <p className="font-black text-white">
                            {item.label}
                          </p>

                          <p className="mt-1 text-xs text-slate-600">
                            {item.detail}
                          </p>
                        </div>

                        <span className="hidden rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[0.56rem] font-black uppercase tracking-[0.14em] text-slate-500 sm:inline-flex">
                          {item.status}
                        </span>
                      </article>
                    ))}
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <article className="rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.06] p-5">
                      <p className="text-[0.6rem] font-black uppercase tracking-[0.18em] text-emerald-400/70">
                        Infrastructure
                      </p>

                      <p className="mt-3 text-xl font-black text-white">
                        Auth + database online
                      </p>
                    </article>

                    <article className="rounded-2xl border border-amber-400/15 bg-amber-400/[0.06] p-5">
                      <p className="text-[0.6rem] font-black uppercase tracking-[0.18em] text-amber-400/70">
                        Expansion state
                      </p>

                      <p className="mt-3 text-xl font-black text-white">
                        Cameroon pilot network
                      </p>
                    </article>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-7 -left-3 hidden rounded-2xl border border-white/10 bg-slate-950/85 p-4 shadow-2xl backdrop-blur-xl sm:block">
                <p className="text-[0.56rem] font-black uppercase tracking-[0.18em] text-slate-600">
                  Recovery principle
                </p>

                <p className="mt-2 text-sm font-black text-white">
                  Every kilogram has a history.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.018]">
        <div className="wp-page-container py-8">
          <p className="text-center text-[0.62rem] font-black uppercase tracking-[0.24em] text-slate-600">
            One recovery network for
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
            {partnershipTypes.map((type) => (
              <div
                key={type}
                className="flex min-h-16 items-center justify-center rounded-2xl border border-white/[0.07] bg-white/[0.025] px-3 text-center text-[0.65rem] font-black uppercase tracking-[0.12em] text-slate-500"
              >
                {type}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="wp-section">
        <div className="wp-page-container">
          <div className="max-w-4xl">
            <p className="wp-eyebrow">Measurable from day one</p>

            <h2 className="wp-section-title mt-7">
              Recovery infrastructure,
              <span className="block font-light text-slate-500">
                designed as a digital public utility.
              </span>
            </h2>

            <p className="wp-body-large mt-7 max-w-3xl">
              ECOLOGIX does more than move plastic. It connects each operational
              decision to structured data so communities, brands, and recovery
              partners can understand where material came from and what happened
              next.
            </p>
          </div>

          <Image
            src="/images/ecologix-community-impact.jpg"
            alt="Community members and ECOLOGIX workers collecting plastic from a coastal shoreline"
            width={1280}
            height={543}
            className="mt-12 h-56 w-full rounded-[2rem] border border-white/10 object-cover sm:h-72"
          />

          <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {impactMetrics.map((metric) => (
              <article
                key={metric.label}
                className="wp-premium-card min-h-[18rem] p-6 sm:p-7"
              >
                <p className="wp-metric-number">{metric.value}</p>

                <p className="mt-3 text-xs font-black uppercase tracking-[0.2em] text-emerald-400">
                  {metric.unit}
                </p>

                <h3 className="wp-card-title mt-8">{metric.label}</h3>

                <p className="mt-4 text-sm font-light leading-7 text-slate-500">
                  {metric.detail}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="wp-section border-y border-white/10 bg-slate-900/25">
        <div className="wp-page-container">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div className="lg:sticky lg:top-36">
              <p className="wp-eyebrow">How ECOLOGIX works</p>

              <h2 className="wp-section-title mt-7">
                From a pickup request
                <span className="block font-light text-slate-500">
                  to verified circular value.
                </span>
              </h2>

              <p className="wp-body-large mt-7">
                Every stage is designed to reduce operational ambiguity,
                strengthen accountability, and make plastic recovery easier to
                coordinate at scale.
              </p>

              <Link
                href="/how-it-works"
                className="wp-secondary-button mt-8"
              >
                Explore the full process
                <span aria-hidden="true">→</span>
              </Link>
            </div>

            <div className="space-y-5">
              <Image
                src="/images/ecologix-pickup-handoff.jpg"
                alt="A community member hands sorted recyclable plastic to an ECOLOGIX recovery worker"
                width={1280}
                height={543}
                className="h-52 w-full rounded-[2rem] border border-white/10 object-cover sm:h-64"
              />

              {recoverySteps.map((step) => {
                const accentClasses = {
                  emerald:
                    "border-emerald-400/15 bg-emerald-400/[0.045] text-emerald-400",
                  sky: "border-sky-400/15 bg-sky-400/[0.045] text-sky-400",
                  violet:
                    "border-violet-400/15 bg-violet-400/[0.045] text-violet-400",
                  amber:
                    "border-amber-400/15 bg-amber-400/[0.045] text-amber-400",
                };

                return (
                  <article
                    key={step.number}
                    className="group grid gap-5 rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:border-white/20 sm:grid-cols-[auto_1fr] sm:p-8"
                  >
                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-2xl border font-mono text-xs font-black ${accentClasses[step.accent as keyof typeof accentClasses]}`}
                    >
                      {step.number}
                    </div>

                    <div>
                      <h3 className="text-2xl font-black tracking-[-0.035em] text-white">
                        {step.title}
                      </h3>

                      <p className="mt-4 max-w-2xl text-sm font-light leading-7 text-slate-500 sm:text-base">
                        {step.description}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="wp-section">
        <div className="wp-page-container">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-4xl">
              <p className="wp-eyebrow">Programs built for participation</p>

              <h2 className="wp-section-title mt-7">
                One platform.
                <span className="block font-light text-slate-500">
                  Multiple ways to recover plastic.
                </span>
              </h2>
            </div>

            <Link href="/programs" className="wp-ghost-button">
              View all ECOLOGIX programs
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="mt-12 grid gap-5 xl:grid-cols-3">
            {programs.map((program) => (
              <article
                key={program.title}
                className={`group flex min-h-[27rem] flex-col rounded-[2rem] border p-7 shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl sm:p-8 ${program.accentClass}`}
              >
                <p
                  className={`text-xs font-black uppercase tracking-[0.23em] ${program.labelClass}`}
                >
                  {program.eyebrow}
                </p>

                <h3 className="mt-7 text-3xl font-black tracking-[-0.045em] text-white">
                  {program.title}
                </h3>

                <p className="mt-5 text-base font-light leading-8 text-slate-400">
                  {program.description}
                </p>

                <div className="mt-auto pt-10">
                  <Link
                    href={program.href}
                    className="inline-flex items-center gap-3 text-xs font-black uppercase tracking-[0.17em] text-white"
                  >
                    {program.callToAction}

                    <span
                      aria-hidden="true"
                      className="transition-transform duration-300 group-hover:translate-x-2"
                    >
                      →
                    </span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="wp-section overflow-hidden border-y border-white/10 bg-slate-900/25">
        <div className="wp-page-container">
          <div className="grid gap-12 xl:grid-cols-[1.02fr_0.98fr] xl:items-center">
            <div>
              <p className="wp-eyebrow">Plastic intelligence infrastructure</p>

              <h2 className="wp-section-title mt-7">
                Know more than
                <span className="wp-gradient-text block">
                  how many kilograms moved.
                </span>
              </h2>

              <p className="wp-body-large mt-7 max-w-3xl">
                ECOLOGIX is designed to understand the product, material,
                location, operational journey, and financial history behind
                recovered plastic.
              </p>

              <div className="mt-9 grid gap-4 sm:grid-cols-2">
                {intelligenceFeatures.map((feature) => (
                  <article
                    key={feature.number}
                    className="rounded-3xl border border-white/10 bg-white/[0.03] p-5"
                  >
                    <p className="font-mono text-xs font-black text-emerald-400">
                      {feature.number}
                    </p>

                    <h3 className="mt-4 text-lg font-black text-white">
                      {feature.title}
                    </h3>

                    <p className="mt-3 text-sm font-light leading-6 text-slate-500">
                      {feature.description}
                    </p>
                  </article>
                ))}
              </div>
            </div>

            <div className="relative">
              <div
                aria-hidden="true"
                className="wp-violet-glow left-1/2 top-1/2 h-[26rem] w-[26rem] -translate-x-1/2 -translate-y-1/2"
              />

              <div className="wp-glass-panel-strong relative overflow-hidden rounded-[2.5rem] p-6 sm:p-8">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[0.62rem] font-black uppercase tracking-[0.22em] text-violet-400">
                      Material intelligence record
                    </p>

                    <p className="mt-2 text-sm text-slate-500">
                      Example product-level recovery data
                    </p>
                  </div>

                  <span className="rounded-full border border-emerald-400/20 bg-emerald-400/[0.08] px-3 py-2 text-[0.58rem] font-black uppercase tracking-[0.14em] text-emerald-300">
                    Verified
                  </span>
                </div>

                <div className="mt-8 rounded-3xl border border-white/10 bg-slate-950/60 p-5 sm:p-6">
                  <div className="flex items-start gap-5">
                    <div className="flex h-20 w-16 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-[0.58rem] font-black uppercase tracking-[0.14em] text-slate-600">
                      PET
                    </div>

                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-400">
                        Barcode identified
                      </p>

                      <h3 className="mt-3 text-2xl font-black text-white">
                        Clear beverage bottle
                      </h3>

                      <p className="mt-2 text-sm text-slate-500">
                        PET · High recoverability · Product-linked
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-3">
                    {[
                      ["Material", "PET Clear"],
                      ["Weight", "0.025 KG"],
                      ["Source", "Residential"],
                      ["Depot", "DLA-AKWA-01"],
                    ].map(([label, value]) => (
                      <div
                        key={label}
                        className="rounded-2xl border border-white/10 bg-white/[0.025] p-4"
                      >
                        <p className="text-[0.56rem] font-black uppercase tracking-[0.15em] text-slate-600">
                          {label}
                        </p>

                        <p className="mt-2 text-sm font-black text-white">
                          {value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  {[
                    ["Brand accountability", "Product footprint"],
                    ["Operational audit", "Full journey"],
                    ["Pricing traceability", "Historical rate"],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="rounded-2xl border border-white/10 bg-white/[0.025] p-4"
                    >
                      <p className="text-[0.55rem] font-black uppercase tracking-[0.14em] text-slate-600">
                        {label}
                      </p>

                      <p className="mt-2 text-xs font-black text-slate-300">
                        {value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="wp-section">
        <div className="wp-page-container">
          <div className="relative overflow-hidden rounded-[2.75rem] border border-white/10 bg-[linear-gradient(135deg,rgba(16,185,129,0.13),rgba(15,23,42,0.72)_45%,rgba(14,165,233,0.1))] px-7 py-14 shadow-2xl sm:px-12 sm:py-20 lg:px-16">
            <div
              aria-hidden="true"
              className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-emerald-400/15 blur-[100px]"
            />

            <div
              aria-hidden="true"
              className="absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-sky-400/10 blur-[110px]"
            />

            <div className="relative grid gap-10 xl:grid-cols-[1fr_auto] xl:items-end">
              <div className="max-w-5xl">
                <p className="wp-eyebrow">Begin with one collection</p>

                <h2 className="mt-7 text-4xl font-black tracking-[-0.06em] text-white sm:text-5xl lg:text-7xl">
                  Your plastic has value.
                  <span className="block font-light text-slate-400">
                    Put it back into circulation.
                  </span>
                </h2>

                <p className="wp-body-large mt-7 max-w-3xl">
                  Open the ECOLOGIX app to request a collection, or join the infrastructure
                  helping Cameroon recover plastic transparently, locally, and
                  at scale.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row xl:flex-col">
                <Link href="/app/launch" className="wp-primary-button">
                  Go to App
                  <span aria-hidden="true">→</span>
                </Link>

                <Link href="/partners" className="wp-secondary-button">
                  Partner with ECOLOGIX
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto mb-20 max-w-6xl rounded-[2rem] border border-emerald-400/20 bg-emerald-400/[0.06] p-8 sm:p-12">
        {footerImage ? <Image src={footerImage} alt="" width={1200} height={500} className="mb-8 h-64 w-full rounded-3xl object-cover" /> : null}
        <p className="text-xs font-black uppercase tracking-[0.3em] text-emerald-400">ECOLOGIX impact</p>
        <h2 className="mt-4 text-3xl font-black text-white sm:text-4xl">{websiteContent?.homepage_footer_title ?? "Build a cleaner circular economy."}</h2>
        <p className="mt-4 max-w-2xl text-base leading-8 text-slate-400">{websiteContent?.homepage_footer_text ?? "Every verified collection helps turn discarded plastic into measurable economic value."}</p>
      </section>
      <EditablePageSections pageKey="home" />
    </main>
  );
}
