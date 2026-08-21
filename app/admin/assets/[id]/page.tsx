import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import TaskCompleteButton from "./TaskCompleteButton";
import OccupancyPanel from "./OccupancyPanel";
import InspectionPanel from "./InspectionPanel";
import SecuringPanel from "./SecuringPanel";
import BpoPanel from "./BpoPanel";
import PreservationPanel from "./PreservationPanel";
import RepairPanel from "./RepairPanel";
import PreMarketingPanel from "./PreMarketingPanel";
import MarketingPanel from "./MarketingPanel";
import OfferPanel from "./OfferPanel";
import {
  AlertTriangle,
  ArrowLeft,
  Banknote,
  Building2,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  FileText,
  Gavel,
  Home,
  KeyRound,
  Landmark,
  ListChecks,
  MapPin,
  MessageSquare,
  Receipt,
  ShieldCheck,
  TrendingUp,
  UserRound,
  Users,
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

function formatDate(value?: string | null) {
  if (!value) return "—";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function formatDateTime(value?: string | null) {
  if (!value) return "—";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function daysSince(value?: string | null) {
  if (!value) return 0;

  const start = new Date(value).getTime();
  const now = Date.now();

  return Math.max(
    0,
    Math.floor((now - start) / (1000 * 60 * 60 * 24))
  );
}

function money(value?: number | null) {
  if (value === null || value === undefined) return "—";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function stageLabel(stage?: string | null) {
  if (!stage) return "Assignment";

  return stage
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

const lifecycle = [
  "assignment",
  "occupancy",
  "securing",
  "inspection",
  "valuation",
  "preservation",
  "repairs",
  "pre_marketing",
  "listed",
  "offer_review",
  "under_contract",
  "closing",
  "disposed",
];

const workspaceSections = [
  ["overview", "Overview", Home],
  ["assignment", "Assignment", ClipboardCheck],
  ["occupancy", "Occupancy", UserRound],
  ["inspections", "Inspections", ShieldCheck],
  ["securing", "Securing", KeyRound],
  ["preservation", "Preservation", Wrench],
  ["repairs", "Repairs", Wrench],
  ["valuation", "Valuation / BPO", TrendingUp],
  ["pre-marketing", "Pre-Marketing", ClipboardCheck],
  ["marketing", "Marketing", Landmark],
  ["offers", "Offers", Gavel],
  ["closing", "Closing", CheckCircle2],
  ["tasks", "Tasks / SLA", ListChecks],
  ["work-orders", "Work Orders", Wrench],
  ["vendors", "Vendors", Users],
  ["documents", "Documents", FileText],
  ["expenses", "Expenses", Receipt],
  ["communications", "Communications", MessageSquare],
  ["activity", "Activity History", Clock3],
];

export default async function AssetWorkspacePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { id } = await params;
  const { tab } = await searchParams;

  const activeTab = tab || "overview";
  
  const supabase = getSupabase();

  const [
    assetResult,
    tasksResult,
    activityResult,
  ] = await Promise.all([
    supabase
      .from("reo_assets")
      .select(`
        *,
        reo_clients (
          id,
          institution_name,
          institution_type,
          primary_contact_name,
          primary_contact_email,
          primary_contact_phone
        )
      `)
      .eq("id", id)
      .single(),

    supabase
      .from("reo_asset_tasks")
      .select("*")
      .eq("asset_id", id)
      .order("due_at", { ascending: true }),

    supabase
      .from("reo_asset_activity")
      .select("*")
      .eq("asset_id", id)
      .order("created_at", { ascending: false })
      .limit(25),
  ]);

  if (assetResult.error || !assetResult.data) {
    notFound();
  }

  const asset: any = assetResult.data;
  const tasks: any[] = tasksResult.data ?? [];
  const activity: any[] = activityResult.data ?? [];

  const client = Array.isArray(asset.reo_clients)
    ? asset.reo_clients[0]
    : asset.reo_clients;

  const openTasks = tasks.filter(
    (task) => task.status !== "completed"
  );

  const overdueTasks = openTasks.filter(
    (task) =>
      task.due_at &&
      new Date(task.due_at).getTime() < Date.now()
  );

  const completedTasks = tasks.filter(
    (task) => task.status === "completed"
  );

  const currentStageIndex = Math.max(
    0,
    lifecycle.indexOf(asset.workflow_stage)
  );

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* TOP HEADER */}
      <header className="border-b border-white/10 bg-[#050d18]">
        <div className="mx-auto flex max-w-[1700px] items-center justify-between gap-5 px-6 py-4">
          <div className="flex items-center gap-4">
           <a
  href="/admin"
  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-slate-400 transition hover:bg-white/[0.06] hover:text-white"
  title="Back to Operations Command Center"
>
  <ArrowLeft className="h-5 w-5" />
</a>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-500/10">
                <Building2 className="h-5 w-5 text-green-400" />
              </div>

              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.22em] text-green-400">
                  Carolina REO
                </div>

                <div className="text-lg font-bold">
                  Asset Workspace
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {overdueTasks.length > 0 && (
              <div className="hidden items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-300 md:flex">
                <AlertTriangle className="h-4 w-4" />
                {overdueTasks.length} overdue
              </div>
            )}

            <div className="rounded-full border border-green-500/20 bg-green-500/10 px-4 py-2 text-sm font-medium text-green-400">
              {stageLabel(asset.workflow_stage)}
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1700px] px-6 py-8">
        {/* ASSET HERO */}
        <section className="reo-card rounded-3xl p-7">
          <div className="flex flex-col justify-between gap-7 xl:flex-row xl:items-start">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-semibold text-slate-400">
                  {asset.asset_number}
                </span>

                <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-400">
                  {stageLabel(asset.workflow_stage)}
                </span>

                {asset.priority && (
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      asset.priority === "Emergency"
                        ? "bg-red-500/10 text-red-300"
                        : asset.priority === "Urgent"
                        ? "bg-orange-500/10 text-orange-300"
                        : asset.priority === "High"
                        ? "bg-amber-500/10 text-amber-300"
                        : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {asset.priority}
                  </span>
                )}
              </div>

              <h1 className="mt-5 text-3xl font-bold tracking-tight md:text-4xl">
                {asset.property_address}
              </h1>

              <div className="mt-3 flex items-center gap-2 text-slate-400">
                <MapPin className="h-4 w-4" />

                <span>
                  {[asset.city, asset.state, asset.postal_code]
                    .filter(Boolean)
                    .join(", ")}
                </span>
              </div>

              <div className="mt-6 flex flex-wrap gap-x-8 gap-y-4 text-sm">
                <div>
                  <div className="text-xs uppercase tracking-widest text-slate-600">
                    Client
                  </div>
                  <div className="mt-1 font-medium text-slate-200">
                    {client?.institution_name ?? "—"}
                  </div>
                </div>

                <div>
                  <div className="text-xs uppercase tracking-widest text-slate-600">
                    Client Asset #
                  </div>
                  <div className="mt-1 font-medium text-slate-200">
                    {asset.client_asset_number || "—"}
                  </div>
                </div>

                <div>
                  <div className="text-xs uppercase tracking-widest text-slate-600">
                    Loan #
                  </div>
                  <div className="mt-1 font-medium text-slate-200">
                    {asset.loan_number || "—"}
                  </div>
                </div>

                <div>
                  <div className="text-xs uppercase tracking-widest text-slate-600">
                    Assigned
                  </div>
                  <div className="mt-1 font-medium text-slate-200">
                    {formatDate(asset.assignment_date)}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid min-w-full gap-3 sm:grid-cols-4 xl:min-w-[560px]">
              <Metric
                label="Days in Inventory"
                value={String(daysSince(asset.assignment_date))}
              />

              <Metric
                label="Open Tasks"
                value={String(openTasks.length)}
              />

              <Metric
                label="Overdue"
                value={String(overdueTasks.length)}
                warning={overdueTasks.length > 0}
              />

              <Metric
                label="Occupancy"
                value={asset.occupancy_status || "Unknown"}
                small
              />
            </div>
          </div>
        </section>

        {/* LIFECYCLE */}
        <section className="reo-card mt-6 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">
                Asset Lifecycle
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Assignment through final disposition
              </p>
            </div>

            <TrendingUp className="h-5 w-5 text-green-400" />
          </div>

          <div className="mt-7 overflow-x-auto pb-2">
            <div className="flex min-w-[1250px] items-start">
              {lifecycle.map((stage, index) => {
                const complete = index < currentStageIndex;
                const current = index === currentStageIndex;

                return (
                  <div
                    key={stage}
                    className="relative flex flex-1 flex-col items-center"
                  >
                    {index < lifecycle.length - 1 && (
                      <div
                        className={`absolute left-1/2 top-5 h-[2px] w-full ${
                          index < currentStageIndex
                            ? "bg-green-500"
                            : "bg-white/10"
                        }`}
                      />
                    )}

                    <div
                      className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border ${
                        complete
                          ? "border-green-500 bg-green-600"
                          : current
                          ? "border-green-400 bg-green-500/15 text-green-400"
                          : "border-white/10 bg-slate-900 text-slate-600"
                      }`}
                    >
                      {complete ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        <span className="text-xs font-bold">
                          {index + 1}
                        </span>
                      )}
                    </div>

                    <div
                      className={`mt-3 max-w-24 text-center text-xs font-medium ${
                        current
                          ? "text-green-400"
                          : complete
                          ? "text-slate-300"
                          : "text-slate-600"
                      }`}
                    >
                      {stageLabel(stage)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* WORKSPACE NAVIGATION */}
        <section className="mt-6">
          <div className="flex gap-2 overflow-x-auto pb-2">
           {workspaceSections.map(
  ([key, label, Icon]) => {
    const SectionIcon =
      Icon as typeof Home;

    const selected =
      activeTab === key;

    return (
      <Link
        key={key as string}
        href={`/admin/assets/${asset.id}?tab=${key}`}
        className={`flex shrink-0 items-center gap-2 rounded-xl border px-4 py-2.5 text-sm transition ${
          selected
            ? "border-green-500/30 bg-green-500/10 text-green-400"
            : "border-white/10 bg-white/[0.025] text-slate-400 hover:bg-white/[0.05] hover:text-white"
        }`}
      >
        <SectionIcon className="h-4 w-4" />
        {label as string}
      </Link>
    );
  }
)}
          </div>
        </section>

        {/* MAIN WORKSPACE GRID */}
        {activeTab === "occupancy" && (
  <section className="mt-6">
    <OccupancyPanel
      assetId={asset.id}
      currentOccupancyStatus={
        asset.occupancy_status
      }
      currentOccupantName={
        asset.occupant_name
      }
      currentOccupantPhone={
        asset.occupant_phone
      }
    />
  </section>
)}
     {activeTab === "inspections" && (
  <section className="mt-6">
    <InspectionPanel
      assetId={asset.id}
      currentOccupancyStatus={
        asset.occupancy_status
      }
      currentElectricStatus={
        asset.electric_status
      }
      currentWaterStatus={
        asset.water_status
      }
      currentGasStatus={
        asset.gas_status
      }
    />
  </section>
)}   
  {activeTab === "securing" && (
  <section className="mt-6">
    <SecuringPanel
      assetId={asset.id}
      currentPropertySecured={
        asset.property_secured
      }
      currentRekeyRequired={
        asset.rekey_required
      }
      currentLockboxCode={
        asset.lockbox_code
      }
      currentKeyLocation={
        asset.key_location
      }
    />
  </section>
)}     
 {activeTab === "preservation" && (
  <section className="mt-6">
    <PreservationPanel
      assetId={asset.id}
    />
  </section>
)}     
 {activeTab === "repairs" && (
  <section className="mt-6">
    <RepairPanel
      assetId={asset.id}
    />
  </section>
)}   
 {activeTab === "pre-marketing" && (
  <section className="mt-6">
    <PreMarketingPanel
      assetId={asset.id}
      currentListPrice={
        asset.initial_list_price
      }
    />
  </section>
)} 
 {activeTab === "marketing" && (
  <section className="mt-6">
    <MarketingPanel
      assetId={asset.id}
      currentListPrice={
        asset.initial_list_price
      }
    />
  </section>
)}       
{activeTab === "offers" && (
  <section className="mt-6">
    <OfferPanel
      assetId={asset.id}
      currentListPrice={
        asset.initial_list_price
      }
    />
  </section>
)}        
  {activeTab === "valuation" && (
  <section className="mt-6">
    <BpoPanel
      assetId={asset.id}
      currentOccupancyStatus={
        asset.occupancy_status
      }
      currentListPrice={
        asset.initial_list_price
      }
    />
  </section>
)}      
        {activeTab === "overview" && (
<section className="mt-6 grid gap-6 xl:grid-cols-[1.25fr_.75fr]">
          <div className="space-y-6">
            {/* PROPERTY OVERVIEW */}
            <div className="reo-card rounded-2xl">
              <SectionHeader
                icon={Home}
                title="Property Overview"
                subtitle="Core asset and property information"
              />

              <div className="grid gap-x-8 gap-y-6 p-6 sm:grid-cols-2 lg:grid-cols-3">
                <Detail
                  label="Property Type"
                  value={asset.property_type}
                />

                <Detail
                  label="County"
                  value={asset.county}
                />

                <Detail
                  label="Year Built"
                  value={asset.year_built}
                />

                <Detail
                  label="Bedrooms"
                  value={asset.bedrooms}
                />

                <Detail
                  label="Bathrooms"
                  value={asset.bathrooms}
                />

                <Detail
                  label="Square Feet"
                  value={
                    asset.square_feet
                      ? Number(asset.square_feet).toLocaleString()
                      : null
                  }
                />

                <Detail
                  label="Acreage"
                  value={asset.acreage}
                />

                <Detail
                  label="Initial List Price"
                  value={
                    asset.initial_list_price
                      ? money(asset.initial_list_price)
                      : null
                  }
                />

                <Detail
                  label="Target List Date"
                  value={formatDate(asset.list_date_target)}
                />
              </div>
            </div>

            {/* OCCUPANCY / ACCESS */}
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="reo-card rounded-2xl">
                <SectionHeader
                  icon={UserRound}
                  title="Occupancy"
                  subtitle="Current possession and occupant status"
                />

                <div className="space-y-5 p-6">
                  <Detail
                    label="Occupancy Status"
                    value={asset.occupancy_status}
                  />

                  <Detail
                    label="Occupant Name"
                    value={asset.occupant_name}
                  />

                  <Detail
                    label="Occupant Phone"
                    value={asset.occupant_phone}
                  />

                  <Detail
                    label="Cash for Keys"
                    value={asset.cash_for_keys_authorized}
                  />
                </div>
              </div>

              <div className="reo-card rounded-2xl">
                <SectionHeader
                  icon={KeyRound}
                  title="Access & Securing"
                  subtitle="Property control and access"
                />

                <div className="space-y-5 p-6">
                  <Detail
                    label="Property Secured"
                    value={asset.property_secured}
                  />

                  <Detail
                    label="Rekey Required"
                    value={asset.rekey_required}
                  />

                  <Detail
                    label="Lockbox Code"
                    value={asset.lockbox_code}
                  />

                  <Detail
                    label="Access Notes"
                    value={asset.key_location}
                  />
                </div>
              </div>
            </div>

            {/* VALUATION / PRESERVATION */}
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="reo-card rounded-2xl">
                <SectionHeader
                  icon={TrendingUp}
                  title="Valuation"
                  subtitle="Pricing and valuation requirements"
                />

                <div className="space-y-5 p-6">
                  <Detail
                    label="BPO Required"
                    value={asset.bpo_required}
                  />

                  <Detail
                    label="Appraisal Required"
                    value={asset.appraisal_required}
                  />

                  <Detail
                    label="Valuation Due"
                    value={formatDate(
                      asset.valuation_due_date
                    )}
                  />
                </div>
              </div>

              <div className="reo-card rounded-2xl">
                <SectionHeader
                  icon={Wrench}
                  title="Preservation"
                  subtitle="Property protection and authorization"
                />

                <div className="space-y-5 p-6">
                  <Detail
                    label="Preservation Required"
                    value={asset.preservation_required}
                  />

                  <Detail
                    label="Initial Service Limit"
                    value={
                      asset.initial_service_limit
                        ? money(asset.initial_service_limit)
                        : null
                    }
                  />

                  <Detail
                    label="Repair Limit"
                    value={
                      asset.repair_limit
                        ? money(asset.repair_limit)
                        : null
                    }
                  />
                </div>
              </div>
            </div>

            {/* ACTIVITY HISTORY */}
            <div className="reo-card rounded-2xl">
              <SectionHeader
                icon={Clock3}
                title="Activity History"
                subtitle="Permanent asset audit trail"
              />

              {activity.length === 0 ? (
                <div className="p-8 text-center text-sm text-slate-500">
                  No activity has been recorded.
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {activity.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 px-6 py-5"
                    >
                      <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-500/10">
                        <CheckCircle2 className="h-4 w-4 text-green-400" />
                      </div>

                      <div className="flex-1">
                        <div className="font-medium">
                          {item.title}
                        </div>

                        {item.description && (
                          <div className="mt-1 text-sm leading-6 text-slate-500">
                            {item.description}
                          </div>
                        )}

                        <div className="mt-2 text-xs text-slate-600">
                          {formatDateTime(item.created_at)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-6">
            {/* ATTENTION */}
            <div
              className={`rounded-2xl border p-6 ${
                overdueTasks.length > 0
                  ? "border-red-500/25 bg-red-500/[0.05]"
                  : "border-green-500/20 bg-green-500/[0.04]"
              }`}
            >
              <div className="flex items-center gap-3">
                {overdueTasks.length > 0 ? (
                  <AlertTriangle className="h-5 w-5 text-red-400" />
                ) : (
                  <CheckCircle2 className="h-5 w-5 text-green-400" />
                )}

                <h2 className="font-semibold">
                  Asset Health
                </h2>
              </div>

              <div className="mt-5 text-3xl font-bold">
                {overdueTasks.length > 0
                  ? `${overdueTasks.length} Exception${
                      overdueTasks.length === 1 ? "" : "s"
                    }`
                  : "Good Standing"}
              </div>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                {overdueTasks.length > 0
                  ? "This asset has overdue operational requirements that need attention."
                  : "There are currently no overdue SLA items on this asset."}
              </p>
            </div>

            {/* TASKS */}
            <div className="reo-card rounded-2xl">
              <SectionHeader
                icon={ListChecks}
                title="Tasks & SLA"
                subtitle={`${openTasks.length} open · ${completedTasks.length} completed`}
              />

              {openTasks.length === 0 ? (
                <div className="p-8 text-center text-sm text-slate-500">
                  No open tasks.
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                 {openTasks.slice(0, 8).map((task) => {
  const overdue =
    task.due_at &&
    new Date(task.due_at).getTime() < Date.now();

  return (
    <div
      key={task.id}
      className="px-6 py-4"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div
            className={`text-sm font-medium ${
              overdue
                ? "text-red-300"
                : "text-slate-200"
            }`}
          >
            {task.title}
          </div>

          <div className="mt-1 text-xs capitalize text-slate-600">
            {stageLabel(task.workflow_stage)}
          </div>

          {task.description && (
            <div className="mt-2 text-xs leading-5 text-slate-500">
              {task.description}
            </div>
          )}

          <TaskCompleteButton
            assetId={asset.id}
            taskId={task.id}
          />
        </div>

        <div
          className={`shrink-0 text-right text-xs ${
            overdue
              ? "font-semibold text-red-400"
              : "text-slate-500"
          }`}
        >
          {formatDateTime(task.due_at)}

          {overdue && (
            <div className="mt-1 text-[10px] uppercase tracking-wider text-red-500">
              Overdue
            </div>
          )}
        </div>
      </div>
    </div>
  );
})} 
                </div>
              )}
            </div>

            {/* CLIENT */}
            <div className="reo-card rounded-2xl">
              <SectionHeader
                icon={Landmark}
                title="Institutional Client"
                subtitle="Asset owner and servicing relationship"
              />

              <div className="space-y-5 p-6">
                <Detail
                  label="Institution"
                  value={client?.institution_name}
                />

                <Detail
                  label="Institution Type"
                  value={client?.institution_type}
                />

                <Detail
                  label="Asset Manager"
                  value={
                    asset.asset_manager_name ||
                    client?.primary_contact_name
                  }
                />

                <Detail
                  label="Email"
                  value={
                    asset.asset_manager_email ||
                    client?.primary_contact_email
                  }
                />

                <Detail
                  label="Phone"
                  value={
                    asset.asset_manager_phone ||
                    client?.primary_contact_phone
                  }
                />
              </div>
            </div>

            {/* FORECLOSURE / TITLE */}
            <div className="reo-card rounded-2xl">
              <SectionHeader
                icon={FileText}
                title="Foreclosure & Title"
                subtitle="Legal and title status"
              />

              <div className="space-y-5 p-6">
                <Detail
                  label="Foreclosure Sale"
                  value={formatDate(
                    asset.foreclosure_sale_date
                  )}
                />

                <Detail
                  label="Redemption Expires"
                  value={formatDate(
                    asset.redemption_expiration_date
                  )}
                />

                <Detail
                  label="Deed Recorded"
                  value={asset.deed_recorded}
                />

                <Detail
                  label="Title Company"
                  value={asset.title_company}
                />

                <Detail
                  label="Attorney"
                  value={asset.attorney}
                />
              </div>
            </div>

            {/* FINANCIAL SNAPSHOT */}
            <div className="reo-card rounded-2xl">
              <SectionHeader
                icon={Banknote}
                title="Financial Snapshot"
                subtitle="Asset-level financial information"
              />

              <div className="grid grid-cols-2 gap-3 p-6">
                <Metric
                  label="List Price"
                  value={money(asset.initial_list_price)}
                  small
                />

                <Metric
                  label="Service Limit"
                  value={money(asset.initial_service_limit)}
                  small
                />

                <Metric
                  label="Repair Limit"
                  value={money(asset.repair_limit)}
                  small
                />

                <Metric
                  label="Offer"
                  value={
                    asset.accepted_offer
                      ? money(asset.accepted_offer)
                      : "—"
                  }
                  small
                />
              </div>
            </div>

            {/* NOTES */}
            {asset.notes && (
              <div className="reo-card rounded-2xl">
                <SectionHeader
                  icon={FileText}
                  title="Assignment Notes"
                  subtitle="Institutional instructions and internal notes"
                />

                <div className="p-6 text-sm leading-7 text-slate-400">
                  {asset.notes}
                </div>
              </div>
            )}
          </div>
        </section>
      )}
      </div>
    </main>
  );
}

function SectionHeader({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: typeof Home;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex items-center gap-4 border-b border-white/10 px-6 py-5">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-500/10">
        <Icon className="h-5 w-5 text-green-400" />
      </div>

      <div>
        <h2 className="font-semibold">{title}</h2>

        <p className="mt-0.5 text-xs text-slate-500">
          {subtitle}
        </p>
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

function Metric({
  label,
  value,
  warning = false,
  small = false,
}: {
  label: string;
  value: string;
  warning?: boolean;
  small?: boolean;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.025] p-4">
      <div
        className={`font-bold ${
          small ? "text-lg" : "text-2xl"
        } ${warning ? "text-red-300" : "text-white"}`}
      >
        {value}
      </div>

      <div className="mt-2 text-xs leading-5 text-slate-500">
        {label}
      </div>
    </div>
  );
}
