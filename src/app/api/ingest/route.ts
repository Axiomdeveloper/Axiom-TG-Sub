import { count, sum } from "drizzle-orm";

import { db } from "@/db";
import { subState, subscribers } from "@/db/schema";
import type { SubStats } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/ingest
 * Called by the GitHub Action after every harvest cycle.
 * Auth: Authorization: Bearer <INGEST_SECRET>
 * Body: { "plain": "<newline-separated configs>", "stats": <SubStats> }
 * Responds with the live usage numbers so the Action can embed them in the repo.
 */
export async function POST(req: Request) {
  const secret = process.env.INGEST_SECRET;
  if (!secret) {
    return Response.json(
      { ok: false, error: "INGEST_SECRET is not configured on the server" },
      { status: 503 },
    );
  }

  const auth = req.headers.get("authorization") ?? "";
  if (auth !== `Bearer ${secret}`) {
    return Response.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "invalid JSON body" }, { status: 400 });
  }

  const { plain, stats } = (body ?? {}) as { plain?: unknown; stats?: unknown };
  if (typeof plain !== "string" || !plain.trim()) {
    return Response.json({ ok: false, error: "`plain` must be a non-empty string" }, { status: 400 });
  }
  if (!stats || typeof stats !== "object") {
    return Response.json({ ok: false, error: "`stats` must be an object" }, { status: 400 });
  }

  const cleanStats = stats as SubStats;

  // Keep a single live row: wipe + insert.
  await db.delete(subState);
  await db.insert(subState).values({ content: plain.trim() + "\n", stats: cleanStats });

  const [u, h] = await Promise.all([
    db.select({ c: count() }).from(subscribers).then((r) => r[0]?.c ?? 0),
    db
      .select({ s: sum(subscribers.hits) })
      .from(subscribers)
      .then((r) => r[0]?.s ?? "0"),
  ]);
  const uniqueUsers = Number(u);
  const totalHits = Number(h ?? 0);

  return Response.json({
    ok: true,
    acceptedAt: new Date().toISOString(),
    totalConfigs: cleanStats.total ?? plain.split("\n").filter(Boolean).length,
    uniqueUsers,
    totalHits,
  });
}
