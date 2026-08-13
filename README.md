# 🦍 Babuinos Inc — Streetwear Cult

> _Del asfalto de Tábogo para el mundo._
> Tienda **inmersiva** de Babuinos Inc — streetwear oversize diseñado a 2.600 m.

- 🌐 **En vivo:** https://babuinos-inc.vercel.app
- 💻 **Repo:** https://github.com/JnSbstnRivera7/babuinos-inc
- 🔐 **Panel:** https://babuinos-inc.vercel.app/admin

**Estado:** 16 piezas en producción. Qué falta → **[PENDIENTES.md](PENDIENTES.md)** ·
plan por fases → **[ROADMAP.md](ROADMAP.md)** · hallazgos de UI/UX medidos →
**[AUDITORIA-UX.md](AUDITORIA-UX.md)**.

---

## ✨ Concepto

Babuinos Inc es una marca de ropa oversize con identidad de "selva de cemento": la jungla tomándose la ciudad. La página traduce eso en una experiencia inmersiva — la selva se **revela con el scroll** y queda como **fondo fijo** de toda la tienda — con un look editorial/streetwear muy comercial.

**Tábogo** es el nombre de calle de Bogotá en voz de marca; todo el copy vive en `src/lib/brand.ts`. El nombre real se usa donde el cliente lo necesita literal (envíos, línea legal, keywords de SEO).

## 👕 El catálogo

Dos líneas, definidas en `src/lib/products.ts` (fuente única):

| Línea | Piezas | Qué es |
| --- | --- | --- |
| **Básicas** | 5 | Sin estampado. Son la paleta oficial de la marca: Teal Expedición, Tinta Explorador, Pardo Tostado, Ocre Dorado, Papiro. Babuino troquelado en el ruedo y BABUINOS en la nuca. |
| **Colección Fundadores** | 11 | Las estampadas: Wear Your Attitude, Free Palestine, Rottweiler, Brave Dog, Babuinos Lila, Asian Tengu Mask, California Rasta Kid, Guardián Navy, Green Afro Tiki, Eternal Beauty, Doberman Sangre. |

El campo `category` es **`basica` | `estampada`** — el filtro Todo/Básicas/Estampadas va **visible en la barra de la tienda** con conteos, no escondido en el panel. Dentro del panel queda el filtro de **Color** (campo `color`, lista `COLORES`); `edition` sobrevive solo como color de acento de sellos y badges.

Detalles útiles: **"SG"** que aparece en varias piezas es el monograma de _SOMOS GRANDES_ (la espalda de Rottweiler lo escribe completo).

> **Piezas retiradas por licencias de terceros:** **Guns & Roses Red** y **The Mills** (7-ago), y **Offline Pleasure** (9-ago, bloque MTLS.CORP). En cada una se borraron la ficha **y sus fotos del sitio**, salieron del mapa del script de ingesta, y `/producto/{guns-roses-red,the-mills,offline-pleasure}` redirigen a `/tienda`. El soporte de piezas con **dos cortes** (`imagesByGender`, oversize en hombre / crop en mujer) sigue en el código porque es genérico, pero hoy no lo usa ninguna pieza.

**Precios (COP):** básicas $50.000, estampadas $75.000 (`PRECIO` por categoría en `products.ts`, no pieza por pieza). **Promos por combo automáticas:** 3 básicas o 2 estampadas cualesquiera por $140.000 (`PROMOS` + `cartTotals`), aplicadas en el carrito y reflejadas en el total del mensaje de WhatsApp. Pago y envío se coordinan por WhatsApp.

## 🧩 Arquitectura y características

**Arquitectura por secciones** (no una sola landing):

- **Home** = SOLO la entrada: intro scroll-reveal (el logo descubre el wallpaper fijo) + **"Elige tu territorio"** (puertas Hombre/Mujer con logos reales SVG + Unisex) + **Drop con cuenta regresiva y lista de espera**. Nada de catálogo: es una puerta, no una vitrina. El `<h1>` va en `sr-only` porque el título visual es el logo.
- **`/tienda`** (PLP): grid de producto. **Básicas / Estampadas en pestañas** (una fila, ancho repartido en tres, con conteos), segmentado Todos/Hombre/Mujer, y **Color** en el panel glass (dropdown en PC / bottom-sheet en móvil). Siempre arranca desde arriba.
- **`/producto/[slug]`** (PDP): **minigalería con la camisa puesta** (frente/lateral/espalda) + **toggle Hombre/Mujer**, **flechas y deslizar con el dedo**, y **zoom** a pantalla completa; tallas con "agotado", **guía de tallas**, **un solo CTA — "Agregar a la mochila"** — y "combina con". Entrar por la línea Mujer mantiene el modelo mujer en la ficha (`?g=`, leído con `useSyncExternalStore` para no perder el prerender).
- **`/nosotros`** · **`/club`** (waitlist) · **`/favoritos`** (wishlist) · **`/privacidad`** (tratamiento de datos).

**Transversal:**

- **Favoritos / wishlist:** corazón en tarjetas y PDP, contador en el nav, página propia (persistido en localStorage).
- **Carrito** persistente + formulario del cliente → **checkout por WhatsApp** + guardado en Supabase (`orders`). **Es el ÚNICO camino de compra**: todo entra a la mochila y el pedido se cierra desde ahí. El mensaje lleva **precio por línea, género (Hombre/Mujer), subtotal, promo y total**. **Topa el stock por talla** (`add()` devuelve `false` al máximo). Cada línea guarda `max`, `category`, `price` y `genero`; la clave de línea es id+talla+género (así una pieza de dos cortes no se mezcla). `persist` va en **v4**: descarta carritos viejos (sin precio, o con las piezas retiradas).
- **Globales en toda la página:** reproductor **"Babuinos Ft M.A.D. Fellaz"** (arranca al primer gesto en cualquier parte, en celular y escritorio), **WhatsApp flotante**, botón **"Instalar app"** (PWA) arriba-centrado, **barra de confianza** (envío/cambios/pago) en el footer.
- **Tarjetas con la camisa puesta** (foto frontal del modelo; **hover → espalda** para ver el gráfico) que respetan el género en contexto (filtro de tienda). **Sello de género** (moño mujer, gorra hombre, babuino unisex) + **selector de colorway** en vivo.
- **Panel `/admin`** con login temático + gráficas (pedidos por día, top productos, por ciudad) y tablas.
- **PWA instalable** (manifest + service worker network-first) · **OG image** para compartir.
- **Efectos:** **wallpaper fijo art-directed** (mural BABUINOS INC sobre el skyline — **vertical en móvil / horizontal en escritorio** vía `<picture>`, se descarga solo la que aplica), lianas/hojas (CSS + Canvas), shine dorado, íconos SVG propios.

## ⚖️ Datos personales (Ley 1581 de 2012)

- **Página `/privacidad`** dentro del `Shell` (mismo wallpaper de la marca), con el texto en
  `src/lib/privacidad.ts` para editarlo sin tocar la maquetación. Cubre responsable, datos, finalidades,
  derechos del titular, plazos, autorización, datos sensibles/menores, seguridad y vigencia.
- **Check de autorización en el checkout**, sin premarcar (la ley exige autorización previa y expresa).
  Sin marcarlo, el botón de enviar queda deshabilitado. Enlaza a `/privacidad`.
- La autorización queda como **prueba** en dos lados: en el mensaje de WhatsApp
  (`✅ Autoricé el tratamiento…`) y en la nota que se guarda en Supabase.
- ⚠️ **Pendiente legal:** `src/lib/privacidad.ts` tiene campos `PENDIENTE` (razón social, NIT, correo
  de atención) y conviene revisarlo con un abogado. Para guardar el consentimiento como booleano
  aparte hay que **agregar la columna `privacy_accepted` a la tabla `orders`** — hoy NO se inserta
  porque PostgREST falla el insert entero si la columna no existe (ver el comentario en
  `api/checkout/route.ts`).

## 🔎 SEO y accesibilidad

Estado tras la [auditoría del 4-ago](AUDITORIA-UX.md):

- **`sitemap.xml`** (`src/app/sitemap.ts`: rutas estáticas + una por ficha de producto) y **`robots.txt`** (`robots.ts`, bloquea `/admin` y `/api/`, referencia el sitemap).
- **`schema.org/Product`** en cada ficha (`producto/[slug]/page.tsx`): nombre, marca, color, material, fotos, tallas disponibles y `availability`. **Sin precio no se declara oferta** — no se inventa lo que no hay.
- **Jerarquía de encabezados** correcta: `<h1>` en el home y en cada página; en `/tienda` un `<h2>` en `sr-only` describe el filtro activo para no saltar de `h1` a los `h3` de las piezas.
- **Página 404 propia** (`not-found.tsx`) con marca y salida a la tienda.
- **Contraste AA** verificado midiendo el color compuesto sobre el fondo real. Regla práctica: nada de texto por debajo de **12 px** ni opacidades bajo **`/70`** para contenido (los estados `disabled` sí pueden, están exentos).
- **Áreas de toque ≥ 44 px** en todo control. Para enlaces de texto se usa `inline-flex min-h-11 items-center` en vez de agrandar la letra.
- **`:focus-visible` global** en `globals.css` (dorado; tinta sobre superficies claras). Solo se dispara con teclado, no al hacer clic.
- **Toast con `aria-live="polite"`**: la región vive siempre en el DOM, si se montara con el mensaje el lector de pantalla no lo alcanzaría a anunciar.
- **Formularios con `<label>` visible** (checkout y Club) + `autoComplete` para que el sistema autocomplete.
- **Deep links** `?tipo=basica` · `?tipo=estampada` · `?genero=hombre|mujer`, leídos en `tienda/page.tsx` y usados por el footer y el sitemap.

## ⚡ Rendimiento en móvil

El home pasó de **3.8 MB a 1.19 MB**. Lo que lo logró, por si se quiere revertir algo:

- **La música arranca al primer gesto** (toque/click/scroll) también en celular, a pedido de Juan. Baja por streaming (206 Partial), así que no bloquea la primera vista. _(Antes no autoarrancaba en móvil para ahorrar datos; se revirtió.)_
- **Intro estática en celular** (y con `prefers-reduced-motion`): la versión animada recalculaba 7 valores por cada frame de scroll. De paso el hero pasó de 135vh a una pantalla, así que las puertas quedan a un desliz.
- **Adornos fuera en celular:** `PageVines` no se renderiza (8 SVG de ~87 hojas cada uno) y `CssLeaves` tampoco. Ocultarlos por CSS mataba la animación pero el markup seguía viajando.
- `baboon.png` 174 KB → `baboon.webp` **18 KB** (la máscara CSS solo usa el alfa).
- Logo con `sizes`: pedía un render de 3840 px en un celular.
- Lenis (scroll suave) apagado en táctil · `touch-action: manipulation`.
- **framer-motion fuera del marco de la página** (10-ago): venía en TODAS las páginas por culpa del Navbar y solo se usaba para fades y slides. Eso ahora es CSS (`usePresence` + `data-abierto`) y la librería quedó solo en la intro del home. Medido en producción: `/tienda` pasó de **838 KB a 704 KB** en crudo y de **264 KB a 218 KB** comprimidos (−17 %); la ficha, favoritos y nosotros bajaron igual.

## 🛠️ Stack

- **Next.js 16** (App Router, Turbopack) · **React 19** · **TypeScript**
- **Tailwind CSS v4** · **Framer Motion** (solo la intro del home; el resto de animaciones son CSS) · **Lenis** (solo desktop) · **Zustand** (carrito, wishlist, tema) · **Recharts** (solo `/admin`) · **Supabase**

## 🚀 Desarrollo

```bash
npm install
npm run dev      # http://localhost:3020 (ver .claude/launch.json) o :3000
npm run build
npm start
```

## 🔐 Variables de entorno

Copia `.env.example` → `.env.local` (no se sube a git):

| Variable | Uso |
| --- | --- |
| `WHATSAPP_NUMBER` / `NEXT_PUBLIC_WHATSAPP_NUMBER` | Número de la tienda (con indicativo). Ej: `573504444668` |
| `WHATSAPP_WEBHOOK_URL` | Webhook opcional (n8n/Make) |
| `NEXT_PUBLIC_SUPABASE_URL` · `SUPABASE_SERVICE_ROLE_KEY` | Supabase (pedidos + waitlist) |
| `ADMIN_USER` · `ADMIN_PASSWORD` | Acceso al panel `/admin` |

## 🔐 Panel de administración

`/admin` — login con usuario y clave (env `ADMIN_USER` / `ADMIN_PASSWORD`). Muestra:
- **Inventario editable:** el tallaje de las 16 piezas, sin tocar código (ver abajo).
- **Gráficas:** pedidos por día (14 días), productos más pedidos, pedidos por ciudad.
- **Tablas:** pedidos (cliente, teléfono → WhatsApp, ciudad, productos, nota) y Club (correos).
- No indexable (`robots: noindex`). Cambia la clave en las env vars.

## 📦 Inventario (tallaje real, sin desplegar)

El catálogo —nombres, fotos, copy— vive en `src/lib/products.ts` porque cambia poco y se
versiona con el código. **El tallaje cambia todos los días y no puede depender de un
despliegue**, así que vive en la tabla `product_stock` de Supabase y se edita en `/admin`.

Regla de la casilla, que es lo único que hay que entender:

| Casilla | Qué significa | Cómo se ve en la tienda |
|---|---|---|
| vacía | esa talla no existe para la pieza | no se muestra |
| `0` | existe pero agotada | pill tachada |
| `n` | `n` unidades | se puede pedir hasta `n` |

- **Paso único de instalación:** correr [`supabase/schema.sql`](supabase/schema.sql)
  en el SQL Editor del proyecto. Si no está creada, el panel lo dice y ofrece el SQL para copiar.
- **Nada se rompe antes de cargarlo:** una pieza sin filas usa el tallaje provisional
  (`TALLAS_STD`), y el panel la marca como "Sin cargar".
- **Dónde se aplica:** `getStockMap()` (server) → `withStock()` (puro) en `/tienda`,
  `/producto/[slug]` y `/favoritos`. Las fichas y favoritos siguen prerenderizados con
  `revalidate = 30`; al guardar, el endpoint hace `revalidatePath` de la tienda y de las fichas
  tocadas, así que el cambio se ve de una.
- **Quién escribe:** solo `POST /api/admin/stock`, con la misma cookie del panel. La tabla tiene
  RLS prendido y sin políticas: desde el navegador no se lee ni se escribe, solo entra el
  servidor con la service role.
- Vaciar **todas** las casillas de una pieza la devuelve al tallaje provisional; para marcarla
  agotada de verdad, poner las tallas en `0`.

## 🛒 Flujo de compra (WhatsApp)

1. El cliente agrega prendas (talla + cantidad).
2. Llena sus datos (nombre obligatorio, teléfono, ciudad, nota).
3. `POST /api/checkout` arma el resumen, lo guarda en `orders` (Supabase), dispara webhook opcional y devuelve un enlace `wa.me` que abre WhatsApp con el pedido listo.

## 🗄️ Supabase

```sql
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  customer_name text, phone text, city text, note text, items jsonb
);
create table public.waitlist (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  email text unique
);
```

Y el tallaje editable, en [`supabase/schema.sql`](supabase/schema.sql).

## ☁️ Deploy (Vercel)

Desplegado en https://babuinos-inc.vercel.app — repo conectado, **auto-deploy en cada push a `main`**. Env vars configuradas en el proyecto. Framework: Next.js.

> ⚠️ **El `git push` normal falla con 403.** El `gh` CLI y el credential helper de la máquina de trabajo están autenticados con la cuenta de **empresa** (`JnSbstnRivera`, sin el 7), no con la personal `JnSbstnRivera7`. Hay que usar el PAT personal de `CREDENCIALES.local.md` como header Basic — meterlo en la URL falla con "Could not resolve host". El comando exacto está en las notas técnicas de [PENDIENTES.md](PENDIENTES.md).
>
> Después del push, **verificar que el deploy corresponda al commit** (no basta con que diga READY): comparar `meta.githubCommitSha` en `GET /v6/deployments?projectId=babuinos-inc&limit=1`.
>
> En el celular, **cerrar y reabrir la PWA** para bajar la versión nueva (service worker `babuinos-v12`, en `public/sw.js`).

## 🎨 Marca

- **Paleta:** Papiro `#F3E9E2` · Teal `#00736C` · Ocre `#CDA214` · Pardo `#654321` · Tinta `#1E2021`
- **Tipografía:** Anton (titulares) · Inter (cuerpo) · Space Mono (labels)
- **Redes (cuentas reales, en `SocialButtons.tsx`):** Instagram [@babuinos_inc_streetwear](https://www.instagram.com/babuinos_inc_streetwear) · [Facebook](https://www.facebook.com/people/Babuinos-inc-streetwear/61593279293595/) · WhatsApp de la tienda.
- Assets fuente en `MATERIAL/` (fuera del repo); procesados en `/public/brand` y música en `/public/music`.

## 📁 Estructura

```
src/
  app/         layout (globales: MusicPlayer, WhatsAppFloat, InstallPrompt), page (Home),
               tienda/, producto/[slug]/, nosotros/, club/, favoritos/, admin/,
               sacos|medias|accesorios/ (Muy pronto), not-found (404 propia),
               manifest.ts, sitemap.ts, robots.ts,
               api/{checkout,waitlist,admin/login,admin/logout}, icon.png
  components/
    sections/  ScrollExpansionHero, GeneroSplit, DropCountdown, Story, Newsletter
               (Destacados: listo pero fuera del home por decisión de marca)
    tienda/    TiendaClient (PLP + barra de tipo + panel de filtros)
    producto/  ProductDetail (PDP), ProductCard
    favoritos/ FavoritosClient
    layout/    Navbar, Footer, Shell (marco de páginas internas)
    cart/      CartDrawer        admin/  AdminLogin, AdminCharts
    fx/        FixedWallpaper, PageVines, CssLeaves, LeafCanvas, MusicPlayer, WhatsAppFloat,
               InstallPrompt, SmoothScroll, Reveal
    ui/        Logo, BaboonMark, GeneroMark, Icons, SocialButtons, Toast
  lib/         products, brand (copy), store, wishlist, theme, whatsapp, supabase, toast, scroll, utils
public/        brand/ (logos, baboon.webp [máscara], genero/{hombre,mujer}.svg,
               products/<slug>-{espalda,frente}.webp [prenda sola],
               models/<slug>/{hombre,mujer}-{frontal,lateral,espalda}.webp [camisa puesta],
               jungle/{concrete-jungle, concrete-jungle-mobile}.webp), icons/ (PWA), music/ (4 temas de M.A.D. Fellaz), og.png, sw.js
scripts/       models.mjs · models_convert.py · models_grid.py · ingest_camisas.py
```

`Lookbook`, `BaboonStrip`, `FeaturesStrip` y `AdminChat` se borraron el 4-ago. **`Destacados`** (la
vitrina "Lo más buscado") se conserva a propósito: se probó en el home ese mismo día y Juan la quitó
—quiere el home como puerta, no como catálogo—, así que queda lista para volver con una línea en
`Experience.tsx` si cambia de idea.

## 📸 Fotos de modelo

Las fotos con la camisa puesta se normalizan con un script, no a mano:

```bash
npm run models
```

Lee `MATERIAL/models-in/` y deja cada foto en `public/brand/models/<slug>/<genero>-<angulo>.webp`
a **900×1125 (4:5), WebP, sobre fondo crema `#ECEAE6`**, sin canal alfa.

- **Nombra los archivos** `<Pieza> - <Género> <Ángulo>.png` — p. ej. `Negro Oro - Mujer Espalda.png`.
  Ignora acentos, mayúsculas y separadores, y entiende sinónimos (`frente`/`front`, `male`, `back`…).
- **Cada pieza necesita 6:** hombre y mujer × frontal, lateral, espalda. El script avisa cuál falta.
- Opciones: `-- <carpeta>` (otra entrada) · `--dry-run` (simular) · `--force` (rehacer las que ya existen).
- **Pieza nueva:** agrégala a `SLUG_ALIASES` en `scripts/models.mjs` y a `PRODUCTS` en
  `src/lib/products.ts` con `models: modelSet("<slug>")`.

### Ingesta de una colección completa

Para cargar una colección entera desde láminas (lo que se usó el 4-ago con las 15 piezas):

```bash
py scripts/ingest_camisas.py --dry-run   # revisa qué haría
py scripts/ingest_camisas.py             # procesa TODO
```

**Para rehacer UNA sola pieza** —lo normal cuando cambia un diseño— hay que usar `--solo`: correr
todo regeneraría las 16 y pisaría los re-cortes hechos a mano en otras láminas (las espaldas de
Free Palestine, por ejemplo).

```bash
py scripts/ingest_camisas.py --solo eternal-beauty --parte plana    # solo la prenda sola
py scripts/ingest_camisas.py --solo doberman-sangre                # prenda + modelos
py scripts/ingest_camisas.py --solo 13 --dry-run                   # por número, sin escribir
```

Lee `MATERIAL/Camisas/{BASICAS,Coleccion Fundadores}` donde cada pieza trae **dos** archivos y
los clasifica **por proporción**, no por nombre: `~1.25` = lámina de modelos 3×2, `~1.78` = prenda
sola (espalda + frente). El mapa `numero → slug` y la tabla `ESPALDA_IZQ` (qué láminas traen la
espalda a la izquierda) están arriba del script.

### Si las 6 fotos vienen en una sola lámina

```bash
npm run models -- --grid
```

Para la cuadrícula típica de **3 columnas** (frontal · lateral · espalda) × **2 filas**
(hombre · mujer). El archivo solo tiene que nombrar la pieza (`Negro Oro.png`) y sale
partido en las 6. Los cortes se buscan por las **calles blancas** entre fotos, no en partes
iguales, así que aguanta márgenes desiguales; si no encuentra la cuadrícula avisa y divide
en partes iguales. Otra disposición: `--grid 2x3`.

> Motor: **Pillow** (`py -m pip install pillow`), que es el que respeta la altura impar 1125.
> Sin Pillow cae a `ffmpeg` y la altura sale 1124 — avisa al correr.

## 📚 Documentación

| Documento | Para qué |
| --- | --- |
| **[PENDIENTES.md](PENDIENTES.md)** | Checklist accionable. Empieza acá: lo que solo Juan puede hacer está arriba. |
| **[ROADMAP.md](ROADMAP.md)** | Qué está hecho y qué sigue, por fases. |
| **[AUDITORIA-UX.md](AUDITORIA-UX.md)** | Auditoría de UI/UX del 4-ago con mediciones reales y el antes/después de cada arreglo. Ya está **aplicada**; sirve como registro de qué se midió y por qué se cambió. |
| `CREDENCIALES.local.md` | Tokens y claves. **Local, nunca se sube.** |

## ⚠️ Gotchas que cuestan tiempo

- **Next.js 16 no es el que conoces.** Turbopack por defecto, request APIs async, `middleware` → `proxy`. Los docs offline están en `node_modules/next/dist/docs/` (ver `AGENTS.md`).
- **El preview headless cuelga el home** por las animaciones perpetuas: verificar por navegación y DOM, no por screenshot.
- **`min-w-0` es obligatorio** en cadenas grid→flex cuando algo debe poder deslizarse: sin él, `min-width:auto` ignora el `overflow-x-auto` y el contenido estira al contenedor. Fue la causa de dos de los tres cortes de responsive.
- **`useSearchParams` rompe el prerender** de las fichas (obliga a Suspense y las deja renderizando en cliente). Para leer query params sin perder el HTML estático: `useSyncExternalStore`.
- **Las láminas de fotos se clasifican por proporción, no por nombre** — el sufijo está invertido entre las dos carpetas de `MATERIAL/Camisas`.
- **`place-items-center` en un grid dimensiona al hijo por su `max-content`**, así que un `max-w-2xl` adentro desborda en celular en vez de encogerse. Se arregla con `grid-cols-1` (= `minmax(0,1fr)`). Era el bug de `/club`.
- **Frente vs espalda en las láminas no se puede deducir.** Se probó por cobertura de tinta y por profundidad del escote: en prendas negras o lavadas la sombra de la tela pesa más que el estampado. Va en la tabla `ESPALDA_IZQ`, revisada a ojo.
- **El medidor de contraste da falsos positivos con `background-clip: text`** (el degradado dorado de `.shine-gold`): su `color` es transparente a propósito, así que sale 1.0:1. Ignorarlo.
- **Al medir áreas de toque, dejar 1 px de margen**: los altos fraccionarios (43.98) se muestran como 44 pero fallan una comparación estricta `< 44`.

---

© 2026 Babuinos Inc. — Bogotá, Colombia. _Streetwear Cult._ 🦍
