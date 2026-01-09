export type Project = {
  problem?: string;
  productDescription?: string;

  businessStructure?: string;
  businessStructureOther?: string;
  needsEIN?: "yes" | "no";
  einReason?: string;

  businessName?: string;
  nameCheckResult?: { status: "unknown" | "likely_taken" | "not_found_in_app"; notes: string };

  logoStyle?: string;
  logoSketchDataUrl?: string; // from canvas
  logoUploadDataUrl?: string; // from file upload

  bookkeepingChoice?: string;
  estimatedMonthlyBudget?: number;

  pricing?: {
    marketType?: "b2c" | "b2b";
    productType?: "service" | "physical" | "digital";
    suggestedLow?: number;
    suggestedHigh?: number;
    currency?: string;
  };

  supplierCategory?: string;
  selectedSuppliers?: string[];

  updatedAt?: string;
};

const KEY = "startupA2Z_project_v1";

export function loadProject(): Project {
  if (typeof window === "undefined") return {};
  const raw = localStorage.getItem(KEY);
  return raw ? (JSON.parse(raw) as Project) : {};
}

export function saveProject(p: Project) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify({ ...p, updatedAt: new Date().toISOString() }));
}
