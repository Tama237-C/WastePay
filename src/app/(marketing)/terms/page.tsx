import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Use | WastePay",
  description:
    "Read the terms governing the use of WastePay's website, operational platform, recovery services, and future payment infrastructure.",
};

const sections = [
  {
    number: "01",
    title: "Acceptance of these terms",
    paragraphs: [
      "By accessing or using WastePay services, you agree to comply with these Terms of Use and all applicable laws and regulations.",
      "If you do not agree with these terms, you should not use WastePay's services or submit information through the platform.",
    ],
  },

  {
    number: "02",
    title: "Eligibility",
    paragraphs: [
      "You must have the legal authority to submit information on behalf of yourself or your organization.",
      "Individuals using operational staff accounts must be authorized by WastePay or an approved WastePay partner.",
    ],
  },

  {
    number: "03",
    title: "Collection requests",
    paragraphs: [
      "Submitting a collection request does not guarantee collection or payment.",
      "WastePay reserves the right to approve, reject, postpone, or cancel collection requests based on operational capacity and service availability.",
    ],
  },

  {
    number: "04",
    title: "Material verification",
    paragraphs: [
      "Plastic quantities provided by users are estimates only.",
      "Final material classification and verified weight are determined during operational processing.",
    ],
  },

  {
    number: "05",
    title: "Pricing and payouts",
    paragraphs: [
      "WastePay may publish pricing information when operational pricing becomes available.",
      "Future payouts remain subject to verification, manager approval, fraud prevention procedures, and successful payment processing.",
    ],
  },

  {
    number: "06",
    title: "Operational accounts",
    paragraphs: [
      "Operational accounts are intended solely for authorized WastePay personnel and approved partners.",
      "Users are responsible for maintaining the confidentiality of their credentials.",
    ],
  },

  {
    number: "07",
    title: "Prohibited conduct",
    paragraphs: [
      "Users must not attempt to manipulate collection requests, payment records, material weights, or operational workflows.",
      "Fraudulent, abusive, or unlawful use of WastePay services may result in account suspension or legal action.",
    ],
  },

  {
    number: "08",
    title: "Intellectual property",
    paragraphs: [
      "WastePay's branding, software, content, graphics, operational workflows, and public metrics remain the intellectual property of WastePay unless otherwise stated.",
    ],
  },

  {
    number: "09",
    title: "Service availability",
    paragraphs: [
      "WastePay services may change, expand, or be temporarily unavailable without prior notice.",
      "Pilot programs may operate in selected regions before wider deployment.",
    ],
  },

  {
    number: "10",
    title: "Limitation of liability",
    paragraphs: [
      "WastePay provides its services on an 'as available' basis.",
      "WastePay is not liable for indirect, incidental, or consequential damages arising from the use of its services, except where prohibited by law.",
    ],
  },

  {
    number: "11",
    title: "Changes to the terms",
    paragraphs: [
      "WastePay may update these Terms of Use as its services evolve.",
      "Continued use of the platform after updates constitutes acceptance of the revised terms.",
    ],
  },

  {
    number: "12",
    title: "Contact information",
    paragraphs: [
      "Questions regarding these Terms of Use may be directed to hello@wastepay.org.",
    ],
  },
];

export default function TermsPage() {
  return (
    <main>
      <section className="relative overflow-hidden pb-20 pt-12 sm:pb-28 sm:pt-20">
        <div
          aria-hidden="true"
          className="wp-emerald-glow -left-52 top-0 h-[36rem] w-[36rem]"
        />

        <div className="wp-page-container">
          <div className="max-w-5xl">
            <p className="wp-eyebrow">
              Terms of Use
            </p>

            <h1 className="wp-display-title mt-8">
              Using WastePay
              <span className="wp-gradient-text block">
                responsibly.
              </span>
            </h1>

            <p className="wp-body-large mt-8 max-w-4xl">
              These terms explain the rules governing WastePay's public website,
              operational platform, collection services, and future payment
              infrastructure.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/contact" className="wp-primary-button">
                Contact WastePay
                <span aria-hidden="true">→</span>
              </Link>

              <Link href="/privacy" className="wp-secondary-button">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="wp-section">
        <div className="wp-page-container">
          <div className="space-y-5">
            {sections.map((section) => (
              <section
                key={section.number}
                className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-8 shadow-2xl"
              >
                <div className="flex items-start gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.07] font-mono text-xs font-black text-emerald-400">
                    {section.number}
                  </span>

                  <h2 className="pt-1 text-2xl font-black tracking-[-0.04em] text-white">
                    {section.title}
                  </h2>
                </div>

                <div className="mt-7 space-y-5">
                  {section.paragraphs.map((paragraph) => (
                    <p
                      key={paragraph}
                      className="text-sm font-light leading-8 text-slate-400"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>

      <section className="wp-section border-t border-white/10 bg-slate-900/25">
        <div className="wp-page-container">
          <div className="relative overflow-hidden rounded-[2.75rem] border border-white/10 bg-[linear-gradient(135deg,rgba(16,185,129,0.13),rgba(15,23,42,0.78)_48%,rgba(56,189,248,0.1))] px-7 py-14 shadow-2xl sm:px-12 sm:py-20 lg:px-16">
            <div className="relative grid gap-10 xl:grid-cols-[1fr_auto] xl:items-end">
              <div className="max-w-5xl">
                <p className="wp-eyebrow">
                  Questions?
                </p>

                <h2 className="mt-7 text-4xl font-black tracking-[-0.06em] text-white sm:text-5xl lg:text-7xl">
                  Contact the
                  <span className="block font-light text-slate-400">
                    WastePay team.
                  </span>
                </h2>

                <p className="wp-body-large mt-7 max-w-3xl">
                  If you have questions about these terms or how WastePay
                  operates, our team will be happy to help.
                </p>
              </div>

              <Link href="/contact" className="wp-primary-button">
                Contact WastePay
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}