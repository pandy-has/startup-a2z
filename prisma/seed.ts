import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Default country (you can add more later)
  const country = await prisma.country.upsert({
    where: { code: "US" },
    update: {},
    create: { code: "US", name: "United States" }
  });

  // Clear existing items for clean seeding
  await prisma.checklistItem.deleteMany({ where: { countryId: country.id } });

  const items = [
    {
      category: "Idea & Validation",
      title: "Define the problem you are solving",
      description: "Write the problem in one sentence and list who has it.",
      sortOrder: 1
    },
    {
      category: "Idea & Validation",
      title: "Research competitors and alternatives",
      description: "List 5 competitors and what they do well/poorly.",
      sortOrder: 2
    },
    {
      category: "Legal & Setup",
      title: "Choose business structure",
      description: "Sole prop, LLC, corporation — pick what fits your risk/taxes.",
      sortOrder: 3
    },
    {
      category: "Legal & Setup",
      title: "Register your business (state-level if needed)",
      description: "Register name/entity in your state if required for your structure.",
      sortOrder: 4
    },
    {
      category: "Legal & Setup",
      title: "Apply for EIN (if applicable)",
      description: "Most entities need an EIN for taxes/banking.",
      sortOrder: 5
    },
    {
      category: "Branding",
      title: "Pick a name + check domain availability",
      description: "Secure a domain that matches the brand name.",
      sortOrder: 6
    },
    {
      category: "Branding",
      title: "Create a simple logo direction",
      description: "Pick 2-3 style references and decide your vibe (minimal, bold, etc.).",
      sortOrder: 7
    },
    {
      category: "Operations",
      title: "Create an invoice + basic bookkeeping setup",
      description: "Decide how you’ll track income/expenses from day one.",
      sortOrder: 8
    },
    {
      category: "Go-to-Market",
      title: "Define your first offer",
      description: "One offer, one price, one target customer to start.",
      sortOrder: 9
    },
    {
      category: "Go-to-Market",
      title: "Launch a simple landing page",
      description: "Explain offer, who it’s for, and how to contact/buy.",
      sortOrder: 10
    }
  ];

  await prisma.checklistItem.createMany({
    data: items.map((i) => ({
      ...i,
      countryId: country.id,
      link: null
    }))
  });

  console.log("Seeded database.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
