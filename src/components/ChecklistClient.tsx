"use client";

import { useEffect, useMemo, useState } from "react";

type Item = {
  id: string;
  category: string;
  title: string;
  description: string;
  sortOrder: number;
};

export default function ChecklistClient() {
  const [items, setItems] = useState<Item[]>([]);
  const [done, setDone] = useState<Record<string, boolean>>({});

  const country =
    typeof window === "undefined"
      ? "US"
      : localStorage.getItem("country") || "US";

  useEffect(() => {
    const saved = typeof window === "undefined" ? null : localStorage.getItem("done");
    setDone(saved ? JSON.parse(saved) : {});
  }, []);

  useEffect(() => {
    fetch(`/api/checklist?country=${encodeURIComponent(country)}`)
      .then((r) => r.json())
      .then((data) => setItems(data.items));
  }, [country]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("done", JSON.stringify(done));
    }
  }, [done]);

  const grouped = useMemo(() => {
    const map = new Map<string, Item[]>();
    for (const it of items) {
      if (!map.has(it.category)) map.set(it.category, []);
      map.get(it.category)!.push(it);
    }
    return Array.from(map.entries());
  }, [items]);

  const total = items.length;
  const completed = items.filter((i) => done[i.id]).length;

  return (
    <div className="space-y-6">
      <div className="rounded border p-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="font-medium">Your progress</div>
            <div className="text-sm text-slate-600">
              {completed} of {total} steps completed
            </div>
          </div>
          <button
            className="text-sm border rounded px-3 py-1 hover:bg-slate-50"
            onClick={() => setDone({})}
          >
            Reset
          </button>
        </div>
        <div className="mt-3 h-2 bg-slate-100 rounded">
          <div
            className="h-2 bg-slate-900 rounded"
            style={{ width: total ? `${(completed / total) * 100}%` : "0%" }}
          />
        </div>
      </div>

      {grouped.map(([category, list]) => (
        <section key={category} className="space-y-3">
          <h2 className="text-lg font-semibold">{category}</h2>
          <div className="space-y-2">
            {list
              .slice()
              .sort((a, b) => a.sortOrder - b.sortOrder)
              .map((it) => (
                <label
                  key={it.id}
                  className="block rounded border p-3 hover:bg-slate-50 cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={!!done[it.id]}
                      onChange={(e) =>
                        setDone((prev) => ({ ...prev, [it.id]: e.target.checked }))
                      }
                      className="mt-1"
                    />
                    <div>
                      <div className="font-medium">{it.title}</div>
                      <div className="text-sm text-slate-600">{it.description}</div>
                    </div>
                  </div>
                </label>
              ))}
          </div>
        </section>
      ))}
    </div>
  );
}
