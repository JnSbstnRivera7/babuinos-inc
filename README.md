# 🦍 Babuinos Inc — Streetwear Cult

> _Selva de cemento, actitud de explorador._
> Tienda y landing **inmersiva** de Babuinos Inc — streetwear oversize desde Bogotá. Colección Fundadores 2026.

- 🌐 **En vivo:** https://babuinos-inc.vercel.app
- 💻 **Repo:** https://github.com/JnSbstnRivera7/babuinos-inc
- 🔐 **Panel:** https://babuinos-inc.vercel.app/admin

---

## ✨ Concepto

Babuinos Inc es una marca de ropa oversize con identidad de "selva de cemento": la jungla tomándose la ciudad. La página traduce eso en una experiencia inmersiva — la selva se **revela con el scroll** y queda como **fondo fijo** de toda la tienda — con un look editorial/streetwear muy comercial.

## 🧩 Arquitectura y características

**Arquitectura por secciones** (no una sola landing):

- **Home** = entrada: intro scroll-reveal (el logo descubre el wallpaper fijo de selva) + **"Elige tu territorio"** (puertas Hombre/Mujer con logos reales SVG + Unisex) + **Drop con cuenta regresiva y lista de espera**.
- **`/tienda`** (PLP): grid de producto con **filtros en panel transparente (glass)** — dropdown en PC / bottom-sheet en móvil — barra slim con segmentado Todos/Hombre/Mujer + chips de filtros activos. Siempre arranca desde arriba.
- **`/producto/[slug]`** (PDP): **minigalería con la camisa puesta** (frente/lateral/espalda) + **toggle Hombre/Mujer** y **zoom** a pantalla completa; tallas con "agotado", **guía de tallas**, **"Comprar por WhatsApp" pre-llenado**, "combina con".
- **`/nosotros`** · **`/club`** (waitlist) · **`/favoritos`** (wishlist).

**Transversal:**

- **Favoritos / wishlist:** corazón en tarjetas y PDP, contador en el nav, página propia (persistido en localStorage).
- **Carrito** persistente + formulario del cliente → **checkout por WhatsApp** + guardado en Supabase (`orders`).
- **Globales en toda la página:** reproductor "Babuinos Radio" (botón mini que abre al clic), **WhatsApp flotante**, botón **"Instalar app"** (PWA) arriba-centrado, **barra de confianza** (envío/cambios/pago) en el footer.
- **Tarjetas con la camisa puesta** (foto frontal del modelo; **hover → espalda** para ver el gráfico) que respetan el género en contexto (filtro de tienda). **Sello de género** (moño mujer, gorra hombre, babuino unisex) + **selector de colorway** en vivo.
- **Panel `/admin`** con login temático + gráficas (pedidos por día, top productos, por ciudad) y tablas.
- **PWA instalable** (manifest + service worker network-first) · **OG image** para compartir.
- **Efectos:** **wallpaper fijo art-directed** (foto de marca con modelos — **vertical en móvil / horizontal en escritorio** vía `<picture>`, se descarga solo la que aplica), lianas/hojas (CSS + Canvas), shine dorado, íconos SVG propios. **Mobile-first**, `prefers-reduced-motion`, taps sin delay, scroll suave (Lenis) solo en desktop, blur del hero desactivado en móvil, música ~96 kbps.

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

Desplegado en https://babuinos-inc.vercel.app (repo conectado → auto-deploy en cada push). Env vars configuradas en el proyecto. Framework: Next.js.

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
    sections/  ScrollExpansionHero, GeneroSplit, DropCountdown, Destacados, Story, Newsletter, FeaturesStrip
    tienda/    TiendaClient (PLP + panel de filtros)
    producto/  ProductDetail (PDP), ProductCard
    favoritos/ FavoritosClient
    layout/    Navbar, Footer, Shell (marco de páginas internas)
    cart/      CartDrawer        admin/  AdminLogin, AdminCharts
    fx/        FixedWallpaper, PageVines, CssLeaves, LeafCanvas, MusicPlayer, WhatsAppFloat, InstallPrompt, SmoothScroll
    ui/        Logo, BaboonMark, GeneroMark, Icons, SocialButtons, Toast
  lib/         products, store, wishlist, theme, whatsapp, supabase, toast, scroll, utils
public/        brand/ (logos, genero/{hombre,mujer}.svg, products/ [prenda sola],
               models/<slug>/{hombre,mujer}-{frontal,lateral,espalda}.webp [camisa puesta],
               jungle/{concrete-jungle, concrete-jungle-mobile}.webp), icons/ (PWA), music/, og.png, sw.js
```

## 🗺️ Roadmap

Ver **[ROADMAP.md](ROADMAP.md)**.

---

© 2026 Babuinos Inc. — Bogotá, Colombia. _Streetwear Cult._ 🦍
