"use client";

import { useState } from "react";
import {
  AlertTriangle,
  BarChart3,
  Building2,
  CheckCircle2,
  DollarSign,
  Home,
  Save,
  TrendingUp,
} from "lucide-react";

import {
  saveInitialBpo,
  type BpoInput,
} from "./actions";

const fieldClass =
  "mt-2 w-full rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-green-500";

const labelClass =
  "text-sm font-medium text-slate-300";

export default function BpoPanel({
  assetId,
  currentOccupancyStatus,
  currentListPrice,
}: {
  assetId: string;
  currentOccupancyStatus?: string | null;
  currentListPrice?: number | null;
}) {
  const today =
    new Date()
      .toISOString()
      .slice(0, 10);

  const [formData, setFormData] =
    useState<BpoInput>({
      valuationDate: today,

      preparedBy: "",
      brokerageCompany: "",

      occupancyStatus:
        currentOccupancyStatus ||
        "Unknown",

      propertyCondition: "",

      asIsValue: "",
      repairedValue: "",
      quickSaleValue: "",

      recommendedListPrice:
        currentListPrice
          ? String(currentListPrice)
          : "",

      estimatedRepairs: "",

      marketTrend: "",
      marketingTimeDays: "",

      comp1Address: "",
      comp1SalePrice: "",
      comp1Distance: "",
      comp1Notes: "",

      comp2Address: "",
      comp2SalePrice: "",
      comp2Distance: "",
      comp2Notes: "",

      comp3Address: "",
      comp3SalePrice: "",
      comp3Distance: "",
      comp3Notes: "",

      listing1Address: "",
      listing1Price: "",
      listing1Distance: "",
      listing1Notes: "",

      listing2Address: "",
      listing2Price: "",
      listing2Distance: "",
      listing2Notes: "",

      neighborhoodSummary: "",
      conditionSummary: "",
      repairSummary: "",
      pricingRationale: "",
      marketingStrategy: "",

      clientRecommendation: "",
    });

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState(false);

  function updateField<
    K extends keyof BpoInput
  >(
    key: K,
    value: BpoInput[K]
  ) {
    setFormData((current) => ({
      ...current,
      [key]: value,
    }));
  }

  async function handleSave() {
    setError("");
    setSuccess(false);

    setSaving(true);

    const result =
      await saveInitialBpo(
        assetId,
        formData
      );

    setSaving(false);

    if (!result.success) {
      setError(
        result.error ||
          "BPO could not be saved."
      );
      return;
    }

    setSuccess(true);
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-2xl border border-red-500/25 bg-red-500/10 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 text-red-400" />

            <div>
              <div className="font-semibold text-red-300">
                BPO could not be completed
              </div>

              <div className="mt-1 text-sm text-red-200/70">
                {error}
              </div>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="rounded-2xl border border-green-500/25 bg-green-500/10 p-5">
          <div className="flex gap-3">
            <CheckCircle2 className="mt-0.5 h-5 w-5 text-green-400" />

            <div>
              <div className="font-semibold text-green-300">
                Initial BPO saved
              </div>

              <div className="mt-1 text-sm text-green-200/70">
                Valuation, pricing,
                lifecycle, SLA task,
                and activity history
                have been updated.
              </div>
            </div>
          </div>
        </div>
      )}

      <Panel
        icon={BarChart3}
        title="BPO Details"
        subtitle="Document valuation date, preparer, occupancy, and property condition."
      >
        <div className="grid gap-5 md:grid-cols-2">
          <Field
            label="Valuation Date"
            type="date"
            value={
              formData.valuationDate
            }
            onChange={(value) =>
              updateField(
                "valuationDate",
                value
              )
            }
          />

          <Field
            label="Prepared By"
            value={
              formData.preparedBy
            }
            onChange={(value) =>
              updateField(
                "preparedBy",
                value
              )
            }
          />

          <Field
            label="Brokerage / Company"
            value={
              formData.brokerageCompany
            }
            onChange={(value) =>
              updateField(
                "brokerageCompany",
                value
              )
            }
          />

          <SelectField
            label="Occupancy Status"
            value={
              formData.occupancyStatus
            }
            onChange={(value) =>
              updateField(
                "occupancyStatus",
                value
              )
            }
            options={[
              "Unknown",
              "Vacant",
              "Owner Occupied",
              "Tenant Occupied",
              "Occupied - Unknown",
              "Unauthorized Occupant",
            ]}
          />

          <SelectField
            label="Property Condition"
            value={
              formData.propertyCondition
            }
            onChange={(value) =>
              updateField(
                "propertyCondition",
                value
              )
            }
            options={[
              "",
              "Excellent",
              "Good",
              "Fair",
              "Poor",
              "Major Rehabilitation",
              "Unsafe / Uninhabitable",
            ]}
          />

          <SelectField
            label="Market Trend"
            value={
              formData.marketTrend
            }
            onChange={(value) =>
              updateField(
                "marketTrend",
                value
              )
            }
            options={[
              "",
              "Increasing",
              "Stable",
              "Declining",
            ]}
          />
        </div>
      </Panel>

      <Panel
        icon={DollarSign}
        title="Valuation & Pricing"
        subtitle="Establish current value, repaired value, quick-sale value, and recommended list price."
      >
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <Field
            label="As-Is Value"
            value={
              formData.asIsValue
            }
            onChange={(value) =>
              updateField(
                "asIsValue",
                value
              )
            }
            placeholder="$"
          />

          <Field
            label="Repaired Value"
            value={
              formData.repairedValue
            }
            onChange={(value) =>
              updateField(
                "repairedValue",
                value
              )
            }
            placeholder="$"
          />

          <Field
            label="Quick-Sale Value"
            value={
              formData.quickSaleValue
            }
            onChange={(value) =>
              updateField(
                "quickSaleValue",
                value
              )
            }
            placeholder="$"
          />

          <Field
            label="Recommended List Price"
            value={
              formData.recommendedListPrice
            }
            onChange={(value) =>
              updateField(
                "recommendedListPrice",
                value
              )
            }
            placeholder="$"
          />

          <Field
            label="Estimated Repairs"
            value={
              formData.estimatedRepairs
            }
            onChange={(value) =>
              updateField(
                "estimatedRepairs",
                value
              )
            }
            placeholder="$"
          />

          <Field
            label="Estimated Marketing Time"
            value={
              formData.marketingTimeDays
            }
            onChange={(value) =>
              updateField(
                "marketingTimeDays",
                value
              )
            }
            placeholder="Days"
          />
        </div>
      </Panel>

      <ComparableSection
        title="Closed Comparable 1"
        address={formData.comp1Address}
        price={formData.comp1SalePrice}
        distance={formData.comp1Distance}
        notes={formData.comp1Notes}
        onAddress={(value) =>
          updateField(
            "comp1Address",
            value
          )
        }
        onPrice={(value) =>
          updateField(
            "comp1SalePrice",
            value
          )
        }
        onDistance={(value) =>
          updateField(
            "comp1Distance",
            value
          )
        }
        onNotes={(value) =>
          updateField(
            "comp1Notes",
            value
          )
        }
      />

      <ComparableSection
        title="Closed Comparable 2"
        address={formData.comp2Address}
        price={formData.comp2SalePrice}
        distance={formData.comp2Distance}
        notes={formData.comp2Notes}
        onAddress={(value) =>
          updateField(
            "comp2Address",
            value
          )
        }
        onPrice={(value) =>
          updateField(
            "comp2SalePrice",
            value
          )
        }
        onDistance={(value) =>
          updateField(
            "comp2Distance",
            value
          )
        }
        onNotes={(value) =>
          updateField(
            "comp2Notes",
            value
          )
        }
      />

      <ComparableSection
        title="Closed Comparable 3"
        address={formData.comp3Address}
        price={formData.comp3SalePrice}
        distance={formData.comp3Distance}
        notes={formData.comp3Notes}
        onAddress={(value) =>
          updateField(
            "comp3Address",
            value
          )
        }
        onPrice={(value) =>
          updateField(
            "comp3SalePrice",
            value
          )
        }
        onDistance={(value) =>
          updateField(
            "comp3Distance",
            value
          )
        }
        onNotes={(value) =>
          updateField(
            "comp3Notes",
            value
          )
        }
      />

      <ComparableSection
        title="Active Listing 1"
        address={
          formData.listing1Address
        }
        price={
          formData.listing1Price
        }
        distance={
          formData.listing1Distance
        }
        notes={
          formData.listing1Notes
        }
        onAddress={(value) =>
          updateField(
            "listing1Address",
            value
          )
        }
        onPrice={(value) =>
          updateField(
            "listing1Price",
            value
          )
        }
        onDistance={(value) =>
          updateField(
            "listing1Distance",
            value
          )
        }
        onNotes={(value) =>
          updateField(
            "listing1Notes",
            value
          )
        }
      />

      <ComparableSection
        title="Active Listing 2"
        address={
          formData.listing2Address
        }
        price={
          formData.listing2Price
        }
        distance={
          formData.listing2Distance
        }
        notes={
          formData.listing2Notes
        }
        onAddress={(value) =>
          updateField(
            "listing2Address",
            value
          )
        }
        onPrice={(value) =>
          updateField(
            "listing2Price",
            value
          )
        }
        onDistance={(value) =>
          updateField(
            "listing2Distance",
            value
          )
        }
        onNotes={(value) =>
          updateField(
            "listing2Notes",
            value
          )
        }
      />

      <Panel
        icon={TrendingUp}
        title="Analysis & Recommendation"
        subtitle="Document neighborhood conditions, pricing rationale, and recommended disposition strategy."
      >
        <div className="space-y-5">
          <TextArea
            label="Neighborhood / Market Summary"
            value={
              formData.neighborhoodSummary
            }
            onChange={(value) =>
              updateField(
                "neighborhoodSummary",
                value
              )
            }
          />

          <TextArea
            label="Property Condition Summary"
            value={
              formData.conditionSummary
            }
            onChange={(value) =>
              updateField(
                "conditionSummary",
                value
              )
            }
          />

          <TextArea
            label="Repair Summary"
            value={
              formData.repairSummary
            }
            onChange={(value) =>
              updateField(
                "repairSummary",
                value
              )
            }
          />

          <TextArea
            label="Pricing Rationale"
            value={
              formData.pricingRationale
            }
            onChange={(value) =>
              updateField(
                "pricingRationale",
                value
              )
            }
          />

          <TextArea
            label="Marketing Strategy"
            value={
              formData.marketingStrategy
            }
            onChange={(value) =>
              updateField(
                "marketingStrategy",
                value
              )
            }
          />

          <TextArea
            label="Recommendation to Client"
            value={
              formData.clientRecommendation
            }
            onChange={(value) =>
              updateField(
                "clientRecommendation",
                value
              )
            }
          />
        </div>
      </Panel>

      <div className="flex justify-end rounded-2xl border border-white/10 bg-[#07111f] p-5">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-6 py-3 text-sm font-semibold transition hover:bg-green-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Saving BPO...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Complete Initial BPO
            </>
          )}
        </button>
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

function ComparableSection({
  title,
  address,
  price,
  distance,
  notes,
  onAddress,
  onPrice,
  onDistance,
  onNotes,
}: {
  title: string;
  address: string;
  price: string;
  distance: string;
  notes: string;
  onAddress: (value: string) => void;
  onPrice: (value: string) => void;
  onDistance: (value: string) => void;
  onNotes: (value: string) => void;
}) {
  return (
    <Panel
      icon={Building2}
      title={title}
      subtitle="Comparable property data"
    >
      <div className="grid gap-5 md:grid-cols-3">
        <Field
          label="Address"
          value={address}
          onChange={onAddress}
        />

        <Field
          label="Price"
          value={price}
          onChange={onPrice}
          placeholder="$"
        />

        <Field
          label="Distance"
          value={distance}
          onChange={onDistance}
          placeholder="Miles"
        />

        <div className="md:col-span-3">
          <TextArea
            label="Comparable Notes / Adjustments"
            value={notes}
            onChange={onNotes}
          />
        </div>
      </div>
    </Panel>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className={labelClass}>
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        placeholder={placeholder}
        className={fieldClass}
      />
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <div>
      <label className={labelClass}>
        {label}
      </label>

      <select
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className={fieldClass}
      >
        {options.map((option) => (
          <option
            key={option}
            value={option}
          >
            {option || "Select..."}
          </option>
        ))}
      </select>
    </div>
  );
}

function TextArea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className={labelClass}>
        {label}
      </label>

      <textarea
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        rows={5}
        className={fieldClass}
      />
    </div>
  );
}
