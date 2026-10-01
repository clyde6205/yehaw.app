// Yehaw API — PostgreSQL layer.
// Uses your Neon database when NEON_DATABASE_URL is set, otherwise the local
// compose Postgres via DATABASE_URL. Everything for millions of users is
// pooled, indexed and served with short-lived cache windows.

"use strict";
const { Pool } = require("pg");

function connectionString() {
  return (
    process.env.NEON_DATABASE_URL ||
    process.env.DATABASE_URL ||
    "postgres://yehaw:yehaw_dev@127.0.0.1:5432/yehaw"
  );
}

const cs = connectionString();
const needsSsl = /neon\.tech|sslmode=require|sslmode=verify/i.test(cs);
const pool = new Pool({
  connectionString: cs,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 8000,
  ...(needsSsl ? { ssl: { rejectUnauthorized: false } } : {})
});

const SCHEMA = `
CREATE TABLE IF NOT EXISTS services (
  id SERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT '🌐',
  color TEXT NOT NULL DEFAULT '#1e3a5f',
  url TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'app',
  description TEXT NOT NULL DEFAULT '',
  featured BOOLEAN NOT NULL DEFAULT false,
  active BOOLEAN NOT NULL DEFAULT true,
  launches INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS services_active_idx ON services (active, category);

CREATE TABLE IF NOT EXISTS recipes (
  id SERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  time TEXT NOT NULL DEFAULT '',
  servings TEXT NOT NULL DEFAULT '',
  ingredients JSONB NOT NULL DEFAULT '[]',
  steps JSONB NOT NULL DEFAULT '[]',
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS launches (
  id BIGSERIAL PRIMARY KEY,
  slug TEXT NOT NULL,
  kind TEXT NOT NULL DEFAULT 'service',
  device_id TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS launches_created_idx ON launches (created_at);
CREATE INDEX IF NOT EXISTS launches_slug_idx ON launches (slug);
CREATE INDEX IF NOT EXISTS launches_device_idx ON launches (device_id);

CREATE TABLE IF NOT EXISTS updates (
  id SERIAL PRIMARY KEY,
  kind TEXT NOT NULL DEFAULT 'manual',
  note TEXT NOT NULL,
  content_version TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
`;

async function getSetting(key, fallback) {
  const r = await pool.query("SELECT value FROM settings WHERE key = $1", [key]);
  return r.rows.length ? r.rows[0].value : fallback;
}

async function setSetting(key, value) {
  await pool.query(
    `INSERT INTO settings (key, value, updated_at) VALUES ($1, $2, now())
     ON CONFLICT (key) DO UPDATE SET value = $2, updated_at = now()`,
    [key, JSON.stringify(value)]
  );
}

async function init() {
  await pool.query(SCHEMA);
  const seed = require("./seed");

  const s = await pool.query("SELECT count(*)::int AS n FROM services");
  if (!s.rows[0].n) {
    for (const srv of seed.SERVICES) {
      await pool.query(
        `INSERT INTO services (slug, name, icon, color, url, category, description)
         VALUES ($1,$2,$3,$4,$5,$6,$7) ON CONFLICT (slug) DO NOTHING`,
        [srv.slug, srv.name, srv.icon, srv.color, srv.url, srv.category, srv.description || ""]
      );
    }
    await pool.query(
      "INSERT INTO updates (kind, note, content_version) VALUES ('manual', 'Initial directory + OFW services seeded', '2.0.0')"
    );
  }

  const r = await pool.query("SELECT count(*)::int AS n FROM recipes");
  if (!r.rows[0].n) {
    for (const rec of seed.RECIPES) {
      await pool.query(
        `INSERT INTO recipes (slug, name, time, servings, ingredients, steps)
         VALUES ($1,$2,$3,$4,$5,$6) ON CONFLICT (slug) DO NOTHING`,
        [rec.slug, rec.name, rec.time, rec.servings, JSON.stringify(rec.ingredients), JSON.stringify(rec.steps)]
      );
    }
  }

  const cfg = await getSetting("config", null);
  if (!cfg) await setSetting("config", seed.DEFAULT_CONFIG);
  const ver = await getSetting("content_version", null);
  if (!ver) await setSetting("content_version", "2.0.0");
}

module.exports = { pool, init, getSetting, setSetting };
