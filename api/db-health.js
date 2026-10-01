import { neon } from "@neondatabase/serverless";
import { getDatabaseUrl } from "./env.js";

export default async function handler(request, response) {
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    return response.status(405).json({ error: "Method not allowed." });
  }

  try {
    const sql = neon(getDatabaseUrl());
    const rows = await sql`SELECT 1 AS ok`;

    return response.status(200).json({
      ok: rows[0]?.ok === 1,
      databaseReachable: true
    });
  } catch {
    return response.status(503).json({
      ok: false,
      error: "Database service is unavailable."
    });
  }
}