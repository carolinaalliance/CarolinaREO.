import Link from "next/link";
import {
  notFound,
} from "next/navigation";

import {
  createClient,
} from "@supabase/supabase-js";

import {
  ArrowLeft,
  Building2,
  MapPin,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import {
  setVendorActiveStatus,
  updateVendor,
} from "../../actions";

export const dynamic =
  "force-dynamic";

function getSupabase() {
  const supabaseUrl =
    process.env.SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL;

  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SECRET_KEY;

  if (
    !supabaseUrl ||
    !serviceRoleKey
  ) {
    throw new Error(
      "Missing Supabase environment variables."
    );
  }

  return createClient(
    supabaseUrl,
    serviceRoleKey,
    {
      auth: {
        persistSession: false,
      },
    }
  );
}

export default async function EditVendorPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } =
    await params;

  const supabase =
    getSupabase();

  const {
    data: vendor,
    error,
  } =
    await supabase
      .from("reo_vendors")
      .select("*")
      .eq("id", id)
      .maybeSingle();

  if (error) {
    throw error;
  }

  if (!vendor) {
    notFound();
  }

  const updateVendorAction =
    updateVendor.bind(
      null,
      vendor.id
    );

  const toggleActiveAction =
    setVendorActiveStatus.bind(
      null,
      vendor.id,
      !vendor.active
    );

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-6 py-8">
        <div className="mb-8">
          <Link
            href={`/admin/vendors/${vendor.id}`}
            className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-950"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Vendor
          </Link>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                Carolina REO
              </p>

              <h1 className="text-3xl font-bold tracking-tight text-slate-950">
                Edit Vendor
              </h1>

              <p className="mt-2 text-sm text-slate-600">
                Update vendor details,
                compliance records,
                service coverage,
                and internal notes.
              </p>
            </div>

            <form
              action={
                toggleActiveAction
              }
            >
              <button
                type="submit"
                className={`rounded-lg px-4 py-2.5 text-sm font-semibold ${
                  vendor.active
                    ? "border border-red-200 bg-white text-red-700 hover:bg-red-50"
                    : "bg-emerald-600 text-white hover:bg-emerald-700"
                }`}
              >
                {vendor.active
                  ? "Deactivate Vendor"
                  : "Reactivate Vendor"}
              </button>
            </form>
          </div>
        </div>

        <form
          action={
            updateVendorAction
          }
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
                defaultValue={
                  vendor.company_name
                }
                required
              />

              <SelectField
                label="Vendor Type"
                name="vendor_type"
                defaultValue={
                  vendor.vendor_type ||
                  ""
                }
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
                defaultValue={
                  vendor.contact_name ||
                  ""
                }
              />

              <Field
                label="Email"
                name="email"
                type="email"
                defaultValue={
                  vendor.email ||
                  ""
                }
              />

              <Field
                label="Phone"
                name="phone"
                defaultValue={
                  vendor.phone ||
                  ""
                }
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
                defaultValue={
                  vendor.address_line_1 ||
                  ""
                }
              />

              <Field
                label="Address Line 2"
                name="address_line_2"
                defaultValue={
                  vendor.address_line_2 ||
                  ""
                }
              />

              <div className="grid gap-5 md:grid-cols-3">
                <Field
                  label="City"
                  name="city"
                  defaultValue={
                    vendor.city ||
                    ""
                  }
                />

                <Field
                  label="State"
                  name="state"
                  defaultValue={
                    vendor.state ||
                    ""
                  }
                />

                <Field
                  label="ZIP Code"
                  name="zip_code"
                  defaultValue={
                    vendor.zip_code ||
                    ""
                  }
                />
              </div>

              <Field
                label="Service Areas"
                name="service_areas"
                defaultValue={
                  vendor.service_areas ||
                  ""
                }
              />
            </div>
          </Section>

          <Section
            icon={
              <ShieldCheck className="h-5 w-5" />
            }
            title="Compliance"
            description="Maintain current vendor documentation."
          >
            <div className="grid gap-5 md:grid-cols-3">
              <CheckboxField
                label="W-9 on File"
                name="w9_on_file"
                defaultChecked={
                  vendor.w9_on_file
                }
              />

              <CheckboxField
                label="Insurance on File"
                name="insurance_on_file"
                defaultChecked={
                  vendor.insurance_on_file
                }
              />

              <CheckboxField
                label="Tax ID on File"
                name="tax_id_on_file"
                defaultChecked={
                  vendor.tax_id_on_file
                }
              />
            </div>

            <div className="mt-5 max-w-sm">
              <Field
                label="Insurance Expiration"
                name="insurance_expiration"
                type="date"
                defaultValue={
                  vendor.insurance_expiration ||
                  ""
                }
              />
            </div>
          </Section>

          <Section
            title="Internal Notes"
            description="Optional internal vendor-management notes."
          >
            <textarea
              name="notes"
              rows={6}
              defaultValue={
                vendor.notes ||
                ""
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-950 outline-none transition focus:border-slate-950"
            />
          </Section>

          <div className="flex flex-wrap justify-end gap-3">
            <Link
              href={`/admin/vendors/${vendor.id}`}
              className="rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="rounded-lg bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Save Vendor Changes
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
  defaultValue = "",
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  defaultValue?: string;
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
        defaultValue={
          defaultValue
        }
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-950 outline-none transition focus:border-slate-950"
      />
    </div>
  );
}

function SelectField({
  label,
  name,
  defaultValue,
  options,
}: {
  label: string;
  name: string;
  defaultValue: string;
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
        defaultValue={
          defaultValue
        }
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-950 outline-none transition focus:border-slate-950"
      >
        {options.map(
          (option) => (
            <option
              key={
                option ||
                "blank"
              }
              value={option}
            >
              {option ||
                "Select vendor type"}
            </option>
          )
        )}
      </select>
    </div>
  );
}

function CheckboxField({
  label,
  name,
  defaultChecked,
}: {
  label: string;
  name: string;
  defaultChecked: boolean;
}) {
  return (
    <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
      <input
        type="checkbox"
        name={name}
        defaultChecked={
          defaultChecked
        }
        className="h-4 w-4 rounded border-slate-300"
      />

      <span className="text-sm font-semibold text-slate-700">
        {label}
      </span>
    </label>
  );
}
