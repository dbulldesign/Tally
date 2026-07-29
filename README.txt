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

VERSION
  The current build is shown in four places, so you always know which copy
  you are looking at:
    • the badge at the top-left of the title bar (e.g. "v1.2.0")
    • the window / browser-tab title ("Tally 1.2.0")
    • Settings -> ABOUT, which also says whether you are in the installed
      app or a browser tab
    • the "appVersion" field of any worksheet file you export

  To cut a new release, bump the one line in index.html:
      window.TALLY_VERSION='1.2.0';
  Everything else reads from it, including the service-worker registration
  (sw.js?v=...), so bumping it also retires the old cached build.

UPDATES
  The service worker uses network-first for the page, so when you replace
  index.html on the host, users get the new version next time they're
  online (and the last version keeps working offline). Bumping
  TALLY_VERSION (see above) forces cached assets to refresh too.

NOTE
  tally-calculator.html (the single standalone file) is the same app and
  is perfect for quick use, email, or Google Drive — it just isn't a PWA
  when opened from a file. Use this folder when you want the installable,
  offline app.
