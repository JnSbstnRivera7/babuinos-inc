# 📋 Pendientes — Babuinos Inc

Checklist accionable. Visión por fases en **[ROADMAP.md](ROADMAP.md)** · hallazgos medidos en
**[AUDITORIA-UX.md](AUDITORIA-UX.md)**.

Estado: **en vivo** en https://babuinos-inc.vercel.app con las 15 piezas del catálogo.

> **Continuar en otro chat:** credenciales (GitHub PAT, Vercel token, Supabase key, admin, WhatsApp)
> en **`CREDENCIALES.local.md`** (local, no se sube) y en `.env.local`. Para pushear ojo con la cuenta:
> el `git push` normal falla con 403 porque el `gh` de esta máquina está logueado con la cuenta de
> empresa — ver la nota de despliegue al final.

---

## 🔴 Tú tienes la pelota (nadie más puede hacerlo)

- [ ] **STOCK REAL de las 15 piezas.** Hoy TODAS usan el mismo tallaje provisional (`TALLAS_STD` en
      `src/lib/products.ts`: S-2XL con 6/8/8/6/4). Qué tallas existen de verdad por pieza y cuántas.
      Talla en 0 sale tachada como agotada.
- [ ] **Medir el inventario** para la guía de tallas. `SIZE_GUIDE` en `ProductDetail.tsx` usa
      **medidas de referencia de oversize de mercado**, no las de estas prendas. El modal lo dice
      ("referencia, ±2 cm") y ofrece WhatsApp para la exacta. Ojo: **Guns & Roses** va crop en mujer.
- [ ] ⚠️ **Licencias de terceros.** Tres diseños usan marcas que no son de Babuinos:
      **Guns & Roses Red** (nombre y el revólver-con-rosas de la banda), **The Mills** (nombre y foto
      de la banda) y **Offline Pleasure** (MTLS.CORP / Too Fucking Nice Studio). La tienda ya es
      pública, así que el riesgo está corriendo. Conseguir permiso, rediseñar, o sacarlas.
- [ ] **Links reales** de Instagram y Facebook — hoy `instagram.com/babuinos.inc` y
      `facebook.com/babuinos.inc` son placeholders en `SocialButtons.tsx`.
- [ ] **Verificar el Drop**: hoy dice `Drop 02 — Expedición` para el **15-ago-2026**
      (`DropCountdown.tsx`). ¿Es real?
- [ ] **¿"Rootwailer" o "Rottweiler"?** Quedó como lo escribiste. Si fue dedo, cambia en
      `products.ts` y en el slug.
- [ ] **¿Altura en metros o pies?** El copy dice **2.600 m** (Bogotá está a 2.600 metros; 2.600 ft
      serían ~790 m). Si la quieres en pies es un renglón: `altura` en `src/lib/brand.ts`.
- [ ] **Contenido para Envíos / Cambios / FAQ** — necesito tus tiempos y condiciones reales para
      escribir esas páginas.
- [ ] **Música con licencia.** Los 10 temas son comerciales (2Pac, 50 Cent, House of Pain, Six Days,
      Vico C, Shaggy, DMX, Eminem ×2, Snoop Dogg) y dos son versiones explícitas.
- [ ] **Rotar credenciales** compartidas en desarrollo (GitHub PAT `ghp_…`, token Vercel `vcp_…`,
      service key de Supabase) y **cambiar `ADMIN_PASSWORD`** (env var en Vercel).

## 🟠 Rompe la confianza — arreglar primero

- [ ] **12 enlaces muertos en el footer** (`Footer.tsx:52`, todos `href="#"`). Ninguna de las 8 rutas
      existe. Detalle en [AUDITORIA-UX.md](AUDITORIA-UX.md#11-doce-enlaces-muertos-en-el-footer).
      Nota: **"Nuestra Historia" ya existe** (es `/nosotros`) y **"Ediciones Patch" ya no es un
      concepto de la marca**.
- [ ] **El carrito no valida el stock.** `store.ts:41` y `:65` suman cantidad sin comparar contra
      `sizes[].stock` → se puede pedir 10 de una talla que tiene 3. **El más caro de la lista.**
- [ ] **El home no muestra ni un producto** (0 enlaces a `/producto/`). El componente `Destacados` y
      el helper `getFeatured()` ya existen y funcionan: solo hay que enchufarlos al flujo.

## 🟡 SEO — la tienda es pública pero invisible

- [ ] **`sitemap.xml`** y **`robots.txt`** (con `src/app/sitemap.ts` / `robots.ts`).
- [ ] **Datos estructurados `schema.org/Product`** en las fichas (foto, disponibilidad, marca).
- [ ] **`<h1>` en el home** — hoy no tiene ninguno (2 `<h2>` y cero `<h1>`).
- [ ] **Salto de jerarquía en `/tienda`**: 1 `<h1>`, **0 `<h2>`**, 15 `<h3>`.
- [ ] **Página 404 propia** (`src/app/not-found.tsx`) con salida a la tienda.

## 🟢 Accesibilidad — todo medido

- [ ] **Contraste bajo AA en 5 estilos.** Los peores: copyright 10 px **2.10:1**, colorway de la
      tarjeta 10 px **2.81:1**, descripción de la tarjeta 13 px **3.71:1**. El patrón es opacidad
      `/25`–`/55` en texto de 10–14 px. Tabla completa en la auditoría.
- [ ] **Áreas de toque bajo 44 px** (146 elementos). Críticos: pills de talla **32×32**, corazón de
      favoritos **36×36**, segmentado Hombre/Mujer **28 de alto**, botón de Filtros **42×34**.
- [ ] **Sin indicador de foco**: cero `:focus-visible` en `globals.css`; solo 4 componentes definen
      foco. Navegar con teclado es a ciegas.
- [ ] **`aria-live` en el toast** — hoy un lector de pantalla no sabe que agregaste algo a la mochila.
- [ ] **`<label>` en los formularios** — checkout (nombre/teléfono/ciudad/nota) y Club son
      placeholder-only: al escribir desaparece la etiqueta.

## 🔵 Siguientes builds (necesitan decisión o backend)

- [ ] **Alguna señal de precio** sin publicar la lista (rango por línea, o "desde $X").
- [ ] **Sacos / Medias / Accesorios**: lanzarlas o sacarlas del menú (3 de 4 categorías del nav están
      vacías con badge "Pronto").
- [ ] **Catálogo desde Supabase** (CMS) — resuelve de raíz el pendiente del stock.
- [ ] **Precios + pasarela** (Wompi / Bold / Mercado Pago) o seguir por WhatsApp.
- [ ] **Reseñas / estrellas** con reseñas reales o captura por WhatsApp tras la compra.
- [ ] **Analítica "lo más visto"** (vistas en Supabase + vista en `/admin`).
- [ ] **Email del Club** a un proveedor + dominio propio.
- [ ] Borrar los 4 componentes muertos: `Lookbook`, `BaboonStrip`, `FeaturesStrip`, `AdminChat`.
- [ ] Sacar **framer-motion** del bundle base (222 KB, en 7 componentes incluido el Navbar).

---

## ✅ Cerrado

- [x] **Catálogo completo** (4-ago): 15 piezas — 5 Básicas + 10 Colección Fundadores, con 90 fotos de
      modelo y 30 de prenda sola procesadas desde `MATERIAL/Camisas`. Las 5 piezas viejas salieron.
- [x] **Básicas vs Estampadas** con el filtro visible en la barra y conteos, más filtro de Color.
- [x] **Sin precios en la web** (decisión de Juan). Verificado: cero importes en el sitio.
- [x] **Responsive**: 3 cortes distintos arreglados; verificado sin desbordes en 320 / 375 / 414 px.
- [x] **Velocidad móvil**: home de 3.8 MB → 1.19 MB.
- [x] **Bugs de ficha**: corazón simétrico, género que sigue la línea de entrada, galería con flechas
      y deslizar con el dedo.
- [x] **Copy de Tábogo** en una sola fuente (`src/lib/brand.ts`).
- [x] **Wallpaper nuevo** + 10 temas de música.
- [x] **Pipeline de fotos** guardado en el repo (`scripts/`).

---

## ⚙️ Notas técnicas

- **Desplegar:** push a `main` auto-despliega en Vercel. ⚠️ El `git push` normal **falla con 403**: el
  `gh` CLI de esta máquina está autenticado con la cuenta de **empresa** (`JnSbstnRivera`, sin el 7).
  Hay que usar el PAT personal como header Basic:
  ```bash
  PAT=$(grep -oE "(ghp_|github_pat_)[A-Za-z0-9_]+" CREDENCIALES.local.md | head -1)
  B64=$(printf 'JnSbstnRivera7:%s' "$PAT" | base64 -w0)
  git -c http.extraHeader="Authorization: Basic $B64" push origin main
  ```
  Meter el token en la URL (`https://user:pat@github.com/…`) falla con "Could not resolve host".
  Después, verificar que el deploy corresponda al commit (no basta con que diga READY):
  `GET https://api.vercel.com/v6/deployments?projectId=babuinos-inc&teamId=…&limit=1` → comparar
  `meta.githubCommitSha`.
- **PWA/caché:** service worker `babuinos-v4`, network-first. Al desplegar, en el celular **cerrar y
  reabrir** la app para bajar la versión nueva.
- **Preview headless:** el home cuelga el navegador de pruebas por las animaciones perpetuas;
  verificar por navegación/DOM, no por screenshot.
- **Fotos:** ver [README](README.md#-fotos-de-modelo). Las láminas se clasifican **por proporción, no
  por nombre** (~1.25 = grilla de modelos 3×2, ~1.78 = prenda sola) y el lado frente/espalda va en la
  tabla `ESPALDA_IZQ` de `scripts/ingest_camisas.py` porque no se puede deducir.

_Última actualización: 2026-08-04._
