"use client";

import { useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  KeyRound,
  LockKeyhole,
  ShieldCheck,
  Snowflake,
  Wrench,
} from "lucide-react";

type SecuringPanelProps = {
  assetId: string;
  currentPropertySecured?: string | boolean | null;
  currentRekeyRequired?: string | boolean | null;
  currentLockboxCode?: string | null;
  currentKeyLocation?: string | null;
};

export default function SecuringPanel({
  assetId,
  currentPropertySecured,
  currentRekeyRequired,
  currentLockboxCode,
  currentKeyLocation,
}: SecuringPanelProps) {
  const [propertySecured, setPropertySecured] = useState(
    currentPropertySecured === true ||
      currentPropertySecured === "Yes"
  );

  const [rekeyCompleted, setRekeyCompleted] = useState(false);
  const [lockboxInstalled, setLockboxInstalled] = useState(
    Boolean(currentLockboxCode)
  );
  const [lockboxCode, setLockboxCode] = useState(
    currentLockboxCode || ""
  );
  const [keyLocation, setKeyLocation] = useState(
    currentKeyLocation || ""
  );

  const [doorsSecured, setDoorsSecured] = useState(false);
  const [windowsSecured, setWindowsSecured] = useState(false);
  const [garageSecured, setGarageSecured] = useState(false);
  const [outbuildingsSecured, setOutbuildingsSecured] =
    useState(false);

  const [winterizationRequired, setWinterizationRequired] =
    useState(false);
  const [winterizationCompleted, setWinterizationCompleted] =
    useState(false);

  const [vendorName, setVendorName] = useState("");
  const [serviceDate, setServiceDate] = useState("");
  const [serviceCost, setServiceCost] = useState("");

  const [damageObserved, setDamageObserved] = useState(false);
  const [emergencyCondition, setEmergencyCondition] =
    useState(false);

  const [securingNotes, setSecuringNotes] = useState("");
  const [saving, setSaving] = useState(false);

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
      <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.025] p-4">
        <span className="text-sm text-slate-300">{label}</span>

        <button
          type="button"
          onClick={() => onChange(!value)}
          className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
            value
              ? "bg-green-500 text-white"
              : "bg-slate-800 text-slate-400"
          }`}
        >
          {value ? "Yes" : "No"}
        </button>
      </div>
    );
  }

  function Section({
    icon: Icon,
    title,
    subtitle,
    children,
  }: {
    icon: typeof KeyRound;
    title: string;
    subtitle: string;
    children: React.ReactNode;
  }) {
    return (
      <div className="reo-card rounded-2xl">
        <div className="flex items-center gap-4 border-b border-white/10 px-6 py-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10">
            <Icon className="h-5 w-5 text-green-400" />
          </div>

          <div>
            <h2 className="font-semibold">{title}</h2>
            <p className="mt-0.5 text-xs text-slate-500">
              {subtitle}
            </p>
          </div>
        </div>

        <div className="p-6">{children}</div>
      </div>
    );
  }

  async function handleComplete() {
    setSaving(true);

    try {
      const response = await fetch(
        `/api/reo/assets/${assetId}/securing`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            propertySecured,
            rekeyCompleted,
            lockboxInstalled,
            lockboxCode,
            keyLocation,
            doorsSecured,
            windowsSecured,
            garageSecured,
            outbuildingsSecured,
            winterizationRequired,
            winterizationCompleted,
            vendorName,
            serviceDate,
            serviceCost,
            damageObserved,
            emergencyCondition,
            securingNotes,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Unable to save securing information.");
      }

      window.location.href =
        `/admin/assets/${assetId}?tab=securing&saved=1`;
    } catch (error) {
      console.error(error);
      alert(
        "The securing record could not be saved. Please try again."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* PROPERTY SECURITY */}
      <Section
        icon={ShieldCheck}
        title="Property Security"
        subtitle="Document the physical security status of the asset."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Toggle
            label="Property Secured?"
            value={propertySecured}
            onChange={setPropertySecured}
          />

          <Toggle
            label="Rekey Completed?"
            value={rekeyCompleted}
            onChange={setRekeyCompleted}
          />

          <Toggle
            label="Doors Secured?"
            value={doorsSecured}
            onChange={setDoorsSecured}
          />

          <Toggle
            label="Windows Secured?"
            value={windowsSecured}
            onChange={setWindowsSecured}
          />

          <Toggle
            label="Garage Secured?"
            value={garageSecured}
            onChange={setGarageSecured}
          />

          <Toggle
            label="Outbuildings Secured?"
            value={outbuildingsSecured}
            onChange={setOutbuildingsSecured}
          />
        </div>
      </Section>

      {/* LOCKS & ACCESS */}
      <Section
        icon={LockKeyhole}
        title="Locks & Access"
        subtitle="Record rekey, lockbox, keys, and property access."
      >
        <div className="grid gap-5 md:grid-cols-2">
          <Toggle
            label="Lockbox Installed?"
            value={lockboxInstalled}
            onChange={setLockboxInstalled}
          />

          <div>
            <label className="mb-2 block text-xs font-medium text-slate-400">
              Lockbox Code
            </label>

            <input
              value={lockboxCode}
              onChange={(e) => setLockboxCode(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-green-500/50"
              placeholder="Enter lockbox code"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-xs font-medium text-slate-400">
              Key Location / Access Instructions
            </label>

            <input
              value={keyLocation}
              onChange={(e) => setKeyLocation(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-green-500/50"
              placeholder="Document key location or access instructions"
            />
          </div>
        </div>
      </Section>

      {/* WINTERIZATION */}
      <Section
        icon={Snowflake}
        title="Winterization & Protection"
        subtitle="Document seasonal property protection requirements."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Toggle
            label="Winterization Required?"
            value={winterizationRequired}
            onChange={setWinterizationRequired}
          />

          <Toggle
            label="Winterization Completed?"
            value={winterizationCompleted}
            onChange={setWinterizationCompleted}
          />
        </div>
      </Section>

      {/* VENDOR */}
      <Section
        icon={Wrench}
        title="Vendor & Service"
        subtitle="Record who completed the securing work and associated cost."
      >
        <div className="grid gap-5 md:grid-cols-3">
          <div>
            <label className="mb-2 block text-xs font-medium text-slate-400">
              Vendor / Field Company
            </label>

            <input
              value={vendorName}
              onChange={(e) => setVendorName(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none"
              placeholder="Vendor name"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-medium text-slate-400">
              Service Date
            </label>

            <input
              type="date"
              value={serviceDate}
              onChange={(e) => setServiceDate(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-medium text-slate-400">
              Service Cost
            </label>

            <input
              type="number"
              value={serviceCost}
              onChange={(e) => setServiceCost(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none"
              placeholder="0.00"
            />
          </div>
        </div>
      </Section>

      {/* EXCEPTIONS */}
      <Section
        icon={AlertTriangle}
        title="Exceptions & Damage"
        subtitle="Identify conditions requiring additional review or escalation."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Toggle
            label="Damage Observed?"
            value={damageObserved}
            onChange={setDamageObserved}
          />

          <Toggle
            label="Emergency Condition?"
            value={emergencyCondition}
            onChange={setEmergencyCondition}
          />
        </div>

        <div className="mt-5">
          <label className="mb-2 block text-xs font-medium text-slate-400">
            Securing Notes
          </label>

          <textarea
            value={securingNotes}
            onChange={(e) => setSecuringNotes(e.target.value)}
            rows={5}
            className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-green-500/50"
            placeholder="Document securing work, exceptions, damage, access concerns, and recommended next actions."
          />
        </div>
      </Section>

      {/* COMPLETE */}
      <div className="reo-card flex justify-end rounded-2xl p-5">
        <button
          type="button"
          disabled={saving}
          onClick={handleComplete}
          className="flex items-center gap-2 rounded-xl bg-green-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <CheckCircle2 className="h-4 w-4" />
          {saving ? "Saving..." : "Complete Securing"}
        </button>
      </div>
    </div>
  );
}
