"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { loadProject, saveProject, type Project } from "@/lib/projectStore";

const TAKEN_NAMES = ["Apple", "Amazon", "Stripe", "Acme", "Startup A–Z"];

const STYLES = ["Minimal", "Bold", "Luxury", "Playful", "Tech", "Handmade"];

export default function BrandingPage() {
  const [p, setP] = useState<Project>({});
  const [status, setStatus] = useState<string>("");

  useEffect(() => setP(loadProject()), []);

  function update(next: Partial<Project>) {
    setP((prev) => {
      const merged = { ...prev, ...next };
      saveProject(merged);
      return merged;
    });
  }

  const internalTaken = useMemo(() => {
    const n = (p.businessName || "").trim().toLowerCase();
    if (!n) return null;
    return TAKEN_NAMES.some((x) => x.toLowerCase() === n);
  }, [p.businessName]);

  async function generateLogo() {
    setStatus("Generating logo…");
    try {
      const res = await fetch("/api/logo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: p.businessName || "Your Brand", style: p.logoStyle || "Minimal" })
      });
      const data = await res.json();
      update({ generatedLogoSvg: data.svg });
      setStatus("Logo generated.");
    } catch {
      setStatus("Logo generation failed.");
    }
  }

  const uspToLink = "https://www.uspto.gov/trademarks/search";
  const stateLink = "https://www.nass.org/business-services/corporate-registration";

  const domainLink = useMemo(() => {
    const name = (p.businessName || "").trim().toLowerCase().replace(/\s+/g, "");
    if (!name) return "https://www.google.com/search?q=domain+availability";
    return `https://www.google.com/search?q=${encodeURIComponent(name + ".com domain availability")}`;
  }, [p.businessName]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">3) Branding</h1>

      <div className="space-y-2">
        <label className="font-medium">Business name</label>
        <input
          className="border rounded px-3 py-2 w-full max-w-md"
          value={p.businessName || ""}
          onChange={(e) => update({ businessName: e.target.value })}
          placeholder="Type a name"
        />

        {p.businessName && (
          <div className="rounded border p-3 text-sm space-y-2">
            <div className="font-medium">
              Internal quick check: {internalTaken ? "Likely taken (internal list)" : "Not found internally"}
            </div>
            <div className="text-slate-600">
              Real checks you should do in the US:
            </div>
            <div className="flex gap-3 flex-wrap">
              <a className="underline" target="_blank" rel="noreferrer" href={uspToLink}>
                Check USPTO trademarks
              </a>
              <a className="underline" target="_blank" rel="noreferrer" href={stateLink}>
                Check state business registry
              </a>
              <a className="underline" target="_blank" rel="noreferrer" href={domainLink}>
                Check domain availability
              </a>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <label className="font-medium">Logo style preference</label>
        <select
          className="border rounded px-3 py-2 w-full max-w-md"
          value={p.logoStyle || ""}
          onChange={(e) => update({ logoStyle: e.target.value })}
        >
          <option value="" disabled>Select style…</option>
          {STYLES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="flex gap-3 items-center flex-wrap">
        <button
          className="rounded bg-slate-900 text-white px-4 py-2 text-sm disabled:opacity-50"
          disabled={!p.businessName}
          onClick={generateLogo}
        >
          Generate Logo
        </button>
        {status && <span className="text-sm text-slate-600">{status}</span>}
      </div>

      {p.generatedLogoSvg && (
        <div className="rounded border p-4 space-y-2">
          <div className="font-medium">Generated logo preview (MVP)</div>
          <div
            className="border rounded p-2 bg-white"
            dangerouslySetInnerHTML={{ __html: p.generatedLogoSvg }}
          />
          <div className="text-sm text-slate-600">
            Next upgrade: replace this generator with an AI logo generator (OpenAI/Replicate/etc.).
          </div>
        </div>
      )}

      <div className="flex gap-3 flex-wrap">
        <Link className="rounded border px-4 py-2 text-sm" href="/start/legal">Back</Link>
        <Link className="rounded bg-slate-900 text-white px-4 py-2 text-sm" href="/start/operations">
          Next: Operations
        </Link>
      </div>
    </div>
  );
}
