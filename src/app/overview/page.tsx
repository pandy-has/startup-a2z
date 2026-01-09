"use client";

import { useEffect, useMemo, useState } from "react";

type Project = {
  businessStructure?: string;
  businessStructureOther?: string;
  needsEIN?: "yes" | "no";

  businessName?: string;
  nameCheckResult?: { status: string; note: string };

  productDescription?: string;

  suppliersSelected?: string[];
  supplierCategory?: string;
};

const STORAGE_KEY = "startupA2Z_project_v1";

export default function OverviewPage() {
  const [p, setP] = useState<Project>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setP(JSON.parse(raw));
    } catch {
      setP({});
    }
  }, []);

  const structureText = useMemo(() => {
    if (!p.businessStructure) return "—";
    if (p.businessStructure === "Other") return `Other: ${p.businessStructureOther || "—"}`;
    return p.businessStructure;
  }, [p.businessStructure, p.businessStructureOther]);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold">Your Startup Overview</h1>
          <p className="text-slate-600 max-w-2xl">
            This is your printable reference from Legal → Branding → Next steps.
          </p>
        </div>

        <button
          className="rounded bg-slate-900 text-white px-4 py-2 text-sm"
          onClick={() => window.print()}
        >
          Print
        </button>
      </div>

      <section className="rounded border p-4 space-y-2">
        <h2 className="font-semibold">Legal & Setup (US)</h2>
        <div><span className="font-medium">Business structure:</span> {structureText}</div>
        <div><span className="font-medium">EIN needed:</span> {p.needsEIN || "—"}</div>

        <div className="pt-2 text-sm text-slate-600">
          Next actions:
          <ul className="list-disc pl-5 mt-1">
            <li>Register your entity with your state (LLC/Corp) or file DBA if needed.</li>
            <li>If you need EIN, apply at IRS (free official website).</li>
            <li>Check licenses/permits for your city/state/industry.</li>
          </ul>
        </div>
      </section>

      <section className="rounded border p-4 space-y-2">
        <h2 className="font-semibold">Branding</h2>
        <div><span className="font-medium">Business name:</span> {p.businessName || "—"}</div>
        <div>
          <span className="font-medium">Name check:</span>{" "}
          {p.nameCheckResult ? `${p.nameCheckResult.status} — ${p.nameCheckResult.note}` : "—"}
        </div>

        <div className="pt-2 text-sm text-slate-600">
          Next actions:
          <ul className="list-disc pl-5 mt-1">
            <li>Search USPTO trademarks for your name.</li>
            <li>Search your state business registry for name availability.</li>
            <li>Secure domain + social handles (as close as possible).</li>
          </ul>
        </div>
      </section>

      <section className="rounded border p-4 space-y-2">
        <h2 className="font-semibold">Go-to-market (Suppliers)</h2>
        <div><span className="font-medium">Supplier category:</span> {p.supplierCategory || "—"}</div>
        <div>
          <span className="font-medium">Selected suppliers:</span>{" "}
          {p.suppliersSelected && p.suppliersSelected.length ? p.suppliersSelected.join(", ") : "—"}
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
