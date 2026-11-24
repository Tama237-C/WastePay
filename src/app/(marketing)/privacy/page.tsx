import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | ECOLOGIX",
  description:
    "Read how ECOLOGIX collects, uses, stores, protects, and shares personal information across its public website and plastic-recovery operations.",
  openGraph: {
    title: "ECOLOGIX Privacy Policy",
    description:
      "How ECOLOGIX handles personal information across collection, logistics, depot, partnership, and payment workflows.",
    type: "website",
    locale: "en_CM",
    siteName: "ECOLOGIX",
  },
};

const policySections = [
  {
    number: "01",
    title: "Who this policy applies to",
    paragraphs: [
      "This Privacy Policy applies to people who visit the ECOLOGIX public website, submit collection requests, send partnership enquiries, use ECOLOGIX operational accounts, participate in collection or recovery activities, or otherwise provide personal information to ECOLOGIX.",
      "ECOLOGIX is based in Cameroon and is building public, operational, logistics, depot, plastic-intelligence, and payment infrastructure for circular plastic recovery.",
    ],
  },
  {
    number: "02",
    title: "Information ECOLOGIX may collect",
    paragraphs: [
      "Depending on how you interact with ECOLOGIX, we may collect your full name, phone or WhatsApp number, email address, organization, organization type, city, neighbourhood, and other contact information.",
      "For a collection request, we may also collect the requester type, estimated bag count, estimated plastic weight, optional photographs, browser-provided geographic coordinates, request status, assigned depot, assigned driver, and operational timestamps.",
      "For staff accounts, we may collect identity details, work contact information, assigned role, assigned depot, account status, sign-in information, password-change status, and records of authorized operational actions.",
      "For depot and transaction workflows, ECOLOGIX may process verified material weight, material category, barcode and product information, verification photographs, pricing details, payout instructions, Mobile Money number, payment status, and telecom transaction references.",
      "Technical information may include browser type, device information, timestamps, error records, security events, and information required to operate and protect the platform.",
    ],
  },
  {
    number: "03",
    title: "How ECOLOGIX uses information",
    paragraphs: [
      "ECOLOGIX uses personal information to review collection requests, contact requesters, assign recovery depots, dispatch drivers, verify deliveries, process material intake, operate staff accounts, respond to enquiries, and provide requested services.",
      "Information may also be used to calculate verified material value, prepare and reconcile payments, prevent fraud, investigate operational problems, maintain audit records, improve service coverage, and produce internal performance analysis.",
      "ECOLOGIX may publish aggregated impact statistics such as total plastic recovered, collection-request counts, communities represented, and active depots. These public indicators are designed not to reveal personal names, phone numbers, exact GPS locations, staff emails, or private transaction details.",
    ],
  },
  {
    number: "04",
    title: "Location information",
    paragraphs: [
      "The public collection form may request permission to obtain the device's current geographic coordinates. The browser will not provide this location unless the user grants permission.",
      "ECOLOGIX uses location information to identify a pickup point, support depot assignment, improve service-area decisions, and prepare future routing and geographic analysis.",
      "Users should provide location information only for a place where they are authorized to request collection. Exact pickup coordinates are operational information and are not intended for public display.",
    ],
  },
  {
    number: "05",
    title: "Photos, barcodes, and material evidence",
    paragraphs: [
      "ECOLOGIX may collect photographs submitted with collection requests or captured during driver and depot workflows. These images may be used to verify the existence, condition, quantity, weight, or classification of recovered material.",
      "Barcode scans may be used to identify a product, brand, manufacturer, packaging size, plastic category, and other material attributes.",
      "Users and staff should avoid capturing unnecessary people, identity documents, private conversations, or unrelated personal information in operational photographs.",
    ],
  },
  {
    number: "06",
    title: "Payments and Mobile Money",
    paragraphs: [
      "When ECOLOGIX's payout workflow becomes available, we may process a recipient's Mobile Money number, selected telecom provider, verified account information, payout amount, transaction status, error reason, and telecom reference.",
      "ECOLOGIX does not need to store a user's Mobile Money PIN. Users must never provide their Mobile Money PIN, one-time password, or private wallet security code to ECOLOGIX staff or through an ECOLOGIX form.",
      "Payment information may be shared with the relevant payment or telecommunications provider when necessary to validate or execute a requested transaction.",
    ],
  },
  {
    number: "07",
    title: "When information may be shared",
    paragraphs: [
      "ECOLOGIX may share information with authorized employees, drivers, depot teams, managers, service providers, technology providers, payment providers, recycling partners, and professional advisers where access is necessary for a legitimate operational purpose.",
      "Access should be limited according to role and responsibility. For example, a driver may require pickup contact and location information, while a depot agent may require delivery and material-verification information.",
      "ECOLOGIX may also disclose information when required by applicable law, a valid legal process, a regulator, or where disclosure is reasonably necessary to protect users, staff, the public, or ECOLOGIX's systems.",
      "ECOLOGIX does not intend to sell personal information as a commercial data product.",
    ],
  },
  {
    number: "08",
    title: "Storage and security",
    paragraphs: [
      "ECOLOGIX uses technical and organizational safeguards intended to protect information against unauthorized access, loss, misuse, alteration, or disclosure.",
      "Current safeguards include authenticated staff accounts, role checks, database Row Level Security, server-side access controls, restricted administrative credentials, controlled request statuses, and separation between public metrics and private operational records.",
      "No internet service or storage system can guarantee absolute security. Users should protect their passwords, avoid sharing temporary credentials, and notify ECOLOGIX if they suspect unauthorized account access.",
    ],
  },
  {
    number: "09",
    title: "How long information is retained",
    paragraphs: [
      "ECOLOGIX intends to retain information only for as long as it is reasonably necessary for the purposes described in this policy, including service delivery, payment reconciliation, legal compliance, security, dispute handling, reporting, and audit requirements.",
      "Different records may require different retention periods. Operational, financial, security, and legal records may need to be retained longer than an unanswered general enquiry.",
      "ECOLOGIX will refine and document formal retention periods as production operations and regulatory requirements are finalized.",
    ],
  },
  {
    number: "10",
    title: "Your choices and requests",
    paragraphs: [
      "Subject to applicable law and operational requirements, a person may contact ECOLOGIX to ask whether personal information is being processed, request access or correction, raise an objection, ask for deletion where appropriate, or request further information about how data is used.",
      "Some information cannot be deleted immediately where it must be retained for a transaction, security investigation, legal obligation, audit trail, dispute, or fraud-prevention purpose.",
      "ECOLOGIX may need to verify the identity and authority of the person making a privacy request before providing or changing protected information.",
    ],
  },
  {
    number: "11",
    title: "Children and educational programs",
    paragraphs: [
      "ECOLOGIX may work with schools and youth-focused environmental programs. School or program representatives should provide appropriate adult supervision and authorization before submitting personal information about children.",
      "The public website is not designed to invite children to independently submit financial, location, or operational information without appropriate adult involvement.",
    ],
  },
  {
    number: "12",
    title: "Third-party services and links",
    paragraphs: [
      "ECOLOGIX may rely on services such as hosting providers, database providers, mapping or location services, email applications, telecommunications providers, and payment systems.",
      "Third-party websites and services may apply their own privacy policies and security practices. ECOLOGIX is not responsible for the content or privacy practices of an unrelated third-party website merely because the public website contains a link to it.",
    ],
  },
  {
    number: "13",
    title: "Changes to this policy",
    paragraphs: [
      "ECOLOGIX may update this Privacy Policy as the platform, operational workflows, payment integrations, legal requirements, and public services develop.",
      "The updated version will be published on this page with a revised effective date. Material changes may also be communicated through an appropriate additional notice.",
    ],
  },
  {
    number: "14",
    title: "Contact ECOLOGIX",
    paragraphs: [
      "Questions or requests about this policy can be sent to privacy@ecologix.org.",
      "General enquiries may be directed to hello@ecologix.org, while partnership enquiries may be sent through the dedicated partnership form.",
    ],
  },
];

export default function PrivacyPage() {
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
          <div className="max-w-5xl">
            <p className="wp-eyebrow wp-fade-up">
              Privacy at ECOLOGIX
            </p>

            <h1 className="wp-display-title wp-fade-up-delay-1 mt-8">
              Personal information
              <span className="wp-gradient-text block">
                deserves clear protection.
              </span>
            </h1>

            <p className="wp-body-large wp-fade-up-delay-2 mt-8 max-w-4xl">
              This policy explains what ECOLOGIX may collect, why it is needed,
              how it may be used, and how private operational information is
              separated from public circular-economy reporting.
            </p>

            <div className="wp-fade-up-delay-3 mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/contact" className="wp-primary-button">
                Contact ECOLOGIX
                <span aria-hidden="true">→</span>
              </Link>

              <Link href="/terms" className="wp-secondary-button">
                Read terms of use
              </Link>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <article className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                <p className="text-[0.62rem] font-black uppercase tracking-[0.2em] text-emerald-400">
                  Effective date
                </p>

                <p className="mt-3 text-lg font-black text-white">
                  19 July 2026
                </p>
              </article>

              <article className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                <p className="text-[0.62rem] font-black uppercase tracking-[0.2em] text-sky-400">
                  Operating country
                </p>

                <p className="mt-3 text-lg font-black text-white">
                  Cameroon
                </p>
              </article>

              <article className="rounded-3xl border border-amber-400/15 bg-amber-400/[0.055] p-6">
                <p className="text-[0.62rem] font-black uppercase tracking-[0.2em] text-amber-400">
                  Document status
                </p>

                <p className="mt-3 text-lg font-black text-white">
                  Pre-launch draft
                </p>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-amber-400/15 bg-amber-400/[0.045]">
        <div className="wp-page-container py-8">
          <p className="text-sm font-light leading-7 text-amber-100/75">
            This document is a practical pre-launch draft and does not replace
            advice from a qualified Cameroonian lawyer. It must be reviewed
            before ECOLOGIX accepts production users or processes live
            payments.
          </p>
        </div>
      </section>

      <section className="wp-section">
        <div className="wp-page-container">
          <div className="grid gap-12 xl:grid-cols-[0.72fr_1.28fr]">
            <aside className="xl:sticky xl:top-36 xl:self-start">
              <p className="wp-eyebrow">
                Policy contents
              </p>

              <h2 className="mt-7 text-3xl font-black tracking-[-0.05em] text-white">
                How ECOLOGIX handles information.
              </h2>

              <nav
                aria-label="Privacy policy sections"
                className="mt-8 grid gap-2 sm:grid-cols-2 xl:grid-cols-1"
              >
                {policySections.map((section) => (
                  <a
                    key={section.number}
                    href={`#privacy-${section.number}`}
                    className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.025] px-4 py-3 text-sm text-slate-500 transition-all duration-300 hover:border-emerald-400/20 hover:text-emerald-200"
                  >
                    <span className="font-mono text-[0.62rem] font-black text-slate-700">
                      {section.number}
                    </span>

                    <span>{section.title}</span>
                  </a>
                ))}
              </nav>
            </aside>

            <div className="space-y-5">
              {policySections.map((section) => (
                <section
                  key={section.number}
                  id={`privacy-${section.number}`}
                  className="scroll-mt-32 rounded-[2rem] border border-white/10 bg-white/[0.03] p-7 shadow-2xl sm:p-9"
                >
                  <div className="flex items-start gap-4">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.07] font-mono text-xs font-black text-emerald-400">
                      {section.number}
                    </span>

                    <h2 className="pt-1 text-2xl font-black tracking-[-0.04em] text-white sm:text-3xl">
                      {section.title}
                    </h2>
                  </div>

                  <div className="mt-7 space-y-5">
                    {section.paragraphs.map((paragraph) => (
                      <p
                        key={paragraph}
                        className="text-sm font-light leading-8 text-slate-400 sm:text-base"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="wp-section border-t border-white/10 bg-slate-900/25">
        <div className="wp-page-container">
          <div className="relative overflow-hidden rounded-[2.75rem] border border-white/10 bg-[linear-gradient(135deg,rgba(16,185,129,0.13),rgba(15,23,42,0.78)_48%,rgba(56,189,248,0.1))] px-7 py-14 shadow-2xl sm:px-12 sm:py-20 lg:px-16">
            <div className="relative grid gap-10 xl:grid-cols-[1fr_auto] xl:items-end">
              <div className="max-w-5xl">
                <p className="wp-eyebrow">
                  Privacy questions
                </p>

                <h2 className="mt-7 text-4xl font-black tracking-[-0.06em] text-white sm:text-5xl lg:text-7xl">
                  Ask how your
                  <span className="block font-light text-slate-400">
                    information is handled.
                  </span>
                </h2>

                <p className="wp-body-large mt-7 max-w-3xl">
                  Contact ECOLOGIX before submitting sensitive information when
                  you need clarification about a collection, account,
                  partnership, or payment workflow.
                </p>
              </div>

              <Link href="/contact" className="wp-primary-button">
                Contact ECOLOGIX
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}