import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

import {
  ArrowLeft,
  Building2,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  ClipboardList,
  DollarSign,
  FileText,
  MapPin,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import {
  updateWorkOrder,
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

function money(
  value?: number | string | null
) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "Not provided";
  }

  const number =
    Number(value);

  if (!Number.isFinite(number)) {
    return "Not provided";
  }

  return new Intl.NumberFormat(
    "en-US",
    {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }
  ).format(number);
}

function formatDate(
  value?: string | null
) {
  if (!value) {
    return "Not provided";
  }

  return new Date(
    `${value}T12:00:00`
  ).toLocaleDateString();
}

function statusLabel(
  status?: string | null,
  verified?: boolean
) {
  if (
    status === "completed" &&
    verified
  ) {
    return "Completed / Verified";
  }

  switch (status) {
    case "assigned":
      return "Assigned";

    case "in_progress":
      return "In Progress";

    case "completed":
      return "Completed";

    case "cancelled":
      return "Cancelled";

    case "draft":
      return "Draft";

    default:
      return status ||
        "Not provided";
  }
}

function statusClasses(
  status?: string | null,
  verified?: boolean
) {
  if (
    status === "completed" &&
    verified
  ) {
    return "bg-emerald-100 text-emerald-800";
  }

  switch (status) {
    case "completed":
      return "bg-emerald-50 text-emerald-700";

    case "in_progress":
      return "bg-blue-50 text-blue-700";

    case "assigned":
      return "bg-amber-50 text-amber-700";

    case "cancelled":
      return "bg-red-50 text-red-700";

    default:
      return "bg-slate-100 text-slate-700";
  }
}

export default async function WorkOrderDetailPage({
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
    data: workOrder,
    error,
  } =
    await supabase
      .from("reo_work_orders")
      .select("*")
      .eq("id", id)
      .maybeSingle();

  if (error) {
    throw error;
  }

  if (!workOrder) {
    notFound();
  }

  const [
    assetResult,
    vendorResult,
  ] = await Promise.all([
    supabase
      .from("reo_assets")
      .select(
        "id, property_address, city, state, zip_code, workflow_stage, status"
      )
      .eq(
        "id",
        workOrder.asset_id
      )
      .maybeSingle(),

    workOrder.vendor_id
      ? supabase
          .from("reo_vendors")
          .select(
            "id, company_name, contact_name, email, phone, vendor_type, active"
          )
          .eq(
            "id",
            workOrder.vendor_id
          )
          .maybeSingle()
      : Promise.resolve({
          data: null,
          error: null,
        }),
  ]);

  if (assetResult.error) {
    throw assetResult.error;
  }

  if (vendorResult.error) {
    throw vendorResult.error;
  }

  const asset =
    assetResult.data;

  const vendor =
    vendorResult.data;

  const updateAction =
    updateWorkOrder.bind(
      null,
      workOrder.id
    );

  const authorizationRemaining =
    workOrder.authorization_limit !== null &&
    workOrder.final_cost !== null
      ? Number(
          workOrder.authorization_limit
        ) -
        Number(
          workOrder.final_cost
        )
      : null;

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8">
          <Link
            href={
              vendor
                ? `/admin/vendors/${vendor.id}`
                : asset
                  ? `/admin/assets/${asset.id}?tab=work-orders`
                  : "/admin"
            }
            className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-950"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                {
                  workOrder.work_order_number
                }
              </p>

              <div className="mt-2 flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-bold tracking-tight text-slate-950">
                  {workOrder.title}
                </h1>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClasses(
                    workOrder.status,
                    workOrder.completion_verified
                  )}`}
                >
                  {statusLabel(
                    workOrder.status,
                    workOrder.completion_verified
                  )}
                </span>
              </div>

              <p className="mt-2 text-sm text-slate-600">
                {workOrder.category}
              </p>
            </div>
          </div>
        </div>

        <section className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Authorization Limit"
            value={money(
              workOrder.authorization_limit
            )}
          />

          <StatCard
            label="Estimated Cost"
            value={money(
              workOrder.estimated_cost
            )}
          />

          <StatCard
            label="Final Cost"
            value={money(
              workOrder.final_cost
            )}
          />

          <StatCard
            label="Authorization Remaining"
            value={
              authorizationRemaining === null
                ? "Not provided"
                : money(
                    authorizationRemaining
                  )
            }
          />
        </section>

        <div className="mb-6 grid gap-6 xl:grid-cols-2">
          <Section
            icon={
              <Building2 className="h-5 w-5" />
            }
            title="Asset"
          >
            {asset ? (
              <>
                <InfoRow
                  label="Property"
                  value={
                    asset.property_address ||
                    "Not provided"
                  }
                />

                <InfoRow
                  icon={
                    <MapPin className="h-4 w-4" />
                  }
                  label="Location"
                  value={
                    [
                      asset.city,
                      asset.state,
                      asset.zip_code,
                    ]
                      .filter(Boolean)
                      .join(", ") ||
                    "Not provided"
                  }
                />

                <InfoRow
                  label="Workflow Stage"
                  value={
                    asset.workflow_stage ||
                    "Not provided"
                  }
                />

                <div className="pt-2">
                  <Link
                    href={`/admin/assets/${asset.id}`}
                    className="text-sm font-semibold text-slate-950 hover:underline"
                  >
                    Open Asset Workspace
                  </Link>
                </div>
              </>
            ) : (
              <p className="text-sm text-slate-500">
                Asset record not found.
              </p>
            )}
          </Section>

          <Section
            icon={
              <UserRound className="h-5 w-5" />
            }
            title="Assigned Vendor"
          >
            {vendor ? (
              <>
                <InfoRow
                  label="Company"
                  value={
                    vendor.company_name
                  }
                />

                <InfoRow
                  label="Contact"
                  value={
                    vendor.contact_name ||
                    "Not provided"
                  }
                />

                <InfoRow
                  label="Phone"
                  value={
                    vendor.phone ||
                    "Not provided"
                  }
                />

                <InfoRow
                  label="Email"
                  value={
                    vendor.email ||
                    "Not provided"
                  }
                />

                <div className="pt-2">
                  <Link
                    href={`/admin/vendors/${vendor.id}`}
                    className="text-sm font-semibold text-slate-950 hover:underline"
                  >
                    Open Vendor Workspace
                  </Link>
                </div>
              </>
            ) : (
              <p className="text-sm text-slate-500">
                No vendor is currently assigned.
              </p>
            )}
          </Section>
        </div>

        <form
          action={updateAction}
          className="space-y-6"
        >
          <Section
            icon={
              <ClipboardList className="h-5 w-5" />
            }
            title="Work Order"
          >
            <div className="grid gap-5 md:grid-cols-2">
              <Field
                label="Work Order Title"
                name="title"
                defaultValue={
                  workOrder.title ||
                  ""
                }
                required
              />

              <SelectField
                label="Category"
                name="category"
                defaultValue={
                  workOrder.category ||
                  ""
                }
              >
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
            </div>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <SelectField
                label="Status"
                name="status"
                defaultValue={
                  workOrder.status ||
                  "assigned"
                }
              >
                <option value="draft">
                  Draft
                </option>

                <option value="assigned">
                  Assigned
                </option>

                <option value="in_progress">
                  In Progress
                </option>

                <option value="completed">
                  Completed
                </option>

                <option value="cancelled">
                  Cancelled
                </option>
              </SelectField>

              <SelectField
                label="Priority"
                name="priority"
                defaultValue={
                  workOrder.priority ||
                  "normal"
                }
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
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Scope of Work
              </label>

              <textarea
                name="scope_of_work"
                rows={7}
                defaultValue={
                  workOrder.scope_of_work ||
                  ""
                }
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-950 outline-none transition focus:border-slate-950"
              />
            </div>
          </Section>

          <Section
            icon={
              <DollarSign className="h-5 w-5" />
            }
            title="Financial Authorization"
          >
            <div className="grid gap-5 md:grid-cols-3">
              <Field
                label="Authorization Limit"
                name="authorization_limit"
                defaultValue={
                  workOrder.authorization_limit ??
                  ""
                }
              />

              <Field
                label="Estimated Cost"
                name="estimated_cost"
                defaultValue={
                  workOrder.estimated_cost ??
                  ""
                }
              />

              <Field
                label="Final Cost"
                name="final_cost"
                defaultValue={
                  workOrder.final_cost ??
                  ""
                }
              />
            </div>
          </Section>

          <Section
            icon={
              <CalendarDays className="h-5 w-5" />
            }
            title="Schedule & Completion"
          >
            <div className="grid gap-5 md:grid-cols-3">
              <Field
                label="Assigned Date"
                name="assigned_date"
                type="date"
                defaultValue={
                  workOrder.assigned_date ||
                  ""
                }
              />

              <Field
                label="Due Date"
                name="due_date"
                type="date"
                defaultValue={
                  workOrder.due_date ||
                  ""
                }
              />

              <Field
                label="Completed Date"
                name="completed_date"
                type="date"
                defaultValue={
                  workOrder.completed_date ||
                  ""
                }
              />
            </div>
          </Section>

          <Section
            icon={
              <ShieldCheck className="h-5 w-5" />
            }
            title="Client Authorization"
          >
            <div className="grid gap-5 md:grid-cols-2">
              <CheckboxField
                label="Client approval required"
                name="client_approval_required"
                defaultChecked={
                  Boolean(
                    workOrder.client_approval_required
                  )
                }
              />

              <CheckboxField
                label="Client approved"
                name="client_approved"
                defaultChecked={
                  Boolean(
                    workOrder.client_approved
                  )
                }
              />
            </div>

            <div className="mt-5 max-w-sm">
              <Field
                label="Client Approval Date"
                name="client_approval_date"
                type="date"
                defaultValue={
                  workOrder.client_approval_date ||
                  ""
                }
              />
            </div>
          </Section>

          <Section
            icon={
              <FileText className="h-5 w-5" />
            }
            title="Invoice"
          >
            <div className="grid gap-5 md:grid-cols-2">
              <CheckboxField
                label="Invoice received"
                name="invoice_received"
                defaultChecked={
                  Boolean(
                    workOrder.invoice_received
                  )
                }
              />

              <Field
                label="Invoice Number"
                name="invoice_number"
                defaultValue={
                  workOrder.invoice_number ||
                  ""
                }
              />
            </div>
          </Section>

          <Section
            icon={
              <ClipboardCheck className="h-5 w-5" />
            }
            title="Completion Verification"
          >
            <CheckboxField
              label="Work completed and verified by Carolina REO"
              name="completion_verified"
              defaultChecked={
                Boolean(
                  workOrder.completion_verified
                )
              }
            />

            {workOrder.completion_verified ? (
              <div className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                <CheckCircle2 className="h-4 w-4" />
                Completion has been verified.
              </div>
            ) : null}
          </Section>

          <Section
            title="Internal Notes"
          >
            <textarea
              name="notes"
              rows={5}
              defaultValue={
                workOrder.notes ||
                ""
              }
              placeholder="Internal notes, vendor communication, approval details, completion observations, etc."
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-950 outline-none transition focus:border-slate-950"
            />
          </Section>

          <div className="flex justify-end">
            <button
              type="submit"
              className="rounded-lg bg-slate-950 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Save Work Order
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
  children,
}: {
  icon?: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center gap-3 border-b border-slate-200 px-6 py-5">
        {icon ? (
          <span className="text-slate-500">
            {icon}
          </span>
        ) : null}

        <h2 className="text-lg font-semibold text-slate-950">
          {title}
        </h2>
      </div>

      <div className="p-6">
        {children}
      </div>
    </section>
  );
}

function InfoRow({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-5 border-b border-slate-100 pb-3 last:border-0 last:pb-0">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        {icon}
        <span>
          {label}
        </span>
      </div>

      <span className="text-right text-sm font-semibold text-slate-800">
        {value}
      </span>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  defaultValue = "",
  required = false,
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string | number;
  required?: boolean;
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
        defaultValue={defaultValue}
        required={required}
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-950 outline-none transition focus:border-slate-950"
      />
    </div>
  );
}

function SelectField({
  label,
  name,
  defaultValue,
  children,
}: {
  label: string;
  name: string;
  defaultValue: string;
  children: React.ReactNode;
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
        defaultValue={defaultValue}
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
        defaultChecked={defaultChecked}
        className="h-4 w-4 rounded border-slate-300"
      />

      <span className="text-sm font-semibold text-slate-700">
        {label}
      </span>
    </label>
  );
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
        {value}
      </p>
    </div>
  );
}
