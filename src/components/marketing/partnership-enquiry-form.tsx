"use client";

import { useState } from "react";

type PartnershipEnquiryFormProps = {
  defaultExpanded?: boolean;
};

export function PartnershipEnquiryForm({
  defaultExpanded = false,
}: PartnershipEnquiryFormProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <section
      id="partnership-enquiry"
      className="overflow-hidden rounded-[2rem] border border-violet-400/15 bg-violet-400/[0.045] shadow-2xl"
    >
      <button
        type="button"
        onClick={() => setIsExpanded((current) => !current)}
        aria-expanded={isExpanded}
        aria-controls="partnership-enquiry-content"
        className="flex w-full items-center justify-between gap-6 px-6 py-6 text-left sm:px-8"
      >
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-violet-400">
            Organizations and institutions
          </p>

          <h2 className="mt-3 text-2xl font-black tracking-[-0.04em] text-white sm:text-3xl">
            Discuss an ECOLOGIX partnership
          </h2>

          <p className="mt-3 max-w-2xl text-sm font-light leading-7 text-slate-400">
            Tell us about your organization, recovery objectives, locations,
            and reporting needs.
          </p>
        </div>

        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-2xl text-slate-300">
          {isExpanded ? "âˆ’" : "+"}
        </span>
      </button>

      {isExpanded ? (
        <div
          id="partnership-enquiry-content"
          className="border-t border-white/10 px-6 py-7 sm:px-8 sm:py-8"
        >
          <form
            action="mailto:partners@ecologix.org"
            method="post"
            encType="text/plain"
            className="space-y-7"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="partner-full-name"
                  className="text-xs font-black uppercase tracking-[0.2em] text-slate-500"
                >
                  Full name
                </label>

                <input
                  id="partner-full-name"
                  name="full_name"
                  type="text"
                  required
                  autoComplete="name"
                  placeholder="Your full name"
                  className="mt-3 min-h-14 w-full rounded-2xl border border-white/10 bg-slate-950/45 px-5 py-4 text-white outline-none transition-all placeholder:text-slate-700 focus:border-violet-400/40 focus:ring-4 focus:ring-violet-400/10"
                />
              </div>

              <div>
                <label
                  htmlFor="partner-work-email"
                  className="text-xs font-black uppercase tracking-[0.2em] text-slate-500"
                >
                  Work email
                </label>

                <input
                  id="partner-work-email"
                  name="work_email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="name@organization.org"
                  className="mt-3 min-h-14 w-full rounded-2xl border border-white/10 bg-slate-950/45 px-5 py-4 text-white outline-none transition-all placeholder:text-slate-700 focus:border-violet-400/40 focus:ring-4 focus:ring-violet-400/10"
                />
              </div>

              <div>
                <label
                  htmlFor="partner-phone"
                  className="text-xs font-black uppercase tracking-[0.2em] text-slate-500"
                >
                  Phone or WhatsApp
                </label>

                <input
                  id="partner-phone"
                  name="phone"
                  type="tel"
                  required
                  autoComplete="tel"
                  placeholder="+237..."
                  className="mt-3 min-h-14 w-full rounded-2xl border border-white/10 bg-slate-950/45 px-5 py-4 text-white outline-none transition-all placeholder:text-slate-700 focus:border-violet-400/40 focus:ring-4 focus:ring-violet-400/10"
                />
              </div>

              <div>
                <label
                  htmlFor="partner-organization"
                  className="text-xs font-black uppercase tracking-[0.2em] text-slate-500"
                >
                  Organization
                </label>

                <input
                  id="partner-organization"
                  name="organization"
                  type="text"
                  required
                  autoComplete="organization"
                  placeholder="Organization name"
                  className="mt-3 min-h-14 w-full rounded-2xl border border-white/10 bg-slate-950/45 px-5 py-4 text-white outline-none transition-all placeholder:text-slate-700 focus:border-violet-400/40 focus:ring-4 focus:ring-violet-400/10"
                />
              </div>

              <div>
                <label
                  htmlFor="partner-type"
                  className="text-xs font-black uppercase tracking-[0.2em] text-slate-500"
                >
                  Organization type
                </label>

                <select
                  id="partner-type"
                  name="organization_type"
                  required
                  defaultValue=""
                  className="mt-3 min-h-14 w-full rounded-2xl border border-white/10 bg-slate-950 px-5 py-4 text-white outline-none transition-all focus:border-violet-400/40 focus:ring-4 focus:ring-violet-400/10"
                >
                  <option value="" disabled>
                    Select organization type
                  </option>
                  <option value="Corporate brand">Corporate brand</option>
                  <option value="Business or hotel">Business or hotel</option>
                  <option value="Municipality">Municipality</option>
                  <option value="School or university">
                    School or university
                  </option>
                  <option value="Development organization">
                    Development organization
                  </option>
                  <option value="Recovery or recycling partner">
                    Recovery or recycling partner
                  </option>
                  <option value="Investor or climate fund">
                    Investor or climate fund
                  </option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="partner-location"
                  className="text-xs font-black uppercase tracking-[0.2em] text-slate-500"
                >
                  City or region
                </label>

                <input
                  id="partner-location"
                  name="location"
                  type="text"
                  required
                  placeholder="Douala, YaoundÃ©, Littoral..."
                  className="mt-3 min-h-14 w-full rounded-2xl border border-white/10 bg-slate-950/45 px-5 py-4 text-white outline-none transition-all placeholder:text-slate-700 focus:border-violet-400/40 focus:ring-4 focus:ring-violet-400/10"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="partnership-interest"
                className="text-xs font-black uppercase tracking-[0.2em] text-slate-500"
              >
                Partnership interest
              </label>

              <select
                id="partnership-interest"
                name="partnership_interest"
                required
                defaultValue=""
                className="mt-3 min-h-14 w-full rounded-2xl border border-white/10 bg-slate-950 px-5 py-4 text-white outline-none transition-all focus:border-violet-400/40 focus:ring-4 focus:ring-violet-400/10"
              >
                <option value="" disabled>
                  Select your main interest
                </option>
                <option value="Corporate plastic recovery">
                  Corporate plastic recovery
                </option>
                <option value="Recurring business collection">
                  Recurring business collection
                </option>
                <option value="Municipal recovery infrastructure">
                  Municipal recovery infrastructure
                </option>
                <option value="School recovery program">
                  School recovery program
                </option>
                <option value="Brand-sponsored recovery campaign">
                  Brand-sponsored recovery campaign
                </option>
                <option value="Depot or recycling partnership">
                  Depot or recycling partnership
                </option>
                <option value="Funding or investment">
                  Funding or investment
                </option>
                <option value="Research or data collaboration">
                  Research or data collaboration
                </option>
              </select>
            </div>

            <div>
              <label
                htmlFor="expected-volume"
                className="text-xs font-black uppercase tracking-[0.2em] text-slate-500"
              >
                Expected plastic volume
                <span className="ml-2 text-[0.58rem] text-slate-700">
                  Optional
                </span>
              </label>

              <input
                id="expected-volume"
                name="expected_plastic_volume"
                type="text"
                placeholder="Example: 500 KG per month"
                className="mt-3 min-h-14 w-full rounded-2xl border border-white/10 bg-slate-950/45 px-5 py-4 text-white outline-none transition-all placeholder:text-slate-700 focus:border-violet-400/40 focus:ring-4 focus:ring-violet-400/10"
              />
            </div>

            <div>
              <label
                htmlFor="partnership-message"
                className="text-xs font-black uppercase tracking-[0.2em] text-slate-500"
              >
                Tell us about the partnership
              </label>

              <textarea
                id="partnership-message"
                name="message"
                required
                rows={6}
                placeholder="Describe your objectives, locations, material streams, proposed timeline, and reporting needs."
                className="mt-3 w-full resize-y rounded-2xl border border-white/10 bg-slate-950/45 px-5 py-4 text-white outline-none transition-all placeholder:text-slate-700 focus:border-violet-400/40 focus:ring-4 focus:ring-violet-400/10"
              />
            </div>

            <div className="rounded-2xl border border-violet-400/15 bg-violet-400/[0.06] p-5">
              <p className="text-sm font-light leading-7 text-violet-100/70">
                This initial form opens your email application and prepares a
                message for ECOLOGIX. A secure database-backed partnership
                enquiry system will be connected in a later module.
              </p>
            </div>

            <button type="submit" className="wp-primary-button w-full">
              Send partnership enquiry
              <span aria-hidden="true">â†’</span>
            </button>
          </form>
        </div>
      ) : null}
    </section>
  );
}