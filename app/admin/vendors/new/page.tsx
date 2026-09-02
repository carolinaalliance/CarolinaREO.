import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  MapPin,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import {
  createVendor,
} from "../actions";

export const dynamic =
  "force-dynamic";

export default function NewVendorPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-6 py-8">
        <div className="mb-8">
          <Link
            href="/admin/vendors"
            className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-950"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Vendor Management
          </Link>

          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Carolina REO
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-slate-950">
            Add Vendor
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Add a service provider to
            the Carolina REO approved
            vendor directory.
          </p>
        </div>

        <form
          action={createVendor}
          className="space-y-6"
        >
          <Section
            icon={
              <Building2 className="h-5 w-5" />
            }
            title="Company Information"
            description="Primary vendor identity and service category."
          >
            <div className="grid gap-5 md:grid-cols-2">
              <Field
                label="Company Name"
                name="company_name"
                required
                placeholder="Upstate Property Services"
              />

              <SelectField
                label="Vendor Type"
                name="vendor_type"
                options={[
                  "",
                  "Preservation",
                  "Securing / Rekey",
                  "Property Inspection",
                  "Repairs",
                  "Lawn / Landscaping",
                  "Trash Out",
                  "Cleaning",
                  "Winterization",
                  "General Contractor",
                  "HVAC",
                  "Plumbing",
                  "Electrical",
                  "Roofing",
                  "Other",
                ]}
              />
            </div>
          </Section>

          <Section
            icon={
              <UserRound className="h-5 w-5" />
            }
            title="Primary Contact"
            description="Main person responsible for Carolina REO assignments."
          >
            <div className="grid gap-5 md:grid-cols-3">
              <Field
                label="Contact Name"
                name="contact_name"
                placeholder="John Smith"
              />

              <Field
                label="Email"
                name="email"
                type="email"
                placeholder="john@example.com"
              />

              <Field
                label="Phone"
                name="phone"
                placeholder="864-555-1234"
              />
            </div>
          </Section>

          <Section
            icon={
              <MapPin className="h-5 w-5" />
            }
            title="Address & Service Coverage"
            description="Vendor location and geographic coverage."
          >
            <div className="grid gap-5">
              <Field
                label="Address Line 1"
                name="address_line_1"
                placeholder="123 Main Street"
              />

              <Field
                label="Address Line 2"
                name="address_line_2"
                placeholder="Suite 200"
              />

              <div className="grid gap-5 md:grid-cols-3">
                <Field
                  label="City"
                  name="city"
                  placeholder="Greenville"
                />

                <Field
                  label="State"
                  name="state"
                  placeholder="SC"
                />

                <Field
                  label="ZIP Code"
                  name="zip_code"
                  placeholder="29601"
                />
              </div>

              <Field
                label="Service Areas"
                name="service_areas"
                placeholder="Greenville, Pickens, Anderson, Spartanburg"
              />
            </div>
          </Section>

          <Section
            icon={
              <ShieldCheck className="h-5 w-5" />
            }
            title="Compliance"
            description="Track required vendor documentation."
          >
            <div className="grid gap-5 md:grid-cols-3">
              <CheckboxField
                label="W-9 on File"
                name="w9_on_file"
              />

              <CheckboxField
                label="Insurance on File"
                name="insurance_on_file"
              />

              <CheckboxField
                label="Tax ID on File"
                name="tax_id_on_file"
              />
            </div>

            <div className="mt-5 max-w-sm">
              <Field
                label="Insurance Expiration"
                name="insurance_expiration"
                type="date"
              />
            </div>
          </Section>

          <Section
            title="Internal Notes"
            description="Optional internal vendor-management notes."
          >
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Notes
              </label>

              <textarea
                name="notes"
                rows={5}
                placeholder="Vendor experience, special instructions, preferred counties, etc."
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-950 outline-none transition focus:border-slate-950"
              />
            </div>
          </Section>

          <div className="flex flex-wrap justify-end gap-3">
            <Link
              href="/admin/vendors"
              className="rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="rounded-lg bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Create Vendor
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

function Section({
  icon,
  title,
  description,
  children,
}: {
  icon?: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-6 py-5">
        <div className="flex items-start gap-3">
          {icon ? (
            <div className="mt-0.5 text-slate-500">
              {icon}
            </div>
          ) : null}

          <div>
            <h2 className="text-lg font-semibold text-slate-950">
              {title}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {description}
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {children}
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-semibold text-slate-700"
      >
        {label}

        {required ? (
          <span className="ml-1 text-red-600">
            *
          </span>
        ) : null}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-950 outline-none transition focus:border-slate-950"
      />
    </div>
  );
}

function SelectField({
  label,
  name,
  options,
}: {
  label: string;
  name: string;
  options: string[];
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-semibold text-slate-700"
      >
        {label}
      </label>

      <select
        id={name}
        name={name}
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-950 outline-none transition focus:border-slate-950"
      >
        {options.map((option) => (
          <option
            key={option || "blank"}
            value={option}
          >
            {option ||
              "Select vendor type"}
          </option>
        ))}
      </select>
    </div>
  );
}

function CheckboxField({
  label,
  name,
}: {
  label: string;
  name: string;
}) {
  return (
    <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
      <input
        type="checkbox"
        name={name}
        className="h-4 w-4 rounded border-slate-300"
      />

      <span className="text-sm font-semibold text-slate-700">
        {label}
      </span>
    </label>
  );
}
