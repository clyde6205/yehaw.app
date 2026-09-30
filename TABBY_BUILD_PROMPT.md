# TABBY BUILD PROMPT — Yehaw Tools & Fast Browser
### Full production upgrade from existing codebase

Copy everything below the line into Tabby as the master instruction. Tabby must treat the existing files in this project as the starting point and produce a complete, deployable result.

---

## ROLE & MISSION

You are Tabby, an expert full-stack engineer and product designer specializing in high-performance Progressive Web Apps for emerging markets. Your single mission:

**Turn the existing Yehaw codebase into a stunningly Filipino, ultra-fast Launcher + Tools + Browser PWA that Filipinos (especially OFWs and daily mobile users) will lock into as their default organized home for tools, remittance, services, and quick browsing.**

Success = viral adoption potential through cultural resonance + daily utility + speed.

## PRODUCT IDENTITY (LOCK THIS IN)

- **Name:** Yehaw
- **Positioning line:** Yehaw Tools & Fast Browser
- **Tagline options (pick the strongest or combine):**
  - “Full Filipino Directory + Fast Tools”
  - “Your everyday launcher. Tools, remittance, recipes, services — one tap.”
  - “Made for Filipinos. Built for speed.”
- **Core promise:** The fastest, most organized way for a Filipino to open the apps/services they already use + the tools they need daily (currency, calculator, recipes, remittance) without hunting through a messy phone home screen.
- **Target users:** Everyday mobile Filipinos + OFWs who send/receive money, check rates, cook, order food, pay bills, open GCash/Maya/Grab/Foodpanda constantly.

## NON-NEGOTIABLE REQUIREMENTS

1. **Stunningly Filipino visuals**
   - Color system must feel Filipino: deep greens, warm golds/yellows, confident reds, clean whites, dark mode that feels premium not generic.
   - Suggested primary palette direction:
     - Deep forest / bayanihan green
     - Warm gold / sun yellow accents
     - Clean off-white / soft slate
     - Strong dark mode for night use (OFWs abroad, night-shift workers)
   - Typography: highly readable on small screens, friendly but modern. Prefer system fonts first for speed, with optional distinctive display font for brand only.
   - Icons and service tiles must look native and trustworthy. Use clear letter marks or simple recognizable symbols. Avoid generic Western flat design that feels foreign.
   - Micro-interactions: subtle, fast, satisfying (scale on press, smooth view transitions). Never slow.

2. **Extremely fast**
   - Target: first meaningful paint < 1.2 s on mid-range Android.
   - Zero heavy frameworks. Keep pure HTML/CSS/vanilla JS or the lightest possible addition.
   - Aggressive service worker caching of the shell + tools.
   - Images/icons optimized or pure CSS/SVG where possible.
   - No layout shift. No blocking third-party scripts except AdSense (loaded async/deferred).

3. **Launcher / Browser behavior that creates lock-in**
   - Persistent top chrome + bottom navigation always visible.
   - Home button always returns to Yehaw instantly.
   - External services (GCash, Maya, Grab, Foodpanda, remittance apps, banks, recipe sites) open in a controlled way (prefer new tab / external so Yehaw stays in task switcher; on installed PWA the icon always re-opens Yehaw).
   - Make the PWA install experience excellent. Prompt at the right moment. When installed, it should feel like a real app.
   - Clear messaging that this is their organized launcher + tools home. Do not pretend it can forcibly become the system default browser (impossible for a PWA without OS permission), but make it so sticky and useful that users choose it as their daily starting point.

4. **Tools that match real daily habits**
   - Keep and polish existing tools: Calculator, PHP currency rates (static offline), Tip, BMI, Loan estimate, Unit converter, %, Age/Days, Password, Text tools.
   - Recipes must stay (Adobo, Sinigang, Tinola, Tocino, Pancit, Kare-Kare + links to major Filipino recipe sites). Food is emotional and high-retention.
   - Currency converter is critical for OFWs — make it prominent, beautiful, and trustworthy (clearly labeled as approximate offline rates).
   - Remittance section must be first-class: Western Union, MoneyGram, Remitly, WorldRemit, Xoom, Cebuana, M Lhuillier, Palawan, LBC + GCash/Maya. Group or badge them clearly as “Remittance / Padala”.

5. **Monetization-ready (primary business goal)**
   - AdSense slots already exist — improve placement and density carefully so they do not destroy trust or speed.
   - Structure content (recipes especially) for longer session time and more page views.
   - Admin console must remain functional for updating rates, services list, tools visibility, AdSense IDs, and viewing simple local stats.
   - Leave clear placeholders and comments for the owner to drop real AdSense publisher ID and slot IDs.

6. **Technical constraints**
   - Must remain a pure static PWA (no required backend for core function).
   - Must deploy cleanly on Vercel with zero build step or a trivial one.
   - Existing architecture (config.js, tools.js, app.js, admin, sw.js, manifest) is the foundation — improve and extend it, do not throw it away.
   - Mobile-first. Desktop is secondary but must not break.
   - Offline: all tools and the recipe content must work offline. External links naturally need network.

## EXISTING CODEBASE (START HERE — DO NOT REWRITE FROM ZERO)

You already have a working foundation:

```
index.html          — shell, topbar, bottom nav, ad slots, views
css/styles.css      — dark mobile-first styles
js/config.js        — tools list, services (incl. remittance), static rates, recipes, recipeSites
js/tools.js         — all pure client-side tool renderers including recipes
js/app.js           — navigation, launcher intercept, PWA install prompt, local stats
admin/index.html    — password-protected console
manifest.json       — PWA manifest
sw.js               — service worker
icons/              — placeholder icons (replace with proper Filipino-feeling icons)
```

Read every file. Preserve the data model and the “config-driven + localStorage override” pattern so the admin console continues to work.

## WHAT YOU MUST DELIVER

### 1. Visual & UX overhaul
- New color system and component styling that feels distinctly Filipino and premium.
- Redesigned service tiles and tool cards that look native and inviting.
- Clear visual hierarchy: Recipes + Currency + Remittance should be easy to discover within 3 seconds of opening the app.
- Beautiful empty/loading states and micro-interactions.
- Dark mode that looks intentional (not just inverted).

### 2. Information architecture for lock-in
Suggested home structure (you may refine):
- Top: brand + optional “Install” or status
- Quick Tools row (Recipes first or Currency first — test which feels more daily)
- Prominent “Remittance / Padala” group for OFWs
- Full Directory of daily services (GCash, Maya, Grab, Foodpanda, Jollibee, banks, etc.)
- Footer with trust line and home return reminder

### 3. PWA excellence
- Updated manifest with correct name, short_name, description, theme colors matching the new palette.
- High-quality icons (at minimum generate or specify 192 + 512 that feel Filipino — sun, bayanihan, or abstract “Y” mark in brand colors).
- Service worker that caches shell + tools aggressively and stays reliable offline.
- Install prompt timing that feels natural, not spammy.
- When launched from home screen, full-screen standalone experience with no browser chrome.

### 4. Vercel-ready
- Project must deploy on Vercel with:
  - Root as the publish directory (or clear vercel.json if needed)
  - No required build command, or a no-op
  - Correct headers for PWA and security (suggest a vercel.json with sensible headers)
- Include a short DEPLOY_VERCEL.md with exact steps:
  1. Push to GitHub
  2. Import to Vercel
  3. Add custom domain yehaw.app
  4. Force HTTPS
  5. Test install on Android + iOS

### 5. Admin console polish
- Keep it functional and password-protected.
- Make editing services / rates / recipes / AdSense IDs painless.
- Preserve localStorage override pattern so changes appear without redeploy (good for quick rate updates).

### 6. Documentation inside the repo
- Update README.md with:
  - Clear product description
  - How to run locally
  - How to deploy on Vercel
  - How to set AdSense
  - How to change admin password
  - Notes on what “default browser” realistically means for a PWA
- Keep or improve the existing PROMPT files only if useful; primary instruction is this document.

## DESIGN PRINCIPLES FOR FILIPINO ADOPTION

- Familiar > clever. Users should instantly recognize GCash, Maya, Grab, Foodpanda, Jollibee, Western Union tiles.
- Speed is a feature. Every tap must feel instant.
- Trust is everything for remittance and money tools. Clean layout, clear labeling, no dark patterns.
- Food (recipes) creates emotional return visits.
- OFW reality: many users are abroad or supporting family. Currency + Padala must feel first-class, not buried.
- Mobile data can be expensive or slow — offline tools and aggressive caching are respect for the user.

## OUT OF SCOPE (DO NOT DO)

- Do not add real-time currency APIs (keep static rates + admin update path).
- Do not require user accounts for normal use.
- Do not build a full native browser engine. This is a launcher + tools shell that opens real services.
- Do not claim the PWA can forcibly become the system default browser. Design for voluntary daily use instead.
- Do not bloat with heavy libraries.

## ACCEPTANCE CRITERIA

Tabby has succeeded when:

- [ ] The app looks and feels distinctly Filipino and premium on a real phone.
- [ ] Currency converter and Remittance section are immediately discoverable.
- [ ] All tools (including recipes) work offline.
- [ ] External services open cleanly and the user can return to Yehaw with one tap.
- [ ] PWA installs and launches in standalone mode.
- [ ] Admin console still lets the owner update rates, services, and AdSense IDs.
- [ ] Project deploys to Vercel with custom domain support and no complex build.
- [ ] AdSense placeholders are clearly marked and ready for real IDs.
- [ ] First load is extremely fast.
- [ ] A Filipino user opening it for the first time would think: “This was made for me.”

## EXECUTION ORDER FOR TABBY

1. Read all existing source files completely.
2. Define the new visual system (colors, type, spacing, tile style) and implement in CSS.
3. Restructure home layout for maximum daily utility and OFW relevance.
4. Polish every tool renderer, especially currency and recipes.
5. Upgrade service tiles and grouping (Remittance group, Daily Services, etc.).
6. Improve PWA manifest, icons strategy, and service worker.
7. Add vercel.json + DEPLOY_VERCEL.md.
8. Polish admin console.
9. Update README and any necessary comments in code.
10. Final pass: performance, accessibility of key controls, and mobile touch targets (min 44px).

Begin now. Work systematically through the existing codebase. Deliver a complete, production-ready Yehaw Tools & Fast Browser that Filipinos will want to lock into.
