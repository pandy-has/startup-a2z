export default function ResourcesPage() {
  const items = [
    { title: "Business name brainstorming", desc: "Rules + examples to pick a strong name." },
    { title: "Competitor research template", desc: "What to copy, what to avoid." },
    { title: "Pricing basics", desc: "Simple pricing structures for beginners." }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Resources</h1>
      <p className="text-slate-600 max-w-2xl">
        This section is where you’ll expand by country and industry.
      </p>

      <div className="space-y-3">
        {items.map((r) => (
          <div key={r.title} className="rounded border p-4">
            <div className="font-medium">{r.title}</div>
            <div className="text-sm text-slate-600">{r.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
