# Yehaw browser build plan

## Product definition

**Yehaw is the Filipino Internet App — Launcher, Directory, Services, and FAST Browser, all-in-one.**

Yehaw is a native-first browser for Filipinos and OFWs. Its Home and New Tab surfaces are the Yehaw launcher and verified-service directory. The PWA is the Yehaw Home fallback and reusable browser-home interface; it is not a substitute for native default-browser capabilities.

## Primary activation

Use this exact native Android CTA:

> TAP HERE to make Yehaw your Default Browser NOW

Supporting copy:

> You will confirm once in your phone's browser settings.

The CTA must only start the operating system's browser-role/default-app flow. Yehaw must never claim it changes a device's default browser without the user's system-level confirmation.

## User loop

1. Install Yehaw.
2. Tap the default-browser CTA.
3. Confirm Yehaw in the Android system role chooser.
4. Open future web links in Yehaw.
5. Use Yehaw Home/New Tab to launch verified Filipino and OFW services in one tap.
6. Return through recents, pinned services, and the Yehaw tab manager.

## Implementation phases

### Phase 1 — verified directory foundation

- Apply the reviewed SQL migration in `db/migrations/001_yehaw_directory_foundation.sql` only after explicit approval.
- Create server-only read endpoints for active, verified categories and services.
- Seed service records only after editorial verification of each official canonical destination.
- Keep user link reports out of public results until reviewed.

### Phase 2 — Yehaw Home PWA

- Build one universal address/service-search field.
- Add first-party pinned services, recents, category browsing, offline shell, and clear stale-data states.
- Use the product title and messaging above.
- Never present an inoperative PWA default-browser button.

### Phase 3 — native Android browser

- Implement a compliant browser activity that can handle HTTP and HTTPS links.
- Request Android's browser role after the user taps the primary CTA.
- Provide tabs, back, forward, reload, share, copy URL, home, clear browsing data, and a visible current-domain indicator.
- Load Yehaw Home for the initial tab, Home action, and each new tab.
- Do not rewrite requested URLs, capture credentials, or redirect external pages back to Yehaw.

### Phase 4 — editorial operations

- Require official canonical URLs, HTTPS, active status, verification status, verification date, and last-review date for every public service.
- Add editorial tooling, audit entries, safe broken-link reporting, and clearly disclosed sponsored listings.

## Category order

1. Money & Payments
2. Government
3. OFW & Work
4. Travel & Transport
5. Shopping
6. Food
7. Health
8. Communication
9. Entertainment
