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

UNDO
  Cmd/Ctrl-Z undoes, Shift-Cmd/Ctrl-Z (or Ctrl-Y) redoes, up to 80 steps back.
  Undo and Redo are also in the ... menu and in the right-click menu, and on a
  phone they are the two arrows at the left of the bottom action row.

  Everything that changes the worksheet is undoable -- typing in a line, the
  quantity, pinning, sections and collapsing them, deleting a line or a whole
  worksheet, renaming, the stock length, fixture and channel rows, and the
  inch denominator. Typing collapses into one step per field, so undo goes
  back to before you started typing there rather than one character.

  Three things are deliberately outside it. Switching worksheets is navigation,
  so it never uses up a step -- but undo will jump you back to the worksheet a
  change happened in. Opening a .json file starts a new document and clears the
  history. And if another window saves the file while you have it open, the
  history is cleared when that version is adopted, because the steps no longer
  describe the document you now have.

NAMES COMPLETE THEMSELVES
  Type @ or # in an expression and Tally offers the names it already knows: the
  tags and labels in this worksheet first, then your fixture and channel codes,
  then names from earlier jobs. Up/Down moves, Enter or Tab takes the highlighted
  one, Escape dismisses, and each row says where the name came from. A tag is a
  name the shop agreed on -- @LB-717A is the same run every time it is typed, and
  a typo makes a second one that quietly splits a cut plan.

  Names from earlier jobs live in localStorage under `tally:recent`, separate
  from the worksheet: they are this machine's memory, not the file's content, so
  they never travel through undo, a merge, or an exported file.

SECTIONS
  A section header totals every calculation between it and the next header. If
  only some of those lines are counted in the running total, the pinned part is
  shown beside it in grey ("9' 0" - 8' 0" pinned"), so a section is never
  reported as 0' 0" just because nothing under it is pinned.

  Drag the grip at the left of a header to move a section -- the header and every
  line under it move together. The grip is the only part of the header that
  starts a drag, so on a touchscreen a drag anywhere else still scrolls. The same
  move is on the header's right-click menu and on Alt+Up / Alt+Down while the
  section's name field has focus, and it is one undo step.

TAGS, ZONES AND WHAT THE CUT PLAN COVERS
  A tag can name a zone: @LA.North and @LA.South are both fixture type LA.
  The TAGS list shows the type with its zones indented under it, so you can
  filter to all of @LA or to one zone. Filtering, searching, the running
  total, the section subtotals and the cut plan all describe the same set of
  lines; when the cut plan is showing less than the whole worksheet it says so
  at the top ("Planning 3 of 12 lines - filtered to @LA"). Pinning is separate:
  it decides what the running total sums, not what gets planned or cut.

FRACTIONS
  Results are shown in sixteenths of an inch by default, because that is
  what a tape measure has: 33 13/16" instead of 33.8125". Settings ->
  MEASURING -> "Round inches to" changes the denominator (decimal, 1/4,
  1/8, 1/16, 1/32); the choice is saved with the worksheet and travels in
  exported files, so the shop sees the same marks you do. Only inch
  displays change -- feet, metres and centimetres stay decimal, and the
  arithmetic underneath is always exact.

  Fractions are also accepted as input: 8' 5 13/16", 40 3/8", and a bare
  13/16" all parse as lengths.

VERSION
  The current build is shown in four places, so you always know which copy
  you are looking at:
    • the badge at the top-left of the title bar (e.g. "v1.11.0")
    • the window / browser-tab title ("Tally 1.11.0")
    • Settings -> ABOUT, which also says whether you are in the installed
      app or a browser tab
    • the "appVersion" field of any worksheet file you export

  To cut a new release, bump the one line in index.html:
      window.TALLY_VERSION='1.11.0';
  Everything else reads from it, including the service-worker registration
  (sw.js?v=...), so bumping it also retires the old cached build.

PERFORMANCE ON LONG WORKSHEETS
  The list narrows while you type and goes back to whole about a third of a
  second after you stop, so typing costs the same on a long worksheet as on a
  short one. Measured keystroke-to-visible-result latency at 1280x900: ~17ms at
  100, 500 and 1000 lines, ~35ms at 2000 (it was 35ms / 65ms / 135ms before).

  Everything except typing sees the whole list: printing, find-in-page,
  scrolling and screenshots all happen while it is idle. Worksheets under 150
  lines are never narrowed at all. Row heights are measured from the last full
  render so the space standing in for the lines left out is exact rather than
  estimated -- and if any height is missing, the list renders whole instead of
  guessing. Scrolling ends a burst, and every section header stays in place
  whatever the scroll position, so a section's sticky subtotal still works.

MAINTENANCE
  index.html is hand-maintained -- there is no build step, and two of the
  scripts embedded in it carry local patches that are invisible in the file
  because the assets are base64(gzip) entries in a JSON manifest on one line.

    • the expression engine (asset prefix cadd5ff2): quantity and piece caps,
      and fractional-inch formatting
    • the template framework (asset prefix 6e746952): memoised style parsing,
      property camelisation, and {{ path }} resolution -- worth ~40% of the
      keystroke cost on a long worksheet -- and sc-for keys taken from each
      item's own id instead of its position, without which windowing the row
      list tears down and rebuilds every row, losing the focused input

  To change one, extract it from the manifest (the line beginning with a JSON
  object of asset uuids), edit, then gzip and base64 it back into the same
  entry. The app template itself is the JSON-encoded string on the following
  script line; when re-embedding it, escape "</" as "<\u002F" or the literal
  </script> inside the string closes the element early. Re-exporting the app
  from the tool that originally produced this bundle would drop all of it.

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
