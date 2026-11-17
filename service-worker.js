const CACHE = "nour-pwa-v4";
const FILES = ["./", "./index.html", "./manifest.json", "./icons/nour.svg", "./icons/nour-192.png", "./icons/nour-512.png"];
const FONT_HOSTS = ["fonts.googleapis.com", "fonts.gstatic.com"];
self.addEventListener("install", e => e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())));
self.addEventListener("activate", e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  const u = new URL(e.request.url);
  const font = FONT_HOSTS.includes(u.hostname);
  if (u.origin !== location.origin && !font) return;
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).then(res => {
    if (res.ok || res.type === "opaque") { const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); }
    return res;
  }).catch(() => font ? new Response("", { status: 504 }) : caches.match("./index.html"))));
});
