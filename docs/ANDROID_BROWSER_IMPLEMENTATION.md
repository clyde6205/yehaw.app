# Android browser implementation

## Product role

The native Yehaw Android Browser is the browser-first product. Yehaw Home/New Tab is its launcher and verified-service directory.

## Activation

Use this exact CTA:

> TAP HERE to make Yehaw your Default Browser NOW

The CTA starts Android’s user-consent browser-role flow. Supporting copy must explain that the user confirms Yehaw in Android’s system UI.

## Browser role and links

- Use `RoleManager` and `ROLE_BROWSER` where supported.
- Request the role only after a user tap.
- Handle standard HTTP/HTTPS `ACTION_VIEW` intents.
- Never claim default-browser success until Android confirms the role.

## Required browser UI

- URL/search field
- Back, forward, reload, and Home
- New tab, tab list, individual close, and close all
- Share and copy URL
- Visible current domain
- Clear browsing-data controls and privacy controls
- Yehaw Home for initial tab, Home action, and new tabs

## Prohibited behavior

- No URL rewriting
- No credential interception
- No fake navigation
- No redirecting a requested external page back to Yehaw Home
- No claim that a PWA has become the device default browser

## Acceptance checks

Test on supported Android versions and real devices:

1. Browser-role prompt appears only after the CTA tap.
2. A normal HTTP/HTTPS link opens in Yehaw after the user selects it.
3. Requested pages render at their requested destinations.
4. Tabs, navigation controls, sharing, and data-clearing work.
5. Yehaw Home loads for startup, Home, and new tabs.
6. Low-end Android/mobile layouts retain responsive touch targets and readable controls.
