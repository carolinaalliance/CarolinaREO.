"use client";

import {
  AlertTriangle,
  Calculator,
  Camera,
  CheckCircle2,
  ClipboardCheck,
  DollarSign,
  Home,
  MapPin,
  TrendingUp,
} from "lucide-react";

type EvaluationPanelProps = {
  assetId: string;
  propertyAddress?: string | null;
  city?: string | null;
  state?: string | null;
  postalCode?: string | null;
  county?: string | null;
  propertyType?: string | null;
  squareFeet?: number | null;
  acreage?: number | null;
  yearBuilt?: number | null;
  occupancyStatus?: string | null;
};

export default function EvaluationPanel({
  assetId,
  propertyAddress,
  city,
  state,
  postalCode,
  county,
  propertyType,
  squareFeet,
  acreage,
  yearBuilt,
  occupancyStatus,
}: EvaluationPanelProps) {
  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="reo-card rounded-2xl p-6">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-500/10">
                <ClipboardCheck className="h-5 w-5 text-green-400" />
              </div>

              <div>
                <h2 className="text-xl font-bold">
                  Property Evaluation & Bid Analysis
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Field due diligence, market analysis, and acquisition guidance
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-4 py-2 text-sm font-semibold text-amber-300">
              Draft
            </span>

            <button
              type="button"
              className="rounded-xl border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm font-semibold text-slate-200"
            >
              Save Draft
            </button>

            <button
              type="button"
              className="rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-500"
            >
              Submit for Broker Review
            </button>
          </div>
        </div>
      </div>

      {/* PROPERTY SNAPSHOT */}
      <EvaluationSection
        icon={Home}
        title="Property Snapshot"
        subtitle="Existing asset information is automatically carried into the evaluation."
      >
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <ReadOnlyField
            label="Property Address"
            value={propertyAddress}
          />

          <ReadOnlyField
            label="City / State / ZIP"
            value={
              [city, state, postalCode]
                .filter(Boolean)
                .join(", ")
            }
          />

          <ReadOnlyField
            label="County"
            value={county}
          />

          <ReadOnlyField
            label="Property Type"
            value={propertyType}
          />

          <ReadOnlyField
            label="Square Feet"
            value={
              squareFeet
                ? Number(squareFeet).toLocaleString()
                : null
            }
          />

          <ReadOnlyField
            label="Acreage"
            value={acreage}
          />

          <ReadOnlyField
            label="Year Built"
            value={yearBuilt}
          />

          <ReadOnlyField
            label="Occupancy"
            value={occupancyStatus}
          />
        </div>
      </EvaluationSection>

      {/* FIELD OBSERVATION */}
      <EvaluationSection
        icon={MapPin}
        title="Drive-By & Exterior Observation"
        subtitle="Document current observable property conditions."
      >
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <SelectField
            label="Exterior Condition"
            options={[
              "Excellent",
              "Good",
              "Average",
              "Fair",
              "Poor",
              "Severe Distress",
            ]}
          />

          <SelectField
            label="Marketability"
            options={[
              "Strong",
              "Average",
              "Weak",
            ]}
          />

          <SelectField
            label="Neighborhood"
            options={[
              "Stable",
              "Improving",
              "Declining",
            ]}
          />

          <SelectField
            label="Access"
            options={[
              "Normal",
              "Concern",
            ]}
          />
        </div>

        <TextAreaField
          label="Exterior Condition Notes"
          placeholder="Describe visible condition, deferred maintenance, damage, access issues, vacancy indicators, or other observations..."
        />
      </EvaluationSection>

      {/* PHOTOS */}
      <EvaluationSection
        icon={Camera}
        title="Property Photos"
        subtitle="Required field photos will be attached directly to this evaluation."
      >
        <div className="rounded-xl border border-dashed border-white/15 bg-white/[0.02] p-8 text-center">
          <Camera className="mx-auto h-8 w-8 text-slate-600" />

          <div className="mt-3 font-semibold text-slate-300">
            Photo Uploads
          </div>

          <p className="mt-2 text-sm text-slate-500">
            Front, sides, street view, and visible problem areas.
          </p>

          <div className="mt-4 text-xs text-amber-300">
            Photo upload will be activated in the next build step.
          </div>
        </div>
      </EvaluationSection>

      {/* MARKET ANALYSIS */}
      <EvaluationSection
        icon={TrendingUp}
        title="Market & Estimated Opinion of Value"
        subtitle="Professional valuation and comparable-sale analysis."
      >
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <MoneyField label="Estimated As-Is Value" />
          <MoneyField label="Estimated Repaired / Retail Value" />
          <MoneyField label="Estimated Repairs - Low" />
          <MoneyField label="Estimated Repairs - High" />
        </div>

        <div className="mt-5">
          <InputField
            label="Estimated Marketing Time"
            placeholder="Days"
          />
        </div>

        <div className="mt-6 grid gap-5 xl:grid-cols-3">
          <ComparableCard number={1} />
          <ComparableCard number={2} />
          <ComparableCard number={3} />
        </div>

        <TextAreaField
          label="Market / EOV Comments"
          placeholder="Explain comparable selection, adjustments, market conditions, and valuation rationale..."
        />
      </EvaluationSection>

      {/* BID ANALYSIS */}
      <EvaluationSection
        icon={Calculator}
        title="Investment & Bid Analysis"
        subtitle="Translate the property evaluation into acquisition guidance."
      >
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <MoneyField label="Estimated Retail Value" />
          <MoneyField label="Disposition / Other Costs" />
          <MoneyField label="Known Taxes / Liens / Costs" />
          <MoneyField label="Desired Investor Margin" />
          <MoneyField label="Opening / Current Bid" />

          <div className="xl:col-span-2">
            <MoneyField label="Recommended Maximum Bid" important />
          </div>
        </div>

        <div className="mt-5">
          <SelectField
            label="Bid Recommendation"
            options={[
              "Strong Pursuit",
              "Pursue Within Range",
              "Conservative Bid Only",
              "Do Not Recommend",
            ]}
          />
        </div>
      </EvaluationSection>

      {/* RISKS */}
      <EvaluationSection
        icon={AlertTriangle}
        title="Risk Flags"
        subtitle="Identify conditions requiring additional consideration."
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[
            "Occupied",
            "Access Concern",
            "Major Deferred Maintenance",
            "Possible Structural Issue",
            "Flood Concern",
            "Unusual Parcel",
            "Landlocked / Access",
            "Manufactured Home",
            "HOA / POA",
            "Environmental Concern",
            "Condemnation / Demolition",
            "Difficult Valuation",
            "Additional Title / Legal Research",
          ].map((risk) => (
            <label
              key={risk}
              className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-4 text-sm text-slate-300"
            >
              <input
                type="checkbox"
                className="h-4 w-4"
              />
              {risk}
            </label>
          ))}
        </div>
      </EvaluationSection>

      {/* RECOMMENDATION */}
      <EvaluationSection
        icon={CheckCircle2}
        title="Professional Assessment"
        subtitle="Final acquisition comments and opportunity assessment."
      >
        <TextAreaField
          label="Property Evaluation & Acquisition Comments"
          placeholder="Provide your professional assessment, significant concerns, upside potential, and acquisition guidance..."
        />

        <div className="mt-5">
          <SelectField
            label="Overall Opportunity Rating"
            options={[
              "5 - Excellent",
              "4 - Strong",
              "3 - Average",
              "2 - Weak",
              "1 - Poor",
            ]}
          />
        </div>
      </EvaluationSection>

      {/* BOTTOM ACTIONS */}
      <div className="reo-card flex flex-col justify-between gap-4 rounded-2xl p-6 md:flex-row md:items-center">
        <div>
          <div className="font-semibold">
            Evaluation Status: Draft
          </div>

          <div className="mt-1 text-sm text-slate-500">
            Asset ID: {assetId}
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            className="rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-slate-200"
          >
            Save Draft
          </button>

          <button
            type="button"
            className="rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white hover:bg-green-500"
          >
            Submit for Broker Review
          </button>
        </div>
      </div>
    </div>
  );
}

function EvaluationSection({
  icon: Icon,
  title,
  subtitle,
  children,
}: {
  icon: typeof Home;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section className="reo-card rounded-2xl">
      <div className="flex items-center gap-4 border-b border-white/10 px-6 py-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10">
          <Icon className="h-5 w-5 text-green-400" />
        </div>

        <div>
          <h3 className="font-semibold">{title}</h3>
          <p className="mt-1 text-xs text-slate-500">
            {subtitle}
          </p>
        </div>
      </div>

      <div className="p-6">{children}</div>
    </section>
  );
}

function ReadOnlyField({
  label,
  value,
}: {
  label: string;
  value: any;
}) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-wider text-slate-600">
        {label}
      </div>

      <div className="mt-2 rounded-xl border border-white/10 bg-white/[0.025] px-4 py-3 text-sm font-medium text-slate-200">
        {value || "—"}
      </div>
    </div>
  );
}

function InputField({
  label,
  placeholder,
}: {
  label: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-slate-400">
        {label}
      </span>

      <input
        type="text"
        placeholder={placeholder}
        className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-green-500/50"
      />
    </label>
  );
}

function MoneyField({
  label,
  important = false,
}: {
  label: string;
  important?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-slate-400">
        {label}
      </span>

      <div className="relative mt-2">
        <DollarSign className="absolute left-3 top-3.5 h-4 w-4 text-slate-600" />

        <input
          type="number"
          className={`w-full rounded-xl border bg-slate-900 py-3 pl-9 pr-4 text-sm text-white outline-none ${
            important
              ? "border-green-500/40"
              : "border-white/10"
          }`}
        />
      </div>
    </label>
  );
}

function SelectField({
  label,
  options,
}: {
  label: string;
  options: string[];
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-slate-400">
        {label}
      </span>

      <select className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none">
        <option value="">Select...</option>

        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function TextAreaField({
  label,
  placeholder,
}: {
  label: string;
  placeholder?: string;
}) {
  return (
    <label className="mt-5 block">
      <span className="text-xs font-semibold text-slate-400">
        {label}
      </span>

      <textarea
        rows={4}
        placeholder={placeholder}
        className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-green-500/50"
      />
    </label>
  );
}

function ComparableCard({
  number,
}: {
  number: number;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
      <div className="font-semibold text-slate-200">
        Comparable Sale {number}
      </div>

      <div className="mt-4 space-y-4">
        <InputField
          label="Address"
          placeholder="Comparable address"
        />

        <MoneyField label="Sale Price" />

        <InputField
          label="Distance"
          placeholder="Miles"
        />
      </div>
    </div>
  );
}
