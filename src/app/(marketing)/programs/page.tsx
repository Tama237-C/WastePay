import type { Metadata } from "next";
import Link from "next/link";
import { EditablePageSections } from "@/components/marketing/editable-page-sections";

export const metadata: Metadata = {
  title: "ECOLOGIX Programs | Plastic Recovery Solutions",
  description:
    "Explore ECOLOGIX plastic recovery programs for households, businesses, schools, municipalities, brands, and recovery partners in Cameroon.",
  keywords: [
    "ECOLOGIX programs",
    "home plastic collection Cameroon",
    "business plastic recycling",
    "school recycling program Cameroon",
    "municipal waste recovery",
    "corporate plastic recovery",
    "plastic buyback program",
  ],
  openGraph: {
    title: "ECOLOGIX Plastic Recovery Programs",
    description:
      "Flexible plastic recovery programs for households, institutions, municipalities, brands, and recovery partners.",
    type: "website",
    locale: "en_CM",
    siteName: "ECOLOGIX",
  },
  twitter: {
    card: "summary_large_image",
    title: "ECOLOGIX Plastic Recovery Programs",
    description:
      "Join Cameroon’s circular plastic economy through an ECOLOGIX recovery program.",
  },
};

const programs = [
  {
    number: "01",
    audience: "Households and residential communities",
    title: "Home plastic collection",
    summary:
      "A convenient pickup service for homes and residential communities with sorted plastic ready for recovery.",
    features: [
      "Mobile-friendly booking",
      "Secure GPS location capture",
      "Request review and depot routing",
      "Authorized ECOLOGIX pickup driver",
      "Collection-status tracking",
      "Verified depot intake",
    ],
    href: "/contact",
    callToAction: "Book home collection",
    accentClass:
      "border-emerald-400/15 bg-emerald-400/[0.055] hover:border-emerald-400/30 hover:shadow-emerald-500/[0.08]",
    badgeClass:
      "border-emerald-400/20 bg-emerald-400/[0.08] text-emerald-400",
  },
  {
    number: "02",
    audience: "Offices, hotels, retailers, and companies",
    title: "Business plastic recovery",
    summary:
      "Structured collection for organizations that generate recurring plastic waste and require measurable diversion records.",
    features: [
      "Scheduled recurring pickups",
      "Multi-location collection support",
      "Material and weight records",
      "Recovery performance summaries",
      "Corporate sustainability reporting",
      "Custom operational coordination",
    ],
    href: "/programs/business-collection",
    callToAction: "Explore business recovery",
    accentClass:
      "border-sky-400/15 bg-sky-400/[0.055] hover:border-sky-400/30 hover:shadow-sky-500/[0.08]",
    badgeClass:
      "border-sky-400/20 bg-sky-400/[0.08] text-sky-400",
  },
  {
    number: "03",
    audience: "Schools, universities, and youth programs",
    title: "Education recovery program",
    summary:
      "A practical circular-economy program combining collection infrastructure, student participation, and measurable plastic recovery.",
    features: [
      "School collection points",
      "Student recovery campaigns",
      "Scheduled institutional pickups",
      "Material-recovery reporting",
      "Environmental education support",
      "Community participation pathways",
    ],
    href: "/contact",
    callToAction: "Discuss a school program",
    accentClass:
      "border-violet-400/15 bg-violet-400/[0.055] hover:border-violet-400/30 hover:shadow-violet-500/[0.08]",
    badgeClass:
      "border-violet-400/20 bg-violet-400/[0.08] text-violet-400",
  },
  {
    number: "04",
    audience: "Cities, councils, and public institutions",
    title: "Municipal recovery infrastructure",
    summary:
      "Digital and operational infrastructure for coordinating plastic collection demand, local depots, field teams, and public reporting.",
    features: [
      "Geographic recovery visibility",
      "Collection-demand intelligence",
      "Depot and zone coordination",
      "Authorized field-team workflows",
      "Public impact indicators",
      "Program and contract reporting",
    ],
    href: "/partners",
    callToAction: "Explore municipal cooperation",
    accentClass:
      "border-amber-400/15 bg-amber-400/[0.055] hover:border-amber-400/30 hover:shadow-amber-500/[0.08]",
    badgeClass:
      "border-amber-400/20 bg-amber-400/[0.08] text-amber-400",
  },
  {
    number: "05",
    audience: "Consumer brands and producers",
    title: "Brand-sponsored plastic recovery",
    summary:
      "Transparent recovery programs that connect post-consumer packaging to products, brands, materials, locations, and verified outcomes.",
    features: [
      "Product and barcode intelligence",
      "Brand-footprint measurement",
      "Sponsored recovery campaigns",
      "Material-category reporting",
      "Geographic recovery insight",
      "Corporate impact dashboards",
    ],
    href: "/partners",
    callToAction: "Sponsor plastic recovery",
    accentClass:
      "border-rose-400/15 bg-rose-400/[0.045] hover:border-rose-400/30 hover:shadow-rose-500/[0.08]",
    badgeClass:
      "border-rose-400/20 bg-rose-400/[0.08] text-rose-300",
  },
  {
    number: "06",
    audience: "Collectors, aggregators, and recovery centres",
    title: "Plastic buyback network",
    summary:
      "Operational tools for receiving, identifying, weighing, pricing, and reconciling plastic material at authorized recovery points.",
    features: [
      "Collector check-in",
      "Material classification",
      "Verified scale weight",
      "Barcode and photo evidence",
      "Dynamic pricing rules",
      "Mobile Money payout preparation",
    ],
    href: "/programs/plastic-buyback",
    callToAction: "Explore the buyback network",
    accentClass:
      "border-cyan-400/15 bg-cyan-400/[0.045] hover:border-cyan-400/30 hover:shadow-cyan-500/[0.08]",
    badgeClass:
      "border-cyan-400/20 bg-cyan-400/[0.08] text-cyan-300",
  },
];

const participationSteps = [
  {
    number: "01",
    title: "Identify the right program",
    description:
      "Choose the ECOLOGIX service that matches your household, institution, municipality, brand, or recovery operation.",
  },
  {
    number: "02",
    title: "Define the recovery need",
    description:
      "Tell ECOLOGIX about the location, material volume, service frequency, reporting requirements, and operational constraints.",
  },
  {
    number: "03",
    title: "Configure the workflow",
    description:
      "ECOLOGIX connects the program to collection requests, responsible depots, field teams, verification steps, and reporting.",
  },
  {
    number: "04",
    title: "Measure the results",
    description:
      "Verified collection and intake records produce accountable environmental and operational metrics.",
  },
];

const programCapabilities = [
  {
    title: "Flexible collection",
    description:
      "Support one-time pickups, scheduled routes, recurring institutional collection, and recovery campaigns.",
  },
  {
    title: "Role-based operations",
    description:
      "Authorized administrators, drivers, depot agents, and managers complete specific protected actions.",
  },
  {
    title: "Material traceability",
    description:
      "Connect estimated quantities, verified weights, material categories, product records, and supporting evidence.",
  },
  {
    title: "Geographic intelligence",
    description:
      "Use secure location data and PostGIS-enabled depot records to improve routing and service coverage.",
  },
  {
    title: "Financial accountability",
    description:
      "Prepare verified material for transparent pricing, approval, Mobile Money settlement, and reconciliation.",
  },
  {
    title: "Impact reporting",
    description:
      "Turn operational records into environmental, economic, geographic, and participation indicators.",
  },
];

const programQuestions = [
  {
    question: "Can ECOLOGIX support recurring collections?",
    answer:
      "Yes. Business, school, hotel, municipal, and institutional programs can be designed around recurring collection schedules.",
  },
  {
    question: "Can one organization register several locations?",
    answer:
      "The planned business workflow supports multiple operating locations, collection points, and recovery reports under one program.",
  },
  {
    question: "Does ECOLOGIX accept every type of waste?",
    answer:
      "ECOLOGIX’s current operating focus is recoverable plastic, beginning with PET, HDPE, and PP material streams.",
  },
  {
    question: "How will program impact be verified?",
    answer:
      "ECOLOGIX connects requests, assigned staff, depots, verified weight, material records, photographs, and transaction history.",
  },
];

export default function ProgramsPage() {
  return (
    <main>
      <section className="relative overflow-hidden pb-20 pt-12 sm:pb-28 sm:pt-20">
        <div
          aria-hidden="true"
          className="wp-emerald-glow -left-52 top-0 h-[36rem] w-[36rem]"
        />

        <div
          aria-hidden="true"
          className="wp-sky-glow -right-48 top-24 h-[40rem] w-[40rem]"
        />

        <div className="wp-page-container">
          <div className="grid gap-14 xl:grid-cols-[1.03fr_0.97fr] xl:items-center">
            <div className="relative z-10 max-w-5xl">
              <p className="wp-eyebrow wp-fade-up">
                ECOLOGIX programs
              </p>

              <h1 className="wp-display-title wp-fade-up-delay-1 mt-8">
                Recovery programs
                <span className="wp-gradient-text block">
                  built for participation.
                </span>
              </h1>

              <p className="wp-body-large wp-fade-up-delay-2 mt-8 max-w-3xl">
                ECOLOGIX provides different entry points into the circular
                plastic economy for households, businesses, schools, cities,
                brands, collectors, and recovery partners.
              </p>

              <div className="wp-fade-up-delay-3 mt-9 flex flex-col gap-3 sm:flex-row">
                <Link href="/contact" className="wp-primary-button">
                  Request a collection
                  <span aria-hidden="true">→</span>
                </Link>

                <Link href="/partners" className="wp-secondary-button">
                  Discuss a partnership
                </Link>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-2xl xl:mx-0">
              <div
                aria-hidden="true"
                className="absolute inset-10 rounded-full bg-emerald-400/10 blur-[110px]"
              />

              <div className="wp-glass-panel-strong relative overflow-hidden rounded-[2.5rem] p-6 sm:p-8">
                <div className="pointer-events-none absolute inset-0 wp-grid-background opacity-55" />

                <div className="relative">
                  <div className="flex items-center justify-between gap-5">
                    <div>
                      <p className="text-[0.62rem] font-black uppercase tracking-[0.23em] text-emerald-400">
                        Participation network
                      </p>

                      <p className="mt-2 text-sm text-slate-500">
                        One platform, multiple recovery models
                      </p>
                    </div>

                    <span className="rounded-full border border-emerald-400/20 bg-emerald-400/[0.08] px-3 py-2 text-[0.58rem] font-black uppercase tracking-[0.16em] text-emerald-300">
                      06 programs
                    </span>
                  </div>

                  <div className="mt-8 grid gap-3 sm:grid-cols-2">
                    {[
                      ["01", "Households", "On-demand"],
                      ["02", "Businesses", "Recurring"],
                      ["03", "Schools", "Community"],
                      ["04", "Municipalities", "Infrastructure"],
                      ["05", "Brands", "Sponsored"],
                      ["06", "Depots", "Buyback"],
                    ].map(([number, title, label]) => (
                      <article
                        key={number}
                        className="rounded-2xl border border-white/10 bg-slate-950/55 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-400/20"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span className="font-mono text-[0.62rem] font-black text-emerald-400">
                            {number}
                          </span>

                          <span className="text-[0.52rem] font-black uppercase tracking-[0.13em] text-slate-700">
                            {label}
                          </span>
                        </div>

                        <p className="mt-4 font-black text-white">
                          {title}
                        </p>
                      </article>
                    ))}
                  </div>

                  <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.025] p-5">
                    <p className="text-[0.58rem] font-black uppercase tracking-[0.18em] text-slate-600">
                      Shared infrastructure
                    </p>

                    <p className="mt-3 text-sm font-black leading-6 text-white">
                      Collection · Logistics · Verification · Data · Payments
                      · Impact
                    </p>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-6 -right-3 hidden rounded-2xl border border-white/10 bg-slate-950/90 p-5 shadow-2xl backdrop-blur-xl sm:block">
                <p className="text-[0.56rem] font-black uppercase tracking-[0.18em] text-slate-600">
                  Program principle
                </p>

                <p className="mt-2 text-sm font-black text-white">
                  Different participants. One traceable recovery system.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.018]">
        <div className="wp-page-container py-10">
          <div className="grid gap-5 sm:grid-cols-3">
            <article className="rounded-3xl border border-white/[0.07] bg-white/[0.025] p-6">
              <p className="text-[0.62rem] font-black uppercase tracking-[0.2em] text-emerald-400">
                Individual access
              </p>

              <p className="mt-3 text-xl font-black text-white">
                Household collection
              </p>
            </article>

            <article className="rounded-3xl border border-white/[0.07] bg-white/[0.025] p-6">
              <p className="text-[0.62rem] font-black uppercase tracking-[0.2em] text-sky-400">
                Institutional access
              </p>

              <p className="mt-3 text-xl font-black text-white">
                Recurring recovery
              </p>
            </article>

            <article className="rounded-3xl border border-white/[0.07] bg-white/[0.025] p-6">
              <p className="text-[0.62rem] font-black uppercase tracking-[0.2em] text-violet-400">
                Ecosystem access
              </p>

              <p className="mt-3 text-xl font-black text-white">
                Sponsored infrastructure
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="wp-section">
        <div className="wp-page-container">
          <div className="max-w-5xl">
            <p className="wp-eyebrow">
              Choose your recovery pathway
            </p>

            <h2 className="wp-section-title mt-7">
              Find the program
              <span className="block font-light text-slate-500">
                that matches your role.
              </span>
            </h2>

            <p className="wp-body-large mt-7 max-w-4xl">
              Each ECOLOGIX program uses the same accountable operational
              backbone while adapting collection, reporting, and participation
              to a specific audience.
            </p>
          </div>

          <div className="mt-14 grid gap-6 xl:grid-cols-2">
            {programs.map((program) => (
              <article
                key={program.number}
                className={`group flex min-h-[38rem] flex-col rounded-[2.25rem] border p-7 shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl sm:p-9 ${program.accentClass}`}
              >
                <div className="flex items-start justify-between gap-5">
                  <span
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl border font-mono text-xs font-black ${program.badgeClass}`}
                  >
                    {program.number}
                  </span>

                  <p className="max-w-[14rem] text-right text-[0.62rem] font-black uppercase leading-5 tracking-[0.18em] text-slate-600">
                    {program.audience}
                  </p>
                </div>

                <h3 className="mt-8 text-3xl font-black tracking-[-0.05em] text-white sm:text-4xl">
                  {program.title}
                </h3>

                <p className="mt-5 text-base font-light leading-8 text-slate-400">
                  {program.summary}
                </p>

                <div className="mt-8 rounded-3xl border border-white/10 bg-slate-950/45 p-5">
                  <p className="text-[0.6rem] font-black uppercase tracking-[0.2em] text-slate-600">
                    Program capabilities
                  </p>

                  <ul className="mt-5 space-y-3">
                    {program.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-3 text-sm leading-6 text-slate-400"
                      >
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />

                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-auto pt-8">
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

      <section className="wp-section border-y border-white/10 bg-slate-900/25">
        <div className="wp-page-container">
          <div className="grid gap-12 xl:grid-cols-[0.82fr_1.18fr]">
            <div className="xl:sticky xl:top-36 xl:self-start">
              <p className="wp-eyebrow">
                Starting a program
              </p>

              <h2 className="wp-section-title mt-7">
                From recovery need
                <span className="block font-light text-slate-500">
                  to measurable operation.
                </span>
              </h2>

              <p className="wp-body-large mt-7">
                ECOLOGIX first understands the participant, material stream,
                locations, collection needs, and reporting expectations before
                configuring the operational workflow.
              </p>
            </div>

            <div className="space-y-5">
              {participationSteps.map((step) => (
                <article
                  key={step.number}
                  className="group grid gap-5 rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:border-emerald-400/20 sm:grid-cols-[auto_1fr] sm:p-8"
                >
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.07] font-mono text-xs font-black text-emerald-400">
                    {step.number}
                  </span>

                  <div>
                    <h3 className="text-2xl font-black tracking-[-0.035em] text-white">
                      {step.title}
                    </h3>

                    <p className="mt-4 text-sm font-light leading-7 text-slate-500 sm:text-base">
                      {step.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="wp-section">
        <div className="wp-page-container">
          <div className="max-w-5xl">
            <p className="wp-eyebrow">
              Shared program infrastructure
            </p>

            <h2 className="wp-section-title mt-7">
              Every program uses
              <span className="block font-light text-slate-500">
                the same trusted operating core.
              </span>
            </h2>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {programCapabilities.map((capability, index) => (
              <article
                key={capability.title}
                className="wp-premium-card min-h-[19rem] p-7"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-sky-400/15 bg-sky-400/[0.07] font-mono text-xs font-black text-sky-400">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <h3 className="wp-card-title mt-7">
                  {capability.title}
                </h3>

                <p className="mt-5 text-sm font-light leading-7 text-slate-500">
                  {capability.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="wp-section overflow-hidden border-y border-white/10 bg-slate-900/25">
        <div className="wp-page-container">
          <div className="grid gap-12 xl:grid-cols-[1fr_1fr] xl:items-start">
            <div>
              <p className="wp-eyebrow">
                Program questions
              </p>

              <h2 className="wp-section-title mt-7">
                A practical program
                <span className="wp-gradient-text block">
                  begins with clarity.
                </span>
              </h2>

              <p className="wp-body-large mt-7 max-w-3xl">
                ECOLOGIX programs are configured around actual recovery needs,
                not generic sustainability promises.
              </p>

              <Link href="/contact" className="wp-primary-button mt-9">
                Discuss your recovery need
                <span aria-hidden="true">→</span>
              </Link>
            </div>

            <div className="space-y-4">
              {programQuestions.map((item, index) => (
                <article
                  key={item.question}
                  className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 shadow-2xl sm:p-7"
                >
                  <div className="flex items-start gap-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-violet-400/15 bg-violet-400/[0.07] font-mono text-[0.62rem] font-black text-violet-400">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <div>
                      <h3 className="text-lg font-black text-white">
                        {item.question}
                      </h3>

                      <p className="mt-3 text-sm font-light leading-7 text-slate-500">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="wp-section">
        <div className="wp-page-container">
          <div className="relative overflow-hidden rounded-[2.75rem] border border-white/10 bg-[linear-gradient(135deg,rgba(16,185,129,0.13),rgba(15,23,42,0.78)_48%,rgba(56,189,248,0.1))] px-7 py-14 shadow-2xl sm:px-12 sm:py-20 lg:px-16">
            <div
              aria-hidden="true"
              className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-emerald-400/15 blur-[100px]"
            />

            <div className="relative grid gap-10 xl:grid-cols-[1fr_auto] xl:items-end">
              <div className="max-w-5xl">
                <p className="wp-eyebrow">
                  Find your place in the network
                </p>

                <h2 className="mt-7 text-4xl font-black tracking-[-0.06em] text-white sm:text-5xl lg:text-7xl">
                  There is an ECOLOGIX
                  <span className="block font-light text-slate-400">
                    recovery pathway for you.
                  </span>
                </h2>

                <p className="wp-body-large mt-7 max-w-3xl">
                  Start with a household request or contact ECOLOGIX to design
                  an institutional, municipal, corporate, or recovery-centre
                  program.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row xl:flex-col">
                <Link href="/contact" className="wp-primary-button">
                  Get started
                  <span aria-hidden="true">→</span>
                </Link>

                <Link href="/partners" className="wp-secondary-button">
                  Explore partnerships
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      <EditablePageSections pageKey="programs" />
    </main>
  );
}
