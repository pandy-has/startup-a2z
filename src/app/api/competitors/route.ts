import { prisma } from "@/lib/prisma";

const COMPETITOR_SEED = [
  {
    name: "Generic Market Leader",
    keywords: ["saas", "subscription", "crm", "management", "platform", "app"],
    summary: "Established product with broad features and brand trust.",
    pros: ["Strong brand", "Many integrations", "Reliable support"],
    cons: ["Expensive", "Complex for beginners", "Hard to customize quickly"]
  },
  {
    name: "Low-cost Alternative",
    keywords: ["cheap", "budget", "simple", "starter", "basic"],
    summary: "Lower price, simpler features, smaller team.",
    pros: ["Affordable", "Easy to start", "Simple UI"],
    cons: ["Fewer features", "Limited support", "Less scalable"]
  },
  {
    name: "Niche Specialist",
    keywords: ["gym", "restaurant", "salon", "clinic", "agency", "ecommerce"],
    summary: "Focused on one industry with tailored workflows.",
    pros: ["Industry fit", "Good templates", "Fast onboarding"],
    cons: ["Less flexible", "Limited outside niche", "Smaller ecosystem"]
  }
];

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").toLowerCase();

  // Simple keyword match scoring
  const scored = COMPETITOR_SEED.map((c) => {
    const score = c.keywords.reduce((acc, kw) => (q.includes(kw) ? acc + 1 : acc), 0);
    return { ...c, score };
  })
    .filter((c) => c.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  // fallback: always return 2 if none matched
  const competitors = scored.length ? scored : COMPETITOR_SEED.slice(0, 2);

  return Response.json({ competitors });
}
