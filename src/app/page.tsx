import Link from "next/link";
import CountryPicker from "@/components/CountryPicker";

export default function HomePage() {
  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-6 flex-wrap">
        <div className="space-y-3">
          <h1 className="text-3xl font-semibold">
            Startup A–Z: from idea → legal → brand → launch
          </h1>
          <p className="text-slate-600 max-w-2xl">
            A practical guide for first-time entrepreneurs. Start with a simple flow,
            then use the checklist to complete everything step-by-step.
          </p>
          <div className="flex gap-3">
            <Link className="rounded bg-slate-900 text-white px-4 py-2 text-sm" href="/start">
              Start Here
            </Link>
            <Link className="rounded border px-4 py-2 text-sm" href="/checklist">
              View Checklist
            </Link>
          </div>
        </div>
        <CountryPicker />
      </div>

      <div className="grid md:grid-cols-4 gap-3">
        {[
          ["Idea", "Validate your idea and define your offer."],
          ["Legal", "Know what paperwork and structure you need."],
          ["Brand", "Name, logo direction, and basic brand kit."],
          ["Launch", "Simple go-to-market steps to get first customers."]
        ].map(([title, desc]) => (
          <div key={title} className="rounded border p-4">
            <div className="font-medium">{title}</div>
            <div className="text-sm text-slate-600 mt-1">{desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
