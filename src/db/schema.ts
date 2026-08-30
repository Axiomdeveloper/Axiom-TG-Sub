import { integer, jsonb, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

import type { SubStats } from "@/lib/types";

/**
 * Latest subscription snapshot pushed by the GitHub Action.
 * The table effectively holds exactly one live row (the newest one).
 */
export const subState = pgTable("sub_state", {
  id: serial("id").primaryKey(),
  // Plain newline-separated config URIs (already renamed to «Axiom TG»).
  content: text("content").notNull(),
  // Aggregate stats produced by scripts/fetch_configs.py
  stats: jsonb("stats").$type<SubStats>().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

/**
 * Anonymous usage ledger — one row per unique subscription client.
 * A client is identified by a salted hash of (IP + User-Agent), never raw IP.
 */
export const subscribers = pgTable("subscribers", {
  clientHash: text("client_hash").primaryKey(),
  hits: integer("hits").default(1).notNull(),
  firstSeen: timestamp("first_seen", { withTimezone: true }).defaultNow().notNull(),
  lastSeen: timestamp("last_seen", { withTimezone: true }).defaultNow().notNull(),
});
