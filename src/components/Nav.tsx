import Link from "next/link";

export default function Nav() {
  return (
    <header className="border-b">
      <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
        <Link href="/" className="font-semibold text-lg">
          Startup A–Z
        </Link>
        <nav className="flex gap-4 text-sm">
          <Link className="hover:underline" href="/start">Start Here</Link>
          <Link className="hover:underline" href="/checklist">Checklist</Link>
          <Link className="hover:underline" href="/resources">Resources</Link>
          <Link className="hover:underline" href="/templates">Templates</Link>
        </nav>
      </div>
    </header>
  );
}
