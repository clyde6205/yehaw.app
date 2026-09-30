# Deploy Yehaw on Vercel (recommended)

## Why Vercel over Netlify for this project
- Excellent static + PWA support
- Instant previews on every push
- Easy custom domain + automatic HTTPS
- Edge network (fast for users in PH and OFW countries)
- Simple headers control via `vercel.json`

## Steps

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Yehaw Tools & Fast Browser"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/yehaw.git
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to https://vercel.com → Add New Project
   - Import the GitHub repo
   - Framework Preset: Other (or leave blank)
   - Build Command: leave empty
   - Output Directory: leave empty / `.`
   - Install Command: leave empty
   - Click Deploy

3. **Custom domain**
   - Project → Settings → Domains
   - Add `yehaw.app` (and `www.yehaw.app` if desired)
   - Follow the DNS instructions at your registrar
   - Vercel auto-provisions HTTPS

4. **After deploy**
   - Open the live URL on a real Android phone
   - Test: Home, Recipes, Currency, Remittance taps, Install prompt
   - Go to `/admin/` and change the default password immediately
   - When AdSense is approved, paste real publisher ID + slot IDs

## Optional vercel.json (recommended)

Create this file at the project root if Tabby has not already:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }
      ]
    },
    {
      "source": "/sw.js",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=0, must-revalidate" }
      ]
    },
    {
      "source": "/manifest.json",
      "headers": [
        { "key": "Content-Type", "value": "application/manifest+json" }
      ]
    }
  ]
}
```

That is all. No serverless functions required for launch.
