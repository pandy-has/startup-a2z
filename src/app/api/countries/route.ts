import { prisma } from "@/lib/prisma";

export async function GET() {
  const countries = await prisma.country.findMany({
    select: { code: true, name: true },
    orderBy: { name: "asc" }
  });

  return Response.json({ countries });
}
