const TAKEN_NAMES = ["Startup A–Z", "Acme", "Stripe", "Apple", "Amazon"];

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const name = (searchParams.get("name") || "").trim();

  if (!name) {
    return Response.json({
      result: { status: "unknown", notes: "Enter a name to check." }
    });
  }

  const isLikelyTaken = TAKEN_NAMES.some((n) => n.toLowerCase() === name.toLowerCase());

  return Response.json({
    result: isLikelyTaken
      ? {
          status: "likely_taken",
          notes:
            "This name appears in our internal list. You should also check trademarks, your state registry, and domain availability."
        }
      : {
          status: "not_found_in_app",
          notes:
            "Not found in our internal list. Still check trademarks + state registry + domain before finalizing."
        }
  });
}
