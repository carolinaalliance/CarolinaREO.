import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

import {
  ArrowLeft,
  Banknote,
  CalendarDays,
  FileText,
  Receipt,
  UserRound,
} from "lucide-react";

import {
  updateExpense,
} from "../../actions";

export const dynamic =
  "force-dynamic";

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

function fieldValue(
  value?: string | number | null
) {
  if (
    value === null ||
    value === undefined
  ) {
    return "";
  }

  return String(value);
}

export default async function EditExpensePage({
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

  const [
    expenseResult,
    vendorsResult,
    workOrdersResult,
  ] = await Promise.all([
    supabase
      .from("reo_expenses")
      .select("*")
      .eq("id", id)
      .maybeSingle(),

    supabase
      .from("reo_vendors")
      .select(
        "id, company_name, vendor_type, active"
      )
      .order(
        "company_name",
        {
          ascending: true,
        }
      ),

    supabase
      .from("reo_work_orders")
      .select(
        "id, asset_id, vendor_id, work_order_number, title, category, final_cost"
      )
      .order(
        "created_at",
        {
          ascending: false,
        }
      ),
  ]);

  if (expenseResult.error) {
    throw expenseResult.error;
  }

  if (vendorsResult.error) {
    throw vendorsResult.error;
  }

  if (workOrdersResult.error) {
    throw workOrdersResult.error;
  }

  const expense =
    expenseResult.data;

  if (!expense) {
    notFound();
  }

  const vendors =
    vendorsResult.data || [];

  const workOrders =
    (workOrdersResult.data || []).filter(
      (workOrder) =>
        workOrder.asset_id ===
        expense.asset_id
    );

  const updateAction =
    updateExpense.bind(
      null,
      expense.id
    );

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-8">
          <Link
            href={`/admin/expenses/${expense.id}`}
            className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-400 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Expense
          </Link>

          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-green-400">
            Carolina REO
          </p>

          <h1 className="text-3xl font-bold tracking-tight">
            Edit Expense
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Update the accounting,
            approval, payment, and
            reimbursement record.
          </p>
        </div>

        <form
          action={updateAction}
          className="space-y-6"
        >
          <Section
            icon={
              <UserRound className="h-5 w-5" />
            }
            title="Vendor & Work Order"
          >
            <div className="grid gap-5 md:grid-cols-2">
              <SelectField
                label="Vendor"
                name="vendor_id"
                defaultValue={
                  expense.vendor_id || ""
                }
              >
                <option value="">
                  No vendor
                </option>

                {vendors.map(
                  (vendor) => (
                    <option
                      key={vendor.id}
                      value={vendor.id}
                    >
                      {vendor.company_name}
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
                  expense.work_order_id || ""
                }
              >
                <option value="">
                  No work order
                </option>

                {workOrders.map(
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
          </Section>

          <Section
            icon={
              <Receipt className="h-5 w-5" />
            }
            title="Invoice"
          >
            <div className="grid gap-5 md:grid-cols-2">
              <SelectField
                label="Expense Category"
                name="expense_category"
                defaultValue={
                  expense.expense_category ||
                  ""
                }
                required
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
                defaultValue={
                  fieldValue(
                    expense.invoice_number
                  )
                }
              />
            </div>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <Field
                label="Invoice Date"
                name="invoice_date"
                type="date"
                defaultValue={
                  fieldValue(
                    expense.invoice_date
                  )
                }
              />

              <Field
                label="Invoice Amount"
                name="invoice_amount"
                defaultValue={
                  fieldValue(
                    expense.invoice_amount
                  )
                }
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
                  expense.description || ""
                }
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-white outline-none transition focus:border-green-500/50"
              />
            </div>
          </Section>

          <Section
            icon={
              <FileText className="h-5 w-5" />
            }
            title="Approval"
          >
            <div className="grid gap-5 md:grid-cols-3">
              <SelectField
                label="Approval Status"
                name="approval_status"
                defaultValue={
                  expense.approval_status ||
                  "submitted"
                }
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
                defaultValue={
                  fieldValue(
                    expense.approved_amount
                  )
                }
              />

              <Field
                label="Approved Date"
                name="approved_date"
                type="date"
                defaultValue={
                  fieldValue(
                    expense.approved_date
                  )
                }
              />
            </div>
          </Section>

          <Section
            icon={
              <Banknote className="h-5 w-5" />
            }
            title="Payment"
          >
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              <SelectField
                label="Payment Status"
                name="payment_status"
                defaultValue={
                  expense.payment_status ||
                  "unpaid"
                }
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
                defaultValue={
                  fieldValue(
                    expense.paid_amount
                  )
                }
              />

              <Field
                label="Paid Date"
                name="paid_date"
                type="date"
                defaultValue={
                  fieldValue(
                    expense.paid_date
                  )
                }
              />

              <Field
                label="Payment Reference"
                name="payment_reference"
                defaultValue={
                  fieldValue(
                    expense.payment_reference
                  )
                }
              />
            </div>
          </Section>

          <Section
            icon={
              <CalendarDays className="h-5 w-5" />
            }
            title="Client Reimbursement"
          >
            <div className="grid gap-5 md:grid-cols-3">
              <SelectField
                label="Reimbursement Status"
                name="reimbursement_status"
                defaultValue={
                  expense.reimbursement_status ||
                  "not_submitted"
                }
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
                defaultValue={
                  fieldValue(
                    expense.reimbursed_amount
                  )
                }
              />

              <Field
                label="Reimbursed Date"
                name="reimbursed_date"
                type="date"
                defaultValue={
                  fieldValue(
                    expense.reimbursed_date
                  )
                }
              />
            </div>
          </Section>

          <Section
            title="Internal Notes"
          >
            <textarea
              name="internal_notes"
              rows={5}
              defaultValue={
                expense.internal_notes || ""
              }
              className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-white outline-none transition focus:border-green-500/50"
            />
          </Section>

          <div className="flex flex-wrap justify-end gap-3">
            <Link
              href={`/admin/expenses/${expense.id}`}
              className="rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/[0.06] hover:text-white"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-500"
            >
              Save Expense Changes
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
    <section className="rounded-2xl border border-white/10 bg-white/[0.025]">
      <div className="flex items-center gap-3 border-b border-white/10 px-6 py-5">
        {icon ? (
          <span className="text-green-400">
            {icon}
          </span>
        ) : null}

        <h2 className="text-lg font-semibold">
          {title}
        </h2>
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
  defaultValue = "",
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-semibold text-slate-300"
      >
        {label}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue}
        className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-white outline-none transition focus:border-green-500/50"
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
        defaultValue={defaultValue}
        required={required}
        className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none transition focus:border-green-500/50"
      >
        {children}
      </select>
    </div>
  );
}
