"use client";

import {
  useMemo,
  useState,
} from "react";

import {
  AlertTriangle,
  Banknote,
  CheckCircle2,
  ClipboardCheck,
  DollarSign,
  FileCheck2,
  Gavel,
  Save,
  UserRound,
} from "lucide-react";

import {
  saveOffer,
  type OfferInput,
} from "./actions";

const fieldClass =
  "mt-2 w-full rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-green-500";

const labelClass =
  "text-sm font-medium text-slate-300";

export default function OfferPanel({
  assetId,
  currentListPrice,
}: {
  assetId: string;
  currentListPrice?: number | null;
}) {
  const today =
    new Date()
      .toISOString()
      .slice(0, 10);

  const [formData, setFormData] =
    useState<OfferInput>({
      receivedDate: today,
      receivedTime: "",

      buyerName: "",
      buyerEmail: "",
      buyerPhone: "",

      buyerAgentName: "",
      buyerAgentCompany: "",
      buyerAgentEmail: "",
      buyerAgentPhone: "",

      offerPrice: "",

      financingType: "",
      loanAmount: "",
      downPayment: "",

      earnestMoney: "",
      dueDiligenceFee: "",

      dueDiligenceDeadline: "",
      inspectionDeadline: "",
      financingDeadline: "",
      appraisalDeadline: "",

      proposedClosingDate: "",

      sellerPaidClosingCosts: "",
      repairCredit: "",
      otherConcessions: "",

      commissionCost: "",
      estimatedSellerCosts: "",

      proofOfFundsReceived: false,
      preapprovalReceived: false,

      appraisalContingency: false,
      financingContingency: false,
      inspectionContingency: false,
      saleOfHomeContingency: false,

      offerExpiration: "",

      specialTerms: "",
      buyerNotes: "",
      internalAnalysis: "",

      clientDecision: "",

      counterPrice: "",
      counterClosingDate: "",
      counterTerms: "",

      acceptedPrice: "",
      acceptedClosingDate: "",
    });

  const [saving, setSaving] =
    useState(false);

  const [success, setSuccess] =
    useState("");

  const [error, setError] =
    useState("");

  function updateField<
    K extends keyof OfferInput
  >(
    key: K,
    value: OfferInput[K]
  ) {
    setFormData((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function number(value: string) {
    const parsed = Number(
      value.replace(
        /[$,]/g,
        ""
      )
    );

    return Number.isFinite(parsed)
      ? parsed
      : 0;
  }

  const netAnalysis =
    useMemo(() => {
      return (
        number(
          formData.offerPrice
        ) -
        number(
          formData.sellerPaidClosingCosts
        ) -
        number(
          formData.repairCredit
        ) -
        number(
          formData.otherConcessions
        ) -
        number(
          formData.commissionCost
        ) -
        number(
          formData.estimatedSellerCosts
        )
      );
    }, [formData]);

  const listPrice =
    currentListPrice || 0;

  const offerToList =
    listPrice > 0
      ? (
          (number(
            formData.offerPrice
          ) /
            listPrice) *
          100
        )
      : 0;

  async function handleSave() {
    setError("");
    setSuccess("");
    setSaving(true);

    const result =
      await saveOffer(
        assetId,
        formData
      );

    setSaving(false);

    if (!result.success) {
      setError(
        result.error ||
          "Offer could not be saved."
      );

      return;
    }

    setSuccess(
      result.workflowStage ===
        "under_contract"
        ? "Offer accepted. Asset moved to Under Contract."
        : "Offer saved successfully."
    );
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

      {/* OFFER SUMMARY */}

      <section className="rounded-2xl border border-green-500/20 bg-green-500/[0.04] p-6">
        <div className="grid gap-5 md:grid-cols-3">

          <Metric
            label="Current List Price"
            value={
              listPrice
                ? money(
                    listPrice
                  )
                : "—"
            }
          />

          <Metric
            label="Offer Price"
            value={
              formData.offerPrice
                ? money(
                    number(
                      formData.offerPrice
                    )
                  )
                : "—"
            }
          />

          <Metric
            label="Offer / List"
            value={
              formData.offerPrice &&
              listPrice
                ? `${offerToList.toFixed(
                    1
                  )}%`
                : "—"
            }
          />

        </div>
      </section>

      <Panel
        icon={ClipboardCheck}
        title="Offer Intake"
        subtitle="Record when the offer was received and the proposed purchase price."
      >
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">

          <Field
            label="Received Date"
            type="date"
            value={
              formData.receivedDate
            }
            onChange={(value) =>
              updateField(
                "receivedDate",
                value
              )
            }
          />

          <Field
            label="Received Time"
            type="time"
            value={
              formData.receivedTime
            }
            onChange={(value) =>
              updateField(
                "receivedTime",
                value
              )
            }
          />

          <Field
            label="Offer Price"
            value={
              formData.offerPrice
            }
            onChange={(value) =>
              updateField(
                "offerPrice",
                value
              )
            }
            placeholder="$"
          />

          <Field
            label="Offer Expiration"
            type="datetime-local"
            value={
              formData.offerExpiration
            }
            onChange={(value) =>
              updateField(
                "offerExpiration",
                value
              )
            }
          />

        </div>
      </Panel>

      <Panel
        icon={UserRound}
        title="Buyer"
        subtitle="Buyer and buyer-agent information."
      >
        <div className="grid gap-5 md:grid-cols-2">

          <Field
            label="Buyer Name"
            value={
              formData.buyerName
            }
            onChange={(value) =>
              updateField(
                "buyerName",
                value
              )
            }
          />

          <Field
            label="Buyer Email"
            type="email"
            value={
              formData.buyerEmail
            }
            onChange={(value) =>
              updateField(
                "buyerEmail",
                value
              )
            }
          />

          <Field
            label="Buyer Phone"
            value={
              formData.buyerPhone
            }
            onChange={(value) =>
              updateField(
                "buyerPhone",
                value
              )
            }
          />

        </div>

        <div className="mt-7 border-t border-white/10 pt-7">

          <h3 className="mb-5 text-sm font-semibold">
            Buyer Agent
          </h3>

          <div className="grid gap-5 md:grid-cols-2">

            <Field
              label="Agent Name"
              value={
                formData.buyerAgentName
              }
              onChange={(value) =>
                updateField(
                  "buyerAgentName",
                  value
                )
              }
            />

            <Field
              label="Brokerage"
              value={
                formData.buyerAgentCompany
              }
              onChange={(value) =>
                updateField(
                  "buyerAgentCompany",
                  value
                )
              }
            />

            <Field
              label="Agent Email"
              type="email"
              value={
                formData.buyerAgentEmail
              }
              onChange={(value) =>
                updateField(
                  "buyerAgentEmail",
                  value
                )
              }
            />

            <Field
              label="Agent Phone"
              value={
                formData.buyerAgentPhone
              }
              onChange={(value) =>
                updateField(
                  "buyerAgentPhone",
                  value
                )
              }
            />

          </div>
        </div>
      </Panel>

      <Panel
        icon={Banknote}
        title="Financing"
        subtitle="Document financing strength and buyer qualification."
      >
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

          <SelectField
            label="Financing Type"
            value={
              formData.financingType
            }
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

          <MoneyField
            label="Loan Amount"
            value={
              formData.loanAmount
            }
            onChange={(value) =>
              updateField(
                "loanAmount",
                value
              )
            }
          />

          <MoneyField
            label="Down Payment"
            value={
              formData.downPayment
            }
            onChange={(value) =>
              updateField(
                "downPayment",
                value
              )
            }
          />

          <Toggle
            label="Proof of Funds Received?"
            value={
              formData.proofOfFundsReceived
            }
            onChange={(value) =>
              updateField(
                "proofOfFundsReceived",
                value
              )
            }
          />

          <Toggle
            label="Preapproval Received?"
            value={
              formData.preapprovalReceived
            }
            onChange={(value) =>
              updateField(
                "preapprovalReceived",
                value
              )
            }
          />

        </div>
      </Panel>

      <Panel
        icon={FileCheck2}
        title="Contract Terms"
        subtitle="Record earnest money, due diligence, contingencies, and proposed closing."
      >
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">

          <MoneyField
            label="Earnest Money"
            value={
              formData.earnestMoney
            }
            onChange={(value) =>
              updateField(
                "earnestMoney",
                value
              )
            }
          />

          <MoneyField
            label="Due Diligence Fee"
            value={
              formData.dueDiligenceFee
            }
            onChange={(value) =>
              updateField(
                "dueDiligenceFee",
                value
              )
            }
          />

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
            label="Proposed Closing Date"
            type="date"
            value={
              formData.proposedClosingDate
            }
            onChange={(value) =>
              updateField(
                "proposedClosingDate",
                value
              )
            }
          />

        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">

          <Toggle
            label="Inspection Contingency?"
            value={
              formData.inspectionContingency
            }
            onChange={(value) =>
              updateField(
                "inspectionContingency",
                value
              )
            }
          />

          <Toggle
            label="Financing Contingency?"
            value={
              formData.financingContingency
            }
            onChange={(value) =>
              updateField(
                "financingContingency",
                value
              )
            }
          />

          <Toggle
            label="Appraisal Contingency?"
            value={
              formData.appraisalContingency
            }
            onChange={(value) =>
              updateField(
                "appraisalContingency",
                value
              )
            }
          />

          <Toggle
            label="Sale of Home Contingency?"
            value={
              formData.saleOfHomeContingency
            }
            onChange={(value) =>
              updateField(
                "saleOfHomeContingency",
                value
              )
            }
          />

        </div>
      </Panel>

      <Panel
        icon={DollarSign}
        title="Seller Net Analysis"
        subtitle="Estimate the institutional client's net proceeds before accepting the offer."
      >

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

          <MoneyField
            label="Seller Paid Closing Costs"
            value={
              formData.sellerPaidClosingCosts
            }
            onChange={(value) =>
              updateField(
                "sellerPaidClosingCosts",
                value
              )
            }
          />

          <MoneyField
            label="Repair Credit"
            value={
              formData.repairCredit
            }
            onChange={(value) =>
              updateField(
                "repairCredit",
                value
              )
            }
          />

          <MoneyField
            label="Other Concessions"
            value={
              formData.otherConcessions
            }
            onChange={(value) =>
              updateField(
                "otherConcessions",
                value
              )
            }
          />

          <MoneyField
            label="Commission Cost"
            value={
              formData.commissionCost
            }
            onChange={(value) =>
              updateField(
                "commissionCost",
                value
              )
            }
          />

          <MoneyField
            label="Estimated Seller Costs"
            value={
              formData.estimatedSellerCosts
            }
            onChange={(value) =>
              updateField(
                "estimatedSellerCosts",
                value
              )
            }
          />

        </div>

        <div className="mt-6 rounded-2xl border border-green-500/20 bg-green-500/[0.05] p-5">

          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            Estimated Net to Seller
          </div>

          <div className="mt-2 text-3xl font-bold text-green-400">
            {money(netAnalysis)}
          </div>

        </div>
      </Panel>

      <Panel
        icon={ClipboardCheck}
        title="Offer Analysis"
        subtitle="Document special terms and internal recommendation."
      >

        <div className="space-y-5">

          <TextArea
            label="Special Terms"
            value={
              formData.specialTerms
            }
            onChange={(value) =>
              updateField(
                "specialTerms",
                value
              )
            }
          />

          <TextArea
            label="Buyer / Offer Notes"
            value={
              formData.buyerNotes
            }
            onChange={(value) =>
              updateField(
                "buyerNotes",
                value
              )
            }
          />

          <TextArea
            label="Internal Asset Manager Analysis"
            value={
              formData.internalAnalysis
            }
            onChange={(value) =>
              updateField(
                "internalAnalysis",
                value
              )
            }
          />

        </div>
      </Panel>

      <Panel
        icon={Gavel}
        title="Client Decision"
        subtitle="Record the institutional client's response to this offer."
      >

        <SelectField
          label="Decision"
          value={
            formData.clientDecision
          }
          onChange={(value) =>
            updateField(
              "clientDecision",
              value
            )
          }
          options={[
            "",
            "Pending",
            "Hold",
            "Countered",
            "Accepted",
            "Declined",
          ]}
        />

        {formData.clientDecision ===
          "Countered" && (
          <div className="mt-6 grid gap-5 md:grid-cols-2">

            <MoneyField
              label="Counter Price"
              value={
                formData.counterPrice
              }
              onChange={(value) =>
                updateField(
                  "counterPrice",
                  value
                )
              }
            />

            <Field
              label="Counter Closing Date"
              type="date"
              value={
                formData.counterClosingDate
              }
              onChange={(value) =>
                updateField(
                  "counterClosingDate",
                  value
                )
              }
            />

            <div className="md:col-span-2">

              <TextArea
                label="Counter Terms"
                value={
                  formData.counterTerms
                }
                onChange={(value) =>
                  updateField(
                    "counterTerms",
                    value
                  )
                }
              />

            </div>
          </div>
        )}

        {formData.clientDecision ===
          "Accepted" && (
          <div className="mt-6 grid gap-5 md:grid-cols-2">

            <MoneyField
              label="Accepted Price"
              value={
                formData.acceptedPrice
              }
              onChange={(value) =>
                updateField(
                  "acceptedPrice",
                  value
                )
              }
            />

            <Field
              label="Accepted Closing Date"
              type="date"
              value={
                formData.acceptedClosingDate
              }
              onChange={(value) =>
                updateField(
                  "acceptedClosingDate",
                  value
                )
              }
            />

          </div>
        )}

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
            ? "Saving Offer..."
            : formData.clientDecision ===
                "Accepted"
            ? "Accept Offer & Create Contract"
            : "Save Offer"}
        </button>

      </div>
    </div>
  );
}

function money(
  value: number
) {
  return new Intl.NumberFormat(
    "en-US",
    {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }
  ).format(value);
}

function Metric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.025] p-4">
      <div className="text-xs text-slate-500">
        {label}
      </div>

      <div className="mt-2 text-xl font-semibold">
        {value}
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
  icon: typeof Gavel;
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
        {value
          ? "Yes"
          : "No"}
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
  onChange: (
    value: string
  ) => void;
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
          onChange(
            e.target.value
          )
        }
        placeholder={
          placeholder
        }
        className={
          fieldClass
        }
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
  onChange: (
    value: string
  ) => void;
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
  onChange: (
    value: string
  ) => void;
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
          onChange(
            e.target.value
          )
        }
        className={
          fieldClass
        }
      >
        {options.map(
          (option) => (
            <option
              key={option}
              value={option}
            >
              {option ||
                "Select..."}
            </option>
          )
        )}
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
  onChange: (
    value: string
  ) => void;
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
          onChange(
            e.target.value
          )
        }
        className={
          fieldClass
        }
      />
    </div>
  );
}

function Notice({
  type,
  text,
}: {
  type:
    | "success"
    | "error";
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

        {type ===
        "success" ? (
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
