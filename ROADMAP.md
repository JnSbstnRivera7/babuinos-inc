# 🗺️ Roadmap — Babuinos Inc

Estado del proyecto y lo que falta para vender y escalar. ✅ hecho · 🔜 siguiente · 🧭 futuro.

Checklist accionable en **[PENDIENTES.md](PENDIENTES.md)** · hallazgos medidos en
**[AUDITORIA-UX.md](AUDITORIA-UX.md)**.

---

## ✅ Fase 0 — Base inmersiva (hecho)

- [x] Next.js 16 + TS + Tailwind v4 + Framer Motion + Lenis + Zustand + Supabase.
- [x] Intro scroll-reveal (el logo crece/distorsiona y descubre el wallpaper fijo) + tema oscuro coherente.
- [x] Carrito persistente + formulario de cliente + **checkout por WhatsApp** (resumen a `wa.me`) + guardado en Supabase (`orders`).
- [x] **Club / waitlist** (Supabase `waitlist`), **selector de colorway**, **Panel `/admin`** con login + gráficas.
- [x] **PWA instalable** (manifest + service worker) + optimización móvil base.
- [x] Repo en GitHub (`JnSbstnRivera7/babuinos-inc`) + Vercel auto-deploy → https://babuinos-inc.vercel.app

## ✅ Fase 1 — De landing a tienda por secciones (hecho · 2026-07-23)

- [x] **Arquitectura real:** Home = entrada · **`/tienda`** (PLP) · **`/producto/[slug]`** (PDP) · **`/nosotros`** · **`/club`** · **`/favoritos`**.
- [x] **Modelo de producto ampliado** (fuente única): género, galería, stock por talla, fit, composición, badge.
- [x] **"Elige tu territorio"** en el home: puertas Hombre/Mujer con logos SVG reales (gorra / cola de caballo).
- [x] **PLP con filtros** en panel glass (dropdown en PC / bottom-sheet en móvil).
- [x] **PDP:** galería, tallas con "agotado", guía de tallas, "Comprar por WhatsApp" pre-llenado, "combina con".
- [x] **Favoritos / wishlist** persistido, con contador en el nav y página propia.
- [x] **Globales:** música, WhatsApp flotante, botón "Instalar app", barra de confianza en el footer.
- [x] **OG image** + twitter card.
- [x] **Drop con cuenta regresiva + lista de espera** enganchada al Club.

## ✅ Fase 2 — Producto real y catálogo completo (hecho · 2026-08-04)

- [x] **Fotos de modelo** — la camisa puesta (frente/lateral/espalda × Hombre/Mujer) para las 15 piezas.
- [x] **PDP con minigalería**: abre con el modelo, toggle Hombre/Mujer, miniaturas, **flechas + deslizar con el dedo**, zoom a pantalla completa.
- [x] **Tarjetas con el modelo puesto** (hover → espalda) que respetan el género del filtro.
- [x] **Pipeline de fotos en el repo** (`scripts/`): normaliza a 900×1125 WebP sobre crema, parte láminas 3×2 buscando las calles blancas, e ingesta una colección completa. Ver [README](README.md#-fotos-de-modelo).
- [x] **Catálogo de 15 piezas**: 5 Básicas (la paleta de la marca) + 10 Colección Fundadores. Salieron las 5 viejas.
- [x] **Dos líneas claras**: `Category` pasó de `esencial|grafica` a **`basica|estampada`**, con el filtro **visible en la barra** y conteos.
- [x] **Filtro de Color** en el panel (reemplazó "Territorio", que con 15 piezas ya no significaba nada).
- [x] **Copy de marca en un solo archivo** (`src/lib/brand.ts`): Tábogo, "Diseñado a 2.600 m".
- [x] **Velocidad móvil**: home de 3.8 MB → **1.19 MB**. Música sin autoarranque en celular, intro estática, adornos fuera, `baboon` 174 KB → 18 KB.
- [x] **Responsive arreglado**: botón de Filtros cortado a 320 px, tira de miniaturas de la ficha, `/club` desbordando 325 px. Verificado sin desbordes en 320 / 375 / 414.
- [x] **Bugs de ficha**: corazón asimétrico, y abrir una pieza desde la línea Mujer ya no la muestra en modelo hombre.
- [x] **Wallpaper nuevo** (mural BABUINOS INC) con recorte vertical propio para celular + 10 temas de música.

## 🔜 Fase 3 — Cerrar lo que la interfaz ya promete

> Todo esto sale de **[AUDITORIA-UX.md](AUDITORIA-UX.md)**. No es diseño nuevo: es cumplir lo que la
> tienda ya dice que hace. Es lo que sigue **antes** de agregar features.

**Confianza**
- [ ] **Los 12 enlaces muertos del footer**: apuntar los 4 que tienen destino, borrar los 8 que no.
- [ ] **Validar el stock en el carrito** — hoy se puede pedir más de lo que hay.
- [ ] **Links reales** de Instagram / Facebook.
- [ ] Páginas de **Envíos / Cambios / FAQ / Contacto** (o quitarlas del footer).

**Contenido que solo tú tienes**
- [ ] **Stock real** de las 15 piezas (hoy todas comparten un tallaje provisional).
- [ ] **Medir el inventario** para la guía de tallas (hoy son medidas de referencia ±2 cm).
- [ ] Decidir qué hacer con las **licencias de terceros** (Guns & Roses, The Mills, Offline Pleasure).
- [ ] **Música con licencia** — los 10 temas son comerciales.
- [ ] Verificar el **Drop** (nombre y fecha) y los **links de redes**.

**SEO**
- [ ] `sitemap.xml` + `robots.txt`.
- [ ] **Datos estructurados** `schema.org/Product` en las fichas.
- [ ] **`<h1>` en el home** y arreglar el salto `h1 → h3` en `/tienda`.
- [ ] **Página 404 propia** con salida a la tienda.

**Accesibilidad**
- [ ] Subir el **contraste** de los 5 estilos que no pasan AA (mínimo 12 px de tamaño).
- [ ] Llevar a **44 px** las áreas de toque críticas (pills de talla 32 px, corazón 36 px, segmentado 28 px).
- [ ] **Estilos de foco** visibles en toda la app.
- [ ] **`aria-live` en el toast** y **`<label>` en los formularios** (hoy son placeholder-only).

**Conversión**
- [ ] **Enchufar `Destacados` en el home** — hoy el home no muestra ni un producto y el componente ya existe.
- [ ] Dar **alguna señal de precio** (rango o "desde") sin publicar la lista.
- [ ] Decidir sobre **Sacos / Medias / Accesorios**: lanzarlas o sacarlas del menú.

**Limpieza**
- [ ] Borrar los 4 componentes muertos (`Lookbook`, `BaboonStrip`, `FeaturesStrip`, `AdminChat`).
- [ ] **Rotar credenciales** de desarrollo y cambiar `ADMIN_PASSWORD`.

## 🧭 Fase 4 — Tienda real / backend

- [ ] **Precios** por producto/talla y decisión de **pasarela de pago** (Wompi / Bold / Mercado Pago) o seguir por WhatsApp.
- [ ] **Catálogo desde Supabase** — editar productos y stock sin tocar código. Resuelve de raíz el pendiente del stock.
- [ ] **Reseñas / estrellas** (con reseñas reales o captura por WhatsApp tras la compra).
- [ ] **Analítica "lo más visto"** (tracking de vistas en Supabase + vista en `/admin`).
- [ ] Sacar **framer-motion** del bundle base (222 KB en 7 componentes, incluido el Navbar).

## 🧭 Fase 5 — Crecimiento

- [ ] **Dominio propio** + correo de marca.
- [ ] **Email del Club** conectado a un proveedor (drops, preventas) — hoy la waitlist solo guarda en Supabase.
- [ ] **Analítica** (Vercel/GA4 + píxel Meta).
- [ ] **i18n** (ES/EN), **programa de referidos** ("la manada"), tests automatizados.

---

_Última actualización: 2026-08-04._
