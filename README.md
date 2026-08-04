# 🦍 Babuinos Inc — Streetwear Cult

> _Del asfalto de Tábogo para el mundo._
> Tienda **inmersiva** de Babuinos Inc — streetwear oversize diseñado a 2.600 m.

- 🌐 **En vivo:** https://babuinos-inc.vercel.app
- 💻 **Repo:** https://github.com/JnSbstnRivera7/babuinos-inc
- 🔐 **Panel:** https://babuinos-inc.vercel.app/admin

**Estado:** 15 piezas en producción. Qué falta → **[PENDIENTES.md](PENDIENTES.md)** ·
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
| **Colección Fundadores** | 10 | Las estampadas: Wear Your Attitude, Guns & Roses Red, The Mills, Free Palestine, Rootwailer, Brave Dog, Babuinos Lila, Offline Pleasure, Asian Tengu Mask, California Rasta Kid. |

El campo `category` es **`basica` | `estampada`** — el filtro Todo/Básicas/Estampadas va **visible en la barra de la tienda** con conteos, no escondido en el panel. Dentro del panel queda el filtro de **Color** (campo `color`, lista `COLORES`); `edition` sobrevive solo como color de acento de sellos y badges.

Detalles útiles: **"SG"** que aparece en varias piezas es el monograma de _SOMOS GRANDES_ (la espalda de Rootwailer lo escribe completo), y **Guns & Roses viene en dos cortes** — oversize en hombre, crop en mujer.

**Sin precios en la web** por decisión de marca: precio, pago y envío se coordinan por WhatsApp. El campo `price` existe por si algún día se activan.

## 🧩 Arquitectura y características

**Arquitectura por secciones** (no una sola landing):

- **Home** = entrada: intro scroll-reveal (el logo descubre el wallpaper fijo de selva) + **"Elige tu territorio"** (puertas Hombre/Mujer con logos reales SVG + Unisex) + **Drop con cuenta regresiva y lista de espera**.
- **`/tienda`** (PLP): grid de producto. **Básicas / Estampadas visible en la barra** con conteos, segmentado Todos/Hombre/Mujer, y **Color** en el panel glass (dropdown en PC / bottom-sheet en móvil). Siempre arranca desde arriba.
- **`/producto/[slug]`** (PDP): **minigalería con la camisa puesta** (frente/lateral/espalda) + **toggle Hombre/Mujer**, **flechas y deslizar con el dedo**, y **zoom** a pantalla completa; tallas con "agotado", **guía de tallas**, **"Comprar por WhatsApp" pre-llenado**, "combina con". Entrar por la línea Mujer mantiene el modelo mujer en la ficha (`?g=`, leído con `useSyncExternalStore` para no perder el prerender).
- **`/nosotros`** · **`/club`** (waitlist) · **`/favoritos`** (wishlist).

**Transversal:**

- **Favoritos / wishlist:** corazón en tarjetas y PDP, contador en el nav, página propia (persistido en localStorage).
- **Carrito** persistente + formulario del cliente → **checkout por WhatsApp** + guardado en Supabase (`orders`).
- **Globales en toda la página:** reproductor "Babuinos Radio" (botón mini que abre al clic), **WhatsApp flotante**, botón **"Instalar app"** (PWA) arriba-centrado, **barra de confianza** (envío/cambios/pago) en el footer.
- **Tarjetas con la camisa puesta** (foto frontal del modelo; **hover → espalda** para ver el gráfico) que respetan el género en contexto (filtro de tienda). **Sello de género** (moño mujer, gorra hombre, babuino unisex) + **selector de colorway** en vivo.
- **Panel `/admin`** con login temático + gráficas (pedidos por día, top productos, por ciudad) y tablas.
- **PWA instalable** (manifest + service worker network-first) · **OG image** para compartir.
- **Efectos:** **wallpaper fijo art-directed** (mural BABUINOS INC sobre el skyline — **vertical en móvil / horizontal en escritorio** vía `<picture>`, se descarga solo la que aplica), lianas/hojas (CSS + Canvas), shine dorado, íconos SVG propios.

## ⚡ Rendimiento en móvil

El home pasó de **3.8 MB a 1.19 MB**. Lo que lo logró, por si se quiere revertir algo:

- **La música no autoarranca en celular.** Un tema son ~2.5 MB y arrancarlo en el primer toque le robaba el ancho de banda a la navegación — el tap a Hombre/Mujer parecía no responder. En escritorio sigue arrancando sola.
- **Intro estática en celular** (y con `prefers-reduced-motion`): la versión animada recalculaba 7 valores por cada frame de scroll. De paso el hero pasó de 135vh a una pantalla, así que las puertas quedan a un desliz.
- **Adornos fuera en celular:** `PageVines` no se renderiza (8 SVG de ~87 hojas cada uno) y `CssLeaves` tampoco. Ocultarlos por CSS mataba la animación pero el markup seguía viajando.
- `baboon.png` 174 KB → `baboon.webp` **18 KB** (la máscara CSS solo usa el alfa).
- Logo con `sizes`: pedía un render de 3840 px en un celular.
- Lenis (scroll suave) apagado en táctil · `touch-action: manipulation` · música a 96 kbps.

Lo que **queda** por hacer: framer-motion son 222 KB y lo usan 7 componentes incluido el Navbar, así que está en todas las páginas.

## 🛠️ Stack

- **Next.js 16** (App Router, Turbopack) · **React 19** · **TypeScript**
- **Tailwind CSS v4** · **Framer Motion** · **Lenis** (solo desktop) · **Zustand** (carrito, wishlist, tema) · **Recharts** (solo `/admin`) · **Supabase**

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
- **Gráficas:** pedidos por día (14 días), productos más pedidos, pedidos por ciudad.
- **Tablas:** pedidos (cliente, teléfono → WhatsApp, ciudad, productos, nota) y Club (correos).
- No indexable (`robots: noindex`). Cambia la clave en las env vars.

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

## ☁️ Deploy (Vercel)

Desplegado en https://babuinos-inc.vercel.app — repo conectado, **auto-deploy en cada push a `main`**. Env vars configuradas en el proyecto. Framework: Next.js.

> ⚠️ **El `git push` normal falla con 403.** El `gh` CLI y el credential helper de la máquina de trabajo están autenticados con la cuenta de **empresa** (`JnSbstnRivera`, sin el 7), no con la personal `JnSbstnRivera7`. Hay que usar el PAT personal de `CREDENCIALES.local.md` como header Basic — meterlo en la URL falla con "Could not resolve host". El comando exacto está en las notas técnicas de [PENDIENTES.md](PENDIENTES.md).
>
> Después del push, **verificar que el deploy corresponda al commit** (no basta con que diga READY): comparar `meta.githubCommitSha` en `GET /v6/deployments?projectId=babuinos-inc&limit=1`.
>
> En el celular, **cerrar y reabrir la PWA** para bajar la versión nueva (service worker `babuinos-v4`).

## 🎨 Marca

- **Paleta:** Papiro `#F3E9E2` · Teal `#00736C` · Ocre `#CDA214` · Pardo `#654321` · Tinta `#1E2021`
- **Tipografía:** Anton (titulares) · Inter (cuerpo) · Space Mono (labels)
- Assets fuente en `MATERIAL/` (fuera del repo); procesados en `/public/brand` y música en `/public/music`.

## 📁 Estructura

```
src/
  app/         layout (globales: MusicPlayer, WhatsAppFloat, InstallPrompt), page (Home),
               tienda/, producto/[slug]/, nosotros/, club/, favoritos/, admin/,
               sacos|medias|accesorios/ (Muy pronto), manifest.ts,
               api/{checkout,waitlist,admin/login,admin/logout}, icon.png
  components/
    sections/  ScrollExpansionHero, GeneroSplit, DropCountdown, Story, Newsletter
               (sin usar: Destacados, Lookbook, BaboonStrip, FeaturesStrip)
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
               jungle/{concrete-jungle, concrete-jungle-mobile}.webp), icons/ (PWA), music/, og.png, sw.js
scripts/       models.mjs · models_convert.py · models_grid.py · ingest_camisas.py
```

**`Destacados` está construido y sin usar** — el home hoy no muestra ningún producto. Enchufarlo es
uno de los pendientes de conversión (ver [AUDITORIA-UX.md](AUDITORIA-UX.md#31-el-home-no-vende-nada)).

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
py scripts/ingest_camisas.py             # procesa
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
| **[AUDITORIA-UX.md](AUDITORIA-UX.md)** | Auditoría de UI/UX del 4-ago con mediciones reales (contraste, áreas de toque, SEO, enlaces muertos). |
| `CREDENCIALES.local.md` | Tokens y claves. **Local, nunca se sube.** |

## ⚠️ Gotchas que cuestan tiempo

- **Next.js 16 no es el que conoces.** Turbopack por defecto, request APIs async, `middleware` → `proxy`. Los docs offline están en `node_modules/next/dist/docs/` (ver `AGENTS.md`).
- **El preview headless cuelga el home** por las animaciones perpetuas: verificar por navegación y DOM, no por screenshot.
- **`min-w-0` es obligatorio** en cadenas grid→flex cuando algo debe poder deslizarse: sin él, `min-width:auto` ignora el `overflow-x-auto` y el contenido estira al contenedor. Fue la causa de dos de los tres cortes de responsive.
- **`useSearchParams` rompe el prerender** de las fichas (obliga a Suspense y las deja renderizando en cliente). Para leer query params sin perder el HTML estático: `useSyncExternalStore`.
- **Las láminas de fotos se clasifican por proporción, no por nombre** — el sufijo está invertido entre las dos carpetas de `MATERIAL/Camisas`.

---

© 2026 Babuinos Inc. — Bogotá, Colombia. _Streetwear Cult._ 🦍
