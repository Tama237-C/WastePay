import Link from "next/link";
import { EcologixMark } from "@/components/brand/ecologix-mark";

const platformLinks = [
  {
    label: "Home collection",
    href: "/app#pickup",
  },
  {
    label: "Business collection",
    href: "/programs/business-collection",
  },
  {
    label: "Plastic buyback",
    href: "/programs/plastic-buyback",
  },
  {
    label: "Impact",
    href: "/impact",
  },
];

const companyLinks = [
  {
    label: "About ECOLOGIX",
    href: "/about",
  },
  {
    label: "How it works",
    href: "/how-it-works",
  },
  {
    label: "Partners",
    href: "/partners",
  },
  {
    label: "Contact",
    href: "/contact",
  },
];

const legalLinks = [
  {
    label: "Privacy policy",
    href: "/privacy",
  },
  {
    label: "Terms of use",
    href: "/terms",
  },
  {
    label: "Frequently asked questions",
    href: "/faq",
  },
  {
  label: "Accessibility",
  href: "/accessibility",
},
  {
    label: "Go to App",
    href: "/app/launch",
  },
];

export function PublicFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-slate-950">
      <div className="wp-emerald-glow -bottom-48 -left-40 h-[28rem] w-[28rem]" />

      <div className="wp-sky-glow -right-40 top-0 h-[30rem] w-[30rem]" />

      <div className="wp-page-container relative py-16 sm:py-20">
        <section className="relative overflow-hidden rounded-[2.25rem] border border-white/10 bg-white/[0.035] px-6 py-9 shadow-2xl backdrop-blur-xl sm:px-9 sm:py-11 lg:flex lg:items-center lg:justify-between lg:gap-12">
          <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 translate-x-1/3 -translate-y-1/3 rounded-full bg-emerald-400/10 blur-[100px]" />

          <div className="relative max-w-3xl">
            <p className="wp-eyebrow">
              Circular recovery begins locally
            </p>

            <h2 className="mt-6 text-3xl font-black tracking-[-0.05em] text-white sm:text-4xl lg:text-5xl">
              Turn today&apos;s plastic into tomorrow&apos;s value.
            </h2>

            <p className="mt-5 max-w-2xl text-base font-light leading-8 text-slate-400">
              Schedule a pickup, join a recovery program, or partner with
              ECOLOGIX to build Cameroon&apos;s circular plastic economy.
            </p>
          </div>

          <div className="relative mt-8 flex flex-col gap-3 sm:flex-row lg:mt-0 lg:shrink-0 lg:flex-col">
            <Link
              href="/app#pickup"
              className="wp-primary-button"
            >
              Book a collection
              <span aria-hidden="true">â†’</span>
            </Link>

            <Link
              href="/partners"
              className="wp-secondary-button"
            >
              Become a partner
            </Link>
          </div>
        </section>

        <div className="mt-16 grid gap-12 lg:grid-cols-[1.25fr_2fr]">
          <div className="max-w-md">
            <Link
              href="/"
              className="group inline-flex items-center gap-4"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-200/20 bg-white shadow-xl shadow-emerald-500/20 transition-transform duration-300 group-hover:-translate-y-1">
                <EcologixMark className="h-11 w-11" />
              </span>

              <span>
                <span className="block text-lg font-black uppercase tracking-[0.24em] text-white">
                  ECOLOGIX
                </span>

                <span className="mt-1.5 block text-[0.62rem] font-black uppercase tracking-[0.22em] text-emerald-400">
                  Circular plastic economy
                </span>
              </span>
            </Link>

            <p className="mt-6 text-sm font-light leading-7 text-slate-500">
              ECOLOGIX connects households, collectors, drivers, recovery
              depots, brands, and payment infrastructure in one transparent
              circular-plastic network.
            </p>

            <div className="mt-7 flex flex-wrap gap-2">
              <span className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-2 text-[0.62rem] font-black uppercase tracking-[0.17em] text-slate-500">
                Cameroon
              </span>

              <span className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-2 text-[0.62rem] font-black uppercase tracking-[0.17em] text-slate-500">
                Climate technology
              </span>

              <span className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-2 text-[0.62rem] font-black uppercase tracking-[0.17em] text-slate-500">
                Financial inclusion
              </span>
            </div>
          </div>

          <div className="grid gap-10 sm:grid-cols-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-white">
                Platform
              </p>

              <ul className="mt-5 space-y-3">
                {platformLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-500 transition-colors duration-300 hover:text-emerald-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-white">
                Company
              </p>

              <ul className="mt-5 space-y-3">
                {companyLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-500 transition-colors duration-300 hover:text-emerald-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-white">
                Resources
              </p>

              <ul className="mt-5 space-y-3">
                {legalLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-500 transition-colors duration-300 hover:text-emerald-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <hr className="wp-divider my-10" />

        <div className="flex flex-col gap-4 text-xs text-slate-600 sm:flex-row sm:items-center sm:justify-between">
          <p>
            Â© {currentYear} ECOLOGIX. Building Cameroon&apos;s circular
            plastic economy.
          </p>

          <p>
            Designed for transparent recovery, dignified work, and measurable
            impact.
          </p>
        </div>
      </div>
    </footer>
  );
}
