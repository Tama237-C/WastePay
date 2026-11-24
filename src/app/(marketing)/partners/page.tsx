import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Partner With ECOLOGIX | Circular Plastic Recovery",
  description:
    "Partner with ECOLOGIX to build transparent plastic recovery programs for brands, municipalities, institutions, development organizations, and recovery centres in Cameroon.",
  openGraph: {
    title: "Partner With ECOLOGIX",
    description:
      "Build measurable, transparent plastic recovery programs through ECOLOGIX.",
    type: "website",
    locale: "en_CM",
    siteName: "ECOLOGIX",
  },
};

const partnershipTypes = [
  {
    number: "01",
    title: "Corporate brands",
    description:
      "Sponsor verified post-consumer plastic recovery and gain product-level insight into material footprints.",
  },
  {
    number: "02",
    title: "Municipalities",
    description:
      "Coordinate collection demand, recovery zones, depots, field teams, and public reporting.",
  },
  {
    number: "03",
    title: "Schools and universities",
    description:
      "Launch practical recovery programs that combine collection infrastructure and environmental education.",
  },
  {
    number: "04",
    title: "Hotels and businesses",
    description:
      "Implement recurring plastic collection with operational records and measurable diversion results.",
  },
  {
    number: "05",
    title: "Development organizations",
    description:
      "Support accountable circular-economy programs backed by operational evidence and public impact metrics.",
  },
  {
    number: "06",
    title: "Recovery and recycling partners",
    description:
      "Receive traceable material streams and improve visibility into source, weight, and material composition.",
  },
];

const partnershipBenefits = [
  "Verified recovery records",
  "Geographic recovery insight",
  "Material and barcode intelligence",
  "Operational accountability",
  "Impact reporting",
  "Flexible program design",
];

export default function PartnersPage() {
  return (
    <main>
      <section className="relative overflow-hidden pb-20 pt-12 sm:pb-28 sm:pt-20">
        <div
          aria-hidden="true"
          className="wp-emerald-glow -left-52 top-0 h-[36rem] w-[36rem]"
        />

        <div
          aria-hidden="true"
          className="wp-violet-glow -right-48 top-24 h-[40rem] w-[40rem]"
        />

        <div className="wp-page-container">
          <div className="grid gap-14 xl:grid-cols-[1.03fr_0.97fr] xl:items-center">
            <div className="relative z-10 max-w-5xl">
              <p className="wp-eyebrow wp-fade-up">
                Partner with ECOLOGIX
              </p>

              <h1 className="wp-display-title wp-fade-up-delay-1 mt-8">
                Build recovery
                <span className="wp-gradient-text block">
                  that can be measured.
                </span>
              </h1>

              <p className="wp-body-large wp-fade-up-delay-2 mt-8 max-w-3xl">
                ECOLOGIX works with brands, municipalities, institutions,
                recovery centres, and development partners to design
                transparent plastic-recovery programs in Cameroon.
              </p>

              <div className="wp-fade-up-delay-3 mt-9 flex flex-col gap-3 sm:flex-row">
                <Link href="/contact?type=partnership" className="wp-primary-button">
                  Start a partnership discussion
                  <span aria-hidden="true">→</span>
                </Link>

                <Link href="/impact" className="wp-secondary-button">
                  View ECOLOGIX impact
                </Link>
              </div>
            </div>

            <div className="wp-glass-panel-strong relative rounded-[2.5rem] p-6 sm:p-8">
              <p className="text-[0.62rem] font-black uppercase tracking-[0.23em] text-emerald-400">
                Partnership infrastructure
              </p>

              <h2 className="mt-5 text-3xl font-black tracking-[-0.05em] text-white sm:text-4xl">
                One operating platform for accountable recovery.
              </h2>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {partnershipBenefits.map((benefit, index) => (
                  <div
                    key={benefit}
                    className="rounded-2xl border border-white/10 bg-slate-950/55 p-4"
                  >
                    <p className="font-mono text-[0.62rem] font-black text-emerald-400">
                      {String(index + 1).padStart(2, "0")}
                    </p>

                    <p className="mt-3 text-sm font-black text-white">
                      {benefit}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="wp-section border-y border-white/10 bg-slate-900/25">
        <div className="wp-page-container">
          <div className="max-w-5xl">
            <p className="wp-eyebrow">
              Partnership pathways
            </p>

            <h2 className="wp-section-title mt-7">
              Different partners.
              <span className="block font-light text-slate-500">
                One circular recovery network.
              </span>
            </h2>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {partnershipTypes.map((partner) => (
              <article
                key={partner.number}
                className="wp-premium-card min-h-[19rem] p-7"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.07] font-mono text-xs font-black text-emerald-400">
                  {partner.number}
                </span>

                <h3 className="wp-card-title mt-7">
                  {partner.title}
                </h3>

                <p className="mt-5 text-sm font-light leading-7 text-slate-500">
                  {partner.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="wp-section">
        <div className="wp-page-container">
          <div className="relative overflow-hidden rounded-[2.75rem] border border-white/10 bg-[linear-gradient(135deg,rgba(16,185,129,0.13),rgba(15,23,42,0.78)_48%,rgba(167,139,250,0.1))] px-7 py-14 shadow-2xl sm:px-12 sm:py-20 lg:px-16">
            <div className="relative grid gap-10 xl:grid-cols-[1fr_auto] xl:items-end">
              <div className="max-w-5xl">
                <p className="wp-eyebrow">
                  Begin the conversation
                </p>

                <h2 className="mt-7 text-4xl font-black tracking-[-0.06em] text-white sm:text-5xl lg:text-7xl">
                  Let&apos;s design a
                  <span className="block font-light text-slate-400">
                    measurable recovery program.
                  </span>
                </h2>

                <p className="wp-body-large mt-7 max-w-3xl">
                  Tell ECOLOGIX about your organization, recovery objectives,
                  locations, material streams, and reporting needs.
                </p>
              </div>

              <Link href="/contact?type=partnership" className="wp-primary-button">
                Contact ECOLOGIX
                <span aria-hidden="true">→</span>
              </Link>
            </div>F
          </div>
        </div>
      </section>
    </main>
  );
}