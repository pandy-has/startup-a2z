"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { loadProject, saveProject, type Project } from "@/lib/projectStore";

export default function IdeaPage() {
  const [p, setP] = useState<Project>({});
  const [competitors, setCompetitors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => setP(loadProject()), []);

  function update(next: Partial<Project>) {
    setP((prev) => {
      const merged = { ...prev, ...next };
      saveProject(merged);
      return merged;
    });
  }

  async function findCompetitors() {
    setLoading(true);
    try {
      const res = await fetch(`/api/competitors?q=${encodeURIComponent(p.productDescription || "")}`);
      const data = await res.json();
      setCompetitors(data.competitors || []);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">1) Idea & Validation</h1>

      <div className="space-y-2">
        <label className="font-medium">Define the problem</label>
        <textarea
          className="w-full border rounded p-2 min-h-[100px]"
          value={p.problem || ""}
          onChange={(e) => update({ problem: e.target.value })}
          placeholder="Who has the problem, what pain, why now?"
        />
      </div>

      <div className="space-y-2">
        <label className="font-medium">Product description</label>
        <textarea
          className="w-full border rounded p-2 min-h-[100px]"
          value={p.productDescription || ""}
          onChange={(e) => update({ productDescription: e.target.value })}
          placeholder="What are you selling, for who, and how it works?"
        />
      </div>

      <div className="flex gap-3 items-center flex-wrap">
        <button
          className="rounded bg-slate-900 text-white px-4 py-2 text-sm disabled:opacity-50"
          disabled={!p.productDescription}
          onClick={findCompetitors}
        >
          Find competitors
        </button>
        {loading && <span className="text-sm text-slate-600">Searching…</span>}
      </div>

      {competitors.length > 0 && (
        <div className="space-y-3">
          <div className="font-medium">Competitors (based on your product description)</div>
          {competitors.map((c) => (
            <div key={c.name} className="rounded border p-3">
              <div className="font-medium">{c.name}</div>
              <div className="text-sm text-slate-600">{c.summary}</div>
              <div className="grid md:grid-cols-2 gap-3 mt-2 text-sm">
                <div>
                  <div className="font-medium">They do well</div>
                  <ul className="list-disc pl-5">
                    {c.pros.map((x: string) => <li key={x}>{x}</li>)}
                  </ul>
                </div>
                <div>
                  <div className="font-medium">They do poorly</div>
                  <ul className="list-disc pl-5">
                    {c.cons.map((x: string) => <li key={x}>{x}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-3 flex-wrap">
        <Link className="rounded border px-4 py-2 text-sm" href="/start">
          Back
        </Link>
        <Link className="rounded bg-slate-900 text-white px-4 py-2 text-sm" href="/start/legal">
          Next: Legal & Setup
        </Link>
      </div>
    </div>
  );
}
