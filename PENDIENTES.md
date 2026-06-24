# 📋 Pendientes — Babuinos Inc

Próximos cambios para llevar la tienda de "lista y en línea" a "vendiendo de verdad".
Estado actual: desplegada en https://babuinos-inc.vercel.app (ver [README](README.md)).
Visión por fases en [ROADMAP.md](ROADMAP.md).

---

## 🔴 Crítico (para vender en serio)

- [ ] **Precios.** El catálogo no muestra precios. Decidir:
  - mostrar precio por producto/talla, **o**
  - mantener "cotiza por WhatsApp" (como está hoy).
- [ ] **Fotos reales de producto.** Las actuales son *flat-lays de referencia* y varias traen
  texto/diseños de **otras marcas** (MTLS, Sacred Balance). Reemplazar por fotos reales de
  Babuinos antes de publicitar (no son piezas propias).
- [ ] **Catálogo administrable.** Hoy los productos están en código (`src/lib/products.ts`).
  Pasarlos a Supabase para editarlos sin tocar código + manejar **stock**.
- [ ] **Pasarela de pago** (opcional). Wompi / Mercado Pago / Bold, o seguir solo por WhatsApp.

## 🟡 Marca y contenido

- [ ] **Links reales** de Instagram / Facebook / WhatsApp (hoy placeholder en `SocialButtons`).
- [ ] **Imagen OG** (Open Graph) con el babuino para que el link se vea bien al compartir.
- [ ] **Páginas del footer**: Guía de tallas, Envíos, Cambios, FAQ (hoy son enlaces sin página).
- [ ] **Lanzar Sacos / Medias / Accesorios** cuando existan (quitar las páginas "Muy pronto").

## 🔒 Seguridad y operación

- [ ] **Cambiar `ADMIN_PASSWORD`** por una propia (env var en Vercel).
- [ ] **Rotar credenciales** compartidas durante el desarrollo (GitHub PAT, token de Vercel,
  service key de Supabase).
- [ ] **Música con licencia.** Los temas actuales son comerciales; para una tienda pública conviene
  música libre de regalías (decisión legal/negocio).

## 🟢 Crecimiento (después)

- [ ] **Dominio propio** (ej. `babuinos.co`) + correo de marca.
- [ ] **Analítica** (Vercel Analytics / GA4) + píxel de Meta.
- [ ] **SEO** por página, sitemap, datos estructurados de producto.
- [ ] **Email del Club** (conectar la waitlist con un proveedor) y **drops/preventas** con cuenta regresiva.
- [ ] **Tests** + auditoría de accesibilidad.

---

## ⚙️ Deuda técnica menor

- [ ] Optimizar más la música si pesa (hoy ~22 MB, carga 1 tema a la vez al primer gesto).
- [ ] Afinar `sizes` de `next/image` en el wallpaper (warning de performance, no crítico).
- [ ] Convertir `baboon.png` (máscara) a un formato más liviano si se nota.

_Última actualización: 2026-06-23._
