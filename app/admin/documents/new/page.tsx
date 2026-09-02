import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

import {
  ArrowLeft,
  Building2,
  FileText,
  Receipt,
  UserRound,
  Wrench,
} from "lucide-react";

import {
  createAssetDocument,
} from "../actions";

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

export default async function NewDocumentPage({
  searchParams,
}: {
  searchParams: Promise<{
    asset?: string;
    expense?: string;
    workOrder?: string;
    vendor?: string;
  }>;
}) {
  const {
    asset: assetId,
    expense: expenseId,
    workOrder: workOrderId,
    vendor: vendorId,
  } = await searchParams;

  const supabase =
    getSupabase();

  const [
    assetsResult,
    expensesResult,
    workOrdersResult,
    vendorsResult,
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
      .from("reo_expenses")
      .select(
        "id, asset_id, invoice_number, expense_category"
      )
      .order(
        "created_at",
        {
          ascending: false,
        }
      ),

    supabase
      .from("reo_work_orders")
      .select(
        "id, asset_id, work_order_number, title"
      )
      .order(
        "created_at",
        {
          ascending: false,
        }
      ),

    supabase
      .from("reo_vendors")
      .select(
        "id, company_name, active"
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

  if (expensesResult.error) {
    throw expensesResult.error;
  }

  if (workOrdersResult.error) {
    throw workOrdersResult.error;
  }

  if (vendorsResult.error) {
    throw vendorsResult.error;
  }

  const assets =
    assetsResult.data || [];

  const allExpenses =
    expensesResult.data || [];

  const allWorkOrders =
    workOrdersResult.data || [];

  const vendors =
    vendorsResult.data || [];

  const expenses =
    assetId
      ? allExpenses.filter(
          (expense) =>
            expense.asset_id ===
            assetId
        )
      : allExpenses;

  const workOrders =
    assetId
      ? allWorkOrders.filter(
          (workOrder) =>
            workOrder.asset_id ===
            assetId
        )
      : allWorkOrders;

  const backHref =
    assetId
      ? `/admin/assets/${assetId}?tab=documents`
      : "/admin";

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-5xl px-6 py-8">
        <div className="mb-8">
          <Link
            href={backHref}
            className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-400 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Documents
          </Link>

          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-green-400">
            Carolina REO
          </p>

          <h1 className="text-3xl font-bold tracking-tight">
            Upload Asset Document
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Upload and permanently associate
            a document with the asset,
            expense, work order, or vendor.
          </p>
        </div>

        <form
          action={
            createAssetDocument
          }
          className="space-y-6"
        >
          <Section
            icon={
              <Building2 className="h-5 w-5" />
            }
            title="Asset"
          >
            <SelectField
              label="Asset"
              name="asset_id"
              defaultValue={
                assetId || ""
              }
              required
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
              <FileText className="h-5 w-5" />
            }
            title="Document"
          >
            <div className="grid gap-5 md:grid-cols-2">
              <SelectField
                label="Document Type"
                name="document_type"
                defaultValue=""
                required
              >
                <option value="">
                  Select document type
                </option>

                <option value="vendor_invoice">
                  Vendor Invoice
                </option>

                <option value="inspection_report">
                  Inspection Report
                </option>

                <option value="bpo">
                  BPO
                </option>

                <option value="appraisal">
                  Appraisal
                </option>

                <option value="preservation">
                  Preservation
                </option>

                <option value="repair">
                  Repair
                </option>

                <option value="work_order">
                  Work Order
                </option>

                <option value="listing">
                  Listing / Marketing
                </option>

                <option value="contract">
                  Contract
                </option>

                <option value="closing">
                  Closing
                </option>

                <option value="title_legal">
                  Title / Legal
                </option>

                <option value="client_correspondence">
                  Client Correspondence
                </option>

                <option value="other">
                  Other
                </option>
              </SelectField>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  File
                </label>

                <input
                  type="file"
                  name="document"
                  accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                  required
                  className="block w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-slate-300 file:mr-4 file:rounded-lg file:border-0 file:bg-green-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-green-500"
                />
              </div>
            </div>
          </Section>

          <Section
            icon={
              <Receipt className="h-5 w-5" />
            }
            title="Expense Link"
          >
            <SelectField
              label="Expense"
              name="expense_id"
              defaultValue={
                expenseId || ""
              }
            >
              <option value="">
                No expense
              </option>

              {expenses.map(
                (expense) => (
                  <option
                    key={
                      expense.id
                    }
                    value={
                      expense.id
                    }
                  >
                    {expense.invoice_number ||
                      "Expense"}{" "}
                    —{" "}
                    {
                      expense.expense_category
                    }
                  </option>
                )
              )}
            </SelectField>
          </Section>

          <Section
            icon={
              <Wrench className="h-5 w-5" />
            }
            title="Work Order Link"
          >
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
          </Section>

          <Section
            icon={
              <UserRound className="h-5 w-5" />
            }
            title="Vendor Link"
          >
            <SelectField
              label="Vendor"
              name="vendor_id"
              defaultValue={
                vendorId || ""
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
                  </option>
                )
              )}
            </SelectField>
          </Section>

          <Section
            title="Internal Notes"
          >
            <textarea
              name="notes"
              rows={5}
              placeholder="Optional document notes, source information, approval references, or filing instructions."
              className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-green-500/50"
            />
          </Section>

          <div className="flex flex-wrap justify-end gap-3">
            <Link
              href={
                backHref
              }
              className="rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/[0.06] hover:text-white"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-500"
            >
              Upload Document
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
        defaultValue={
          defaultValue
        }
        required={
          required
        }
        className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none transition focus:border-green-500/50"
      >
        {children}
      </select>
    </div>
  );
}
