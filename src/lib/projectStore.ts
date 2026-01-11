export type Project = {
  // IDEA
  problem?: string;
  productDescription?: string;

  // LEGAL
  businessStructure?: string;
  businessStructureOther?: string;
  state?: string; // optional later
  needsEIN?: "yes" | "no";

  // BRANDING
  businessName?: string;
  logoStyle?: string;
  logoSketchDataUrl?: string;
  logoUploadDataUrl?: string;
  generatedLogoSvg?: string; // SVG string

  // OPERATIONS
  bookkeepingChoice?: string;
  estimatedMonthlyBudgetText?: string; // store as text to avoid 0 bug

  // GO-TO-MARKET
  marketType?: "b2c" | "b2b";
  productType?: "service" | "physical" | "digital";
  priceLow?: number;
  priceHigh?: number;

  supplierCategory?: string;
  selectedSuppliers?: string[];

  updatedAt?: string;
};

const KEY = "startupA2Z_project_v2";

export function loadProject(): Project {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Project) : {};
  } catch {
    return {};
  }
}

export function saveProject(p: Project) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify({ ...p, updatedAt: new Date().toISOString() }));
}
