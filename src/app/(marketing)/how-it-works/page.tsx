import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How ECOLOGIX Works | Plastic Recovery Journey",
  description:
    "See how ECOLOGIX connects collection requests, field logistics, recovery depots, material verification, pricing, payments, and impact reporting.",
  keywords: [
    "how ECOLOGIX works",
    "plastic collection Cameroon",
    "plastic recovery process",
    "home waste pickup",
    "plastic buyback Cameroon",
    "circular economy platform",
  ],
  openGraph: {
    title: "How ECOLOGIX Works",
    description:
      "Follow the complete ECOLOGIX recovery journey from collection request to verified circular value.",
    type: "website",
    locale: "en_CM",
    siteName: "ECOLOGIX",
  },
  twitter: {
    card: "summary_large_image",
    title: "How ECOLOGIX Works",
    description:
      "Collection, logistics, verification, pricing, payment, and measurable impact in one connected recovery system.",
  },
};

const recoveryStages = [
  {
    number: "01",
    eyebrow: "Public access",
    title: "A collection request enters the network",
    description:
      "A resident, school, office, hotel, or institution submits a mobile-friendly collection request with contact details, waste estimates, neighbourhood information, and a secure pickup location.",
    systemRecords: [
      "Requester type",
      "Contact number",
      "Neighbourhood",
      "Estimated bag count",
      "Estimated weight",
      "GPS pickup location",
    ],
    accentClass:
      "border-emerald-400/15 bg-emerald-400/[0.055]",
    badgeClass:
      "border-emerald-400/20 bg-emerald-400/[0.08] text-emerald-400",
  },
  {
    number: "02",
    eyebrow: "Operations review",
    title: "ECOLOGIX verifies and routes the request",
    description:
      "An authorized administrator reviews the submission, confirms whether the request can be served, and assigns it to the most appropriate ECOLOGIX recovery depot.",
    systemRecords: [
      "Review status",
      "Assigned depot",
      "Approval time",
      "Rejection reason",
      "Operational ownership",
      "Request history",
    ],
    accentClass:
      "border-sky-400/15 bg-sky-400/[0.055]",
    badgeClass:
      "border-sky-400/20 bg-sky-400/[0.08] text-sky-400",
  },
  {
    number: "03",
    eyebrow: "Logistics dispatch",
    title: "An authenticated driver receives the pickup",
    description:
      "The approved request enters the logistics queue. ECOLOGIX dispatch selects an active pickup driver and connects the assignment to the responsible depot.",
    systemRecords: [
      "Driver identity",
      "Driver status",
      "Assigned depot",
      "Dispatch timestamp",
      "Pickup status",
      "Operational zone",
    ],
    accentClass:
      "border-violet-400/15 bg-violet-400/[0.055]",
    badgeClass:
      "border-violet-400/20 bg-violet-400/[0.08] text-violet-400",
  },
  {
    number: "04",
    eyebrow: "Field collection",
    title: "The driver executes the collection route",
    description:
      "The driver views the assigned request from the mobile operational dashboard, starts the route, contacts the requester, collects the plastic, and confirms that the material is in transit to the depot.",
    systemRecords: [
      "Route started",
      "In-transit status",
      "Collector contact",
      "Collection confirmation",
      "Driver accountability",
      "Depot destination",
    ],
    accentClass:
      "border-amber-400/15 bg-amber-400/[0.055]",
    badgeClass:
      "border-amber-400/20 bg-amber-400/[0.08] text-amber-400",
  },
  {
    number: "05",
    eyebrow: "Depot arrival",
    title: "The material enters a controlled recovery centre",
    description:
      "After collection, the plastic is delivered to the assigned ECOLOGIX depot. Only authorized agents assigned to that depot can view and process the incoming delivery.",
    systemRecords: [
      "Depot assignment",
      "Incoming delivery queue",
      "Agent identity",
      "Delivery status",
      "Estimated material",
      "Arrival workflow",
    ],
    accentClass:
      "border-emerald-400/15 bg-emerald-400/[0.055]",
    badgeClass:
      "border-emerald-400/20 bg-emerald-400/[0.08] text-emerald-400",
  },
  {
    number: "06",
    eyebrow: "Material verification",
    title: "A depot agent verifies what actually arrived",
    description:
      "The agent begins intake, records the verified scale weight, captures supporting photographs, and checks that the delivered material matches the operational record.",
    systemRecords: [
      "Verified weight",
      "Intake agent",
      "Intake start time",
      "Scale photograph",
      "Verification notes",
      "Material condition",
    ],
    accentClass:
      "border-sky-400/15 bg-sky-400/[0.055]",
    badgeClass:
      "border-sky-400/20 bg-sky-400/[0.08] text-sky-400",
  },
  {
    number: "07",
    eyebrow: "Plastic intelligence",
    title: "Products and materials become structured data",
    description:
      "Barcode scanning and material classification connect recovered plastic to products, brands, manufacturers, resin types, weights, and recycling categories.",
    systemRecords: [
      "Product barcode",
      "Brand",
      "Product name",
      "Plastic category",
      "Material weight",
      "Verification state",
    ],
    accentClass:
      "border-violet-400/15 bg-violet-400/[0.055]",
    badgeClass:
      "border-violet-400/20 bg-violet-400/[0.08] text-violet-400",
  },
  {
    number: "08",
    eyebrow: "Circular value",
    title: "Verified material is priced and reconciled",
    description:
      "ECOLOGIX applies active pricing rules to the verified material, prepares the transaction for approval, and connects the payout to secure Mobile Money settlement and an auditable financial ledger.",
    systemRecords: [
      "Material rate",
      "Regional multiplier",
      "Campaign bonus",
      "Total payout",
      "Payment status",
      "Telecom reference",
    ],
    accentClass:
      "border-amber-400/15 bg-amber-400/[0.055]",
    badgeClass:
      "border-amber-400/20 bg-amber-400/[0.08] text-amber-400",
  },
];

const platformRoles = [
  {
    title: "Resident or institution",
    responsibility:
      "Submits a collection request and prepares plastic for pickup.",
    accent: "text-emerald-400",
  },
  {
    title: "ECOLOGIX administrator",
    responsibility:
      "Reviews requests, assigns depots, provisions staff, and supervises operations.",
    accent: "text-sky-400",
  },
  {
    title: "Pickup driver",
    responsibility:
      "Executes assigned routes and delivers collected plastic to the recovery depot.",
    accent: "text-violet-400",
  },
  {
    title: "Depot agent",
    responsibility:
      "Verifies weight, captures evidence, scans products, and records material intake.",
    accent: "text-amber-400",
  },
  {
    title: "Depot manager",
    responsibility:
      "Reviews transactions, supervises reconciliation, and controls operational quality.",
    accent: "text-emerald-400",
  },
  {
    title: "Recovery partner",
    responsibility:
      "Receives traceable material streams for further processing and recycling.",
    accent: "text-sky-400",
  },
];

const trustControls = [
  {
    number: "01",
    title: "Role-based access",
    description:
      "Administrators, drivers, agents, and managers use protected accounts with permissions limited to their responsibilities.",
  },
  {
    number: "02",
    title: "Database row protection",
    description:
      "Supabase Row Level Security restricts records by user role, assigned driver, and assigned depot.",
  },
  {
    number: "03",
    title: "Verified operational transitions",
    description:
      "Requests move through controlled states instead of being edited freely or completed without evidence.",
  },
  {
    number: "04",
    title: "Material evidence",
    description:
      "Verified scale weight, images, product scans, and agent identity strengthen depot intake accountability.",
  },
  {
    number: "05",
    title: "Financial traceability",
    description:
      "Pricing records, payout status, telecom references, and reconciliation history support financial oversight.",
  },
  {
    number: "06",
    title: "Aggregate public reporting",
    description:
      "Public impact totals are separated from private names, phone numbers, GPS records, and transaction details.",
  },
];

const outcomeCards = [
  {
    label: "For residents",
    title: "A simpler path to responsible disposal",
    description:
      "Mobile collection access reduces the friction involved in finding a reliable recovery option.",
    accentClass:
      "border-emerald-400/15 bg-emerald-400/[0.055]",
  },
  {
    label: "For field teams",
    title: "Clear operational responsibility",
    description:
      "Every request is connected to specific staff, statuses, timestamps, depots, and next actions.",
    accentClass:
      "border-sky-400/15 bg-sky-400/[0.055]",
  },
  {
    label: "For brands",
    title: "Better post-consumer visibility",
    description:
      "Product and barcode records can reveal which packaging appears in recovered material streams.",
    accentClass:
      "border-violet-400/15 bg-violet-400/[0.055]",
  },
  {
    label: "For communities",
    title: "Recovery that creates local value",
    description:
      "ECOLOGIX is designed to connect verified plastic with economic participation and accountable financial distribution.",
    accentClass:
      "border-amber-400/15 bg-amber-400/[0.055]",
  },
];

export default function HowItWorksPage() {
  return (
    <main>
      <section className="relative overflow-hidden pb-20 pt-12 sm:pb-28 sm:pt-20">
        <div
          aria-hidden="true"
          className="wp-emerald-glow -left-52 top-0 h-[36rem] w-[36rem]"
        />

        <div
          aria-hidden="true"
          className="wp-violet-glow -right-52 top-24 h-[40rem] w-[40rem]"
        />

        <div className="wp-page-container">
          <div className="grid gap-14 xl:grid-cols-[1.05fr_0.95fr] xl:items-center">
            <div className="relative z-10 max-w-5xl">
              <p className="wp-eyebrow wp-fade-up">
                How ECOLOGIX works
              </p>

              <h1 className="wp-display-title wp-fade-up-delay-1 mt-8">
                One connected
                <span className="wp-gradient-text block">
                  recovery journey.
                </span>
              </h1>

              <p className="wp-body-large wp-fade-up-delay-2 mt-8 max-w-3xl">
                ECOLOGIX connects public collection access, field logistics,
                depot verification, plastic intelligence, transparent pricing,
                secure payments, and measurable impact in one operational
                system.
              </p>

              <div className="wp-fade-up-delay-3 mt-9 flex flex-col gap-3 sm:flex-row">
                <Link href="/contact" className="wp-primary-button">
                  Request home collection
                  <span aria-hidden="true">→</span>
                </Link>

                <Link href="/impact" className="wp-secondary-button">
                  View live impact
                </Link>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-2xl xl:mx-0">
              <div
                aria-hidden="true"
                className="absolute inset-10 rounded-full bg-sky-400/10 blur-[110px]"
              />

              <div className="wp-glass-panel-strong relative overflow-hidden rounded-[2.5rem] p-6 sm:p-8">
                <div className="pointer-events-none absolute inset-0 wp-grid-background opacity-55" />

                <div className="relative">
                  <div className="flex items-center justify-between gap-5">
                    <div>
                      <p className="text-[0.62rem] font-black uppercase tracking-[0.23em] text-emerald-400">
                        Recovery lifecycle
                      </p>

                      <p className="mt-2 text-sm text-slate-500">
                        Public request to circular value
                      </p>
                    </div>

                    <span className="rounded-full border border-emerald-400/20 bg-emerald-400/[0.08] px-3 py-2 text-[0.58rem] font-black uppercase tracking-[0.16em] text-emerald-300">
                      08 stages
                    </span>
                  </div>

                  <div className="mt-8 space-y-3">
                    {[
                      ["01", "Request received", "Public"],
                      ["02", "Request reviewed", "Admin"],
                      ["03", "Driver assigned", "Dispatch"],
                      ["04", "Plastic collected", "Field"],
                      ["05", "Depot delivery", "Recovery"],
                      ["06", "Weight verified", "Intake"],
                      ["07", "Material identified", "Data"],
                      ["08", "Value reconciled", "Finance"],
                    ].map(([number, title, label]) => (
                      <article
                        key={number}
                        className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-slate-950/55 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-400/20"
                      >
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] font-mono text-[0.62rem] font-black text-slate-600">
                          {number}
                        </span>

                        <p className="min-w-0 flex-1 text-sm font-black text-white">
                          {title}
                        </p>

                        <span className="hidden rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5 text-[0.55rem] font-black uppercase tracking-[0.14em] text-slate-600 sm:inline-flex">
                          {label}
                        </span>
                      </article>
                    ))}
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-6 -right-3 hidden rounded-2xl border border-white/10 bg-slate-950/90 p-5 shadow-2xl backdrop-blur-xl sm:block">
                <p className="text-[0.56rem] font-black uppercase tracking-[0.18em] text-slate-600">
                  Operating principle
                </p>

                <p className="mt-2 text-sm font-black text-white">
                  Each stage creates the evidence required by the next.
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
                Public experience
              </p>

              <p className="mt-3 text-xl font-black text-white">
                Easy collection access
              </p>
            </article>

            <article className="rounded-3xl border border-white/[0.07] bg-white/[0.025] p-6">
              <p className="text-[0.62rem] font-black uppercase tracking-[0.2em] text-sky-400">
                Operational platform
              </p>

              <p className="mt-3 text-xl font-black text-white">
                Controlled field execution
              </p>
            </article>

            <article className="rounded-3xl border border-white/[0.07] bg-white/[0.025] p-6">
              <p className="text-[0.62rem] font-black uppercase tracking-[0.2em] text-violet-400">
                Intelligence layer
              </p>

              <p className="mt-3 text-xl font-black text-white">
                Traceable circular outcomes
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="wp-section">
        <div className="wp-page-container">
          <div className="max-w-5xl">
            <p className="wp-eyebrow">
              The complete recovery process
            </p>

            <h2 className="wp-section-title mt-7">
              Eight connected stages.
              <span className="block font-light text-slate-500">
                One accountable operating chain.
              </span>
            </h2>

            <p className="wp-body-large mt-7 max-w-4xl">
              ECOLOGIX reduces the gaps between collection demand, field
              execution, material verification, financial settlement, and
              impact reporting.
            </p>
          </div>

          <div className="mt-14 space-y-7">
            {recoveryStages.map((stage) => (
              <article
                key={stage.number}
                className={`group relative overflow-hidden rounded-[2.25rem] border p-7 shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl sm:p-9 lg:p-10 ${stage.accentClass}`}
              >
                <div className="grid gap-9 xl:grid-cols-[0.82fr_1.18fr] xl:items-start">
                  <div>
                    <div
                      className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl border font-mono text-xs font-black ${stage.badgeClass}`}
                    >
                      {stage.number}
                    </div>

                    <p className="mt-7 text-xs font-black uppercase tracking-[0.23em] text-slate-500">
                      {stage.eyebrow}
                    </p>

                    <h3 className="mt-4 text-3xl font-black tracking-[-0.045em] text-white sm:text-4xl">
                      {stage.title}
                    </h3>

                    <p className="mt-5 max-w-2xl text-base font-light leading-8 text-slate-400">
                      {stage.description}
                    </p>
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-slate-950/55 p-5 sm:p-6">
                    <p className="text-[0.62rem] font-black uppercase tracking-[0.21em] text-slate-600">
                      Records created at this stage
                    </p>

                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      {stage.systemRecords.map((record, index) => (
                        <div
                          key={record}
                          className="flex min-h-14 items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3"
                        >
                          <span className="font-mono text-[0.58rem] font-black text-slate-700">
                            {String(index + 1).padStart(2, "0")}
                          </span>

                          <span className="text-sm font-bold text-slate-300">
                            {record}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
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
                Who participates
              </p>

              <h2 className="wp-section-title mt-7">
                Every role has
                <span className="block font-light text-slate-500">
                  a clear responsibility.
                </span>
              </h2>

              <p className="wp-body-large mt-7">
                ECOLOGIX separates responsibilities so operational decisions
                remain attributable and protected.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {platformRoles.map((role, index) => (
                <article
                  key={role.title}
                  className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-7 shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:border-white/20"
                >
                  <p
                    className={`font-mono text-xs font-black ${role.accent}`}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </p>

                  <h3 className="mt-6 text-2xl font-black tracking-[-0.04em] text-white">
                    {role.title}
                  </h3>

                  <p className="mt-4 text-sm font-light leading-7 text-slate-500">
                    {role.responsibility}
                  </p>
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
              Trust by design
            </p>

            <h2 className="wp-section-title mt-7">
              Recovery data is useful
              <span className="block font-light text-slate-500">
                only when the process is controlled.
              </span>
            </h2>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {trustControls.map((control) => (
              <article
                key={control.number}
                className="wp-premium-card min-h-[19rem] p-7"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.07] font-mono text-xs font-black text-emerald-400">
                  {control.number}
                </span>

                <h3 className="wp-card-title mt-7">
                  {control.title}
                </h3>

                <p className="mt-5 text-sm font-light leading-7 text-slate-500">
                  {control.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="wp-section overflow-hidden border-y border-white/10 bg-slate-900/25">
        <div className="wp-page-container">
          <div className="max-w-5xl">
            <p className="wp-eyebrow">
              What the system produces
            </p>

            <h2 className="wp-section-title mt-7">
              Better outcomes
              <span className="wp-gradient-text block">
                for every participant.
              </span>
            </h2>
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-2">
            {outcomeCards.map((outcome) => (
              <article
                key={outcome.title}
                className={`rounded-[2rem] border p-7 shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl sm:p-8 ${outcome.accentClass}`}
              >
                <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
                  {outcome.label}
                </p>

                <h3 className="mt-5 text-3xl font-black tracking-[-0.045em] text-white">
                  {outcome.title}
                </h3>

                <p className="mt-5 text-base font-light leading-8 text-slate-500">
                  {outcome.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="wp-section">
        <div className="wp-page-container">
          <div className="relative overflow-hidden rounded-[2.75rem] border border-white/10 bg-[linear-gradient(135deg,rgba(16,185,129,0.13),rgba(15,23,42,0.78)_48%,rgba(167,139,250,0.1))] px-7 py-14 shadow-2xl sm:px-12 sm:py-20 lg:px-16">
            <div
              aria-hidden="true"
              className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-emerald-400/15 blur-[100px]"
            />

            <div className="relative grid gap-10 xl:grid-cols-[1fr_auto] xl:items-end">
              <div className="max-w-5xl">
                <p className="wp-eyebrow">
                  Enter the recovery network
                </p>

                <h2 className="mt-7 text-4xl font-black tracking-[-0.06em] text-white sm:text-5xl lg:text-7xl">
                  Start with one request.
                  <span className="block font-light text-slate-400">
                    Build a traceable recovery journey.
                  </span>
                </h2>

                <p className="wp-body-large mt-7 max-w-3xl">
                  Request a collection, explore an ECOLOGIX program, or work
                  with us to expand transparent plastic recovery.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row xl:flex-col">
                <Link href="/contact" className="wp-primary-button">
                  Book collection
                  <span aria-hidden="true">→</span>
                </Link>

                <Link href="/partners" className="wp-secondary-button">
                  Become a partner
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}