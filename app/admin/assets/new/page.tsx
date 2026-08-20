"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  Building2,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  Home,
  Landmark,
  MapPin,
  Save,
  ShieldCheck,
  Upload,
  UserRound,
  Wrench,
} from "lucide-react";

type SectionKey =
  | "client"
  | "asset"
  | "foreclosure"
  | "occupancy"
  | "access"
  | "utilities"
  | "hoa"
  | "valuation"
  | "preservation"
  | "listing"
  | "sla"
  | "contacts"
  | "documents";

const sections: {
  key: SectionKey;
  label: string;
  icon: typeof Building2;
}[] = [
  { key: "client", label: "Client & Assignment", icon: Landmark },
  { key: "asset", label: "Property Details", icon: Home },
  { key: "foreclosure", label: "Foreclosure & Title", icon: FileText },
  { key: "occupancy", label: "Occupancy", icon: UserRound },
  { key: "access", label: "Access & Securing", icon: ShieldCheck },
  { key: "utilities", label: "Utilities", icon: Wrench },
  { key: "hoa", label: "HOA / Association", icon: Building2 },
  { key: "valuation", label: "Valuation", icon: ClipboardCheck },
  { key: "preservation", label: "Preservation", icon: Wrench },
  { key: "listing", label: "Listing Instructions", icon: MapPin },
  { key: "sla", label: "SLA Requirements", icon: CalendarDays },
  { key: "contacts", label: "Contacts", icon: UserRound },
  { key: "documents", label: "Documents", icon: Upload },
];

const fieldClass =
  "mt-2 w-full rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-green-500";

const labelClass = "text-sm font-medium text-slate-300";

export default function NewAssignmentPage() {
  const [activeSection, setActiveSection] =
    useState<SectionKey>("client");

  const [formData, setFormData] = useState({
    institutionName: "",
    institutionType: "",
    clientAssetNumber: "",
    loanNumber: "",
    assignmentDate: "",
    priority: "Standard",
    address: "",
    city: "",
    state: "SC",
    zip: "",
    county: "",
    propertyType: "",
    bedrooms: "",
    bathrooms: "",
    squareFeet: "",
    acreage: "",
    yearBuilt: "",
    foreclosureSaleDate: "",
    redemptionExpirationDate: "",
    deedRecorded: "",
    titleCompany: "",
    attorney: "",
    occupancyStatus: "Unknown",
    occupantName: "",
    occupantPhone: "",
    cashForKeysAuthorized: "No",
    lockboxCode: "",
    keyLocation: "",
    rekeyRequired: "Yes",
    propertySecured: "No",
    electricStatus: "Unknown",
    waterStatus: "Unknown",
    gasStatus: "Unknown",
    hoaName: "",
    hoaContact: "",
    hoaPhone: "",
    hoaBalanceKnown: "No",
    bpoRequired: "Yes",
    appraisalRequired: "No",
    valuationDueDate: "",
    preservationRequired: "Yes",
    initialServiceLimit: "",
    repairLimit: "",
    listingRequired: "Yes",
    initialListPrice: "",
    listDateTarget: "",
    commissionInstructions: "",
    inspectionDueHours: "24",
    occupancyDueHours: "24",
    bpoDueHours: "48",
    offerResponseHours: "24",
    assetManagerName: "",
    assetManagerEmail: "",
    assetManagerPhone: "",
    attorneyContact: "",
    titleContact: "",
    notes: "",
  });

  function updateField(name: string, value: string) {
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    console.log("New Carolina REO Assignment:", formData);

    alert(
      "Assignment intake form is ready. Next we will connect this button to Supabase."
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-white/10 bg-slate-950/95">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-slate-400 transition hover:bg-white/[0.07] hover:text-white"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>

            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.2em] text-green-400">
                Carolina REO
              </div>

              <h1 className="mt-1 text-2xl font-bold">
                New Assignment Intake
              </h1>
            </div>
          </div>

          <div className="hidden items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-4 py-2 text-sm text-green-400 md:flex">
            <CheckCircle2 className="h-4 w-4" />
            Institutional Intake Workflow
          </div>
        </div>
      </header>

      <form onSubmit={handleSubmit}>
        <div className="mx-auto grid max-w-[1600px] gap-6 px-6 py-8 xl:grid-cols-[280px_1fr]">
          {/* LEFT NAV */}
          <aside>
            <div className="sticky top-6 rounded-2xl border border-white/10 bg-[#07111f] p-3">
              <div className="px-3 pb-3 pt-2">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Assignment Sections
                </p>
              </div>

              <div className="space-y-1">
                {sections.map((section) => {
                  const Icon = section.icon;

                  return (
                    <button
                      key={section.key}
                      type="button"
                      onClick={() => setActiveSection(section.key)}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition ${
                        activeSection === section.key
                          ? "bg-green-600 text-white"
                          : "text-slate-400 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      {section.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* MAIN FORM */}
          <section>
            <div className="mb-6 rounded-2xl border border-green-500/20 bg-gradient-to-r from-green-600/10 to-transparent p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-500/10">
                  <ClipboardCheck className="h-6 w-6 text-green-400" />
                </div>

                <div>
                  <h2 className="text-xl font-semibold">
                    Institutional Asset Assignment
                  </h2>

                  <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
                    Enter all known assignment information. Missing items can be
                    completed later from the Asset Workspace after the asset is
                    created.
                  </p>
                </div>
              </div>
            </div>

            {activeSection === "client" && (
              <FormCard
                title="Client & Assignment"
                subtitle="Institution, portfolio, assignment identifiers, and priority."
              >
                <div className="grid gap-5 md:grid-cols-2">
                  <Field
                    label="Institution Name"
                    value={formData.institutionName}
                    onChange={(value) =>
                      updateField("institutionName", value)
                    }
                    placeholder="Example: First Carolina Community Bank"
                  />

                  <SelectField
                    label="Institution Type"
                    value={formData.institutionType}
                    onChange={(value) =>
                      updateField("institutionType", value)
                    }
                    options={[
                      "",
                      "Community Bank",
                      "Regional Bank",
                      "Credit Union",
                      "Mortgage Servicer",
                      "Private Lender",
                      "Institutional Investor",
                      "Law Firm / Receiver",
                      "Government Entity",
                      "Other",
                    ]}
                  />

                  <Field
                    label="Client Asset Number"
                    value={formData.clientAssetNumber}
                    onChange={(value) =>
                      updateField("clientAssetNumber", value)
                    }
                    placeholder="Client's internal asset ID"
                  />

                  <Field
                    label="Loan Number"
                    value={formData.loanNumber}
                    onChange={(value) =>
                      updateField("loanNumber", value)
                    }
                    placeholder="Loan or servicing number"
                  />

                  <Field
                    label="Assignment Date"
                    type="date"
                    value={formData.assignmentDate}
                    onChange={(value) =>
                      updateField("assignmentDate", value)
                    }
                  />

                  <SelectField
                    label="Priority"
                    value={formData.priority}
                    onChange={(value) =>
                      updateField("priority", value)
                    }
                    options={[
                      "Standard",
                      "High",
                      "Urgent",
                      "Emergency",
                    ]}
                  />
                </div>
              </FormCard>
            )}

            {activeSection === "asset" && (
              <FormCard
                title="Property Details"
                subtitle="Core property and location information."
              >
                <div className="grid gap-5 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <Field
                      label="Property Address"
                      value={formData.address}
                      onChange={(value) =>
                        updateField("address", value)
                      }
                      placeholder="Street address"
                    />
                  </div>

                  <Field
                    label="City"
                    value={formData.city}
                    onChange={(value) => updateField("city", value)}
                  />

                  <Field
                    label="State"
                    value={formData.state}
                    onChange={(value) => updateField("state", value)}
                  />

                  <Field
                    label="ZIP Code"
                    value={formData.zip}
                    onChange={(value) => updateField("zip", value)}
                  />

                  <Field
                    label="County"
                    value={formData.county}
                    onChange={(value) => updateField("county", value)}
                  />

                  <SelectField
                    label="Property Type"
                    value={formData.propertyType}
                    onChange={(value) =>
                      updateField("propertyType", value)
                    }
                    options={[
                      "",
                      "Single Family",
                      "Condominium",
                      "Townhome",
                      "Duplex",
                      "Multi-Family",
                      "Manufactured Home",
                      "Vacant Land",
                      "Commercial",
                      "Other",
                    ]}
                  />

                  <Field
                    label="Year Built"
                    value={formData.yearBuilt}
                    onChange={(value) =>
                      updateField("yearBuilt", value)
                    }
                  />

                  <Field
                    label="Bedrooms"
                    value={formData.bedrooms}
                    onChange={(value) =>
                      updateField("bedrooms", value)
                    }
                  />

                  <Field
                    label="Bathrooms"
                    value={formData.bathrooms}
                    onChange={(value) =>
                      updateField("bathrooms", value)
                    }
                  />

                  <Field
                    label="Square Feet"
                    value={formData.squareFeet}
                    onChange={(value) =>
                      updateField("squareFeet", value)
                    }
                  />

                  <Field
                    label="Acreage"
                    value={formData.acreage}
                    onChange={(value) =>
                      updateField("acreage", value)
                    }
                  />
                </div>
              </FormCard>
            )}

            {activeSection === "foreclosure" && (
              <FormCard
                title="Foreclosure & Title"
                subtitle="Legal status, sale dates, deed status, title contacts, and attorney information."
              >
                <div className="grid gap-5 md:grid-cols-2">
                  <Field
                    label="Foreclosure Sale Date"
                    type="date"
                    value={formData.foreclosureSaleDate}
                    onChange={(value) =>
                      updateField("foreclosureSaleDate", value)
                    }
                  />

                  <Field
                    label="Redemption Expiration Date"
                    type="date"
                    value={formData.redemptionExpirationDate}
                    onChange={(value) =>
                      updateField("redemptionExpirationDate", value)
                    }
                  />

                  <SelectField
                    label="Deed Recorded?"
                    value={formData.deedRecorded}
                    onChange={(value) =>
                      updateField("deedRecorded", value)
                    }
                    options={["", "Yes", "No", "Pending", "Unknown"]}
                  />

                  <Field
                    label="Title Company"
                    value={formData.titleCompany}
                    onChange={(value) =>
                      updateField("titleCompany", value)
                    }
                  />

                  <div className="md:col-span-2">
                    <Field
                      label="Attorney / Foreclosure Counsel"
                      value={formData.attorney}
                      onChange={(value) =>
                        updateField("attorney", value)
                      }
                    />
                  </div>
                </div>
              </FormCard>
            )}

            {activeSection === "occupancy" && (
              <FormCard
                title="Occupancy"
                subtitle="Current occupancy, occupant information, and relocation authority."
              >
                <div className="grid gap-5 md:grid-cols-2">
                  <SelectField
                    label="Occupancy Status"
                    value={formData.occupancyStatus}
                    onChange={(value) =>
                      updateField("occupancyStatus", value)
                    }
                    options={[
                      "Unknown",
                      "Vacant",
                      "Owner Occupied",
                      "Tenant Occupied",
                      "Occupied - Unknown",
                      "Partially Occupied",
                    ]}
                  />

                  <SelectField
                    label="Cash for Keys Authorized?"
                    value={formData.cashForKeysAuthorized}
                    onChange={(value) =>
                      updateField("cashForKeysAuthorized", value)
                    }
                    options={["No", "Yes", "Pending Approval"]}
                  />

                  <Field
                    label="Occupant Name"
                    value={formData.occupantName}
                    onChange={(value) =>
                      updateField("occupantName", value)
                    }
                  />

                  <Field
                    label="Occupant Phone"
                    value={formData.occupantPhone}
                    onChange={(value) =>
                      updateField("occupantPhone", value)
                    }
                  />
                </div>
              </FormCard>
            )}

            {activeSection === "access" && (
              <FormCard
                title="Access & Securing"
                subtitle="Property entry, lockbox, rekey, and securing requirements."
              >
                <div className="grid gap-5 md:grid-cols-2">
                  <Field
                    label="Lockbox Code"
                    value={formData.lockboxCode}
                    onChange={(value) =>
                      updateField("lockboxCode", value)
                    }
                  />

                  <Field
                    label="Key Location / Access Notes"
                    value={formData.keyLocation}
                    onChange={(value) =>
                      updateField("keyLocation", value)
                    }
                  />

                  <SelectField
                    label="Rekey Required?"
                    value={formData.rekeyRequired}
                    onChange={(value) =>
                      updateField("rekeyRequired", value)
                    }
                    options={["Yes", "No", "Unknown"]}
                  />

                  <SelectField
                    label="Property Secured?"
                    value={formData.propertySecured}
                    onChange={(value) =>
                      updateField("propertySecured", value)
                    }
                    options={["No", "Yes", "Partial", "Unknown"]}
                  />
                </div>
              </FormCard>
            )}

            {activeSection === "utilities" && (
              <FormCard
                title="Utilities"
                subtitle="Known utility status and activation requirements."
              >
                <div className="grid gap-5 md:grid-cols-3">
                  <SelectField
                    label="Electric"
                    value={formData.electricStatus}
                    onChange={(value) =>
                      updateField("electricStatus", value)
                    }
                    options={[
                      "Unknown",
                      "On",
                      "Off",
                      "Needs Activation",
                      "Not Available",
                    ]}
                  />

                  <SelectField
                    label="Water"
                    value={formData.waterStatus}
                    onChange={(value) =>
                      updateField("waterStatus", value)
                    }
                    options={[
                      "Unknown",
                      "On",
                      "Off",
                      "Needs Activation",
                      "Not Available",
                    ]}
                  />

                  <SelectField
                    label="Gas"
                    value={formData.gasStatus}
                    onChange={(value) =>
                      updateField("gasStatus", value)
                    }
                    options={[
                      "Unknown",
                      "On",
                      "Off",
                      "Needs Activation",
                      "Not Available",
                    ]}
                  />
                </div>
              </FormCard>
            )}

            {activeSection === "hoa" && (
              <FormCard
                title="HOA / Association"
                subtitle="Association contacts, known balances, and property obligations."
              >
                <div className="grid gap-5 md:grid-cols-2">
                  <Field
                    label="HOA / Association Name"
                    value={formData.hoaName}
                    onChange={(value) =>
                      updateField("hoaName", value)
                    }
                  />

                  <SelectField
                    label="Known Outstanding Balance?"
                    value={formData.hoaBalanceKnown}
                    onChange={(value) =>
                      updateField("hoaBalanceKnown", value)
                    }
                    options={["No", "Yes", "Unknown"]}
                  />

                  <Field
                    label="HOA Contact"
                    value={formData.hoaContact}
                    onChange={(value) =>
                      updateField("hoaContact", value)
                    }
                  />

                  <Field
                    label="HOA Phone"
                    value={formData.hoaPhone}
                    onChange={(value) =>
                      updateField("hoaPhone", value)
                    }
                  />
                </div>
              </FormCard>
            )}

            {activeSection === "valuation" && (
              <FormCard
                title="Valuation Requirements"
                subtitle="BPO, appraisal, due dates, and pricing expectations."
              >
                <div className="grid gap-5 md:grid-cols-2">
                  <SelectField
                    label="BPO Required?"
                    value={formData.bpoRequired}
                    onChange={(value) =>
                      updateField("bpoRequired", value)
                    }
                    options={["Yes", "No"]}
                  />

                  <SelectField
                    label="Appraisal Required?"
                    value={formData.appraisalRequired}
                    onChange={(value) =>
                      updateField("appraisalRequired", value)
                    }
                    options={["No", "Yes"]}
                  />

                  <Field
                    label="Valuation Due Date"
                    type="date"
                    value={formData.valuationDueDate}
                    onChange={(value) =>
                      updateField("valuationDueDate", value)
                    }
                  />
                </div>
              </FormCard>
            )}

            {activeSection === "preservation" && (
              <FormCard
                title="Preservation & Repair Authority"
                subtitle="Initial services, preservation limits, and repair authority."
              >
                <div className="grid gap-5 md:grid-cols-2">
                  <SelectField
                    label="Preservation Required?"
                    value={formData.preservationRequired}
                    onChange={(value) =>
                      updateField("preservationRequired", value)
                    }
                    options={["Yes", "No", "Unknown"]}
                  />

                  <Field
                    label="Initial Service Authorization Limit"
                    value={formData.initialServiceLimit}
                    onChange={(value) =>
                      updateField("initialServiceLimit", value)
                    }
                    placeholder="$"
                  />

                  <Field
                    label="Repair Authorization Limit"
                    value={formData.repairLimit}
                    onChange={(value) =>
                      updateField("repairLimit", value)
                    }
                    placeholder="$"
                  />
                </div>
              </FormCard>
            )}

            {activeSection === "listing" && (
              <FormCard
                title="Listing Instructions"
                subtitle="Marketing authorization, pricing, and listing requirements."
              >
                <div className="grid gap-5 md:grid-cols-2">
                  <SelectField
                    label="Listing Required?"
                    value={formData.listingRequired}
                    onChange={(value) =>
                      updateField("listingRequired", value)
                    }
                    options={["Yes", "No", "Pending"]}
                  />

                  <Field
                    label="Initial List Price"
                    value={formData.initialListPrice}
                    onChange={(value) =>
                      updateField("initialListPrice", value)
                    }
                    placeholder="$"
                  />

                  <Field
                    label="Target List Date"
                    type="date"
                    value={formData.listDateTarget}
                    onChange={(value) =>
                      updateField("listDateTarget", value)
                    }
                  />

                  <Field
                    label="Commission Instructions"
                    value={formData.commissionInstructions}
                    onChange={(value) =>
                      updateField("commissionInstructions", value)
                    }
                  />
                </div>
              </FormCard>
            )}

            {activeSection === "sla" && (
              <FormCard
                title="Client SLA Requirements"
                subtitle="Institution-specific performance deadlines and response expectations."
              >
                <div className="grid gap-5 md:grid-cols-2">
                  <Field
                    label="Occupancy Verification Due Within"
                    value={formData.occupancyDueHours}
                    onChange={(value) =>
                      updateField("occupancyDueHours", value)
                    }
                    suffix="hours"
                  />

                  <Field
                    label="Initial Inspection Due Within"
                    value={formData.inspectionDueHours}
                    onChange={(value) =>
                      updateField("inspectionDueHours", value)
                    }
                    suffix="hours"
                  />

                  <Field
                    label="BPO Due Within"
                    value={formData.bpoDueHours}
                    onChange={(value) =>
                      updateField("bpoDueHours", value)
                    }
                    suffix="hours"
                  />

                  <Field
                    label="Offer Response Target"
                    value={formData.offerResponseHours}
                    onChange={(value) =>
                      updateField("offerResponseHours", value)
                    }
                    suffix="hours"
                  />
                </div>
              </FormCard>
            )}

            {activeSection === "contacts" && (
              <FormCard
                title="Assignment Contacts"
                subtitle="Asset manager, legal, title, and other institutional contacts."
              >
                <div className="grid gap-5 md:grid-cols-2">
                  <Field
                    label="Asset Manager Name"
                    value={formData.assetManagerName}
                    onChange={(value) =>
                      updateField("assetManagerName", value)
                    }
                  />

                  <Field
                    label="Asset Manager Email"
                    type="email"
                    value={formData.assetManagerEmail}
                    onChange={(value) =>
                      updateField("assetManagerEmail", value)
                    }
                  />

                  <Field
                    label="Asset Manager Phone"
                    value={formData.assetManagerPhone}
                    onChange={(value) =>
                      updateField("assetManagerPhone", value)
                    }
                  />

                  <Field
                    label="Attorney Contact"
                    value={formData.attorneyContact}
                    onChange={(value) =>
                      updateField("attorneyContact", value)
                    }
                  />

                  <div className="md:col-span-2">
                    <Field
                      label="Title / Closing Contact"
                      value={formData.titleContact}
                      onChange={(value) =>
                        updateField("titleContact", value)
                      }
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className={labelClass}>
                      Assignment Notes
                    </label>

                    <textarea
                      value={formData.notes}
                      onChange={(e) =>
                        updateField("notes", e.target.value)
                      }
                      rows={6}
                      className={fieldClass}
                      placeholder="Client instructions, special circumstances, known issues, portfolio notes..."
                    />
                  </div>
                </div>
              </FormCard>
            )}

            {activeSection === "documents" && (
              <FormCard
                title="Assignment Documents"
                subtitle="Initial file package and supporting documents."
              >
                <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-10 text-center">
                  <Upload className="mx-auto h-10 w-10 text-green-400" />

                  <h3 className="mt-4 font-semibold">
                    Upload Assignment Package
                  </h3>

                  <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500">
                    Assignment letters, foreclosure documents, deeds, title
                    records, prior inspections, appraisals, photographs, HOA
                    records, and other supporting documents will be stored with
                    the asset.
                  </p>

                  <button
                    type="button"
                    className="mt-6 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-slate-300"
                  >
                    Document Upload Coming Next
                  </button>
                </div>
              </FormCard>
            )}

            <div className="mt-6 flex flex-col-reverse justify-between gap-4 rounded-2xl border border-white/10 bg-[#07111f] p-5 sm:flex-row sm:items-center">
              <Link
                href="/admin"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-5 py-3 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                Cancel
              </Link>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/[0.08]"
                >
                  <Save className="h-4 w-4" />
                  Save Draft
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-3 text-sm font-semibold transition hover:bg-green-500"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Create Assignment
                </button>
              </div>
            </div>
          </section>
        </div>
      </form>
    </main>
  );
}

function FormCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#07111f]">
      <div className="border-b border-white/10 px-6 py-5">
        <h2 className="text-xl font-semibold">{title}</h2>

        <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
      </div>

      <div className="p-6">{children}</div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  suffix,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  suffix?: string;
}) {
  return (
    <div>
      <label className={labelClass}>{label}</label>

      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`${fieldClass} ${suffix ? "pr-16" : ""}`}
        />

        {suffix && (
          <span className="absolute right-4 top-[22px] text-xs text-slate-500">
            {suffix}
          </span>
        )}
      </div>
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
      <label className={labelClass}>{label}</label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={fieldClass}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option || "Select..."}
          </option>
        ))}
      </select>
    </div>
  );
}
