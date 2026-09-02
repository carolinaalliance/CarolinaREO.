import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import {
  ArrowLeft,
  Banknote,
  Building2,
  CalendarDays,
  ClipboardList,
  FileText,
  Receipt,
  UserRound,
} from "lucide-react";
import {
  createExpense,
} from "../actions";

export const dynamic = "force-dynamic";

function getSupabase() {
  const supabaseUrl =
    process.env.SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL;

  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !serviceKey) {
    throw new Error(
      "Supabase server environment variables are missing."
    );
  }

  return createClient(
    supabaseUrl,
    serviceKey,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
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
    return "";
  }

  const number = Number(value);

  if (!Number.isFinite(number)) {
    return "";
  }

  return String(number);
}

export default async function NewExpensePage({
  searchParams,
}: {
  searchParams: Promise<{
    asset?: string;
    workOrder?: string;
    vendor?: string;
  }>;
}) {
  const {
    asset: assetId,
    workOrder: workOrderId,
    vendor: vendorId,
  } = await searchParams;

  const supabase =
    getSupabase();

  const [
    assetsResult,
    vendorsResult,
    workOrdersResult,
  ] = await Promise.all([
    supabase
      .from("reo_assets")
      .select(
        "id, property_address, city, state, postal_code"
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

    supabase
      .from("reo_work_orders")
      .select(`
        id,
        asset_id,
        vendor_id,
        work_order_number,
        title,
        category,
        final_cost,
        status
      `)
      .order(
        "created_at",
        {
          ascending: false,
        }
      ),
  ]);

  if (assetsResult.error) {
    throw assetsResult.error;
  }

  if (vendorsResult.error) {
    throw vendorsResult.error;
  }

  if (workOrdersResult.error) {
    throw workOrdersResult.error;
  }

  const assets =
    assetsResult.data || [];

  const vendors =
    vendorsResult.data || [];

  const allWorkOrders =
    workOrdersResult.data || [];

  const filteredWorkOrders =
    assetId
      ? allWorkOrders.filter(
          (workOrder) =>
            workOrder.asset_id ===
            assetId
        )
      : allWorkOrders;

  const selectedWorkOrder =
    workOrderId
      ? allWorkOrders.find(
          (workOrder) =>
            workOrder.id ===
            workOrderId
        )
      : null;

  const defaultVendorId =
    vendorId ||
    selectedWorkOrder?.vendor_id ||
    "";

  const defaultInvoiceAmount =
    selectedWorkOrder?.final_cost ??
    "";

  const today =
    new Date()
      .toISOString()
      .slice(0, 10);

  const backHref =
    assetId
      ? `/admin/assets/${assetId}?tab=expenses`
      : "/admin";

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-8">
          <Link
            href={backHref}
            className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-400 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Expenses
          </Link>

          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-green-400">
            Carolina REO
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-white">
            Record Expense / Vendor Invoice
          </h1>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
            Record an asset expense,
            vendor invoice, approval,
            payment, and reimbursement
            information.
          </p>
        </div>

        <form
  action={createExpense}
  className="space-y-6"
>
          <Section
            icon={
              <Building2 className="h-5 w-5" />
            }
            title="Asset"
            description="Select the asset associated with this expense."
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
                    key={asset.id}
                    value={asset.id}
                  >
                    {[
                      asset.property_address,
                      asset.city,
                      asset.state,
                      asset.postal_code,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </option>
                )
              )}
            </SelectField>
          </Section>

          <Section
            icon={
              <UserRound className="h-5 w-5" />
            }
            title="Vendor & Work Order"
            description="Connect this accounting record to the originating vendor and field work."
          >
            <div className="grid gap-5 md:grid-cols-2">
              <SelectField
                label="Vendor"
                name="vendor_id"
                defaultValue={
                  defaultVendorId
                }
              >
                <option value="">
                  No vendor
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

              <SelectField
                label="Work Order"
                name="work_order_id"
                defaultValue={
                  workOrderId || ""
                }
              >
                <option value="">
                  No work order
                </option>

                {filteredWorkOrders.map(
                  (workOrder) => (
                    <option
                      key={
                        workOrder.id
                      }
                      value={
                        workOrder.id
                      }
                    >
                      {
                        workOrder.work_order_number
                      }{" "}
                      —{" "}
                      {
                        workOrder.title
                      }
                    </option>
                  )
                )}
              </SelectField>
            </div>

            <p className="mt-4 text-xs leading-5 text-slate-500">
              Linking an expense to a work
              order does not create a second
              operational cost. The expense
              record becomes the accounting
              trail for invoice, payment, and
              reimbursement.
            </p>
          </Section>

          <Section
            icon={
              <Receipt className="h-5 w-5" />
            }
            title="Invoice"
            description="Record the vendor invoice or other asset expense."
          >
            <div className="grid gap-5 md:grid-cols-2">
              <SelectField
                label="Expense Category"
                name="expense_category"
                required
                defaultValue={
                  selectedWorkOrder?.category ||
                  ""
                }
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

                <option value="Utilities">
                  Utilities
                </option>

                <option value="Legal / Title">
                  Legal / Title
                </option>

                <option value="HOA">
                  HOA
                </option>

                <option value="Taxes">
                  Taxes
                </option>

                <option value="Commission">
                  Commission
                </option>

                <option value="Closing">
                  Closing
                </option>

                <option value="Other">
                  Other
                </option>
              </SelectField>

              <Field
                label="Invoice Number"
                name="invoice_number"
                placeholder="TEST-1001"
              />
            </div>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <Field
                label="Invoice Date"
                name="invoice_date"
                type="date"
                defaultValue={
                  today
                }
              />

              <Field
                label="Invoice Amount"
                name="invoice_amount"
                placeholder="165.00"
                defaultValue={money(
                  defaultInvoiceAmount
                )}
              />
            </div>

            <div className="mt-5">
              <label className="mb-2 block text-sm font-semibold text-slate-300">
                Description
              </label>

              <textarea
                name="description"
                rows={5}
                defaultValue={
                  selectedWorkOrder
                    ? selectedWorkOrder.title
                    : ""
                }
                placeholder="Describe the expense or vendor services."
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-green-500/50"
              />
            </div>
          </Section>

          <Section
            icon={
              <FileText className="h-5 w-5" />
            }
            title="Approval"
            description="Track institutional or internal expense approval."
          >
            <div className="grid gap-5 md:grid-cols-3">
              <SelectField
                label="Approval Status"
                name="approval_status"
                defaultValue="submitted"
              >
                <option value="submitted">
                  Submitted
                </option>

                <option value="approved">
                  Approved
                </option>

                <option value="rejected">
                  Rejected
                </option>

                <option value="voided">
                  Voided
                </option>
              </SelectField>

              <Field
                label="Approved Amount"
                name="approved_amount"
                placeholder="165.00"
              />

              <Field
                label="Approved Date"
                name="approved_date"
                type="date"
              />
            </div>
          </Section>

          <Section
            icon={
              <Banknote className="h-5 w-5" />
            }
            title="Payment"
            description="Track payment to the vendor or service provider."
          >
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              <SelectField
                label="Payment Status"
                name="payment_status"
                defaultValue="unpaid"
              >
                <option value="unpaid">
                  Unpaid
                </option>

                <option value="scheduled">
                  Scheduled
                </option>

                <option value="paid">
                  Paid
                </option>

                <option value="voided">
                  Voided
                </option>
              </SelectField>

              <Field
                label="Paid Amount"
                name="paid_amount"
                placeholder="165.00"
              />

              <Field
                label="Paid Date"
                name="paid_date"
                type="date"
              />

              <Field
                label="Payment Reference"
                name="payment_reference"
                placeholder="Check # / ACH reference"
              />
            </div>
          </Section>

          <Section
            icon={
              <CalendarDays className="h-5 w-5" />
            }
            title="Client Reimbursement"
            description="Track reimbursement of the asset expense by the institutional client."
          >
            <div className="grid gap-5 md:grid-cols-3">
              <SelectField
                label="Reimbursement Status"
                name="reimbursement_status"
                defaultValue="not_submitted"
              >
                <option value="not_submitted">
                  Not Submitted
                </option>

                <option value="submitted">
                  Submitted
                </option>

                <option value="approved">
                  Approved
                </option>

                <option value="reimbursed">
                  Reimbursed
                </option>

                <option value="denied">
                  Denied
                </option>
              </SelectField>

              <Field
                label="Reimbursed Amount"
                name="reimbursed_amount"
                placeholder="165.00"
              />

              <Field
                label="Reimbursed Date"
                name="reimbursed_date"
                type="date"
              />
            </div>
          </Section>

          <Section
            icon={
              <ClipboardList className="h-5 w-5" />
            }
            title="Supporting Document"
            description="Invoice upload will be connected in the next document-storage step."
          >
            <div className="rounded-xl border border-dashed border-white/15 bg-white/[0.02] p-6">
              <p className="text-sm font-semibold text-slate-300">
                Invoice / Receipt Upload
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Document upload is not active
                yet. We will connect this to
                Supabase Storage after the
                accounting record is saving
                correctly.
              </p>
            </div>
          </Section>

          <Section
            title="Internal Notes"
            description="Optional accounting, approval, payment, or reimbursement notes."
          >
            <textarea
              name="internal_notes"
              rows={5}
              placeholder="Internal accounting notes, client approval references, reimbursement notes, etc."
              className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-green-500/50"
            />
          </Section>

          <div className="flex flex-wrap justify-end gap-3">
            <Link
              href={backHref}
              className="rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/[0.06] hover:text-white"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-500"
            >
              Save Expense
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
    <section className="rounded-2xl border border-white/10 bg-white/[0.025]">
      <div className="border-b border-white/10 px-6 py-5">
        <div className="flex items-start gap-3">
          {icon ? (
            <div className="mt-0.5 text-green-400">
              {icon}
            </div>
          ) : null}

          <div>
            <h2 className="text-lg font-semibold text-white">
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
        className="mb-2 block text-sm font-semibold text-slate-300"
      >
        {label}

        {required ? (
          <span className="ml-1 text-red-400">
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
        className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-green-500/50"
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
        className="mb-2 block text-sm font-semibold text-slate-300"
      >
        {label}

        {required ? (
          <span className="ml-1 text-red-400">
            *
          </span>
        ) : null}
      </label>

      <select
        id={name}
        name={name}
        required={required}
        defaultValue={defaultValue}
        className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none transition focus:border-green-500/50"
      >
        {children}
      </select>
    </div>
  );
}
