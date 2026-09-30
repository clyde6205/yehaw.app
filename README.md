# Yehaw.app — Full Filipino Directory + Fast Tools (PWA)

Fast mobile-first page for Filipinos:
- **Filipino recipes** (Adobo, Sinigang, Tinola, Tocino, Pancit, Kare-Kare) fully offline + links to top recipe sites
- 10 other offline tools (calculator, PHP rates, tip, BMI, loan, unit, %, age/days, password, text)
- Full directory / one-tap launcher: GCash, Maya, Grab, Foodpanda, Jollibee, Shopee, Lazada, banks, Pag-IBIG…
- Persistent top bar + bottom nav so users always return home
- AdSense-ready (food + utility content = strong engagement for ads)
- Admin console at `/admin/`
- Fully static — no backend required for launch

## Quick start (local)

Any static server:

```bash
cd yehaw
npx serve -p 3000
# or python3 -m http.server 3000
```

Open http://localhost:3000  
Admin: http://localhost:3000/admin/  
Default password: `yehaw2026admin` (change immediately)

## Deploy

1. Upload the whole `yehaw` folder to Cloudflare Pages, Vercel, Netlify, or any static host.
2. Point `yehaw.app` DNS to the host.
3. Force HTTPS.
4. Test “Add to Home Screen” on a real phone.

## Monetization

1. Create Google AdSense account and add `yehaw.app`.
2. After approval, create ad units and paste the publisher ID + slot IDs into Admin → AdSense, **and** update the two script tags in `index.html`.
3. Traffic monetizes via display ads. Later you can add affiliate parameters on service links if the programs allow it.

## “Don’t let them drift”

- Services open in a new tab → Yehaw stays in the browser history / task switcher.
- Fixed Home button and bottom nav always available.
- When installed as PWA, the icon always opens Yehaw (not the external service).
- True “set as default browser” is not possible for a web app without OS-level permission; the sticky chrome is the practical solution that works today.

## Admin

All config overrides are stored in the browser’s localStorage.  
For multi-device admin you will later want a tiny backend or a JSON file you edit and redeploy. For first launch the local admin is enough.

## Next steps for you

1. Change the admin password.
2. Update the static currency rates with current approximate values.
3. Replace the green placeholder icons with a real logo (192 + 512 PNG).
4. Add your real AdSense IDs when ready.
5. Deploy and submit the site to AdSense.
6. Give the `PROMPT_FOR_MISTRAL.md` file to Mistral (or any AI) if you want further polish, Tagalog, analytics, etc.

Built for speed and launch, not perfection.
