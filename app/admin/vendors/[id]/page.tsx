import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import {
  ArrowLeft,
  Building2,
  CalendarDays,
  ClipboardList,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  UserRound,
} from "lucide-react";

export const dynamic = "force-dynamic";

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

function formatDate(value?: string | null) {
  if (!value) return "Not provided";

  return new Date(
    `${value}T12:00:00`
  ).toLocaleDateString();
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

  const number = Number(value);

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

export default async function VendorDetailPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = await params;

  const supabase = getSupabase();

  const [
    vendorResult,
    workOrdersResult,
  ] = await Promise.all([
    supabase
      .from("reo_vendors")
      .select("*")
      .eq("id", id)
      .maybeSingle(),

    supabase
      .from("reo_work_orders")
      .select("*")
      .eq("vendor_id", id)
      .order("created_at", {
        ascending: false,
      }),
  ]);

  if (vendorResult.error) {
    throw vendorResult.error;
  }

  if (workOrdersResult.error) {
    throw workOrdersResult.error;
  }

  const vendor = vendorResult.data;

  if (!vendor) {
    notFound();
  }

  const workOrders =
    workOrdersResult.data || [];

  const activeWorkOrders =
    workOrders.filter(
      (workOrder) =>
        workOrder.status !== "completed" &&
        workOrder.status !== "cancelled"
    );

  const completedWorkOrders =
    workOrders.filter(
      (workOrder) =>
        workOrder.status === "completed"
    );

  const totalFinalCost =
    completedWorkOrders.reduce(
      (total, workOrder) =>
        total +
        Number(
          workOrder.final_cost || 0
        ),
      0
    );

  const complianceComplete =
    vendor.w9_on_file &&
    vendor.insurance_on_file &&
    vendor.tax_id_on_file;

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8">
          <Link
            href="/admin/vendors"
            className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-950"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Vendor Management
          </Link>

          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-bold tracking-tight text-slate-950">
                  {vendor.company_name}
                </h1>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    vendor.active
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {vendor.active
                    ? "Active Vendor"
                    : "Inactive Vendor"}
                </span>
              </div>

              <p className="mt-2 text-sm text-slate-600">
                {vendor.vendor_type ||
                  "Vendor type not provided"}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href={`/admin/vendors/${vendor.id}/edit`}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Edit Vendor
              </Link>

              <Link
                href={`/admin/work-orders/new?vendor=${vendor.id}`}
                className="rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Create Work Order
              </Link>
            </div>
          </div>
        </div>

        <section className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Total Work Orders"
            value={workOrders.length}
          />

          <StatCard
            label="Active Work Orders"
            value={activeWorkOrders.length}
          />

          <StatCard
            label="Completed Work Orders"
            value={completedWorkOrders.length}
          />

          <StatCard
            label="Completed Work Cost"
            value={money(totalFinalCost)}
          />
        </section>

        <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
          <Section
            icon={
              <Building2 className="h-5 w-5" />
            }
            title="Vendor Profile"
          >
            <InfoRow
              label="Company"
              value={vendor.company_name}
            />

            <InfoRow
              label="Vendor Type"
              value={
                vendor.vendor_type ||
                "Not provided"
              }
            />

            <InfoRow
              label="Status"
              value={
                vendor.active
                  ? "Active"
                  : "Inactive"
              }
            />

            <InfoRow
              label="Service Areas"
              value={
                vendor.service_areas ||
                "Not provided"
              }
            />
          </Section>

          <Section
            icon={
              <UserRound className="h-5 w-5" />
            }
            title="Primary Contact"
          >
            <InfoRow
              icon={
                <UserRound className="h-4 w-4" />
              }
              label="Contact Name"
              value={
                vendor.contact_name ||
                "Not provided"
              }
            />

            <InfoRow
              icon={
                <Mail className="h-4 w-4" />
              }
              label="Email"
              value={
                vendor.email ||
                "Not provided"
              }
            />

            <InfoRow
              icon={
                <Phone className="h-4 w-4" />
              }
              label="Phone"
              value={
                vendor.phone ||
                "Not provided"
              }
            />
          </Section>

          <Section
            icon={
              <MapPin className="h-5 w-5" />
            }
            title="Business Address"
          >
            <InfoRow
              label="Address"
              value={
                vendor.address_line_1 ||
                "Not provided"
              }
            />

            {vendor.address_line_2 ? (
              <InfoRow
                label="Address Line 2"
                value={
                  vendor.address_line_2
                }
              />
            ) : null}

            <InfoRow
              label="City"
              value={
                vendor.city ||
                "Not provided"
              }
            />

            <InfoRow
              label="State"
              value={
                vendor.state ||
                "Not provided"
              }
            />

            <InfoRow
              label="ZIP"
              value={
                vendor.zip_code ||
                "Not provided"
              }
            />
          </Section>

          <Section
            icon={
              <ShieldCheck className="h-5 w-5" />
            }
            title="Compliance"
          >
            <ComplianceRow
              label="W-9 on File"
              complete={
                vendor.w9_on_file
              }
            />

            <ComplianceRow
              label="Insurance on File"
              complete={
                vendor.insurance_on_file
              }
            />

            <ComplianceRow
              label="Tax ID on File"
              complete={
                vendor.tax_id_on_file
              }
            />

            <InfoRow
              icon={
                <CalendarDays className="h-4 w-4" />
              }
              label="Insurance Expiration"
              value={formatDate(
                vendor.insurance_expiration
              )}
            />

            <div
              className={`mt-4 rounded-xl px-4 py-3 text-sm font-semibold ${
                complianceComplete
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-amber-50 text-amber-700"
              }`}
            >
              {complianceComplete
                ? "Vendor compliance is complete."
                : "Vendor has outstanding compliance items."}
            </div>
          </Section>
        </div>

        <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-200 px-6 py-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-950">
                Assigned Work Orders
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Work assigned to this
                vendor across Carolina
                REO assets.
              </p>
            </div>

            <Link
              href={`/admin/work-orders/new?vendor=${vendor.id}`}
              className="text-sm font-semibold text-slate-950 hover:underline"
            >
              Create Work Order
            </Link>
          </div>

          {workOrders.length === 0 ? (
            <div className="px-6 py-14 text-center">
              <ClipboardList className="mx-auto h-8 w-8 text-slate-300" />

              <h3 className="mt-3 font-semibold text-slate-950">
                No work orders assigned
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                This vendor has not yet
                been assigned work through
                Carolina REO.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {workOrders.map(
                (workOrder) => (
                  <div
                    key={workOrder.id}
                    className="grid gap-4 px-6 py-5 md:grid-cols-[1.4fr_1fr_1fr_auto]"
                  >
                    <div>
                      <Link
                        href={`/admin/work-orders/${workOrder.id}`}
                        className="font-semibold text-slate-950 hover:underline"
                      >
                        {
                          workOrder.work_order_number
                        }
                      </Link>

                      <p className="mt-1 text-sm text-slate-600">
                        {
                          workOrder.title
                        }
                      </p>

                      <p className="mt-1 text-xs uppercase tracking-wide text-slate-400">
                        {
                          workOrder.category
                        }
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Status
                      </p>

                      <p className="mt-1 text-sm font-semibold capitalize text-slate-700">
                        {
                          workOrder.status
                        }
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Due Date
                      </p>

                      <p className="mt-1 text-sm text-slate-700">
                        {formatDate(
                          workOrder.due_date
                        )}
                      </p>
                    </div>

                    <div className="md:text-right">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Final Cost
                      </p>

                      <p className="mt-1 text-sm font-semibold text-slate-950">
                        {money(
                          workOrder.final_cost
                        )}
                      </p>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </section>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-5">
            <h2 className="text-lg font-semibold text-slate-950">
              Internal Notes
            </h2>
          </div>

          <div className="p-6">
            <p className="whitespace-pre-wrap text-sm leading-6 text-slate-600">
              {vendor.notes ||
                "No internal notes have been recorded."}
            </p>
          </div>
        </section>
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
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center gap-3 border-b border-slate-200 px-6 py-5">
        <span className="text-slate-500">
          {icon}
        </span>

        <h2 className="text-lg font-semibold text-slate-950">
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
        <span>{label}</span>
      </div>

      <span className="text-right text-sm font-semibold text-slate-800">
        {value}
      </span>
    </div>
  );
}

function ComplianceRow({
  label,
  complete,
}: {
  label: string;
  complete: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3">
      <span className="text-sm text-slate-500">
        {label}
      </span>

      <span
        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
          complete
            ? "bg-emerald-50 text-emerald-700"
            : "bg-amber-50 text-amber-700"
        }`}
      >
        {complete
          ? "Complete"
          : "Missing"}
      </span>
    </div>
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

      <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
        {value}
      </p>
    </div>
  );
}
