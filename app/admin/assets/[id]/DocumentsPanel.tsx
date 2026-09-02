import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import {
  FileText,
  Receipt,
  Wrench,
  UserRound,
  FolderOpen,
  ExternalLink,
  CheckCircle2,
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

function formatDate(value?: string | null) {
  if (!value) return "—";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function documentTypeLabel(value?: string | null) {
  if (!value) return "Document";

  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
}

export default async function DocumentsPanel({
  assetId,
}: {
  assetId: string;
}) {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from("reo_documents")
    .select(`
      *,
     reo_expenses (
  id,
  invoice_number,
  expense_category,
  invoice_amount
),
      reo_work_orders (
        id,
        work_order_number,
        title,
        category
      ),
      reo_vendors (
        id,
        company_name
      )
    `)
    .eq("asset_id", assetId)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    throw error;
  }

  const documents: any[] = data ?? [];

  const invoiceDocuments =
    documents.filter(
      (document) =>
        document.expense_id ||
        document.document_type === "invoice"
    );

  const workOrderDocuments =
    documents.filter(
      (document) =>
        document.work_order_id
    );

  const vendorDocuments =
    documents.filter(
      (document) =>
        document.vendor_id
    );

  return (
    <section className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-2xl font-bold">
            Documents
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Central asset document repository,
            including invoices, vendor records,
            work-order documents, reports, and
            transaction files.
          </p>
        </div>

        <div className="rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-2.5 text-sm font-semibold text-green-400">
          {documents.length}{" "}
          {documents.length === 1
            ? "Document"
            : "Documents"}
        </div>
      </div>

      {/* DOCUMENT METRICS */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric
          label="Total Documents"
          value={documents.length}
          icon={FileText}
        />

        <Metric
          label="Invoice Documents"
          value={invoiceDocuments.length}
          icon={Receipt}
        />

        <Metric
          label="Work Order Documents"
          value={workOrderDocuments.length}
          icon={Wrench}
        />

        <Metric
          label="Vendor Linked"
          value={vendorDocuments.length}
          icon={UserRound}
        />
      </div>

      {/* DOCUMENT REPOSITORY */}
      <div className="reo-card overflow-hidden rounded-2xl">
        <div className="flex items-center gap-3 border-b border-white/10 px-6 py-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10">
            <FolderOpen className="h-5 w-5 text-green-400" />
          </div>

          <div>
            <h3 className="font-semibold">
              Asset Document Repository
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              Documents associated with this asset
            </p>
          </div>
        </div>

        {documents.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <FileText className="mx-auto h-9 w-9 text-slate-700" />

            <div className="mt-4 font-semibold text-slate-200">
              No documents recorded
            </div>

            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500">
              Invoice documents, work-order files,
              inspection reports, BPOs, contracts,
              closing documents, and other asset
              records will appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {documents.map((document) => {
              const expense =
                Array.isArray(
                  document.reo_expenses
                )
                  ? document.reo_expenses[0]
                  : document.reo_expenses;

              const workOrder =
                Array.isArray(
                  document.reo_work_orders
                )
                  ? document.reo_work_orders[0]
                  : document.reo_work_orders;

              const vendor =
                Array.isArray(
                  document.reo_vendors
                )
                  ? document.reo_vendors[0]
                  : document.reo_vendors;

              return (
                <div
                  key={document.id}
                  className="px-6 py-6"
                >
                  <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-start">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10">
                          <FileText className="h-5 w-5 text-green-400" />
                        </div>

                        <div>
                          <div className="font-semibold text-white">
                            {document.file_name ||
                              document.title ||
                              "Document"}
                          </div>

                          <div className="mt-1 text-xs text-slate-500">
                            {documentTypeLabel(
                              document.document_type
                            )}
                          </div>
                        </div>

                        <span className="rounded-full bg-green-500/10 px-2.5 py-1 text-xs font-semibold text-green-400">
                          <CheckCircle2 className="mr-1 inline h-3 w-3" />
                          Recorded
                        </span>
                      </div>

                      {document.description && (
                        <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-400">
                          {document.description}
                        </p>
                      )}
                    </div>

                    {document.id && (
                      <Link
                        href={`/api/reo/documents/${document.id}/view`}
                        target="_blank"
                        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-white/[0.06] hover:text-white"
                      >
                        <ExternalLink className="h-4 w-4" />
                        View Document
                      </Link>
                    )}
                  </div>

                  <div className="mt-6 grid gap-5 border-t border-white/5 pt-5 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
                    <Detail
                      label="Document Type"
                      value={documentTypeLabel(
                        document.document_type
                      )}
                    />

                    <Detail
                      label="Invoice"
                      value={
                        expense?.invoice_number ||
                        "—"
                      }
                    />

                    <Detail
                      label="Work Order"
                      value={
                        workOrder?.work_order_number ||
                        "—"
                      }
                    />

                    <Detail
                      label="Vendor"
                      value={
                        vendor?.company_name ||
                        "—"
                      }
                    />

                    <Detail
                      label="Uploaded"
                      value={formatDate(
                        document.created_at
                      )}
                    />

                    <Detail
                      label="File"
                      value={
                        document.file_name ||
                        "—"
                      }
                    />
                  </div>

                  {expense?.id && (
                    <div className="mt-5">
                      <Link
                        href={`/admin/expenses/${expense.id}`}
                        className="text-sm font-semibold text-green-400 hover:text-green-300"
                      >
                        Open Expense Record →
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* DOCUMENT CONTROL */}
      <div className="rounded-2xl border border-blue-500/20 bg-blue-500/[0.04] p-6">
        <div className="flex gap-3">
          <FileText className="mt-0.5 h-5 w-5 shrink-0 text-blue-300" />

          <div>
            <h3 className="font-semibold text-blue-200">
              Document Control
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              Carolina REO maintains documents at
              the asset level so invoices, vendor
              records, work orders, approvals,
              reports, and transaction documents
              remain connected to the permanent
              asset history.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Metric({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: typeof FileText;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.025] p-5">
      <div className="flex items-center justify-between">
        <div className="text-2xl font-bold">
          {value}
        </div>

        <Icon className="h-5 w-5 text-green-400" />
      </div>

      <div className="mt-2 text-xs text-slate-500">
        {label}
      </div>
    </div>
  );
}

function Detail({
  label,
  value,
}: {
  label: string;
  value: any;
}) {
  const display =
    value === null ||
    value === undefined ||
    value === ""
      ? "—"
      : String(value);

  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-600">
        {label}
      </div>

      <div className="mt-1.5 break-words text-sm font-medium text-slate-200">
        {display}
      </div>
    </div>
  );
}
