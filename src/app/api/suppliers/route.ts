const SUPPLIERS = [
  { id: "s1", category: "Apparel", name: "Print-on-demand Vendor", note: "Good for small batches; quick start." },
  { id: "s2", category: "Apparel", name: "Local Manufacturer", note: "Better quality control; higher minimum order." },
  { id: "s3", category: "Skincare", name: "Private Label Lab", note: "Handles formulation + packaging; compliance needed." },
  { id: "s4", category: "Food", name: "Commercial Kitchen (Shared)", note: "Rent space to produce legally; check permits." },
  { id: "s5", category: "Electronics", name: "Prototype Assembly Partner", note: "Useful for early runs and testing." }
];

export async function GET() {
  return Response.json({ suppliers: SUPPLIERS });
}
