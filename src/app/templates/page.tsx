export default function TemplatesPage() {
  const templates = [
    { title: "Simple business plan (1 page)", desc: "Problem, solution, customer, pricing, channels." },
    { title: "Customer interview questions", desc: "Ask the right questions before building." },
    { title: "Brand kit starter", desc: "Logo direction, colors, fonts, voice." }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Templates</h1>
      <p className="text-slate-600 max-w-2xl">
        MVP placeholders — you can later add downloads, Google Docs links, or generated templates.
      </p>

      <div className="space-y-3">
        {templates.map((t) => (
          <div key={t.title} className="rounded border p-4">
            <div className="font-medium">{t.title}</div>
            <div className="text-sm text-slate-600">{t.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
