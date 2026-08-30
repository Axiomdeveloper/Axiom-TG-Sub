import { createHash } from "crypto";
import { sql } from "drizzle-orm";

import { db } from "@/db";
import { subscribers } from "@/db/schema";
import { getSubContent } from "@/lib/stats";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const BOT_UA = /bot|spider|crawl|slurp|facebook|whatsapp|discord|preview|monitor|uptime|headless/i;

/**
 * GET /api/sub
 * The subscription endpoint users paste into their V2Ray client.
 * Serves base64-encoded URI list (standard) or ?format=plain.
 * Every fetch is ledgered anonymously so the dashboard knows the user count.
 */
export async function GET(req: Request) {
  await trackClient(req).catch(() => undefined);

  const snapshot = await getSubContent();
  const { searchParams } = new URL(req.url);
  const format = searchParams.get("format") ?? "base64";

  const baseHeaders: Record<string, string> = {
    "content-type": "text/plain; charset=utf-8",
    "cache-control": "no-store",
    "access-control-allow-origin": "*",
    "profile-title": `base64:${Buffer.from("Axiom TG • @axiom_tg_auto").toString("base64")}`,
    "profile-update-interval": "6",
  };

  if (!snapshot || !snapshot.content.trim()) {
    return new Response("Axiom TG subscription is waiting for its first sync (GitHub Action runs every 5 hours).", {
      status: 503,
      headers: baseHeaders,
    });
  }

  const body =
    format === "plain"
      ? snapshot.content
      : Buffer.from(snapshot.content, "utf8").toString("base64");

  return new Response(body, {
    status: 200,
    headers: {
      ...baseHeaders,
      "x-ax-total": String(snapshot.content.split("\n").filter(Boolean).length),
      "x-ax-updated": snapshot.updatedAt.toISOString(),
    },
  });
}

/** Salted-hash upsert of (IP, UA) into the usage ledger. */
async function trackClient(req: Request) {
  const headers = req.headers;
  const ua = headers.get("user-agent") ?? "";
  if (BOT_UA.test(ua)) return; // don't count crawlers/preview bots

  const ip =
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip") ||
    "unknown";

  const salt = process.env.TRACK_SALT ?? "axiom-tg-salt";
  const clientHash = createHash("sha256").update(`${ip}|${ua}|${salt}`).digest("hex").slice(0, 24);

  await db
    .insert(subscribers)
    .values({ clientHash, hits: 1 })
    .onConflictDoUpdate({
      target: subscribers.clientHash,
      set: { hits: sql`${subscribers.hits} + 1`, lastSeen: new Date() },
    });
}
