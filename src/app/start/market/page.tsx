"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { loadProject, saveProject, type Project } from "@/lib/projectStore";

function suggestPrice(productType?: string, marketType?: string) {
  if (productType === "physical" && marketType === "b2c") return { low: 15, high: 60 };
  if (productType === "digital" && marketType === "b2c") return { low: 9, high: 39 };
  if (productType === "service" && marketType === "b2c") return { low: 50, high: 200 };
  if (productType === "service" && marketType === "b2b") return { low: 500, high: 5000 };
  if (productType === "digital" && marketType === "b2b") return { low: 49, high: 299 };
  return { low: 25, high: 150 };
}

export default function MarketPage() {
  const [p, setP] = useState<Project>({});
  const [suppliers, setSuppliers] = useState<any[]>([]);

  useEffect(() => setP(loadProject()), []);
  useEffect(() => {
    fetch("/api/suppliers").then((r) => r.json()).then((d) => setSuppliers(d.suppliers || []));
  }, []);

  function update(next: Partial<Project>) {
    setP((prev) => {
      const merged = { ...prev, ...next };
      saveProject(merged);
      return merged;
    });
  }

  const suggestion = useMemo(() => suggestPrice(p.productType, p.marketType), [p.productType, p.marketType]);

  const categories = Array.from(new Set(suppliers.map((s) => s.category))).sort();
  const list = p.supplierCategory ? suppliers.filter((s) => s.category === p.supplierCategory) : [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">5) Go-to-market</h1>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="font-medium">Market type</label>
          <select
            className="border rounded px-3 py-2 w-full"
            value={p.marketType || ""}
            onChange={(e) => update({ marketType: e.target.value as any })}
          >
            <option value="" disabled>Select…</option>
            <option value="b2c">B2C</option>
            <option value="b2b">B2B</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="font-medium">Product type</label>
          <select
            className="border rounded px-3 py-2 w-full"
            value={p.productType || ""}
            onChange={(e) => update({ productType: e.target.value as any })}
          >
            <option value="" disabled>Select…</option>
            <option value="service">Service</option>
            <option value="physical">Physical</option>
            <option value="digital">Digital</option>
          </select>
        </div>
      </div>

      <div className="rounded bg-slate-50 border p-3 text-sm space-y-2">
        <div className="font-medium">Suggested starting price range (MVP heuristic)</div>
        <div>${suggestion.low} – ${suggestion.high}</div>
        <button
          className="rounded border px-3 py-1 text-sm"
          onClick={() => update({ priceLow: suggestion.low, priceHigh: suggestion.high })}
        >
          Save this range
        </button>
      </div>

      <div className="space-y-2">
        <div className="font-medium">Suppliers (MVP directory)</div>
        <select
          className="border rounded px-3 py-2 w-full max-w-md"
          value={p.supplierCategory || ""}
          onChange={(e) => update({ supplierCategory: e.target.value, selectedSuppliers: [] })}
        >
          <option value="" disabled>Select category…</option>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>

        {list.length > 0 && (
          <div className="space-y-2">
            {list.map((s) => (
              <label key={s.id} className="block rounded border p-3 hover:bg-slate-50 cursor-pointer">
                <div className="flex gap-3">
                  <input
                    type="checkbox"
                    className="mt-1"
                    checked={(p.selectedSuppliers || []).includes(s.id)}
                    onChange={(e) => {
                      const prev = p.selectedSuppliers || [];
                      const next = e.target.checked ? [...prev, s.id] : prev.filter((x) => x !== s.id);
                      update({ selectedSuppliers: next });
                    }}
                  />
                  <div>
                    <div className="font-medium">{s.name}</div>
                    <div className="text-sm text-slate-600">{s.note}</div>
                  </div>
                </div>
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-3 flex-wrap">
        <Link className="rounded border px-4 py-2 text-sm" href="/start/operations">Back</Link>
        <Link className="rounded bg-slate-900 text-white px-4 py-2 text-sm" href="/overview">
          Go to Overview + Print
        </Link>
      </div>
    </div>
  );
}
