// Yehaw API — enterprise backend for millions of Filipinos and OFWs.
// Serves the directory, recipes, live PHP rates, launch analytics, server
// search, automated + manual content updates, and the Founders Control Panel API.

"use strict";
const express = require("express");
const crypto = require("crypto");
const { pool, init, getSetting, setSetting } = require("./db");

const app = express();
const PORT = process.env.PORT || 4000;
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "";

app.disable("x-powered-by");
app.use(express.json({ limit: "256kb" }));
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  next();
});

// ---------- lightweight per-IP rate limiter (POSTs) ----------
const hits = new Map();
setInterval(() => {
  const now = Date.now();
  for (const [k, arr] of hits) {
    const alive = arr.filter((t) => now - t < 60000);
    if (alive.length) hits.set(k, alive); else hits.delete(k);
  }
}, 30000).unref();

function rateLimit(max, windowMs = 60000) {
  return (req, res, next) => {
    const key = req.ip || "unknown";
    const now = Date.now();
    const arr = (hits.get(key) || []).filter((t) => now - t < windowMs);
    if (arr.length >= max) return res.status(429).json({ error: "Too many requests — sandali lang" });
    arr.push(now);
    hits.set(key, arr);
    next();
  };
}

// ---------- helpers ----------
async function getConfig() {
  return getSetting("config", {
    rates: {}, tools: [], recipeSites: [],
    adsense: { client: "", slots: {} }, broadcast: null, flags: {}
  });
}

async function getContentVersion() {
  return getSetting("content_version", "2.0.0");
}

function slugify(name) {
  return String(name).toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "entry-" + Date.now();
}

async function logUpdate(kind, note, version) {
  await pool.query("INSERT INTO updates (kind, note, content_version) VALUES ($1,$2,$3)", [kind, note, version]);
}

// ---------- automated updates ----------
const OFW_CURRENCIES = ["USD", "EUR", "JPY", "GBP", "AUD", "SGD", "CAD", "CNY", "KRW", "HKD", "AED", "SAR", "QAR", "KWD", "MYR", "TWD"];

async function refreshRates() {
  const res = await fetch("https://open.er-api.com/v6/latest/PHP", { signal: AbortSignal.timeout(10000) });
  const data = await res.json();
  if (!data || !data.rates) throw new Error("Rates source unavailable");
  const cfg = await getConfig();
  const old = cfg.rates || {};
  const next = { ...old };
  let changed = false;
  for (const cur of OFW_CURRENCIES) {
    const phpPer = data.rates[cur] ? Math.round((1 / data.rates[cur]) * 10000) / 10000 : null;
    if (phpPer && next[cur] !== phpPer) { next[cur] = phpPer; changed = true; }
  }
  cfg.rates = next;
  cfg.ratesUpdatedAt = new Date().toISOString();
  await setSetting("config", cfg);
  return { changed, rates: next };
}

async function bumpVersion() {
  const v = await getContentVersion();
  const parts = String(v).split(".").map((n) => parseInt(n, 10) || 0);
  parts[2] = (parts[2] || 0) + 1;
  const nv = parts.join(".");
  await setSetting("content_version", nv);
  return nv;
}

async function runAutoUpdate() {
  try {
    const { changed } = await refreshRates();
    if (changed) {
      const v = await getContentVersion();
      await logUpdate("auto", "Automated update: live PHP rates refreshed for OFW currencies", v);
      console.log("[auto-update] rates refreshed, version", v);
    }
  } catch (err) {
    console.error("[auto-update] failed:", err.message);
  }
}

// ---------- public API ----------
app.get("/api/health", async (req, res) => {
  let db = false;
  try { await pool.query("SELECT 1"); db = true; } catch {}
  res.status(db ? 200 : 503).json({ ok: db, service: "yehaw-api", db });
});

app.get("/api/bootstrap", async (req, res) => {
  try {
    const [services, recipes, config, version, updates] = await Promise.all([
      pool.query(
        `SELECT slug, name, icon, color, url, category, description, featured, launches
         FROM services WHERE active ORDER BY featured DESC, name ASC`
      ),
      pool.query(
        `SELECT slug, name, time, servings, ingredients, steps
         FROM recipes WHERE active ORDER BY name ASC`
      ),
      getConfig(),
      getContentVersion(),
      pool.query("SELECT kind, note, content_version, created_at FROM updates ORDER BY created_at DESC LIMIT 5")
    ]);
    res.set("Cache-Control", "public, max-age=60, stale-while-revalidate=300");
    res.json({
      version,
      updatedAt: new Date().toISOString(),
      services: services.rows,
      recipes: recipes.rows,
      config: {
        rates: config.rates || {},
        ratesUpdatedAt: config.ratesUpdatedAt || null,
        tools: config.tools || [],
        recipeSites: config.recipeSites || [],
        adsense: config.adsense || {},
        broadcast: config.broadcast || null,
        flags: config.flags || {}
      },
      updates: updates.rows
    });
  } catch (err) {
    console.error("[bootstrap]", err.message);
    res.status(500).json({ error: "Bootstrap failed" });
  }
});

app.get("/api/search", async (req, res) => {
  try {
    const q = String(req.query.q || "").trim().slice(0, 60);
    if (!q) return res.json({ results: [] });
    const like = "%" + q.replace(/[%_\\]/g, "") + "%";
    const lower = q.toLowerCase();
    const [srv, rcp, config] = await Promise.all([
      pool.query(
        `SELECT slug, name, icon, color, category, 'service' AS kind
         FROM services
         WHERE active AND (name ILIKE $1 OR description ILIKE $1 OR category ILIKE $1)
         ORDER BY launches DESC LIMIT 8`,
        [like]
      ),
      pool.query(
        `SELECT slug, name, '🍲' AS icon, 'recipe' AS kind FROM recipes WHERE active AND name ILIKE $1 LIMIT 4`,
        [like]
      ),
      getConfig()
    ]);
    const tools = (config.tools || [])
      .filter((t) => (t.name || "").toLowerCase().includes(lower))
      .slice(0, 4)
      .map((t) => ({ slug: t.id, name: t.name, icon: t.icon, kind: "tool" }));
    res.set("Cache-Control", "public, max-age=30");
    res.json({ results: [...srv.rows, ...tools, ...rcp.rows] });
  } catch (err) {
    res.status(500).json({ error: "Search failed" });
  }
});

app.post("/api/launch", rateLimit(60), async (req, res) => {
  try {
    const body = req.body || {};
    const slug = String(body.slug || "").slice(0, 80);
    const kind = String(body.kind || "service").slice(0, 20);
    const deviceId = String(body.deviceId || "").slice(0, 64);
    if (!slug) return res.status(400).json({ error: "slug required" });
    await pool.query("INSERT INTO launches (slug, kind, device_id) VALUES ($1,$2,$3)", [slug, kind, deviceId]);
    if (kind === "service") {
      await pool.query("UPDATE services SET launches = launches + 1 WHERE slug = $1", [slug]);
    }
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: "Tracking failed" });
  }
});

// ---------- founders control panel API ----------
function adminAuth(req, res, next) {
  if (!ADMIN_TOKEN) return res.status(503).json({ error: "Founder key not configured yet — set ADMIN_TOKEN" });
  const provided = (req.headers.authorization || "").replace(/^Bearer\s+/i, "");
  const a = Buffer.from(provided);
  const b = Buffer.from(ADMIN_TOKEN);
  if (a.length === b.length && crypto.timingSafeEqual(a, b)) return next();
  return res.status(401).json({ error: "Unauthorized" });
}

app.post("/api/admin/login", rateLimit(20), async (req, res) => {
  if (!ADMIN_TOKEN) return res.status(503).json({ error: "Founder key not configured yet — set ADMIN_TOKEN" });
  const key = String((req.body || {}).key || "");
  const a = Buffer.from(key);
  const b = Buffer.from(ADMIN_TOKEN);
  if (a.length === b.length && crypto.timingSafeEqual(a, b)) {
    return res.json({ ok: true, version: await getContentVersion() });
  }
  return res.status(401).json({ error: "Wrong founder key" });
});

app.get("/api/admin/stats", adminAuth, async (req, res) => {
  try {
    const [svc, rcp, total, devices7, top, daily, recent, updates] = await Promise.all([
      pool.query("SELECT count(*)::int AS n FROM services WHERE active"),
      pool.query("SELECT count(*)::int AS n FROM recipes WHERE active"),
      pool.query("SELECT count(*)::int AS n FROM launches"),
      pool.query("SELECT count(DISTINCT device_id)::int AS n FROM launches WHERE created_at > now() - interval '7 days' AND device_id <> ''"),
      pool.query("SELECT slug, name, icon, launches FROM services ORDER BY launches DESC, name ASC LIMIT 8"),
      pool.query(
        `SELECT to_char(d::date, 'MM-DD') AS day, COUNT(l.id)::int AS n
         FROM generate_series(CURRENT_DATE - INTERVAL '6 days', CURRENT_DATE, INTERVAL '1 day') d
         LEFT JOIN launches l ON l.created_at >= d AND l.created_at < d + INTERVAL '1 day'
         GROUP BY d ORDER BY d`
      ),
      pool.query(
        `SELECT l.slug, l.kind, l.created_at, s.name AS service_name, s.icon
         FROM launches l LEFT JOIN services s ON s.slug = l.slug
         ORDER BY l.created_at DESC LIMIT 20`
      ),
      pool.query("SELECT kind, note, content_version, created_at FROM updates ORDER BY created_at DESC LIMIT 10")
    ]);
    res.json({
      totals: {
        services: svc.rows[0].n,
        recipes: rcp.rows[0].n,
        launches: total.rows[0].n,
        devices7d: devices7.rows[0].n
      },
      top: top.rows,
      daily: daily.rows,
      recent: recent.rows,
      updates: updates.rows,
      autoUpdate: { enabled: true, everyHours: 6, lastRatesAt: (await getConfig()).ratesUpdatedAt || null }
    });
  } catch (err) {
    console.error("[stats]", err.message);
    res.status(500).json({ error: "Stats failed" });
  }
});

app.get("/api/admin/services", adminAuth, async (req, res) => {
  const r = await pool.query("SELECT * FROM services ORDER BY category, name");
  res.json({ services: r.rows });
});

app.post("/api/admin/services", adminAuth, async (req, res) => {
  try {
    const b = req.body || {};
    if (!b.name || !b.url) return res.status(400).json({ error: "name and url required" });
    const r = await pool.query(
      `INSERT INTO services (slug, name, icon, color, url, category, description)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [slugify(b.name), String(b.name).slice(0, 80), b.icon || "🌐", b.color || "#1e3a5f",
       String(b.url), b.category || "app", b.description || ""]
    );
    const v = await bumpVersion();
    await logUpdate("manual", `Service added: ${b.name}`, v);
    res.json({ ok: true, service: r.rows[0], version: v });
  } catch (err) {
    res.status(400).json({ error: err.code === "23505" ? "That service already exists" : "Create failed" });
  }
});

app.put("/api/admin/services/:id", adminAuth, async (req, res) => {
  try {
    const b = req.body || {};
    const r = await pool.query(
      `UPDATE services SET
         name = COALESCE($2, name), icon = COALESCE($3, icon), color = COALESCE($4, color),
         url = COALESCE($5, url), category = COALESCE($6, category), description = COALESCE($7, description),
         active = COALESCE($8, active), updated_at = now()
       WHERE id = $1 RETURNING *`,
      [req.params.id, b.name, b.icon, b.color, b.url, b.category, b.description, b.active]
    );
    if (!r.rows.length) return res.status(404).json({ error: "Not found" });
    const v = await bumpVersion();
    await logUpdate("manual", `Service updated: ${r.rows[0].name}`, v);
    res.json({ ok: true, service: r.rows[0], version: v });
  } catch {
    res.status(400).json({ error: "Update failed" });
  }
});

app.delete("/api/admin/services/:id", adminAuth, async (req, res) => {
  const r = await pool.query("DELETE FROM services WHERE id = $1 RETURNING name", [req.params.id]);
  if (!r.rows.length) return res.status(404).json({ error: "Not found" });
  const v = await bumpVersion();
  await logUpdate("manual", `Service removed: ${r.rows[0].name}`, v);
  res.json({ ok: true, version: v });
});

app.get("/api/admin/recipes", adminAuth, async (req, res) => {
  const r = await pool.query("SELECT * FROM recipes ORDER BY name");
  res.json({ recipes: r.rows });
});

app.post("/api/admin/recipes", adminAuth, async (req, res) => {
  try {
    const b = req.body || {};
    if (!b.name) return res.status(400).json({ error: "name required" });
    const toList = (t) => String(t || "").split("\n").map((s) => s.trim()).filter(Boolean);
    const r = await pool.query(
      `INSERT INTO recipes (slug, name, time, servings, ingredients, steps)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [slugify(b.name), String(b.name).slice(0, 100), b.time || "", b.servings || "",
       JSON.stringify(toList(b.ingredients)), JSON.stringify(toList(b.steps))]
    );
    const v = await bumpVersion();
    await logUpdate("manual", `Recipe added: ${b.name}`, v);
    res.json({ ok: true, recipe: r.rows[0], version: v });
  } catch (err) {
    res.status(400).json({ error: err.code === "23505" ? "That recipe already exists" : "Create failed" });
  }
});

app.put("/api/admin/recipes/:id", adminAuth, async (req, res) => {
  try {
    const b = req.body || {};
    const toList = (t) => (t === undefined ? null : String(t).split("\n").map((s) => s.trim()).filter(Boolean));
    const r = await pool.query(
      `UPDATE recipes SET
         name = COALESCE($2, name), time = COALESCE($3, time), servings = COALESCE($4, servings),
         ingredients = COALESCE($5::jsonb, ingredients), steps = COALESCE($6::jsonb, steps),
         active = COALESCE($7, active), updated_at = now()
       WHERE id = $1 RETURNING *`,
      [req.params.id, b.name, b.time, b.servings,
       toList(b.ingredients) ? JSON.stringify(toList(b.ingredients)) : null,
       toList(b.steps) ? JSON.stringify(toList(b.steps)) : null,
       b.active]
    );
    if (!r.rows.length) return res.status(404).json({ error: "Not found" });
    const v = await bumpVersion();
    await logUpdate("manual", `Recipe updated: ${r.rows[0].name}`, v);
    res.json({ ok: true, recipe: r.rows[0], version: v });
  } catch {
    res.status(400).json({ error: "Update failed" });
  }
});

app.delete("/api/admin/recipes/:id", adminAuth, async (req, res) => {
  const r = await pool.query("DELETE FROM recipes WHERE id = $1 RETURNING name", [req.params.id]);
  if (!r.rows.length) return res.status(404).json({ error: "Not found" });
  const v = await bumpVersion();
  await logUpdate("manual", `Recipe removed: ${r.rows[0].name}`, v);
  res.json({ ok: true, version: v });
});

app.get("/api/admin/config", adminAuth, async (req, res) => {
  res.json({ config: await getConfig(), version: await getContentVersion() });
});

app.put("/api/admin/config", adminAuth, async (req, res) => {
  try {
    const b = req.body || {};
    const cfg = await getConfig();
    if (b.rates) cfg.rates = { ...cfg.rates, ...b.rates };
    if (b.adsense) cfg.adsense = { ...(cfg.adsense || {}), ...b.adsense };
    if (Array.isArray(b.tools)) cfg.tools = b.tools;
    if (Array.isArray(b.recipeSites)) cfg.recipeSites = b.recipeSites;
    if (b.broadcast !== undefined) cfg.broadcast = b.broadcast;
    if (b.flags) cfg.flags = { ...(cfg.flags || {}), ...b.flags };
    await setSetting("config", cfg);
    const v = await bumpVersion();
    await logUpdate("manual", "Configuration updated from Founders Panel", v);
    res.json({ ok: true, config: cfg, version: v });
  } catch {
    res.status(400).json({ error: "Config update failed" });
  }
});

// Manual content update — refreshes live rates now, bumps the content version,
// logs the change. Clients pick it up on next bootstrap (cache max-age 60s).
app.post("/api/admin/update", adminAuth, async (req, res) => {
  try {
    let ratesInfo = null;
    try { ratesInfo = await refreshRates(); } catch (e) { ratesInfo = { changed: false, error: e.message }; }
    const v = await bumpVersion();
    await logUpdate("manual", String((req.body || {}).note || "Manual content update published"), v);
    res.json({ ok: true, version: v, ratesChanged: ratesInfo.changed, ratesError: ratesInfo.error || null });
  } catch (err) {
    res.status(500).json({ error: "Update failed" });
  }
});

app.post("/api/admin/refresh-rates", adminAuth, async (req, res) => {
  try {
    const { changed } = await refreshRates();
    res.json({ ok: true, changed });
  } catch (err) {
    res.status(502).json({ error: "Rates source unavailable: " + err.message });
  }
});

app.get("/api/admin/updates", adminAuth, async (req, res) => {
  const r = await pool.query("SELECT kind, note, content_version, created_at FROM updates ORDER BY created_at DESC LIMIT 30");
  res.json({ updates: r.rows });
});

app.use((req, res) => res.status(404).json({ error: "Not found" }));

// ---------- boot ----------
(async () => {
  let tries = 0;
  while (true) {
    try { await init(); break; }
    catch (err) {
      tries++;
      console.error(`[boot] database not ready (${tries}):`, err.message);
      if (tries >= 15) { console.error("[boot] giving up"); process.exit(1); }
      await new Promise((r) => setTimeout(r, 3000));
    }
  }
  if (!ADMIN_TOKEN) console.warn("[boot] ADMIN_TOKEN not set — Founders Panel will stay locked until it is provided");
  runAutoUpdate();
  setInterval(runAutoUpdate, 6 * 60 * 60 * 1000).unref();
  app.listen(PORT, "0.0.0.0", () => console.log(`[yehaw-api] listening on ${PORT}`));
})();
