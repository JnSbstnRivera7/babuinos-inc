# 📋 Pendientes — Babuinos Inc

Checklist accionable. Visión por fases en **[ROADMAP.md](ROADMAP.md)** · hallazgos medidos en
**[AUDITORIA-UX.md](AUDITORIA-UX.md)**.

Estado: **en vivo** en https://babuinos-inc.vercel.app con las 16 piezas del catálogo.

> **Continuar en otro chat:** credenciales (GitHub PAT, Vercel token, Supabase key, admin, WhatsApp)
> en **`CREDENCIALES.local.md`** (local, no se sube) y en `.env.local`. Para pushear ojo con la cuenta:
> el `git push` normal falla con 403 porque el `gh` de esta máquina está logueado con la cuenta de
> empresa — ver la nota de despliegue al final.

---

## 🔴 Tú tienes la pelota (nadie más puede hacerlo)

- [ ] **STOCK REAL de las 16 piezas** — _(9-ago, Juan: por ahora **se estampa por pedido** sobre la
      camisa y el diseño elegido, así que **no hay stock real que cargar** — el tallaje provisional se
      queda tal cual. Retomar cuando haya inventario físico.)_ Cuando llegue ese momento, el único paso
      es **escribir los números** en `/admin` → Inventario (sin código ni SQL: la tabla
      `product_stock` está creada y probada, 6-ago). Casilla vacía = la talla no existe · `0` = agotada
      (tachada) · `n` = unidades, y el carrito no deja pedir más. Sin cargar, usa `TALLAS_STD` y el
      panel la marca "Sin cargar".
- [ ] ⚠️ **Ojo con el Supabase gratis: ya desapareció una vez.** El 6-ago el proyecto
      `cmfcgbqpvguihazmrlgs` daba NXDOMAIN y desde Vercel las lecturas fallaban con
      `TypeError: fetch failed`; Juan lo reactivó el mismo día y los datos estaban intactos. Los
      proyectos gratuitos se pausan por inactividad, y mientras está caído **los pedidos y los
      correos del Club no se guardan** (la venta no se cae: el insert es best-effort y el enlace de
      WhatsApp sale igual). Si vuelve a pasar: reactivar, y si hubiera que crear uno nuevo, correr
      [`supabase/schema.sql`](supabase/schema.sql) y actualizar `NEXT_PUBLIC_SUPABASE_URL` +
      `SUPABASE_SERVICE_ROLE_KEY` en **dos lados**: `.env.local` y las env vars de producción en
      Vercel.
- [ ] **Medir el inventario** para la guía de tallas. `SIZE_GUIDE` en `ProductDetail.tsx` usa
      **medidas de referencia de oversize de mercado**, no las de estas prendas. El modal lo dice
      ("referencia, ±2 cm") y ofrece WhatsApp para la exacta.
- [ ] **Contenido para Envíos / Cambios / FAQ** — necesito tus tiempos y condiciones reales para
      escribir esas páginas.
- [ ] **Música con licencia.** Los 9 temas son comerciales (2Pac, 50 Cent, Vico C, Shaggy, DMX,
      Eminem ×3, Snoop Dogg) y varios son versiones explícitas. _(9-ago, Juan: se dejan por ahora;
      retomar con royalty-free —Pixabay/Uppbeat gratis o Epidemic/Artlist de pago— antes de promocionar
      en serio.)_
- [ ] ⚖️ **Datos legales para `/privacidad`.** `src/lib/privacidad.ts` tiene campos `PENDIENTE`:
      razón social, NIT y un correo de atención de solicitudes. **Revisar la política con un abogado**
      antes de operar en serio — hoy está inspirada en la Ley 1581/2012 pero no validada.
- [ ] **Columna `privacy_accepted` en la tabla `orders`.** Hoy el consentimiento se guarda dentro de
      la nota y en el mensaje de WhatsApp. Para tenerlo como booleano aparte, agregar la columna y
      luego descomentar el campo en `api/checkout/route.ts` (si se mete sin crearla, PostgREST rompe
      TODO insert de pedidos en silencio).
- [ ] **Rotar credenciales** compartidas en desarrollo (GitHub PAT `ghp_…`, token Vercel `vcp_…`,
      service key de Supabase) y **cambiar `ADMIN_PASSWORD`** (env var en Vercel).

- [ ] **Lámina de modelos de Eternal Beauty** (`13.5.png`): la actual muestra el frente viejo
      ('Do You Want Something'), así que la ficha enseña dos frentes distintos. Con la lámina nueva:
      `py scripts/ingest_camisas.py --solo eternal-beauty --parte grilla`.

## 🔵 Siguientes builds (necesitan decisión o backend)

- [ ] **Dominio propio** (p. ej. babuinos.co): hoy la tienda vive en `babuinos-inc.vercel.app`. Es
      barato, se conecta en Vercel en diez minutos y cambia por completo cómo se ve el enlace cuando
      lo pasas por WhatsApp. También es requisito para el correo del Club.
- [ ] **Saber cuánta gente entra.** No hay analítica: no sabemos visitas, ni qué pieza se mira más,
      ni de dónde llega la gente. Vercel Analytics es un interruptor; Plausible o Umami si prefieres
      algo independiente.
- [ ] **Imagen de compartir POR PIEZA** (`opengraph-image` en la ruta de producto). Hoy compartir
      cualquier ficha por WhatsApp muestra la misma imagen genérica de la marca; con esto se vería la
      camisa. Es de las cosas más baratas que suben la conversión.

- [ ] **Páginas de Envíos / Cambios / FAQ.** Se sacaron del footer para no prometer en falso; cuando
      me des tiempos y condiciones reales las escribo y vuelven a enlazarse.
- [ ] **Sacos / Medias / Accesorios**: lanzarlas o sacarlas del menú (3 de 4 categorías del nav están
      vacías con badge "Pronto").
- [ ] **Catálogo desde Supabase** (CMS) — el **stock ya salió del código** (tabla `product_stock`
      editable en `/admin`); faltaría lo demás: nombres, copy, fotos y precios.
- [ ] **Pasarela de pago** (Wompi / Bold / Mercado Pago) — hoy el precio ya se muestra y el pago se
      cierra por WhatsApp.
- [ ] **Reseñas / estrellas** con reseñas reales o captura por WhatsApp tras la compra.
- [ ] **Analítica "lo más visto"** (vistas en Supabase + vista en `/admin`).
- [ ] **Email del Club** a un proveedor + dominio propio.

---

## ✅ Cerrado

- [x] **Fuera Offline Pleasure** (9-ago, licencia del estudio MTLS.CORP): se borró la ficha de
      `products.ts` **y sus fotos** (`models/offline-pleasure/` + las dos de prenda sola), salió del
      mapa del script de ingesta, `/producto/offline-pleasure` redirige a `/tienda` (308) y el carrito
      guardado se descarta (`persist` v4). **Quedan 16 piezas.** _(Ojo: Juan creía que ya se había
      quitado con Guns & Roses y The Mills, pero seguía publicada.)_
- [x] **Decisiones de Juan (9-ago):** el próximo Drop se queda **"Expedición"**; la altura del copy va
      en **metros** (2.600 m = altura de Bogotá); el frente del **Doberman sí dice "SOMOS GRANDES"** (ya
      estaba así en la descripción). El **stock** se difiere a propósito: por ahora se estampa por
      pedido, no hay inventario físico que cargar (ver el ítem arriba).
- [x] **Links reales de Instagram y Facebook** (9-ago): Juan pasó las cuentas oficiales. Ahora en
      `SocialButtons.tsx` (Navbar, Footer, "Muy pronto") apuntan a
      `instagram.com/babuinos_inc_streetwear` y al perfil de Facebook `.../61593279293595/`; se
      quitaron los placeholders `babuinos.inc`.
- [x] **Fuera Guns & Roses Red y The Mills** (7-ago, decisión de Juan por las licencias de las
      bandas): se borraron las fichas **y sus fotos del sitio**, salieron del mapa de ingesta, sus
      URLs redirigen a `/tienda` y el carrito guardado se descarta (`persist` v3). Quedan 17 piezas.
- [x] **"Rootwailer" → "Rottweiler"** (6-ago): el nombre estaba mal escrito. Se corrigió el nombre,
      el slug, el id y los 8 archivos de fotos; la URL vieja `/producto/rootwailer` redirige
      permanente (308) a la nueva para no romper enlaces ya compartidos.
- [x] **Pieza 19 "Doberman Sangre"** (6-ago): lavada a la piedra, doberman de facetas con ojos rojos
      a la espalda bajo BABUINOS en death metal; nuevo color de filtro **Negro lavado**.
- [x] **framer-motion fuera del marco de la página** (6-ago): la librería venía en TODAS las páginas
      por el Navbar y solo se le pedían fades y slides. Ahora eso es CSS (`usePresence` +
      `data-abierto`) y la librería queda únicamente en la intro del home.
- [x] **Mochila en dos pasos** (6-ago): el formulario de datos sumaba 596 px en el footer fijo y en
      un teléfono de 667 no dejaba ver las camisas. Ahora paso 1 = solo prendas (329 px de lista,
      antes ~0), paso 2 = los datos cuando ya se decidió comprar. Stepper de cantidad legible
      (glifo de 14 → 18 px, trazo 1.75 → 2.75), talla y género como etiquetas.
- [x] **Inventario editable en `/admin`** (6-ago): el tallaje salió del código a la tabla
      `product_stock`; la tienda, las fichas y favoritos lo leen en el servidor y se revalidan al
      guardar. Ver [README](README.md#-inventario-tallaje-real-sin-desplegar).
- [x] **Hidratación del nav** (6-ago): los contadores de mochila y favoritos salen de localStorage y
      rompían la hidratación de todo el nav en cada carga de quien ya tenía prendas guardadas.
- [x] **Catálogo completo** (4-ago): 15 piezas — 5 Básicas + 10 Colección Fundadores, con 90 fotos de
      modelo y 30 de prenda sola procesadas desde `MATERIAL/Camisas`. Las 5 piezas viejas salieron.
- [x] **Básicas vs Estampadas** con el filtro visible en la barra y conteos, más filtro de Color.
- [x] **Precios y promos** (5-ago): básicas $50k, estampadas $75k; combos 3x140 y 2x140 automáticos
      en el carrito; género + precios + total en el mensaje de WhatsApp.
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
- **PWA/caché:** service worker `babuinos-v12` (`public/sw.js`, network-first). Al desplegar, en el celular **cerrar y
  reabrir** la app para bajar la versión nueva.
- **Preview headless:** el home cuelga el navegador de pruebas por las animaciones perpetuas;
  verificar por navegación/DOM, no por screenshot.
- **Fotos:** ver [README](README.md#-fotos-de-modelo). Las láminas se clasifican **por proporción, no
  por nombre** (~1.25 = grilla de modelos 3×2, ~1.78 = prenda sola) y el lado frente/espalda va en la
  tabla `ESPALDA_IZQ` de `scripts/ingest_camisas.py` porque no se puede deducir.

_Última actualización: 2026-08-07._
