type Competitor = {
  name: string;
  tags: string[];
  summary: string;
  pros: string[];
  cons: string[];
};

const COMPETITORS: Competitor[] = [
  {
    name: "Shopify",
    tags: ["ecommerce", "online store", "shop", "payments", "shipping"],
    summary: "All-in-one ecommerce platform.",
    pros: ["Fast setup", "Huge app ecosystem", "Payments + shipping integrations"],
    cons: ["Monthly fees add up", "Customization can get expensive", "Apps can increase costs"]
  },
  {
    name: "Squarespace",
    tags: ["website", "portfolio", "landing page", "design", "store"],
    summary: "Website builder with templates and basic commerce.",
    pros: ["Great templates", "Easy to publish", "Good for simple sites"],
    cons: ["Less flexible than dev stack", "Advanced commerce limited", "Platform constraints"]
  },
  {
    name: "QuickBooks",
    tags: ["bookkeeping", "accounting", "invoicing", "taxes"],
    summary: "Popular small-business accounting software.",
    pros: ["Strong bookkeeping features", "Invoicing", "Accountant friendly"],
    cons: ["Can feel complex", "Pricing tiers", "Setup takes time"]
  },
  {
    name: "Notion + Sheets (DIY alternative)",
    tags: ["notion", "spreadsheet", "excel", "google sheets", "manual"],
    summary: "A common DIY system founders use early.",
    pros: ["Cheap/free", "Flexible", "No vendor lock-in"],
    cons: ["Easy to mess up", "Hard to scale", "No automated workflows"]
  },
  {
    name: "HubSpot (Starter)",
    tags: ["crm", "sales", "marketing", "pipeline", "leads"],
    summary: "CRM + marketing tools with a strong free/starter tier.",
    pros: ["Good CRM", "Marketing tools", "Scales with business"],
    cons: ["Can get pricey at scale", "Many features = learning curve", "Add-ons cost extra"]
  }
];

function score(text: string, tags: string[]) {
  let s = 0;
  for (const t of tags) {
    if (text.includes(t)) s += 2;
  }
  // extra boost for partial words
  const words = text.split(/\s+/).filter(Boolean);
  for (const w of words) {
    for (const t of tags) {
      if (t.includes(w) && w.length >= 4) s += 1;
    }
  }
  return s;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").toLowerCase().trim();

  if (!q) return Response.json({ competitors: [] });

  const ranked = COMPETITORS.map((c) => ({ ...c, _score: score(q, c.tags) }))
    .sort((a, b) => b._score - a._score)
    .filter((c) => c._score > 0)
    .slice(0, 5)
    .map(({ _score, ...rest }) => rest);

  return Response.json({ competitors: ranked.length ? ranked : COMPETITORS.slice(0, 3) });
}
