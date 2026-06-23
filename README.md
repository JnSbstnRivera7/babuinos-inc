# 🦍 Babuinos Inc — Streetwear Cult

> _Selva de cemento, actitud de explorador._
> Tienda y landing **inmersiva** de Babuinos Inc — streetwear oversize desde Bogotá. Colección Fundadores 2026.

- 🌐 **En vivo:** https://babuinos-inc.vercel.app
- 💻 **Repo:** https://github.com/JnSbstnRivera7/babuinos-inc
- 🔐 **Panel:** https://babuinos-inc.vercel.app/admin

---

## ✨ Concepto

Babuinos Inc es una marca de ropa oversize con identidad de "selva de cemento": la jungla tomándose la ciudad. La página traduce eso en una experiencia inmersiva — la selva se **revela con el scroll** y queda como **fondo fijo** de toda la tienda — con un look editorial/streetwear muy comercial.

## 🧩 Características

- **Intro con scroll-reveal:** una ventana crece al hacer scroll y descubre el wallpaper fijo de selva de cemento; el **logo crece y se distorsiona** hasta desaparecer.
- **Wallpaper fijo** detrás de toda la página (hasta el footer).
- **Reproductor "Babuinos Radio" 🎶:** al primer click suena un tema aleatorio; play/pausa, siguiente y auto-avance. Estilo selvático con ecualizador.
- **Catálogo** con fotos reales, selector de talla y "agregar a la mochila" (sin precios por ahora) + selectores Camisas/Sacos/Medias/Accesorios.
- **Lookbook** de prendas en loop infinito.
- **Carrito** persistente con **formulario del cliente** (nombre, teléfono, ciudad, nota) → **checkout por WhatsApp** (resumen del pedido) + guardado en Supabase.
- **Selector de colorway** que recolorea el acento del sitio en vivo (solo paleta de marca).
- **Menú "Tienda"** + páginas **"Muy pronto"** (Sacos / Medias / Accesorios).
- **Club / waitlist** (newsletter) en Supabase.
- **Panel `/admin`** protegido con login temático Babuinos + **dashboard con gráficas** (pedidos por día, top productos, por ciudad) y tablas de pedidos y suscriptores.
- **Efectos:** lianas con hojas (CSS), hojas cayendo (CSS + Canvas), trama de ladrillo y bordes de liana en CSS, shine dorado. Íconos SVG propios (incl. el babuino recoloreable) + IG / WhatsApp / Facebook. Favicon del babuino.
- **Mobile-first**, accesible, con `prefers-reduced-motion`.

## 🛠️ Stack

- **Next.js 16** (App Router, Turbopack) · **React 19** · **TypeScript**
- **Tailwind CSS v4** · **Framer Motion** · **GSAP** · **Lenis** · **Embla** · **Zustand** · **Recharts** · **Supabase**

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
  app/         layout, page, admin/, sacos|medias|accesorios/ (Muy pronto),
               api/{checkout,waitlist,admin/login,admin/logout}, icon.png
  components/
    sections/  ScrollExpansionHero, FeaturesStrip, Lookbook, Catalog, Story, Newsletter
    layout/    AnnounceBar, Navbar, Footer
    cart/      CartDrawer        admin/  AdminLogin, AdminCharts
    fx/        FixedWallpaper, Lianas, CssLeaves, LeafCanvas, BaboonStrip, MusicPlayer, ...
    ui/        Logo, BaboonMark, ImageAutoSlider, Icons, SocialButtons, Toast
  lib/         products, store, theme, whatsapp, supabase, toast, utils
public/        brand/ (logos, patches, products, jungle), music/
```

## 🗺️ Roadmap

Ver **[ROADMAP.md](ROADMAP.md)**.

---

© 2026 Babuinos Inc. — Bogotá, Colombia. _Streetwear Cult._ 🦍
