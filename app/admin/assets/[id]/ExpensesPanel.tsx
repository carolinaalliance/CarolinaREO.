import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import {
  Banknote,
  CheckCircle2,
  Clock3,
  FileText,
  Receipt,
  UserRound,
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

  const number =
    Number(value);

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

function label(value?: string | null) {
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

export default async function ExpensesPanel({
  assetId,
}: {
  assetId: string;
}) {
  const supabase =
    getSupabase();

  const {
    data,
    error,
  } =
    await supabase
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
      .eq(
        "asset_id",
        assetId
      )
      .order(
        "created_at",
        {
          ascending: false,
        }
      );

  if (error) {
    throw error;
  }

  const expenses: any[] =
    data || [];

  const submittedExpenses =
    expenses.filter(
      (expense) =>
        expense.approval_status ===
        "submitted"
    );

  const approvedExpenses =
    expenses.filter(
      (expense) =>
        expense.approval_status ===
        "approved"
    );

  const paidExpenses =
    expenses.filter(
      (expense) =>
        expense.payment_status ===
        "paid"
    );

  const reimbursementPending =
    expenses.filter(
      (expense) =>
        expense.reimbursement_status ===
          "submitted" ||
        expense.reimbursement_status ===
          "approved"
    );

  const totalInvoiced =
    expenses.reduce(
      (total, expense) =>
        total +
        Number(
          expense.invoice_amount ||
            0
        ),
      0
    );

  const totalApproved =
    expenses.reduce(
      (total, expense) =>
        total +
        Number(
          expense.approved_amount ||
            0
        ),
      0
    );

  const totalPaid =
    expenses.reduce(
      (total, expense) =>
        total +
        Number(
          expense.paid_amount ||
            0
        ),
      0
    );

  const totalReimbursed =
    expenses.reduce(
      (total, expense) =>
        total +
        Number(
          expense.reimbursed_amount ||
            0
        ),
      0
    );

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">
            Expenses & Vendor Invoices
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Asset-level accounting,
            vendor invoices,
            approvals,
            payments, and client
            reimbursements.
          </p>
        </div>

        <Link
          href={`/admin/expenses/new?asset=${assetId}`}
          className="inline-flex items-center justify-center rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-500"
        >
          Record Expense / Invoice
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric
          label="Total Invoiced"
          value={money(
            totalInvoiced
          )}
        />

        <Metric
          label="Approved"
          value={money(
            totalApproved
          )}
        />

        <Metric
          label="Paid"
          value={money(
            totalPaid
          )}
        />

        <Metric
          label="Reimbursed"
          value={money(
            totalReimbursed
          )}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SmallMetric
          label="Submitted"
          value={
            submittedExpenses.length
          }
        />

        <SmallMetric
          label="Approved Expenses"
          value={
            approvedExpenses.length
          }
        />

        <SmallMetric
          label="Paid Expenses"
          value={
            paidExpenses.length
          }
        />

        <SmallMetric
          label="Pending Reimbursement"
          value={
            reimbursementPending.length
          }
        />
      </div>

      <div className="reo-card overflow-hidden rounded-2xl">
        <div className="flex items-center gap-3 border-b border-white/10 px-6 py-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10">
            <Receipt className="h-5 w-5 text-green-400" />
          </div>

          <div>
            <h3 className="font-semibold text-white">
              Asset Expense Ledger
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              Financial records associated
              with this asset
            </p>
          </div>
        </div>

        {expenses.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <Receipt className="mx-auto h-9 w-9 text-slate-700" />

            <h4 className="mt-4 font-semibold text-slate-200">
              No expenses recorded
            </h4>

            <p className="mt-2 text-sm text-slate-500">
              Vendor invoices and other
              asset expenses will appear
              here.
            </p>

            <Link
              href={`/admin/expenses/new?asset=${assetId}`}
              className="mt-5 inline-flex rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-500"
            >
              Record First Expense
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {expenses.map(
              (expense) => {
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

                return (
                  <div
                    key={
                      expense.id
                    }
                    className="px-6 py-6"
                  >
                    <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-start">
                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <Link
                            href={`/admin/expenses/${expense.id}`}
                            className="font-semibold text-white hover:text-green-400"
                          >
                            {expense.invoice_number ||
                              "Expense Record"}
                          </Link>

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

                        <h4 className="mt-3 text-lg font-semibold text-slate-100">
                          {
                            expense.expense_category
                          }
                        </h4>

                        {expense.description && (
                          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
                            {
                              expense.description
                            }
                          </p>
                        )}
                      </div>

                      <Link
                        href={`/admin/expenses/${expense.id}`}
                        className="shrink-0 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-white/[0.06] hover:text-white"
                      >
                        View Expense
                      </Link>
                    </div>

                    <div className="mt-6 grid gap-5 border-t border-white/5 pt-5 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8">
                      <Detail
                        label="Vendor"
                        value={
                          vendor?.company_name ||
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
                        label="Invoice Date"
                        value={formatDate(
                          expense.invoice_date
                        )}
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
                        label="Reimbursement"
                        value={label(
                          expense.reimbursement_status
                        )}
                      />

                      <Detail
                        label="Reimbursed"
                        value={money(
                          expense.reimbursed_amount
                        )}
                      />
                    </div>
                  </div>
                );
              }
            )}
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-blue-500/20 bg-blue-500/[0.04] p-5">
        <div className="flex gap-3">
          <Banknote className="mt-0.5 h-5 w-5 shrink-0 text-blue-300" />

          <div>
            <h3 className="font-semibold text-blue-200">
              Accounting Control
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              Work-order final cost represents
              the operational completion cost.
              The expense record represents the
              accounting invoice and payment
              trail. Carolina REO will use the
              expense ledger as the authoritative
              source for paid and reimbursed
              amounts so costs are not counted
              twice.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.025] p-5">
      <div className="text-2xl font-bold text-white">
        {value}
      </div>

      <div className="mt-2 text-xs text-slate-500">
        {label}
      </div>
    </div>
  );
}

function SmallMetric({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.025] p-4">
      <div className="flex items-center gap-3">
        <Clock3 className="h-4 w-4 text-slate-500" />

        <div>
          <div className="text-lg font-bold text-white">
            {value}
          </div>

          <div className="text-xs text-slate-500">
            {label}
          </div>
        </div>
      </div>
    </div>
  );
}

function Detail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-600">
        {label}
      </div>

      <div className="mt-1.5 break-words text-sm font-medium text-slate-200">
        {value}
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
