"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  Archive,
  Banknote,
  Building2,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  DollarSign,
  FileCheck2,
  History,
  Landmark,
  TrendingUp,
  Download,
} from "lucide-react";

type ReportData = {
  asset: any;
  closing: any;
  contract: any;
  marketing: any;
  acceptedOffer: any;
  activities: any[];
  tasks: any[];

  metrics: {
    daysInInventory:
      | number
      | null;

    totalTasks: number;
    completedTasks: number;
    openTasks: number;
    totalActivities: number;

    finalSalePrice:
      | number
      | null;

    netProceeds:
      | number
      | null;

    originalListPrice:
      | number
      | null;

    finalListPrice:
      | number
      | null;

    dispositionDate:
      | string
      | null;
  };
};

export default function DispositionPanel({
  assetId,
}: {
  assetId: string;
}) {
  const [
    report,
    setReport,
  ] =
    useState<ReportData | null>(
      null
    );

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    error,
    setError,
  ] =
    useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadReport() {
      try {
        const response =
          await fetch(
            `/api/reo/assets/${assetId}/disposition`,
            {
              cache:
                "no-store",
            }
          );

        const result =
          await response.json();

        if (!response.ok) {
          throw new Error(
            result.error ||
              "Unable to load disposition report."
          );
        }

        if (!cancelled) {
          setReport(
            result.report
          );
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load disposition report."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadReport();

    return () => {
      cancelled = true;
    };
  }, [assetId]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-white/10 bg-[#07111f] p-8 text-sm text-slate-400">
        Building final asset report...
      </div>
    );
  }

  if (
    error ||
    !report
  ) {
    return (
      <div className="rounded-2xl border border-red-500/25 bg-red-500/10 p-6 text-red-300">
        {error ||
          "Disposition report is unavailable."}
      </div>
    );
  }

  const {
    asset,
    closing,
    contract,
    marketing,
    acceptedOffer,
    activities,
    tasks,
    metrics,
  } = report;

  return (
    <div className="space-y-6">

      {/* FINAL STATUS */}

      <section className="rounded-2xl border border-green-500/25 bg-gradient-to-r from-green-500/10 to-transparent p-6">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">

          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/15">
              <CheckCircle2 className="h-6 w-6 text-green-400" />
            </div>

            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-green-400">
                Asset Disposition Complete
              </div>

              <h2 className="mt-2 text-2xl font-bold">
                {asset.property_address}
              </h2>

              <p className="mt-2 text-sm text-slate-400">
                This asset has completed the Carolina REO lifecycle from institutional assignment through final disposition.
              </p>
            </div>
          </div>

         <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
  <div className="rounded-xl border border-green-500/20 bg-green-500/[0.06] px-6 py-4 text-right">
    <div className="text-xs uppercase tracking-[0.15em] text-slate-500">
      Final Status
    </div>

    <div className="mt-1 text-xl font-bold text-green-400">
      Disposed
    </div>
  </div>

  <a
    href={`/api/reo/assets/${assetId}/disposition/pdf`}
    className="inline-flex items-center justify-center gap-2 rounded-xl border border-green-500/30 bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-500"
  >
    <Download className="h-4 w-4" />
    Generate Final Asset Report PDF
  </a>
</div>
      </section>

      {/* EXECUTIVE METRICS */}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

        <Metric
          icon={DollarSign}
          label="Final Sale Price"
          value={
            money(
              metrics.finalSalePrice
            )
          }
        />

        <Metric
          icon={Banknote}
          label="Net Proceeds"
          value={
            money(
              metrics.netProceeds
            )
          }
        />

        <Metric
          icon={Clock3}
          label="Days in Inventory"
          value={
            metrics.daysInInventory !==
            null
              ? String(
                  metrics.daysInInventory
                )
              : "—"
          }
        />

        <Metric
          icon={ClipboardCheck}
          label="Tasks Completed"
          value={`${metrics.completedTasks}/${metrics.totalTasks}`}
        />

      </section>

      {/* ASSET SUMMARY */}

      <Panel
        icon={Building2}
        title="Asset Summary"
        subtitle="Institutional assignment and property record."
      >
        <DataGrid
          items={[
            [
              "Property Address",
              asset.property_address,
            ],

            [
              "City",
              asset.city,
            ],

            [
              "State",
              asset.state,
            ],

            [
              "ZIP Code",
              asset.zip_code,
            ],

            [
              "Client",
              asset.institution_name,
            ],

            [
              "Client Asset #",
              asset.client_asset_number,
            ],

            [
              "Loan #",
              asset.loan_number,
            ],

            [
              "Assignment Date",
              date(
                asset.assignment_date
              ),
            ],

            [
              "Occupancy",
              asset.occupancy_status,
            ],

            [
              "Property Type",
              asset.property_type,
            ],

            [
              "Final Status",
              "Disposed",
            ],

            [
              "Disposition Date",
              date(
                metrics.dispositionDate
              ),
            ],
          ]}
        />
      </Panel>

      {/* VALUATION / LISTING / SALE */}

      <Panel
        icon={TrendingUp}
        title="Valuation & Disposition Performance"
        subtitle="Pricing history from listing through final sale."
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

          <ValueCard
            label="Original List Price"
            value={
              money(
                metrics.originalListPrice
              )
            }
          />

          <ValueCard
            label="Final List Price"
            value={
              money(
                metrics.finalListPrice
              )
            }
          />

          <ValueCard
            label="Accepted Offer"
            value={
              money(
                acceptedOffer?.accepted_price ??
                  asset.accepted_offer
              )
            }
          />

          <ValueCard
            label="Final Sale Price"
            value={
              money(
                metrics.finalSalePrice
              )
            }
          />

        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">

          <ValueCard
            label="Net Proceeds"
            value={
              money(
                metrics.netProceeds
              )
            }
            prominent
          />

          <ValueCard
            label="MLS Number"
            value={
              marketing?.mls_number ||
              "—"
            }
          />

        </div>
      </Panel>

      {/* CONTRACT */}

      <Panel
        icon={FileCheck2}
        title="Contract & Closing Summary"
        subtitle="Final executed transaction information."
      >
        <DataGrid
          items={[
            [
              "Buyer",
              closing?.buyer_name ||
                contract?.buyer_name,
            ],

            [
              "Financing",
              closing?.financing_type ||
                contract?.financing_type,
            ],

            [
              "Contract Date",
              date(
                contract?.contract_date
              ),
            ],

            [
              "Closing Date",
              date(
                closing?.closing_date
              ),
            ],

            [
              "Closing Attorney",
              closing?.attorney_name ||
                contract?.attorney_name,
            ],

            [
              "Title Company",
              closing?.title_company ||
                contract?.title_company,
            ],

            [
              "Gross Sale Price",
              money(
                closing?.gross_sale_price
              ),
            ],

            [
              "Net Proceeds",
              money(
                closing?.net_proceeds
              ),
            ],

            [
              "Deed Recorded",
              yesNo(
                closing?.deed_recorded
              ),
            ],

            [
              "Recording Date",
              date(
                closing?.recording_date
              ),
            ],

            [
              "Instrument Number",
              closing?.recording_instrument_number,
            ],

            [
              "MLS Closed / Sold",
              yesNo(
                closing?.mls_closed
              ),
            ],
          ]}
        />
      </Panel>

      {/* CLOSEOUT */}

      <Panel
        icon={Archive}
        title="Final Closeout"
        subtitle="Property, documentation, funding, and client closeout."
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

          <Status
            label="Funds Received"
            value={
              closing?.funds_received
            }
          />

          <Status
            label="Deed Recorded"
            value={
              closing?.deed_recorded
            }
          />

          <Status
            label="Client Closing Package"
            value={
              closing?.client_closing_package_complete
            }
          />

          <Status
            label="MLS Closed"
            value={
              closing?.mls_closed
            }
          />

          <Status
            label="Lockbox Removed"
            value={
              closing?.lockbox_removed
            }
          />

          <Status
            label="Signage Removed"
            value={
              closing?.signage_removed
            }
          />

          <Status
            label="Utilities Transferred"
            value={
              closing?.utilities_transferred
            }
          />

          <Status
            label="Keys Released"
            value={
              closing?.keys_released
            }
          />

          <Status
            label="Vendors Notified"
            value={
              closing?.vendors_notified
            }
          />

        </div>
      </Panel>

      {/* TASK AUDIT */}

      <Panel
        icon={ClipboardCheck}
        title="Operational Completion"
        subtitle="Task and SLA closeout across the asset lifecycle."
      >
        <div className="grid gap-4 md:grid-cols-3">

          <ValueCard
            label="Total Tasks"
            value={
              String(
                metrics.totalTasks
              )
            }
          />

          <ValueCard
            label="Completed"
            value={
              String(
                metrics.completedTasks
              )
            }
          />

          <ValueCard
            label="Remaining Open"
            value={
              String(
                metrics.openTasks
              )
            }
          />

        </div>

        {tasks.length > 0 && (
          <div className="mt-6 divide-y divide-white/10 rounded-xl border border-white/10">

            {tasks.map(
              (task) => (
                <div
                  key={
                    task.id
                  }
                  className="flex flex-col justify-between gap-3 px-5 py-4 md:flex-row md:items-center"
                >
                  <div>
                    <div className="text-sm font-medium text-slate-200">
                      {
                        task.title
                      }
                    </div>

                    <div className="mt-1 text-xs capitalize text-slate-600">
                      {
                        task.workflow_stage
                      }
                    </div>
                  </div>

                  <div
                    className={`text-xs font-semibold ${
                      task.status ===
                      "completed"
                        ? "text-green-400"
                        : "text-amber-400"
                    }`}
                  >
                    {
                      task.status
                    }
                  </div>
                </div>
              )
            )}

          </div>
        )}
      </Panel>

      {/* LIFECYCLE AUDIT */}

      <Panel
        icon={History}
        title="Lifecycle & Activity History"
        subtitle="Permanent chronological audit trail."
      >
        <div className="relative space-y-0">

          {activities.map(
            (
              activity,
              index
            ) => (
              <div
                key={
                  activity.id
                }
                className="relative flex gap-4 pb-7"
              >
                {index <
                  activities.length -
                    1 && (
                  <div className="absolute left-[11px] top-6 h-full w-px bg-white/10" />
                )}

                <div className="relative z-10 mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-green-500/30 bg-green-500/10">
                  <CheckCircle2 className="h-3.5 w-3.5 text-green-400" />
                </div>

                <div>
                  <div className="text-sm font-semibold text-slate-200">
                    {
                      activity.title
                    }
                  </div>

                  {activity.description && (
                    <div className="mt-1 text-sm text-slate-500">
                      {
                        activity.description
                      }
                    </div>
                  )}

                  <div className="mt-2 text-xs text-slate-600">
                    {dateTime(
                      activity.created_at
                    )}
                  </div>
                </div>
              </div>
            )
          )}

        </div>
      </Panel>

      {/* FINAL NOTES */}

      {(closing?.closing_notes ||
        closing?.disposition_notes) && (
        <Panel
          icon={Landmark}
          title="Final Asset Manager Notes"
          subtitle="Closing and disposition documentation."
        >
          {closing?.closing_notes && (
            <Note
              label="Closing Notes"
              text={
                closing.closing_notes
              }
            />
          )}

          {closing?.disposition_notes && (
            <div className="mt-5">
              <Note
                label="Disposition Notes"
                text={
                  closing.disposition_notes
                }
              />
            </div>
          )}
        </Panel>
      )}

      <section className="rounded-2xl border border-green-500/20 bg-[#07111f] p-6">
        <div className="flex items-center gap-4">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-500/10">
            <Archive className="h-5 w-5 text-green-400" />
          </div>

          <div>
            <h3 className="font-semibold">
              Institutional Asset File Complete
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              The operational record remains available for client reporting, audit history, compliance review, and portfolio analytics.
            </p>
          </div>

        </div>
      </section>

    </div>
  );
}

function money(
  value:
    | number
    | null
    | undefined
) {
  if (
    value === null ||
    value === undefined
  ) {
    return "—";
  }

  return new Intl.NumberFormat(
    "en-US",
    {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }
  ).format(
    Number(value)
  );
}

function date(
  value:
    | string
    | null
    | undefined
) {
  if (!value) return "—";

  return new Date(
    `${value}T00:00:00`
  ).toLocaleDateString(
    "en-US"
  );
}

function dateTime(
  value:
    | string
    | null
    | undefined
) {
  if (!value) return "—";

  return new Date(
    value
  ).toLocaleString(
    "en-US"
  );
}

function yesNo(
  value:
    | boolean
    | null
    | undefined
) {
  return value
    ? "Yes"
    : "No";
}

function Metric({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Archive;
  label: string;
  value: string;
}) {
  return (
    <div className="reo-card rounded-2xl p-5">

      <div className="flex items-center justify-between">

        <div className="text-sm text-slate-400">
          {label}
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-500/10">
          <Icon className="h-4 w-4 text-green-400" />
        </div>

      </div>

      <div className="mt-4 text-2xl font-bold">
        {value}
      </div>

    </div>
  );
}

function Panel({
  icon: Icon,
  title,
  subtitle,
  children,
}: {
  icon: typeof Archive;
  title: string;
  subtitle: string;
  children:
    React.ReactNode;
}) {
  return (
    <section className="reo-card rounded-2xl">

      <div className="flex items-center gap-4 border-b border-white/10 px-6 py-5">

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10">
          <Icon className="h-5 w-5 text-green-400" />
        </div>

        <div>
          <h2 className="font-semibold">
            {title}
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            {subtitle}
          </p>
        </div>

      </div>

      <div className="p-6">
        {children}
      </div>

    </section>
  );
}

function DataGrid({
  items,
}: {
  items: Array<
    [
      string,
      any
    ]
  >;
}) {
  return (
    <div className="grid gap-x-8 gap-y-6 md:grid-cols-2 lg:grid-cols-3">

      {items.map(
        ([
          label,
          value,
        ]) => (
          <div
            key={
              label
            }
          >
            <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-600">
              {label}
            </div>

            <div className="mt-2 text-sm text-slate-200">
              {value ||
                "—"}
            </div>
          </div>
        )
      )}

    </div>
  );
}

function ValueCard({
  label,
  value,
  prominent = false,
}: {
  label: string;
  value: string;
  prominent?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-5 ${
        prominent
          ? "border-green-500/20 bg-green-500/[0.05]"
          : "border-white/10 bg-white/[0.025]"
      }`}
    >
      <div className="text-xs text-slate-500">
        {label}
      </div>

      <div
        className={`mt-2 font-bold ${
          prominent
            ? "text-2xl text-green-400"
            : "text-xl"
        }`}
      >
        {value}
      </div>
    </div>
  );
}

function Status({
  label,
  value,
}: {
  label: string;
  value:
    | boolean
    | null
    | undefined;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.025] px-4 py-4">

      <span className="text-sm text-slate-300">
        {label}
      </span>

      <span
        className={`rounded-full px-3 py-1 text-xs font-semibold ${
          value
            ? "bg-green-500/15 text-green-400"
            : "bg-slate-800 text-slate-500"
        }`}
      >
        {value
          ? "Complete"
          : "Incomplete"}
      </span>

    </div>
  );
}

function Note({
  label,
  text,
}: {
  label: string;
  text: string;
}) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-600">
        {label}
      </div>

      <div className="mt-3 whitespace-pre-wrap rounded-xl border border-white/10 bg-white/[0.025] p-5 text-sm leading-6 text-slate-300">
        {text}
      </div>
    </div>
  );
}
