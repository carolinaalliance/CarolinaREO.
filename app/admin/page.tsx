"use client";

import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Building2,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  FileSearch,
  Gavel,
  Home,
  Plus,
  Search,
  TrendingUp,
  Wrench,
} from "lucide-react";

const stats = [
  {
    title: "Active Assets",
    value: "0",
    subtitle: "Current portfolio",
    icon: Building2,
  },
  {
    title: "New Assignments",
    value: "0",
    subtitle: "Awaiting intake",
    icon: ClipboardCheck,
  },
  {
    title: "Critical Exceptions",
    value: "0",
    subtitle: "Require attention",
    icon: AlertTriangle,
  },
  {
    title: "Tasks Due Today",
    value: "0",
    subtitle: "Across portfolio",
    icon: Clock3,
  },
  {
    title: "BPOs Due",
    value: "0",
    subtitle: "Valuations pending",
    icon: FileSearch,
  },
  {
    title: "Inspections Due",
    value: "0",
    subtitle: "Field activity",
    icon: Home,
  },
  {
    title: "Offers Pending",
    value: "0",
    subtitle: "Awaiting decision",
    icon: Gavel,
  },
  {
    title: "Closings This Week",
    value: "0",
    subtitle: "Scheduled dispositions",
    icon: CalendarDays,
  },
];

const lifecycle = [
  "Assignment",
  "Intake",
  "Occupancy",
  "Securing",
  "Inspection",
  "Valuation",
  "Preservation",
  "Repairs",
  "Pre-Marketing",
  "Listed",
  "Offer Review",
  "Under Contract",
  "Closing",
  "Disposed",
];

export default function OperationsCommandCenter() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* HEADER */}
      <header className="border-b border-white/10 bg-slate-950">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600">
              <Building2 className="h-6 w-6" />
            </div>

            <div>
              <div className="text-lg font-bold tracking-wide">
                CAROLINA REO
              </div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-slate-500">
                Operations Command Center
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="hidden rounded-lg border border-white/10 px-4 py-2 text-sm text-slate-300 transition hover:bg-white/5 md:block"
            >
              Public Website
            </Link>

            <Link
              href="/admin/assets/new"
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold transition hover:bg-blue-500"
            >
              <Plus className="h-4 w-4" />
              New Assignment
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1600px] px-6 py-8">
        {/* PAGE TITLE */}
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-500">
              Portfolio Operations
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
              Operations Command Center
            </h1>

            <p className="mt-2 max-w-3xl text-slate-400">
              Portfolio-wide visibility from initial assignment through final
              disposition.
            </p>
          </div>

          <div className="relative w-full lg:w-80">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-500" />

            <input
              type="text"
              placeholder="Search assets..."
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-2.5 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-600 focus:border-blue-500"
            />
          </div>
        </div>

        {/* KPI CARDS */}
        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10">
                    <Icon className="h-4 w-4 text-blue-400" />
                  </div>

                  <span className="text-2xl font-bold">{stat.value}</span>
                </div>

                <div className="mt-5 text-sm font-medium">{stat.title}</div>

                <div className="mt-1 text-xs text-slate-500">
                  {stat.subtitle}
                </div>
              </div>
            );
          })}
        </section>

        {/* MAIN GRID */}
        <section className="mt-8 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
          {/* ASSETS REQUIRING ATTENTION */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.025]">
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
              <div>
                <h2 className="text-lg font-semibold">
                  Assets Requiring Attention
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Exceptions, overdue items and operational risks.
                </p>
              </div>

              <AlertTriangle className="h-5 w-5 text-amber-400" />
            </div>

            <div className="flex min-h-64 items-center justify-center p-8">
              <div className="text-center">
                <CheckCircle2 className="mx-auto h-9 w-9 text-green-400" />

                <p className="mt-4 font-medium">
                  No portfolio exceptions
                </p>

                <p className="mt-2 text-sm text-slate-500">
                  Critical and overdue assets will appear here.
                </p>
              </div>
            </div>
          </div>

          {/* DEADLINES */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.025]">
            <div className="border-b border-white/10 px-6 py-5">
              <h2 className="text-lg font-semibold">Upcoming Deadlines</h2>

              <p className="mt-1 text-sm text-slate-500">
                SLA and asset-level deadlines.
              </p>
            </div>

            <div className="space-y-3 p-5">
              {[
                "Initial Inspection",
                "Occupancy Verification",
                "BPO Delivery",
                "Preservation Bid",
                "Marketing Report",
                "Offer Response",
                "Closing",
              ].map((deadline) => (
                <div
                  key={deadline}
                  className="flex items-center justify-between rounded-xl bg-white/[0.03] px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <Clock3 className="h-4 w-4 text-slate-500" />

                    <span className="text-sm text-slate-300">
                      {deadline}
                    </span>
                  </div>

                  <span className="text-xs text-slate-600">—</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* RECENT ASSIGNMENTS */}
        <section className="mt-6 rounded-2xl border border-white/10 bg-white/[0.025]">
          <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
            <div>
              <h2 className="text-lg font-semibold">Recent Assignments</h2>

              <p className="mt-1 text-sm text-slate-500">
                Most recently received institutional assets.
              </p>
            </div>

            <Link
              href="/admin/assets"
              className="flex items-center gap-2 text-sm font-medium text-blue-400"
            >
              View All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="flex min-h-48 items-center justify-center p-8">
            <div className="text-center">
              <Building2 className="mx-auto h-9 w-9 text-slate-600" />

              <p className="mt-4 font-medium">No assignments yet</p>

              <p className="mt-2 text-sm text-slate-500">
                Your first assignment will appear here.
              </p>

              <Link
                href="/admin/assets/new"
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold hover:bg-blue-500"
              >
                <Plus className="h-4 w-4" />
                Create First Assignment
              </Link>
            </div>
          </div>
        </section>

        {/* LIFECYCLE */}
        <section className="mt-6 rounded-2xl border border-white/10 bg-white/[0.025] p-6">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h2 className="text-lg font-semibold">
                Portfolio Lifecycle
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Current asset distribution by operational stage.
              </p>
            </div>

            <BarChart3 className="h-5 w-5 text-blue-400" />
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7">
            {lifecycle.map((stage) => (
              <div
                key={stage}
                className="rounded-xl border border-white/10 bg-slate-950 p-4"
              >
                <div className="text-2xl font-bold">0</div>

                <div className="mt-2 text-xs text-slate-500">{stage}</div>
              </div>
            ))}
          </div>
        </section>

        {/* PERFORMANCE */}
        <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            ["Avg. Days to Secure", "—", Clock3],
            ["Avg. Days to List", "—", Home],
            ["Avg. Days to Disposition", "—", TrendingUp],
            ["Active Work Orders", "0", Wrench],
          ].map(([label, value, Icon]) => {
            const MetricIcon = Icon as typeof Clock3;

            return (
              <div
                key={label as string}
                className="rounded-2xl border border-white/10 bg-white/[0.025] p-6"
              >
                <MetricIcon className="h-5 w-5 text-blue-400" />

                <div className="mt-5 text-3xl font-bold">
                  {value as string}
                </div>

                <div className="mt-2 text-sm text-slate-500">
                  {label as string}
                </div>
              </div>
            );
          })}
        </section>
      </div>
    </main>
  );
}
