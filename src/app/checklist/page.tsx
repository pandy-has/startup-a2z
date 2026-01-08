import CountryPicker from "@/components/CountryPicker";
import ChecklistClient from "@/components/ChecklistClient";

export default function ChecklistPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold">Checklist</h1>
          <p className="text-slate-600">
            Track progress locally in your browser. (Later you can add accounts.)
          </p>
        </div>
        <CountryPicker />
      </div>

      <ChecklistClient />
    </div>
  );
}
