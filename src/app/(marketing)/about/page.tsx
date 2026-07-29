import type { Metadata } from "next";
import Link from "next/link";
import { EditablePageSections } from "@/components/marketing/editable-page-sections";

export const metadata: Metadata = {
  title: "About WastePay | Circular Plastic Infrastructure",
  description:
    "Learn how WastePay combines plastic recovery, field logistics, data intelligence, and financial inclusion to build Cameroon’s circular plastic economy.",
  openGraph: {
    title: "About WastePay",
    description:
      "WastePay is building the digital and physical infrastructure required to recover plastic transparently across Cameroon.",
    type: "website",
    locale: "en_CM",
    siteName: "WastePay",
  },
  twitter: {
    card: "summary_large_image",
    title: "About WastePay",
    description:
      "Technology, logistics, data, and financial inclusion for circular plastic recovery.",
  },
};

const operatingPrinciples = [
  {
    number: "01",
    title: "Recovery must create local value",
    description:
      "Plastic recovery should provide dignified economic opportunities for collectors, drivers, depot teams, and communities—not simply move waste from one place to another.",
    accentClass:
      "border-emerald-400/15 bg-emerald-400/[0.055] text-emerald-400",
  },
  {
    number: "02",
    title: "Every kilogram should be traceable",
    description:
      "WastePay connects requests, locations, staff, depots, material records, prices, and payments so recovery activity can be understood and audited.",
    accentClass:
      "border-sky-400/15 bg-sky-400/[0.055] text-sky-400",
  },
  {
    number: "03",
    title: "Technology must work in the field",
    description:
      "The platform is designed for mobile devices, intermittent connectivity, camera-based verification, practical depot workflows, and familiar payment channels.",
    accentClass:
      "border-violet-400/15 bg-violet-400/[0.055] text-violet-400",
  },
  {
    number: "04",
    title: "Impact must be measurable",
    description:
      "Communities, companies, development partners, and public institutions need credible information about plastic recovered, people served, and value distributed.",
    accentClass:
      "border-amber-400/15 bg-amber-400/[0.055] text-amber-400",
  },
];

const infrastructureLayers = [
  {
    label: "Public access",
    title: "Collection requests",
    detail:
      "Residents, offices, hotels, schools, and institutions can request plastic collection through a mobile-friendly public interface.",
  },
  {
    label: "Field logistics",
    title: "Driver dispatch",
    detail:
      "Approved requests move into a controlled logistics queue and are assigned to authenticated WastePay pickup drivers.",
  },
  {
    label: "Recovery operations",
    title: "Depot intake",
    detail:
      "Plastic deliveries are tied to specific depots, agents, verified weights, photographs, product scans, and material records.",
  },
  {
    label: "Plastic intelligence",
    title: "Product-level data",
    detail:
      "Barcode information can connect recovered packaging to products, brands, material categories, and geographic recovery patterns.",
  },
  {
    label: "Financial infrastructure",
    title: "Transparent payouts",
    detail:
      "Pricing, approval, Mobile Money settlement, float monitoring, and transaction reconciliation form one accountable financial chain.",
  },
  {
    label: "Impact infrastructure",
    title: "Measurable outcomes",
    detail:
      "Recovery activity becomes structured environmental, social, operational, and financial intelligence.",
  },
];

const stakeholderGroups = [
  {
    title: "Residents and collectors",
    description:
      "Convenient collection access and a pathway for verified plastic to produce economic value.",
  },
  {
    title: "Drivers and depot teams",
    description:
      "Structured operational tools for dispatch, intake, verification, accountability, and performance.",
  },
  {
    title: "Brands and producers",
    description:
      "Transparent recovery programs and product-level insight into post-consumer plastic footprints.",
  },
  {
    title: "Municipalities",
    description:
      "Digital infrastructure for understanding demand, service coverage, material movement, and local recovery capacity.",
  },
  {
    title: "Development partners",
    description:
      "Measurable circular-economy programs with operational records instead of isolated activity reports.",
  },
  {
    title: "Recycling partners",
    description:
      "Cleaner material streams, traceable sourcing, and improved visibility into incoming plastic inventory.",
  },
];

const milestones = [
  {
    number: "01",
    title: "Connect recovery demand",
    description:
      "Make it simple for households and institutions to request plastic collection.",
  },
  {
    number: "02",
    title: "Coordinate field operations",
    description:
      "Route approved requests through depots, drivers, and accountable staff workflows.",
  },
  {
    number: "03",
    title: "Verify material accurately",
    description:
      "Record weight, product identity, material composition, photographs, and intake history.",
  },
  {
    number: "04",
    title: "Return value transparently",
    description:
      "Calculate and settle verified payouts while preserving an auditable transaction record.",
  },
  {
    number: "05",
    title: "Scale circular intelligence",
    description:
      "Use recovery data to improve infrastructure, accountability, policy, and corporate participation.",
  },
];

export default function AboutPage() {
  return (
    <main>
      <section className="relative overflow-hidden pb-20 pt-12 sm:pb-28 sm:pt-20">
        <div
          aria-hidden="true"
          className="wp-emerald-glow -left-52 top-0 h-[36rem] w-[36rem]"
        />

        <div
          aria-hidden="true"
          className="wp-violet-glow -right-48 top-28 h-[38rem] w-[38rem]"
        />

        <div className="wp-page-container">
          <div className="grid gap-14 xl:grid-cols-[1.03fr_0.97fr] xl:items-center">
            <div className="relative z-10 max-w-5xl">
              <p className="wp-eyebrow wp-fade-up">
                About WastePay
              </p>

              <h1 className="wp-display-title wp-fade-up-delay-1 mt-8">
                Infrastructure for
                <span className="wp-gradient-text block">
                  circular recovery.
                </span>
              </h1>

              <p className="wp-body-large wp-fade-up-delay-2 mt-8 max-w-3xl">
                WastePay is building the digital and physical operating
                infrastructure required to recover plastic transparently,
                coordinate field teams, create local economic value, and
                generate credible circular-economy intelligence.
              </p>

              <div className="wp-fade-up-delay-3 mt-9 flex flex-col gap-3 sm:flex-row">
                <Link href="/how-it-works" className="wp-primary-button">
                  See how it works
                  <span aria-hidden="true">→</span>
                </Link>

                <Link href="/partners" className="wp-secondary-button">
                  Partner with WastePay
                </Link>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-2xl xl:mx-0">
              <div
                aria-hidden="true"
                className="absolute inset-12 rounded-full bg-emerald-400/10 blur-[110px]"
              />

              <div className="wp-glass-panel-strong relative overflow-hidden rounded-[2.5rem] p-6 sm:p-8">
                <div className="pointer-events-none absolute inset-0 wp-grid-background opacity-55" />

                <div className="relative">
                  <p className="text-[0.62rem] font-black uppercase tracking-[0.23em] text-emerald-400">
                    The WastePay model
                  </p>

                  <h2 className="mt-5 text-3xl font-black tracking-[-0.05em] text-white sm:text-4xl">
                    Plastic recovery is an infrastructure problem.
                  </h2>

                  <p className="mt-5 text-base font-light leading-8 text-slate-400">
                    Collection alone is not enough. A functioning circular
                    economy needs coordinated access, trusted identities,
                    field logistics, recovery centres, material verification,
                    pricing, payment systems, inventory records, and measurable
                    outcomes.
                  </p>

                  <div className="mt-8 space-y-3">
                    {[
                      "Public collection access",
                      "Authenticated operational teams",
                      "Depot and logistics coordination",
                      "Material and product traceability",
                      "Transparent financial settlement",
                      "Environmental and economic intelligence",
                    ].map((item, index) => (
                      <div
                        key={item}
                        className="flex items-center gap-4 rounded-2xl border border-white/10 bg-slate-950/55 p-4"
                      >
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-400/15 bg-emerald-400/[0.07] font-mono text-[0.62rem] font-black text-emerald-400">
                          {String(index + 1).padStart(2, "0")}
                        </span>

                        <p className="text-sm font-bold text-slate-300">
                          {item}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-6 -right-3 hidden rounded-2xl border border-white/10 bg-slate-950/90 p-5 shadow-2xl backdrop-blur-xl sm:block">
                <p className="text-[0.56rem] font-black uppercase tracking-[0.18em] text-slate-600">
                  WastePay mission
                </p>

                <p className="mt-2 max-w-[15rem] text-sm font-black leading-6 text-white">
                  Make verified plastic recovery economically valuable and
                  operationally visible.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.018]">
        <div className="wp-page-container py-10">
          <div className="grid gap-6 sm:grid-cols-3">
            <article className="rounded-3xl border border-white/[0.07] bg-white/[0.025] p-6">
              <p className="text-[0.62rem] font-black uppercase tracking-[0.2em] text-emerald-400">
                Based in
              </p>

              <p className="mt-3 text-xl font-black text-white">
                Cameroon
              </p>
            </article>

            <article className="rounded-3xl border border-white/[0.07] bg-white/[0.025] p-6">
              <p className="text-[0.62rem] font-black uppercase tracking-[0.2em] text-sky-400">
                Built for
              </p>

              <p className="mt-3 text-xl font-black text-white">
                African recovery systems
              </p>
            </article>

            <article className="rounded-3xl border border-white/[0.07] bg-white/[0.025] p-6">
              <p className="text-[0.62rem] font-black uppercase tracking-[0.2em] text-violet-400">
                Designed around
              </p>

              <p className="mt-3 text-xl font-black text-white">
                Local participation
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="wp-section">
        <div className="wp-page-container">
          <div className="max-w-5xl">
            <p className="wp-eyebrow">
              Why WastePay exists
            </p>

            <h2 className="wp-section-title mt-7">
              Plastic has value,
              <span className="block font-light text-slate-500">
                but recovery systems remain fragmented.
              </span>
            </h2>

            <p className="wp-body-large mt-7 max-w-4xl">
              Valuable materials are frequently mixed, discarded, burned, or
              lost because access, incentives, logistics, verification, and
              market information are disconnected. WastePay brings those
              pieces together in one operating system.
            </p>
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-2">
            {operatingPrinciples.map((principle) => (
              <article
                key={principle.number}
                className="group rounded-[2rem] border border-white/10 bg-white/[0.03] p-7 shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:border-white/20 sm:p-8"
              >
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl border font-mono text-xs font-black ${principle.accentClass}`}
                >
                  {principle.number}
                </div>

                <h3 className="mt-7 text-2xl font-black tracking-[-0.04em] text-white sm:text-3xl">
                  {principle.title}
                </h3>

                <p className="mt-5 text-base font-light leading-8 text-slate-500">
                  {principle.description}
                </p>
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
                The infrastructure stack
              </p>

              <h2 className="wp-section-title mt-7">
                More than an app.
                <span className="block font-light text-slate-500">
                  A connected recovery system.
                </span>
              </h2>

              <p className="wp-body-large mt-7">
                WastePay links the public experience to operational workflows,
                material verification, financial controls, and measurable
                environmental outcomes.
              </p>
            </div>

            <div className="space-y-5">
              {infrastructureLayers.map((layer, index) => (
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
                      {layer.detail}
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
              Built for a shared economy
            </p>

            <h2 className="wp-section-title mt-7">
              Circular recovery needs
              <span className="block font-light text-slate-500">
                every participant in the system.
              </span>
            </h2>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {stakeholderGroups.map((group) => (
              <article
                key={group.title}
                className="wp-premium-card min-h-[17rem] p-7"
              >
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.8)]" />

                <h3 className="wp-card-title mt-7">
                  {group.title}
                </h3>

                <p className="mt-5 text-sm font-light leading-7 text-slate-500">
                  {group.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="wp-section overflow-hidden border-y border-white/10 bg-slate-900/25">
        <div className="wp-page-container">
          <div className="grid gap-12 xl:grid-cols-[1fr_1fr] xl:items-center">
            <div>
              <p className="wp-eyebrow">
                The WastePay journey
              </p>

              <h2 className="wp-section-title mt-7">
                Start locally.
                <span className="wp-gradient-text block">
                  Scale with evidence.
                </span>
              </h2>

              <p className="wp-body-large mt-7 max-w-3xl">
                WastePay’s growth is designed around operational proof:
                reliable service, verified material records, transparent
                payments, strong local partnerships, and measurable outcomes.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link href="/impact" className="wp-primary-button">
                  Explore our impact
                  <span aria-hidden="true">→</span>
                </Link>

                <Link href="/contact" className="wp-secondary-button">
                  Request collection
                </Link>
              </div>
            </div>

            <div className="relative">
              <div
                aria-hidden="true"
                className="wp-sky-glow left-1/2 top-1/2 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2"
              />

              <div className="wp-glass-panel-strong relative rounded-[2.5rem] p-6 sm:p-8">
                <div className="space-y-4">
                  {milestones.map((milestone) => (
                    <article
                      key={milestone.number}
                      className="grid gap-4 rounded-2xl border border-white/10 bg-slate-950/55 p-5 sm:grid-cols-[auto_1fr]"
                    >
                      <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-sky-400/15 bg-sky-400/[0.07] font-mono text-xs font-black text-sky-400">
                        {milestone.number}
                      </span>

                      <div>
                        <h3 className="font-black text-white">
                          {milestone.title}
                        </h3>

                        <p className="mt-2 text-sm font-light leading-6 text-slate-500">
                          {milestone.description}
                        </p>
                      </div>
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
          <div className="relative overflow-hidden rounded-[2.75rem] border border-white/10 bg-[linear-gradient(135deg,rgba(16,185,129,0.13),rgba(15,23,42,0.78)_48%,rgba(167,139,250,0.1))] px-7 py-14 shadow-2xl sm:px-12 sm:py-20 lg:px-16">
            <div
              aria-hidden="true"
              className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-emerald-400/15 blur-[100px]"
            />

            <div className="relative grid gap-10 xl:grid-cols-[1fr_auto] xl:items-end">
              <div className="max-w-5xl">
                <p className="wp-eyebrow">
                  Build the circular economy with us
                </p>

                <h2 className="mt-7 text-4xl font-black tracking-[-0.06em] text-white sm:text-5xl lg:text-7xl">
                  Recovery works better
                  <span className="block font-light text-slate-400">
                    when the system is connected.
                  </span>
                </h2>

                <p className="wp-body-large mt-7 max-w-3xl">
                  Join WastePay as a household, recovery partner, institution,
                  brand, municipality, or development organization.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row xl:flex-col">
                <Link href="/partners" className="wp-primary-button">
                  Partner with WastePay
                  <span aria-hidden="true">→</span>
                </Link>

                <Link href="/contact" className="wp-secondary-button">
                  Book a collection
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      <EditablePageSections pageKey="about" />
    </main>
  );
}
