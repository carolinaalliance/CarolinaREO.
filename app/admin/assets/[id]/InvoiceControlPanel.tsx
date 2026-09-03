import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import {
  BadgeDollarSign,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  Receipt,
  RotateCcw,
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

function money(value?: number | string | null) {
  const amount = Number(value || 0);

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

function formatDate(value?: string | null) {
  if (!value) return "—";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function label(value?: string | null) {
  if (!value) return "—";

  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
}

function statusClass(value?: string | null) {
  const normalized =
    String(value || "").toLowerCase();

  if (
    normalized === "approved" ||
    normalized === "paid" ||
    normalized === "reimbursed"
  ) {
    return "border-green-500/20 bg-green-500/10 text-green-400";
  }

  if (
    normalized === "submitted" ||
    normalized === "pending"
  ) {
    return "border-amber-500/20 bg-amber-500/10 text-amber-300";
  }

  if (
    normalized === "rejected" ||
    normalized === "denied"
  ) {
    return "border-red-500/20 bg-red-500/10 text-red-300";
  }

  return "border-white/10 bg-white/[0.03] text-slate-400";
}

export default async function InvoiceControlPanel({
  assetId,
}: {
  assetId: string;
}) {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from("reo_expenses")
    .select(`
      *,
      reo_vendors (
        id,
        company_name
      ),
      reo_work_orders (
        id,
        work_order_number,
        title
      )
    `)
    .eq("asset_id", assetId)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    throw error;
  }

  const expenses: any[] = data ?? [];

  const totalInvoiced = expenses.reduce(
    (sum, expense) =>
      sum + Number(expense.invoice_amount || 0),
    0
  );

  const totalApproved = expenses.reduce(
    (sum, expense) =>
      sum + Number(expense.approved_amount || 0),
    0
  );

  const totalPaid = expenses.reduce(
    (sum, expense) =>
      sum + Number(expense.paid_amount || 0),
    0
  );

  const totalReimbursed = expenses.reduce(
    (sum, expense) =>
      sum + Number(expense.reimbursed_amount || 0),
    0
  );

  const awaitingApproval = expenses.filter(
    (expense) =>
      expense.approval_status === "submitted"
  ).length;

  const awaitingPayment = expenses.filter(
    (expense) =>
      expense.approval_status === "approved" &&
      expense.payment_status !== "paid"
  ).length;

  const awaitingReimbursement = expenses.filter(
    (expense) =>
      expense.payment_status === "paid" &&
      expense.reimbursement_status !==
        "reimbursed"
  ).length;

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">
          Invoice & Payment Control
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Review invoice approvals, payments,
          reimbursement status, and financial
          reconciliation for this asset.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric
          label="Total Invoiced"
          value={money(totalInvoiced)}
          icon={Receipt}
        />

        <Metric
          label="Approved"
          value={money(totalApproved)}
          icon={CheckCircle2}
        />

        <Metric
          label="Paid"
          value={money(totalPaid)}
          icon={CircleDollarSign}
        />

        <Metric
          label="Reimbursed"
          value={money(totalReimbursed)}
          icon={RotateCcw}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <QueueCard
          label="Awaiting Approval"
          value={awaitingApproval}
          icon={Clock3}
        />

        <QueueCard
          label="Awaiting Payment"
          value={awaitingPayment}
          icon={BadgeDollarSign}
        />

        <QueueCard
          label="Awaiting Reimbursement"
          value={awaitingReimbursement}
          icon={RotateCcw}
        />
      </div>

      <div className="reo-card overflow-hidden rounded-2xl">
        <div className="border-b border-white/10 px-6 py-5">
          <h3 className="font-semibold">
            Invoice Control Register
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            Financial control workflow for all
            expenses associated with this asset
          </p>
        </div>

        {expenses.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <Receipt className="mx-auto h-9 w-9 text-slate-700" />

            <div className="mt-4 font-semibold text-slate-200">
              No invoices recorded
            </div>

            <p className="mt-2 text-sm text-slate-500">
              Expense and invoice records will
              appear here once entered.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {expenses.map((expense) => {
              const vendor = Array.isArray(
                expense.reo_vendors
              )
                ? expense.reo_vendors[0]
                : expense.reo_vendors;

              const workOrder = Array.isArray(
                expense.reo_work_orders
              )
                ? expense.reo_work_orders[0]
                : expense.reo_work_orders;

              return (
                <div
                  key={expense.id}
                  className="px-6 py-6"
                >
                  <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-start">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <div>
                          <div className="text-lg font-semibold text-white">
                            {expense.invoice_number ||
                              "Invoice"}
                          </div>

                          <div className="mt-1 text-sm text-slate-500">
                            {label(
                              expense.expense_category
                            )}
                          </div>
                        </div>

                        <span
                          className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${statusClass(
                            expense.approval_status
                          )}`}
                        >
                          {label(
                            expense.approval_status
                          )}
                        </span>

                        <span
                          className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${statusClass(
                            expense.payment_status
                          )}`}
                        >
                          {label(
                            expense.payment_status
                          )}
                        </span>

                        <span
                          className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${statusClass(
                            expense.reimbursement_status
                          )}`}
                        >
                          {label(
                            expense.reimbursement_status
                          )}
                        </span>
                      </div>
                    </div>

                    <Link
                      href={`/admin/expenses/${expense.id}`}
                      className="inline-flex shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-white/[0.06] hover:text-white"
                    >
                      Open Expense
                    </Link>
                  </div>

                  <div className="mt-6 grid gap-5 border-t border-white/5 pt-5 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
                    <Detail
                      label="Vendor"
                      value={
                        vendor?.company_name || "—"
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
                      label="Invoice Amount"
                      value={money(
                        expense.invoice_amount
                      )}
                    />

                    <Detail
                      label="Approved Amount"
                      value={money(
                        expense.approved_amount
                      )}
                    />

                    <Detail
                      label="Paid Amount"
                      value={money(
                        expense.paid_amount
                      )}
                    />

                    <Detail
                      label="Reimbursed"
                      value={money(
                        expense.reimbursed_amount
                      )}
                    />
                  </div>

                  <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    <Detail
                      label="Invoice Date"
                      value={formatDate(
                        expense.invoice_date
                      )}
                    />

                    <Detail
                      label="Approved Date"
                      value={formatDate(
                        expense.approved_date
                      )}
                    />

                    <Detail
                      label="Paid Date"
                      value={formatDate(
                        expense.paid_date
                      )}
                    />

                    <Detail
                      label="Reimbursed Date"
                      value={formatDate(
                        expense.reimbursed_date
                      )}
                    />
                  </div>

                  {expense.payment_reference && (
                    <div className="mt-5 rounded-xl border border-white/5 bg-white/[0.02] p-4">
                      <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-600">
                        Payment Reference
                      </div>

                      <div className="mt-1.5 text-sm font-medium text-slate-200">
                        {expense.payment_reference}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
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
  value: string;
  icon: typeof Receipt;
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

function QueueCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: typeof Clock3;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.025] p-5">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-2xl font-bold">
            {value}
          </div>

          <div className="mt-2 text-xs text-slate-500">
            {label}
          </div>
        </div>

        <Icon className="h-5 w-5 text-amber-300" />
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
