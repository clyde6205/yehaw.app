import { neon } from "@neondatabase/serverless";
import { getDatabaseUrl } from "../env.js";

export const DIRECTORY_CACHE_CONTROL =
  "public, max-age=0, s-maxage=300, stale-while-revalidate=86400";

export function allowGetOnly(request, response) {
  if (request.method === "GET") {
    return true;
  }

  response.setHeader("Allow", "GET");
  response.status(405).json({ error: "Method not allowed." });
  return false;
}

export function setDirectoryCache(response) {
  response.setHeader("Cache-Control", DIRECTORY_CACHE_CONTROL);
}

export function setNoStore(response) {
  response.setHeader("Cache-Control", "no-store");
}

export function getDirectorySql() {
  return neon(getDatabaseUrl());
}

export function unavailable(response) {
  setNoStore(response);
  return response.status(503).json({
    error: "Directory updates are temporarily unavailable."
  });
}

export function normalizeSearchQuery(value) {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim().replace(/\s+/g, " ").toLowerCase();

  if (!normalized || normalized.length > 80) {
    return null;
  }

  return normalized;
}
