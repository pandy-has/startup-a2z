import "./globals.css";
import Nav from "@/components/Nav";

export const metadata = {
  title: "Startup A–Z",
  description: "A–Z guide for starting a business"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Nav />
        <main className="mx-auto max-w-5xl px-4 py-10">{children}</main>
      </body>
    </html>
  );
}
