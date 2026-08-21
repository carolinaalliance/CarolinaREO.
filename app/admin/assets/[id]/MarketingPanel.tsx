"use client";

import { useState } from "react";
import {
  AlertTriangle,
  BarChart3,
  Building2,
  Camera,
  CheckCircle2,
  ClipboardCheck,
  DollarSign,
  Home,
  Save,
  Users,
} from "lucide-react";

import {
  saveMarketingActivation,
  type MarketingActivationInput,
} from "./actions";

const fieldClass =
  "mt-2 w-full rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-green-500";

const labelClass =
  "text-sm font-medium text-slate-300";

export default function MarketingPanel({
  assetId,
  currentListPrice,
}: {
  assetId: string;
  currentListPrice?: number | null;
}) {
  const today =
    new Date().toISOString().slice(0, 10);

  const [formData, setFormData] =
    useState<MarketingActivationInput>({
      activationDate: today,
      listingStatus: "pre_marketing",

      mlsNumber: "",
      mlsListDate: "",

      listingAgent: "",
      listingAgentEmail: "",
      listingAgentPhone: "",

      originalListPrice:
        currentListPrice
          ? String(currentListPrice)
          : "",

      currentListPrice:
        currentListPrice
          ? String(currentListPrice)
          : "",

      photographyComplete: false,
      signageInstalled: false,
      lockboxActive: false,

      mlsActive: false,
      brokerageSiteActive: false,
      syndicationActive: false,
      virtualTourActive: false,

      showingInstructions: "",
      occupantShowingNotes: "",

      totalShowings: "0",
      totalInquiries: "0",

      buyerFeedbackSummary: "",
      marketingSummary: "",
      clientInstructions: "",

      priceChangeRequested: false,
      proposedPrice: "",
      clientPriceApprovalStatus: "",

      nextMarketingReviewDate: "",
      nextAction: "",

      activated: false,
    });

  const [saving, setSaving] =
    useState(false);

  const [success, setSuccess] =
    useState(false);

  const [error, setError] =
    useState("");

  function updateField<
    K extends keyof MarketingActivationInput
  >(
    key: K,
    value: MarketingActivationInput[K]
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
      await saveMarketingActivation(
        assetId,
        formData
      );

    setSaving(false);

    if (!result.success) {
      setError(
        result.error ||
          "Marketing record could not be saved."
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
          text={
            formData.activated
              ? "Property listing activated successfully."
              : "Marketing record saved successfully."
          }
        />
      )}

      <Panel
        icon={Building2}
        title="Listing Activation"
        subtitle="Activate the asset in MLS and establish the live listing record."
      >
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <Field
            label="Activation Date"
            type="date"
            value={formData.activationDate}
            onChange={(value) =>
              updateField(
                "activationDate",
                value
              )
            }
          />

          <SelectField
            label="Listing Status"
            value={formData.listingStatus}
            onChange={(value) =>
              updateField(
                "listingStatus",
                value
              )
            }
            options={[
              "pre_marketing",
              "coming_soon",
              "active",
              "temporarily_off_market",
              "withdrawn",
            ]}
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
          />

          <Field
            label="MLS List Date"
            type="date"
            value={formData.mlsListDate}
            onChange={(value) =>
              updateField(
                "mlsListDate",
                value
              )
            }
          />

          <Field
            label="Original List Price"
            value={formData.originalListPrice}
            onChange={(value) =>
              updateField(
                "originalListPrice",
                value
              )
            }
            placeholder="$"
          />

          <Field
            label="Current List Price"
            value={formData.currentListPrice}
            onChange={(value) =>
              updateField(
                "currentListPrice",
                value
              )
            }
            placeholder="$"
          />
        </div>
      </Panel>

      <Panel
        icon={Users}
        title="Listing Agent"
        subtitle="Record the responsible listing agent and contact information."
      >
        <div className="grid gap-5 md:grid-cols-3">
          <Field
            label="Listing Agent"
            value={formData.listingAgent}
            onChange={(value) =>
              updateField(
                "listingAgent",
                value
              )
            }
          />

          <Field
            label="Agent Email"
            type="email"
            value={formData.listingAgentEmail}
            onChange={(value) =>
              updateField(
                "listingAgentEmail",
                value
              )
            }
          />

          <Field
            label="Agent Phone"
            value={formData.listingAgentPhone}
            onChange={(value) =>
              updateField(
                "listingAgentPhone",
                value
              )
            }
          />
        </div>
      </Panel>

      <Panel
        icon={Camera}
        title="Marketing Distribution"
        subtitle="Confirm the listing is properly prepared and distributed."
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Toggle
            label="Photography Complete?"
            value={formData.photographyComplete}
            onChange={(value) =>
              updateField(
                "photographyComplete",
                value
              )
            }
          />

          <Toggle
            label="Signage Installed?"
            value={formData.signageInstalled}
            onChange={(value) =>
              updateField(
                "signageInstalled",
                value
              )
            }
          />

          <Toggle
            label="Lockbox Active?"
            value={formData.lockboxActive}
            onChange={(value) =>
              updateField(
                "lockboxActive",
                value
              )
            }
          />

          <Toggle
            label="MLS Active?"
            value={formData.mlsActive}
            onChange={(value) =>
              updateField(
                "mlsActive",
                value
              )
            }
          />

          <Toggle
            label="Brokerage Site Active?"
            value={formData.brokerageSiteActive}
            onChange={(value) =>
              updateField(
                "brokerageSiteActive",
                value
              )
            }
          />

          <Toggle
            label="Syndication Active?"
            value={formData.syndicationActive}
            onChange={(value) =>
              updateField(
                "syndicationActive",
                value
              )
            }
          />

          <Toggle
            label="Virtual Tour Active?"
            value={formData.virtualTourActive}
            onChange={(value) =>
              updateField(
                "virtualTourActive",
                value
              )
            }
          />
        </div>
      </Panel>

      <Panel
        icon={Home}
        title="Showing Instructions"
        subtitle="Document access, showing, and occupancy instructions."
      >
        <div className="space-y-5">
          <TextArea
            label="Showing Instructions"
            value={formData.showingInstructions}
            onChange={(value) =>
              updateField(
                "showingInstructions",
                value
              )
            }
          />

          <TextArea
            label="Occupant / Access Notes"
            value={formData.occupantShowingNotes}
            onChange={(value) =>
              updateField(
                "occupantShowingNotes",
                value
              )
            }
          />
        </div>
      </Panel>

      <Panel
        icon={BarChart3}
        title="Marketing Activity"
        subtitle="Track inquiry volume, showings, feedback, and client-facing marketing activity."
      >
        <div className="grid gap-5 md:grid-cols-2">
          <Field
            label="Total Showings"
            type="number"
            value={formData.totalShowings}
            onChange={(value) =>
              updateField(
                "totalShowings",
                value
              )
            }
          />

          <Field
            label="Total Inquiries"
            type="number"
            value={formData.totalInquiries}
            onChange={(value) =>
              updateField(
                "totalInquiries",
                value
              )
            }
          />

          <div className="md:col-span-2">
            <TextArea
              label="Buyer Feedback Summary"
              value={formData.buyerFeedbackSummary}
              onChange={(value) =>
                updateField(
                  "buyerFeedbackSummary",
                  value
                )
              }
            />
          </div>

          <div className="md:col-span-2">
            <TextArea
              label="Marketing Summary"
              value={formData.marketingSummary}
              onChange={(value) =>
                updateField(
                  "marketingSummary",
                  value
                )
              }
            />
          </div>
        </div>
      </Panel>

      <Panel
        icon={DollarSign}
        title="Price & Strategy"
        subtitle="Track pricing recommendations and client approval."
      >
        <div className="grid gap-5 md:grid-cols-3">
          <Toggle
            label="Price Change Requested?"
            value={formData.priceChangeRequested}
            onChange={(value) =>
              updateField(
                "priceChangeRequested",
                value
              )
            }
          />

          <Field
            label="Proposed Price"
            value={formData.proposedPrice}
            onChange={(value) =>
              updateField(
                "proposedPrice",
                value
              )
            }
            placeholder="$"
          />

          <SelectField
            label="Client Price Approval"
            value={
              formData.clientPriceApprovalStatus
            }
            onChange={(value) =>
              updateField(
                "clientPriceApprovalStatus",
                value
              )
            }
            options={[
              "",
              "Not Submitted",
              "Pending",
              "Approved",
              "Denied",
              "Revision Requested",
            ]}
          />
        </div>

        <div className="mt-5">
          <TextArea
            label="Client Marketing Instructions"
            value={formData.clientInstructions}
            onChange={(value) =>
              updateField(
                "clientInstructions",
                value
              )
            }
          />
        </div>
      </Panel>

      <Panel
        icon={ClipboardCheck}
        title="Marketing SLA & Next Action"
        subtitle="Establish the next review date and required marketing action."
      >
        <div className="grid gap-5 md:grid-cols-2">
          <Field
            label="Next Marketing Review"
            type="date"
            value={
              formData.nextMarketingReviewDate
            }
            onChange={(value) =>
              updateField(
                "nextMarketingReviewDate",
                value
              )
            }
          />

          <Field
            label="Next Action"
            value={formData.nextAction}
            onChange={(value) =>
              updateField(
                "nextAction",
                value
              )
            }
            placeholder="Review feedback, price recommendation, client report..."
          />
        </div>
      </Panel>

      <section className="rounded-2xl border border-white/10 bg-[#07111f] p-6">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
          <div>
            <h3 className="font-semibold">
              Listing Activation
            </h3>

            <p className="mt-1 max-w-2xl text-sm text-slate-500">
              Activating the listing moves the asset
              to Listed, completes the listing-activation
              task, and begins the active marketing cycle.
            </p>
          </div>

          <Toggle
            label="Activate Listing?"
            value={formData.activated}
            onChange={(value) =>
              updateField(
                "activated",
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
            : formData.activated
            ? "Activate Property Listing"
            : "Save Marketing Record"}
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
