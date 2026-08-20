"use client";

import { useState } from "react";
import {
  AlertTriangle,
  Building2,
  CheckCircle2,
  Home,
  Save,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import {
  saveOccupancyVerification,
  type OccupancyVerificationInput,
} from "./actions";

const fieldClass =
  "mt-2 w-full rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-green-500";

const labelClass =
  "text-sm font-medium text-slate-300";

export default function OccupancyPanel({
  assetId,
  currentOccupancyStatus,
  currentOccupantName,
  currentOccupantPhone,
}: {
  assetId: string;
  currentOccupancyStatus?: string | null;
  currentOccupantName?: string | null;
  currentOccupantPhone?: string | null;
}) {
  const today =
    new Date().toISOString().slice(0, 10);

  const [formData, setFormData] =
    useState<OccupancyVerificationInput>({
      occupancyStatus:
        currentOccupancyStatus || "Unknown",

      verificationDate: today,
      verificationTime: "",

      verifiedBy: "",
      vendorCompany: "",

      contactAttempted: false,
      contactResult: "",

      occupantName:
        currentOccupantName || "",

      occupantPhone:
        currentOccupantPhone || "",

      occupantType: "",

      leasePresent: false,
      leaseExpirationDate: "",

      personalPropertyPresent: false,
      vehiclesPresent: false,

      electricObserved: "Unknown",
      waterObserved: "Unknown",
      gasObserved: "Unknown",

      postedNotices: "",
      exteriorCondition: "",

      healthSafetyIssue: false,
      emergencyCondition: false,

      cashForKeysCandidate: false,
      relocationStatus: "",

      vacancyConfirmed: false,

      securingRecommended: false,
      winterizationRecommended: false,
      preservationRecommended: false,

      notes: "",
    });

  const [isSaving, setIsSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState(false);

  function updateField<
    K extends keyof OccupancyVerificationInput
  >(
    key: K,
    value: OccupancyVerificationInput[K]
  ) {
    setFormData((current) => ({
      ...current,
      [key]: value,
    }));
  }

  async function handleSave() {
    setError("");
    setSuccess(false);

    if (
      !formData.occupancyStatus ||
      formData.occupancyStatus === "Unknown"
    ) {
      setError(
        "Please determine the occupancy status before completing the verification."
      );
      return;
    }

    setIsSaving(true);

    const result =
      await saveOccupancyVerification(
        assetId,
        formData
      );

    setIsSaving(false);

    if (!result.success) {
      setError(
        result.error ||
          "Occupancy verification could not be saved."
      );
      return;
    }

    setSuccess(true);
  }

  const occupied =
    formData.occupancyStatus ===
      "Owner Occupied" ||
    formData.occupancyStatus ===
      "Tenant Occupied" ||
    formData.occupancyStatus ===
      "Unauthorized Occupant" ||
    formData.occupancyStatus ===
      "Occupied - Unknown";

  const vacant =
    formData.occupancyStatus === "Vacant";

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-2xl border border-red-500/25 bg-red-500/10 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 text-red-400" />

            <div>
              <div className="font-semibold text-red-300">
                Verification could not be completed
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
                Occupancy verification saved
              </div>

              <div className="mt-1 text-sm text-green-200/70">
                The asset record, SLA task, and activity
                history have been updated.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DETERMINATION */}
      <Panel
        icon={Home}
        title="Occupancy Determination"
        subtitle="Document the property's current occupancy status."
      >
        <div className="grid gap-5 md:grid-cols-2">
          <SelectField
            label="Occupancy Status"
            value={formData.occupancyStatus}
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
              "Unable to Determine",
            ]}
          />

          <Field
            label="Verification Date"
            type="date"
            value={formData.verificationDate}
            onChange={(value) =>
              updateField(
                "verificationDate",
                value
              )
            }
          />

          <Field
            label="Verification Time"
            type="time"
            value={formData.verificationTime}
            onChange={(value) =>
              updateField(
                "verificationTime",
                value
              )
            }
          />

          <Field
            label="Verified By"
            value={formData.verifiedBy}
            onChange={(value) =>
              updateField(
                "verifiedBy",
                value
              )
            }
            placeholder="Employee, agent, or field representative"
          />

          <div className="md:col-span-2">
            <Field
              label="Vendor / Field Company"
              value={formData.vendorCompany}
              onChange={(value) =>
                updateField(
                  "vendorCompany",
                  value
                )
              }
              placeholder="Optional"
            />
          </div>
        </div>
      </Panel>

      {/* CONTACT */}
      <Panel
        icon={UserRound}
        title="Contact & Occupant Information"
        subtitle="Record contact attempts and known occupant information."
      >
        <div className="grid gap-5 md:grid-cols-2">
          <BooleanField
            label="Contact Attempted?"
            value={formData.contactAttempted}
            onChange={(value) =>
              updateField(
                "contactAttempted",
                value
              )
            }
          />

          <Field
            label="Contact Result"
            value={formData.contactResult}
            onChange={(value) =>
              updateField(
                "contactResult",
                value
              )
            }
            placeholder="No answer, spoke with occupant, notice left..."
          />

          <Field
            label="Occupant Name"
            value={formData.occupantName}
            onChange={(value) =>
              updateField(
                "occupantName",
                value
              )
            }
          />

          <Field
            label="Occupant Phone"
            value={formData.occupantPhone}
            onChange={(value) =>
              updateField(
                "occupantPhone",
                value
              )
            }
          />

          <SelectField
            label="Occupant Type"
            value={formData.occupantType}
            onChange={(value) =>
              updateField(
                "occupantType",
                value
              )
            }
            options={[
              "",
              "Former Owner",
              "Tenant",
              "Unknown Occupant",
              "Unauthorized Occupant",
              "Other",
            ]}
          />

          <BooleanField
            label="Lease Present?"
            value={formData.leasePresent}
            onChange={(value) =>
              updateField(
                "leasePresent",
                value
              )
            }
          />

          {formData.leasePresent && (
            <Field
              label="Lease Expiration"
              type="date"
              value={
                formData.leaseExpirationDate
              }
              onChange={(value) =>
                updateField(
                  "leaseExpirationDate",
                  value
                )
              }
            />
          )}
        </div>
      </Panel>

      {/* FIELD OBSERVATIONS */}
      <Panel
        icon={Building2}
        title="Field Observations"
        subtitle="Document visible property conditions and occupancy indicators."
      >
        <div className="grid gap-5 md:grid-cols-2">
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

          <BooleanField
            label="Vehicles Present?"
            value={formData.vehiclesPresent}
            onChange={(value) =>
              updateField(
                "vehiclesPresent",
                value
              )
            }
          />

          <SelectField
            label="Electric Observed"
            value={formData.electricObserved}
            onChange={(value) =>
              updateField(
                "electricObserved",
                value
              )
            }
            options={[
              "Unknown",
              "On",
              "Off",
              "Unable to Determine",
            ]}
          />

          <SelectField
            label="Water Observed"
            value={formData.waterObserved}
            onChange={(value) =>
              updateField(
                "waterObserved",
                value
              )
            }
            options={[
              "Unknown",
              "On",
              "Off",
              "Unable to Determine",
            ]}
          />

          <SelectField
            label="Gas Observed"
            value={formData.gasObserved}
            onChange={(value) =>
              updateField(
                "gasObserved",
                value
              )
            }
            options={[
              "Unknown",
              "On",
              "Off",
              "Not Applicable",
              "Unable to Determine",
            ]}
          />

          <Field
            label="Posted Notices"
            value={formData.postedNotices}
            onChange={(value) =>
              updateField(
                "postedNotices",
                value
              )
            }
            placeholder="Describe notices posted at property"
          />

          <div className="md:col-span-2">
            <TextAreaField
              label="Exterior Condition"
              value={formData.exteriorCondition}
              onChange={(value) =>
                updateField(
                  "exteriorCondition",
                  value
                )
              }
              placeholder="Exterior condition, visible damage, lawn condition, broken windows, access concerns..."
            />
          </div>
        </div>
      </Panel>

      {/* OCCUPIED PROPERTY */}
      {occupied && (
        <Panel
          icon={UserRound}
          title="Occupied Property Handling"
          subtitle="Relocation, tenancy, and client decision requirements."
        >
          <div className="grid gap-5 md:grid-cols-2">
            <BooleanField
              label="Cash for Keys Candidate?"
              value={
                formData.cashForKeysCandidate
              }
              onChange={(value) =>
                updateField(
                  "cashForKeysCandidate",
                  value
                )
              }
            />

            <SelectField
              label="Relocation Status"
              value={formData.relocationStatus}
              onChange={(value) =>
                updateField(
                  "relocationStatus",
                  value
                )
              }
              options={[
                "",
                "Not Started",
                "Contact Pending",
                "Offer Pending Client Approval",
                "Offer Presented",
                "Negotiating",
                "Agreement Reached",
                "Declined",
                "Legal Referral Required",
              ]}
            />
          </div>
        </Panel>
      )}

      {/* VACANT PROPERTY */}
      {vacant && (
        <Panel
          icon={ShieldCheck}
          title="Vacant Property Actions"
          subtitle="Determine immediate securing and preservation requirements."
        >
          <div className="grid gap-5 md:grid-cols-2">
            <BooleanField
              label="Vacancy Confirmed?"
              value={formData.vacancyConfirmed}
              onChange={(value) =>
                updateField(
                  "vacancyConfirmed",
                  value
                )
              }
            />

            <BooleanField
              label="Securing Recommended?"
              value={
                formData.securingRecommended
              }
              onChange={(value) =>
                updateField(
                  "securingRecommended",
                  value
                )
              }
            />

            <BooleanField
              label="Winterization Recommended?"
              value={
                formData.winterizationRecommended
              }
              onChange={(value) =>
                updateField(
                  "winterizationRecommended",
                  value
                )
              }
            />

            <BooleanField
              label="Preservation Recommended?"
              value={
                formData.preservationRecommended
              }
              onChange={(value) =>
                updateField(
                  "preservationRecommended",
                  value
                )
              }
            />
          </div>
        </Panel>
      )}

      {/* RISK */}
      <Panel
        icon={AlertTriangle}
        title="Risk & Escalation"
        subtitle="Identify conditions requiring immediate attention."
      >
        <div className="grid gap-5 md:grid-cols-2">
          <BooleanField
            label="Health / Safety Issue?"
            value={formData.healthSafetyIssue}
            onChange={(value) =>
              updateField(
                "healthSafetyIssue",
                value
              )
            }
          />

          <BooleanField
            label="Emergency Condition?"
            value={formData.emergencyCondition}
            onChange={(value) =>
              updateField(
                "emergencyCondition",
                value
              )
            }
          />

          <div className="md:col-span-2">
            <TextAreaField
              label="Verification Notes"
              value={formData.notes}
              onChange={(value) =>
                updateField(
                  "notes",
                  value
                )
              }
              placeholder="Document all relevant observations, conversations, concerns, instructions, and recommended next actions."
            />
          </div>
        </div>
      </Panel>

      {/* SAVE */}
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
              Saving Verification...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Complete Occupancy Verification
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
        onClick={() => onChange(!value)}
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
