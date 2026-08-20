import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  Home,
  KeyRound,
  Landmark,
  MapPin,
  ShieldCheck,
  TrendingUp,
  Users,
  Wrench,
} from "lucide-react";

const lifecycle = [
  {
    number: "01",
    title: "Assignment",
    description:
      "New assets are received, reviewed, documented, and assigned to the appropriate market team.",
  },
  {
    number: "02",
    title: "Occupancy & Securing",
    description:
      "Occupancy is verified and property access, securing, rekeying, and preservation needs are coordinated.",
  },
  {
    number: "03",
    title: "Inspection",
    description:
      "Property condition, exterior, interior, utilities, hazards, and immediate risks are documented.",
  },
  {
    number: "04",
    title: "Valuation",
    description:
      "BPOs, CMAs, market intelligence, repair analysis, and pricing recommendations are prepared.",
  },
  {
    number: "05",
    title: "Preservation",
    description:
      "Repairs, maintenance, debris removal, lawn service, winterization, and vendor work are managed.",
  },
  {
    number: "06",
    title: "Marketing",
    description:
      "Assets are prepared for market, listed, marketed, photographed, and monitored for activity.",
  },
  {
    number: "07",
    title: "Offer Management",
    description:
      "Offers are organized, analyzed, negotiated, documented, and presented to the asset owner.",
  },
  {
    number: "08",
    title: "Disposition",
    description:
      "Contract milestones, closing coordination, final inspections, accounting, and disposition reporting are completed.",
  },
];

const services = [
  {
    icon: ClipboardCheck,
    title: "REO Asset Management",
    description:
      "Centralized oversight of institutional real estate from initial assignment through final disposition.",
  },
  {
    icon: Home,
    title: "Property Inspections",
    description:
      "Occupancy checks, property condition reporting, photo documentation, and ongoing field inspections.",
  },
  {
    icon: Wrench,
    title: "Preservation & Repairs",
    description:
      "Vendor coordination, bids, maintenance, emergency services, debris removal, and rehabilitation oversight.",
  },
  {
    icon: TrendingUp,
    title: "Valuation & BPO",
    description:
      "Market-based pricing recommendations, broker price opinions, comparable analysis, and disposition strategy.",
  },
  {
    icon: KeyRound,
    title: "Property Marketing",
    description:
      "MLS exposure, digital marketing, showing management, buyer feedback, and activity reporting.",
  },
  {
    icon: FileText,
    title: "Offer & Closing Management",
    description:
      "Offer presentation, negotiation support, contract administration, closing coordination, and final reporting.",
  },
];

const clients = [
  "Community Banks",
  "Regional Banks",
  "Credit Unions",
  "Mortgage Servicers",
  "Private Lenders",
  "Institutional Investors",
  "Asset Managers",
  "Law Firms & Receivers",
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* NAVIGATION */}
      <header className="border-b border-white/10 bg-slate-950/95">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600">
              <Building2 className="h-6 w-6" />
            </div>

            <div>
              <div className="text-xl font-bold tracking-wide">
                CAROLINA REO
              </div>
              <div className="text-[10px] uppercase tracking-[0.28em] text-slate-400">
                Asset Management
              </div>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 text-sm text-slate-300 lg:flex">
            <Link href="#services" className="transition hover:text-white">
              Services
            </Link>

            <Link href="#process" className="transition hover:text-white">
              Asset Lifecycle
            </Link>

            <Link href="#institutions" className="transition hover:text-white">
              Institutions
            </Link>

            <Link href="#coverage" className="transition hover:text-white">
              Coverage
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden rounded-lg px-4 py-2 text-sm font-medium text-slate-300 transition hover:text-white sm:block"
            >
              Client Login
            </Link>

            <Link
              href="/contact"
              className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500"
            >
              Assign an Asset
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(37,99,235,0.20),transparent_35%)]" />

        <div className="relative mx-auto grid max-w-7xl gap-14 px-6 py-24 lg:grid-cols-[1.15fr_.85fr] lg:py-32">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm text-blue-300">
              <Landmark className="h-4 w-4" />
              Institutional Real Estate Asset Management
            </div>

            <h1 className="max-w-4xl text-5xl font-bold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
              From assignment
              <span className="text-blue-500"> to disposition.</span>
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300 md:text-xl">
              Carolina REO provides banks, servicers, lenders, investors, and
              institutional asset owners with accountable local management of
              distressed, foreclosed, and institutionally owned real estate.
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-4 font-semibold transition hover:bg-blue-500"
              >
                Submit an Assignment
                <ArrowRight className="h-5 w-5" />
              </Link>

              <Link
                href="#process"
                className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-7 py-4 font-semibold text-slate-200 transition hover:bg-white/10"
              >
                View Our Process
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-6 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-blue-500" />
                Institutional Reporting
              </div>

              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-blue-500" />
                Vendor Oversight
              </div>

              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-blue-500" />
                Disposition Management
              </div>
            </div>
          </div>

          {/* ASSIGNMENT CARD */}
          <div className="flex items-center">
            <div className="w-full rounded-3xl border border-white/10 bg-white/[0.04] p-7 shadow-2xl backdrop-blur">
              <div className="flex items-center justify-between border-b border-white/10 pb-5">
                <div>
                  <p className="text-sm text-slate-400">Asset Management</p>
                  <h2 className="mt-1 text-2xl font-semibold">
                    Assignment Control
                  </h2>
                </div>

                <div className="rounded-xl bg-green-500/10 p-3">
                  <ShieldCheck className="h-6 w-6 text-green-400" />
                </div>
              </div>

              <div className="space-y-4 py-6">
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
                    className="flex items-center justify-between rounded-xl bg-white/[0.04] px-4 py-3"
                  >
                    <span className="text-sm text-slate-300">{label}</span>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        status === "Complete"
                          ? "bg-green-500/10 text-green-400"
                          : status === "In Progress"
                          ? "bg-blue-500/10 text-blue-400"
                          : "bg-slate-700/50 text-slate-400"
                      }`}
                    >
                      {status}
                    </span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-3 border-t border-white/10 pt-5 text-center">
                <div>
                  <p className="text-2xl font-semibold">24/7</p>
                  <p className="mt-1 text-xs text-slate-500">Asset Access</p>
                </div>

                <div>
                  <p className="text-2xl font-semibold">1</p>
                  <p className="mt-1 text-xs text-slate-500">Unified Record</p>
                </div>

                <div>
                  <p className="text-2xl font-semibold">100%</p>
                  <p className="mt-1 text-xs text-slate-500">Tracked</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <section className="border-y border-white/10 bg-white/[0.02]">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-10 gap-y-4 px-6 py-7 text-sm font-medium text-slate-400">
          {clients.map((client) => (
            <span key={client}>{client}</span>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="mx-auto max-w-7xl px-6 py-24">
        <div className="max-w-3xl">
          <p className="font-semibold uppercase tracking-widest text-blue-500">
            Asset Management Services
          </p>

          <h2 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
            One accountable partner throughout the asset lifecycle.
          </h2>

          <p className="mt-5 text-lg leading-8 text-slate-400">
            Carolina REO coordinates the people, documentation, field activity,
            marketing, reporting, and decisions required to move institutional
            real estate toward disposition.
          </p>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const Icon = service.icon;

            return (
              <div
                key={service.title}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-7 transition hover:border-blue-500/40 hover:bg-white/[0.05]"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10">
                  <Icon className="h-6 w-6 text-blue-400" />
                </div>

                <h3 className="text-xl font-semibold">{service.title}</h3>

                <p className="mt-3 leading-7 text-slate-400">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* LIFECYCLE */}
      <section id="process" className="bg-white/[0.025] py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-3xl">
            <p className="font-semibold uppercase tracking-widest text-blue-500">
              Assignment to Disposition
            </p>

            <h2 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
              Every asset. Every milestone. One record.
            </h2>

            <p className="mt-5 text-lg leading-8 text-slate-400">
              Our workflow is designed around institutional accountability so
              asset owners can quickly identify what has happened, what is
              happening now, and what needs to happen next.
            </p>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {lifecycle.map((step) => (
              <div
                key={step.number}
                className="relative rounded-2xl border border-white/10 bg-slate-950 p-6"
              >
                <div className="text-sm font-bold tracking-widest text-blue-500">
                  {step.number}
                </div>

                <h3 className="mt-4 text-xl font-semibold">{step.title}</h3>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INSTITUTIONS */}
      <section
        id="institutions"
        className="mx-auto grid max-w-7xl gap-14 px-6 py-24 lg:grid-cols-2"
      >
        <div>
          <p className="font-semibold uppercase tracking-widest text-blue-500">
            Built for Institutions
          </p>

          <h2 className="mt-4 text-4xl font-bold tracking-tight">
            Local execution with institutional-level visibility.
          </h2>

          <p className="mt-5 text-lg leading-8 text-slate-400">
            Whether managing one distressed property or a portfolio of assets,
            Carolina REO is being built to deliver structured reporting,
            documented field activity, centralized communication, and
            disciplined disposition management.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {clients.map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-lg bg-white/[0.03] px-4 py-3"
              >
                <CheckCircle2 className="h-5 w-5 text-blue-500" />
                <span className="text-slate-300">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-blue-600/15 to-transparent p-8">
          <Users className="h-10 w-10 text-blue-400" />

          <h3 className="mt-6 text-2xl font-semibold">
            Institutional Client Portal
          </h3>

          <p className="mt-4 leading-7 text-slate-400">
            Our planned secure portal will give authorized clients direct
            visibility into their portfolio and individual assets.
          </p>

          <div className="mt-7 space-y-3">
            {[
              "Portfolio dashboard",
              "Asset status and timelines",
              "Inspection reports and photographs",
              "BPOs and valuation documents",
              "Vendor bids and repair approvals",
              "Expense tracking",
              "Marketing activity",
              "Offer comparison",
              "Contract and closing status",
              "Final disposition reports",
            ].map((feature) => (
              <div key={feature} className="flex gap-3 text-sm text-slate-300">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
                {feature}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COVERAGE */}
      <section
        id="coverage"
        className="border-y border-white/10 bg-white/[0.025]"
      >
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
            <div>
              <div className="flex items-center gap-2 text-blue-400">
                <MapPin className="h-5 w-5" />
                <span className="font-semibold uppercase tracking-widest">
                  Market Coverage
                </span>
              </div>

              <h2 className="mt-4 text-3xl font-bold">
                Carolina-based. Institutionally focused.
              </h2>

              <p className="mt-4 max-w-2xl leading-7 text-slate-400">
                Our platform is being designed to support direct market
                operations while also allowing scalable regional coverage
                through qualified local professionals and vendors.
              </p>
            </div>

            <Link
              href="/contact"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-blue-500/40 bg-blue-500/10 px-6 py-4 font-semibold text-blue-300 transition hover:bg-blue-500/20"
            >
              Discuss Your Portfolio
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="rounded-3xl bg-blue-600 px-8 py-14 text-center md:px-14">
          <h2 className="text-3xl font-bold md:text-4xl">
            Have an asset that needs attention?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-blue-100">
            Start an assignment with Carolina REO and give your team one
            accountable point of coordination from intake through disposition.
          </p>

          <Link
            href="/contact"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-7 py-4 font-semibold text-slate-950 transition hover:bg-blue-50"
          >
            Start New Assignment
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 px-6 py-10 md:flex-row">
          <div>
            <div className="font-bold">CAROLINA REO</div>
            <div className="mt-1 text-xs uppercase tracking-widest text-slate-500">
              Asset Management
            </div>
          </div>

          <div className="text-sm text-slate-500">
            Institutional real estate asset management.
          </div>
        </div>
      </footer>
    </main>
  );
}
