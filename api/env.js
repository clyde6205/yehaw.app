import "dotenv/config";

export function getDatabaseUrl() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("Server configuration is incomplete.");
  }

  return databaseUrl;
}
