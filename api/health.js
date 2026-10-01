import { getDatabaseUrl } from "./env.js";

export default async function handler(request, response) {
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    return response.status(405).json({ error: "Method not allowed." });
  }

  try {
    getDatabaseUrl();

    return response.status(200).json({
      ok: true,
      service: "yehaw-api",
      databaseConfigured: true
    });
  } catch {
    return response.status(503).json({
      ok: false,
      error: "Service configuration is unavailable."
    });
  }
}
