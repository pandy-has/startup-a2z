import Link from "next/link";

export default function StartHere() {
  const steps = [
    { title: "Pick your business type", desc: "Service, product, online store, agency, etc." },
    { title: "Validate the idea", desc: "Talk to 5 potential customers; write pain points." },
    { title: "Decide legal structure", desc: "Choose entity type and plan your registrations." },
    { title: "Brand basics", desc: "Name, domain, logo direction, brand tone." },
    { title: "Launch plan", desc: "Offer, price, landing page, first outreach." }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Start Here</h1>
      <p className="text-slate-600 max-w-2xl">
        This is your “do this first” path. After this, use the checklist to complete each item.
      </p>

      <ol className="space-y-3">
        {steps.map((s, idx) => (
          <li key={s.title} className="rounded border p-4">
            <div className="font-medium">
              {idx + 1}. {s.title}
            </div>
            <div className="text-sm text-slate-600">{s.desc}</div>
          </li>
        ))}
      </ol>

      <div className="flex gap-3">
        <Link className="rounded bg-slate-900 text-white px-4 py-2 text-sm" href="/checklist">
          Go to Checklist
        </Link>
        <Link className="rounded border px-4 py-2 text-sm" href="/resources">
          Helpful Resources
        </Link>
      </div>
    </div>
  );
}
