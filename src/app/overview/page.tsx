"use client";

import { useEffect, useMemo, useState } from "react";
import { loadProject, type Project } from "@/lib/projectStore";

function money(n?: number | null) {
  if (n == null || !Number.isFinite(n)) return "—";
  return `$${n.toFixed(0)}`;
}

export default function OverviewPage() {
  const [p, setP] = useState<Project>({});

  useEffect(() => setP(loadProject()), []);

  const budget = useMemo(() => {
    const t = (p.estimatedMonthlyBudgetText || "").trim();
    if (!t) return null;
    const n = Number(t);
    return Number.isFinite(n) ? n : null;
  }, [p.estimatedMonthlyBudgetText]);

  // Very rough US beginner cost ranges (safe + honest). These vary by state/industry.
  const costEstimates = useMemo(() => {
    const structure = p.businessStructure || "";
    const bookkeeping = p.bookkeepingChoice || "";

    const stateFiling = structure.includes("LLC") || structure.includes("Corporation") || structure.includes("C-") || structure.includes("S-")
      ? { low: 50, high: 800 }
      : { low: 0, high: 150 };

    const registeredAgent = structure.includes("LLC") || structure.includes("Corporation") ? { low: 0, high: 200 } : { low: 0, high: 0 };

    const ein = p.needsEIN === "yes" ? { low: 0, high: 0 } : { low: 0, high: 0 }; // IRS is free
    const domainEmail = { low: 20, high: 200 }; // per year ballpark
    const websiteTools = { low: 0, high: 300 }; // per month ballpark

    let accounting = { low: 0, high: 0 };
    if (bookkeeping.includes("Spreadsheet")) accounting = { low: 0, high: 20 };
    if (bookkeeping.includes("software")) accounting = { low: 20, high: 80 };
    if (bookkeeping.includes("Bookkeeper")) accounting = { low: 150, high: 600 };
    if (bookkeeping.includes("CPA")) accounting = { low: 300, high: 1500 };

    const totalLow =
      stateFiling.low + registeredAgent.low + ein.low + domainEmail.low + websiteTools.low + accounting.low;
    const totalHigh =
      stateFiling.high + registeredAgent.high + ein.high + domainEmail.high + websiteTools.high + accounting.high;

    return { stateFiling, registeredAgent, ein, domainEmail, websiteTools, accounting, totalLow, totalHigh };
  }, [p.businessStructure, p.bookkeepingChoice, p.needsEIN]);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold">Your Startup Overview</h1>
          <p className="text-slate-600 max-w-2xl">
            Printable reference doc (US). Cost estimates are rough ranges and vary by state and industry.
          </p>
        </div>

        <button className="rounded bg-slate-900 text-white px-4 py-2 text-sm" onClick={() => window.print()}>
          Print
        </button>
      </div>

      <section className="rounded border p-4 space-y-2">
        <h2 className="font-semibold">Idea & Validation</h2>
        <div><span className="font-medium">Problem:</span> {p.problem || "—"}</div>
        <div><span className="font-medium">Product description:</span> {p.productDescription || "—"}</div>
      </section>

      <section className="rounded border p-4 space-y-2">
        <h2 className="font-semibold">Legal & Setup</h2>
        <div><span className="font-medium">Structure:</span> {p.businessStructure || "—"}</div>
        {p.businessStructure === "Other" && (
          <div><span className="font-medium">Other:</span> {p.businessStructureOther || "—"}</div>
        )}
        <div><span className="font-medium">EIN:</span> {p.needsEIN || "—"} (IRS application is free)</div>
      </section>

      <section className="rounded border p-4 space-y-2">
        <h2 className="font-semibold">Branding</h2>
        <div><span className="font-medium">Name:</span> {p.businessName || "—"}</div>
        <div><span className="font-medium">Logo style:</span> {p.logoStyle || "—"}</div>
      </section>

      <section className="rounded border p-4 space-y-2">
        <h2 className="font-semibold">Operations</h2>
        <div><span className="font-medium">Bookkeeping:</span> {p.bookkeepingChoice || "—"}</div>
        <div><span className="font-medium">Expected monthly budget:</span> {budget == null ? "—" : `$${budget}`}</div>
      </section>

      <section className="rounded border p-4 space-y-2">
        <h2 className="font-semibold">Go-to-market</h2>
        <div>
          <span className="font-medium">Saved pricing range:</span>{" "}
          {p.priceLow && p.priceHigh ? `$${p.priceLow} – $${p.priceHigh}` : "—"}
        </div>
        <div><span className="font-medium">Supplier category:</span> {p.supplierCategory || "—"}</div>
        <div><span className="font-medium">Selected suppliers:</span> {(p.selectedSuppliers || []).join(", ") || "—"}</div>
      </section>

      <section className="rounded border p-4 space-y-2">
        <h2 className="font-semibold">Estimated beginner costs</h2>
        <div className="text-sm text-slate-600">
          Ranges are rough. State filing fees vary a lot. Use this as planning, not legal advice.
        </div>

        <div className="grid md:grid-cols-2 gap-2 text-sm">
          <div><span className="font-medium">State filing:</span> {money(costEstimates.stateFiling.low)} – {money(costEstimates.stateFiling.high)}</div>
          <div><span className="font-medium">Registered agent (if needed):</span> {money(costEstimates.registeredAgent.low)} – {money(costEstimates.registeredAgent.high)}</div>
          <div><span className="font-medium">EIN:</span> {money(costEstimates.ein.low)} – {money(costEstimates.ein.high)} (usually $0)</div>
          <div><span className="font-medium">Domain + email (annual):</span> {money(costEstimates.domainEmail.low)} – {money(costEstimates.domainEmail.high)}</div>
          <div><span className="font-medium">Website/tools (monthly):</span> {money(costEstimates.websiteTools.low)} – {money(costEstimates.websiteTools.high)}</div>
          <div><span className="font-medium">Accounting/bookkeeping (monthly):</span> {money(costEstimates.accounting.low)} – {money(costEstimates.accounting.high)}</div>
        </div>

        <div className="mt-2 font-medium">
          Rough “first month” planning range (not counting inventory/ads): {money(costEstimates.totalLow)} – {money(costEstimates.totalHigh)}
        </div>
      </section>

      <style jsx global>{`
        @media print {
          header { display: none; }
          main { padding: 0 !important; }
          button { display: none !important; }
        }
      `}</style>
    </div>
  );
}
