# 📋 Pendientes — Babuinos Inc

Checklist accionable. Visión por fases en **[ROADMAP.md](ROADMAP.md)**.
Estado: desplegada en https://babuinos-inc.vercel.app (arquitectura de tienda completa).

> **Continuar en otro chat:** credenciales (GitHub PAT, Vercel token, Supabase key, admin,
> WhatsApp) en **`CREDENCIALES.local.md`** (local, no se sube) y en `.env.local`.

---

## 🔴 Para vender de verdad (tú tienes la pelota)

- [x] **Fotos de modelo por producto** (26-jul). Cada pieza tiene la camisa **puesta** — frente/lateral/espalda × Hombre/Mujer en `public/brand/models/<slug>/`, con **toggle H/M + zoom** en la PDP y **hover→espalda** en las tarjetas. _Opcional pendiente:_ foto de la **prenda sola** en alta y algún **lifestyle** en la calle.
- [ ] **Medidas reales de tallas.** Editar `SIZE_GUIDE` en `src/components/producto/ProductDetail.tsx` (hoy son valores de ejemplo) con pecho/largo/hombro por talla.
- [ ] **Género por producto.** Hoy: lila=mujer, gris=hombre, resto unisex (en `products.ts`). Ajustar según la línea real.
- [ ] **Editar el Drop.** Nombre y fecha reales en `DROP` de `src/components/sections/DropCountdown.tsx`.

## 🔒 Seguridad y operación

- [ ] **Rotar credenciales** compartidas en desarrollo (GitHub PAT `ghp_…`, token Vercel `vcp_…`, service key Supabase). Guardar las nuevas solo en `.env.local` / `CREDENCIALES.local.md`.
- [ ] **Cambiar `ADMIN_PASSWORD`** (env var en Vercel).
- [ ] **Música con licencia** (los temas actuales son comerciales).

## 🟡 Marca y contenido

- [ ] **Links reales** IG / Facebook / WhatsApp (placeholder en `SocialButtons.tsx`).
- [ ] **Páginas del footer:** Envíos, Cambios, FAQ (hoy enlaces sin página).
- [ ] Lanzar **Sacos / Medias / Accesorios** (quitar "Muy pronto").

## 🟢 Siguientes builds (necesitan backend/decisión)

- [ ] **Reseñas / estrellas** — con reseñas reales o captura por WhatsApp tras la compra (nada de reseñas falsas).
- [ ] **Analítica "lo más visto"** — registrar vistas en Supabase + mostrarlo en `/admin`.
- [ ] **Precios + pasarela de pago** (Wompi / Bold / Mercado Pago) o seguir por WhatsApp.
- [ ] **Catálogo desde Supabase** (CMS) + stock administrable.
- [ ] **Email del Club** a un proveedor (para drops/preventas) + dominio propio.

---

## ⚙️ Notas técnicas

- **PWA/caché:** la app se instala y cachea (service worker `babuinos-v2`, network-first). Al desplegar, en el celular **cerrar y reabrir** (o recarga forzada) para bajar la versión nueva.
- **Preview headless:** el home cuelga el navegador de pruebas por las animaciones perpetuas; verificar por navegación/DOM, no por screenshot.
- **Deploy:** repo `JnSbstnRivera7/babuinos-inc` (cuenta personal, NO empresa) → push a `main` **debería** auto-desplegar en Vercel. ⚠️ El webhook ha fallado a veces; si no aparece deploy nuevo, forzar con `vercel deploy --prod` (proyecto ya vinculado en `.vercel/`). Revisar **Vercel → Settings → Git**.
- **Fotos de modelo:** fuente en `Documents/Babuinos` (`<Colorway> - <Género> <Ángulo>.png`); se normalizan a **4:5 WebP** (pad cream `#ECEAE6`) con `ffmpeg-static` y se guardan en `public/brand/models/<slug>/<genero>-<angulo>.webp`. El campo `Product.models` (`src/lib/products.ts`) se genera solo con el helper `modelSet(slug)`.

_Última actualización: 2026-07-26._
