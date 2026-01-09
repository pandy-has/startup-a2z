"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { loadProject, saveProject, type Project } from "@/lib/projectStore";

const BUSINESS_STRUCTURES = [
  {
    value: "Sole Proprietorship",
    blurb: "Simple to start. Owner is personally liable.",
    riskTaxes: "Higher personal risk; taxes pass through to you."
  },
  {
    value: "Partnership",
    blurb: "Two+ owners share profits and responsibilities.",
    riskTaxes: "Shared liability; pass-through taxes (often)."
  },
  {
    value: "LLC",
    blurb: "Flexible structure with liability protection.",
    riskTaxes: "Lower personal risk; pass-through or optional taxation."
  },
  {
    value: "C-Corporation",
    blurb: "Separate legal entity; good for raising VC.",
    riskTaxes: "Strong separation; potential double taxation."
  },
  {
    value: "S-Corporation",
    blurb: "Corp with pass-through taxation (eligibility rules).",
    riskTaxes: "Lower self-employment tax in some cases; rules apply."
  }
];

function estimatePricing(productType?: string, marketType?: string) {
  // Simple MVP heuristics — later you can replace with real market data
  if (productType === "physical" && marketType === "b2c") return { low: 15, high: 60 };
  if (productType === "digital" && marketType === "b2c") return { low: 9, high: 39 };
  if (productType === "service" && marketType === "b2c") return { low: 50, high: 200 };
  if (productType === "service" && marketType === "b2b") return { low: 500, high: 5000 };
  if (productType === "digital" && marketType === "b2b") return { low: 49, high: 299 };
  return { low: 25, high: 150 };
}

export default function StartWizard() {
  const [project, setProject] = useState<Project>({});
  const [competitors, setCompetitors] = useState<any[]>([]);
  const [loadingCompetitors, setLoadingCompetitors] = useState(false);

  useEffect(() => setProject(loadProject()), []);

  function update(next: Partial<Project>) {
    setProject((prev) => {
      const merged = { ...prev, ...next };
      saveProject(merged);
      return merged;
    });
  }

  async function fetchCompetitors() {
    setLoadingCompetitors(true);
    try {
      const country = localStorage.getItem("country") || "US";
      const res = await fetch(
        `/api/competitors?country=${encodeURIComponent(country)}&q=${encodeURIComponent(
          project.productDescription || ""
        )}`
      );
      const data = await res.json();
      setCompetitors(data.competitors || []);
    } finally {
      setLoadingCompetitors(false);
    }
  }

  async function checkName() {
    const res = await fetch(`/api/name-check?name=${encodeURIComponent(project.businessName || "")}`);
    const data = await res.json();
    update({
      nameCheckResult: data.result
    });
  }

  const selectedStructure = useMemo(
    () => BUSINESS_STRUCTURES.find((s) => s.value === project.businessStructure),
    [project.businessStructure]
  );

  const priceSuggestion = useMemo(() => {
    const { low, high } = estimatePricing(project.pricing?.productType, project.pricing?.marketType);
    return { low, high };
  }, [project.pricing?.productType, project.pricing?.marketType]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Start Here (Wizard)</h1>
        <p className="text-slate-600 max-w-2xl">
          Fill this out once, and the app will guide you through legal, branding, operations, and launch — then generate a printable overview.
        </p>
      </div>

      {/* IDEA & VALIDATION */}
      <section className="rounded border p-5 space-y-4">
        <h2 className="text-lg font-semibold">1) Idea & Validation</h2>

        <div className="space-y-2">
          <label className="font-medium">Define the problem</label>
          <textarea
            className="w-full border rounded p-2 min-h-[90px]"
            placeholder="Example: Small gyms struggle to manage memberships and renewals without expensive tools..."
            value={project.problem || ""}
            onChange={(e) => update({ problem: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <label className="font-medium">Product description</label>
          <textarea
            className="w-full border rounded p-2 min-h-[90px]"
            placeholder="Describe what you're selling and to whom. This helps find competitors and pricing."
            value={project.productDescription || ""}
            onChange={(e) => update({ productDescription: e.target.value })}
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            className="rounded bg-slate-900 text-white px-4 py-2 text-sm disabled:opacity-50"
            disabled={!project.productDescription}
            onClick={fetchCompetitors}
          >
            Find competitors
          </button>
          {loadingCompetitors ? <span className="text-sm text-slate-600">Searching…</span> : null}
        </div>

        {competitors.length > 0 && (
          <div className="space-y-2">
            <div className="font-medium">Competitors (MVP suggestions)</div>
            <div className="text-sm text-slate-600">
              These are matched from a seeded dataset by keywords. Later you can plug in real web search.
            </div>
            <div className="space-y-2">
              {competitors.map((c) => (
                <div key={c.name} className="border rounded p-3">
                  <div className="font-medium">{c.name}</div>
                  <div className="text-sm text-slate-600">{c.summary}</div>
                  <div className="grid md:grid-cols-2 gap-2 mt-2 text-sm">
                    <div>
                      <div className="font-medium">What they do well</div>
                      <ul className="list-disc pl-5">
                        {c.pros.map((p: string) => (
                          <li key={p}>{p}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div className="font-medium">What they do poorly</div>
                      <ul className="list-disc pl-5">
                        {c.cons.map((p: string) => (
                          <li key={p}>{p}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* LEGAL & SETUP */}
      <section className="rounded border p-5 space-y-4">
        <h2 className="text-lg font-semibold">2) Legal & Setup (US MVP)</h2>

        <div className="space-y-2">
          <label className="font-medium">Choose business structure</label>
          <select
            className="border rounded px-2 py-2 w-full md:w-[420px]"
            value={project.businessStructure || ""}
            onChange={(e) => update({ businessStructure: e.target.value })}
          >
            <option value="" disabled>
              Select…
            </option>
            {BUSINESS_STRUCTURES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.value}
              </option>
            ))}
            <option value="Other">Other</option>
          </select>

          {selectedStructure && (
            <div className="rounded bg-slate-50 border p-3 text-sm">
              <div>{selectedStructure.blurb}</div>
              <div className="text-slate-600">{selectedStructure.riskTaxes}</div>
            </div>
          )}

          {project.businessStructure === "Other" && (
            <textarea
              className="w-full border rounded p-2 min-h-[70px]"
              placeholder="Tell us what structure you’re considering and why."
              value={project.businessStructureOther || ""}
              onChange={(e) => update({ businessStructureOther: e.target.value })}
            />
          )}
        </div>

        <div className="rounded border p-3 text-sm space-y-2">
          <div className="font-medium">How to register your business (basic guide)</div>
          <ol className="list-decimal pl-5 space-y-1 text-slate-700">
            <li>Pick your structure (above) and your official business name.</li>
            <li>Register with your state (LLC/Corp) or file DBA (“Doing Business As”) if needed.</li>
            <li>Get an EIN if you’ll hire employees, open a business bank account, or your structure requires it.</li>
            <li>Check licenses/permits for your industry and city/county.</li>
          </ol>
          <div className="text-slate-600">
            Later we can make this country/state-specific with exact forms and links.
          </div>
        </div>

        <div className="space-y-2">
          <div className="font-medium">EIN</div>
          <div className="text-sm text-slate-600">
            EIN is a federal tax ID used for taxes, banking, and hiring.
          </div>

          <div className="flex gap-4 text-sm">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="ein"
                checked={project.needsEIN === "yes"}
                onChange={() => update({ needsEIN: "yes" })}
              />
              Yes, I need it
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="ein"
                checked={project.needsEIN === "no"}
                onChange={() => update({ needsEIN: "no" })}
              />
              Not sure / No
            </label>
          </div>

          {project.needsEIN === "yes" && (
            <div className="rounded bg-slate-50 border p-3 text-sm space-y-2">
              <div className="font-medium">EIN application steps (US)</div>
              <ol className="list-decimal pl-5 space-y-1">
                <li>Go to the IRS EIN application page (we’ll add the exact link in your Resources page).</li>
                <li>Choose “Start Application” → select your entity type.</li>
                <li>Enter responsible party details + business address.</li>
                <li>Submit and save the confirmation letter.</li>
              </ol>
              <div className="text-slate-600">
                (We’ll keep this as guidance; for legal certainty, consult a professional.)
              </div>
            </div>
          )}
        </div>
      </section>

      {/* BRANDING */}
      <section className="rounded border p-5 space-y-4">
        <h2 className="text-lg font-semibold">3) Branding</h2>

        <div className="space-y-2">
          <label className="font-medium">Business name</label>
          <div className="flex gap-2 flex-wrap">
            <input
              className="border rounded px-3 py-2 w-full md:w-[420px]"
              placeholder="Type your business name"
              value={project.businessName || ""}
              onChange={(e) => update({ businessName: e.target.value, nameCheckResult: undefined })}
            />
            <button
              className="rounded border px-4 py-2 text-sm disabled:opacity-50"
              disabled={!project.businessName}
              onClick={checkName}
            >
              Check name
            </button>
          </div>

          {project.nameCheckResult && (
            <div className="rounded border p-3 text-sm">
              <div className="font-medium">Result: {project.nameCheckResult.status}</div>
              <div className="text-slate-600">{project.nameCheckResult.notes}</div>
              <div className="mt-2 text-slate-600">
                MVP note: this only checks our internal dataset. Next we can integrate official checks (trademarks, state registry, domain).
              </div>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label className="font-medium">Logo style preference</label>
          <select
            className="border rounded px-2 py-2 w-full md:w-[420px]"
            value={project.logoStyle || ""}
            onChange={(e) => update({ logoStyle: e.target.value })}
          >
            <option value="" disabled>Select…</option>
            <option value="Minimal">Minimal</option>
            <option value="Bold">Bold</option>
            <option value="Luxury">Luxury</option>
            <option value="Playful">Playful</option>
            <option value="Tech">Tech</option>
            <option value="Handmade">Handmade</option>
          </select>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <LogoCanvas
            onChange={(dataUrl) => update({ logoSketchDataUrl: dataUrl })}
            existing={project.logoSketchDataUrl}
          />
          <LogoUpload
            onChange={(dataUrl) => update({ logoUploadDataUrl: dataUrl })}
            existing={project.logoUploadDataUrl}
          />
        </div>

        <div className="text-sm text-slate-600">
          Next step (later): connect this to a logo generator (AI) using your sketch + style + name.
        </div>
      </section>

      {/* OPERATIONS */}
      <section className="rounded border p-5 space-y-4">
        <h2 className="text-lg font-semibold">4) Operations</h2>

        <div className="space-y-2">
          <label className="font-medium">Bookkeeping approach</label>
          <select
            className="border rounded px-2 py-2 w-full md:w-[420px]"
            value={project.bookkeepingChoice || ""}
            onChange={(e) => update({ bookkeepingChoice: e.target.value })}
          >
            <option value="" disabled>Select…</option>
            <option value="Spreadsheet (DIY)">Spreadsheet (DIY)</option>
            <option value="Accounting software (DIY)">Accounting software (DIY)</option>
            <option value="Bookkeeper (professional)">Bookkeeper (professional)</option>
            <option value="CPA (professional)">CPA (professional)</option>
          </select>
          <div className="text-sm text-slate-600">
            DIY = cheaper but takes time. Professionals = better compliance and clean books.
          </div>
        </div>

        <div className="space-y-2">
          <label className="font-medium">Expected monthly beginner budget (estimate)</label>
          <input
            type="number"
            className="border rounded px-3 py-2 w-full md:w-[420px]"
            placeholder="Example: 200"
            value={project.estimatedMonthlyBudget ?? ""}
            onChange={(e) => update({ estimatedMonthlyBudget: Number(e.target.value) })}
          />
          <div className="text-sm text-slate-600">
            Typical early costs: domain/hosting, basic tools, filings (varies), branding assets, ads (optional).
          </div>
        </div>
      </section>

      {/* GO TO MARKET */}
      <section className="rounded border p-5 space-y-4">
        <h2 className="text-lg font-semibold">5) Go-to-market</h2>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="font-medium">Market type</label>
            <select
              className="border rounded px-2 py-2 w-full"
              value={project.pricing?.marketType || ""}
              onChange={(e) =>
                update({ pricing: { ...(project.pricing || {}), marketType: e.target.value as any, currency: "USD" } })
              }
            >
              <option value="" disabled>Select…</option>
              <option value="b2c">B2C (sell to consumers)</option>
              <option value="b2b">B2B (sell to businesses)</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="font-medium">Product type</label>
            <select
              className="border rounded px-2 py-2 w-full"
              value={project.pricing?.productType || ""}
              onChange={(e) =>
                update({ pricing: { ...(project.pricing || {}), productType: e.target.value as any, currency: "USD" } })
              }
            >
              <option value="" disabled>Select…</option>
              <option value="service">Service</option>
              <option value="physical">Physical product</option>
              <option value="digital">Digital product</option>
            </select>
          </div>
        </div>

        <div className="rounded bg-slate-50 border p-3 text-sm">
          <div className="font-medium">Suggested starting price range</div>
          <div className="text-slate-700">
            ${priceSuggestion.low} – ${priceSuggestion.high} (MVP heuristic)
          </div>
          <button
            className="mt-2 rounded border px-3 py-1 text-sm"
            onClick={() =>
              update({
                pricing: {
                  ...(project.pricing || {}),
                  suggestedLow: priceSuggestion.low,
                  suggestedHigh: priceSuggestion.high,
                  currency: "USD"
                }
              })
            }
          >
            Save this range
          </button>
        </div>

        <SupplierPicker
          category={project.supplierCategory}
          selected={project.selectedSuppliers || []}
          onChange={(next) => update(next)}
        />
      </section>

      {/* OVERVIEW */}
      <div className="flex gap-3 flex-wrap">
        <Link className="rounded bg-slate-900 text-white px-4 py-2 text-sm" href="/overview">
          View Overview + Print
        </Link>
        <Link className="rounded border px-4 py-2 text-sm" href="/checklist">
          Go to Checklist
        </Link>
      </div>
    </div>
  );
}

/** Logo Canvas component (inline in same file for simplicity) */
function LogoCanvas({ onChange, existing }: { onChange: (dataUrl: string) => void; existing?: string }) {
  const [ready, setReady] = useState(false);

  useEffect(() => setReady(true), []);

  return (
    <div className="rounded border p-3 space-y-2">
      <div className="font-medium">Roughly draw your logo</div>
      {ready && <CanvasPad onSave={onChange} existing={existing} />}
      <div className="text-xs text-slate-600">Draw → click “Save sketch”.</div>
    </div>
  );
}

function CanvasPad({ onSave, existing }: { onSave: (dataUrl: string) => void; existing?: string }) {
  const id = "logo-canvas";
  useEffect(() => {
    const canvas = document.getElementById(id) as HTMLCanvasElement | null;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // white background
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (existing) {
      const img = new Image();
      img.onload = () => ctx.drawImage(img, 0, 0);
      img.src = existing;
    }

    let drawing = false;
    const getPos = (e: any) => {
      const rect = canvas.getBoundingClientRect();
      const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
      const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
      return { x, y };
    };

    const start = (e: any) => {
      drawing = true;
      const { x, y } = getPos(e);
      ctx.beginPath();
      ctx.moveTo(x, y);
    };
    const move = (e: any) => {
      if (!drawing) return;
      const { x, y } = getPos(e);
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      ctx.strokeStyle = "#111";
      ctx.lineTo(x, y);
      ctx.stroke();
    };
    const end = () => (drawing = false);

    canvas.addEventListener("mousedown", start);
    canvas.addEventListener("mousemove", move);
    window.addEventListener("mouseup", end);

    canvas.addEventListener("touchstart", start, { passive: true });
    canvas.addEventListener("touchmove", move, { passive: true });
    window.addEventListener("touchend", end);

    return () => {
      canvas.removeEventListener("mousedown", start);
      canvas.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", end);
      canvas.removeEventListener("touchstart", start);
      canvas.removeEventListener("touchmove", move);
      window.removeEventListener("touchend", end);
    };
  }, [existing]);

  return (
    <div className="space-y-2">
      <canvas id={id} width={420} height={240} className="border rounded w-full" />
      <div className="flex gap-2">
        <button
          className="rounded border px-3 py-1 text-sm"
          onClick={() => {
            const canvas = document.getElementById(id) as HTMLCanvasElement | null;
            if (!canvas) return;
            onSave(canvas.toDataURL("image/png"));
          }}
        >
          Save sketch
        </button>
        <button
          className="rounded border px-3 py-1 text-sm"
          onClick={() => {
            const canvas = document.getElementById(id) as HTMLCanvasElement | null;
            if (!canvas) return;
            const ctx = canvas.getContext("2d");
            if (!ctx) return;
            ctx.fillStyle = "#fff";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }}
        >
          Clear
        </button>
      </div>
    </div>
  );
}

function LogoUpload({ onChange, existing }: { onChange: (dataUrl: string) => void; existing?: string }) {
  return (
    <div className="rounded border p-3 space-y-2">
      <div className="font-medium">Upload a reference image</div>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (!f) return;
          const reader = new FileReader();
          reader.onload = () => onChange(String(reader.result));
          reader.readAsDataURL(f);
        }}
      />
      {existing && <img src={existing} alt="Uploaded reference" className="mt-2 rounded border" />}
      <div className="text-xs text-slate-600">We store this locally in your browser for now.</div>
    </div>
  );
}

function SupplierPicker({
  category,
  selected,
  onChange
}: {
  category?: string;
  selected: string[];
  onChange: (next: Partial<Project>) => void;
}) {
  const [suppliers, setSuppliers] = useState<{ id: string; name: string; category: string; note: string }[]>([]);

  useEffect(() => {
    fetch("/api/suppliers")
      .then((r) => r.json())
      .then((d) => setSuppliers(d.suppliers || []));
  }, []);

  const categories = Array.from(new Set(suppliers.map((s) => s.category))).sort();
  const list = category ? suppliers.filter((s) => s.category === category) : [];

  return (
    <div className="space-y-2">
      <div className="font-medium">Suppliers (MVP directory)</div>
      <select
        className="border rounded px-2 py-2 w-full md:w-[420px]"
        value={category || ""}
        onChange={(e) => onChange({ supplierCategory: e.target.value, selectedSuppliers: [] })}
      >
        <option value="" disabled>Select category…</option>
        {categories.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      {list.length > 0 && (
        <div className="space-y-2">
          {list.map((s) => (
            <label key={s.id} className="block rounded border p-3 cursor-pointer hover:bg-slate-50">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={selected.includes(s.id)}
                  onChange={(e) => {
                    const next = e.target.checked
                      ? [...selected, s.id]
                      : selected.filter((x) => x !== s.id);
                    onChange({ selectedSuppliers: next });
                  }}
                  className="mt-1"
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
      <div className="text-xs text-slate-600">
        Later: we can fetch real suppliers based on product + location.
      </div>
    </div>
  );
}
