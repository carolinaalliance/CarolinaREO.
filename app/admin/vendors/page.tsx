import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import {
  Building2,
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

export default async function VendorsPage() {
  const supabase = getSupabase();

  const { data: vendors, error } =
    await supabase
      .from("reo_vendors")
      .select("*")
      .order("company_name", {
        ascending: true,
      });

  if (error) {
    throw error;
  }

  const vendorList = vendors || [];

  const activeCount =
    vendorList.filter(
      (vendor) => vendor.active
    ).length;

  const insuredCount =
    vendorList.filter(
      (vendor) =>
        vendor.insurance_on_file
    ).length;

  const w9Count =
    vendorList.filter(
      (vendor) => vendor.w9_on_file
    ).length;

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              Carolina REO
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-slate-950">
              Vendor Management
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Manage approved vendors,
              service coverage,
              compliance records,
              and assignment readiness.
            </p>
          </div>

          <Link
            href="/admin/vendors/new"
            className="inline-flex items-center justify-center rounded-lg bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Add Vendor
          </Link>
        </div>

        <section className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Total Vendors"
            value={vendorList.length}
          />

          <StatCard
            label="Active Vendors"
            value={activeCount}
          />

          <StatCard
            label="Insurance on File"
            value={insuredCount}
          />

          <StatCard
            label="W-9 on File"
            value={w9Count}
          />
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-5">
            <h2 className="text-lg font-semibold text-slate-950">
              Vendor Directory
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Approved service providers
              available for Carolina REO
              assignments.
            </p>
          </div>

          {vendorList.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                <Building2 className="h-6 w-6 text-slate-500" />
              </div>

              <h3 className="mt-4 text-base font-semibold text-slate-950">
                No vendors yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Add your first preservation,
                inspection, repair, lawn,
                securing, or maintenance
                vendor.
              </p>

              <Link
                href="/admin/vendors/new"
                className="mt-5 inline-flex rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white"
              >
                Add First Vendor
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {vendorList.map((vendor) => (
                <div
                  key={vendor.id}
                  className="grid gap-5 px-6 py-5 lg:grid-cols-[1.5fr_1fr_1fr_auto]"
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-slate-950">
                        {vendor.company_name}
                      </h3>

                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          vendor.active
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {vendor.active
                          ? "Active"
                          : "Inactive"}
                      </span>
                    </div>

                    {vendor.vendor_type ? (
                      <p className="mt-1 text-sm font-medium text-slate-600">
                        {vendor.vendor_type}
                      </p>
                    ) : null}

                    <div className="mt-3 space-y-1.5 text-sm text-slate-500">
                      {vendor.contact_name ? (
                        <div className="flex items-center gap-2">
                          <UserRound className="h-4 w-4" />
                          <span>
                            {
                              vendor.contact_name
                            }
                          </span>
                        </div>
                      ) : null}

                      {vendor.email ? (
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          <span>
                            {vendor.email}
                          </span>
                        </div>
                      ) : null}

                      {vendor.phone ? (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          <span>
                            {vendor.phone}
                          </span>
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Service Area
                    </p>

                    <div className="mt-2 flex items-start gap-2 text-sm text-slate-600">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0" />

                      <span>
                        {vendor.service_areas ||
                          [
                            vendor.city,
                            vendor.state,
                          ]
                            .filter(Boolean)
                            .join(", ") ||
                          "Not provided"}
                      </span>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Compliance
                    </p>

                    <div className="mt-2 space-y-2 text-sm">
                      <ComplianceRow
                        label="W-9"
                        complete={
                          vendor.w9_on_file
                        }
                      />

                      <ComplianceRow
                        label="Insurance"
                        complete={
                          vendor.insurance_on_file
                        }
                      />

                      <ComplianceRow
                        label="Tax ID"
                        complete={
                          vendor.tax_id_on_file
                        }
                      />
                    </div>
                  </div>

                  <div className="flex items-center lg:justify-end">
                    <Link
                      href={`/admin/vendors/${vendor.id}`}
                      className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      View Vendor
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: number;
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

function ComplianceRow({
  label,
  complete,
}: {
  label: string;
  complete: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <ShieldCheck
        className={`h-4 w-4 ${
          complete
            ? "text-emerald-600"
            : "text-slate-300"
        }`}
      />

      <span
        className={
          complete
            ? "text-slate-700"
            : "text-slate-400"
        }
      >
        {label}
      </span>
    </div>
  );
}
