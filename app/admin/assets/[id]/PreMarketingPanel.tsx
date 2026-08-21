"use client";

import { useState } from "react";
import {
  AlertTriangle,
  Building2,
  Camera,
  CheckCircle2,
  ClipboardCheck,
  DollarSign,
  FileCheck2,
  Home,
  Save,
  UserRound,
} from "lucide-react";

import {
  savePreMarketingReadiness,
  type PreMarketingInput,
} from "./actions";

const fieldClass =
  "mt-2 w-full rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-green-500";

const labelClass =
  "text-sm font-medium text-slate-300";

export default function PreMarketingPanel({
  assetId,
  currentListPrice,
}: {
  assetId: string;
  currentListPrice?: number | null;
}) {
  const today =
    new Date().toISOString().slice(0, 10);

  const [formData, setFormData] =
    useState<PreMarketingInput>({
      reviewDate: today,
      reviewedBy: "",

      propertyReady: false,
      repairsComplete: false,
      preservationComplete: false,
      utilitiesReady: false,
      cleaningComplete: false,
      debrisRemoved: false,

      photographyReady: false,
      signageReady: false,
      lockboxReady: false,

      titleReady: false,
      hoaDocsReady: false,
      listingDocumentsReady: false,

      pricingApproved: false,

      recommendedListPrice:
        currentListPrice
          ? String(currentListPrice)
          : "",

      approvedListPrice:
        currentListPrice
          ? String(currentListPrice)
          : "",

      assignedListingAgent: "",
      agentEmail: "",
      agentPhone: "",

      targetListDate: "",

      mlsReady: false,
      mlsNumber: "",

      clientMarketingInstructions: "",
      listingRemarksNotes: "",
      photographyNotes: "",
      readinessNotes: "",

      approvedForMarketing: false,
    });

  const [saving, setSaving] =
    useState(false);

  const [success, setSuccess] =
    useState(false);

  const [error, setError] =
    useState("");

  function updateField<
    K extends keyof PreMarketingInput
  >(
    key: K,
    value: PreMarketingInput[K]
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
      await savePreMarketingReadiness(
        assetId,
        formData
      );

    setSaving(false);

    if (!result.success) {
      setError(
        result.error ||
          "Pre-marketing review could not be saved."
      );

      return;
    }

    setSuccess(true);
  }

  const readinessItems = [
    formData.propertyReady,
    formData.repairsComplete,
    formData.preservationComplete,
    formData.utilitiesReady,
    formData.cleaningComplete,
    formData.debrisRemoved,
    formData.photographyReady,
    formData.signageReady,
    formData.lockboxReady,
    formData.titleReady,
    formData.hoaDocsReady,
    formData.listingDocumentsReady,
    formData.pricingApproved,
    formData.mlsReady,
  ];

  const readyCount =
    readinessItems.filter(Boolean).length;

  const readinessPercent =
    Math.round(
      (readyCount /
        readinessItems.length) *
        100
    );

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
          text={
            formData.approvedForMarketing
              ? "Asset approved for marketing successfully."
              : "Pre-marketing review saved successfully."
          }
        />
      )}

      {/* READINESS SCORE */}
      <section className="rounded-2xl border border-green-500/20 bg-green-500/[0.04] p-6">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-green-400">
              Listing Readiness
            </div>

            <div className="mt-2 text-3xl font-bold">
              {readinessPercent}%
            </div>

            <div className="mt-1 text-sm text-slate-500">
              {readyCount} of{" "}
              {readinessItems.length} readiness items complete
            </div>
          </div>

          <div className="h-3 w-full overflow-hidden rounded-full bg-slate-800 sm:w-80">
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
        icon={ClipboardCheck}
        title="Pre-Marketing Review"
        subtitle="Establish listing readiness and responsible personnel."
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
        </div>
      </Panel>

      <Panel
        icon={Home}
        title="Property Readiness"
        subtitle="Confirm stabilization and physical property readiness."
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Toggle
            label="Property Ready?"
            value={formData.propertyReady}
            onChange={(value) =>
              updateField(
                "propertyReady",
                value
              )
            }
          />

          <Toggle
            label="Repairs Complete?"
            value={formData.repairsComplete}
            onChange={(value) =>
              updateField(
                "repairsComplete",
                value
              )
            }
          />

          <Toggle
            label="Preservation Complete?"
            value={
              formData.preservationComplete
            }
            onChange={(value) =>
              updateField(
                "preservationComplete",
                value
              )
            }
          />

          <Toggle
            label="Utilities Ready?"
            value={formData.utilitiesReady}
            onChange={(value) =>
              updateField(
                "utilitiesReady",
                value
              )
            }
          />

          <Toggle
            label="Cleaning Complete?"
            value={formData.cleaningComplete}
            onChange={(value) =>
              updateField(
                "cleaningComplete",
                value
              )
            }
          />

          <Toggle
            label="Debris Removed?"
            value={formData.debrisRemoved}
            onChange={(value) =>
              updateField(
                "debrisRemoved",
                value
              )
            }
          />
        </div>
      </Panel>

      <Panel
        icon={Camera}
        title="Marketing Preparation"
        subtitle="Confirm photography, signage, access, and listing presentation readiness."
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Toggle
            label="Photography Ready?"
            value={formData.photographyReady}
            onChange={(value) =>
              updateField(
                "photographyReady",
                value
              )
            }
          />

          <Toggle
            label="Signage Ready?"
            value={formData.signageReady}
            onChange={(value) =>
              updateField(
                "signageReady",
                value
              )
            }
          />

          <Toggle
            label="Lockbox Ready?"
            value={formData.lockboxReady}
            onChange={(value) =>
              updateField(
                "lockboxReady",
                value
              )
            }
          />
        </div>

        <div className="mt-5">
          <TextArea
            label="Photography Notes"
            value={formData.photographyNotes}
            onChange={(value) =>
              updateField(
                "photographyNotes",
                value
              )
            }
            placeholder="Photography requirements, shot list, special property features, restrictions..."
          />
        </div>
      </Panel>

      <Panel
        icon={FileCheck2}
        title="Title & Listing Documentation"
        subtitle="Confirm legal and administrative listing readiness."
      >
        <div className="grid gap-4 md:grid-cols-3">
          <Toggle
            label="Title Ready?"
            value={formData.titleReady}
            onChange={(value) =>
              updateField(
                "titleReady",
                value
              )
            }
          />

          <Toggle
            label="HOA Documents Ready?"
            value={formData.hoaDocsReady}
            onChange={(value) =>
              updateField(
                "hoaDocsReady",
                value
              )
            }
          />

          <Toggle
            label="Listing Documents Ready?"
            value={
              formData.listingDocumentsReady
            }
            onChange={(value) =>
              updateField(
                "listingDocumentsReady",
                value
              )
            }
          />
        </div>
      </Panel>

      <Panel
        icon={DollarSign}
        title="Pricing Approval"
        subtitle="Establish the client-approved launch price."
      >
        <div className="grid gap-5 md:grid-cols-3">
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
            label="Approved List Price"
            value={
              formData.approvedListPrice
            }
            onChange={(value) =>
              updateField(
                "approvedListPrice",
                value
              )
            }
            placeholder="$"
          />

          <Toggle
            label="Pricing Approved?"
            value={formData.pricingApproved}
            onChange={(value) =>
              updateField(
                "pricingApproved",
                value
              )
            }
          />
        </div>
      </Panel>

      <Panel
        icon={UserRound}
        title="Listing Assignment"
        subtitle="Assign the listing agent and establish the target launch date."
      >
        <div className="grid gap-5 md:grid-cols-2">
          <Field
            label="Assigned Listing Agent"
            value={
              formData.assignedListingAgent
            }
            onChange={(value) =>
              updateField(
                "assignedListingAgent",
                value
              )
            }
          />

          <Field
            label="Agent Email"
            type="email"
            value={formData.agentEmail}
            onChange={(value) =>
              updateField(
                "agentEmail",
                value
              )
            }
          />

          <Field
            label="Agent Phone"
            value={formData.agentPhone}
            onChange={(value) =>
              updateField(
                "agentPhone",
                value
              )
            }
          />

          <Field
            label="Target List Date"
            type="date"
            value={formData.targetListDate}
            onChange={(value) =>
              updateField(
                "targetListDate",
                value
              )
            }
          />
        </div>
      </Panel>

      <Panel
        icon={Building2}
        title="MLS Readiness"
        subtitle="Prepare the asset for listing activation."
      >
        <div className="grid gap-5 md:grid-cols-2">
          <Toggle
            label="MLS Ready?"
            value={formData.mlsReady}
            onChange={(value) =>
              updateField(
                "mlsReady",
                value
              )
            }
          />

          <Field
            label="MLS Number"
            value={formData.mlsNumber}
            onChange={(value) =>
              updateField(
                "mlsNumber",
                value
              )
            }
            placeholder="Optional before activation"
          />
        </div>
      </Panel>

      <Panel
        icon={ClipboardCheck}
        title="Client Instructions & Launch Notes"
        subtitle="Document institutional marketing instructions and launch strategy."
      >
        <div className="space-y-5">
          <TextArea
            label="Client Marketing Instructions"
            value={
              formData.clientMarketingInstructions
            }
            onChange={(value) =>
              updateField(
                "clientMarketingInstructions",
                value
              )
            }
          />

          <TextArea
            label="Listing Remarks Notes"
            value={
              formData.listingRemarksNotes
            }
            onChange={(value) =>
              updateField(
                "listingRemarksNotes",
                value
              )
            }
          />

          <TextArea
            label="Readiness Notes"
            value={formData.readinessNotes}
            onChange={(value) =>
              updateField(
                "readinessNotes",
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
              Marketing Approval
            </h3>

            <p className="mt-1 max-w-2xl text-sm text-slate-500">
              Approval moves the asset into
              Pre-Marketing and creates the
              listing-activation task. Required
              readiness items and stabilization
              tasks must be complete.
            </p>
          </div>

          <Toggle
            label="Approve for Marketing?"
            value={
              formData.approvedForMarketing
            }
            onChange={(value) =>
              updateField(
                "approvedForMarketing",
                value
              )
            }
          />
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
            : formData.approvedForMarketing
            ? "Approve for Marketing"
            : "Save Pre-Marketing Review"}
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
