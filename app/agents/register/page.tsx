
"use client";

import { useState, type FormEvent } from "react";
import Script from "next/script";

const turnstileSiteKey =
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";

type AgentForm = {
  full_name: string;
  email: string;
  phone: string;
  brokerage_name: string;
  license_number: string;
  license_state: string;
  license_expiration: string;
  years_experience: string;
  reo_experience_years: string;
  service_states: string;
  service_counties: string;
  service_zip_codes: string;
  eo_insurance_carrier: string;
  eo_policy_expiration: string;
};

const initialForm: AgentForm = {
  full_name: "",
  email: "",
  phone: "",
  brokerage_name: "",
  license_number: "",
  license_state: "",
  license_expiration: "",
  years_experience: "",
  reo_experience_years: "",
  service_states: "",
  service_counties: "",
  service_zip_codes: "",
  eo_insurance_carrier: "",
  eo_policy_expiration: "",
};

const inputClass =
  "w-full rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20";

const labelClass =
  "mb-2 block text-sm font-medium text-slate-200";

function Field({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  required = false,
  min,
}: {
  label: string;
  name: keyof AgentForm;
  value: string;
  onChange: (name: keyof AgentForm, value: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  min?: number;
}) {
  return (
    <div>
      <label htmlFor={name} className={labelClass}>
        {label}
        {required && (
          <span className="ml-1 text-cyan-400">*</span>
        )}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={(event) =>
          onChange(name, event.target.value)
        }
        placeholder={placeholder}
        required={required}
        min={min}
        className={inputClass}
      />
    </div>
  );
}

function SectionHeader({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-6 border-b border-slate-800 pb-5">
      <div className="mb-2 flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-400/10 text-sm font-bold text-cyan-300">
          {number}
        </span>
        <h2 className="text-xl font-semibold text-white">
          {title}
        </h2>
      </div>
      <p className="text-sm leading-6 text-slate-400">
        {description}
      </p>
    </div>
  );
}

export default function AgentRegistrationPage() {
  const [form, setForm] = useState<AgentForm>(initialForm);
  const [confirmed, setConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
const [submitError, setSubmitError] = useState("");
const [submitSuccess, setSubmitSuccess] = useState("");


  function updateField(
    name: keyof AgentForm,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(
  event: FormEvent<HTMLFormElement>
) {
  event.preventDefault();

  // Registration remains closed until server-side
  // bot protection and rate limiting are configured.
  // This prevents accidental public submissions.
  alert(
    "Carolina REO Agent Registration is being finalized. " +
    "Applications will open soon."
  );
}

  return (
    <main className="min-h-screen bg-[#07111f] text-white">
      <div className="border-b border-slate-800 bg-[#0b1728]">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-5">
          <a href="/" className="group">
            <div className="text-xl font-bold tracking-wide text-white">
              CAROLINA <span className="text-cyan-400">REO</span>
            </div>
            <div className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-400">
              Asset Management Platform
            </div>
          </a>

          <a
            href="/"
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-cyan-400 hover:text-white"
          >
            Return to Home
          </a>
        </div>
      </div>

      <section className="relative overflow-hidden border-b border-slate-800 bg-gradient-to-br from-[#102943] via-[#0b1a2e] to-[#07111f]">
        <div className="pointer-events-none absolute -right-20 -top-28 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-6 py-16 md:py-20">
          <div className="mb-5 inline-flex rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-cyan-300">
            Agent Network Registration
          </div>

          <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight md:text-5xl">
            Join the Carolina REO
            <span className="block text-cyan-400">
              Agent Network
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Connect with institutional asset management
            opportunities through a centralized platform
            designed for professional real estate agents
            serving REO and distressed properties.
          </p>

          <div className="mt-9 grid max-w-3xl gap-4 sm:grid-cols-3">
            {[
              {
                number: "01",
                title: "Register",
                detail: "Submit your professional information.",
              },
              {
                number: "02",
                title: "Get Reviewed",
                detail: "Complete the agent qualification process.",
              },
              {
                number: "03",
                title: "Receive Assignments",
                detail: "Accept opportunities when approved and selected.",
              },
            ].map((item) => (
              <div
                key={item.number}
                className="rounded-xl border border-slate-700/80 bg-slate-900/60 p-5"
              >
                <div className="text-sm font-bold text-cyan-400">
                  {item.number}
                </div>
                <div className="mt-2 font-semibold">
                  {item.title}
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {item.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-6 py-12 lg:grid-cols-[minmax(0,1fr)_290px]">
        <div className="min-w-0">
          <div className="mb-8">
            <h2 className="text-2xl font-bold">
              Agent Registration Application
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Complete your professional profile to prepare
              for consideration in the Carolina REO network.
              Fields marked * are required.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-7">
            <div className="rounded-2xl border border-slate-800 bg-[#0d1b2d] p-6 md:p-8">
              <SectionHeader
                number="1"
                title="Contact Information"
                description="Provide the contact information used for agent communications."
              />

              <div className="grid gap-5 md:grid-cols-2">
                <Field
                  label="Full Name"
                  name="full_name"
                  value={form.full_name}
                  onChange={updateField}
                  placeholder="First and last name"
                  required
                />
                <Field
                  label="Email Address"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={updateField}
                  placeholder="agent@example.com"
                  required
                />
                <Field
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={updateField}
                  placeholder="(864) 555-0123"
                  required
                />
                <Field
                  label="Brokerage Company"
                  name="brokerage_name"
                  value={form.brokerage_name}
                  onChange={updateField}
                  placeholder="Your brokerage name"
                  required
                />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-[#0d1b2d] p-6 md:p-8">
              <SectionHeader
                number="2"
                title="Real Estate Licensing"
                description="Provide your current professional license information."
              />

              <div className="grid gap-5 md:grid-cols-2">
                <Field
                  label="License Number"
                  name="license_number"
                  value={form.license_number}
                  onChange={updateField}
                  required
                />
                <Field
                  label="License State"
                  name="license_state"
                  value={form.license_state}
                  onChange={updateField}
                  placeholder="SC"
                  required
                />
                <Field
                  label="License Expiration"
                  name="license_expiration"
                  type="date"
                  value={form.license_expiration}
                  onChange={updateField}
                  required
                />
                <Field
                  label="Years Licensed"
                  name="years_experience"
                  type="number"
                  min={0}
                  value={form.years_experience}
                  onChange={updateField}
                  placeholder="0"
                  required
                />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-[#0d1b2d] p-6 md:p-8">
              <SectionHeader
                number="3"
                title="REO Experience"
                description="Help institutional asset managers understand your property disposition experience."
              />

              <div className="grid gap-5 md:grid-cols-2">
                <Field
                  label="Years of REO Experience"
                  name="reo_experience_years"
                  type="number"
                  min={0}
                  value={form.reo_experience_years}
                  onChange={updateField}
                  placeholder="0"
                  required
                />
              </div>

              <p className="mt-5 rounded-xl border border-slate-700 bg-slate-950/40 p-4 text-sm leading-6 text-slate-400">
                Agents without prior REO experience may still
                apply. Experience information helps determine
                assignment suitability.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-[#0d1b2d] p-6 md:p-8">
              <SectionHeader
                number="4"
                title="Service Areas"
                description="Identify the geographic areas where you can complete assignments."
              />

              <div className="space-y-5">
                <Field
                  label="States Served"
                  name="service_states"
                  value={form.service_states}
                  onChange={updateField}
                  placeholder="SC, NC, GA"
                  required
                />
                <Field
                  label="Counties Served"
                  name="service_counties"
                  value={form.service_counties}
                  onChange={updateField}
                  placeholder="Greenville, Pickens, Spartanburg"
                  required
                />
                <Field
                  label="ZIP Codes Served"
                  name="service_zip_codes"
                  value={form.service_zip_codes}
                  onChange={updateField}
                  placeholder="29601, 29605, 29611"
                />
              </div>

              <p className="mt-4 text-xs text-slate-500">
                Separate multiple entries with commas.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-[#0d1b2d] p-6 md:p-8">
              <SectionHeader
                number="5"
                title="Errors & Omissions Insurance"
                description="Provide your current E&O insurance information."
              />

              <div className="grid gap-5 md:grid-cols-2">
                <Field
                  label="Insurance Carrier"
                  name="eo_insurance_carrier"
                  value={form.eo_insurance_carrier}
                  onChange={updateField}
                  placeholder="Insurance company"
                />
                <Field
                  label="Policy Expiration"
                  name="eo_policy_expiration"
                  type="date"
                  value={form.eo_policy_expiration}
                  onChange={updateField}
                />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-[#0d1b2d] p-6 md:p-8">
              <SectionHeader
                number="6"
                title="Application Acknowledgment"
                description="Review the following before submitting an application."
              />

              <label className="flex cursor-pointer items-start gap-3 text-sm leading-6 text-slate-300">
                <input
                  type="checkbox"
                  checked={confirmed}
                  onChange={(event) =>
                    setConfirmed(event.target.checked)
                  }
                  className="mt-1 h-4 w-4 accent-cyan-400"
                />
                <span>
                  I certify that the information provided
                  is accurate. I understand that registration
                  does not guarantee approval, property
                  assignments, or compensation. Additional
                  verification and documentation may be
                  required before approval.
                </span>
              </label>
            </div>

            <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-6">
              <h3 className="text-lg font-semibold">
                Application Submission Coming Next
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-300">
                The registration interface is ready for
                review. Secure application submission will
                be activated after the server-side handler
                and database protections are connected.
              </p>
              
{turnstileSiteKey ? (
  <div className="mt-5">
    <p className="mb-3 text-sm text-slate-300">
      Security Verification
    </p>
    <Script
      src="https://challenges.cloudflare.com/turnstile/v0/api.js"
      strategy="afterInteractive"
    />
    <div
      className="cf-turnstile"
      data-sitekey={turnstileSiteKey}
      data-theme="dark"
    />
  </div>
) : (
  <p className="mt-5 text-sm text-amber-300">
    Security verification is not configured.
  </p>
)}

              <button
                type="submit"
                disabled
                className="mt-5 w-full cursor-not-allowed rounded-xl bg-slate-700 px-6 py-4 font-semibold text-slate-400 opacity-70"
              >
                Submit Agent Application — Coming Soon
              </button>

              <p className="mt-3 text-center text-xs text-slate-500">
                Applications are not being collected yet.
              </p>
            </div>
          </form>
        </div>

        <aside className="space-y-5">
          <div className="rounded-2xl border border-slate-800 bg-[#0d1b2d] p-6">
            <h3 className="text-lg font-semibold">
              Why Join Carolina REO?
            </h3>

            <ul className="mt-5 space-y-4 text-sm leading-6 text-slate-300">
              <li>✓ Institutional asset management opportunities</li>
              <li>✓ Centralized property assignments</li>
              <li>✓ Clear task instructions and deadlines</li>
              <li>✓ Organized document submissions</li>
              <li>✓ Direct asset management communications</li>
              <li>✓ Professional assignment history</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-[#0d1b2d] p-6">
            <h3 className="text-lg font-semibold">
              How Assignments Work
            </h3>

            <ol className="mt-5 space-y-4 text-sm leading-6 text-slate-300">
              <li>
                <strong className="text-cyan-400">01.</strong>{" "}
                An Asset Manager selects an approved agent.
              </li>
              <li>
                <strong className="text-cyan-400">02.</strong>{" "}
                The agent receives a property assignment.
              </li>
              <li>
                <strong className="text-cyan-400">03.</strong>{" "}
                The agent accepts or declines.
              </li>
              <li>
                <strong className="text-cyan-400">04.</strong>{" "}
                Assignment-specific tasks become available.
              </li>
              <li>
                <strong className="text-cyan-400">05.</strong>{" "}
                The Asset Manager reviews deliverables.
              </li>
            </ol>
          </div>

          <div className="rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 to-transparent p-6">
            <h3 className="text-lg font-semibold">
              Professional Standards
            </h3>

            <p className="mt-3 text-sm leading-6 text-slate-300">
              Agent approval may require verification of
              licensing, insurance, service territories,
              and institutional compliance requirements.
            </p>

            <p className="mt-4 text-xs leading-5 text-slate-400">
              Carolina REO reserves the right to review,
              approve, suspend, or decline applications
              according to its qualification standards.
            </p>
          </div>
        </aside>
      </section>

      <footer className="border-t border-slate-800 bg-[#081321]">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-8">
          <div>
            <div className="font-semibold">
              CAROLINA <span className="text-cyan-400">REO</span>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Institutional Real Estate Asset Management
            </p>
          </div>

          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} Carolina REO.
            All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
