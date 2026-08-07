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

## ✅ Fase 3 — Cerrar lo que la interfaz prometía (hecho · 2026-08-04)

> Salió de **[AUDITORIA-UX.md](AUDITORIA-UX.md)**, que tiene el antes/después medido.

- [x] **Footer honesto**: de 12 enlaces con `href="#"` a 6 que llevan a algún lado. Se borraron los
      que prometían páginas inexistentes y "Ediciones Patch", que ya no es un concepto de la marca.
- [x] **Tope de stock en el carrito** — se podía pedir 10 de una talla con 3. Ahora corta exacto,
      avisa por toast y el `+` del carrito se apaga al llegar al máximo.
- [~] **Vitrina en el home**: se enchufó `Destacados` (0 → 3 productos) y **Juan la revirtió** el
      mismo día — quiere el home como puerta, no como catálogo. El componente queda listo en el repo.
- [x] **Contraste AA**: 5 estilos de texto por debajo del mínimo → 0.
- [x] **Áreas de toque**: 146 elementos bajo 44 px → 0. Lo peor eran las pills de talla (32 px).
- [x] **SEO**: `sitemap.xml` (21 URLs), `robots.txt`, `schema.org/Product` en las 15 fichas,
      `<h1>` en el home y jerarquía `h1→h2→h3` en `/tienda`.
- [x] **Página 404 propia** con marca y salida a la tienda.
- [x] **Accesibilidad**: `:focus-visible` global (no había ninguna regla), `aria-live` en el toast y
      `<label>` visible en el checkout y el Club (eran placeholder-only).
- [x] **Limpieza**: borrados los 5 componentes muertos.
- [x] Deep links `?tipo=basica` / `?tipo=estampada` para enlazar líneas desde el footer y el sitemap.

**Quedó fuera** porque necesita datos o decisión tuya: links reales de redes,
Sacos/Medias/Accesorios, y las páginas de Envíos/Cambios/FAQ (se sacaron del footer hasta tenerlas).
_(La "señal de precio" del punto 3.2 se resolvió el 5-ago — ver Fase 3f.)_

## ✅ Fase 3b — Ajustes de uso real (hecho · 2026-08-04)

Salidos de probar la tienda en el celular, no de la auditoría.

- [x] **Música a un solo toque en celular**: el botón mini abre el panel Y arranca la música en el
      mismo handler (los navegadores solo permiten `play()` dentro del gesto del usuario). Antes
      hacían falta dos toques.
- [x] **Un solo camino de compra**: se quitó "Comprar por WhatsApp" de la ficha. Abría el chat con
      UNA pieza saltándose el carrito, así que quien quería dos camisas acababa con dos
      conversaciones y sin sus datos. Ahora todo entra a la mochila y el pedido se cierra desde ahí.
- [x] **Básicas/Estampadas en pestañas**: como píldoras los tres necesitaban 363 px y solo hay 335 en
      un celular, así que "Estampadas" caía a una segunda fila y se veía apilado. Con pestañas de
      `flex-1` siempre entran en una fila (verificado a 320 y 375) y ya no se confunden con el
      segmentado Hombre/Mujer de abajo.
- [x] **Home sin vitrina** y **Drop movido al 4-sep-2026**.
- [x] **Protección de datos (Ley 1581/2012)**: página `/privacidad` con el fondo de la marca y un
      check obligatorio (sin premarcar) antes de enviar el pedido; la autorización queda como prueba
      en el mensaje de WhatsApp y en la nota del pedido.
- [x] **Música solo la de la carpeta**: 8 temas (se quitaron los 2 que no estaban en `MATERIAL`).

## ✅ Fase 3c — Guardián Navy (hecho · 2026-08-05)

- [x] **Pieza 16 — "Guardián Navy"** (Colección Fundadores): azul marino con el ángel guardián a la
      espalda y el lettering *Guardian* en rojo; monograma SG al pecho. Procesada desde
      `MATERIAL/Camisas/Coleccion Fundadores/11*.png` reutilizando `scripts/ingest_camisas.py`.
      Nombre elegido según el print + color, en línea con el resto del catálogo.
- [x] **Nuevo color de filtro: Azul** (`navy`, `#1b2f5c`) — antes no existía azul en la paleta del PLP.
- [x] **Tema nuevo**: Eminem — Ass Like That (9 temas en total, a 96 kbps como los demás).

## ✅ Fase 3d — Green Afro Tiki + cortes de Guns & Roses (hecho · 2026-08-05)

- [x] **Pieza 17 — "Green Afro Tiki"** (Colección Fundadores): celeste con un tótem tiki verde al
      costado y figura afro; "Beatus" al frente, BABUINOS en la nuca. Nombre dado por Juan.
- [x] **Nuevo color de filtro: Celeste** (`celeste`, `#a9cce3`).
- [x] **Guns & Roses con prenda sola por corte**: `imagesByGender` (oversize `-h` / crop `-m`). La
      galería de la PDP muestra el corte del toggle H/M. Es el único producto con dos cortes reales;
      el resto sigue con una sola prenda (verificado sin regresión).
      → **La pieza salió del catálogo el 7-ago** (licencia de la banda). El soporte de dos cortes
      queda en el código, sin usar.

## ✅ Fase 3e — Eternal Beauty + música al primer gesto (hecho · 2026-08-05)

- [x] **Pieza 18 — "Eternal Beauty"** (Colección Fundadores): negra con un querubín alado
      a toda la espalda (*Eternal Beauty · Chasing Dreams*). Nombre dado por Juan (del propio print).
      Su lámina de prenda tenía un ratio atípico (1.33), así que se procesó forzando el rol
      prenda/grilla en vez de dejar que el auto-clasificador decidiera. El diseño se actualizó el
      5-ago (antes era un hada; ahora el querubín) y **el frente cambió el 6-ago**: pasó de
      'Do You Want Something' a **'Our Bond is Forever'** entre tres rosas. La prenda sola ya está
      rehecha; **las fotos de modelo (lámina 13.5) todavía muestran el frente viejo**.
- [x] **Música al primer gesto en CUALQUIER parte, también en celular** (toque/click/scroll), a
      pedido de Juan. Se quitó la guarda de móvil del autostart. Revierte la Fase 3b en ese punto:
      baja por streaming, así que no bloquea la primera vista.

## ✅ Fase 3f — Precios y promos (hecho · 2026-08-05)

- [x] **Precios en COP**: básicas $50.000, estampadas $75.000. Inyectados por categoría (`PRECIO`)
      en un solo lugar, no pieza por pieza. Visibles en tarjeta, ficha y `schema.org/Offer`.
- [x] **Promos por combo automáticas**: 3 básicas o 2 estampadas *cualesquiera* por $140.000
      (`PROMOS` + `cartTotals`). El carrito muestra subtotal → ahorro → total, y el banner de la
      tienda las anuncia. Verificado: 3 básicas = $140k, 2 estampadas = $140k, 4 básicas = $190k.
- [x] **Género en el pedido de WhatsApp**: cada línea del carrito guarda `genero` (Hombre/Mujer) y
      sale en el mensaje, junto con precio por línea y totales con la promo aplicada.
- [x] **"Estampado y detalles bordados, hechos en Tábogo"** en cada ficha.
- [x] `persist` del carrito → v2 (descarta carritos guardados antes de los precios para no mostrar
      totales NaN).

## ✅ Fase 3g — Mochila, inventario y peso (hecho · 2026-08-06)

- [x] **Mochila en dos pasos.** El formulario de datos vivía en el footer fijo: 596 px de footer en un
      panel de 667 dejaban la lista de camisas en ~0 px, y por eso "los datos tapaban las camisas".
      Paso 1 = solo prendas (329 px de lista), paso 2 = los datos cuando ya se decidió comprar, con
      resumen que devuelve a la mochila. Stepper legible (glifo 14 → 18 px, trazo 1.75 → 2.75) y
      talla/género como etiquetas en vez de una línea de mono apretada.
- [x] **Inventario editable en `/admin`.** El tallaje salió del código a la tabla `product_stock` de
      Supabase: casilla vacía = la talla no existe · `0` = agotada · `n` = unidades. La tienda, las
      fichas y favoritos lo leen en el servidor y se revalidan al guardar (verificado en producción:
      `X-Vercel-Cache: REVALIDATED` y el JSON-LD siguiendo el stock).
- [x] **Hidratación del nav.** Los contadores de mochila y favoritos salen de localStorage y rompían
      la hidratación de todo el nav en cada carga de quien ya tenía prendas guardadas.
- [x] **framer-motion fuera del marco de la página** (−222 KB por vista). Venía en TODAS las páginas
      por el Navbar y solo se usaba para fades y slides: ahora eso es CSS (`usePresence` +
      `data-abierto`) y la librería queda solo en la intro del home.
- [x] **Pieza 19 "Doberman Sangre"**: lavada a la piedra, doberman de facetas con ojos rojos a la
      espalda bajo BABUINOS en death metal. Nuevo color de filtro **Negro lavado**.
- [x] **Frente nuevo de Eternal Beauty** ('Our Bond is Forever') y el script de ingesta reparado
      (mapa hasta la 14, láminas por corte `N H`/`N M`, y `--solo <pieza>` para rehacer una sola).

## ✅ Fase 3h — Limpieza de licencias (hecho · 2026-08-07)

- [x] **Fuera Guns & Roses Red y The Mills.** Juan decidió retirarlas por las licencias de las
      bandas (nombre e imagen). No basta con esconderlas: se borraron las fichas **y las fotos del
      sitio** —el material es justo lo que no puede quedar accesible—, sus números salieron del mapa
      del script de ingesta para que una corrida completa no las regenere, sus URLs redirigen
      permanente a `/tienda` (estaban en el sitemap y circulan por WhatsApp) y el carrito guardado se
      descarta (`persist` v3) para que nadie pida algo que ya no se vende. Quedan **17 piezas**.
      Las láminas originales siguen en `MATERIAL/`, que es local y no entra ni al repo ni al deploy.
- [ ] Falta decidir lo mismo con **Offline Pleasure** (MTLS.CORP / Too Fucking Nice Studio).

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
