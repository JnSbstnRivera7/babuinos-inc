# 🗺️ Roadmap — Babuinos Inc

Estado del proyecto y lo que falta para lanzar y escalar. Marca: ✅ hecho · 🔜 siguiente · 🧭 futuro.

---

## ✅ Fase 0 — Base (hecho)

- [x] Proyecto Next.js 16 + TS + Tailwind v4 + Framer Motion + GSAP + Lenis.
- [x] Intro inmersiva: scroll-reveal que descubre el wallpaper fijo de selva de cemento.
- [x] Título con crecimiento + distorsión (blur/skew) hasta desaparecer.
- [x] Wallpaper fijo para toda la página; tema oscuro coherente.
- [x] Efectos de selva: lianas con hojas (CSS), hojas cayendo (CSS + Canvas), ladrillo y borde de lianas en CSS, shine dorado.
- [x] Catálogo con fotos reales, tallas y "agregar a la mochila" (sin precios).
- [x] Lookbook en loop (image auto-slider).
- [x] Menú "Tienda" + selector de colorway (recolorea acento, solo paleta).
- [x] Carrito persistente + **formulario de datos del cliente** (nombre, teléfono, ciudad, nota).
- [x] Checkout por WhatsApp (resumen + datos → `wa.me`), número `573504444668`.
- [x] Páginas "Muy pronto" para Sacos / Medias / Accesorios.
- [x] Íconos SVG propios + botones IG / WhatsApp / Facebook.
- [x] Logo real nítido (negro/crema/oro transparente), mobile-first.
- [x] Repo en GitHub (público).

## 🔜 Fase 1 — Lanzamiento mínimo (lo que sigue ya)

- [ ] **Deploy a Vercel** (conectar repo + env vars).
- [ ] **Supabase real:** crear tablas `orders` y `waitlist`; setear `NEXT_PUBLIC_SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` en Vercel.
- [ ] **Links reales de redes** (Instagram, Facebook, WhatsApp) — hoy son placeholder.
- [ ] **Fotos de producto definitivas** (las actuales son flat-lays de referencia; reemplazar por las reales de Babuinos).
- [ ] **Favicon / OG image** con el babuino (para compartir en redes).
- [ ] **Rotar credenciales** compartidas en chat (GitHub PAT, Vercel token, Supabase service key).
- [ ] Optimizar el wallpaper (`concrete-jungle.png` ~2.8 MB → WebP/comprimido).

## 🧭 Fase 2 — Tienda real

- [ ] **Precios** reales por producto y por talla.
- [ ] **Pasarela de pago** (Wompi / Mercado Pago / Bold) o mantener pedido por WhatsApp con cotización.
- [ ] **Catálogo desde Supabase** (CMS): productos, tallas, stock e imágenes administrables sin tocar código.
- [ ] **Guía de tallas, Envíos, Cambios, FAQ** (hoy son enlaces en el footer sin página).
- [ ] **Inventario / stock** y estados de "agotado".
- [ ] Lanzar **Sacos / Medias / Accesorios** cuando estén listos (reemplazar "Muy pronto").
- [ ] **Panel admin** para ver pedidos (`orders`) y la lista del Club (`waitlist`).

## 🧭 Fase 3 — Crecimiento

- [ ] **Dominio propio** (babuinos.co / .com) + correo de marca.
- [ ] **Analítica** (Vercel Analytics / GA4) y píxel de Meta para campañas.
- [ ] **SEO** completo: metadatos por página, sitemap, datos estructurados de producto.
- [ ] **Email marketing** del Club (drops, preventas) — integrar la waitlist con un proveedor.
- [ ] **Drops / preventas** con cuenta regresiva y stock limitado.
- [ ] **i18n** (ES/EN) si se exporta fuera de Colombia.
- [ ] **Tests** (unit + e2e) y auditoría de accesibilidad (WCAG AA).
- [ ] **Programa de referidos / "manada"** y descuentos.

---

## ⚠️ Pendientes técnicos / deuda

- Reemplazar fotos flat-lay de referencia por producto real propio (evitar texto de marcas ajenas en estampados).
- Comprimir imágenes pesadas; revisar `sizes` de `next/image` en el wallpaper.
- Definir política de datos del cliente (privacidad) al guardar pedidos.

---

_Última actualización: 2026-06-23._
