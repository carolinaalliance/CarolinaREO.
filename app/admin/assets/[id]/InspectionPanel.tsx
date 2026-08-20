"use client";

import { useState } from "react";
import {
  AlertTriangle,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  Home,
  Save,
  ShieldCheck,
  Wrench,
  Zap,
} from "lucide-react";

import {
  saveInitialPropertyInspection,
  type PropertyInspectionInput,
} from "./actions";

const fieldClass =
  "mt-2 w-full rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-green-500";

const labelClass =
  "text-sm font-medium text-slate-300";

const conditionOptions = [
  "",
  "Excellent",
  "Good",
  "Fair",
  "Poor",
  "Damaged",
  "Not Present",
  "Unable to Inspect",
];

export default function InspectionPanel({
  assetId,
  currentOccupancyStatus,
  currentElectricStatus,
  currentWaterStatus,
  currentGasStatus,
}: {
  assetId: string;
  currentOccupancyStatus?: string | null;
  currentElectricStatus?: string | null;
  currentWaterStatus?: string | null;
  currentGasStatus?: string | null;
}) {
  const today =
    new Date()
      .toISOString()
      .slice(0, 10);

  const [formData, setFormData] =
    useState<PropertyInspectionInput>({
      inspectionDate: today,
      inspectionTime: "",

      inspectedBy: "",
      vendorCompany: "",

      accessObtained: false,
      interiorAccess: false,

      overallCondition: "",
      occupancyObserved:
        currentOccupancyStatus || "Unknown",

      exteriorCondition: "",
      roofCondition: "",
      foundationCondition: "",
      sidingCondition: "",
      windowsCondition: "",
      doorsCondition: "",
      landscapingCondition: "",
      drivewayCondition: "",

      kitchenCondition: "",
      livingAreaCondition: "",
      bedroomCondition: "",
      bathroomCondition: "",
      basementCondition: "",
      atticCondition: "",
      garageCondition: "",

      hvacCondition: "",
      electricalCondition: "",
      plumbingCondition: "",
      waterHeaterCondition: "",
      appliancesCondition: "",

      electricStatus:
        currentElectricStatus || "Unknown",

      waterStatus:
        currentWaterStatus || "Unknown",

      gasStatus:
        currentGasStatus || "Unknown",

      activeLeak: false,
      moldObserved: false,
      fireDamage: false,
      waterDamage: false,
      structuralIssue: false,
      vandalism: false,
      biohazard: false,
      pestIssue: false,

      debrisPresent: false,
      personalPropertyPresent: false,

      immediateActionRequired: false,
      securingRequired: false,
      preservationRequired: false,
      repairsRecommended: false,

      estimatedRepairs: "",

      conditionGrade: "",

      repairSummary: "",
      safetyNotes: "",
      generalNotes: "",
    });

  const [isSaving, setIsSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState(false);

  function updateField<
    K extends keyof PropertyInspectionInput
  >(
    key: K,
    value: PropertyInspectionInput[K]
  ) {
    setFormData((current) => ({
      ...current,
      [key]: value,
    }));
  }

  async function handleSave() {
    setError("");
    setSuccess(false);

    if (!formData.overallCondition) {
      setError(
        "Please select an overall property condition."
      );
      return;
    }

    setIsSaving(true);

    const result =
      await saveInitialPropertyInspection(
        assetId,
        formData
      );

    setIsSaving(false);

    if (!result.success) {
      setError(
        result.error ||
          "The inspection could not be saved."
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
                Inspection could not be completed
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
                Initial inspection saved
              </div>

              <div className="mt-1 text-sm text-green-200/70">
                The asset record, inspection task,
                lifecycle, and activity history
                have been updated.
              </div>
            </div>
          </div>
        </div>
      )}

      <Panel
        icon={ClipboardCheck}
        title="Inspection Details"
        subtitle="Document who inspected the property, when, and the level of access obtained."
      >
        <div className="grid gap-5 md:grid-cols-2">
          <Field
            label="Inspection Date"
            type="date"
            value={
              formData.inspectionDate
            }
            onChange={(value) =>
              updateField(
                "inspectionDate",
                value
              )
            }
          />

          <Field
            label="Inspection Time"
            type="time"
            value={
              formData.inspectionTime
            }
            onChange={(value) =>
              updateField(
                "inspectionTime",
                value
              )
            }
          />

          <Field
            label="Inspected By"
            value={
              formData.inspectedBy
            }
            onChange={(value) =>
              updateField(
                "inspectedBy",
                value
              )
            }
            placeholder="Employee, agent, inspector, or field representative"
          />

          <Field
            label="Vendor / Field Company"
            value={
              formData.vendorCompany
            }
            onChange={(value) =>
              updateField(
                "vendorCompany",
                value
              )
            }
            placeholder="Optional"
          />

          <BooleanField
            label="Property Access Obtained?"
            value={
              formData.accessObtained
            }
            onChange={(value) =>
              updateField(
                "accessObtained",
                value
              )
            }
          />

          <BooleanField
            label="Interior Access Obtained?"
            value={
              formData.interiorAccess
            }
            onChange={(value) =>
              updateField(
                "interiorAccess",
                value
              )
            }
          />
        </div>
      </Panel>

      <Panel
        icon={Home}
        title="Overall Condition"
        subtitle="Record the overall condition and occupancy observed at the time of inspection."
      >
        <div className="grid gap-5 md:grid-cols-2">
          <SelectField
            label="Overall Property Condition"
            value={
              formData.overallCondition
            }
            onChange={(value) =>
              updateField(
                "overallCondition",
                value
              )
            }
            options={[
              "",
              "Excellent",
              "Good",
              "Fair",
              "Poor",
              "Severe Damage",
              "Unsafe / Uninhabitable",
            ]}
          />

          <SelectField
            label="Occupancy Observed"
            value={
              formData.occupancyObserved
            }
            onChange={(value) =>
              updateField(
                "occupancyObserved",
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
              "Unable to Determine",
            ]}
          />

          <SelectField
            label="Condition Grade"
            value={
              formData.conditionGrade
            }
            onChange={(value) =>
              updateField(
                "conditionGrade",
                value
              )
            }
            options={[
              "",
              "A - Excellent",
              "B - Good",
              "C - Average",
              "D - Poor",
              "E - Major Rehabilitation",
              "F - Severe / Unsafe",
            ]}
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
        </div>
      </Panel>

      <Panel
        icon={Building2}
        title="Exterior Inspection"
        subtitle="Document exterior components and site condition."
      >
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          <ConditionField
            label="Exterior"
            value={
              formData.exteriorCondition
            }
            onChange={(value) =>
              updateField(
                "exteriorCondition",
                value
              )
            }
          />

          <ConditionField
            label="Roof"
            value={
              formData.roofCondition
            }
            onChange={(value) =>
              updateField(
                "roofCondition",
                value
              )
            }
          />

          <ConditionField
            label="Foundation"
            value={
              formData.foundationCondition
            }
            onChange={(value) =>
              updateField(
                "foundationCondition",
                value
              )
            }
          />

          <ConditionField
            label="Siding / Exterior Finish"
            value={
              formData.sidingCondition
            }
            onChange={(value) =>
              updateField(
                "sidingCondition",
                value
              )
            }
          />

          <ConditionField
            label="Windows"
            value={
              formData.windowsCondition
            }
            onChange={(value) =>
              updateField(
                "windowsCondition",
                value
              )
            }
          />

          <ConditionField
            label="Doors"
            value={
              formData.doorsCondition
            }
            onChange={(value) =>
              updateField(
                "doorsCondition",
                value
              )
            }
          />

          <ConditionField
            label="Landscaping"
            value={
              formData.landscapingCondition
            }
            onChange={(value) =>
              updateField(
                "landscapingCondition",
                value
              )
            }
          />

          <ConditionField
            label="Driveway / Parking"
            value={
              formData.drivewayCondition
            }
            onChange={(value) =>
              updateField(
                "drivewayCondition",
                value
              )
            }
          />
        </div>
      </Panel>

      {formData.interiorAccess && (
        <Panel
          icon={Home}
          title="Interior Inspection"
          subtitle="Document interior rooms and accessible areas."
        >
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            <ConditionField
              label="Kitchen"
              value={
                formData.kitchenCondition
              }
              onChange={(value) =>
                updateField(
                  "kitchenCondition",
                  value
                )
              }
            />

            <ConditionField
              label="Living Areas"
              value={
                formData.livingAreaCondition
              }
              onChange={(value) =>
                updateField(
                  "livingAreaCondition",
                  value
                )
              }
            />

            <ConditionField
              label="Bedrooms"
              value={
                formData.bedroomCondition
              }
              onChange={(value) =>
                updateField(
                  "bedroomCondition",
                  value
                )
              }
            />

            <ConditionField
              label="Bathrooms"
              value={
                formData.bathroomCondition
              }
              onChange={(value) =>
                updateField(
                  "bathroomCondition",
                  value
                )
              }
            />

            <ConditionField
              label="Basement"
              value={
                formData.basementCondition
              }
              onChange={(value) =>
                updateField(
                  "basementCondition",
                  value
                )
              }
            />

            <ConditionField
              label="Attic"
              value={
                formData.atticCondition
              }
              onChange={(value) =>
                updateField(
                  "atticCondition",
                  value
                )
              }
            />

            <ConditionField
              label="Garage"
              value={
                formData.garageCondition
              }
              onChange={(value) =>
                updateField(
                  "garageCondition",
                  value
                )
              }
            />
          </div>
        </Panel>
      )}

      <Panel
        icon={Wrench}
        title="Mechanical Systems"
        subtitle="Document major systems and utilities."
      >
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <ConditionField
            label="HVAC"
            value={
              formData.hvacCondition
            }
            onChange={(value) =>
              updateField(
                "hvacCondition",
                value
              )
            }
          />

          <ConditionField
            label="Electrical"
            value={
              formData.electricalCondition
            }
            onChange={(value) =>
              updateField(
                "electricalCondition",
                value
              )
            }
          />

          <ConditionField
            label="Plumbing"
            value={
              formData.plumbingCondition
            }
            onChange={(value) =>
              updateField(
                "plumbingCondition",
                value
              )
            }
          />

          <ConditionField
            label="Water Heater"
            value={
              formData.waterHeaterCondition
            }
            onChange={(value) =>
              updateField(
                "waterHeaterCondition",
                value
              )
            }
          />

          <ConditionField
            label="Appliances"
            value={
              formData.appliancesCondition
            }
            onChange={(value) =>
              updateField(
                "appliancesCondition",
                value
              )
            }
          />
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-3">
          <UtilityField
            label="Electric"
            value={
              formData.electricStatus
            }
            onChange={(value) =>
              updateField(
                "electricStatus",
                value
              )
            }
          />

          <UtilityField
            label="Water"
            value={
              formData.waterStatus
            }
            onChange={(value) =>
              updateField(
                "waterStatus",
                value
              )
            }
          />

          <UtilityField
            label="Gas"
            value={
              formData.gasStatus
            }
            onChange={(value) =>
              updateField(
                "gasStatus",
                value
              )
            }
          />
        </div>
      </Panel>

      <Panel
        icon={AlertTriangle}
        title="Damage & Hazard Review"
        subtitle="Identify material damage, hazards, and immediate property risks."
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <BooleanField
            label="Active Leak?"
            value={
              formData.activeLeak
            }
            onChange={(value) =>
              updateField(
                "activeLeak",
                value
              )
            }
          />

          <BooleanField
            label="Mold Observed?"
            value={
              formData.moldObserved
            }
            onChange={(value) =>
              updateField(
                "moldObserved",
                value
              )
            }
          />

          <BooleanField
            label="Fire Damage?"
            value={
              formData.fireDamage
            }
            onChange={(value) =>
              updateField(
                "fireDamage",
                value
              )
            }
          />

          <BooleanField
            label="Water Damage?"
            value={
              formData.waterDamage
            }
            onChange={(value) =>
              updateField(
                "waterDamage",
                value
              )
            }
          />

          <BooleanField
            label="Structural Issue?"
            value={
              formData.structuralIssue
            }
            onChange={(value) =>
              updateField(
                "structuralIssue",
                value
              )
            }
          />

          <BooleanField
            label="Vandalism?"
            value={
              formData.vandalism
            }
            onChange={(value) =>
              updateField(
                "vandalism",
                value
              )
            }
          />

          <BooleanField
            label="Biohazard?"
            value={
              formData.biohazard
            }
            onChange={(value) =>
              updateField(
                "biohazard",
                value
              )
            }
          />

          <BooleanField
            label="Pest Issue?"
            value={
              formData.pestIssue
            }
            onChange={(value) =>
              updateField(
                "pestIssue",
                value
              )
            }
          />

          <BooleanField
            label="Debris Present?"
            value={
              formData.debrisPresent
            }
            onChange={(value) =>
              updateField(
                "debrisPresent",
                value
              )
            }
          />

          <BooleanField
            label="Personal Property Present?"
            value={
              formData.personalPropertyPresent
            }
            onChange={(value) =>
              updateField(
                "personalPropertyPresent",
                value
              )
            }
          />
        </div>
      </Panel>

      <Panel
        icon={ShieldCheck}
        title="Recommended Actions"
        subtitle="Identify actions required based on inspection findings."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <BooleanField
            label="Immediate Action Required?"
            value={
              formData.immediateActionRequired
            }
            onChange={(value) =>
              updateField(
                "immediateActionRequired",
                value
              )
            }
          />

          <BooleanField
            label="Securing Required?"
            value={
              formData.securingRequired
            }
            onChange={(value) =>
              updateField(
                "securingRequired",
                value
              )
            }
          />

          <BooleanField
            label="Preservation Required?"
            value={
              formData.preservationRequired
            }
            onChange={(value) =>
              updateField(
                "preservationRequired",
                value
              )
            }
          />

          <BooleanField
            label="Repairs Recommended?"
            value={
              formData.repairsRecommended
            }
            onChange={(value) =>
              updateField(
                "repairsRecommended",
                value
              )
            }
          />
        </div>

        <div className="mt-6 space-y-5">
          <TextAreaField
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
            placeholder="Describe repairs, deferred maintenance, recommended scopes, and estimated priorities."
          />

          <TextAreaField
            label="Safety / Emergency Notes"
            value={
              formData.safetyNotes
            }
            onChange={(value) =>
              updateField(
                "safetyNotes",
                value
              )
            }
            placeholder="Describe hazards, emergency conditions, code concerns, environmental issues, or conditions requiring immediate escalation."
          />

          <TextAreaField
            label="General Inspection Notes"
            value={
              formData.generalNotes
            }
            onChange={(value) =>
              updateField(
                "generalNotes",
                value
              )
            }
            placeholder="Additional observations, recommendations, limitations, and comments."
          />
        </div>
      </Panel>

      <div className="flex justify-end rounded-2xl border border-white/10 bg-[#07111f] p-5">
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-6 py-3 text-sm font-semibold transition hover:bg-green-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Saving Inspection...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Complete Initial Inspection
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

function ConditionField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <SelectField
      label={label}
      value={value}
      onChange={onChange}
      options={conditionOptions}
    />
  );
}

function UtilityField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <SelectField
      label={label}
      value={value}
      onChange={onChange}
      options={[
        "Unknown",
        "On",
        "Off",
        "Not Applicable",
        "Unable to Determine",
      ]}
    />
  );
}

function BooleanField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex min-h-[74px] items-center justify-between rounded-xl border border-white/10 bg-white/[0.025] px-4 py-3">
      <span className="text-sm font-medium text-slate-300">
        {label}
      </span>

      <button
        type="button"
        onClick={() =>
          onChange(!value)
        }
        className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
          value
            ? "bg-green-600 text-white"
            : "bg-slate-800 text-slate-400"
        }`}
      >
        {value ? "Yes" : "No"}
      </button>
    </div>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
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
        placeholder={placeholder}
        rows={5}
        className={fieldClass}
      />
    </div>
  );
}
