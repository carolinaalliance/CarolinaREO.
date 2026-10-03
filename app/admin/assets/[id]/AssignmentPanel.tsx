"use client";

import {
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  Landmark,
  MapPin,
  UserRound,
  XCircle,
} from "lucide-react";

type AssignmentPanelProps = {
  assetId: string;

  propertyAddress?: string | null;
  city?: string | null;
  state?: string | null;
  postalCode?: string | null;

  assetNumber?: string | null;
  clientAssetNumber?: string | null;
  loanNumber?: string | null;

  clientName?: string | null;
  assetManagerName?: string | null;
  assetManagerEmail?: string | null;
  assetManagerPhone?: string | null;

  assignmentDate?: string | null;
  assignmentStatus?: string | null;
  assignmentSentAt?: string | null;
  assignmentAcceptedAt?: string | null;
  assignmentDeclinedAt?: string | null;
  assignmentDeclineReason?: string | null;
  assignmentInstructions?: string | null;
};

function formatDateTime(value?: string | null) {
  if (!value) return "—";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function statusLabel(value?: string | null) {
  switch (value) {
    case "pending_acceptance":
      return "Awaiting Acceptance";

    case "accepted":
      return "Accepted";

    case "declined":
      return "Declined";

    case "reassigned":
      return "Reassigned";

    default:
      return "Unassigned";
  }
}

export default function AssignmentPanel({
  propertyAddress,
  city,
  state,
  postalCode,
  assetNumber,
  clientAssetNumber,
  loanNumber,
  clientName,
  assetManagerName,
  assetManagerEmail,
  assetManagerPhone,
  assignmentDate,
  assignmentStatus,
  assignmentSentAt,
  assignmentAcceptedAt,
  assignmentDeclinedAt,
  assignmentDeclineReason,
  assignmentInstructions,
}: AssignmentPanelProps) {
  const status = assignmentStatus || "unassigned";

  return (
    <div className="space-y-6">
      {/* ASSIGNMENT HEADER */}
      <div className="reo-card rounded-2xl">
        <div className="flex flex-col justify-between gap-5 border-b border-white/10 px-6 py-6 md:flex-row md:items-center">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-500/10">
              <ClipboardCheck className="h-5 w-5 text-green-400" />
            </div>

            <div>
              <h2 className="text-xl font-semibold">
                Property Assignment
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Assignment instructions and agent acceptance
              </p>
            </div>
          </div>

          <div
            className={`rounded-full border px-4 py-2 text-sm font-semibold ${
              status === "accepted"
                ? "border-green-500/30 bg-green-500/10 text-green-400"
                : status === "declined"
                ? "border-red-500/30 bg-red-500/10 text-red-300"
                : status === "pending_acceptance"
                ? "border-amber-500/30 bg-amber-500/10 text-amber-300"
                : "border-white/10 bg-white/[0.03] text-slate-400"
            }`}
          >
            {statusLabel(status)}
          </div>
        </div>

        {/* PROPERTY */}
        <div className="grid gap-6 p-6 md:grid-cols-2 xl:grid-cols-4">
          <AssignmentDetail
            label="Property"
            value={propertyAddress}
            icon={MapPin}
          />

          <AssignmentDetail
            label="Location"
            value={[city, state, postalCode]
              .filter(Boolean)
              .join(", ")}
            icon={MapPin}
          />

          <AssignmentDetail
            label="REO Asset #"
            value={assetNumber}
            icon={ClipboardCheck}
          />

          <AssignmentDetail
            label="Client Asset #"
            value={clientAssetNumber}
            icon={Landmark}
          />

          <AssignmentDetail
            label="Loan #"
            value={loanNumber}
            icon={Landmark}
          />

          <AssignmentDetail
            label="Client"
            value={clientName}
            icon={Landmark}
          />

          <AssignmentDetail
            label="Assignment Date"
            value={assignmentDate || "—"}
            icon={Clock3}
          />

          <AssignmentDetail
            label="Status"
            value={statusLabel(status)}
            icon={CheckCircle2}
          />
        </div>
      </div>

      {/* ASSET MANAGER */}
      <div className="reo-card rounded-2xl">
        <div className="border-b border-white/10 px-6 py-5">
          <div className="flex items-center gap-3">
            <UserRound className="h-5 w-5 text-green-400" />

            <div>
              <h3 className="font-semibold">
                Asset Management Contact
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                Client representative responsible for this assignment
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 p-6 md:grid-cols-3">
          <SimpleDetail
            label="Asset Manager"
            value={assetManagerName}
          />

          <SimpleDetail
            label="Email"
            value={assetManagerEmail}
          />

          <SimpleDetail
            label="Phone"
            value={assetManagerPhone}
          />
        </div>
      </div>

      {/* INSTRUCTIONS */}
      <div className="reo-card rounded-2xl">
        <div className="border-b border-white/10 px-6 py-5">
          <h3 className="font-semibold">
            Property Assignment Instructions
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            Review all instructions before accepting the assignment.
          </p>
        </div>

        <div className="p-6">
          {assignmentInstructions ? (
            <div className="whitespace-pre-wrap text-sm leading-7 text-slate-300">
              {assignmentInstructions}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.02] p-6 text-sm text-slate-500">
              No property-specific assignment instructions have
              been entered.
            </div>
          )}
        </div>
      </div>

      {/* ASSIGNMENT HISTORY */}
      <div className="reo-card rounded-2xl">
        <div className="border-b border-white/10 px-6 py-5">
          <h3 className="font-semibold">
            Assignment Status
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            Delivery and response history for this assignment
          </p>
        </div>

        <div className="grid gap-6 p-6 md:grid-cols-3">
          <SimpleDetail
            label="Assignment Sent"
            value={formatDateTime(assignmentSentAt)}
          />

          <SimpleDetail
            label="Accepted"
            value={formatDateTime(assignmentAcceptedAt)}
          />

          <SimpleDetail
            label="Declined"
            value={formatDateTime(assignmentDeclinedAt)}
          />
        </div>

        {status === "declined" &&
          assignmentDeclineReason && (
            <div className="border-t border-white/10 px-6 py-5">
              <div className="text-xs font-semibold uppercase tracking-[0.14em] text-red-400">
                Decline Reason
              </div>

              <div className="mt-2 text-sm leading-6 text-slate-300">
                {assignmentDeclineReason}
              </div>
            </div>
          )}
      </div>

      {/* ACCEPTANCE AREA */}
      {status === "pending_acceptance" && (
        <div className="rounded-2xl border border-amber-500/25 bg-amber-500/[0.04] p-6">
          <div className="flex items-start gap-4">
            <Clock3 className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />

            <div>
              <h3 className="font-semibold text-white">
                Agent Response Required
              </h3>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
                Review the property information and assignment
                instructions above. The assigned broker or agent
                must accept or decline this property assignment
                before beginning assigned property services.
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  disabled
                  className="inline-flex cursor-not-allowed items-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white opacity-60"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Accept Property Assignment
                </button>

                <button
                  type="button"
                  disabled
                  className="inline-flex cursor-not-allowed items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-3 text-sm font-semibold text-red-300 opacity-60"
                >
                  <XCircle className="h-4 w-4" />
                  Decline Assignment
                </button>
              </div>

              <p className="mt-3 text-xs text-slate-600">
                Acceptance controls will be activated after the
                assignment actions are connected.
              </p>
            </div>
          </div>
        </div>
      )}

      {status === "accepted" && (
        <div className="rounded-2xl border border-green-500/25 bg-green-500/[0.04] p-6">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-400" />

            <div>
              <div className="font-semibold text-green-300">
                Property Assignment Accepted
              </div>

              <div className="mt-1 text-sm text-slate-500">
                Accepted {formatDateTime(assignmentAcceptedAt)}
              </div>
            </div>
          </div>
        </div>
      )}

      {status === "declined" && (
        <div className="rounded-2xl border border-red-500/25 bg-red-500/[0.04] p-6">
          <div className="flex items-center gap-3">
            <XCircle className="h-5 w-5 text-red-300" />

            <div>
              <div className="font-semibold text-red-300">
                Property Assignment Declined
              </div>

              <div className="mt-1 text-sm text-slate-500">
                Declined {formatDateTime(assignmentDeclinedAt)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SimpleDetail({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-600">
        {label}
      </div>

      <div className="mt-1.5 break-words text-sm font-medium text-slate-200">
        {value || "—"}
      </div>
    </div>
  );
}

function AssignmentDetail({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value?: string | null;
  icon: typeof MapPin;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.025] p-4">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-600">
        <Icon className="h-4 w-4" />
        {label}
      </div>

      <div className="mt-3 break-words text-sm font-semibold text-slate-200">
        {value || "—"}
      </div>
    </div>
  );
}
