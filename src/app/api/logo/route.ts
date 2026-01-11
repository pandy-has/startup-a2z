function escapeXml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const name = String(body?.name || "Your Brand").slice(0, 40);
  const style = String(body?.style || "Minimal");

  const safeName = escapeXml(name);
  const safeStyle = escapeXml(style);

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="900" height="300" viewBox="0 0 900 300">
  <rect width="100%" height="100%" fill="#ffffff"/>
  <circle cx="140" cy="150" r="78" fill="#111111"/>
  <text x="140" y="162" font-size="54" font-family="Arial" fill="#ffffff" text-anchor="middle">${safeName[0] || "A"}</text>
  <text x="260" y="150" font-size="54" font-family="Arial" fill="#111111">${safeName}</text>
  <text x="260" y="200" font-size="20" font-family="Arial" fill="#555555">Style: ${safeStyle}</text>
</svg>`.trim();

  return Response.json({ svg });
}
