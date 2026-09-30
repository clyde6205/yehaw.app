# Yehaw.app — Build / Deploy Prompt for Mistral (or any AI coder)

Copy everything below this line into Mistral (or your preferred AI) when you want it to refine, harden, or deploy this project.

---

You are building **yehaw.app**, a mobile-first Progressive Web App for Filipinos.

## Goal
Fastest possible launch of a **tools page + service launcher** that:
- Works offline for tools
- Has zero external APIs
- Is extremely fast on mobile
- Keeps users from “drifting” (persistent home chrome)
- Is monetizable with Google AdSense
- Has a real admin console

## Already implemented (do not rewrite from scratch)
The full codebase is in this folder:
- `index.html` — main shell, top bar, bottom nav, ad slots, views
- `css/styles.css` — dark mobile-first UI
- `js/config.js` — tools list, services list (GCash, Maya, Grab, Foodpanda, Jollibee…), static PHP rates
- `js/tools.js` — 10 pure client-side tools (calculator, currency, tip, BMI, loan, unit, %, age, password, text)
- `js/app.js` — navigation, launcher intercept, PWA install prompt, local stats
- `admin/index.html` — password-protected console to edit rates, services, tools, AdSense IDs, view launch stats
- `manifest.json` + `sw.js` — PWA ready
- Simple icons in `/icons/`

## What you must do / improve

1. **Make it production-ready**
   - Replace all `ca-pub-XXXXXXXXXXXXXXXX` and ad slot placeholders with real AdSense values (or keep as clear placeholders).
   - Ensure HTTPS-only, correct `start_url` and `scope`.
   - Add a proper robots.txt and basic security headers suggestion (CSP that allows AdSense).

2. **“Always return to Yehaw” behavior**
   - Keep the fixed top bar + bottom nav.
   - Services open in `_blank` so the Yehaw tab stays alive.
   - On Android/iOS when installed as PWA, the home screen icon always opens Yehaw.
   - Document that true “default browser” is not possible for a PWA without user action; the sticky chrome is the practical solution.

3. **Admin console hardening**
   - Current password is stored in localStorage (fine for single-admin MVP).
   - Optionally add a simple server-side auth later, but keep the client-side version working for zero-backend launch.
   - Ability to reorder services, toggle visibility, edit icons/colors/urls without breaking JSON.

4. **Speed**
   - Keep zero frameworks.
   - Critical CSS already inline-friendly.
   - Service worker caches the shell aggressively.
   - Lazy-load nothing unnecessary.

5. **Monetization checklist for me (the owner)**
   - Create AdSense account → get publisher ID
   - Add site yehaw.app → wait for approval
   - Create two ad units (top banner, mid rectangle)
   - Paste IDs into Admin → Save AdSense
   - Also update the `<script>` tags in index.html once
   - Optional later: other ad networks, affiliate links on services, sponsored tool slots

6. **Deploy (choose one, prefer fastest)**
   - Cloudflare Pages / Vercel / Netlify / any static host
   - Point yehaw.app DNS to it
   - Enable HTTPS
   - Test “Add to Home Screen” on Android Chrome and iOS Safari

7. **Optional nice-to-haves (only if fast)**
   - Simple “Recently used” section on home
   - Dark/light toggle (default dark)
   - Tagalog labels option
   - Basic analytics via Plausible or Cloudflare Web Analytics (privacy-friendly)

## Constraints (do not break)
- No external APIs for tools or rates
- No user accounts required for normal use
- Mobile is #1
- Must remain installable as PWA
- Admin must stay functional offline on the same device

## Success criteria
- User opens yehaw.app on phone → sees tools + launcher in < 1.5 s
- Can use calculator / rates offline
- Taps GCash → opens GCash, can switch back to Yehaw instantly
- I can change services list and rates from /admin without redeploying code
- AdSense units render after approval
- Install prompt appears; installed app opens full-screen to home

Start by reviewing the existing files, then produce a clean, ready-to-deploy package and a short deploy checklist.
