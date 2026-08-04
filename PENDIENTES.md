# 📋 Pendientes — Babuinos Inc

Checklist accionable. Visión por fases en **[ROADMAP.md](ROADMAP.md)**.
Estado: desplegada en https://babuinos-inc.vercel.app (arquitectura de tienda completa).

> **Continuar en otro chat:** credenciales (GitHub PAT, Vercel token, Supabase key, admin,
> WhatsApp) en **`CREDENCIALES.local.md`** (local, no se sube) y en `.env.local`.

---

## 🔴 Para vender de verdad (tú tienes la pelota)

- [ ] 🔥 **STOCK REAL de las 15 piezas.** Hoy TODAS usan el mismo tallaje provisional
      (`TALLAS_STD` en `src/lib/products.ts`: S-2XL con 6/8/8/6/4). Hay que poner qué tallas
      existen de verdad por pieza y cuántas. Talla en 0 sale tachada como agotada.
- [x] **Sin precios en la web** (decisión de Juan, 4-ago). Ninguna pieza tiene `price` y la ficha
      dice "precio, pago y envío se coordinan por WhatsApp". Verificado: cero importes en el sitio.
      Si algún día se ponen, el campo es `price` (COP).
- [ ] ⚠️ **Licencias de terceros.** Tres diseños usan marcas que no son de Babuinos:
      **Guns & Roses Red** (nombre y el revólver-con-rosas de la banda), **The Mills** (nombre
      y foto de la banda) y **Offline Pleasure** (MTLS.CORP / Too Fucking Nice Studio).
      Venderlas sin licencia es riesgo legal real. Decisión tuya: conseguir permiso, rediseñar,
      o dejarlas fuera de la tienda pública.
- [ ] **¿"Rootwailer" o "Rottweiler"?** El nombre quedó como lo escribiste. Si fue dedo, se
      cambia en `products.ts` y en el slug.
- [ ] **Medir el inventario real.** `SIZE_GUIDE` en `src/components/producto/ProductDetail.tsx` usa
      **medidas de referencia de oversize de mercado** (ancho/largo/hombro/manga, S a 3XL), no las
      de estas prendas. El modal lo dice: "referencia, tolerancia ±2 cm" + botón de WhatsApp para
      pedir la exacta. Al medir, reemplazar los números y quitar el aviso de referencia. Ojo:
      **Guns & Roses** va crop en mujer y hoy solo se avisa con una nota.
- [ ] **Género por pieza.** Las 15 quedaron `unisex` porque todas tienen lámina de hombre y de
      mujer. Ajustar si alguna es de una sola línea.
- [ ] **¿Altura en metros o pies?** El copy quedó en **2.600 m** (Bogotá está a 2.600 metros; 2.600 ft
      serían ~790 m). Si la quieres en pies es un renglón: `altura` en `src/lib/brand.ts`.
- [ ] **Editar el Drop.** Nombre y fecha reales en `DROP` de `src/components/sections/DropCountdown.tsx`.

- [x] **Catálogo completo cargado** (2026-08-04). 15 piezas: 5 básicas + 10 de la Colección
      Fundadores, con 90 fotos de modelo y 30 de prenda sola procesadas desde `MATERIAL/Camisas`
      con `py scripts/ingest_camisas.py`. Las 5 piezas viejas salieron.

## 🔒 Seguridad y operación

- [ ] **Rotar credenciales** compartidas en desarrollo (GitHub PAT `ghp_…`, token Vercel `vcp_…`, service key Supabase). Guardar las nuevas solo en `.env.local` / `CREDENCIALES.local.md`.
- [ ] **Cambiar `ADMIN_PASSWORD`** (env var en Vercel).
- [ ] **Música con licencia.** Los 10 temas son comerciales (2Pac, 50 Cent, House of Pain, Six Days,
      Vico C, Shaggy, DMX, Eminem ×2, Snoop Dogg) y dos son versiones explícitas. Todos a 96 kb/s
      en `public/music` (~30 MB, se bajan de a uno y **no autoarrancan en celular**).

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
- **Fotos de modelo:** deja las fotos en `MATERIAL/models-in/` nombradas `<Pieza> - <Género> <Ángulo>.png` y corre **`npm run models`**. Las normaliza a **900×1125 WebP sobre crema `#ECEAE6`** en `public/brand/models/<slug>/<genero>-<angulo>.webp` y te dice cuáles faltan (cada pieza necesita 6: hombre/mujer × frontal/lateral/espalda). Detalle en el [README](README.md#-fotos-de-modelo). El campo `Product.models` se genera solo con el helper `modelSet(slug)`.

_Última actualización: 2026-07-26._
