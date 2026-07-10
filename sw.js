/* Tally service worker — offline app shell with controlled updates.
   Cache name comes from the ?v= version passed at registration, so bumping
   APP_VERSION in the app installs a new worker and a new cache. The new
   worker WAITS; the page shows an "update ready" banner and, on reload,
   messages SKIP_WAITING so this worker activates and clears old caches. */
const VERSION = (new URL(self.location)).searchParams.get('v') || 'dev';
const CACHE = 'tally-' + VERSION;

self.addEventListener('install', e => {
  // Pre-cache the fresh shell into this version's cache (do NOT skipWaiting).
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(['./', './index.html']).catch(() => {})));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.map(k => (k === CACHE ? null : caches.delete(k)))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  // Navigations: cache-first (instant + offline). Fresh copy arrives via the update flow.
  if (req.mode === 'navigate') {
    e.respondWith(
      caches.match('./index.html').then(hit =>
        hit || fetch(req).then(res => { const cp = res.clone(); caches.open(CACHE).then(c => c.put('./index.html', cp)); return res; })
                        .catch(() => caches.match('./'))
      )
    );
    return;
  }
  // Other GETs: cache-first, then network (and cache it).
  e.respondWith(
    caches.match(req).then(hit =>
      hit || fetch(req).then(res => {
        if (res && res.status === 200) { const cp = res.clone(); caches.open(CACHE).then(c => c.put(req, cp)); }
        return res;
      }).catch(() => hit)
    )
  );
});
