"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

/* ------------------ Types ------------------ */
type Project = {
  problem?: string;
  productDescription?: string;

  businessStructure?: string;
  businessStructureOther?: string;
  needsEIN?: "yes" | "no";

  businessName?: string;
  nameCheckResult?: {
    status: "likely_taken" | "not_found";
    note: string;
  };
};

/* ------------------ Constants ------------------ */
const BUSINESS_STRUCTURES = [
  {
    name: "Sole Proprietorship",
    desc: "Simple to start, but no personal liability protection.",
    risk: "High personal risk, simple taxes"
  },
  {
    name: "Partnership",
    desc: "Two or more owners share profits and responsibility.",
    risk: "Shared risk, pass-through taxes"
  },
  {
    name: "LLC",
    desc: "Flexible structure with liability protection.",
    risk: "Low personal risk, flexible taxation"
  },
  {
    name: "C-Corporation",
    desc: "Separate legal entity, best for VC funding.",
    risk: "Low personal risk, double taxation"
  },
  {
    name: "S-Corporation",
    desc: "Corp with pass-through taxation (eligibility rules).",
    risk: "Low risk, tax advantages"
  }
];

const TAKEN_NAMES = ["Apple", "Amazon", "Stripe", "Acme", "Startup A–Z"];

const STORAGE_KEY = "startupA2Z_project_v1";


/* ------------------ Component ------------------ */
export default function StartWizard() {
  const [project, setProject] = useState<Project>({});

  /* -------- Helpers -------- */
  function update(data: Partial<Project>) {
    setProject((prev) => ({ ...prev, ...data }));
  }

  function checkBusinessName() {
    if (!project.businessName) return;

    const taken = TAKEN_NAMES.some(
      (n) => n.toLowerCase() === project.businessName!.toLowerCase()
    );

    update({
      nameCheckResult: taken
        ? {
            status: "likely_taken",
            note:
              "This name appears commonly used. You must check USPTO and your state registry."
          }
        : {
            status: "not_found",
            note:
              "Not found in our internal list. Still verify via USPTO and state registry."
          }
    });
  }

  const selectedStructure = BUSINESS_STRUCTURES.find(
    (s) => s.name === project.businessStructure
  );

  /* ------------------ UI ------------------ */
  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">Start Your Business</h1>
        <p className="text-slate-600 max-w-2xl">
          Answer these once — we’ll guide you through legal setup, branding, and
          next steps.
        </p>
      </div>

      {/* ================= STEP 2 ================= */}
      <section className="rounded border p-5 space-y-5">
        <h2 className="text-lg font-semibold">2) Legal & Setup (US)</h2>

        {/* Business structure */}
        <div className="space-y-2">
          <label className="font-medium">Choose a business structure</label>
          <select
            className="border rounded px-3 py-2 w-full max-w-md"
            value={project.businessStructure || ""}
            onChange={(e) =>
              update({ businessStructure: e.target.value })
            }
          >
            <option value="" disabled>
              Select a structure
            </option>
            {BUSINESS_STRUCTURES.map((s) => (
              <option key={s.name} value={s.name}>
                {s.name}
              </option>
            ))}
            <option value="Other">Other</option>
          </select>

          {selectedStructure && (
            <div className="rounded bg-slate-50 border p-3 text-sm">
              <div>{selectedStructure.desc}</div>
              <div className="text-slate-600">{selectedStructure.risk}</div>
            </div>
          )}

          {project.businessStructure === "Other" && (
            <textarea
              className="border rounded p-2 w-full max-w-md"
              placeholder="Explain what structure you are considering"
              value={project.businessStructureOther || ""}
              onChange={(e) =>
                update({ businessStructureOther: e.target.value })
              }
            />
          )}
        </div>

        {/* Registration */}
        <div className="rounded border p-4 text-sm space-y-2">
          <div className="font-medium">How to register your business (US)</div>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Choose your structure and state.</li>
            <li>Register LLC or Corporation with your state.</li>
            <li>File DBA if operating under a different name.</li>
            <li>Check licenses and permits.</li>
          </ol>

          <div className="flex gap-3 flex-wrap">
            <a
              className="underline"
              target="_blank"
              rel="noreferrer"
              href="https://www.sba.gov/business-guide/launch-your-business/register-your-business"
            >
              SBA Registration Guide
            </a>
            <a
              className="underline"
              target="_blank"
              rel="noreferrer"
              href="https://www.nass.org/business-services/corporate-registration"
            >
              State Registration Links
            </a>
          </div>
        </div>

        {/* EIN */}
        <div className="space-y-2">
          <div className="font-medium">Do you need an EIN?</div>
          <p className="text-sm text-slate-600">
            EIN is required for hiring, business banking, and most LLCs/Corps.
          </p>

          <div className="flex gap-4 text-sm">
            <label className="flex gap-2">
              <input
                type="radio"
                checked={project.needsEIN === "yes"}
                onChange={() => update({ needsEIN: "yes" })}
              />
              Yes
            </label>
            <label className="flex gap-2">
              <input
                type="radio"
                checked={project.needsEIN === "no"}
                onChange={() => update({ needsEIN: "no" })}
              />
              Not sure / No
            </label>
          </div>

          {project.needsEIN === "yes" && (
            <div className="rounded bg-slate-50 border p-3 text-sm space-y-2">
              <div className="font-medium">How to get an EIN (US)</div>
              <ol className="list-decimal pl-5 space-y-1">
                <li>Go to the official IRS EIN page.</li>
                <li>Choose online application.</li>
                <li>Fill responsible party details.</li>
                <li>Download confirmation letter.</li>
              </ol>
              <a
                className="underline"
                target="_blank"
                rel="noreferrer"
                href="https://www.irs.gov/businesses/small-businesses-self-employed/get-an-employer-identification-number"
              >
                IRS – Get an EIN
              </a>
            </div>
          )}
        </div>
      </section>

      {/* ================= STEP 3 ================= */}
      <section className="rounded border p-5 space-y-5">
        <h2 className="text-lg font-semibold">3) Branding</h2>

        {/* Business name */}
        <div className="space-y-2">
          <label className="font-medium">Business name</label>
          <div className="flex gap-2 flex-wrap">
            <input
              className="border rounded px-3 py-2 w-full max-w-md"
              placeholder="Enter your business name"
              value={project.businessName || ""}
              onChange={(e) =>
                update({ businessName: e.target.value, nameCheckResult: undefined })
              }
            />
            <button
              className="rounded border px-4 py-2 text-sm"
              onClick={checkBusinessName}
              disabled={!project.businessName}
            >
              Check name
            </button>
          </div>

          {project.nameCheckResult && (
            <div className="rounded border p-3 text-sm space-y-2">
              <div className="font-medium">
                {project.nameCheckResult.status === "likely_taken"
                  ? "Likely taken"
                  : "Not found internally"}
              </div>
              <div className="text-slate-600">
                {project.nameCheckResult.note}
              </div>

              <div className="flex gap-3 flex-wrap">
                <a
                  className="underline"
                  target="_blank"
                  rel="noreferrer"
                  href="https://www.uspto.gov/trademarks/search"
                >
                  USPTO Trademark Search
                </a>
                <a
                  className="underline"
                  target="_blank"
                  rel="noreferrer"
                  href="https://www.nass.org/business-services/corporate-registration"
                >
                  State Name Search
                </a>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <div className="flex gap-3">
        <Link
          href="/overview"
          className="rounded bg-slate-900 text-white px-4 py-2 text-sm"
        >
          View Overview
        </Link>
        <Link
          href="/checklist"
          className="rounded border px-4 py-2 text-sm"
        >
          Go to Checklist
        </Link>
      </div>
    </div>
  );
}
