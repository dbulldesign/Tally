/* Tally service worker.
 *
 * Navigation is NETWORK-FIRST: when you're online you always get the freshly
 * deployed index.html, so a new release can never be "stuck" behind an old cache.
 * The cache is the offline fallback. Other GETs are cache-first for speed.
 *
 * Cache name is derived from the ?v= passed at registration, so bumping
 * APP_VERSION in index.html creates a new cache and drops the old one.
 */
const VERSION = new URL(self.location).searchParams.get('v') || 'dev';
const CACHE = 'tally-' + VERSION;
const SHELL = './index.html';

self.addEventListener('install', e => {
  // Pre-cache the shell, but never let a failure block installation.
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.add(new Request(SHELL, { cache: 'reload' })))
      .catch(() => {})
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.map(k => (k === CACHE ? null : caches.delete(k)))))
      .then(() => self.clients.claim())
      .catch(() => {})
  );
});

self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;

  // Pages: network first, fall back to the cached shell when offline.
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req)
        .then(res => {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(SHELL, copy)).catch(() => {});
          return res;
        })
        .catch(() => caches.match(SHELL).then(hit => hit || caches.match('./')))
    );
    return;
  }

  // Everything else: cache first, then network.
  e.respondWith(
    caches.match(req).then(hit =>
      hit || fetch(req).then(res => {
        if (res && res.status === 200 && res.type === 'basic') {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
        }
        return res;
      }).catch(() => hit)
    )
  );
});
