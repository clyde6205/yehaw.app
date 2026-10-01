import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";
import { getDatabaseUrl } from "../api/env.js";

neonConfig.webSocketConstructor = ws;

const migrationId = "001_yehaw_directory_foundation";
const here = path.dirname(fileURLToPath(import.meta.url));
const migrationPath = path.join(
  here,
  "..",
  "db",
  "migrations",
  `${migrationId}.sql`
);

async function main() {
  const pool = new Pool({ connectionString: getDatabaseUrl() });

  try {
    const hasTableResult = await pool.query(`
      SELECT EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = 'public'
          AND table_name = 'schema_migrations'
      ) AS exists
    `);

    if (hasTableResult.rows[0]?.exists) {
      const existing = await pool.query(
        "SELECT id FROM schema_migrations WHERE id = $1 LIMIT 1",
        [migrationId]
      );

      if (existing.rowCount > 0) {
        console.log(`Migration already applied: ${migrationId}`);
        return;
      }
    }

    const migrationSql = await fs.readFile(migrationPath, "utf8");
    await pool.query(migrationSql);

    const applied = await pool.query(
      "SELECT id FROM schema_migrations WHERE id = $1 LIMIT 1",
      [migrationId]
    );

    if (applied.rowCount !== 1) {
      throw new Error("Migration did not produce its required version record.");
    }

    console.log(`Migration applied: ${migrationId}`);
  } finally {
    await pool.end();
  }
}

main().catch((error) => {
  const code = typeof error?.code === "string" ? ` (${error.code})` : "";
  const message =
    typeof error?.message === "string"
      ? error.message.replace(/(?:postgres(?:ql)?:\/\/|https?:\/\/)\S+/gi, "[redacted]")
      : "Unknown error";

  console.error(`Migration failed${code}: ${message}`);
  process.exitCode = 1;
});