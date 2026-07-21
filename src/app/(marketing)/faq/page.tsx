import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | WastePay",
  description:
    "Find answers about WastePay plastic collection, accepted materials, minimum pickup quantities, depot operations, partnerships, payments, privacy, and service availability.",
  keywords: [
    "WastePay FAQ",
    "plastic collection Cameroon",
    "home plastic pickup questions",
    "plastic recycling Cameroon",
    "WastePay partnership questions",
    "plastic buyback Cameroon",
  ],
  openGraph: {
    title: "WastePay Frequently Asked Questions",
    description:
      "Answers about collection requests, accepted plastic, recovery operations, payments, partnerships, and WastePay services.",
    type: "website",
    locale: "en_CM",
    siteName: "WastePay",
  },
  twitter: {
    card: "summary_large_image",
    title: "WastePay Frequently Asked Questions",
    description:
      "Understand how WastePay collection, recovery, verification, and partnerships work.",
  },
};

type FaqItem = {
  question: string;
  answer: string;
};

type FaqCategory = {
  number: string;
  eyebrow: string;
  title: string;
  description: string;
  accentClass: string;
  badgeClass: string;
  items: FaqItem[];
};

const faqCategories: FaqCategory[] = [
  {
    number: "01",
    eyebrow: "Collection requests",
    title: "Booking a plastic pickup",
    description:
      "Questions about who can submit a request, minimum quantities, locations, and what happens after submission.",
    accentClass:
      "border-emerald-400/15 bg-emerald-400/[0.045]",
    badgeClass:
      "border-emerald-400/20 bg-emerald-400/[0.08] text-emerald-400",
    items: [
      {
        question: "Who can request a WastePay collection?",
        answer:
          "Residents, residential communities, schools, offices, hotels, businesses, and other institutions can submit a collection request through the public WastePay form.",
      },
      {
        question: "Is there a minimum quantity for home collection?",
        answer:
          "WastePay currently plans residential pickup operations around a minimum estimated quantity of 15 kilograms. Operational approval may also depend on service coverage, route availability, and the assigned depot.",
      },
      {
        question: "Do I need to create an account before requesting a pickup?",
        answer:
          "No. The current public collection form allows a requester to submit a pickup without creating an account.",
      },
      {
        question: "Why does WastePay request my GPS location?",
        answer:
          "The secure browser location helps WastePay understand where the pickup is located, identify the appropriate recovery depot, and support future routing. Exact location information is not displayed publicly.",
      },
      {
        question: "What happens after I submit the form?",
        answer:
          "The request enters WastePay's administrative review queue. An authorized administrator can approve or reject it, assign a recovery depot, and dispatch an authenticated driver.",
      },
      {
        question: "Does submitting a request guarantee collection?",
        answer:
          "No. Each request must be reviewed based on location, estimated quantity, current depot coverage, driver availability, and operational capacity.",
      },
    ],
  },
  {
    number: "02",
    eyebrow: "Accepted materials",
    title: "Preparing plastic for recovery",
    description:
      "Guidance on the material categories WastePay is designed to accept and how plastic should be prepared.",
    accentClass:
      "border-sky-400/15 bg-sky-400/[0.045]",
    badgeClass:
      "border-sky-400/20 bg-sky-400/[0.08] text-sky-400",
    items: [
      {
        question: "Which plastic materials does WastePay accept?",
        answer:
          "WastePay's initial operational focus is PET, HDPE, and PP plastic. More detailed material rules will be published as depot intake and pricing operations expand.",
      },
      {
        question: "Should the plastic be sorted before pickup?",
        answer:
          "Yes. Plastic should be separated from food waste, liquids, glass, metal, hazardous materials, and general household rubbish. Sorting by plastic type is strongly encouraged.",
      },
      {
        question: "Do bottles need to be cleaned?",
        answer:
          "Containers should be emptied and reasonably clean. Heavily contaminated plastic may be rejected or separated during depot verification.",
      },
      {
        question: "Can I include plastic bags and sachets?",
        answer:
          "Acceptance depends on the material category and the operating capability of the assigned depot. The initial platform prioritizes PET, HDPE, and PP streams rather than every flexible-plastic format.",
      },
      {
        question: "Can WastePay collect mixed household waste?",
        answer:
          "No. WastePay is being built as a plastic-recovery network, not a general household-waste disposal service.",
      },
    ],
  },
  {
    number: "03",
    eyebrow: "Drivers and depots",
    title: "Collection and verification",
    description:
      "How WastePay drivers, recovery depots, agents, and controlled status transitions support accountability.",
    accentClass:
      "border-violet-400/15 bg-violet-400/[0.045]",
    badgeClass:
      "border-violet-400/20 bg-violet-400/[0.08] text-violet-400",
    items: [
      {
        question: "Who collects the plastic?",
        answer:
          "An approved request can be assigned to an active WastePay driver using a protected operational account.",
      },
      {
        question: "Where does the collected plastic go?",
        answer:
          "The material is delivered to the recovery depot assigned during administrative review.",
      },
      {
        question: "How is the weight confirmed?",
        answer:
          "The resident's estimate is not treated as the final verified weight. A depot agent records the actual scale measurement during material intake.",
      },
      {
        question: "Can any depot agent process every delivery?",
        answer:
          "No. WastePay connects operational agents to specific depots. Database security is designed to limit an agent to deliveries associated with the assigned recovery centre.",
      },
      {
        question: "Why are photos and barcode scans planned?",
        answer:
          "Photographs strengthen verification, while barcode scans can connect recovered packaging to products, brands, manufacturers, and material categories.",
      },
    ],
  },
  {
    number: "04",
    eyebrow: "Pricing and payments",
    title: "Turning verified plastic into value",
    description:
      "How material rates, verification, approval, and future Mobile Money settlement are intended to work.",
    accentClass:
      "border-amber-400/15 bg-amber-400/[0.045]",
    badgeClass:
      "border-amber-400/20 bg-amber-400/[0.08] text-amber-400",
    items: [
      {
        question: "Does WastePay currently pay every home pickup requester?",
        answer:
          "The full pricing, manager-approval, and Mobile Money payout workflow is still under development. A submitted collection request should not be interpreted as a guaranteed payment offer.",
      },
      {
        question: "How will WastePay calculate plastic value?",
        answer:
          "The planned pricing engine uses a base material rate, a regional multiplier, and any active campaign bonus. The calculation will rely on verified material type and weight.",
      },
      {
        question: "Will payments use MTN MoMo and Orange Money?",
        answer:
          "WastePay plans to support MTN Mobile Money and Orange Money for verified payouts in Cameroon after the payment integrations, validation controls, and reconciliation workflow are production-ready.",
      },
      {
        question: "Why is manager approval required?",
        answer:
          "Manager approval reduces the risk of incorrect weights, fraudulent records, unauthorized payouts, and mistakes before funds are released.",
      },
      {
        question: "Will every material type have the same price?",
        answer:
          "No. Different plastic types can have different market values and recovery costs. Pricing can also vary by region, time period, and campaign.",
      },
    ],
  },
  {
    number: "05",
    eyebrow: "Programs and partnerships",
    title: "Working with WastePay",
    description:
      "Information for businesses, municipalities, schools, brands, funders, and recycling partners.",
    accentClass:
      "border-rose-400/15 bg-rose-400/[0.04]",
    badgeClass:
      "border-rose-400/20 bg-rose-400/[0.08] text-rose-300",
    items: [
      {
        question: "Can a business arrange recurring collection?",
        answer:
          "WastePay plans structured recurring recovery programs for offices, hotels, campuses, retailers, and other organizations that produce regular plastic volumes.",
      },
      {
        question: "Can WastePay support a school or university program?",
        answer:
          "Yes. Education programs can combine collection points, scheduled pickups, student participation, environmental education, and recovery reporting.",
      },
      {
        question: "How can a brand sponsor plastic recovery?",
        answer:
          "A brand can discuss a program based on target materials, locations, recovery volumes, product intelligence, campaign duration, and reporting requirements.",
      },
      {
        question: "Can municipalities work with WastePay?",
        answer:
          "WastePay is designed to support municipal cooperation around collection demand, service zones, depots, field operations, and public impact reporting.",
      },
      {
        question: "How do I start a partnership discussion?",
        answer:
          "Open the Partners page and select Start a partnership discussion. The Contact page will automatically open the dedicated partnership enquiry form.",
      },
    ],
  },
  {
    number: "06",
    eyebrow: "Privacy and public data",
    title: "Protecting operational information",
    description:
      "How WastePay separates private personal information from public aggregate impact reporting.",
    accentClass:
      "border-cyan-400/15 bg-cyan-400/[0.04]",
    badgeClass:
      "border-cyan-400/20 bg-cyan-400/[0.08] text-cyan-300",
    items: [
      {
        question: "Does the public Impact page show personal information?",
        answer:
          "No. Public metrics should display aggregate totals only. Names, phone numbers, exact GPS coordinates, staff emails, and private transaction details are not intended for public display.",
      },
      {
        question: "Who can access operational dashboards?",
        answer:
          "Operational dashboards are protected by authentication and role checks. Staff members are routed to the tools appropriate for their assigned role.",
      },
      {
        question: "Why does WastePay store operational history?",
        answer:
          "Status history, verification records, assignments, weights, and future payment references are necessary for accountability, dispute resolution, reporting, and system security.",
      },
      {
        question: "Is the partnership form stored in WastePay's database?",
        answer:
          "Not yet. The current initial partnership form prepares an email through the visitor's email application. A secure database-backed enquiry workflow is planned for a later module.",
      },
    ],
  },
];

const quickAnswers = [
  {
    label: "Minimum planned pickup",
    value: "15 KG",
    detail: "Subject to coverage and review",
  },
  {
    label: "Initial material focus",
    value: "PET · HDPE · PP",
    detail: "Verified at depot intake",
  },
  {
    label: "Public booking account",
    value: "Not required",
    detail: "Submit through the public form",
  },
  {
    label: "Current operating market",
    value: "Cameroon",
    detail: "Pilot infrastructure expanding",
  },
];

export default function FaqPage() {
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
                Frequently asked questions
              </p>

              <h1 className="wp-display-title wp-fade-up-delay-1 mt-8">
                Clear answers for
                <span className="wp-gradient-text block">
                  circular participation.
                </span>
              </h1>

              <p className="wp-body-large wp-fade-up-delay-2 mt-8 max-w-3xl">
                Understand WastePay collection requests, accepted materials,
                depot verification, future payments, partnerships, privacy, and
                operational coverage.
              </p>

              <div className="wp-fade-up-delay-3 mt-9 flex flex-col gap-3 sm:flex-row">
                <Link href="/contact" className="wp-primary-button">
                  Request collection
                  <span aria-hidden="true">→</span>
                </Link>

                <Link
                  href="/contact?type=partnership"
                  className="wp-secondary-button"
                >
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
                  <p className="text-[0.62rem] font-black uppercase tracking-[0.23em] text-emerald-400">
                    Quick answers
                  </p>

                  <h2 className="mt-5 text-3xl font-black tracking-[-0.05em] text-white sm:text-4xl">
                    Essential information before you participate.
                  </h2>

                  <div className="mt-8 grid gap-3 sm:grid-cols-2">
                    {quickAnswers.map((answer) => (
                      <article
                        key={answer.label}
                        className="rounded-2xl border border-white/10 bg-slate-950/55 p-5"
                      >
                        <p className="text-[0.56rem] font-black uppercase tracking-[0.17em] text-slate-600">
                          {answer.label}
                        </p>

                        <p className="mt-3 text-lg font-black text-white">
                          {answer.value}
                        </p>

                        <p className="mt-2 text-xs leading-5 text-slate-600">
                          {answer.detail}
                        </p>
                      </article>
                    ))}
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-6 -right-3 hidden rounded-2xl border border-white/10 bg-slate-950/90 p-5 shadow-2xl backdrop-blur-xl sm:block">
                <p className="text-[0.56rem] font-black uppercase tracking-[0.18em] text-slate-600">
                  Still uncertain?
                </p>

                <p className="mt-2 text-sm font-black text-white">
                  Contact WastePay before submitting.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.018]">
        <div className="wp-page-container py-8">
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {faqCategories.map((category) => (
              <a
                key={category.number}
                href={`#faq-${category.number}`}
                className="flex min-h-20 items-center justify-center rounded-2xl border border-white/[0.07] bg-white/[0.025] px-4 text-center text-[0.62rem] font-black uppercase tracking-[0.14em] text-slate-500 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-400/20 hover:text-emerald-300"
              >
                {category.eyebrow}
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="wp-section">
        <div className="wp-page-container">
          <div className="max-w-5xl">
            <p className="wp-eyebrow">
              WastePay knowledge centre
            </p>

            <h2 className="wp-section-title mt-7">
              Practical answers,
              <span className="block font-light text-slate-500">
                organized by recovery stage.
              </span>
            </h2>
          </div>

          <div className="mt-14 space-y-8">
            {faqCategories.map((category) => (
              <section
                key={category.number}
                id={`faq-${category.number}`}
                className={`scroll-mt-32 rounded-[2.25rem] border p-6 shadow-2xl sm:p-8 lg:p-10 ${category.accentClass}`}
              >
                <div className="grid gap-8 xl:grid-cols-[0.72fr_1.28fr]">
                  <div>
                    <span
                      className={`flex h-14 w-14 items-center justify-center rounded-2xl border font-mono text-xs font-black ${category.badgeClass}`}
                    >
                      {category.number}
                    </span>

                    <p className="mt-7 text-xs font-black uppercase tracking-[0.22em] text-slate-500">
                      {category.eyebrow}
                    </p>

                    <h2 className="mt-4 text-3xl font-black tracking-[-0.045em] text-white sm:text-4xl">
                      {category.title}
                    </h2>

                    <p className="mt-5 max-w-xl text-sm font-light leading-7 text-slate-500 sm:text-base">
                      {category.description}
                    </p>
                  </div>

                  <div className="space-y-3">
                    {category.items.map((item, index) => (
                      <details
                        key={item.question}
                        className="group rounded-2xl border border-white/10 bg-slate-950/50 open:border-white/20 open:bg-slate-950/70"
                      >
                        <summary className="flex min-h-20 cursor-pointer list-none items-center justify-between gap-5 px-5 py-4 sm:px-6">
                          <span className="flex items-center gap-4">
                            <span className="font-mono text-[0.58rem] font-black text-slate-700">
                              {String(index + 1).padStart(2, "0")}
                            </span>

                            <span className="text-sm font-black leading-6 text-white sm:text-base">
                              {item.question}
                            </span>
                          </span>

                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-lg text-slate-400 transition-transform duration-300 group-open:rotate-45 group-open:text-emerald-300">
                            +
                          </span>
                        </summary>

                        <div className="border-t border-white/10 px-5 py-5 sm:px-6">
                          <p className="text-sm font-light leading-7 text-slate-400 sm:text-base">
                            {item.answer}
                          </p>
                        </div>
                      </details>
                    ))}
                  </div>
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>

      <section className="wp-section border-t border-white/10 bg-slate-900/25">
        <div className="wp-page-container">
          <div className="relative overflow-hidden rounded-[2.75rem] border border-white/10 bg-[linear-gradient(135deg,rgba(16,185,129,0.13),rgba(15,23,42,0.78)_48%,rgba(56,189,248,0.1))] px-7 py-14 shadow-2xl sm:px-12 sm:py-20 lg:px-16">
            <div
              aria-hidden="true"
              className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-emerald-400/15 blur-[100px]"
            />

            <div className="relative grid gap-10 xl:grid-cols-[1fr_auto] xl:items-end">
              <div className="max-w-5xl">
                <p className="wp-eyebrow">
                  Need a more specific answer?
                </p>

                <h2 className="mt-7 text-4xl font-black tracking-[-0.06em] text-white sm:text-5xl lg:text-7xl">
                  Speak with the
                  <span className="block font-light text-slate-400">
                    appropriate WastePay team.
                  </span>
                </h2>

                <p className="wp-body-large mt-7 max-w-3xl">
                  Use the Contact page for collection support or open the
                  partnership journey for institutional enquiries.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row xl:flex-col">
                <Link href="/contact" className="wp-primary-button">
                  Contact WastePay
                  <span aria-hidden="true">→</span>
                </Link>

                <Link
                  href="/how-it-works"
                  className="wp-secondary-button"
                >
                  Review the process
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}