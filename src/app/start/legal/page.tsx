"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { loadProject, saveProject, type Project } from "@/lib/projectStore";

const STRUCTURES = [
  {
    value: "Sole Proprietorship",
    desc: "Simple to start, but you’re personally liable.",
    risk: "High personal risk; taxes on personal return."
  },
  {
    value: "Partnership",
    desc: "Two+ owners share profits and responsibility.",
    risk: "Shared liability; pass-through taxes (often)."
  },
  {
    value: "LLC",
    desc: "Liability protection + flexible taxes.",
    risk: "Lower personal risk; pass-through or optional taxation."
  },
  {
    value: "C-Corporation",
    desc: "Separate entity; common for raising investors.",
    risk: "Lower personal risk; possible double taxation."
  },
  {
    value: "S-Corporation",
    desc: "Corp with pass-through taxation (rules apply).",
    risk: "Lower risk; potential payroll/tax advantages."
  }
];

export default function LegalPage() {
  const [p, setP] = useState<Project>({});

  useEffect(() => setP(loadProject()), []);

  function update(next: Partial<Project>) {
    setP((prev) => {
      const merged = { ...prev, ...next };
      saveProject(merged);
      return merged;
    });
  }

  const selected = useMemo(
    () => STRUCTURES.find((s) => s.value === p.businessStructure),
    [p.businessStructure]
  );

  const proSuggestion = useMemo(() => {
    const text = (p.productDescription || "").toLowerCase();
    const structure = p.businessStructure;

    const needsAttorney =
      structure === "C-Corporation" ||
      text.includes("health") ||
      text.includes("medical") ||
      text.includes("finance") ||
      text.includes("insurance") ||
      text.includes("kids");

    const needsCPA =
      text.includes("ecommerce") ||
      text.includes("shop") ||
      text.includes("subscription") ||
      text.includes("employees") ||
      structure === "S-Corporation";

    return { needsAttorney, needsCPA };
  }, [p.productDescription, p.businessStructure]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">2) Legal & Setup (US)</h1>

      <div className="space-y-2">
        <label className="font-medium">Choose business structure</label>
        <select
          className="border rounded px-3 py-2 w-full max-w-md"
          value={p.businessStructure || ""}
          onChange={(e) => update({ businessStructure: e.target.value })}
        >
          <option value="" disabled>Select…</option>
          {STRUCTURES.map((s) => (
            <option key={s.value} value={s.value}>{s.value}</option>
          ))}
          <option value="Other">Other</option>
        </select>

        {selected && (
          <div className="rounded bg-slate-50 border p-3 text-sm">
            <div>{selected.desc}</div>
            <div className="text-slate-600">{selected.risk}</div>
          </div>
        )}

        {p.businessStructure === "Other" && (
          <textarea
            className="border rounded p-2 w-full max-w-md"
            value={p.businessStructureOther || ""}
            onChange={(e) => update({ businessStructureOther: e.target.value })}
            placeholder="Tell us what structure you’re considering."
          />
        )}
      </div>

      <div className="rounded border p-4 text-sm space-y-2">
        <div className="font-medium">How to register (US)</div>
        <ol className="list-decimal pl-5 space-y-1">
          <li>Pick your structure and the state you operate in.</li>
          <li>Register LLC/Corp with your state (or file DBA if needed).</li>
          <li>Get an EIN if needed (often required for bank account and hiring).</li>
          <li>Check licenses/permits (federal/state/local).</li>
        </ol>

        <div className="flex gap-3 flex-wrap pt-2">
          <a className="underline" target="_blank" rel="noreferrer"
             href="https://www.sba.gov/business-guide/launch-your-business/register-your-business">
            SBA: Register your business
          </a>
          <a className="underline" target="_blank" rel="noreferrer"
             href="https://www.nass.org/business-services/corporate-registration">
            NASS: State registration links
          </a>
        </div>
      </div>

      <div className="space-y-2">
        <div className="font-medium">EIN</div>
        <div className="text-sm text-slate-600">
          EIN is a federal tax ID used for taxes, banking, and hiring.
        </div>

        <div className="flex gap-4 text-sm">
          <label className="flex gap-2 items-center">
            <input type="radio" checked={p.needsEIN === "yes"} onChange={() => update({ needsEIN: "yes" })} />
            Yes
          </label>
          <label className="flex gap-2 items-center">
            <input type="radio" checked={p.needsEIN === "no"} onChange={() => update({ needsEIN: "no" })} />
            No / Not sure
          </label>
        </div>

        {p.needsEIN === "yes" && (
          <div className="rounded bg-slate-50 border p-3 text-sm space-y-2">
            <div className="font-medium">How to get an EIN (official IRS)</div>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Open the IRS EIN page (free).</li>
              <li>Start online application.</li>
              <li>Choose entity type and complete details.</li>
              <li>Save your confirmation letter.</li>
            </ol>
            <a className="underline" target="_blank" rel="noreferrer"
               href="https://www.irs.gov/businesses/small-businesses-self-employed/get-an-employer-identification-number">
              IRS: Get an EIN
            </a>
          </div>
        )}
      </div>

      {/* PROFESSIONAL SUGGESTIONS */}
      <div className="rounded border p-4 space-y-2">
        <div className="font-medium">Professional suggestions</div>
        <div className="text-sm text-slate-600">
          Based on your business details, here’s what typically helps:
        </div>

        <ul className="list-disc pl-5 text-sm">
          <li>
            <span className="font-medium">Attorney:</span>{" "}
            {proSuggestion.needsAttorney ? "Recommended" : "Optional"}
            {" "}— useful for regulated industries, investor setups, contracts, IP.
          </li>
          <li>
            <span className="font-medium">CPA/Tax pro:</span>{" "}
            {proSuggestion.needsCPA ? "Recommended" : "Optional"}
            {" "}— useful if you’ll have inventory, subscriptions, payroll, or S-Corp.
          </li>
          <li>
            <span className="font-medium">Free mentor:</span>{" "}
            Recommended — SCORE mentors can guide you.
            {" "}
            <a className="underline" target="_blank" rel="noreferrer" href="https://www.score.org/">
              SCORE
            </a>
          </li>
        </ul>
      </div>

      <div className="flex gap-3 flex-wrap">
        <Link className="rounded border px-4 py-2 text-sm" href="/start/idea">Back</Link>
        <Link className="rounded bg-slate-900 text-white px-4 py-2 text-sm" href="/start/branding">
          Next: Branding
        </Link>
      </div>
    </div>
  );
}
