"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  Banknote,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  FileCheck2,
  Landmark,
  Save,
  ShieldCheck,
  UserRound,
} from "lucide-react";

type UnderContractInput = {
  contractDate: string;
  acceptedPrice: string;
  closingDate: string;

  buyerName: string;
  buyerAgentName: string;

  financingType: string;
  lenderName: string;

  earnestMoneyAmount: string;
  earnestMoneyDueDate: string;
  earnestMoneyReceived: boolean;
  earnestMoneyReceivedDate: string;
  earnestMoneyHolder: string;

  dueDiligenceDeadline: string;
  inspectionDeadline: string;
  financingDeadline: string;
  appraisalDeadline: string;
  titleDeadline: string;

  inspectionComplete: boolean;
  repairRequestReceived: boolean;
  repairAgreementComplete: boolean;

  appraisalOrdered: boolean;
  appraisalComplete: boolean;
  appraisedValue: string;

  financingApproved: boolean;
  clearToClose: boolean;

  titleOrdered: boolean;
  titleClear: boolean;

  attorneyName: string;
  titleCompany: string;

  executedContractReceived: boolean;
  addendaReceived: boolean;
  closingPackageReady: boolean;

  financingIssue: boolean;
  appraisalIssue: boolean;
  titleIssue: boolean;
  buyerDefaultRisk: boolean;
  legalReviewNeeded: boolean;

  contractNotes: string;
};

const fieldClass =
  "mt-2 w-full rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-green-500";

const labelClass =
  "text-sm font-medium text-slate-300";

export default function UnderContractPanel({
  assetId,
  acceptedPrice,
}: {
  assetId: string;
  acceptedPrice?: number | null;
}) {
  const today = new Date().toISOString().slice(0, 10);

  const [formData, setFormData] =
    useState<UnderContractInput>({
      contractDate: today,
      acceptedPrice: acceptedPrice
        ? String(acceptedPrice)
        : "",
      closingDate: "",

      buyerName: "",
      buyerAgentName: "",

      financingType: "",
      lenderName: "",

      earnestMoneyAmount: "",
      earnestMoneyDueDate: "",
      earnestMoneyReceived: false,
      earnestMoneyReceivedDate: "",
      earnestMoneyHolder: "",

      dueDiligenceDeadline: "",
      inspectionDeadline: "",
      financingDeadline: "",
      appraisalDeadline: "",
      titleDeadline: "",

      inspectionComplete: false,
      repairRequestReceived: false,
      repairAgreementComplete: false,

      appraisalOrdered: false,
      appraisalComplete: false,
      appraisedValue: "",

      financingApproved: false,
      clearToClose: false,

      titleOrdered: false,
      titleClear: false,

      attorneyName: "",
      titleCompany: "",

      executedContractReceived: false,
      addendaReceived: false,
      closingPackageReady: false,

      financingIssue: false,
      appraisalIssue: false,
      titleIssue: false,
      buyerDefaultRisk: false,
      legalReviewNeeded: false,

      contractNotes: "",
    });

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  function updateField<
    K extends keyof UnderContractInput
  >(
    key: K,
    value: UnderContractInput[K]
  ) {
    setFormData((current) => ({
      ...current,
      [key]: value,
    }));
  }

  const readinessItems = [
    formData.earnestMoneyReceived,
    formData.executedContractReceived,
    formData.inspectionComplete,
    formData.appraisalComplete,
    formData.financingApproved,
    formData.titleClear,
    formData.clearToClose,
    formData.closingPackageReady,
  ];

  const readinessCount =
    readinessItems.filter(Boolean).length;

  const readinessPercent = Math.round(
    (readinessCount /
      readinessItems.length) *
      100
  );

  const hasCriticalException =
    formData.financingIssue ||
    formData.appraisalIssue ||
    formData.titleIssue ||
    formData.buyerDefaultRisk ||
    formData.legalReviewNeeded;

  async function handleSave() {
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const response = await fetch(
        `/api/reo/assets/${assetId}/under-contract`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ||
            "Unable to save contract information."
        );
      }

      setSuccess(
        result.movedToClosing
          ? "Contract review completed. Asset moved to Closing."
          : "Under Contract workspace saved successfully."
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save contract information."
      );
    } finally {
      setSaving(false);
    }
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
          text={success}
        />
      )}

      <section className="rounded-2xl border border-green-500/20 bg-green-500/[0.04] p-6">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-green-400">
              Closing Readiness
            </div>

            <div className="mt-2 text-3xl font-bold">
              {readinessPercent}%
            </div>

            <div className="mt-1 text-sm text-slate-500">
              {readinessCount} of{" "}
              {readinessItems.length} critical milestones complete
            </div>
          </div>

          <div className="h-3 w-full overflow-hidden rounded-full bg-slate-800 lg:w-80">
            <div
              className="h-full rounded-full bg-green-500 transition-all"
              style={{
                width: `${readinessPercent}%`,
              }}
            />
          </div>
        </div>
      </section>

      <Panel
        icon={FileCheck2}
        title="Contract Summary"
        subtitle="Core executed-contract information."
      >
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <Field
            label="Contract Date"
            type="date"
            value={formData.contractDate}
            onChange={(value) =>
              updateField(
                "contractDate",
                value
              )
            }
          />

          <MoneyField
            label="Accepted Price"
            value={formData.acceptedPrice}
            onChange={(value) =>
              updateField(
                "acceptedPrice",
                value
              )
            }
          />

          <Field
            label="Closing Date"
            type="date"
            value={formData.closingDate}
            onChange={(value) =>
              updateField(
                "closingDate",
                value
              )
            }
          />

          <Field
            label="Buyer Name"
            value={formData.buyerName}
            onChange={(value) =>
              updateField(
                "buyerName",
                value
              )
            }
          />

          <Field
            label="Buyer Agent"
            value={formData.buyerAgentName}
            onChange={(value) =>
              updateField(
                "buyerAgentName",
                value
              )
            }
          />

          <SelectField
            label="Financing Type"
            value={formData.financingType}
            onChange={(value) =>
              updateField(
                "financingType",
                value
              )
            }
            options={[
              "",
              "Cash",
              "Conventional",
              "FHA",
              "VA",
              "USDA",
              "Portfolio",
              "Hard Money",
              "Other",
            ]}
          />
        </div>
      </Panel>

      <Panel
        icon={CircleDollarSign}
        title="Earnest Money & Due Diligence"
        subtitle="Track deposit requirements and confirmation."
      >
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <MoneyField
            label="Earnest Money"
            value={
              formData.earnestMoneyAmount
            }
            onChange={(value) =>
              updateField(
                "earnestMoneyAmount",
                value
              )
            }
          />

          <Field
            label="Earnest Money Due"
            type="date"
            value={
              formData.earnestMoneyDueDate
            }
            onChange={(value) =>
              updateField(
                "earnestMoneyDueDate",
                value
              )
            }
          />

          <Toggle
            label="Earnest Money Received?"
            value={
              formData.earnestMoneyReceived
            }
            onChange={(value) =>
              updateField(
                "earnestMoneyReceived",
                value
              )
            }
          />

          <Field
            label="Received Date"
            type="date"
            value={
              formData.earnestMoneyReceivedDate
            }
            onChange={(value) =>
              updateField(
                "earnestMoneyReceivedDate",
                value
              )
            }
          />

          <Field
            label="Earnest Money Holder"
            value={
              formData.earnestMoneyHolder
            }
            onChange={(value) =>
              updateField(
                "earnestMoneyHolder",
                value
              )
            }
          />
        </div>
      </Panel>

      <Panel
        icon={CalendarDays}
        title="Critical Deadlines"
        subtitle="Contractual milestone tracking."
      >
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <Field
            label="Due Diligence Deadline"
            type="date"
            value={
              formData.dueDiligenceDeadline
            }
            onChange={(value) =>
              updateField(
                "dueDiligenceDeadline",
                value
              )
            }
          />

          <Field
            label="Inspection Deadline"
            type="date"
            value={
              formData.inspectionDeadline
            }
            onChange={(value) =>
              updateField(
                "inspectionDeadline",
                value
              )
            }
          />

          <Field
            label="Financing Deadline"
            type="date"
            value={
              formData.financingDeadline
            }
            onChange={(value) =>
              updateField(
                "financingDeadline",
                value
              )
            }
          />

          <Field
            label="Appraisal Deadline"
            type="date"
            value={
              formData.appraisalDeadline
            }
            onChange={(value) =>
              updateField(
                "appraisalDeadline",
                value
              )
            }
          />

          <Field
            label="Title Deadline"
            type="date"
            value={
              formData.titleDeadline
            }
            onChange={(value) =>
              updateField(
                "titleDeadline",
                value
              )
            }
          />
        </div>
      </Panel>

      <Panel
        icon={ShieldCheck}
        title="Inspection & Repairs"
        subtitle="Track post-contract inspection and repair negotiations."
      >
        <div className="grid gap-4 md:grid-cols-3">
          <Toggle
            label="Inspection Complete?"
            value={
              formData.inspectionComplete
            }
            onChange={(value) =>
              updateField(
                "inspectionComplete",
                value
              )
            }
          />

          <Toggle
            label="Repair Request Received?"
            value={
              formData.repairRequestReceived
            }
            onChange={(value) =>
              updateField(
                "repairRequestReceived",
                value
              )
            }
          />

          <Toggle
            label="Repair Agreement Complete?"
            value={
              formData.repairAgreementComplete
            }
            onChange={(value) =>
              updateField(
                "repairAgreementComplete",
                value
              )
            }
          />
        </div>
      </Panel>

      <Panel
        icon={Banknote}
        title="Financing & Appraisal"
        subtitle="Monitor lender, appraisal, and financing approval."
      >
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <Field
            label="Lender"
            value={formData.lenderName}
            onChange={(value) =>
              updateField(
                "lenderName",
                value
              )
            }
          />

          <Toggle
            label="Appraisal Ordered?"
            value={
              formData.appraisalOrdered
            }
            onChange={(value) =>
              updateField(
                "appraisalOrdered",
                value
              )
            }
          />

          <Toggle
            label="Appraisal Complete?"
            value={
              formData.appraisalComplete
            }
            onChange={(value) =>
              updateField(
                "appraisalComplete",
                value
              )
            }
          />

          <MoneyField
            label="Appraised Value"
            value={
              formData.appraisedValue
            }
            onChange={(value) =>
              updateField(
                "appraisedValue",
                value
              )
            }
          />

          <Toggle
            label="Financing Approved?"
            value={
              formData.financingApproved
            }
            onChange={(value) =>
              updateField(
                "financingApproved",
                value
              )
            }
          />

          <Toggle
            label="Clear to Close?"
            value={
              formData.clearToClose
            }
            onChange={(value) =>
              updateField(
                "clearToClose",
                value
              )
            }
          />
        </div>
      </Panel>

      <Panel
        icon={Landmark}
        title="Title & Closing"
        subtitle="Coordinate title, attorney, and closing preparation."
      >
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <Toggle
            label="Title Ordered?"
            value={
              formData.titleOrdered
            }
            onChange={(value) =>
              updateField(
                "titleOrdered",
                value
              )
            }
          />

          <Toggle
            label="Title Clear?"
            value={
              formData.titleClear
            }
            onChange={(value) =>
              updateField(
                "titleClear",
                value
              )
            }
          />

          <Field
            label="Closing Attorney"
            value={
              formData.attorneyName
            }
            onChange={(value) =>
              updateField(
                "attorneyName",
                value
              )
            }
          />

          <Field
            label="Title Company"
            value={
              formData.titleCompany
            }
            onChange={(value) =>
              updateField(
                "titleCompany",
                value
              )
            }
          />
        </div>
      </Panel>

      <Panel
        icon={FileCheck2}
        title="Contract Documents"
        subtitle="Track the core closing file."
      >
        <div className="grid gap-4 md:grid-cols-3">
          <Toggle
            label="Executed Contract Received?"
            value={
              formData.executedContractReceived
            }
            onChange={(value) =>
              updateField(
                "executedContractReceived",
                value
              )
            }
          />

          <Toggle
            label="Addenda Received?"
            value={
              formData.addendaReceived
            }
            onChange={(value) =>
              updateField(
                "addendaReceived",
                value
              )
            }
          />

          <Toggle
            label="Closing Package Ready?"
            value={
              formData.closingPackageReady
            }
            onChange={(value) =>
              updateField(
                "closingPackageReady",
                value
              )
            }
          />
        </div>
      </Panel>

      <Panel
        icon={AlertTriangle}
        title="Exceptions & Escalations"
        subtitle="Identify contract conditions requiring immediate attention."
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Toggle
            label="Financing Issue?"
            value={
              formData.financingIssue
            }
            onChange={(value) =>
              updateField(
                "financingIssue",
                value
              )
            }
          />

          <Toggle
            label="Appraisal Issue?"
            value={
              formData.appraisalIssue
            }
            onChange={(value) =>
              updateField(
                "appraisalIssue",
                value
              )
            }
          />

          <Toggle
            label="Title Issue?"
            value={
              formData.titleIssue
            }
            onChange={(value) =>
              updateField(
                "titleIssue",
                value
              )
            }
          />

          <Toggle
            label="Buyer Default Risk?"
            value={
              formData.buyerDefaultRisk
            }
            onChange={(value) =>
              updateField(
                "buyerDefaultRisk",
                value
              )
            }
          />

          <Toggle
            label="Legal Review Needed?"
            value={
              formData.legalReviewNeeded
            }
            onChange={(value) =>
              updateField(
                "legalReviewNeeded",
                value
              )
            }
          />
        </div>

        {hasCriticalException && (
          <div className="mt-5 rounded-xl border border-red-500/25 bg-red-500/10 p-4 text-sm text-red-300">
            One or more contract exceptions require attention before closing approval.
          </div>
        )}

        <div className="mt-5">
          <TextArea
            label="Contract Notes"
            value={
              formData.contractNotes
            }
            onChange={(value) =>
              updateField(
                "contractNotes",
                value
              )
            }
          />
        </div>
      </Panel>

      <section className="rounded-2xl border border-white/10 bg-[#07111f] p-6">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
          <div>
            <h3 className="font-semibold">
              Closing Approval
            </h3>

            <p className="mt-1 max-w-2xl text-sm text-slate-500">
              When all critical milestones are complete and no material exceptions remain, this workspace can move the asset into Closing.
            </p>
          </div>

          <div className="text-right">
            <div className="text-2xl font-bold text-green-400">
              {readinessPercent}%
            </div>

            <div className="text-xs text-slate-500">
              closing ready
            </div>
          </div>
        </div>
      </section>

      <div className="flex justify-end rounded-2xl border border-white/10 bg-[#07111f] p-5">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-6 py-3 text-sm font-semibold transition hover:bg-green-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Save className="h-4 w-4" />

          {saving
            ? "Saving..."
            : readinessPercent === 100 &&
              !hasCriticalException
            ? "Approve for Closing"
            : "Save Contract Workspace"}
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
    <div className="flex min-h-[70px] items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.025] px-4 py-3">
      <span className="text-sm text-slate-300">
        {label}
      </span>

      <button
        type="button"
        onClick={() =>
          onChange(!value)
        }
        className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold ${
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
