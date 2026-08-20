import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import {
  AlertTriangle,
  BarChart3,
  Building2,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  FileSearch,
  Gavel,
  Home,
  LayoutDashboard,
  Plus,
  Search,
  TrendingUp,
  Wrench,
} from "lucide-react";

export const dynamic = "force-dynamic";

const navigation = [
  ["Operations Command Center", LayoutDashboard],
  ["New Assignment", Plus],
  ["Portfolio Overview", BarChart3],
  ["Active Assets", Building2],
  ["Tasks Due Today", Clock3],
  ["Critical Exceptions", AlertTriangle],
  ["Inspections Due", Home],
  ["BPOs Due", FileSearch],
  ["Offers Pending", Gavel],
  ["Work Orders", Wrench],
];

function getSupabase() {
  const supabaseUrl =
    process.env.SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL;

  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Supabase server environment variables are missing."
    );
  }

  return createClient(
    supabaseUrl,
    serviceRoleKey,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );
}

function startOfTodayIso() {
  const now = new Date();

  const start = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    0,
    0,
    0,
    0
  );

  return start.toISOString();
}

function endOfTodayIso() {
  const now = new Date();

  const end = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    23,
    59,
    59,
    999
  );

  return end.toISOString();
}

function endOfWeekDate() {
  const now = new Date();
  const day = now.getDay();
  const daysUntilSunday = 7 - day;

  const end = new Date(now);
  end.setDate(now.getDate() + daysUntilSunday);

  return end.toISOString().slice(0, 10);
}

function todayDate() {
  return new Date().toISOString().slice(0, 10);
}

function formatDate(value: string | null) {
  if (!value) return "—";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function formatDateTime(value: string | null) {
  if (!value) return "—";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export default async function AdminPage() {
  const supabase = getSupabase();

  const todayStart = startOfTodayIso();
  const todayEnd = endOfTodayIso();

  const [
    activeAssetsResult,
    newAssignmentsResult,
    tasksTodayResult,
    closingsResult,
    recentAssetsResult,
    upcomingTasksResult,
    overdueTasksResult,
    lifecycleResult,
  ] = await Promise.all([
    supabase
      .from("reo_assets")
      .select("*", { count: "exact", head: true })
      .eq("status", "active"),

    supabase
      .from("reo_assets")
      .select("*", { count: "exact", head: true })
      .eq("workflow_stage", "assignment")
      .eq("status", "active"),

    supabase
      .from("reo_asset_tasks")
      .select("*", { count: "exact", head: true })
      .eq("status", "open")
      .gte("due_at", todayStart)
      .lte("due_at", todayEnd),

    supabase
      .from("reo_assets")
      .select("*", { count: "exact", head: true })
      .gte("closing_date", todayDate())
      .lte("closing_date", endOfWeekDate()),

    supabase
      .from("reo_assets")
      .select(`
        id,
        asset_number,
        property_address,
        city,
        state,
        workflow_stage,
        assignment_date,
        created_at,
        reo_clients (
          institution_name
        )
      `)
      .order("created_at", { ascending: false })
      .limit(5),

    supabase
      .from("reo_asset_tasks")
      .select(`
        id,
        title,
        due_at,
        priority,
        workflow_stage,
        reo_assets (
          asset_number,
          property_address,
          city,
          state
        )
      `)
      .eq("status", "open")
      .not("due_at", "is", null)
      .order("due_at", { ascending: true })
      .limit(6),

    supabase
      .from("reo_asset_tasks")
      .select(`
        id,
        title,
        due_at,
        priority,
        reo_assets (
          asset_number,
          property_address
        )
      `)
      .eq("status", "open")
      .lt("due_at", new Date().toISOString())
      .order("due_at", { ascending: true })
      .limit(8),

    supabase
      .from("reo_assets")
      .select("workflow_stage")
      .eq("status", "active"),
  ]);

  const activeAssets =
    activeAssetsResult.count ?? 0;

  const newAssignments =
    newAssignmentsResult.count ?? 0;

  const tasksDueToday =
    tasksTodayResult.count ?? 0;

  const closingsThisWeek =
    closingsResult.count ?? 0;

  const recentAssets =
    recentAssetsResult.data ?? [];

  const upcomingTasks =
    upcomingTasksResult.data ?? [];

  const overdueTasks =
    overdueTasksResult.data ?? [];

  const lifecycleRows =
    lifecycleResult.data ?? [];

  const lifecycleCounts: Record<string, number> = {
    assignment: 0,
    occupancy: 0,
    securing: 0,
    inspection: 0,
    valuation: 0,
    preservation: 0,
    repairs: 0,
    pre_marketing: 0,
    listed: 0,
    offer_review: 0,
    under_contract: 0,
    closing: 0,
    disposed: 0,
  };

  lifecycleRows.forEach((row) => {
    if (row.workflow_stage in lifecycleCounts) {
      lifecycleCounts[row.workflow_stage] += 1;
    }
  });

  const lifecycle = [
    ["Assignment", lifecycleCounts.assignment],
    ["Occupancy", lifecycleCounts.occupancy],
    ["Securing", lifecycleCounts.securing],
    ["Inspection", lifecycleCounts.inspection],
    ["Valuation", lifecycleCounts.valuation],
    [
      "Preservation",
      lifecycleCounts.preservation +
        lifecycleCounts.repairs,
    ],
    [
      "Marketing",
      lifecycleCounts.pre_marketing +
        lifecycleCounts.listed,
    ],
    [
      "Offer / Closing",
      lifecycleCounts.offer_review +
        lifecycleCounts.under_contract +
        lifecycleCounts.closing,
    ],
  ];

  const stats = [
    {
      title: "Active Assets",
      value: String(activeAssets),
      subtitle: "Current portfolio",
      icon: Building2,
      accent: "border-green-500/30",
    },
    {
      title: "New Assignments",
      value: String(newAssignments),
      subtitle: "Awaiting intake",
      icon: ClipboardCheck,
      accent: "border-blue-500/30",
    },
    {
      title: "Tasks Due Today",
      value: String(tasksDueToday),
      subtitle: "Across portfolio",
      icon: Clock3,
      accent: "border-amber-500/30",
    },
    {
      title: "Closings This Week",
      value: String(closingsThisWeek),
      subtitle: "Scheduled dispositions",
      icon: CalendarDays,
      accent: "border-purple-500/30",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="grid min-h-screen lg:grid-cols-[260px_1fr]">
        <aside className="border-r border-white/10 bg-[#050d18]">
          <div className="sticky top-0 flex h-screen flex-col">
            <div className="border-b border-white/10 px-5 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10">
                  <Building2 className="h-5 w-5 text-green-400" />
                </div>

                <div>
                  <div className="font-bold">
                    CAROLINA REO
                  </div>

                  <div className="text-[10px] uppercase tracking-[0.22em] text-slate-500">
                    Asset Management
                  </div>
                </div>
              </div>
            </div>

            <nav className="flex-1 space-y-1 overflow-y-auto p-4">
              {navigation.map(
                ([label, Icon], index) => {
                  const NavIcon =
                    Icon as typeof Building2;

                  return (
                    <Link
                      key={label as string}
                      href={
                        label === "New Assignment"
                          ? "/admin/assets/new"
                          : "/admin"
                      }
                      className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${
                        index === 0
                          ? "bg-green-600 text-white"
                          : "text-slate-400 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <NavIcon className="h-4 w-4" />
                      {label as string}
                    </Link>
                  );
                }
              )}
            </nav>

            <div className="border-t border-white/10 p-4">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold">
                    PH
                  </div>

                  <div>
                    <div className="text-sm font-semibold">
                      Administrator
                    </div>
                    <div className="text-xs text-slate-500">
                      Carolina REO
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <section>
          <header className="border-b border-white/10 bg-slate-950/90 px-6 py-5 backdrop-blur-xl">
            <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-5">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  Operations Command Center
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  Portfolio-wide visibility from
                  assignment through disposition.
                </p>
              </div>

              <div className="relative hidden w-80 md:block">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-500" />

                <input
                  type="text"
                  placeholder="Search assets..."
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-2.5 pl-10 pr-4 text-sm outline-none focus:border-green-500"
                />
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-[1500px] px-6 py-8">
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {stats.map((stat) => {
                const Icon = stat.icon;

                return (
                  <div
                    key={stat.title}
                    className={`reo-card rounded-2xl border ${stat.accent} p-6`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-sm text-slate-400">
                          {stat.title}
                        </div>

                        <div className="mt-4 text-4xl font-bold">
                          {stat.value}
                        </div>

                        <div className="mt-2 text-xs text-slate-500">
                          {stat.subtitle}
                        </div>
                      </div>

                      <div className="rounded-xl bg-white/[0.05] p-3">
                        <Icon className="h-5 w-5 text-green-400" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-[1.15fr_.85fr]">
              <div className="reo-card rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold">
                      Portfolio Lifecycle
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Current asset distribution by
                      operational stage
                    </p>
                  </div>

                  <BarChart3 className="h-5 w-5 text-green-400" />
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {lifecycle.map(([stage, count]) => (
                    <div
                      key={stage as string}
                      className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.025] px-4 py-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-2.5 w-2.5 rounded-full bg-green-400" />

                        <span className="text-sm text-slate-300">
                          {stage as string}
                        </span>
                      </div>

                      <div className="text-lg font-semibold">
                        {count as number}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="reo-card rounded-2xl p-6">
                <div>
                  <h2 className="text-lg font-semibold">
                    Upcoming Deadlines
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    SLA and asset-level deadlines
                  </p>
                </div>

                <div className="mt-6 space-y-3">
                  {upcomingTasks.length === 0 ? (
                    <div className="rounded-xl border border-white/5 bg-white/[0.025] px-4 py-5 text-sm text-slate-500">
                      No upcoming deadlines.
                    </div>
                  ) : (
                    upcomingTasks.map((task) => {
                      const asset = Array.isArray(
                        task.reo_assets
                      )
                        ? task.reo_assets[0]
                        : task.reo_assets;

                      return (
                        <div
                          key={task.id}
                          className="rounded-xl border border-white/5 bg-white/[0.025] px-4 py-3"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex gap-3">
                              <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-green-400" />

                              <div>
                                <div className="text-sm font-medium text-slate-200">
                                  {task.title}
                                </div>

                                <div className="mt-1 text-xs text-slate-500">
                                  {asset?.property_address ??
                                    "Asset"}
                                </div>
                              </div>
                            </div>

                            <div className="text-right text-xs text-slate-400">
                              {formatDateTime(
                                task.due_at
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_.9fr]">
              <div className="reo-card rounded-2xl">
                <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
                  <div>
                    <h2 className="text-lg font-semibold">
                      Recent Assignments
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Most recently received institutional
                      assets
                    </p>
                  </div>

                  <Link
                    href="/admin/assets"
                    className="text-sm font-medium text-green-400"
                  >
                    View all
                  </Link>
                </div>

                {recentAssets.length === 0 ? (
                  <div className="flex min-h-72 items-center justify-center p-8">
                    <div className="text-center">
                      <Building2 className="mx-auto h-10 w-10 text-slate-700" />

                      <p className="mt-4 font-medium">
                        No assignments yet
                      </p>

                      <p className="mt-2 text-sm text-slate-500">
                        Your first institutional asset will
                        appear here.
                      </p>

                      <Link
                        href="/admin/assets/new"
                        className="mt-5 inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold hover:bg-green-500"
                      >
                        <Plus className="h-4 w-4" />
                        Create First Assignment
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="divide-y divide-white/5">
                    {recentAssets.map((asset) => {
                      const client = Array.isArray(
                        asset.reo_clients
                      )
                        ? asset.reo_clients[0]
                        : asset.reo_clients;

                      return (
                        <Link
                          key={asset.id}
                          href={`/admin/assets/${asset.id}`}
                          className="flex items-center justify-between gap-5 px-6 py-5 transition hover:bg-white/[0.025]"
                        >
                          <div>
                            <div className="font-semibold">
                              {asset.property_address}
                            </div>

                            <div className="mt-1 text-sm text-slate-500">
                              {asset.city}
                              {asset.city &&
                              asset.state
                                ? ", "
                                : ""}
                              {asset.state}
                            </div>

                            <div className="mt-2 text-xs text-slate-600">
                              {client?.institution_name ??
                                "Institutional Client"}
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-semibold capitalize text-green-400">
                              {asset.workflow_stage.replaceAll(
                                "_",
                                " "
                              )}
                            </div>

                            <div className="mt-2 text-xs text-slate-500">
                              {asset.asset_number}
                            </div>

                            <div className="mt-1 text-xs text-slate-600">
                              {formatDate(
                                asset.assignment_date
                              )}
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="reo-card rounded-2xl p-6">
                <div>
                  <h2 className="text-lg font-semibold">
                    Portfolio Snapshot
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Key performance metrics
                  </p>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-3">
                  {[
                    ["Avg. Days to Secure", "—"],
                    ["Avg. Days to List", "—"],
                    ["Avg. Days to Disposition", "—"],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="rounded-xl border border-white/5 bg-white/[0.025] p-4"
                    >
                      <div className="text-2xl font-bold">
                        {value}
                      </div>

                      <div className="mt-2 text-xs leading-5 text-slate-500">
                        {label}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 grid grid-cols-3 gap-3">
                  {[
                    ["Active Assets", String(activeAssets)],
                    ["Open Tasks", String(
                      upcomingTasks.length +
                        overdueTasks.length
                    )],
                    ["Overdue", String(overdueTasks.length)],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="rounded-xl border border-white/5 bg-white/[0.025] p-4"
                    >
                      <div className="text-2xl font-bold">
                        {value}
                      </div>

                      <div className="mt-2 text-xs leading-5 text-slate-500">
                        {label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 reo-card rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">
                    Assets Requiring Attention
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Exceptions, overdue items, and
                    operational risks
                  </p>
                </div>

                <AlertTriangle className="h-5 w-5 text-amber-400" />
              </div>

              {overdueTasks.length === 0 ? (
                <div className="mt-6 flex min-h-36 items-center justify-center rounded-xl border border-white/5 bg-white/[0.02]">
                  <div className="text-center">
                    <CheckCircle2 className="mx-auto h-8 w-8 text-green-400" />

                    <div className="mt-3 text-sm font-medium">
                      No portfolio exceptions
                    </div>

                    <div className="mt-1 text-xs text-slate-500">
                      Critical and overdue assets will
                      appear here.
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-6 space-y-3">
                  {overdueTasks.map((task) => {
                    const asset = Array.isArray(
                      task.reo_assets
                    )
                      ? task.reo_assets[0]
                      : task.reo_assets;

                    return (
                      <div
                        key={task.id}
                        className="rounded-xl border border-red-500/20 bg-red-500/[0.04] px-4 py-4"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="font-medium text-red-200">
                              {task.title}
                            </div>

                            <div className="mt-1 text-sm text-slate-500">
                              {asset?.property_address}
                            </div>

                            <div className="mt-1 text-xs text-slate-600">
                              {asset?.asset_number}
                            </div>
                          </div>

                          <div className="text-xs font-semibold text-red-300">
                            Due{" "}
                            {formatDateTime(
                              task.due_at
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-4">
              {[
                ["Avg. Days to Secure", "—", Clock3],
                ["Avg. Days to List", "—", Home],
                ["Avg. Days to Disposition", "—", TrendingUp],
                [
                  "Open SLA Tasks",
                  String(
                    upcomingTasks.length +
                      overdueTasks.length
                  ),
                  Wrench,
                ],
              ].map(([label, value, Icon]) => {
                const MetricIcon =
                  Icon as typeof Clock3;

                return (
                  <div
                    key={label as string}
                    className="reo-card rounded-2xl p-5"
                  >
                    <MetricIcon className="h-5 w-5 text-green-400" />

                    <div className="mt-4 text-2xl font-bold">
                      {value as string}
                    </div>

                    <div className="mt-2 text-xs text-slate-500">
                      {label as string}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
