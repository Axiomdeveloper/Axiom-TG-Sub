import { count, desc, sum } from "drizzle-orm";

import { db } from "@/db";
import { subState, subscribers } from "@/db/schema";
import { RETENTION_HOURS, UPDATE_EVERY_HOURS, type SubStats } from "./types";
import { nextRunFrom } from "./fa";

export interface DashboardStats extends SubStats {
  /** false until the GitHub Action pushes its first snapshot */
  synced: boolean;
  /** ISO of when the current snapshot was stored */
  syncedAt: string | null;
  /** Estimated next sync (lastRun + cadence) */
  nextRun: string | null;
}

export const EMPTY_STATS: DashboardStats = {
  version: 1,
  brand: "Axiom TG",
  lastRun: null,
  total: 0,
  fresh24h: 0,
  users: 0,
  hits: 0,
  updateEveryHours: UPDATE_EVERY_HOURS,
  retentionHours: RETENTION_HOURS,
  perChannel: [],
  synced: false,
  syncedAt: null,
  nextRun: null,
};

/** Latest subscription stats merged with the live usage ledger. Never throws. */
export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const [row, u, h] = await Promise.all([
      db.select().from(subState).orderBy(desc(subState.updatedAt)).limit(1).then((r) => r[0] ?? null),
      db.select({ c: count() }).from(subscribers).then((r) => r[0]?.c ?? 0),
      db
        .select({ s: sum(subscribers.hits) })
        .from(subscribers)
        .then((r) => r[0]?.s ?? "0"),
    ]);

    const stored = row?.stats;
    const syncedAt = row?.updatedAt ? row.updatedAt.toISOString() : null;
    const lastRun = stored?.lastRun ?? syncedAt;

    return {
      ...EMPTY_STATS,
      ...(stored ?? {}),
      users: Number(u),
      hits: Number(h ?? 0),
      lastRun,
      synced: Boolean(row),
      syncedAt,
      nextRun: nextRunFrom(lastRun, stored?.updateEveryHours ?? UPDATE_EVERY_HOURS),
    };
  } catch (error) {
    console.warn("[stats] falling back to empty stats:", error);
    return EMPTY_STATS;
  }
}

/** Raw subscription content (plain URI list) or null before first sync. */
export async function getSubContent(): Promise<{ content: string; updatedAt: Date } | null> {
  try {
    const row = await db
      .select()
      .from(subState)
      .orderBy(desc(subState.updatedAt))
      .limit(1)
      .then((r) => r[0] ?? null);
    if (!row) return null;
    return { content: row.content, updatedAt: row.updatedAt };
  } catch {
    return null;
  }
}
