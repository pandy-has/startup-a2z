"use client";

import { useEffect, useState } from "react";

type Country = { code: string; name: string };

export default function CountryPicker() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [country, setCountry] = useState<string>(() => {
    if (typeof window === "undefined") return "US";
    return localStorage.getItem("country") || "US";
  });

  useEffect(() => {
    fetch("/api/countries")
      .then((r) => r.json())
      .then((data) => setCountries(data.countries));
  }, []);

  useEffect(() => {
    localStorage.setItem("country", country);
  }, [country]);

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-slate-600">Country:</span>
      <select
        value={country}
        onChange={(e) => setCountry(e.target.value)}
        className="border rounded px-2 py-1 text-sm"
      >
        {countries.map((c) => (
          <option key={c.code} value={c.code}>
            {c.name}
          </option>
        ))}
      </select>
    </div>
  );
}
