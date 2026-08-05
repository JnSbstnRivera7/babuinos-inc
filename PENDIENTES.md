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

- [ ] **STOCK REAL de las 18 piezas.** Hoy TODAS usan el mismo tallaje provisional (`TALLAS_STD` en
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
- [ ] **Nombre del Drop**: la fecha ya es la real (**4-sep-2026, 8 pm hora Colombia**), pero el nombre
      sigue siendo `Drop 02 — Expedición` en `DropCountdown.tsx`. ¿Se queda así?
- [ ] **¿"Rootwailer" o "Rottweiler"?** Quedó como lo escribiste. Si fue dedo, cambia en
      `products.ts` y en el slug.
- [ ] **¿Altura en metros o pies?** El copy dice **2.600 m** (Bogotá está a 2.600 metros; 2.600 ft
      serían ~790 m). Si la quieres en pies es un renglón: `altura` en `src/lib/brand.ts`.
- [ ] **Contenido para Envíos / Cambios / FAQ** — necesito tus tiempos y condiciones reales para
      escribir esas páginas.
- [ ] **Música con licencia.** Los 9 temas son comerciales (2Pac, 50 Cent, Vico C, Shaggy, DMX,
      Eminem ×3, Snoop Dogg) y varios son versiones explícitas.
- [ ] ⚖️ **Datos legales para `/privacidad`.** `src/lib/privacidad.ts` tiene campos `PENDIENTE`:
      razón social, NIT y un correo de atención de solicitudes. **Revisar la política con un abogado**
      antes de operar en serio — hoy está inspirada en la Ley 1581/2012 pero no validada.
- [ ] **Columna `privacy_accepted` en la tabla `orders`.** Hoy el consentimiento se guarda dentro de
      la nota y en el mensaje de WhatsApp. Para tenerlo como booleano aparte, agregar la columna y
      luego descomentar el campo en `api/checkout/route.ts` (si se mete sin crearla, PostgREST rompe
      TODO insert de pedidos en silencio).
- [ ] **Rotar credenciales** compartidas en desarrollo (GitHub PAT `ghp_…`, token Vercel `vcp_…`,
      service key de Supabase) y **cambiar `ADMIN_PASSWORD`** (env var en Vercel).

## 🔵 Siguientes builds (necesitan decisión o backend)

- [ ] **Alguna señal de precio** sin publicar la lista (rango por línea, o "desde $X"). Hoy el
      cliente no sabe si la camisa vale $60.000 o $300.000 antes de escribir. Es la fricción más
      grande que queda en el embudo.
- [ ] **Páginas de Envíos / Cambios / FAQ.** Se sacaron del footer para no prometer en falso; cuando
      me des tiempos y condiciones reales las escribo y vuelven a enlazarse.
- [ ] **Sacos / Medias / Accesorios**: lanzarlas o sacarlas del menú (3 de 4 categorías del nav están
      vacías con badge "Pronto").
- [ ] **Catálogo desde Supabase** (CMS) — resuelve de raíz el pendiente del stock.
- [ ] **Precios + pasarela** (Wompi / Bold / Mercado Pago) o seguir por WhatsApp.
- [ ] **Reseñas / estrellas** con reseñas reales o captura por WhatsApp tras la compra.
- [ ] **Analítica "lo más visto"** (vistas en Supabase + vista en `/admin`).
- [ ] **Email del Club** a un proveedor + dominio propio.
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
- [x] **Ajustes de uso real** (4-ago): música a un toque en celular, un solo camino de compra (todo
      por la mochila, sin WhatsApp directo desde la ficha), Básicas/Estampadas en pestañas de una
      sola fila, home sin vitrina y Drop al 4-sep.
- [x] **Consentimiento de datos** (Ley 1581): página `/privacidad` con el wallpaper de la marca +
      check obligatorio en el checkout, con la autorización guardada como prueba.
- [x] **Música alineada a la carpeta de Juan**: quedan los 8 temas de `MATERIAL/Babuinos music`
      (se quitaron House of Pain y Six Days, que no estaban).
- [x] **Pieza 16 "Guardián Navy"** (5-ago): azul marino, ángel guardián a la espalda; nuevo color de
      filtro Azul + tema nuevo (Eminem — Ass Like That, 9 en total).
- [x] **Pieza 17 "Green Afro Tiki"** (5-ago): celeste con tiki verde; nuevo color de filtro Celeste.
      Además Guns & Roses ahora muestra la prenda sola por corte (oversize hombre / crop mujer).
- [x] **Pieza 18 "Eternal Beauty"** (5-ago): negra, querubín a la espalda. Y música al primer gesto en
      cualquier parte, también en celular (a pedido de Juan).
- [x] **Auditoría de UI/UX aplicada** (4-ago) — ver [AUDITORIA-UX.md](AUDITORIA-UX.md):
      footer sin enlaces muertos (12 → 0), tope de stock en el carrito, contraste AA (5 fallas → 0),
      áreas de toque (146 bajo 44 px → 0),
      `sitemap.xml` + `robots.txt` + `schema.org/Product` + 404 propia, `<h1>` en el home y
      jerarquía de `/tienda`, `:focus-visible` global, `aria-live` en el toast, `<label>` en los
      formularios, y borrados los 5 componentes muertos.

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
