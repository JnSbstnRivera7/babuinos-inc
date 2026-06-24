# 🗺️ Roadmap — Babuinos Inc

Estado del proyecto y lo que falta para lanzar y escalar. Marca: ✅ hecho · 🔜 siguiente · 🧭 futuro.
Checklist accionable de próximos cambios en **[PENDIENTES.md](PENDIENTES.md)**.

---

## ✅ Fase 0 — Base (hecho)

- [x] Proyecto Next.js 16 + TS + Tailwind v4 + Framer Motion + Lenis.
- [x] Intro inmersiva: scroll-reveal que descubre el wallpaper fijo de selva de cemento; el **logo** crece + se distorsiona hasta desaparecer.
- [x] Wallpaper fijo para toda la página; tema oscuro coherente.
- [x] Efectos de selva: **lianas que cuelgan del techo al suelo por los lados de toda la página** (capa fija, largas oscuras + cortas verde claro, disparejas), hojas cayendo (CSS + Canvas), ladrillo y bordes de liana en CSS, shine dorado.
- [x] Catálogo con tallas, selectores de categoría y "agregar a la mochila" (sin precios).
- [x] Lookbook en loop (image auto-slider).
- [x] Menú "Tienda" + selector de colorway (recolorea acento, solo paleta).
- [x] Carrito persistente + **formulario del cliente** (nombre, teléfono, ciudad, nota).
- [x] Checkout por WhatsApp (resumen + datos → `wa.me`), número `573504444668`.
- [x] Páginas "Muy pronto" para Sacos / Medias / Accesorios.
- [x] Íconos SVG propios + botones IG / WhatsApp / Facebook.
- [x] Logo real nítido (negro/crema/oro transparente) + favicon del babuino.
- [x] **Reproductor "Babuinos Radio"**: autoplay aleatorio al primer click/scroll, 6 temas.
- [x] **Panel `/admin`** con login temático + dashboard de gráficas (pedidos por día, top productos, por ciudad) y tablas.
- [x] **Optimización móvil**: imágenes a WebP, música a 128 kbps, animaciones livianas en celular, limpieza de assets, `content-visibility:auto` en secciones, lazy-load (Lookbook/Catálogo) y sin `backdrop-blur` en móvil.
- [x] Repo en GitHub (público) + conectado a Vercel · **Deploy** → https://babuinos-inc.vercel.app · **Supabase** (`orders` + `waitlist`).

## 🔜 Fase 1 — Pulido de lanzamiento (lo que sigue)

> Detalle accionable en **[PENDIENTES.md](PENDIENTES.md)**.

- [ ] **Fotos de producto definitivas** (las actuales son flat-lays de referencia con texto de otras marcas).
- [ ] **Links reales de redes** (Instagram, Facebook, WhatsApp).
- [ ] **OG image** con el babuino (para compartir en redes).
- [ ] **Cambiar `ADMIN_PASSWORD`** y **rotar credenciales** del desarrollo.
- [ ] **Música con licencia** (libre de regalías).

## 🧭 Fase 2 — Tienda real

- [ ] **Precios** reales por producto y por talla.
- [ ] **Pasarela de pago** (Wompi / Mercado Pago / Bold) o mantener pedido por WhatsApp.
- [ ] **Catálogo desde Supabase** (CMS): productos, tallas, stock e imágenes sin tocar código.
- [ ] **Guía de tallas, Envíos, Cambios, FAQ** (hoy enlaces del footer sin página).
- [ ] **Inventario / stock** y estados de "agotado".
- [ ] Lanzar **Sacos / Medias / Accesorios** (reemplazar "Muy pronto").

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
