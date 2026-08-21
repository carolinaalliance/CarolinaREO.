"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  AlertTriangle,
  Banknote,
  Building2,
  CheckCircle2,
  CircleDollarSign,
  FileCheck2,
  Landmark,
  Save,
  ShieldCheck,
  Truck,
} from "lucide-react";

type ClosingInput = {
  closingDate: string;
  closingTime: string;
  closingLocation: string;

  acceptedPrice: string;
  buyerName: string;
  financingType: string;

  attorneyName: string;
  titleCompany: string;

  finalWalkthroughComplete: boolean;
  clearToCloseConfirmed: boolean;
  finalTitleClear: boolean;

  settlementStatementReceived: boolean;
  settlementStatementApproved: boolean;

  sellerSigned: boolean;
  buyerSigned: boolean;
  closingCompleted: boolean;

  grossSalePrice: string;
  sellerCredits: string;
  commissionCost: string;
  attorneyTitleCost: string;
  taxesProrations: string;
  hoaCosts: string;
  repairPreservationCosts: string;
  otherDeductions: string;

  fundsReceived: boolean;
  fundingDate: string;
  fundingReference: string;

  deedExecuted: boolean;
  deedRecorded: boolean;
  recordingDate: string;
  recordingBookPage: string;
  recordingInstrumentNumber: string;

  closingDisclosureReceived: boolean;
  deedCopyReceived: boolean;
  wireConfirmationReceived: boolean;
  finalInvoicePackageComplete: boolean;
  clientClosingPackageComplete: boolean;

  utilitiesTransferred: boolean;
  keysReleased: boolean;
  lockboxRemoved: boolean;
  signageRemoved: boolean;
  mlsClosed: boolean;
  vendorsNotified: boolean;

  fundingIssue: boolean;
  titleIssue: boolean;
  recordingIssue: boolean;
  documentIssue: boolean;
  clientHold: boolean;
  legalReviewNeeded: boolean;

  closingNotes: string;
  dispositionNotes: string;
};

const fieldClass =
  "mt-2 w-full rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-green-500";

const labelClass =
  "text-sm font-medium text-slate-300";

export default function ClosingPanel({
  assetId,
  acceptedPrice,
}: {
  assetId: string;
  acceptedPrice?: number | null;
}) {
  const [formData, setFormData] =
    useState<ClosingInput>({
      closingDate: "",
      closingTime: "",
      closingLocation: "",

      acceptedPrice:
        acceptedPrice
          ? String(
              acceptedPrice
            )
          : "",

      buyerName: "",
      financingType: "",

      attorneyName: "",
      titleCompany: "",

      finalWalkthroughComplete: false,
      clearToCloseConfirmed: false,
      finalTitleClear: false,

      settlementStatementReceived: false,
      settlementStatementApproved: false,

      sellerSigned: false,
      buyerSigned: false,
      closingCompleted: false,

      grossSalePrice:
        acceptedPrice
          ? String(
              acceptedPrice
            )
          : "",

      sellerCredits: "",
      commissionCost: "",
      attorneyTitleCost: "",
      taxesProrations: "",
      hoaCosts: "",
      repairPreservationCosts: "",
      otherDeductions: "",

      fundsReceived: false,
      fundingDate: "",
      fundingReference: "",

      deedExecuted: false,
      deedRecorded: false,
      recordingDate: "",
      recordingBookPage: "",
      recordingInstrumentNumber: "",

      closingDisclosureReceived: false,
      deedCopyReceived: false,
      wireConfirmationReceived: false,
      finalInvoicePackageComplete: false,
      clientClosingPackageComplete: false,

      utilitiesTransferred: false,
      keysReleased: false,
      lockboxRemoved: false,
      signageRemoved: false,
      mlsClosed: false,
      vendorsNotified: false,

      fundingIssue: false,
      titleIssue: false,
      recordingIssue: false,
      documentIssue: false,
      clientHold: false,
      legalReviewNeeded: false,

      closingNotes: "",
      dispositionNotes: "",
    });

const [loading, setLoading] =
  useState(true);
  
  const [saving, setSaving] =
    useState(false);

  const [success, setSuccess] =
    useState("");

  const [error, setError] =
    useState("");

  useEffect(() => {
  let cancelled = false;

  async function loadClosingRecord() {
    try {
      const response = await fetch(
        `/api/reo/assets/${assetId}/closing`,
        {
          method: "GET",
          cache: "no-store",
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ||
            "Unable to load closing information."
        );
      }

      if (
        cancelled ||
        !result.closing
      ) {
        return;
      }

      const record =
        result.closing;

      setFormData({
        closingDate:
          record.closing_date || "",

        closingTime:
          record.closing_time || "",

        closingLocation:
          record.closing_location || "",

        acceptedPrice:
          record.accepted_price !== null &&
          record.accepted_price !== undefined
            ? String(
                record.accepted_price
              )
            : "",

        buyerName:
          record.buyer_name || "",

        financingType:
          record.financing_type || "",

        attorneyName:
          record.attorney_name || "",

        titleCompany:
          record.title_company || "",

        finalWalkthroughComplete:
          Boolean(
            record.final_walkthrough_complete
          ),

        clearToCloseConfirmed:
          Boolean(
            record.clear_to_close_confirmed
          ),

        finalTitleClear:
          Boolean(
            record.final_title_clear
          ),

        settlementStatementReceived:
          Boolean(
            record.settlement_statement_received
          ),

        settlementStatementApproved:
          Boolean(
            record.settlement_statement_approved
          ),

        sellerSigned:
          Boolean(
            record.seller_signed
          ),

        buyerSigned:
          Boolean(
            record.buyer_signed
          ),

        closingCompleted:
          Boolean(
            record.closing_completed
          ),

        grossSalePrice:
          record.gross_sale_price !== null &&
          record.gross_sale_price !== undefined
            ? String(
                record.gross_sale_price
              )
            : "",

        sellerCredits:
          record.seller_credits !== null &&
          record.seller_credits !== undefined
            ? String(
                record.seller_credits
              )
            : "",

        commissionCost:
          record.commission_cost !== null &&
          record.commission_cost !== undefined
            ? String(
                record.commission_cost
              )
            : "",

        attorneyTitleCost:
          record.attorney_title_cost !== null &&
          record.attorney_title_cost !== undefined
            ? String(
                record.attorney_title_cost
              )
            : "",

        taxesProrations:
          record.taxes_prorations !== null &&
          record.taxes_prorations !== undefined
            ? String(
                record.taxes_prorations
              )
            : "",

        hoaCosts:
          record.hoa_costs !== null &&
          record.hoa_costs !== undefined
            ? String(
                record.hoa_costs
              )
            : "",

        repairPreservationCosts:
          record.repair_preservation_costs !== null &&
          record.repair_preservation_costs !== undefined
            ? String(
                record.repair_preservation_costs
              )
            : "",

        otherDeductions:
          record.other_deductions !== null &&
          record.other_deductions !== undefined
            ? String(
                record.other_deductions
              )
            : "",

        fundsReceived:
          Boolean(
            record.funds_received
          ),

        fundingDate:
          record.funding_date || "",

        fundingReference:
          record.funding_reference || "",

        deedExecuted:
          Boolean(
            record.deed_executed
          ),

        deedRecorded:
          Boolean(
            record.deed_recorded
          ),

        recordingDate:
          record.recording_date || "",

        recordingBookPage:
          record.recording_book_page || "",

        recordingInstrumentNumber:
          record.recording_instrument_number || "",

        closingDisclosureReceived:
          Boolean(
            record.closing_disclosure_received
          ),

        deedCopyReceived:
          Boolean(
            record.deed_copy_received
          ),

        wireConfirmationReceived:
          Boolean(
            record.wire_confirmation_received
          ),

        finalInvoicePackageComplete:
          Boolean(
            record.final_invoice_package_complete
          ),

        clientClosingPackageComplete:
          Boolean(
            record.client_closing_package_complete
          ),

        utilitiesTransferred:
          Boolean(
            record.utilities_transferred
          ),

        keysReleased:
          Boolean(
            record.keys_released
          ),

        lockboxRemoved:
          Boolean(
            record.lockbox_removed
          ),

        signageRemoved:
          Boolean(
            record.signage_removed
          ),

        mlsClosed:
          Boolean(
            record.mls_closed
          ),

        vendorsNotified:
          Boolean(
            record.vendors_notified
          ),

        fundingIssue:
          Boolean(
            record.funding_issue
          ),

        titleIssue:
          Boolean(
            record.title_issue
          ),

        recordingIssue:
          Boolean(
            record.recording_issue
          ),

        documentIssue:
          Boolean(
            record.document_issue
          ),

        clientHold:
          Boolean(
            record.client_hold
          ),

        legalReviewNeeded:
          Boolean(
            record.legal_review_needed
          ),

        closingNotes:
          record.closing_notes || "",

        dispositionNotes:
          record.disposition_notes || "",
      });
    } catch (err) {
      if (!cancelled) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load closing information."
        );
      }
    } finally {
      if (!cancelled) {
        setLoading(false);
      }
    }
  }

  loadClosingRecord();

  return () => {
    cancelled = true;
  };
}, [assetId]);
  
  function updateField<
    K extends keyof ClosingInput
  >(
    key: K,
    value: ClosingInput[K]
  ) {
    setFormData(
      (current) => ({
        ...current,
        [key]: value,
      })
    );
  }

  function num(
    value: string
  ) {
    const parsed = Number(
      value.replace(
        /[$,]/g,
        ""
      )
    );

    return Number.isFinite(
      parsed
    )
      ? parsed
      : 0;
  }

  const netProceeds =
    useMemo(() => {
      return (
        num(
          formData.grossSalePrice
        ) -
        num(
          formData.sellerCredits
        ) -
        num(
          formData.commissionCost
        ) -
        num(
          formData.attorneyTitleCost
        ) -
        num(
          formData.taxesProrations
        ) -
        num(
          formData.hoaCosts
        ) -
        num(
          formData.repairPreservationCosts
        ) -
        num(
          formData.otherDeductions
        )
      );
    }, [formData]);

  const readinessItems = [
    formData.finalWalkthroughComplete,
    formData.clearToCloseConfirmed,
    formData.finalTitleClear,
    formData.settlementStatementReceived,
    formData.settlementStatementApproved,
    formData.sellerSigned,
    formData.buyerSigned,
    formData.closingCompleted,
    formData.fundsReceived,
    formData.deedExecuted,
    formData.deedRecorded,
    formData.clientClosingPackageComplete,
    formData.mlsClosed,
  ];

  const readinessCount =
    readinessItems.filter(
      Boolean
    ).length;

  const readinessPercent =
    Math.round(
      (
        readinessCount /
        readinessItems.length
      ) * 100
    );

  const hasException =
    formData.fundingIssue ||
    formData.titleIssue ||
    formData.recordingIssue ||
    formData.documentIssue ||
    formData.clientHold ||
    formData.legalReviewNeeded;

  async function handleSave() {
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const response =
        await fetch(
          `/api/reo/assets/${assetId}/closing`,
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify(
                formData
              ),
          }
        );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ||
            "Unable to save closing information."
        );
      }

      setSuccess(
        result.disposed
          ? "Closing completed. Asset moved to Disposed."
          : "Closing workspace saved successfully."
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save closing information."
      );
    } finally {
      setSaving(false);
    }
  }
if (loading) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#07111f] p-8 text-sm text-slate-400">
      Loading saved closing workspace...
    </div>
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

      <section className="rounded-2xl border border-green-500/20 bg-green-500/[0.04] p-6">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-green-400">
              Disposition Readiness
            </div>

            <div className="mt-2 text-3xl font-bold">
              {readinessPercent}%
            </div>

            <div className="mt-1 text-sm text-slate-500">
              {readinessCount} of{" "}
              {readinessItems.length} final milestones complete
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
        icon={Building2}
        title="Closing Summary"
        subtitle="Final transaction and closing information."
      >
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <Field
            label="Closing Date"
            type="date"
            value={
              formData.closingDate
            }
            onChange={(value) =>
              updateField(
                "closingDate",
                value
              )
            }
          />

          <Field
            label="Closing Time"
            type="time"
            value={
              formData.closingTime
            }
            onChange={(value) =>
              updateField(
                "closingTime",
                value
              )
            }
          />

          <Field
            label="Closing Location"
            value={
              formData.closingLocation
            }
            onChange={(value) =>
              updateField(
                "closingLocation",
                value
              )
            }
          />

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
            label="Buyer"
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
        icon={ShieldCheck}
        title="Final Closing Conditions"
        subtitle="Confirm all final contractual conditions are satisfied."
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Toggle
            label="Final Walkthrough Complete?"
            value={
              formData.finalWalkthroughComplete
            }
            onChange={(value) =>
              updateField(
                "finalWalkthroughComplete",
                value
              )
            }
          />

          <Toggle
            label="Clear to Close Confirmed?"
            value={
              formData.clearToCloseConfirmed
            }
            onChange={(value) =>
              updateField(
                "clearToCloseConfirmed",
                value
              )
            }
          />

          <Toggle
            label="Final Title Clear?"
            value={
              formData.finalTitleClear
            }
            onChange={(value) =>
              updateField(
                "finalTitleClear",
                value
              )
            }
          />

          <Toggle
            label="Settlement Statement Received?"
            value={
              formData.settlementStatementReceived
            }
            onChange={(value) =>
              updateField(
                "settlementStatementReceived",
                value
              )
            }
          />

          <Toggle
            label="Settlement Statement Approved?"
            value={
              formData.settlementStatementApproved
            }
            onChange={(value) =>
              updateField(
                "settlementStatementApproved",
                value
              )
            }
          />

          <Toggle
            label="Seller Signed?"
            value={
              formData.sellerSigned
            }
            onChange={(value) =>
              updateField(
                "sellerSigned",
                value
              )
            }
          />

          <Toggle
            label="Buyer Signed?"
            value={
              formData.buyerSigned
            }
            onChange={(value) =>
              updateField(
                "buyerSigned",
                value
              )
            }
          />

          <Toggle
            label="Closing Completed?"
            value={
              formData.closingCompleted
            }
            onChange={(value) =>
              updateField(
                "closingCompleted",
                value
              )
            }
          />
        </div>
      </Panel>

      <Panel
        icon={CircleDollarSign}
        title="Settlement & Financial Reconciliation"
        subtitle="Calculate final net proceeds to the institutional client."
      >
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          <MoneyField
            label="Gross Sale Price"
            value={
              formData.grossSalePrice
            }
            onChange={(value) =>
              updateField(
                "grossSalePrice",
                value
              )
            }
          />

          <MoneyField
            label="Seller Credits"
            value={
              formData.sellerCredits
            }
            onChange={(value) =>
              updateField(
                "sellerCredits",
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
            label="Attorney / Title Cost"
            value={
              formData.attorneyTitleCost
            }
            onChange={(value) =>
              updateField(
                "attorneyTitleCost",
                value
              )
            }
          />

          <MoneyField
            label="Taxes / Prorations"
            value={
              formData.taxesProrations
            }
            onChange={(value) =>
              updateField(
                "taxesProrations",
                value
              )
            }
          />

          <MoneyField
            label="HOA Costs"
            value={
              formData.hoaCosts
            }
            onChange={(value) =>
              updateField(
                "hoaCosts",
                value
              )
            }
          />

          <MoneyField
            label="Repair / Preservation Costs"
            value={
              formData.repairPreservationCosts
            }
            onChange={(value) =>
              updateField(
                "repairPreservationCosts",
                value
              )
            }
          />

          <MoneyField
            label="Other Deductions"
            value={
              formData.otherDeductions
            }
            onChange={(value) =>
              updateField(
                "otherDeductions",
                value
              )
            }
          />
        </div>

        <div className="mt-6 rounded-2xl border border-green-500/20 bg-green-500/[0.05] p-5">
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            Net Proceeds
          </div>

          <div className="mt-2 text-3xl font-bold text-green-400">
            {money(
              netProceeds
            )}
          </div>
        </div>
      </Panel>

      <Panel
        icon={Banknote}
        title="Funding & Recording"
        subtitle="Confirm funds, deed execution, and recording."
      >
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <Toggle
            label="Funds Received?"
            value={
              formData.fundsReceived
            }
            onChange={(value) =>
              updateField(
                "fundsReceived",
                value
              )
            }
          />

          <Field
            label="Funding Date"
            type="date"
            value={
              formData.fundingDate
            }
            onChange={(value) =>
              updateField(
                "fundingDate",
                value
              )
            }
          />

          <Field
            label="Funding Reference"
            value={
              formData.fundingReference
            }
            onChange={(value) =>
              updateField(
                "fundingReference",
                value
              )
            }
          />

          <Toggle
            label="Deed Executed?"
            value={
              formData.deedExecuted
            }
            onChange={(value) =>
              updateField(
                "deedExecuted",
                value
              )
            }
          />

          <Toggle
            label="Deed Recorded?"
            value={
              formData.deedRecorded
            }
            onChange={(value) =>
              updateField(
                "deedRecorded",
                value
              )
            }
          />

          <Field
            label="Recording Date"
            type="date"
            value={
              formData.recordingDate
            }
            onChange={(value) =>
              updateField(
                "recordingDate",
                value
              )
            }
          />

          <Field
            label="Book / Page"
            value={
              formData.recordingBookPage
            }
            onChange={(value) =>
              updateField(
                "recordingBookPage",
                value
              )
            }
          />

          <Field
            label="Instrument Number"
            value={
              formData.recordingInstrumentNumber
            }
            onChange={(value) =>
              updateField(
                "recordingInstrumentNumber",
                value
              )
            }
          />
        </div>
      </Panel>

      <Panel
        icon={FileCheck2}
        title="Closing Documents"
        subtitle="Track the final institutional closing package."
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Toggle
            label="Closing Disclosure / ALTA Received?"
            value={
              formData.closingDisclosureReceived
            }
            onChange={(value) =>
              updateField(
                "closingDisclosureReceived",
                value
              )
            }
          />

          <Toggle
            label="Deed Copy Received?"
            value={
              formData.deedCopyReceived
            }
            onChange={(value) =>
              updateField(
                "deedCopyReceived",
                value
              )
            }
          />

          <Toggle
            label="Wire Confirmation Received?"
            value={
              formData.wireConfirmationReceived
            }
            onChange={(value) =>
              updateField(
                "wireConfirmationReceived",
                value
              )
            }
          />

          <Toggle
            label="Final Invoice Package Complete?"
            value={
              formData.finalInvoicePackageComplete
            }
            onChange={(value) =>
              updateField(
                "finalInvoicePackageComplete",
                value
              )
            }
          />

          <Toggle
            label="Client Closing Package Complete?"
            value={
              formData.clientClosingPackageComplete
            }
            onChange={(value) =>
              updateField(
                "clientClosingPackageComplete",
                value
              )
            }
          />
        </div>
      </Panel>

      <Panel
        icon={Truck}
        title="Property & MLS Closeout"
        subtitle="Complete physical and marketing closeout."
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Toggle
            label="Utilities Transferred?"
            value={
              formData.utilitiesTransferred
            }
            onChange={(value) =>
              updateField(
                "utilitiesTransferred",
                value
              )
            }
          />

          <Toggle
            label="Keys Released?"
            value={
              formData.keysReleased
            }
            onChange={(value) =>
              updateField(
                "keysReleased",
                value
              )
            }
          />

          <Toggle
            label="Lockbox Removed?"
            value={
              formData.lockboxRemoved
            }
            onChange={(value) =>
              updateField(
                "lockboxRemoved",
                value
              )
            }
          />

          <Toggle
            label="Signage Removed?"
            value={
              formData.signageRemoved
            }
            onChange={(value) =>
              updateField(
                "signageRemoved",
                value
              )
            }
          />

          <Toggle
            label="MLS Closed / Sold?"
            value={
              formData.mlsClosed
            }
            onChange={(value) =>
              updateField(
                "mlsClosed",
                value
              )
            }
          />

          <Toggle
            label="Vendors Notified?"
            value={
              formData.vendorsNotified
            }
            onChange={(value) =>
              updateField(
                "vendorsNotified",
                value
              )
            }
          />
        </div>
      </Panel>

      <Panel
        icon={AlertTriangle}
        title="Exceptions & Escalations"
        subtitle="Identify anything preventing final disposition."
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Toggle
            label="Funding Issue?"
            value={
              formData.fundingIssue
            }
            onChange={(value) =>
              updateField(
                "fundingIssue",
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
            label="Recording Issue?"
            value={
              formData.recordingIssue
            }
            onChange={(value) =>
              updateField(
                "recordingIssue",
                value
              )
            }
          />

          <Toggle
            label="Document Issue?"
            value={
              formData.documentIssue
            }
            onChange={(value) =>
              updateField(
                "documentIssue",
                value
              )
            }
          />

          <Toggle
            label="Client Hold?"
            value={
              formData.clientHold
            }
            onChange={(value) =>
              updateField(
                "clientHold",
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

        {hasException && (
          <div className="mt-5 rounded-xl border border-red-500/25 bg-red-500/10 p-4 text-sm text-red-300">
            Disposition is blocked while a critical exception remains active.
          </div>
        )}

        <div className="mt-5 space-y-5">
          <TextArea
            label="Closing Notes"
            value={
              formData.closingNotes
            }
            onChange={(value) =>
              updateField(
                "closingNotes",
                value
              )
            }
          />

          <TextArea
            label="Disposition Notes"
            value={
              formData.dispositionNotes
            }
            onChange={(value) =>
              updateField(
                "dispositionNotes",
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
              Final Disposition Approval
            </h3>

            <p className="mt-1 max-w-2xl text-sm text-slate-500">
              When all required closing milestones are complete and no material exceptions remain, Carolina REO can close the file and dispose the asset.
            </p>
          </div>

          <div className="text-right">
            <div className="text-2xl font-bold text-green-400">
              {readinessPercent}%
            </div>

            <div className="text-xs text-slate-500">
              disposition ready
            </div>
          </div>
        </div>
      </section>

      <div className="flex justify-end rounded-2xl border border-white/10 bg-[#07111f] p-5">
        <button
          type="button"
          onClick={
            handleSave
          }
          disabled={
            saving
          }
          className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-6 py-3 text-sm font-semibold transition hover:bg-green-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Save className="h-4 w-4" />

          {saving
            ? "Saving..."
            : readinessPercent === 100 &&
              !hasException
            ? "Complete Closing & Dispose Asset"
            : "Save Closing Workspace"}
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
  onChange: (
    value: boolean
  ) => void;
}) {
  return (
    <div className="flex min-h-[70px] items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.025] px-4 py-3">
      <span className="text-sm text-slate-300">
        {label}
      </span>

      <button
        type="button"
        onClick={() =>
          onChange(
            !value
          )
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
