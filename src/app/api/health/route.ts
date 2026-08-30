import { db } from "@/db";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  let dbOk = false;
  try {
    await db.execute(sql`select 1`);
    dbOk = true;
  } catch {
    dbOk = false;
  }
  // Still 200 when DB-only deps lag — the app itself is up and renders fallbacks.
  return Response.json({ ok: true, service: "axiom-tg", db: dbOk, time: new Date().toISOString() });
}
