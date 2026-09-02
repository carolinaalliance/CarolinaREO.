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

  return createClient(supabaseUrl, serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export default async function NewAssetDocumentPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id: assetId } = await params;

  const supabase = getSupabase();

  const [
    assetResult,
    expensesResult,
    workOrdersResult,
    vendorsResult,
  ] = await Promise.all([
    supabase
      .from("reo_assets")
      .select(
        "id, property_address, city, state, postal_code"
      )
      .eq("id", assetId)
      .single(),

    supabase
      .from("reo_expenses")
      .select(
        "id, invoice_number, expense_category"
      )
      .eq("asset_id", assetId)
      .order("created_at", {
        ascending: false,
      }),

    supabase
      .from("reo_work_orders")
      .select(
        "id, work_order_number, title"
      )
      .eq("asset_id", assetId)
      .order("created_at", {
        ascending: false,
      }),

    supabase
      .from("reo_vendors")
      .select(
        "id, company_name"
      )
      .order("company_name", {
        ascending: true,
      }),
  ]);

  if (assetResult.error) {
    throw assetResult.error;
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

  const asset = assetResult.data;
  const expenses = expensesResult.data || [];
  const workOrders = workOrdersResult.data || [];
  const vendors = vendorsResult.data || [];

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-5xl px-6 py-8">
        <Link
          href={`/admin/assets/${assetId}?tab=documents`}
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Documents
        </Link>

        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-green-400">
            Carolina REO
          </p>

          <h1 className="mt-2 text-3xl font-bold">
            Upload Asset Document
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            {[
              asset.property_address,
              asset.city,
              asset.state,
              asset.postal_code,
            ]
              .filter(Boolean)
              .join(", ")}
          </p>
        </div>

        <form
          action="#"
          className="space-y-6"
        >
          <input
            type="hidden"
            name="asset_id"
            value={assetId}
          />

          <Section
            title="Asset"
            icon={
              <Building2 className="h-5 w-5" />
            }
          >
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <div className="font-semibold">
                {asset.property_address}
              </div>

              <div className="mt-1 text-sm text-slate-500">
                {[
                  asset.city,
                  asset.state,
                  asset.postal_code,
                ]
                  .filter(Boolean)
                  .join(", ")}
              </div>
            </div>
          </Section>

          <Section
            title="Document"
            icon={
              <FileText className="h-5 w-5" />
            }
          >
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Document Type
                </label>

                <select
                  name="document_type"
                  required
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2.5 text-sm text-white"
                  defaultValue=""
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
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  File
                </label>

                <input
                  type="file"
                  name="document"
                  accept=".pdf,.jpg,.jpeg,.png"
                  required
                  className="block w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-slate-300"
                />
              </div>
            </div>
          </Section>

          <Section
            title="Expense Link"
            icon={
              <Receipt className="h-5 w-5" />
            }
          >
            <select
              name="expense_id"
              defaultValue=""
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2.5 text-sm text-white"
            >
              <option value="">
                No expense
              </option>

              {expenses.map((expense) => (
                <option
                  key={expense.id}
                  value={expense.id}
                >
                  {expense.invoice_number || "Expense"}
                  {" — "}
                  {expense.expense_category}
                </option>
              ))}
            </select>
          </Section>

          <Section
            title="Work Order Link"
            icon={
              <Wrench className="h-5 w-5" />
            }
          >
            <select
              name="work_order_id"
              defaultValue=""
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2.5 text-sm text-white"
            >
              <option value="">
                No work order
              </option>

              {workOrders.map((workOrder) => (
                <option
                  key={workOrder.id}
                  value={workOrder.id}
                >
                  {workOrder.work_order_number}
                  {" — "}
                  {workOrder.title}
                </option>
              ))}
            </select>
          </Section>

          <Section
            title="Vendor Link"
            icon={
              <UserRound className="h-5 w-5" />
            }
          >
            <select
              name="vendor_id"
              defaultValue=""
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2.5 text-sm text-white"
            >
              <option value="">
                No vendor
              </option>

              {vendors.map((vendor) => (
                <option
                  key={vendor.id}
                  value={vendor.id}
                >
                  {vendor.company_name}
                </option>
              ))}
            </select>
          </Section>

          <Section title="Internal Notes">
            <textarea
              name="notes"
              rows={5}
              placeholder="Optional notes about this document."
              className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-white"
            />
          </Section>

          <div className="flex justify-end gap-3">
            <Link
              href={`/admin/assets/${assetId}?tab=documents`}
              className="rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-slate-300"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white"
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
  title,
  icon,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.025]">
      <div className="flex items-center gap-3 border-b border-white/10 px-6 py-5">
        {icon && (
          <span className="text-green-400">
            {icon}
          </span>
        )}

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
