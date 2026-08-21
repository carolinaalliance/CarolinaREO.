"use client";

import { useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  DollarSign,
  Save,
  ShieldCheck,
  Snowflake,
  Trees,
  Wrench,
} from "lucide-react";

import {
  savePreservationReview,
  type PreservationInput,
} from "./actions";

const fieldClass =
  "mt-2 w-full rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-green-500";

const labelClass =
  "text-sm font-medium text-slate-300";

export default function PreservationPanel({
  assetId,
}: {
  assetId: string;
}) {
  const today =
    new Date().toISOString().slice(0, 10);

  const [formData, setFormData] =
    useState<PreservationInput>({
      reviewDate: today,

      reviewedBy: "",
      vendorCompany: "",

      lawnServiceRequired: false,
      debrisRemovalRequired: false,
      winterizationRequired: false,
      utilityManagementRequired: false,
      emergencyMaintenanceRequired: false,
      poolServiceRequired: false,
      pestControlRequired: false,

      lawnServiceStatus: "",
      debrisRemovalStatus: "",
      winterizationStatus: "",
      utilityManagementStatus: "",
      emergencyMaintenanceStatus: "",
      poolServiceStatus: "",
      pestControlStatus: "",

      preservationBid: "",
      clientApprovalStatus: "",
      approvedAmount: "",
      finalCost: "",

      workOrderNumber: "",

      preservationSummary: "",
      approvalNotes: "",
      completionNotes: "",

      completed: false,
    });

  const [saving, setSaving] =
    useState(false);

  const [success, setSuccess] =
    useState(false);

  const [error, setError] =
    useState("");

  function updateField<
    K extends keyof PreservationInput
  >(
    key: K,
    value: PreservationInput[K]
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
      await savePreservationReview(
        assetId,
        formData
      );

    setSaving(false);

    if (!result.success) {
      setError(
        result.error ||
          "Preservation review could not be saved."
      );
      return;
    }

    setSuccess(true);
  }

  return (
    <div className="space-y-6">
      {error && (
        <Notice
          type="error"
          text={error}
        />
      )}

      {success && (
        <Notice
          type="success"
          text="Preservation review saved successfully."
        />
      )}

      <Panel
        icon={ShieldCheck}
        title="Preservation Review"
        subtitle="Determine the immediate property-preservation requirements."
      >
        <div className="grid gap-5 md:grid-cols-2">
          <Field
            label="Review Date"
            type="date"
            value={formData.reviewDate}
            onChange={(value) =>
              updateField(
                "reviewDate",
                value
              )
            }
          />

          <Field
            label="Reviewed By"
            value={formData.reviewedBy}
            onChange={(value) =>
              updateField(
                "reviewedBy",
                value
              )
            }
          />

          <div className="md:col-span-2">
            <Field
              label="Vendor / Preservation Company"
              value={formData.vendorCompany}
              onChange={(value) =>
                updateField(
                  "vendorCompany",
                  value
                )
              }
            />
          </div>
        </div>
      </Panel>

      <Panel
        icon={Trees}
        title="Required Services"
        subtitle="Identify the preservation services required for this asset."
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Toggle
            label="Lawn Service"
            value={formData.lawnServiceRequired}
            onChange={(value) =>
              updateField(
                "lawnServiceRequired",
                value
              )
            }
          />

          <Toggle
            label="Debris Removal"
            value={formData.debrisRemovalRequired}
            onChange={(value) =>
              updateField(
                "debrisRemovalRequired",
                value
              )
            }
          />

          <Toggle
            label="Winterization"
            value={formData.winterizationRequired}
            onChange={(value) =>
              updateField(
                "winterizationRequired",
                value
              )
            }
          />

          <Toggle
            label="Utility Management"
            value={formData.utilityManagementRequired}
            onChange={(value) =>
              updateField(
                "utilityManagementRequired",
                value
              )
            }
          />

          <Toggle
            label="Emergency Maintenance"
            value={formData.emergencyMaintenanceRequired}
            onChange={(value) =>
              updateField(
                "emergencyMaintenanceRequired",
                value
              )
            }
          />

          <Toggle
            label="Pool Service"
            value={formData.poolServiceRequired}
            onChange={(value) =>
              updateField(
                "poolServiceRequired",
                value
              )
            }
          />

          <Toggle
            label="Pest Control"
            value={formData.pestControlRequired}
            onChange={(value) =>
              updateField(
                "pestControlRequired",
                value
              )
            }
          />
        </div>
      </Panel>

      <Panel
        icon={Snowflake}
        title="Service Status"
        subtitle="Track the status of preservation services."
      >
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <StatusField
            label="Lawn Service"
            value={formData.lawnServiceStatus}
            onChange={(value) =>
              updateField(
                "lawnServiceStatus",
                value
              )
            }
          />

          <StatusField
            label="Debris Removal"
            value={formData.debrisRemovalStatus}
            onChange={(value) =>
              updateField(
                "debrisRemovalStatus",
                value
              )
            }
          />

          <StatusField
            label="Winterization"
            value={formData.winterizationStatus}
            onChange={(value) =>
              updateField(
                "winterizationStatus",
                value
              )
            }
          />

          <StatusField
            label="Utility Management"
            value={formData.utilityManagementStatus}
            onChange={(value) =>
              updateField(
                "utilityManagementStatus",
                value
              )
            }
          />

          <StatusField
            label="Emergency Maintenance"
            value={formData.emergencyMaintenanceStatus}
            onChange={(value) =>
              updateField(
                "emergencyMaintenanceStatus",
                value
              )
            }
          />

          <StatusField
            label="Pool Service"
            value={formData.poolServiceStatus}
            onChange={(value) =>
              updateField(
                "poolServiceStatus",
                value
              )
            }
          />

          <StatusField
            label="Pest Control"
            value={formData.pestControlStatus}
            onChange={(value) =>
              updateField(
                "pestControlStatus",
                value
              )
            }
          />
        </div>
      </Panel>

      <Panel
        icon={DollarSign}
        title="Bid, Approval & Cost"
        subtitle="Track preservation authorization and expenses."
      >
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          <Field
            label="Preservation Bid"
            value={formData.preservationBid}
            onChange={(value) =>
              updateField(
                "preservationBid",
                value
              )
            }
            placeholder="$"
          />

          <SelectField
            label="Client Approval"
            value={formData.clientApprovalStatus}
            onChange={(value) =>
              updateField(
                "clientApprovalStatus",
                value
              )
            }
            options={[
              "",
              "Not Required",
              "Pending",
              "Approved",
              "Denied",
              "Partially Approved",
            ]}
          />

          <Field
            label="Approved Amount"
            value={formData.approvedAmount}
            onChange={(value) =>
              updateField(
                "approvedAmount",
                value
              )
            }
            placeholder="$"
          />

          <Field
            label="Final Cost"
            value={formData.finalCost}
            onChange={(value) =>
              updateField(
                "finalCost",
                value
              )
            }
            placeholder="$"
          />

          <div className="md:col-span-2">
            <Field
              label="Work Order Number"
              value={formData.workOrderNumber}
              onChange={(value) =>
                updateField(
                  "workOrderNumber",
                  value
                )
              }
            />
          </div>
        </div>
      </Panel>

      <Panel
        icon={Wrench}
        title="Preservation Notes"
        subtitle="Document scope, approval details, and completed work."
      >
        <div className="space-y-5">
          <TextArea
            label="Preservation Summary"
            value={formData.preservationSummary}
            onChange={(value) =>
              updateField(
                "preservationSummary",
                value
              )
            }
          />

          <TextArea
            label="Approval Notes"
            value={formData.approvalNotes}
            onChange={(value) =>
              updateField(
                "approvalNotes",
                value
              )
            }
          />

          <TextArea
            label="Completion Notes"
            value={formData.completionNotes}
            onChange={(value) =>
              updateField(
                "completionNotes",
                value
              )
            }
          />

          <Toggle
            label="Preservation Work Complete?"
            value={formData.completed}
            onChange={(value) =>
              updateField(
                "completed",
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
          className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-6 py-3 text-sm font-semibold hover:bg-green-500 disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {saving
            ? "Saving..."
            : "Save Preservation Review"}
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
  icon: typeof ShieldCheck;
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

function Toggle({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex min-h-[72px] items-center justify-between rounded-xl border border-white/10 bg-white/[0.025] px-4 py-3">
      <span className="text-sm text-slate-300">
        {label}
      </span>

      <button
        type="button"
        onClick={() =>
          onChange(!value)
        }
        className={`rounded-full px-4 py-2 text-xs font-semibold ${
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

function StatusField({
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
        "",
        "Not Required",
        "Pending",
        "Assigned",
        "In Progress",
        "Completed",
        "On Hold",
      ]}
    />
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
        rows={5}
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className={fieldClass}
      />
    </div>
  );
}

function Notice({
  type,
  text,
}: {
  type: "success" | "error";
  text: string;
}) {
  return (
    <div
      className={`rounded-2xl border p-5 ${
        type === "success"
          ? "border-green-500/25 bg-green-500/10 text-green-300"
          : "border-red-500/25 bg-red-500/10 text-red-300"
      }`}
    >
      <div className="flex items-center gap-3">
        {type === "success" ? (
          <CheckCircle2 className="h-5 w-5" />
        ) : (
          <AlertTriangle className="h-5 w-5" />
        )}

        <span className="font-semibold">
          {text}
        </span>
      </div>
    </div>
  );
}
