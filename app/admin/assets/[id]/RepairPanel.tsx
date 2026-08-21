"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  DollarSign,
  Hammer,
  Save,
  Users,
  Wrench,
} from "lucide-react";

import {
  saveRepairScope,
  type RepairInput,
} from "./actions";

const fieldClass =
  "mt-2 w-full rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-green-500";

const labelClass =
  "text-sm font-medium text-slate-300";

export default function RepairPanel({
  assetId,
}: {
  assetId: string;
}) {
  const today = new Date().toISOString().slice(0, 10);

  const [formData, setFormData] =
    useState<RepairInput>({
      scopeDate: today,
      preparedBy: "",

      scopeSummary: "",

      roofingAmount: "",
      hvacAmount: "",
      plumbingAmount: "",
      electricalAmount: "",
      structuralAmount: "",
      interiorAmount: "",
      exteriorAmount: "",
      landscapingAmount: "",
      appliancesAmount: "",
      otherAmount: "",

      vendor1Name: "",
      vendor1Bid: "",

      vendor2Name: "",
      vendor2Bid: "",

      vendor3Name: "",
      vendor3Bid: "",

      selectedVendor: "",

      clientApprovalStatus: "",
      approvedBudget: "",

      workStartedDate: "",
      targetCompletionDate: "",
      actualCompletionDate: "",

      finalCost: "",

      workStatus: "scope",

      repairNotes: "",
      approvalNotes: "",
      completionNotes: "",
    });

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  function updateField<
    K extends keyof RepairInput
  >(
    key: K,
    value: RepairInput[K]
  ) {
    setFormData((current) => ({
      ...current,
      [key]: value,
    }));
  }

  const estimatedTotal = useMemo(() => {
    const fields = [
      formData.roofingAmount,
      formData.hvacAmount,
      formData.plumbingAmount,
      formData.electricalAmount,
      formData.structuralAmount,
      formData.interiorAmount,
      formData.exteriorAmount,
      formData.landscapingAmount,
      formData.appliancesAmount,
      formData.otherAmount,
    ];

    return fields.reduce((total, value) => {
      const number = Number(
        String(value || "").replace(/[$,]/g, "")
      );

      return total + (Number.isFinite(number) ? number : 0);
    }, 0);
  }, [formData]);

  async function handleSave() {
    setError("");
    setSuccess(false);
    setSaving(true);

    const result = await saveRepairScope(
      assetId,
      formData
    );

    setSaving(false);

    if (!result.success) {
      setError(
        result.error ||
          "Repair scope could not be saved."
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
          text="Repair scope and estimate saved successfully."
        />
      )}

      <Panel
        icon={Hammer}
        title="Repair Scope"
        subtitle="Define the repair scope and prepare the initial estimate."
      >
        <div className="grid gap-5 md:grid-cols-2">
          <Field
            label="Scope Date"
            type="date"
            value={formData.scopeDate}
            onChange={(value) =>
              updateField("scopeDate", value)
            }
          />

          <Field
            label="Prepared By"
            value={formData.preparedBy}
            onChange={(value) =>
              updateField("preparedBy", value)
            }
          />

          <div className="md:col-span-2">
            <TextArea
              label="Scope Summary"
              value={formData.scopeSummary}
              onChange={(value) =>
                updateField("scopeSummary", value)
              }
              placeholder="Describe the overall repair scope and recommended work."
            />
          </div>
        </div>
      </Panel>

      <Panel
        icon={DollarSign}
        title="Line-Item Estimate"
        subtitle="Build the asset-level repair budget."
      >
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-5">
          <MoneyField
            label="Roofing"
            value={formData.roofingAmount}
            onChange={(value) =>
              updateField("roofingAmount", value)
            }
          />

          <MoneyField
            label="HVAC"
            value={formData.hvacAmount}
            onChange={(value) =>
              updateField("hvacAmount", value)
            }
          />

          <MoneyField
            label="Plumbing"
            value={formData.plumbingAmount}
            onChange={(value) =>
              updateField("plumbingAmount", value)
            }
          />

          <MoneyField
            label="Electrical"
            value={formData.electricalAmount}
            onChange={(value) =>
              updateField("electricalAmount", value)
            }
          />

          <MoneyField
            label="Structural"
            value={formData.structuralAmount}
            onChange={(value) =>
              updateField("structuralAmount", value)
            }
          />

          <MoneyField
            label="Interior"
            value={formData.interiorAmount}
            onChange={(value) =>
              updateField("interiorAmount", value)
            }
          />

          <MoneyField
            label="Exterior"
            value={formData.exteriorAmount}
            onChange={(value) =>
              updateField("exteriorAmount", value)
            }
          />

          <MoneyField
            label="Landscaping"
            value={formData.landscapingAmount}
            onChange={(value) =>
              updateField("landscapingAmount", value)
            }
          />

          <MoneyField
            label="Appliances"
            value={formData.appliancesAmount}
            onChange={(value) =>
              updateField("appliancesAmount", value)
            }
          />

          <MoneyField
            label="Other"
            value={formData.otherAmount}
            onChange={(value) =>
              updateField("otherAmount", value)
            }
          />
        </div>

        <div className="mt-6 rounded-2xl border border-green-500/20 bg-green-500/[0.05] p-5">
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            Estimated Repair Total
          </div>

          <div className="mt-2 text-3xl font-bold text-green-400">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(estimatedTotal)}
          </div>
        </div>
      </Panel>

      <Panel
        icon={Users}
        title="Vendor Bids"
        subtitle="Compare vendor pricing and select the preferred contractor."
      >
        <div className="space-y-5">
          <VendorRow
            number="1"
            name={formData.vendor1Name}
            bid={formData.vendor1Bid}
            onName={(value) =>
              updateField("vendor1Name", value)
            }
            onBid={(value) =>
              updateField("vendor1Bid", value)
            }
          />

          <VendorRow
            number="2"
            name={formData.vendor2Name}
            bid={formData.vendor2Bid}
            onName={(value) =>
              updateField("vendor2Name", value)
            }
            onBid={(value) =>
              updateField("vendor2Bid", value)
            }
          />

          <VendorRow
            number="3"
            name={formData.vendor3Name}
            bid={formData.vendor3Bid}
            onName={(value) =>
              updateField("vendor3Name", value)
            }
            onBid={(value) =>
              updateField("vendor3Bid", value)
            }
          />

          <Field
            label="Selected Vendor"
            value={formData.selectedVendor}
            onChange={(value) =>
              updateField("selectedVendor", value)
            }
            placeholder="Enter selected contractor"
          />
        </div>
      </Panel>

      <Panel
        icon={CheckCircle2}
        title="Client Approval"
        subtitle="Track client authorization and approved repair budget."
      >
        <div className="grid gap-5 md:grid-cols-2">
          <SelectField
            label="Approval Status"
            value={formData.clientApprovalStatus}
            onChange={(value) =>
              updateField(
                "clientApprovalStatus",
                value
              )
            }
            options={[
              "",
              "Not Submitted",
              "Pending",
              "Approved",
              "Partially Approved",
              "Denied",
              "Revision Requested",
            ]}
          />

          <MoneyField
            label="Approved Budget"
            value={formData.approvedBudget}
            onChange={(value) =>
              updateField("approvedBudget", value)
            }
          />

          <div className="md:col-span-2">
            <TextArea
              label="Approval Notes"
              value={formData.approvalNotes}
              onChange={(value) =>
                updateField("approvalNotes", value)
              }
            />
          </div>
        </div>
      </Panel>

      <Panel
        icon={Wrench}
        title="Repair Work"
        subtitle="Track execution, completion dates, and final cost."
      >
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          <SelectField
            label="Work Status"
            value={formData.workStatus}
            onChange={(value) =>
              updateField("workStatus", value)
            }
            options={[
              "scope",
              "bid_requested",
              "awaiting_approval",
              "approved",
              "scheduled",
              "in_progress",
              "completed",
              "cancelled",
            ]}
          />

          <Field
            label="Work Started"
            type="date"
            value={formData.workStartedDate}
            onChange={(value) =>
              updateField("workStartedDate", value)
            }
          />

          <Field
            label="Target Completion"
            type="date"
            value={
              formData.targetCompletionDate
            }
            onChange={(value) =>
              updateField(
                "targetCompletionDate",
                value
              )
            }
          />

          <Field
            label="Actual Completion"
            type="date"
            value={
              formData.actualCompletionDate
            }
            onChange={(value) =>
              updateField(
                "actualCompletionDate",
                value
              )
            }
          />

          <MoneyField
            label="Final Cost"
            value={formData.finalCost}
            onChange={(value) =>
              updateField("finalCost", value)
            }
          />
        </div>

        <div className="mt-6 space-y-5">
          <TextArea
            label="Repair Notes"
            value={formData.repairNotes}
            onChange={(value) =>
              updateField("repairNotes", value)
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
        </div>
      </Panel>

      <div className="flex justify-end rounded-2xl border border-white/10 bg-[#07111f] p-5">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-6 py-3 text-sm font-semibold transition hover:bg-green-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Save className="h-4 w-4" />

          {saving
            ? "Saving Repair Scope..."
            : "Save Repair Scope & Estimate"}
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
  icon: typeof Hammer;
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
          <h2 className="font-semibold">{title}</h2>

          <p className="mt-1 text-xs text-slate-500">
            {subtitle}
          </p>
        </div>
      </div>

      <div className="p-6">{children}</div>
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

function MoneyField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <Field
      label={label}
      value={value}
      onChange={onChange}
      placeholder="$"
    />
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
        rows={5}
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

function VendorRow({
  number,
  name,
  bid,
  onName,
  onBid,
}: {
  number: string;
  name: string;
  bid: string;
  onName: (value: string) => void;
  onBid: (value: string) => void;
}) {
  return (
    <div className="grid gap-4 rounded-xl border border-white/10 bg-white/[0.02] p-4 md:grid-cols-[1fr_240px]">
      <Field
        label={`Vendor ${number}`}
        value={name}
        onChange={onName}
        placeholder="Contractor / company"
      />

      <MoneyField
        label="Bid"
        value={bid}
        onChange={onBid}
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
