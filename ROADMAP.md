# 🗺️ Roadmap — Babuinos Inc

Estado del proyecto y lo que falta para vender y escalar. ✅ hecho · 🔜 siguiente · 🧭 futuro.
Checklist accionable en **[PENDIENTES.md](PENDIENTES.md)**.

---

## ✅ Fase 0 — Base inmersiva (hecho)

- [x] Next.js 16 + TS + Tailwind v4 + Framer Motion + Lenis + Zustand + Supabase.
- [x] Intro scroll-reveal (el logo crece/distorsiona y descubre el wallpaper fijo de selva de cemento) + tema oscuro coherente.
- [x] Carrito persistente + formulario de cliente + **checkout por WhatsApp** (resumen a `wa.me`) + guardado en Supabase (`orders`).
- [x] **Club / waitlist** (Supabase `waitlist`), **selector de colorway**, **Panel `/admin`** con login + gráficas.
- [x] **PWA instalable** (manifest + service worker) + optimización móvil base (WebP, música 128k, etc.).
- [x] Repo en GitHub (`JnSbstnRivera7/babuinos-inc`) + Vercel auto-deploy → https://babuinos-inc.vercel.app

## ✅ Fase 1 — De landing a tienda por secciones (hecho · 2026-07-23)

- [x] **Arquitectura real:** Home = entrada · **`/tienda`** (PLP) · **`/producto/[slug]`** (PDP, no existía) · **`/nosotros`** · **`/club`** · **`/favoritos`**.
- [x] **Modelo de producto ampliado** (fuente única): género, galería `images[]`, stock por talla, fit, composición, colección, badge.
- [x] **"Elige tu territorio"** en el home: puertas Hombre/Mujer con **logos reales SVG** (gorra / gorra+moño) + entrada Unisex. Sello de género en cada tarjeta.
- [x] **PLP con filtros en panel transparente (glass)** — dropdown en PC / bottom-sheet en móvil; barra slim con segmentado Todos/Hombre/Mujer + chips de filtros activos. La ropa aparece de inmediato.
- [x] **PDP:** galería, tallas con "agotado", guía de tallas, **"Comprar por WhatsApp" pre-llenado**, "combina con".
- [x] **Favoritos / wishlist** (corazón en tarjetas y PDP, contador en nav, página `/favoritos`, persistido).
- [x] **Globales en toda la página:** música (reproductor mini que abre al clic), WhatsApp flotante, botón "Instalar app" arriba-centrado, **barra de confianza** (envío/cambios/pago) en el footer.
- [x] **OG image** para compartir (logo sobre selva) + twitter card.
- [x] **Fixes móvil:** Lenis apagado en táctil, `touch-action`, intro más corto, navegación Hombre/Mujer arreglada, **siempre arranca desde arriba** al cambiar de vista, service worker v2 (auto-reemplazo de caché).
- [x] **Drop con cuenta regresiva + lista de espera** (enganchada al Club) en el home.

## 🔜 Fase 2 — Contenido para vender (lo que sigue)

> El diseño ya está listo; falta el material real. Detalle en **[PENDIENTES.md](PENDIENTES.md)**.

- [ ] **Fotos reales por producto** (galería de 4-6: frente, espalda, detalle, lifestyle). Hoy hay 1 por pieza.
- [ ] **Medidas reales de tallas** en la guía (hoy son valores de ejemplo).
- [ ] **Links reales** de Instagram / Facebook / WhatsApp.
- [ ] **Editar el Drop** (nombre + fecha reales en `DropCountdown.tsx`).
- [ ] **Rotar credenciales** de desarrollo (GitHub PAT, token Vercel, service key Supabase) y cambiar `ADMIN_PASSWORD`.
- [ ] **Música con licencia** (libre de regalías).

## 🧭 Fase 3 — Tienda real / backend

- [ ] **Precios** por producto/talla y decisión de **pasarela de pago** (Wompi / Bold / Mercado Pago) o seguir por WhatsApp.
- [ ] **Catálogo desde Supabase** (editar productos/stock sin tocar código).
- [ ] **Reseñas / estrellas** (con reseñas reales o captura por WhatsApp tras la compra).
- [ ] **Analítica "lo más visto"** (tracking de vistas en Supabase + vista en `/admin`).
- [ ] Lanzar **Sacos / Medias / Accesorios** (quitar "Muy pronto").
- [ ] Páginas reales de **Envíos / Cambios / FAQ**.

## 🧭 Fase 4 — Crecimiento

- [ ] **Dominio propio** + correo de marca.
- [ ] **Email del Club** conectado a un proveedor (drops, preventas) — hoy la waitlist solo guarda en Supabase.
- [ ] **SEO** por página, sitemap, datos estructurados de producto · **Analítica** (Vercel/GA4 + píxel Meta).
- [ ] **i18n** (ES/EN), **programa de referidos** ("la manada"), tests + auditoría de accesibilidad.

---

_Última actualización: 2026-07-23._
