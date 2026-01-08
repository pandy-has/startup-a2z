import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("country") || "US";

  const country = await prisma.country.findUnique({ where: { code } });
  if (!country) {
    return Response.json({ items: [] });
  }

  const items = await prisma.checklistItem.findMany({
    where: { countryId: country.id },
    select: {
      id: true,
      category: true,
      title: true,
      description: true,
      sortOrder: true
    },
    orderBy: { sortOrder: "asc" }
  });

  return Response.json({ items });
}
