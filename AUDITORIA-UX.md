# 🔍 Auditoría UI/UX — Babuinos Inc

Revisión de la tienda **en producción** (https://babuinos-inc.vercel.app) del **4 de agosto de 2026**,
después de cargar el catálogo de 15 piezas.

Todo lo que dice un número acá está **medido**, no estimado: contraste compuesto sobre el fondo real
con canvas, áreas de toque con `getBoundingClientRect`, rutas con peticiones HTTP.

Accionables en **[PENDIENTES.md](PENDIENTES.md)** · plan por fases en **[ROADMAP.md](ROADMAP.md)**.

---

## ✅ Estado: aplicado el mismo 4-ago

Casi todo lo de esta auditoría **ya está corregido**. Verificación posterior a los arreglos:

| Métrica | Antes | Después |
|---|---|---|
| Enlaces muertos en el footer | **12** | **0** |
| Tope de stock en el carrito | sin validar | corta exacto en el stock de la talla |
| Productos visibles en el home | **0** | **0** — se probó con 3 y Juan lo revirtió (ver nota) |
| Estilos de texto que fallan AA | **5** | **0** |
| Áreas de toque bajo 44 px | **146** | **0** |
| `<h1>` en el home | ninguno | 1 |
| Jerarquía en `/tienda` | h1 → h3 | h1 → h2 → h3 |
| `sitemap.xml` / `robots.txt` | no existían | 21 URLs / con Sitemap |
| Datos estructurados de Producto | ninguno | `schema.org/Product` en las 15 fichas |
| Página 404 | la cruda de Next | propia, con marca y salida |
| Estilos de foco | 0 reglas | `:focus-visible` global |
| `aria-live` en el toast | no | sí (`polite`) |
| Formularios con `<label>` | 0 | checkout (4) + Club (1) |
| Componentes muertos | 5 | 0 |

Verificado sobre 24 combinaciones de ruta × ancho (320 / 375 / 414 px): **cero desbordes
horizontales** y **cero tap targets bajo 44 px**.

**Decisión de marca que revierte un hallazgo:** el punto 3.1 proponía mostrar piezas en el home. Se
aplicó y Juan lo quitó el mismo día — el home es una puerta (Hombre/Mujer + Drop), no un catálogo.
El componente `Destacados` queda en el repo. Queda anotado porque el diagnóstico sigue siendo cierto
(el visitante da un clic más antes de ver mercancía); simplemente se acepta a cambio de la entrada
limpia que quiere la marca.

**Sigue pendiente** (necesita datos o decisión de Juan): links reales de redes, señal de precio,
Sacos/Medias/Accesorios, stock real, medidas del inventario, licencias de terceros y la música.

El detalle de abajo se conserva como registro de qué se midió y por qué se cambió.

---

## Resumen

La tienda **funciona y se ve bien**. La arquitectura (Home → PLP → PDP), la galería con modelo, el
filtro Básicas/Estampadas y el checkout por WhatsApp están sólidos, y el responsive quedó limpio en
320 / 375 / 414 px. Lo que falta no es diseño: es **cerrar promesas** que la interfaz ya hace y que
hoy no cumple.

Los tres huecos que más cuestan plata, en orden:

1. **El footer promete 12 páginas que no existen.** En una tienda en vivo eso lee como "esto no es
   una empresa real".
2. **El carrito no valida el stock** — puedes recibir un pedido que no puedes despachar.
3. **El home no muestra ni un solo producto.** Cero enlaces a `/producto/`.

---

## 1. Confianza — rompe la venta

### 1.1 Doce enlaces muertos en el footer

`src/components/layout/Footer.tsx:52` renderiza **todos** los links con `href="#"`:

| Columna | Enlaces muertos |
|---|---|
| Tienda | Camisas Oversize · Ediciones Patch · Drops Exclusivos · Guía de Tallas |
| Info | Nuestra Historia · Proceso · Sostenibilidad · Prensa |
| Ayuda | Envíos y Tiempos · Cambios · FAQ · Contacto |

Ninguna de las rutas existe (`/envios`, `/cambios`, `/faq`, `/contacto`, `/proceso`,
`/sostenibilidad`, `/prensa`, `/guia-de-tallas` → todas 404).

Peor: **"Ediciones Patch" ya no existe como concepto** (los parches se quitaron en la v3) y
**"Nuestra Historia" sí existe** — es `/nosotros`, solo que el link no apunta ahí.

Lo mínimo: apuntar los 4 que ya tienen destino (`Camisas → /tienda`, `Nuestra Historia → /nosotros`,
`Contacto → wa.me`, `Guía de Tallas → abrir el modal`) y **borrar los 8 que no**. Prometer menos y
cumplirlo vende más que un footer largo y falso.

### 1.2 El carrito no valida el stock

`src/lib/store.ts:41` incrementa `qty` sin techo, y `:65` suma `delta` sin comparar contra
`sizes[].stock`. Se puede armar un pedido de 10 unidades de una talla que tiene 3.

Con el stock todavía provisional el riesgo es doble: el pedido llega por WhatsApp y toca decirle al
cliente que no hay. **Es el bug que más caro sale de esta lista.**

### 1.3 Redes sociales apuntan a placeholders

`SocialButtons.tsx` usa `instagram.com/babuinos.inc` y `facebook.com/babuinos.inc`. Si esas cuentas
no existen, cada clic es un 404 hacia afuera.

---

## 2. SEO — la tienda es pública pero invisible

| Falta | Consecuencia |
|---|---|
| `sitemap.xml` | Google no sabe que hay 15 fichas que indexar |
| `robots.txt` | Sin control de rastreo ni referencia al sitemap |
| Datos estructurados `schema.org/Product` | Sin foto, disponibilidad ni marca en los resultados de búsqueda |
| `<h1>` en el home | La página más importante **no tiene encabezado principal** (tiene 2 `<h2>` y ningún `<h1>`) |
| Página 404 propia | Un enlace roto muestra el 404 crudo de Next, sin salida a la tienda |

En `/tienda` la jerarquía **salta de `h1` a `h3`**: 1 `<h1>`, **0 `<h2>`**, 15 `<h3>` (los nombres de
las piezas). Los lectores de pantalla y los rastreadores leen eso como estructura rota.

---

## 3. Conversión

### 3.1 El home no vende nada

`/` tiene **0 enlaces a `/producto/`**. El recorrido es: intro → puertas Hombre/Mujer → Drop. El
visitante tiene que adivinar y dar un clic más antes de ver una sola camisa.

Lo bueno: **ya está construido**. `getFeatured()` en `products.ts` devuelve 3 piezas y el componente
`Destacados.tsx` existe y funciona — solo está **fuera del flujo**. Es enchufarlo.

### 3.2 Sin señal de precio

Decisión tomada (no van precios), pero hoy el usuario **no tiene ninguna referencia**: no sabe si la
camisa vale $60.000 o $300.000 antes de escribir por WhatsApp. Eso filtra a los curiosos y también a
compradores reales. Alternativas sin publicar la lista:

- Un rango por línea ("Básicas desde $X", "Estampadas desde $Y").
- O al menos decir en la ficha que el precio llega en 1 minuto por WhatsApp.

### 3.3 Categorías vacías en el menú

`Sacos`, `Medias` y `Accesorios` están en el menú con badge "Pronto" y llevan a una página
"Muy pronto". Tres de las cuatro categorías del nav no tienen nada. Si no hay fecha, conviene
dejarlas fuera del menú y anunciarlas por el Club.

---

## 4. Accesibilidad — medido

### 4.1 Contraste bajo el mínimo AA (4.5:1)

| Texto | Tamaño | Medido | Mínimo |
|---|---|---|---|
| `© 2026 Babuinos Inc. — Bogotá…` | 10 px | **2.10:1** | 4.5 |
| `Teal Expedición` — colorway en la tarjeta | 10 px | **2.81:1** | 4.5 |
| Descripción de la tarjeta | 13 px | **3.71:1** | 4.5 |
| `Del asfalto de Tábogo…` — footer | 14 px | **3.88:1** | 4.5 |
| `Diseñado a 2.600 m` | 10 px | **4.09:1** | 4.5 |

Las **dos de las tarjetas** son las que más importan: son el copy que vende, en la superficie que más
se mira. El patrón es siempre el mismo — opacidad `/25`, `/45`, `/55` sobre texto de 10–14 px. Subir
esas opacidades y el tamaño mínimo a 12 px arregla las cinco.

> Nota: el medidor marca también `manada` con 1.0:1. Es falso positivo — ese texto usa
> `background-clip: text` (el degradado dorado) y su `color` es transparente a propósito.

### 4.2 Áreas de toque bajo 44×44 px

**146 elementos** por debajo del mínimo. Los que de verdad se mis-tapean:

| Elemento | Medido | Dónde |
|---|---|---|
| Pills de talla en la tarjeta | **32 × 32** | Tienda, cada tarjeta |
| Corazón de favoritos en la tarjeta | **36 × 36** | Tienda |
| Segmentado Todos / Hombre / Mujer | alto **28** | Barra de la tienda |
| Chips Todo / Básicas / Estampadas | alto **33** | Barra de la tienda |
| Botón de Filtros | **42 × 34** | Barra de la tienda |
| Íconos del nav (favoritos, carrito, menú) | **40 × 40** | Toda la página |

Las pills de talla de 32 px son el peor caso: son el control con el que la gente **decide la compra**
desde la grilla, y están 12 px por debajo del mínimo.

### 4.3 Sin indicador de foco

**Cero** reglas `:focus-visible` u `outline` en `globals.css`, y solo 4 componentes definen algún
estado de foco (AdminLogin, CartDrawer, DropCountdown, Newsletter). Navegar con teclado por la tienda
es a ciegas: no se ve dónde estás.

### 4.4 El toast es invisible para lectores de pantalla

`Toast.tsx` no tiene `aria-live` ni `role="status"`. Cuando agregas algo a la mochila, un usuario con
lector de pantalla **no recibe ninguna confirmación**.

### 4.5 Formularios sin etiqueta

Todos los campos son **placeholder-only**, sin un solo `<label>`:

- Checkout (`CartDrawer.tsx`): Nombre y apellido, Teléfono, Ciudad, Nota
- Club (`Newsletter.tsx`): correo

Al empezar a escribir, la etiqueta desaparece: el usuario ya no sabe qué campo está llenando. En el
checkout —el paso donde menos se puede dudar— eso cuesta pedidos.

---

## 5. Deuda técnica

| Qué | Detalle |
|---|---|
| **5 componentes muertos** | `Destacados`, `Lookbook`, `BaboonStrip`, `FeaturesStrip`, `AdminChat` están en el repo sin que nadie los importe. `Destacados` vale la pena **enchufarlo** (ver 3.1); los otros 4, borrarlos. |
| **JS ~740 KB** | framer-motion (222 KB) lo usan 7 componentes, incluido el Navbar, así que está en todas las páginas. Sacarlo es un refactor de toda la app, no un ajuste. Es la palanca grande que queda. |
| **Música ~27 MB** | 9 temas a 96 kb/s en el repo. No autoarrancan en celular y se bajan de a uno, pero **todos son comerciales** y varios son versiones explícitas. |
| **Guía de tallas de referencia** | Números de oversize de mercado, marcados como referencia ±2 cm. Reemplazar al medir el inventario. |
| **Drop 02 — Expedición · 15-ago-2026** | Verificar que la fecha y el nombre sean los reales. |

---

## 6. Lo que está bien y no hay que tocar

Para no perder de vista lo que ya funciona:

- **Arquitectura de tienda** Home → PLP → PDP con URLs limpias y fichas prerenderizadas.
- **Galería de producto**: modelo puesto, toggle Hombre/Mujer, flechas, deslizar con el dedo, zoom.
- **El filtro que pediste**: Básicas / Estampadas visible con conteos, más Color en el panel.
- **Responsive**: verificado sin desbordes en 320 / 375 / 414 px sobre 12 rutas.
- **Estado vacío de favoritos**: mensaje claro + CTA a la tienda. Es el modelo a copiar en los demás.
- **Peso móvil**: el home pasó de 3.8 MB a 1.19 MB.
- **PWA instalable** con caché versionado.
- **Continuidad de línea**: entrar por Mujer mantiene el modelo mujer en la ficha (`?g=`).

---

_Auditoría del 2026-08-04 sobre el commit `746ccdc`._
