import { prisma } from "@/lib/prisma";

const COMPETITOR_SEED = [
  {
    name: "Market Leader (Example)",
    keywords: ["saas", "platform", "crm", "subscription", "dashboard", "software", "app"],
    summary: "A broad, mature product with many features and strong brand trust.",
    pros: ["Strong brand", "Many integrations", "Reliable support"],
    cons: ["Expensive", "Complex for beginners", "Hard to customize quickly"]
  },
  {
    name: "Low-Cost Alternative (Example)",
    keywords: ["cheap", "budget", "simple", "starter", "beginner", "basic"],
    summary: "Lower pricing, simpler feature set, easier to start quickly.",
    pros: ["Affordable", "Simple UI", "Quick setup"],
    cons: ["Fewer advanced features", "Limited support", "May not scale"]
  },
  {
    name: "Niche Specialist (Example)",
    keywords: ["gym", "fitness", "restaurant", "salon", "clinic", "agency", "ecommerce", "shop"],
    summary: "Focused on one industry with tailored workflows and templates.",
    pros: ["Great industry fit", "Good templates", "Faster onboarding"],
    cons: ["Less flexible outside niche", "Smaller ecosystem", "Limited customization"]
  },
  {
    name: "DIY / Spreadsheet Solution (Example)",
    keywords: ["excel", "spreadsheet", "google sheets", "notion", "manual"],
    summary: "Not a direct product competitor, but a common alternative founders use.",
    pros: ["Very cheap", "Flexible", "No lock-in"],
    cons: ["Time-consuming", "Error-prone", "Hard to scale"]
  }
];

function scoreCompetitor(productDesc: string, keywords: string[]) {
  let score = 0;
  for (const kw of keywords) {
    if (productDesc.includes(kw)) score += 1;
  }
  return score;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").toLowerCase().trim();

  if (!q) {
    return Response.json({ competitors: [] });
  }

  const ranked = COMPETITOR_SEED.map((c) => ({
    ...c,
    score: scoreCompetitor(q, c.keywords)
  }))
    .sort((a, b) => b.score - a.score)
    .filter((c) => c.score > 0)
    .slice(0, 5);

  // fallback so user always sees something
  const competitors = ranked.length ? ranked : COMPETITOR_SEED.slice(0, 2);

  return Response.json({ competitors });
}
