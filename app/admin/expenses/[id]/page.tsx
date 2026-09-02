import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import {
  ArrowLeft,
  Banknote,
  Building2,
  CalendarDays,
  FileText,
  Receipt,
  UserRound,
} from "lucide-react";
import {
  uploadExpenseDocument,
} from "./document-actions";

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
    return "—";
  }

  const number = Number(value);

  if (!Number.isFinite(number)) {
    return "—";
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
    return "—";
  }

  return new Intl.DateTimeFormat(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  ).format(
    new Date(
      `${value}T12:00:00`
    )
  );
}

function label(
  value?: string | null
) {
  if (!value) {
    return "—";
  }

  return value
    .replaceAll("_", " ")
    .replace(
      /\b\w/g,
      (letter) =>
        letter.toUpperCase()
    );
}

export default async function ExpenseDetailPage({
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
    data: expense,
    error,
  } =
    await supabase
      .from("reo_expenses")
      .select(`
        *,
        reo_assets (
          id,
          property_address,
          city,
          state,
          postal_code
        ),
        reo_vendors (
          id,
          company_name,
          contact_name,
          email,
          phone
        ),
        reo_work_orders (
          id,
          work_order_number,
          title,
          category,
          final_cost
        )
      `)
      .eq(
        "id",
        id
      )
      .maybeSingle();

  if (error) {
    throw error;
  }

  if (!expense) {
    notFound();
  }

  const asset =
    Array.isArray(
      expense.reo_assets
    )
      ? expense.reo_assets[0]
      : expense.reo_assets;

  const vendor =
    Array.isArray(
      expense.reo_vendors
    )
      ? expense.reo_vendors[0]
      : expense.reo_vendors;

  const workOrder =
    Array.isArray(
      expense.reo_work_orders
    )
      ? expense.reo_work_orders[0]
      : expense.reo_work_orders;

  const {
  data: invoiceDocument,
  error: invoiceDocumentError,
} =
  await supabase
    .from("reo_documents")
    .select(`
      id,
      file_name,
      mime_type,
      file_size,
      storage_path
    `)
    .eq(
      "expense_id",
      expense.id
    )
    .eq(
      "document_type",
      "vendor_invoice"
    )
    .maybeSingle();

if (invoiceDocumentError) {
  throw invoiceDocumentError;
}

const uploadDocumentAction =
  uploadExpenseDocument.bind(
    null,
    expense.id
  );
  
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-8">
          <Link
            href={
              asset
                ? `/admin/assets/${asset.id}?tab=expenses`
                : "/admin"
            }
            className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-400 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Expenses
          </Link>

          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-green-400">
            Carolina REO Expense
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight text-white">
              {expense.invoice_number ||
                "Expense Record"}
            </h1>

            <StatusBadge
              value={
                expense.approval_status
              }
            />

            <PaymentBadge
              value={
                expense.payment_status
              }
            />
          </div>

          <p className="mt-2 text-sm text-slate-500">
            {expense.expense_category}
          </p>
        </div>

        <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Metric
            label="Invoice Amount"
            value={money(
              expense.invoice_amount
            )}
          />

          <Metric
            label="Approved Amount"
            value={money(
              expense.approved_amount
            )}
          />

          <Metric
            label="Paid Amount"
            value={money(
              expense.paid_amount
            )}
          />

          <Metric
            label="Reimbursed"
            value={money(
              expense.reimbursed_amount
            )}
          />
        </section>

        <div className="grid gap-6 xl:grid-cols-2">
          <Section
            icon={
              <Building2 className="h-5 w-5" />
            }
            title="Asset"
          >
            <InfoRow
              label="Property"
              value={
                asset?.property_address ||
                "—"
              }
            />

            <InfoRow
              label="Location"
              value={
                [
                  asset?.city,
                  asset?.state,
                  asset?.postal_code,
                ]
                  .filter(Boolean)
                  .join(", ") ||
                "—"
              }
            />

            {asset ? (
              <div className="pt-2">
                <Link
                  href={`/admin/assets/${asset.id}?tab=expenses`}
                  className="text-sm font-semibold text-green-400 hover:text-green-300"
                >
                  Open Asset Expenses
                </Link>
              </div>
            ) : null}
          </Section>

          <Section
            icon={
              <UserRound className="h-5 w-5" />
            }
            title="Vendor"
          >
            <InfoRow
              label="Company"
              value={
                vendor?.company_name ||
                "—"
              }
            />

            <InfoRow
              label="Contact"
              value={
                vendor?.contact_name ||
                "—"
              }
            />

            <InfoRow
              label="Phone"
              value={
                vendor?.phone ||
                "—"
              }
            />

            <InfoRow
              label="Email"
              value={
                vendor?.email ||
                "—"
              }
            />
          </Section>

          <Section
            icon={
              <Receipt className="h-5 w-5" />
            }
            title="Invoice"
          >
            <InfoRow
              label="Category"
              value={
                expense.expense_category
              }
            />

            <InfoRow
              label="Invoice Number"
              value={
                expense.invoice_number ||
                "—"
              }
            />

            <InfoRow
              label="Invoice Date"
              value={formatDate(
                expense.invoice_date
              )}
            />

            <InfoRow
              label="Invoice Amount"
              value={money(
                expense.invoice_amount
              )}
            />

            <InfoRow
              label="Description"
              value={
                expense.description ||
                "—"
              }
            />
          </Section>

          <Section
            icon={
              <FileText className="h-5 w-5" />
            }
            title="Work Order"
          >
            <InfoRow
              label="Work Order"
              value={
                workOrder?.work_order_number ||
                "—"
              }
            />

            <InfoRow
              label="Title"
              value={
                workOrder?.title ||
                "—"
              }
            />

            <InfoRow
              label="Category"
              value={
                workOrder?.category ||
                "—"
              }
            />

            <InfoRow
              label="Final Cost"
              value={money(
                workOrder?.final_cost
              )}
            />
          </Section>

          <Section
            icon={
              <FileText className="h-5 w-5" />
            }
            title="Approval"
          >
            <InfoRow
              label="Status"
              value={label(
                expense.approval_status
              )}
            />

            <InfoRow
              label="Approved Amount"
              value={money(
                expense.approved_amount
              )}
            />

            <InfoRow
              label="Approved Date"
              value={formatDate(
                expense.approved_date
              )}
            />
          </Section>

          <Section
            icon={
              <Banknote className="h-5 w-5" />
            }
            title="Payment"
          >
            <InfoRow
              label="Status"
              value={label(
                expense.payment_status
              )}
            />

            <InfoRow
              label="Paid Amount"
              value={money(
                expense.paid_amount
              )}
            />

            <InfoRow
              label="Paid Date"
              value={formatDate(
                expense.paid_date
              )}
            />

            <InfoRow
              label="Payment Reference"
              value={
                expense.payment_reference ||
                "—"
              }
            />
          </Section>

          <Section
            icon={
              <CalendarDays className="h-5 w-5" />
            }
            title="Client Reimbursement"
          >
            <InfoRow
              label="Status"
              value={label(
                expense.reimbursement_status
              )}
            />

            <InfoRow
              label="Reimbursed Amount"
              value={money(
                expense.reimbursed_amount
              )}
            />

            <InfoRow
              label="Reimbursed Date"
              value={formatDate(
                expense.reimbursed_date
              )}
            />
          </Section>

          <Section
  icon={
    <FileText className="h-5 w-5" />
  }
  title="Document"
>
  <InfoRow
    label="Invoice Document"
    value={
      expense.document_url
        ? "Uploaded"
        : "Not uploaded"
    }
  />

  <form
    action={uploadDocumentAction}
    className="space-y-4 pt-2"
  >
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-300">
        Invoice / Receipt
      </label>

      <input
        type="file"
        name="document"
        accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
        required
        className="block w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-slate-300 file:mr-4 file:rounded-lg file:border-0 file:bg-green-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-green-500"
      />
    </div>

    <button
      type="submit"
      className="rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-500"
    >
      {expense.document_url
        ? "Replace Invoice Document"
        : "Upload Invoice Document"}
    </button>
  </form>

 {invoiceDocument ? (
  <div className="space-y-3 pt-2">
    <div className="rounded-xl border border-green-500/20 bg-green-500/[0.05] p-4">
      <p className="text-sm font-semibold text-green-300">
        Document securely stored
      </p>

      <p className="mt-1 break-all text-xs text-slate-500">
        {invoiceDocument.file_name}
      </p>
    </div>

    <a
      href={`/api/reo/documents/${invoiceDocument.id}/view`}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-2.5 text-sm font-semibold text-green-300 transition hover:bg-green-500/20 hover:text-green-200"
    >
      View Document
    </a>

    <p className="text-xs leading-5 text-slate-500">
      A temporary secure link is
      generated when the document is
      opened. The storage bucket remains
      private.
    </p>
  </div>
) : null}
</Section>
        </div>

        <section className="mt-6 rounded-2xl border border-white/10 bg-white/[0.025]">
          <div className="border-b border-white/10 px-6 py-5">
            <h2 className="text-lg font-semibold">
              Internal Notes
            </h2>
          </div>

          <div className="p-6">
            <p className="whitespace-pre-wrap text-sm leading-6 text-slate-400">
              {expense.internal_notes ||
                "No internal notes have been recorded."}
            </p>
          </div>
        </section>

        <div className="mt-6 flex justify-end">
          <Link
            href={`/admin/expenses/${expense.id}/edit`}
            className="rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-500"
          >
            Edit Expense
          </Link>
        </div>
      </div>
    </main>
  );
}

function Section({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.025]">
      <div className="flex items-center gap-3 border-b border-white/10 px-6 py-5">
        <span className="text-green-400">
          {icon}
        </span>

        <h2 className="text-lg font-semibold">
          {title}
        </h2>
      </div>

      <div className="space-y-4 p-6">
        {children}
      </div>
    </section>
  );
}

function InfoRow({
  label: rowLabel,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start justify-between gap-5 border-b border-white/5 pb-3 last:border-0 last:pb-0">
      <span className="text-sm text-slate-500">
        {rowLabel}
      </span>

      <span className="max-w-[65%] text-right text-sm font-semibold text-slate-200">
        {value}
      </span>
    </div>
  );
}

function Metric({
  label: metricLabel,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.025] p-5">
      <div className="text-2xl font-bold">
        {value}
      </div>

      <div className="mt-2 text-xs text-slate-500">
        {metricLabel}
      </div>
    </div>
  );
}

function StatusBadge({
  value,
}: {
  value?: string | null;
}) {
  const classes =
    value === "approved"
      ? "bg-green-500/10 text-green-400"
      : value === "rejected"
      ? "bg-red-500/10 text-red-300"
      : value === "voided"
      ? "bg-slate-700 text-slate-300"
      : "bg-amber-500/10 text-amber-300";

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${classes}`}
    >
      {label(value)}
    </span>
  );
}

function PaymentBadge({
  value,
}: {
  value?: string | null;
}) {
  const classes =
    value === "paid"
      ? "bg-green-500/10 text-green-400"
      : value === "scheduled"
      ? "bg-blue-500/10 text-blue-300"
      : value === "voided"
      ? "bg-slate-700 text-slate-300"
      : "bg-white/[0.05] text-slate-400";

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${classes}`}
    >
      {label(value)}
    </span>
  );
}
