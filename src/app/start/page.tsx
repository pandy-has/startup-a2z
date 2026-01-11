import Link from "next/link";

export default function StartIndex() {
  const steps = [
    { href: "/start/idea", title: "1) Idea & Validation", desc: "Problem + product description + competitors" },
    { href: "/start/legal", title: "2) Legal & Setup (US)", desc: "Structure + registration + EIN + professional suggestions" },
    { href: "/start/branding", title: "3) Branding", desc: "Name checks + logo generator" },
    { href: "/start/operations", title: "4) Operations", desc: "Bookkeeping + monthly budget" },
    { href: "/start/market", title: "5) Go-to-market", desc: "Pricing suggestions + suppliers" }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Start Here</h1>
      <p className="text-slate-600 max-w-2xl">
        Use the steps below. Each step is its own page.
      </p>

      <div className="grid md:grid-cols-2 gap-3">
        {steps.map((s) => (
          <Link key={s.href} href={s.href} className="rounded border p-4 hover:bg-slate-50">
            <div className="font-medium">{s.title}</div>
            <div className="text-sm text-slate-600 mt-1">{s.desc}</div>
          </Link>
        ))}
      </div>

      <div className="flex gap-3 flex-wrap">
        <Link className="rounded bg-slate-900 text-white px-4 py-2 text-sm" href="/overview">
          Overview + Print
        </Link>
        <Link className="rounded border px-4 py-2 text-sm" href="/checklist">
          Checklist
        </Link>
      </div>
    </div>
  );
}
