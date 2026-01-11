"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { loadProject, saveProject, type Project } from "@/lib/projectStore";

export default function OperationsPage() {
  const [p, setP] = useState<Project>({});

  useEffect(() => setP(loadProject()), []);

  function update(next: Partial<Project>) {
    setP((prev) => {
      const merged = { ...prev, ...next };
      saveProject(merged);
      return merged;
    });
  }

  const budgetNumber = useMemo(() => {
    const t = (p.estimatedMonthlyBudgetText || "").trim();
    if (!t) return null;
    const n = Number(t);
    return Number.isFinite(n) ? n : null;
  }, [p.estimatedMonthlyBudgetText]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">4) Operations</h1>

      <div className="space-y-2">
        <label className="font-medium">Bookkeeping approach</label>
        <select
          className="border rounded px-3 py-2 w-full max-w-md"
          value={p.bookkeepingChoice || ""}
          onChange={(e) => update({ bookkeepingChoice: e.target.value })}
        >
          <option value="" disabled>Select…</option>
          <option value="Spreadsheet (DIY)">Spreadsheet (DIY)</option>
          <option value="Accounting software (DIY)">Accounting software (DIY)</option>
          <option value="Bookkeeper (professional)">Bookkeeper (professional)</option>
          <option value="CPA (professional)">CPA (professional)</option>
        </select>

        <div className="rounded bg-slate-50 border p-3 text-sm mt-2">
          <div className="font-medium">Suggestion</div>
          <ul className="list-disc pl-5 text-slate-700">
            <li>DIY is cheapest but takes your time and can cause errors.</li>
            <li>Bookkeeper/CPA helps with clean books and taxes as you grow.</li>
          </ul>
        </div>
      </div>

      <div className="space-y-2">
        <label className="font-medium">Expected monthly budget (number)</label>
        <input
          className="border rounded px-3 py-2 w-full max-w-md"
          inputMode="numeric"
          placeholder="Example: 200"
          value={p.estimatedMonthlyBudgetText ?? ""}
          onChange={(e) => update({ estimatedMonthlyBudgetText: e.target.value })}
        />
        <div className="text-sm text-slate-600">
          Saved value: {budgetNumber === null ? "—" : `$${budgetNumber}`}
        </div>
      </div>

      <div className="flex gap-3 flex-wrap">
        <Link className="rounded border px-4 py-2 text-sm" href="/start/branding">Back</Link>
        <Link className="rounded bg-slate-900 text-white px-4 py-2 text-sm" href="/start/market">
          Next: Go-to-market
        </Link>
      </div>
    </div>
  );
}
