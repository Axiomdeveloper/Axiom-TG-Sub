/**
 * Axiom TG — DB seed helper.
 * Pushes the locally generated sub/ + stats.json into Postgres,
 * exactly like the GitHub Action does via POST /api/ingest.
 *
 * Usage:  DATABASE_URL=... node scripts/seed-db.mjs
 */
import { readFileSync } from "node:fs";
import process from "node:process";
import pg from "pg";

const { Pool } = pg;

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is required");
  process.exit(1);
}

const plain = readFileSync("sub/axiom_plain.txt", "utf8").trim() + "\n";
const stats = JSON.parse(readFileSync("stats.json", "utf8"));

const pool = new Pool({ connectionString: url });
try {
  await pool.query("DELETE FROM sub_state");
  await pool.query("INSERT INTO sub_state(content, stats) VALUES ($1, $2::jsonb)", [
    plain,
    JSON.stringify(stats),
  ]);
  console.log(`seeded sub_state: ${stats.total} configs, fresh24h=${stats.fresh24h}`);
} finally {
  await pool.end();
}
