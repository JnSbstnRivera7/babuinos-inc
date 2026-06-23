# 🦍 Babuinos Inc — Streetwear Cult

> _Selva de cemento, actitud de explorador._
> Tienda y landing **inmersiva** de Babuinos Inc — streetwear oversize desde Bogotá. Colección Fundadores 2026.

**Repo:** https://github.com/JnSbstnRivera7/babuinos-inc

---

## ✨ Concepto

Babuinos Inc es una marca de ropa oversize con identidad de "selva de cemento": la jungla tomándose la ciudad. La página traduce eso en una experiencia inmersiva — la selva se revela con el scroll y queda como fondo vivo de toda la tienda — manteniendo un look editorial/streetwear muy comercial.

## 🧩 Características

- **Intro cinematográfica con scroll-reveal:** una ventana crece al hacer scroll y revela el wallpaper fijo de "selva de cemento". El título crece y se distorsiona hasta desvanecerse; al final aparece el logo + CTA.
- **Wallpaper fijo** detrás de toda la página (hasta el footer) para sensación inmersiva.
- **Efectos de selva:** lianas colgantes con hojas reales (CSS), hojas cayendo (CSS + Canvas), trama de ladrillo y borde de lianas en CSS, brillo dorado (shine) sin glow.
- **Catálogo** con fotos reales de las camisas, descripción, selector de talla y "agregar a la mochila" (**sin precios** por ahora).
- **Lookbook** de las prendas en loop infinito (image auto-slider).
- **Menú "Tienda"** desplegable: Camisas (catálogo), Sacos / Medias / Accesorios (páginas "Muy pronto").
- **Selector de colorway** que recolorea el acento del sitio en vivo (solo paleta de marca, sin rojo).
- **Carrito** persistente (localStorage) con **formulario de datos del cliente** (nombre, teléfono, ciudad, nota).
- **Checkout por WhatsApp:** arma el resumen del pedido + datos del cliente y abre WhatsApp listo para enviar.
- **Club / waitlist** (newsletter) conectable a Supabase.
- **Íconos SVG propios** (incl. el babuino recoloreable) + botones Instagram / WhatsApp / Facebook.
- **Mobile-first**, accesible, con `prefers-reduced-motion` respetado.

## 🛠️ Stack

- **Next.js 16** (App Router, Turbopack) · **React 19** · **TypeScript**
- **Tailwind CSS v4** (tokens de marca en `globals.css`)
- **Framer Motion** (scroll/gestos) · **GSAP** (timelines)
- **Lenis** (scroll suave) · **Embla** (carrusel) · **Zustand** (carrito + tema)
- **Supabase** (`orders` + `waitlist`, opcional)

## 🚀 Desarrollo

```bash
npm install
npm run dev      # http://localhost:3020 (ver .claude/launch.json) o :3000
npm run build    # build de producción
npm start        # servir el build
```

## 🔐 Variables de entorno

Copia `.env.example` → `.env.local` (este archivo **no** se sube a git):

| Variable | Uso |
| --- | --- |
| `WHATSAPP_NUMBER` / `NEXT_PUBLIC_WHATSAPP_NUMBER` | Número de la tienda (solo dígitos, con indicativo país). Ej: `573504444668` |
| `WHATSAPP_WEBHOOK_URL` | Webhook opcional (n8n/Make) que recibe el pedido |
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Inserciones server-side (orders/waitlist) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Cliente Supabase (opcional) |

> La app corre **sin** ninguna variable: catálogo y carrito son locales; el checkout avisa si falta el número de WhatsApp.

## 🛒 Flujo de compra (WhatsApp)

1. El cliente agrega prendas (talla + cantidad) a la mochila.
2. Llena sus **datos** (nombre obligatorio, teléfono, ciudad, nota).
3. Al **"Enviar pedido por WhatsApp"**, `POST /api/checkout`:
   - arma el mensaje (productos + tallas + datos del cliente, sin precios),
   - lo guarda en Supabase (`orders`) si está configurado,
   - dispara un webhook si `WHATSAPP_WEBHOOK_URL` existe,
   - devuelve un enlace `wa.me` que abre WhatsApp con el pedido listo.

## 🗄️ Supabase (esquema sugerido)

```sql
-- Pedidos
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  customer_name text,
  phone text,
  city text,
  note text,
  items jsonb
);

-- Lista del Club
create table public.waitlist (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  email text unique
);
```

## ☁️ Deploy (Vercel)

1. Importa el repo en Vercel.
2. Configura las env vars (WhatsApp + Supabase).
3. Deploy. Build command `next build`, output automático.

## 🎨 Marca

- **Paleta:** Papiro `#F3E9E2` · Teal `#00736C` · Ocre `#CDA214` · Pardo `#654321` · Tinta `#1E2021`
- **Tipografía:** Anton (titulares condensados oversize) · Inter (cuerpo) · Space Mono (labels)
- **Assets fuente** (logos, fotos, wallpaper) en `MATERIAL/` — fuera del repo; los procesados viven en `/public/brand`.

## 📁 Estructura

```
src/
  app/            layout, page, sacos/ medias/ accesorios/ (Muy pronto), api/{checkout,waitlist}
  components/
    sections/     ScrollExpansionHero, FeaturesStrip, Lookbook, Catalog, Story, Newsletter
    layout/       AnnounceBar, Navbar (Tienda + colorway), Footer
    cart/         CartDrawer (form + checkout WhatsApp)
    fx/           FixedWallpaper, Lianas, CssLeaves, LeafCanvas, BaboonStrip, Reveal, SmoothScroll
    ui/           Logo, BaboonMark, ImageAutoSlider, Icons, SocialButtons, Toast
  lib/            products, store (carrito), theme (colorway), whatsapp, supabase, toast, utils
public/brand/     logos, patches, products, jungle (wallpaper)
```

## 🗺️ Roadmap

Ver **[ROADMAP.md](ROADMAP.md)** para lo que falta y las próximas fases.

---

© 2026 Babuinos Inc. — Bogotá, Colombia. _Streetwear Cult._
