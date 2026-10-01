# Base44 Dev Environment — Yehaw PWA

## What this is
A fully static PWA (HTML/CSS/JS, no build step, no backend). Served by nginx on port 3000.

## Running
```bash
docker compose -f docker-compose.base44.yml up -d
```
The compose file mounts the repo root into nginx's web root and uses a custom `nginx.conf` (with `user root;`) to work around the sandbox's 700 directory permissions.

## Architecture
- `index.html` — main app shell, loads `js/config.js`, `js/tools.js`, `js/app.js`, `css/styles.css`
- `admin/index.html` — admin console (localStorage-based config, no backend)
- `manifest.json` + `sw.js` — PWA manifest and service worker
- `.env.example` lists `DATABASE_URL`, `ADMIN_SESSION_SECRET`, `APP_BASE_URL` but these are aspirational — the app is fully static and does not use them

## No secrets required
The app has no backend and needs no external credentials to run.

## Editing
Changes to HTML/CSS/JS files are immediately visible on page refresh (nginx serves files directly from the bind mount). No build step or hot-reload server exists; call `reload_preview` after edits if the preview doesn't update.
