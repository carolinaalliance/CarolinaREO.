import Link from "next/link";
import {
  ArrowRight,
  Banknote,
  BarChart3,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  Handshake,
  Home,
  Landmark,
  LineChart,
  MapPin,
  Monitor,
  ShieldCheck,
  Users,
  Wrench,
} from "lucide-react";

const services = [
  {
    icon: Building2,
    title: "Asset Management",
    description:
      "Centralized oversight from initial assignment through final disposition.",
  },
  {
    icon: ShieldCheck,
    title: "Property Inspections",
    description:
      "Detailed property condition reporting, occupancy verification, and field inspections.",
  },
  {
    icon: Wrench,
    title: "Preservation & Repairs",
    description:
      "Maintenance, emergency response, vendor management, and rehabilitation oversight.",
  },
  {
    icon: BarChart3,
    title: "Valuation & BPO",
    description:
      "Market-based pricing recommendations, broker opinions, and disposition strategy.",
  },
  {
    icon: LineChart,
    title: "Property Marketing",
    description:
      "MLS exposure, digital marketing, showing management, and buyer feedback.",
  },
  {
    icon: Handshake,
    title: "Offer & Closing Management",
    description:
      "Offer presentation, negotiation, contract administration, and closing coordination.",
  },
  {
    icon: MapPin,
    title: "Local Execution",
    description:
      "Structured reporting, field activity, and disciplined disposition management.",
  },
  {
    icon: Monitor,
    title: "Client Portal",
    description:
      "Secure access to portfolio status, documents, timelines, approvals, and reporting.",
  },
];

const institutions = [
  "Community Banks",
  "Regional Banks",
  "Credit Unions",
  "Mortgage Servicers",
  "Private Lenders",
  "Institutional Investors",
  "Law Firms & Receivers",
];

const lifecycle = [
  ["01", "Assignment"],
  ["02", "Occupancy & Securing"],
  ["03", "Inspection"],
  ["04", "Valuation"],
  ["05", "Preservation"],
  ["06", "Marketing"],
  ["07", "Offer Management"],
  ["08", "Disposition"],
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-green-500/30 bg-green-500/10">
              <Building2 className="h-6 w-6 text-green-400" />
            </div>

            <div>
              <div className="text-lg font-bold tracking-wide">CAROLINA REO</div>
              <div className="text-[10px] uppercase tracking-[0.28em] text-slate-500">
                Asset Management
              </div>
            </div>
          </Link>

          <nav className="hidden gap-8 text-sm text-slate-300 lg:flex">
            <Link href="#services" className="hover:text-white">
              Services
            </Link>
            <Link href="#process" className="hover:text-white">
              Our Process
            </Link>
            <Link href="#institutions" className="hover:text-white">
              Institutions
            </Link>
            <Link href="#coverage" className="hover:text-white">
              Coverage
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="hidden rounded-lg border border-white/10 px-4 py-2 text-sm text-slate-300 transition hover:bg-white/5 md:block"
            >
              Client Login
            </Link>

            <Link
              href="/admin/assets/new"
              className="rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold transition hover:bg-green-500"
            >
              Start Assignment
            </Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(34,197,94,0.12),transparent_30%)]" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-6 py-24 lg:grid-cols-[1fr_.95fr] lg:py-28">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-4 py-2 text-sm text-green-400">
              <Landmark className="h-4 w-4" />
              Institutional Asset Management
            </div>

            <h1 className="max-w-4xl text-5xl font-bold leading-[1.05] tracking-tight md:text-6xl">
              From assignment
              <span className="block text-green-400">to disposition.</span>
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300">
              Carolina REO provides banks, servicers, lenders, investors, and
              institutional asset owners with accountable management of
              distressed, foreclosed, and institutionally owned real estate.
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/admin/assets/new"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-7 py-4 font-semibold transition hover:bg-green-500"
              >
                Start New Assignment
                <ArrowRight className="h-5 w-5" />
              </Link>

              <Link
                href="#process"
                className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-7 py-4 font-semibold text-slate-200 transition hover:bg-white/10"
              >
                View Our Process
              </Link>
            </div>

            <div className="mt-10 grid max-w-2xl gap-3 sm:grid-cols-3">
              {[
                "Institutional Reporting",
                "Vendor Oversight",
                "Disposition Management",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 text-sm text-slate-400"
                >
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-8 rounded-full bg-green-500/5 blur-3xl" />

            <div className="reo-card relative overflow-hidden rounded-3xl p-7">
              <div className="flex items-center justify-between border-b border-white/10 pb-5">
                <div>
                  <div className="text-sm text-green-400">Live Asset Workflow</div>
                  <div className="mt-1 text-2xl font-semibold">
                    Assignment Control
                  </div>
                </div>

                <div className="rounded-xl bg-green-500/10 p-3">
                  <ClipboardCheck className="h-6 w-6 text-green-400" />
                </div>
              </div>

              <div className="space-y-3 py-6">
                {[
                  ["Assignment Received", "Complete"],
                  ["Occupancy Verification", "Complete"],
                  ["Initial Inspection", "Complete"],
                  ["BPO / Valuation", "In Progress"],
                  ["List Preparation", "Pending"],
                  ["Disposition", "Pending"],
                ].map(([label, status]) => (
                  <div
                    key={label}
                    className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3"
                  >
                    <span className="text-sm text-slate-300">{label}</span>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        status === "Complete"
                          ? "bg-green-500/10 text-green-400"
                          : status === "In Progress"
                          ? "bg-blue-500/10 text-blue-400"
                          : "bg-slate-800 text-slate-500"
                      }`}
                    >
                      {status}
                    </span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-3 border-t border-white/10 pt-5 text-center">
                <div>
                  <div className="text-2xl font-semibold">24/7</div>
                  <div className="mt-1 text-xs text-slate-500">
                    Portfolio Access
                  </div>
                </div>

                <div>
                  <div className="text-2xl font-semibold">1</div>
                  <div className="mt-1 text-xs text-slate-500">
                    Unified Record
                  </div>
                </div>

                <div>
                  <div className="text-2xl font-semibold">100%</div>
                  <div className="mt-1 text-xs text-slate-500">Tracked</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.02]">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
            Built for institutional asset owners
          </p>

          <div className="mt-6 grid gap-4 text-center text-sm text-slate-400 sm:grid-cols-2 lg:grid-cols-7">
            {institutions.map((item) => (
              <div key={item} className="rounded-lg px-3 py-2">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="services" className="mx-auto max-w-7xl px-6 py-24">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-green-400">
            Asset Management Services
          </p>

          <h2 className="mt-4 text-4xl font-bold tracking-tight">
            One accountable partner throughout the asset lifecycle.
          </h2>

          <p className="mt-5 text-lg leading-8 text-slate-400">
            Carolina REO coordinates the people, documentation, field activity,
            marketing, reporting, and decisions required to move institutional
            real estate toward disposition.
          </p>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => {
            const Icon = service.icon;

            return (
              <div
                key={service.title}
                className="reo-card reo-card-hover rounded-2xl p-6"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-500/10">
                  <Icon className="h-5 w-5 text-green-400" />
                </div>

                <h3 className="mt-5 text-lg font-semibold">{service.title}</h3>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section
        id="process"
        className="border-y border-white/10 bg-white/[0.02] py-24"
      >
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-green-400">
              Assignment to Disposition
            </p>

            <h2 className="mt-4 text-4xl font-bold">
              Every asset. Every milestone. One record.
            </h2>

            <p className="mt-5 text-slate-400">
              Institutional accountability with a complete record of what has
              happened, what is happening now, and what needs to happen next.
            </p>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-4 lg:grid-cols-8">
            {lifecycle.map(([number, title]) => (
              <div key={number} className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-green-500/30 bg-green-500/10 font-bold text-green-400">
                  {number}
                </div>

                <div className="mt-4 text-sm font-medium text-slate-300">
                  {title}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="institutions" className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="reo-card rounded-3xl p-8">
            <Banknote className="h-9 w-9 text-green-400" />

            <h2 className="mt-6 text-3xl font-bold">
              Built for institutions of every size.
            </h2>

            <p className="mt-5 leading-7 text-slate-400">
              From a community bank managing a handful of properties to a
              regional servicer overseeing a larger portfolio, Carolina REO is
              being designed to provide consistent operational visibility and
              execution.
            </p>
          </div>

          <div className="reo-card rounded-3xl p-8">
            <Monitor className="h-9 w-9 text-green-400" />

            <h2 className="mt-6 text-3xl font-bold">
              Secure institutional client portal.
            </h2>

            <p className="mt-5 leading-7 text-slate-400">
              Authorized clients will have direct access to asset status,
              documents, valuations, inspections, repair approvals, offers,
              closing activity, and portfolio reporting.
            </p>
          </div>
        </div>
      </section>

      <section id="coverage" className="mx-auto max-w-7xl px-6 pb-24">
        <div className="rounded-3xl border border-green-500/20 bg-gradient-to-r from-green-600/15 to-transparent p-10">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
            <div>
              <div className="flex items-center gap-2 text-green-400">
                <MapPin className="h-5 w-5" />
                Market Coverage
              </div>

              <h2 className="mt-4 text-3xl font-bold">
                Carolina-based. Institutionally focused.
              </h2>

              <p className="mt-4 max-w-2xl text-slate-400">
                Built for disciplined local execution with the ability to scale
                through qualified market professionals and vendor partners.
              </p>
            </div>

            <Link
              href="/admin/assets/new"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-4 font-semibold hover:bg-green-500"
            >
              Start New Assignment
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 px-6 py-8 text-sm text-slate-500 md:flex-row">
          <div>© 2026 Carolina REO Asset Management</div>
          <div>Institutional real estate asset management.</div>
        </div>
      </footer>
    </main>
  );
}
