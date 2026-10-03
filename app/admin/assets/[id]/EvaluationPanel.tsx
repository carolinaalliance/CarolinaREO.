"use client";

import { useEffect, useState } from "react";
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

import {
  getAssetEvaluation,
  saveAssetEvaluationDraft,
  submitAssetEvaluationForReview,
  type EvaluationInput,
} from "./actions";

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

const riskOptions = [
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
];

function valueString(value: unknown) {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value);
}

function todayString() {
  return new Date().toISOString().slice(0, 10);
}

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
  const [form, setForm] =
    useState<EvaluationInput>({
      inspectionDate: todayString(),

      occupancyStatus:
        occupancyStatus || "",

      propertyType:
        propertyType || "",

      approximateSqft:
        squareFeet
          ? String(squareFeet)
          : "",

      acreage:
        acreage !== null &&
        acreage !== undefined
          ? String(acreage)
          : "",

      yearBuilt:
        yearBuilt
          ? String(yearBuilt)
          : "",

      exteriorCondition: "",
      marketability: "",
      neighborhoodCondition: "",
      accessCondition: "",
      exteriorNotes: "",

      estimatedAsIsValue: "",
      estimatedRepairedValue: "",
      estimatedRepairsLow: "",
      estimatedRepairsHigh: "",
      estimatedMarketingDays: "",

      comparableSale1Address: "",
      comparableSale1Price: "",
      comparableSale1Distance: "",

      comparableSale2Address: "",
      comparableSale2Price: "",
      comparableSale2Distance: "",

      comparableSale3Address: "",
      comparableSale3Price: "",
      comparableSale3Distance: "",

      marketComments: "",

      estimatedRetailValue: "",
      estimatedDispositionCosts: "",
      knownTaxesLiensCosts: "",
      desiredInvestorMargin: "",
      openingBid: "",
      recommendedMaxBid: "",

      bidRecommendation: "",

      riskFlags: [],

      acquisitionComments: "",
      opportunityRating: "",
    });

  const [status, setStatus] =
    useState("draft");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [errorMessage, setErrorMessage] =
    useState("");

  useEffect(() => {
    let active = true;

    async function loadEvaluation() {
      setLoading(true);
      setErrorMessage("");

      const result =
        await getAssetEvaluation(assetId);

      if (!active) return;

      if (!result.success) {
        setErrorMessage(
          result.error ||
            "Unable to load evaluation."
        );

        setLoading(false);
        return;
      }

      const evaluation =
        result.evaluation;

      if (evaluation) {
        setStatus(
          evaluation.status || "draft"
        );

        setForm({
          inspectionDate:
            evaluation.inspection_date ||
            todayString(),

          occupancyStatus:
            evaluation.occupancy_status ||
            occupancyStatus ||
            "",

          propertyType:
            evaluation.property_type ||
            propertyType ||
            "",

          approximateSqft:
            valueString(
              evaluation.approximate_sqft ??
                squareFeet
            ),

          acreage:
            valueString(
              evaluation.acreage ??
                acreage
            ),

          yearBuilt:
            valueString(
              evaluation.year_built ??
                yearBuilt
            ),

          exteriorCondition:
            evaluation.exterior_condition ||
            "",

          marketability:
            evaluation.marketability || "",

          neighborhoodCondition:
            evaluation.neighborhood_condition ||
            "",

          accessCondition:
            evaluation.access_condition ||
            "",

          exteriorNotes:
            evaluation.exterior_notes || "",

          estimatedAsIsValue:
            valueString(
              evaluation.estimated_as_is_value
            ),

          estimatedRepairedValue:
            valueString(
              evaluation.estimated_repaired_value
            ),

          estimatedRepairsLow:
            valueString(
              evaluation.estimated_repairs_low
            ),

          estimatedRepairsHigh:
            valueString(
              evaluation.estimated_repairs_high
            ),

          estimatedMarketingDays:
            valueString(
              evaluation.estimated_marketing_days
            ),

          comparableSale1Address:
            evaluation.comparable_sale_1_address ||
            "",

          comparableSale1Price:
            valueString(
              evaluation.comparable_sale_1_price
            ),

          comparableSale1Distance:
            evaluation.comparable_sale_1_distance ||
            "",

          comparableSale2Address:
            evaluation.comparable_sale_2_address ||
            "",

          comparableSale2Price:
            valueString(
              evaluation.comparable_sale_2_price
            ),

          comparableSale2Distance:
            evaluation.comparable_sale_2_distance ||
            "",

          comparableSale3Address:
            evaluation.comparable_sale_3_address ||
            "",

          comparableSale3Price:
            valueString(
              evaluation.comparable_sale_3_price
            ),

          comparableSale3Distance:
            evaluation.comparable_sale_3_distance ||
            "",

          marketComments:
            evaluation.market_comments || "",

          estimatedRetailValue:
            valueString(
              evaluation.estimated_retail_value
            ),

          estimatedDispositionCosts:
            valueString(
              evaluation.estimated_disposition_costs
            ),

          knownTaxesLiensCosts:
            valueString(
              evaluation.known_taxes_liens_costs
            ),

          desiredInvestorMargin:
            valueString(
              evaluation.desired_investor_margin
            ),

          openingBid:
            valueString(
              evaluation.opening_bid
            ),

          recommendedMaxBid:
            valueString(
              evaluation.recommended_max_bid
            ),

          bidRecommendation:
            evaluation.bid_recommendation ||
            "",

          riskFlags:
            Array.isArray(
              evaluation.risk_flags
            )
              ? evaluation.risk_flags
              : [],

          acquisitionComments:
            evaluation.acquisition_comments ||
            "",

          opportunityRating:
            valueString(
              evaluation.opportunity_rating
            ),
        });
      }

      setLoading(false);
    }

    loadEvaluation();

    return () => {
      active = false;
    };
  }, [
    assetId,
    occupancyStatus,
    propertyType,
    squareFeet,
    acreage,
    yearBuilt,
  ]);

  function updateField(
    field: keyof EvaluationInput,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setMessage("");
    setErrorMessage("");
  }

  function toggleRisk(risk: string) {
    setForm((current) => ({
      ...current,
      riskFlags:
        current.riskFlags.includes(risk)
          ? current.riskFlags.filter(
              (item) => item !== risk
            )
          : [...current.riskFlags, risk],
    }));

    setMessage("");
    setErrorMessage("");
  }

  async function handleSaveDraft() {
    setSaving(true);
    setMessage("");
    setErrorMessage("");

    const result =
      await saveAssetEvaluationDraft(
        assetId,
        form
      );

    if (!result.success) {
      setErrorMessage(
        result.error ||
          "Unable to save draft."
      );

      setSaving(false);
      return;
    }

    setStatus("draft");
    setMessage("Draft saved successfully.");
    setSaving(false);
  }

  async function handleSubmit() {
    setSaving(true);
    setMessage("");
    setErrorMessage("");

    const result =
      await submitAssetEvaluationForReview(
        assetId,
        form
      );

    if (!result.success) {
      setErrorMessage(
        result.error ||
          "Unable to submit evaluation."
      );

      setSaving(false);
      return;
    }

    setStatus("submitted");

    setMessage(
      "Evaluation submitted for broker review."
    );

    setSaving(false);
  }

  const statusLabel =
    status === "submitted"
      ? "Submitted"
      : status === "broker_review"
        ? "Broker Review"
        : status === "approved"
          ? "Approved"
          : status === "client_delivered"
            ? "Client Delivered"
            : status === "pursue"
              ? "Pursue"
              : status === "pass"
                ? "Pass"
                : "Draft";

  if (loading) {
    return (
      <div className="reo-card rounded-2xl p-8">
        <div className="text-sm text-slate-400">
          Loading property evaluation...
        </div>
      </div>
    );
  }

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
                  Field due diligence, market
                  analysis, and acquisition
                  guidance
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-4 py-2 text-sm font-semibold text-amber-300">
              {statusLabel}
            </span>

            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={saving}
              className="rounded-xl border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm font-semibold text-slate-200 disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : "Save Draft"}
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={saving}
              className="rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-500 disabled:opacity-50"
            >
              Submit for Broker Review
            </button>
          </div>
        </div>

        {message && (
          <div className="mt-4 rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm font-semibold text-green-300">
            {message}
          </div>
        )}

        {errorMessage && (
          <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-300">
            {errorMessage}
          </div>
        )}
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
            value={[
              city,
              state,
              postalCode,
            ]
              .filter(Boolean)
              .join(", ")}
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
                ? Number(
                    squareFeet
                  ).toLocaleString()
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

        <div className="mt-5">
          <InputField
            label="Inspection Date"
            type="date"
            value={form.inspectionDate}
            onChange={(value) =>
              updateField(
                "inspectionDate",
                value
              )
            }
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
            value={form.exteriorCondition}
            onChange={(value) =>
              updateField(
                "exteriorCondition",
                value
              )
            }
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
            value={form.marketability}
            onChange={(value) =>
              updateField(
                "marketability",
                value
              )
            }
            options={[
              "Strong",
              "Average",
              "Weak",
            ]}
          />

          <SelectField
            label="Neighborhood"
            value={
              form.neighborhoodCondition
            }
            onChange={(value) =>
              updateField(
                "neighborhoodCondition",
                value
              )
            }
            options={[
              "Stable",
              "Improving",
              "Declining",
            ]}
          />

          <SelectField
            label="Access"
            value={form.accessCondition}
            onChange={(value) =>
              updateField(
                "accessCondition",
                value
              )
            }
            options={[
              "Normal",
              "Concern",
            ]}
          />
        </div>

        <TextAreaField
          label="Exterior Condition Notes"
          placeholder="Describe visible condition, deferred maintenance, damage, access issues, vacancy indicators, or other observations..."
          value={form.exteriorNotes}
          onChange={(value) =>
            updateField(
              "exteriorNotes",
              value
            )
          }
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
            Front, sides, street view, and
            visible problem areas.
          </p>

          <div className="mt-4 text-xs text-amber-300">
            Photo upload will be activated in
            the next build step.
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
          <MoneyField
            label="Estimated As-Is Value"
            value={
              form.estimatedAsIsValue
            }
            onChange={(value) =>
              updateField(
                "estimatedAsIsValue",
                value
              )
            }
          />

          <MoneyField
            label="Estimated Repaired / Retail Value"
            value={
              form.estimatedRepairedValue
            }
            onChange={(value) =>
              updateField(
                "estimatedRepairedValue",
                value
              )
            }
          />

          <MoneyField
            label="Estimated Repairs - Low"
            value={
              form.estimatedRepairsLow
            }
            onChange={(value) =>
              updateField(
                "estimatedRepairsLow",
                value
              )
            }
          />

          <MoneyField
            label="Estimated Repairs - High"
            value={
              form.estimatedRepairsHigh
            }
            onChange={(value) =>
              updateField(
                "estimatedRepairsHigh",
                value
              )
            }
          />
        </div>

        <div className="mt-5">
          <InputField
            label="Estimated Marketing Time"
            placeholder="Days"
            value={
              form.estimatedMarketingDays
            }
            onChange={(value) =>
              updateField(
                "estimatedMarketingDays",
                value
              )
            }
          />
        </div>

        <div className="mt-6 grid gap-5 xl:grid-cols-3">
          <ComparableCard
            number={1}
            address={
              form.comparableSale1Address
            }
            salePrice={
              form.comparableSale1Price
            }
            distance={
              form.comparableSale1Distance
            }
            onAddressChange={(value) =>
              updateField(
                "comparableSale1Address",
                value
              )
            }
            onSalePriceChange={(value) =>
              updateField(
                "comparableSale1Price",
                value
              )
            }
            onDistanceChange={(value) =>
              updateField(
                "comparableSale1Distance",
                value
              )
            }
          />

          <ComparableCard
            number={2}
            address={
              form.comparableSale2Address
            }
            salePrice={
              form.comparableSale2Price
            }
            distance={
              form.comparableSale2Distance
            }
            onAddressChange={(value) =>
              updateField(
                "comparableSale2Address",
                value
              )
            }
            onSalePriceChange={(value) =>
              updateField(
                "comparableSale2Price",
                value
              )
            }
            onDistanceChange={(value) =>
              updateField(
                "comparableSale2Distance",
                value
              )
            }
          />

          <ComparableCard
            number={3}
            address={
              form.comparableSale3Address
            }
            salePrice={
              form.comparableSale3Price
            }
            distance={
              form.comparableSale3Distance
            }
            onAddressChange={(value) =>
              updateField(
                "comparableSale3Address",
                value
              )
            }
            onSalePriceChange={(value) =>
              updateField(
                "comparableSale3Price",
                value
              )
            }
            onDistanceChange={(value) =>
              updateField(
                "comparableSale3Distance",
                value
              )
            }
          />
        </div>

        <TextAreaField
          label="Market / EOV Comments"
          placeholder="Explain comparable selection, adjustments, market conditions, and valuation rationale..."
          value={form.marketComments}
          onChange={(value) =>
            updateField(
              "marketComments",
              value
            )
          }
        />
      </EvaluationSection>

      {/* BID ANALYSIS */}
      <EvaluationSection
        icon={Calculator}
        title="Investment & Bid Analysis"
        subtitle="Translate the property evaluation into acquisition guidance."
      >
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <MoneyField
            label="Estimated Retail Value"
            value={
              form.estimatedRetailValue
            }
            onChange={(value) =>
              updateField(
                "estimatedRetailValue",
                value
              )
            }
          />

          <MoneyField
            label="Disposition / Other Costs"
            value={
              form.estimatedDispositionCosts
            }
            onChange={(value) =>
              updateField(
                "estimatedDispositionCosts",
                value
              )
            }
          />

          <MoneyField
            label="Known Taxes / Liens / Costs"
            value={
              form.knownTaxesLiensCosts
            }
            onChange={(value) =>
              updateField(
                "knownTaxesLiensCosts",
                value
              )
            }
          />

          <MoneyField
            label="Desired Investor Margin"
            value={
              form.desiredInvestorMargin
            }
            onChange={(value) =>
              updateField(
                "desiredInvestorMargin",
                value
              )
            }
          />

          <MoneyField
            label="Opening / Current Bid"
            value={form.openingBid}
            onChange={(value) =>
              updateField(
                "openingBid",
                value
              )
            }
          />

          <div className="xl:col-span-2">
            <MoneyField
              label="Recommended Maximum Bid"
              important
              value={
                form.recommendedMaxBid
              }
              onChange={(value) =>
                updateField(
                  "recommendedMaxBid",
                  value
                )
              }
            />
          </div>
        </div>

        <div className="mt-5">
          <SelectField
            label="Bid Recommendation"
            value={
              form.bidRecommendation
            }
            onChange={(value) =>
              updateField(
                "bidRecommendation",
                value
              )
            }
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
          {riskOptions.map((risk) => (
            <label
              key={risk}
              className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-4 text-sm text-slate-300"
            >
              <input
                type="checkbox"
                checked={form.riskFlags.includes(
                  risk
                )}
                onChange={() =>
                  toggleRisk(risk)
                }
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
          value={
            form.acquisitionComments
          }
          onChange={(value) =>
            updateField(
              "acquisitionComments",
              value
            )
          }
        />

        <div className="mt-5">
          <SelectField
            label="Overall Opportunity Rating"
            value={
              form.opportunityRating
            }
            onChange={(value) =>
              updateField(
                "opportunityRating",
                value
              )
            }
            options={[
              "5",
              "4",
              "3",
              "2",
              "1",
            ]}
            displayLabels={{
              "5": "5 - Excellent",
              "4": "4 - Strong",
              "3": "3 - Average",
              "2": "2 - Weak",
              "1": "1 - Poor",
            }}
          />
        </div>
      </EvaluationSection>

      {/* BOTTOM ACTIONS */}
      <div className="reo-card flex flex-col justify-between gap-4 rounded-2xl p-6 md:flex-row md:items-center">
        <div>
          <div className="font-semibold">
            Evaluation Status:{" "}
            {statusLabel}
          </div>

          <div className="mt-1 text-sm text-slate-500">
            Asset ID: {assetId}
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={saving}
            className="rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-slate-200 disabled:opacity-50"
          >
            {saving
              ? "Saving..."
              : "Save Draft"}
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white hover:bg-green-500 disabled:opacity-50"
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
          <h3 className="font-semibold">
            {title}
          </h3>

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
  value,
  onChange,
  type = "text",
}: {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-slate-400">
        {label}
      </span>

      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-green-500/50"
      />
    </label>
  );
}

function MoneyField({
  label,
  value,
  onChange,
  important = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
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
          value={value}
          onChange={(event) =>
            onChange(event.target.value)
          }
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
  value,
  onChange,
  displayLabels,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  displayLabels?: Record<
    string,
    string
  >;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-slate-400">
        {label}
      </span>

      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none"
      >
        <option value="">
          Select...
        </option>

        {options.map((option) => (
          <option
            key={option}
            value={option}
          >
            {displayLabels?.[option] ||
              option}
          </option>
        ))}
      </select>
    </label>
  );
}

function TextAreaField({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="mt-5 block">
      <span className="text-xs font-semibold text-slate-400">
        {label}
      </span>

      <textarea
        rows={4}
        placeholder={placeholder}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-green-500/50"
      />
    </label>
  );
}

function ComparableCard({
  number,
  address,
  salePrice,
  distance,
  onAddressChange,
  onSalePriceChange,
  onDistanceChange,
}: {
  number: number;
  address: string;
  salePrice: string;
  distance: string;
  onAddressChange: (
    value: string
  ) => void;
  onSalePriceChange: (
    value: string
  ) => void;
  onDistanceChange: (
    value: string
  ) => void;
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
          value={address}
          onChange={onAddressChange}
        />

        <MoneyField
          label="Sale Price"
          value={salePrice}
          onChange={onSalePriceChange}
        />

        <InputField
          label="Distance"
          placeholder="Miles"
          value={distance}
          onChange={onDistanceChange}
        />
      </div>
    </div>
  );
}
