const SUPPLIERS = [
  // Apparel
  { id: "apparel_1", category: "Apparel", name: "Print-on-demand (POD) Vendor", note: "Best for small batches and fast start." },
  { id: "apparel_2", category: "Apparel", name: "Local Cut-and-Sew Manufacturer", note: "Better quality control, usually higher MOQ." },

  // Food
  { id: "food_1", category: "Food", name: "Shared Commercial Kitchen", note: "Rent certified space; check local health rules." },
  { id: "food_2", category: "Food", name: "Co-packer / Food Manufacturer", note: "Produces at scale; requires specs + compliance." },

  // Skincare / Beauty
  { id: "beauty_1", category: "Skincare/Beauty", name: "Private Label Lab", note: "Formulation + packaging; ensure labeling compliance." },
  { id: "beauty_2", category: "Skincare/Beauty", name: "Packaging Supplier", note: "Bottles/jars/labels; good for early prototyping." },

  // Electronics
  { id: "electronics_1", category: "Electronics", name: "Prototype Assembly Partner", note: "Good for early runs and hardware testing." },
  { id: "electronics_2", category: "Electronics", name: "PCB Manufacturer", note: "For circuit board production; lead times vary." },

  // Digital
  { id: "digital_1", category: "Digital", name: "Freelance Dev Marketplace", note: "Useful for fast MVP build if you can’t code." },
  { id: "digital_2", category: "Digital", name: "UI/UX Designer Pool", note: "Branding + UI kits; improves credibility." }
];

export async function GET() {
  return Response.json({ suppliers: SUPPLIERS });
}
