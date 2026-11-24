import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Accessibility Statement | ECOLOGIX",
  description:
    "Read ECOLOGIX’s accessibility goals, current measures, known limitations, and how to report a barrier when using the public website or operational platform.",
  openGraph: {
    title: "ECOLOGIX Accessibility Statement",
    description:
      "ECOLOGIX is working toward an inclusive public website and operational platform that can be used across devices and abilities.",
    type: "website",
    locale: "en_CM",
    siteName: "ECOLOGIX",
  },
};

const commitments = [
  {
    number: "01",
    title: "Perceivable content",
    description:
      "ECOLOGIX aims to provide readable text, meaningful headings, sufficient contrast, visible focus states, and text alternatives for important visual content.",
  },
  {
    number: "02",
    title: "Operable interfaces",
    description:
      "Navigation, forms, buttons, menus, and interactive controls should remain usable with a keyboard and should provide sufficiently large touch targets on mobile devices.",
  },
  {
    number: "03",
    title: "Understandable experiences",
    description:
      "ECOLOGIX aims to use clear language, consistent navigation, descriptive labels, understandable validation messages, and predictable status changes.",
  },
  {
    number: "04",
    title: "Robust implementation",
    description:
      "Pages and components should use semantic HTML and established web standards so they work with modern browsers and common assistive technologies.",
  },
];

const currentMeasures = [
  "Semantic page headings and landmark elements",
  "Keyboard-visible focus indicators",
  "Mobile-first responsive layouts",
  "Large operational touch targets",
  "Form labels connected to their inputs",
  "Status and error messages presented in text",
  "Reduced-motion support through browser preferences",
  "High-contrast dark interface components",
  "Native disclosure controls for frequently asked questions",
  "Clear separation between navigation, content, and footer",
];

const knownLimitations = [
  {
    title: "Formal audit not yet completed",
    description:
      "ECOLOGIX has not yet completed an independent accessibility audit, so the website should not presently claim full WCAG conformance.",
  },
  {
    title: "Camera and barcode workflows",
    description:
      "Future camera-based scanning and verification tools may require additional accessible alternatives for users who cannot operate a camera workflow.",
  },
  {
    title: "Maps and geographic interfaces",
    description:
      "Future route maps and depot-location interfaces will need equivalent text-based information and keyboard-accessible controls.",
  },
  {
    title: "Third-party services",
    description:
      "Email applications, telecommunications providers, payment services, and other external systems may have accessibility limitations outside ECOLOGIX’s direct control.",
  },
];

const reportingDetails = [
  {
    label: "Page or screen",
    value:
      "Tell us the exact page address or the name of the ECOLOGIX screen where the problem occurred.",
  },
  {
    label: "Barrier encountered",
    value:
      "Describe what you were attempting to do and what prevented you from completing the task.",
  },
  {
    label: "Device and browser",
    value:
      "Include the phone, computer, browser, or assistive technology you were using where possible.",
  },
  {
    label: "Preferred response method",
    value:
      "Tell us whether you would prefer a response by email, telephone, or WhatsApp.",
  },
];

export default function AccessibilityPage() {
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
          <div className="max-w-5xl">
            <p className="wp-eyebrow wp-fade-up">
              Accessibility at ECOLOGIX
            </p>

            <h1 className="wp-display-title wp-fade-up-delay-1 mt-8">
              Circular participation
              <span className="wp-gradient-text block">
                should be inclusive.
              </span>
            </h1>

            <p className="wp-body-large wp-fade-up-delay-2 mt-8 max-w-4xl">
              ECOLOGIX is working to make its public website and operational
              platform usable by people with different abilities, devices,
              technologies, and levels of digital experience.
            </p>

            <div className="wp-fade-up-delay-3 mt-9 flex flex-col gap-3 sm:flex-row">
              <a
                href="mailto:accessibility@ecologix.org"
                className="wp-primary-button"
              >
                Report an accessibility barrier
                <span aria-hidden="true">→</span>
              </a>

              <Link href="/contact" className="wp-secondary-button">
                Contact ECOLOGIX
              </Link>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <article className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                <p className="text-[0.62rem] font-black uppercase tracking-[0.2em] text-emerald-400">
                  Accessibility target
                </p>

                <p className="mt-3 text-lg font-black text-white">
                  WCAG 2.2 Level AA
                </p>
              </article>

              <article className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                <p className="text-[0.62rem] font-black uppercase tracking-[0.2em] text-sky-400">
                  Current status
                </p>

                <p className="mt-3 text-lg font-black text-white">
                  Continuous improvement
                </p>
              </article>

              <article className="rounded-3xl border border-amber-400/15 bg-amber-400/[0.055] p-6">
                <p className="text-[0.62rem] font-black uppercase tracking-[0.2em] text-amber-400">
                  Audit status
                </p>

                <p className="mt-3 text-lg font-black text-white">
                  Independent review pending
                </p>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-amber-400/15 bg-amber-400/[0.045]">
        <div className="wp-page-container py-8">
          <p className="text-sm font-light leading-7 text-amber-100/75">
            ECOLOGIX is targeting WCAG 2.2 Level AA, but a complete independent
            audit has not yet been performed. This statement describes our
            current objectives and known limitations rather than claiming full
            conformance.
          </p>
        </div>
      </section>

      <section className="wp-section">
        <div className="wp-page-container">
          <div className="max-w-5xl">
            <p className="wp-eyebrow">
              Our accessibility principles
            </p>

            <h2 className="wp-section-title mt-7">
              Four principles guide
              <span className="block font-light text-slate-500">
                every ECOLOGIX interface.
              </span>
            </h2>

            <p className="wp-body-large mt-7 max-w-4xl">
              ECOLOGIX’s target reflects the four WCAG principles: perceivable,
              operable, understandable, and robust.
            </p>
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-2">
            {commitments.map((commitment) => (
              <article
                key={commitment.number}
                className="group rounded-[2rem] border border-white/10 bg-white/[0.03] p-7 shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:border-emerald-400/20 sm:p-8"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.07] font-mono text-xs font-black text-emerald-400">
                  {commitment.number}
                </span>

                <h3 className="mt-7 text-2xl font-black tracking-[-0.04em] text-white sm:text-3xl">
                  {commitment.title}
                </h3>

                <p className="mt-5 text-base font-light leading-8 text-slate-500">
                  {commitment.description}
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
                Measures already included
              </p>

              <h2 className="wp-section-title mt-7">
                Accessibility begins
                <span className="block font-light text-slate-500">
                  inside the product design.
                </span>
              </h2>

              <p className="wp-body-large mt-7">
                The current ECOLOGIX interface includes several accessibility
                measures, although they still require structured testing.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {currentMeasures.map((measure, index) => (
                <article
                  key={measure}
                  className="flex min-h-28 items-start gap-4 rounded-3xl border border-white/10 bg-white/[0.03] p-5 shadow-2xl"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-sky-400/15 bg-sky-400/[0.07] font-mono text-[0.62rem] font-black text-sky-400">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <p className="pt-2 text-sm font-bold leading-6 text-slate-300">
                    {measure}
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
              Known limitations
            </p>

            <h2 className="wp-section-title mt-7">
              Some workflows still
              <span className="block font-light text-slate-500">
                require further accessibility work.
              </span>
            </h2>
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-2">
            {knownLimitations.map((limitation, index) => (
              <article
                key={limitation.title}
                className="rounded-[2rem] border border-amber-400/15 bg-amber-400/[0.045] p-7 shadow-2xl sm:p-8"
              >
                <p className="font-mono text-xs font-black text-amber-400">
                  {String(index + 1).padStart(2, "0")}
                </p>

                <h3 className="mt-6 text-2xl font-black tracking-[-0.04em] text-white">
                  {limitation.title}
                </h3>

                <p className="mt-5 text-sm font-light leading-7 text-slate-500 sm:text-base">
                  {limitation.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="wp-section border-y border-white/10 bg-slate-900/25">
        <div className="wp-page-container">
          <div className="grid gap-12 xl:grid-cols-[0.82fr_1.18fr]">
            <div>
              <p className="wp-eyebrow">
                Report a barrier
              </p>

              <h2 className="wp-section-title mt-7">
                Tell us what prevented
                <span className="wp-gradient-text block">
                  you from completing a task.
                </span>
              </h2>

              <p className="wp-body-large mt-7 max-w-3xl">
                Accessibility reports help ECOLOGIX prioritize practical
                improvements across public, driver, agent, manager, and
                administrative experiences.
              </p>

              <a
                href="mailto:accessibility@ecologix.org"
                className="wp-primary-button mt-9"
              >
                Email accessibility team
                <span aria-hidden="true">→</span>
              </a>
            </div>

            <div className="space-y-4">
              {reportingDetails.map((detail, index) => (
                <article
                  key={detail.label}
                  className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 shadow-2xl sm:p-7"
                >
                  <div className="flex items-start gap-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-violet-400/15 bg-violet-400/[0.07] font-mono text-[0.62rem] font-black text-violet-400">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <div>
                      <h3 className="text-lg font-black text-white">
                        {detail.label}
                      </h3>

                      <p className="mt-3 text-sm font-light leading-7 text-slate-500">
                        {detail.value}
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
          <div className="relative overflow-hidden rounded-[2.75rem] border border-white/10 bg-[linear-gradient(135deg,rgba(16,185,129,0.13),rgba(15,23,42,0.78)_48%,rgba(167,139,250,0.1))] px-7 py-14 shadow-2xl sm:px-12 sm:py-20 lg:px-16">
            <div className="relative grid gap-10 xl:grid-cols-[1fr_auto] xl:items-end">
              <div className="max-w-5xl">
                <p className="wp-eyebrow">
                  Alternative assistance
                </p>

                <h2 className="mt-7 text-4xl font-black tracking-[-0.06em] text-white sm:text-5xl lg:text-7xl">
                  Ask ECOLOGIX for
                  <span className="block font-light text-slate-400">
                    another way to participate.
                  </span>
                </h2>

                <p className="wp-body-large mt-7 max-w-3xl">
                  When a digital workflow is inaccessible, contact ECOLOGIX and
                  describe the assistance or alternative format you require.
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