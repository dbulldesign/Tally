TALLY — Progressive Web App bundle
==================================

This folder makes Tally a *true* installable, offline PWA.

WHAT'S INSIDE
  index.html  - the whole app (all styles, code, and icons are embedded)
  sw.js       - the service worker (provides offline caching)

WHY YOU NEED TO HOST IT
  A real PWA needs a service worker, and browsers ONLY allow service
  workers over HTTPS (or http://localhost). Opening index.html straight
  off your disk (file://) will still run the app, but it CANNOT be a true
  PWA there — no offline caching, no reliable install. So put these two
  files on any static HTTPS host.

DEPLOY (pick one — all free)
  • GitHub Pages: create a repo, upload index.html + sw.js, enable Pages.
  • Netlify / Cloudflare Pages: drag this folder onto their "deploy" area.
  • Vercel: `vercel` in this folder.
  • Any web server: copy both files into a folder it serves over https.

  Keep the file named index.html and keep sw.js next to it.

INSTALL IT
  Open the hosted URL in Chrome/Edge/Safari:
    • Desktop Chrome/Edge: click the install icon in the address bar
      (or the "Install" button that appears in Tally's top bar).
    • iPhone/iPad Safari: Share → "Add to Home Screen".
    • Android Chrome: menu → "Install app" / "Add to Home Screen".
  It launches full-screen with the Tally icon, and works offline after
  the first load.

UPDATES
  The service worker uses network-first for the page, so when you replace
  index.html on the host, users get the new version next time they're
  online (and the last version keeps working offline). To force a hard
  refresh of cached assets, bump  CACHE = 'tally-v1'  to 'tally-v2' in sw.js.

NOTE
  tally-calculator.html (the single standalone file) is the same app and
  is perfect for quick use, email, or Google Drive — it just isn't a PWA
  when opened from a file. Use this folder when you want the installable,
  offline app.
