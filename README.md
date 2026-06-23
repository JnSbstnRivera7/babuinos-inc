# 🦍 Babuinos Inc — Streetwear Cult

Tienda y landing inmersiva de **Babuinos Inc**, marca de streetwear oversize.
_Selva de cemento, actitud de explorador._ Colección Fundadores 2026.

## Stack

- **Next.js 16** (App Router, Turbopack) · **React 19** · **TypeScript**
- **Tailwind CSS v4** (tokens de marca en `globals.css`)
- **Framer Motion** (reveals, gestos) · **GSAP** (intro cinematográfica)
- **Lenis** (scroll suave) · **Embla** (carrusel) · **Zustand** (carrito persistente)
- **Supabase** (waitlist + pedidos, opcional)

## Desarrollo

```bash
npm install
npm run dev        # http://localhost:3020 (configurado en launch.json) o 3000
npm run build      # build de producción
```

## Variables de entorno

Copia `.env.example` → `.env.local`:

| Variable | Uso |
| --- | --- |
| `WHATSAPP_NUMBER` / `NEXT_PUBLIC_WHATSAPP_NUMBER` | Número de la tienda (solo dígitos, con indicativo) al que llega el pedido |
| `WHATSAPP_WEBHOOK_URL` | Webhook opcional (n8n/Make) que recibe el pedido |
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Cliente Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Inserciones server-side (pedidos/waitlist) |

> La app funciona en local **sin** ninguna variable: el catálogo y el carrito son
> locales, y el checkout avisa si falta configurar el WhatsApp.

## Checkout por WhatsApp

El botón del carrito hace `POST /api/checkout`, que arma un resumen del pedido,
(opcionalmente) lo guarda en Supabase y dispara un webhook, y devuelve un enlace
`wa.me` que abre WhatsApp con el pedido listo para enviar.

## Estructura

```
src/
  app/            layout, page, api/{checkout,waitlist}
  components/
    intro/        JungleIntro (cortina de selva + reveal del logo)
    layout/       AnnounceBar, Navbar, Footer
    sections/     Hero, FeaturesStrip, Catalog, Editions, Story, Newsletter
    cart/         CartDrawer
    fx/           SmoothScroll, Reveal, LeafCanvas (partículas)
    ui/           Baboon, Patch, Tee, Wordmark, Toast
  lib/            products, store (carrito), whatsapp, supabase, toast, utils
MATERIAL/         assets de marca (logos, paleta, fotos, prototipo)
```

---

© 2026 Babuinos Inc. — Bogotá, Colombia.
