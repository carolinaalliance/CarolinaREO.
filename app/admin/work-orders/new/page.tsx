import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import {
  ArrowLeft,
  Building2,
  CalendarDays,
  ClipboardList,
  DollarSign,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import {
  createWorkOrder,
} from "../actions";

export const dynamic =
  "force-dynamic";

function getSupabase() {
  const supabaseUrl =
    process.env.SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL;

  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
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

export default async function NewWorkOrderPage({
  searchParams,
}: {
  searchParams: Promise<{
    vendor?: string;
    asset?: string;
  }>;
}) {
  const {
    vendor: vendorId,
    asset: assetId,
  } = await searchParams;

  const supabase =
    getSupabase();

  const [
    assetsResult,
    vendorsResult,
  ] = await Promise.all([
    supabase
      .from("reo_assets")
      .select(
        "id, property_address, city, state, workflow_stage, status"
      )
      .order(
        "property_address",
        {
          ascending: true,
        }
      ),

    supabase
      .from("reo_vendors")
      .select(
        "id, company_name, vendor_type, active"
      )
      .eq(
        "active",
        true
      )
      .order(
        "company_name",
        {
          ascending: true,
        }
      ),
  ]);

  if (assetsResult.error) {
    throw assetsResult.error;
  }

  if (vendorsResult.error) {
    throw vendorsResult.error;
  }

  const assets =
    assetsResult.data || [];

  const vendors =
    vendorsResult.data || [];

  const today =
    new Date()
      .toISOString()
      .slice(0, 10);

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-6 py-8">
        <div className="mb-8">
          <Link
            href={
              vendorId
                ? `/admin/vendors/${vendorId}`
                : "/admin"
            }
            className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-950"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>

          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Carolina REO
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-slate-950">
            Create Work Order
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Create and assign field work,
            preservation,
            securing,
            repairs,
            inspections,
            or other asset services.
          </p>
        </div>

        <form
          action={
            createWorkOrder
          }
          className="space-y-6"
        >
          <Section
            icon={
              <Building2 className="h-5 w-5" />
            }
            title="Asset Assignment"
            description="Select the Carolina REO asset associated with this work order."
          >
            <SelectField
              label="Asset"
              name="asset_id"
              required
              defaultValue={
                assetId || ""
              }
            >
              <option value="">
                Select asset
              </option>

              {assets.map(
                (asset) => (
                  <option
                    key={
                      asset.id
                    }
                    value={
                      asset.id
                    }
                  >
                    {[
                      asset.property_address,
                      asset.city,
                      asset.state,
                    ]
                      .filter(
                        Boolean
                      )
                      .join(
                        ", "
                      )}
                  </option>
                )
              )}
            </SelectField>
          </Section>

          <Section
            icon={
              <UserRound className="h-5 w-5" />
            }
            title="Vendor Assignment"
            description="Assign an active approved vendor."
          >
            <SelectField
              label="Vendor"
              name="vendor_id"
              defaultValue={
                vendorId || ""
              }
            >
              <option value="">
                Unassigned
              </option>

              {vendors.map(
                (vendor) => (
                  <option
                    key={
                      vendor.id
                    }
                    value={
                      vendor.id
                    }
                  >
                    {
                      vendor.company_name
                    }
                    {vendor.vendor_type
                      ? ` — ${vendor.vendor_type}`
                      : ""}
                  </option>
                )
              )}
            </SelectField>
          </Section>

          <Section
            icon={
              <ClipboardList className="h-5 w-5" />
            }
            title="Work Order Details"
            description="Describe the required work and service category."
          >
            <div className="grid gap-5 md:grid-cols-2">
              <SelectField
                label="Category"
                name="category"
                required
                defaultValue=""
              >
                <option value="">
                  Select category
                </option>

                <option value="Securing / Rekey">
                  Securing / Rekey
                </option>

                <option value="Preservation">
                  Preservation
                </option>

                <option value="Property Inspection">
                  Property Inspection
                </option>

                <option value="Repairs">
                  Repairs
                </option>

                <option value="Lawn / Landscaping">
                  Lawn / Landscaping
                </option>

                <option value="Trash Out">
                  Trash Out
                </option>

                <option value="Cleaning">
                  Cleaning
                </option>

                <option value="Winterization">
                  Winterization
                </option>

                <option value="Utilities">
                  Utilities
                </option>

                <option value="General Maintenance">
                  General Maintenance
                </option>

                <option value="Other">
                  Other
                </option>
              </SelectField>

              <SelectField
                label="Priority"
                name="priority"
                defaultValue="normal"
              >
                <option value="low">
                  Low
                </option>

                <option value="normal">
                  Normal
                </option>

                <option value="high">
                  High
                </option>

                <option value="urgent">
                  Urgent
                </option>
              </SelectField>
            </div>

            <div className="mt-5">
              <Field
                label="Work Order Title"
                name="title"
                required
                placeholder="Secure and Rekey Property"
              />
            </div>

            <div className="mt-5">
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Scope of Work
              </label>

              <textarea
                name="scope_of_work"
                rows={6}
                placeholder="Describe the required work, materials, completion standards, photo requirements, access instructions, and other field directions."
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-950 outline-none transition focus:border-slate-950"
              />
            </div>
          </Section>

          <Section
            icon={
              <DollarSign className="h-5 w-5" />
            }
            title="Financial Authorization"
            description="Track vendor authorization and expected cost."
          >
            <div className="grid gap-5 md:grid-cols-2">
              <Field
                label="Authorization Limit"
                name="authorization_limit"
                placeholder="500.00"
              />

              <Field
                label="Estimated Cost"
                name="estimated_cost"
                placeholder="175.00"
              />
            </div>
          </Section>

          <Section
            icon={
              <CalendarDays className="h-5 w-5" />
            }
            title="Schedule"
            description="Set assignment and completion expectations."
          >
            <div className="grid gap-5 md:grid-cols-2">
              <Field
                label="Assigned Date"
                name="assigned_date"
                type="date"
                defaultValue={
                  today
                }
              />

              <Field
                label="Due Date"
                name="due_date"
                type="date"
              />
            </div>
          </Section>

          <Section
            icon={
              <ShieldCheck className="h-5 w-5" />
            }
            title="Client Authorization"
            description="Flag work requiring institutional approval."
          >
            <CheckboxField
              label="Client approval required before work proceeds"
              name="client_approval_required"
            />
          </Section>

          <Section
            title="Internal Notes"
            description="Optional instructions or internal asset-management notes."
          >
            <textarea
              name="notes"
              rows={5}
              placeholder="Vendor instructions, client requirements, access notes, approval references, etc."
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-950 outline-none transition focus:border-slate-950"
            />
          </Section>

          <div className="flex flex-wrap justify-end gap-3">
            <Link
              href={
                vendorId
                  ? `/admin/vendors/${vendorId}`
                  : "/admin"
              }
              className="rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="rounded-lg bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Create Work Order
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
  defaultValue,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
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
        placeholder={placeholder}
        defaultValue={defaultValue}
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-950 outline-none transition focus:border-slate-950"
      />
    </div>
  );
}

function SelectField({
  label,
  name,
  defaultValue,
  required = false,
  children,
}: {
  label: string;
  name: string;
  defaultValue: string;
  required?: boolean;
  children: React.ReactNode;
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

      <select
        id={name}
        name={name}
        defaultValue={defaultValue}
        required={required}
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-950 outline-none transition focus:border-slate-950"
      >
        {children}
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
