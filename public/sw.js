/* Babuinos Inc — service worker (PWA installability + light offline). */
/* Subir la versión invalida el caché viejo en los celulares que ya instalaron
   la PWA (el activate borra todo caché con otro nombre).
   v3: optimización móvil — baboon.png (174 KB) salió, la música ya no
       autoarranca en teléfono.
   v4: catálogo nuevo (15 piezas) + wallpaper nuevo. Los wallpapers conservan el
       nombre de archivo con contenido distinto, así que sin subir versión el
       celular seguiría mostrando el viejo.
   v5: pieza 16 (Guardián Navy) + tema nuevo + privacidad + compra unificada.
   v6: pieza 17 (Green Afro Tiki) + color de filtro Celeste.
   v7: Guns & Roses con prenda sola por corte (oversize H / crop M).
   v8: pieza 18 (Eternal Beauty) + música al primer gesto también en celular.
   v9: fotos de modelo nuevas de Free Palestine (mismo nombre, contenido nuevo).
   v10: re-corte de las espaldas de Free Palestine (la lámina 4.5 venía mal). */
const CACHE = "babuinos-v10";
const OFFLINE_URLS = ["/", "/icons/icon-192.png", "/icons/icon-512.png"];

// Pre-cache a minimal app shell so the home opens even without connection.
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(OFFLINE_URLS)).catch(() => {}),
  );
  self.skipWaiting();
});

// Drop old caches on activate and take control immediately.
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // skip Supabase, fonts CDNs, etc.

  // Immutable hashed assets → cache-first (fast, safe).
  if (url.pathname.startsWith("/_next/static") || url.pathname.startsWith("/icons/")) {
    event.respondWith(
      caches.match(req).then((hit) => hit || fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
        return res;
      })),
    );
    return;
  }

  // Pages/data → network-first so users always get fresh content, with an
  // offline fallback to the cached shell.
  event.respondWith(
    fetch(req)
      .then((res) => {
        if (req.mode === "navigate") {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
        }
        return res;
      })
      .catch(() => caches.match(req).then((hit) => hit || caches.match("/"))),
  );
});
