export default function ResourcesPage() {
  const resources = [
    {
      title: "Register your business (SBA guide)",
      desc: "How registration works in the U.S. based on structure + location.",
      url: "https://www.sba.gov/business-guide/launch-your-business/register-your-business"
    },
    {
      title: "State registration links (NASS corporate registration)",
      desc: "Pick your state/territory to find official filing + name database links.",
      url: "https://www.nass.org/business-services/corporate-registration"
    },
    {
      title: "Get an EIN (IRS official)",
      desc: "Apply online (free). Avoid sites that charge for EIN.",
      url: "https://www.irs.gov/businesses/small-businesses-self-employed/get-an-employer-identification-number"
    },
    {
      title: "Trademark search (USPTO)",
      desc: "Search whether a name/mark is already registered.",
      url: "https://www.uspto.gov/trademarks/search"
    },
    {
      title: "Licenses & permits (SBA)",
      desc: "Figure out what licenses/permits you need (federal/state/local).",
      url: "https://www.sba.gov/business-guide/launch-your-business/apply-licenses-permits"
    }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">US Official Resources</h1>
      <p className="text-slate-600 max-w-2xl">
        These are official sources (SBA/IRS/USPTO/NASS). Always use these over paid “middleman” sites.
      </p>

      <div className="space-y-3">
        {resources.map((r) => (
          <div key={r.title} className="rounded border p-4">
            <div className="font-medium">{r.title}</div>
            <div className="text-sm text-slate-600 mt-1">{r.desc}</div>
            <a
              className="text-sm underline mt-2 inline-block"
              href={r.url}
              target="_blank"
              rel="noreferrer"
            >
              Open resource
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
