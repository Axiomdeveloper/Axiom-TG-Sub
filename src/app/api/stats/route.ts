import { getDashboardStats } from "@/lib/stats";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BADGE_COLORS: Record<string, string> = {
  users: "00e0a4",
  hits: "7c5cff",
  configs: "00a3ff",
  fresh: "ffb020",
};

/**
 * GET /api/stats            → full dashboard JSON
 * GET /api/stats?badge=users|hits|configs|fresh → shields.io endpoint-format badge
 *   (usable in the GitHub README as:
 *    https://img.shields.io/endpoint?url=<APP_URL>/api/stats?badge=users)
 */
export async function GET(req: Request) {
  const data = await getDashboardStats();
  const { searchParams } = new URL(req.url);
  const badge = searchParams.get("badge");

  if (badge) {
    const message =
      badge === "users"
        ? data.users
        : badge === "hits"
          ? data.hits
          : badge === "fresh"
            ? data.fresh24h
            : data.total;
    return Response.json(
      {
        schemaVersion: 1,
        label: `Axiom TG · ${badge}`,
        message: String(message),
        color: BADGE_COLORS[badge] ?? BADGE_COLORS.configs,
        cacheSeconds: 300,
      },
      { headers: { "cache-control": "public, s-maxage=300" } },
    );
  }

  return Response.json(data, { headers: { "cache-control": "no-store" } });
}
