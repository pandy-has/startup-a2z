"use client";

import { useEffect, useState } from "react";
import { loadProject, type Project } from "@/lib/projectStore";

export default function OverviewPage() {
  const [p, setP] = useState<Project>({});

  useEffect(() => setP(loadProject()), []);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold">Your Startup Overview</h1>
          <p className="text-slate-600 max-w-2xl">
            This is your “reference doc” from idea → legal → brand → operations → launch.
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
          <div><span className="font-medium">Other details:</span> {p.businessStructureOther || "—"}</div>
        )}
        <div><span className="font-medium">EIN:</span> {p.needsEIN || "—"}</div>
      </section>

      <section className="rounded border p-4 space-y-2">
        <h2 className="font-semibold">Branding</h2>
        <div><span className="font-medium">Name:</span> {p.businessName || "—"}</div>
        <div><span className="font-medium">Style:</span> {p.logoStyle || "—"}</div>
      </section>

      <section className="rounded border p-4 space-y-2">
        <h2 className="font-semibold">Operations</h2>
        <div><span className="font-medium">Bookkeeping:</span> {p.bookkeepingChoice || "—"}</div>
        <div><span className="font-medium">Monthly budget:</span> {p.estimatedMonthlyBudget != null ? `$${p.estimatedMonthlyBudget}` : "—"}</div>
      </section>

      <section className="rounded border p-4 space-y-2">
        <h2 className="font-semibold">Go-to-market</h2>
        <div>
          <span className="font-medium">Pricing range:</span>{" "}
          {p.pricing?.suggestedLow && p.pricing?.suggestedHigh
            ? `$${p.pricing.suggestedLow} – $${p.pricing.suggestedHigh}`
            : "—"}
        </div>
        <div><span className="font-medium">Supplier category:</span> {p.supplierCategory || "—"}</div>
        <div><span className="font-medium">Selected suppliers:</span> {(p.selectedSuppliers || []).join(", ") || "—"}</div>
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
