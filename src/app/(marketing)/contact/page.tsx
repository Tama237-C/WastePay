import type { Metadata } from "next";

import { EditablePageSections } from "@/components/marketing/editable-page-sections";
import { PartnershipEnquiryForm } from "@/components/marketing/partnership-enquiry-form";

export const metadata: Metadata = {
  title: "Contact ECOLOGIX | Partnerships",
  description:
    "Contact ECOLOGIX about corporate, municipal, educational, recovery, funding, and research partnerships.",
  keywords: [
    "contact ECOLOGIX",
    "plastic collection Cameroon",
    "home plastic pickup",
    "ECOLOGIX partnership",
    "corporate plastic recovery",
    "municipal recycling Cameroon",
  ],
  openGraph: {
    title: "Contact ECOLOGIX",
    description:
      "Discuss a measurable circular-plastic partnership with ECOLOGIX.",
    type: "website",
    locale: "en_CM",
    siteName: "ECOLOGIX",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact ECOLOGIX",
    description: "Explore an ECOLOGIX recovery partnership.",
  },
};

const contactChannels = [
  {
    label: "Corporate partnerships",
    value: "partners@ecologix.org",
    detail:
      "CSR campaigns, brand recovery programs, producer responsibility, and corporate plastic intelligence.",
  },
  {
    label: "Municipal cooperation",
    value: "cities@ecologix.org",
    detail:
      "City recovery infrastructure, public collection programs, depot networks, and operational reporting.",
  },
  {
    label: "General enquiries",
    value: "hello@ecologix.org",
    detail:
      "Questions about ECOLOGIX, our programs, collection coverage, and circular-economy infrastructure.",
  },
];

const collectionSteps = [
  {
    number: "01",
    title: "Submit your request",
    description:
      "Tell ECOLOGIX who you are, where the plastic is located, and the estimated amount ready for collection.",
  },
  {
    number: "02",
    title: "ECOLOGIX reviews it",
    description:
      "Our operations team verifies the request and assigns the most appropriate recovery depot.",
  },
  {
    number: "03",
    title: "A driver is dispatched",
    description:
      "An authenticated ECOLOGIX driver receives the pickup and coordinates collection with you.",
  },
  {
    number: "04",
    title: "Plastic enters recovery",
    description:
      "The collected material is delivered to an ECOLOGIX depot for weighing, verification, classification, and processing.",
  },
];

const partnershipOptions = [
  "Corporate plastic recovery",
  "Municipal recovery infrastructure",
  "School or university programs",
  "Business and hotel collections",
  "Brand-sponsored recovery campaigns",
  "Recovery depot partnerships",
  "Funding and investment",
  "Research and data collaboration",
];

export default async function ContactPage() {
  return (
    <main>
      <section className="relative overflow-hidden pb-16 pt-12 sm:pb-24 sm:pt-20">
        <div
          aria-hidden="true"
          className="wp-emerald-glow -left-52 top-0 h-[36rem] w-[36rem]"
        />

        <div
          aria-hidden="true"
          className="wp-violet-glow -right-48 top-24 h-[40rem] w-[40rem]"
        />

        <div className="wp-page-container">
          <div className="grid gap-14 xl:grid-cols-[0.9fr_1.1fr] xl:items-start">
            <div className="relative z-10 xl:sticky xl:top-36">
              <p className="wp-eyebrow wp-fade-up">
                Contact ECOLOGIX
              </p>

              <h1 className="wp-display-title wp-fade-up-delay-1 mt-8">
                Your plastic.
                <span className="block font-light text-slate-500">
                  Our recovery network.
                </span>
              </h1>

              <p className="wp-body-large wp-fade-up-delay-2 mt-8 max-w-2xl">
                Schedule an ECOLOGIX collection for plastic waste from your
                home, office, school, hotel, or institution—or speak with us
                about building a measurable recovery partnership.
              </p>

              <div className="wp-fade-up-delay-3 mt-10 space-y-4">
                {collectionSteps.map((step) => (
                  <article
                    key={step.number}
                    className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl backdrop-blur-xl"
                  >
                    <div className="flex items-start gap-4">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.07] font-mono text-xs font-black text-emerald-400">
                        {step.number}
                      </span>

                      <div>
                        <h2 className="text-lg font-black text-white">
                          {step.title}
                        </h2>

                        <p className="mt-2 text-sm font-light leading-7 text-slate-500">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div>
              <section className="mb-6">
                <a
                  href="#partnership-enquiry"
                  className="group rounded-3xl border border-violet-400/15 bg-violet-400/[0.055] p-6 shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:border-violet-400/30 hover:shadow-violet-500/[0.08]"
                >
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-violet-400">
                    Partners and sponsors
                  </p>

                  <h2 className="mt-4 text-2xl font-black tracking-[-0.04em] text-white">
                    Discuss a partnership
                  </h2>

                  <p className="mt-3 text-sm font-light leading-7 text-slate-500">
                    Explore a corporate, municipal, educational, recovery,
                    funding, or research partnership.
                  </p>

                  <p className="mt-5 text-xs font-black uppercase tracking-[0.16em] text-violet-300">
                    Open partnership form
                    <span
                      aria-hidden="true"
                      className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </p>
                </a>
              </section>

              <div className="mt-6 scroll-mt-32">
                <PartnershipEnquiryForm
                  defaultExpanded
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-slate-900/25">
        <div className="wp-page-container py-16 sm:py-20">
          <div className="max-w-5xl">
            <p className="wp-eyebrow">
              Partnership pathways
            </p>

            <h2 className="wp-section-title mt-7">
              Work with ECOLOGIX
              <span className="block font-light text-slate-500">
                across the circular economy.
              </span>
            </h2>

            <p className="wp-body-large mt-7 max-w-4xl">
              ECOLOGIX partnerships can support collection access, recovery
              infrastructure, operational technology, material intelligence,
              public reporting, and transparent value distribution.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {partnershipOptions.map((option, index) => (
              <article
                key={option}
                className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:border-violet-400/20"
              >
                <p className="font-mono text-xs font-black text-violet-400">
                  {String(index + 1).padStart(2, "0")}
                </p>

                <h3 className="mt-5 text-lg font-black leading-7 text-white">
                  {option}
                </h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="wp-section">
        <div className="wp-page-container">
          <div className="grid gap-12 xl:grid-cols-[0.75fr_1.25fr] xl:items-start">
            <div>
              <p className="wp-eyebrow">
                Other contact channels
              </p>

              <h2 className="wp-section-title mt-7">
                Reach the right
                <span className="block font-light text-slate-500">
                  ECOLOGIX team.
                </span>
              </h2>

              <p className="wp-body-large mt-7">
                Choose the contact channel that best matches your enquiry.
              </p>
            </div>

            <div className="space-y-5">
              {contactChannels.map((channel, index) => (
                <article
                  key={channel.value}
                  className="group rounded-[2rem] border border-white/10 bg-white/[0.03] p-7 shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:border-emerald-400/20 sm:p-8"
                >
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="font-mono text-xs font-black text-emerald-400">
                        {String(index + 1).padStart(2, "0")}
                      </p>

                      <h3 className="mt-5 text-2xl font-black tracking-[-0.04em] text-white">
                        {channel.label}
                      </h3>

                      <p className="mt-4 max-w-2xl text-sm font-light leading-7 text-slate-500">
                        {channel.detail}
                      </p>
                    </div>

                    <a
                      href={`mailto:${channel.value}`}
                      className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] px-5 py-3 text-xs font-black uppercase tracking-[0.15em] text-slate-300 transition-all duration-300 hover:border-emerald-400/25 hover:bg-emerald-400/10 hover:text-emerald-200"
                    >
                      Email team
                    </a>
                  </div>

                  <p className="mt-6 border-t border-white/10 pt-5 text-sm font-bold text-slate-300">
                    {channel.value}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="wp-section border-t border-white/10 bg-slate-900/25">
        <div className="wp-page-container">
          <div className="relative overflow-hidden rounded-[2.75rem] border border-white/10 bg-[linear-gradient(135deg,rgba(16,185,129,0.13),rgba(15,23,42,0.78)_48%,rgba(167,139,250,0.1))] px-7 py-14 shadow-2xl sm:px-12 sm:py-20 lg:px-16">
            <div
              aria-hidden="true"
              className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-emerald-400/15 blur-[100px]"
            />

            <div className="relative max-w-5xl">
              <p className="wp-eyebrow">
                Start with the right conversation
              </p>

              <h2 className="mt-7 text-4xl font-black tracking-[-0.06em] text-white sm:text-5xl lg:text-7xl">
                Collection request
                <span className="block font-light text-slate-400">
                  or recovery partnership.
                </span>
              </h2>

              <p className="wp-body-large mt-7 max-w-3xl">
                ECOLOGIX will route your enquiry to the appropriate operational
                or partnership workflow.
              </p>
            </div>
          </div>
        </div>
      </section>
      <EditablePageSections pageKey="contact" />
    </main>
  );
}
