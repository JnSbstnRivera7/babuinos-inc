# HANDOFF — Babuinos Inc (la tienda)

**Para retomar en un chat nuevo: lee este archivo entero antes de tocar nada.**
Casi cada párrafo de la sección de trampas es un error que ya se pagó con horas.

> ### ⚠️ Antes que nada: [AGENTS.md](AGENTS.md)
> Babuinos es **personal de Juan**, no de Windmar Home. GitHub `JnSbstnRivera7`,
> Vercel `jn-sbstn-s-projects`. El `git push` normal da **403** porque el `gh` de
> esta máquina está logueado con la cuenta de la empresa. Está todo explicado ahí.

---

## 0. Estado, en una frase

Tienda en vivo con **24 piezas** repartidas en tres tandas, catálogo en código,
checkout por WhatsApp y panel `/admin`. Lo último desplegado: el 19-oct, con
Next 16.4.2 y el JS de la tienda en 572 KB (`git log` dice el commit).

- 🌐 https://babuinos-inc.vercel.app
- 💻 https://github.com/JnSbstnRivera7/babuinos-inc

---

## 1. Por dónde entrar a cada cosa

| Quiero… | Archivo |
| --- | --- |
| La regla de cuentas y el push | [AGENTS.md](AGENTS.md) |
| Qué falta y qué decidir | [PENDIENTES.md](PENDIENTES.md) ← **empieza aquí** |
| El plan por fases y lo ya hecho | [ROADMAP.md](ROADMAP.md) |
| Hallazgos de UI/UX medidos | [AUDITORIA-UX.md](AUDITORIA-UX.md) |
| Concepto, arquitectura, pipeline de fotos | [README.md](README.md) |
| Claves (PAT, Vercel, Supabase, admin) | `CREDENCIALES.local.md` · **local, no se sube** |

```bash
npm run dev          # desarrollo
npm run build        # OJO: deja un .next que luego el dev sirve como si fuera suyo
py scripts/ingest_camisas.py --dry-run    # ingesta de fotos, simulación
node scripts/medir-pagina.mjs https://babuinos-inc.vercel.app/tienda   # cuánto se baja, prefetch incluido
```

---

## 2. El catálogo

**Fuente única: `src/lib/products.ts`.** Ahí viven las piezas, los colores, las
ediciones y los precios (`PRECIO`: básica 60.000, estampada 80.000 COP).

Tres **colecciones**, que no es lo mismo que la categoría: la categoría dice
QUÉ es la prenda (`basica` / `estampada`) y la colección dice CUÁNDO salió.

| Colección | Piezas | Dónde se ve |
| --- | --- | --- |
| **Expedición** (16-oct-2026) | 8 | fija en la tienda |
| **Básicas** | 6 | fija en la tienda |
| **Fundadores** | 10 | al final, detrás de la cinta del archivo (tarjeta con fotos y rebobinado VHS); arriba hay un atajo, y `/tienda#archivo` llega con ella abierta |

**La colección NO se escribe pieza por pieza.** La pone `PRODUCTS` según el
arreglo del que venga (`conColeccion`), para que no haya forma de que una
quede con la etiqueta de otra al copiar y pegar.

**El tallaje no vive en el código**: se edita en `/admin` y llega de Supabase
(`product_stock`). `TALLAS_STD` es sólo el respaldo de las que nadie cargó.

### Añadir piezas

Las fotos entran con `scripts/ingest_camisas.py`, que parte las láminas de
`MATERIAL/Camisas/` en 6 fotos de modelo + 2 de prenda.

**La trampa del script: el mapa va por NÚMERO DE ARCHIVO.** Si alguien
reordena la carpeta y no toca la tabla, la ingesta le pone a cada pieza las
fotos de otra **sin dar ningún error**. Ya pasó con Fundadores el 16-oct.
Cuando Juan reorganice una carpeta, verificar pieza por pieza antes de correr.

Y correr siempre `--solo <slug>`: correr todo regenera las 24 y pisa los
recortes hechos a mano.

---

## 3. Las trampas, que es lo que de verdad ahorra tiempo

### Verificar SIEMPRE en producción, no en el servidor de desarrollo

Esto costó media tarde el 16-oct, **tres veces**, y siempre con el mismo
síntoma: "mi cambio no se aplica" cuando el cambio estaba perfecto.

1. **Next reutiliza la URL del CSS en desarrollo** (`...063c5fx._.css`) aunque
   el contenido cambie, así que el navegador sirve el suyo cacheado.
2. **El service worker** (`public/sw.js`) cachea el shell. En producción está
   bien —las páginas van network-first— pero en desarrollo confunde. Para
   descartarlo: desregistrarlo y borrar `caches` desde la consola.
3. **Un `next build` anterior deja un `.next`** que el servidor de desarrollo
   sirve como si fuera suyo.

Lo fiable: desplegar y mirar el sitio real, comprobando que
`x-vercel-cache` diga **MISS** (un HIT da un falso OK).

### Tailwind v4 falla EN SILENCIO, de dos formas

Las dos veces la clase estaba en el HTML y no hacía nada.

- **Una regla CSS fuera de toda capa le gana a todas las utilidades.** Había un
  `img { display: block }` suelto en `globals.css`, y por eso `hidden` y
  `sm:hidden` **nunca pudieron ocultar una imagen** en todo el sitio. Ahora está
  en `@layer base`. Si añades reglas de elemento al CSS global, mételas en una
  capa o romperás utilidades sin enterarte.
  **Pasó dos veces.** El 19-oct apareció la gemela: un `a { color: inherit }`
  suelto que anulaba todo color de enlace, y el "Elegir talla" de las cards
  salía crema sobre blanco, invisible, en celular. También está ya en
  `@layer base`.
- **Las utilidades `blur-*` no ponen `filter`**: ponen la variable `--tw-blur` y
  componen `filter` a partir de ella, y esa cadena no se deja pisar por una
  variante aunque la regla esté después y el selector coincida. Además `blur-0`
  es de la v3 y **no existe**. Para filtros, valor literal:
  `[filter:blur(12px)]` / `[filter:none]`.

### El prefetch de Next se baja rutas enteras que nadie abre

Next precarga todo `<Link>` que aparece en pantalla, y no sólo los datos:
también el JS de la ruta. El logo del menú enlaza a `/`, así que cada visita a
la tienda se bajaba el intro con framer-motion (188 KB). De los 870 KB de JS
que se midieron el 16-oct, 219 eran eso.

**Regla:** en la navegación general (menú, footer, migas), los enlaces a rutas
FUERA de la tienda van con `LinkPorIntencion`, que precarga solo con el mouse
encima, el foco o el dedo. Los de `/tienda` y las fichas van con `Link` normal:
es el camino de la compra. Un `Link` nuevo al home en el menú devuelve los
188 KB sin que nada avise.

**Y para medirlo, el panel del navegador de Claude no sirve.** Está oculto y no
corre frames: `IntersectionObserver` nunca dispara, no hay prefetch y la
tienda parece pesar 605 KB. Se mide con `scripts/medir-pagina.mjs`, que abre un
Chrome sin ventana, y contra producción o `next start`: en `next dev` no hay
prefetch.

### La imagen de compartir de cada ficha (`opengraph-image.tsx`)

Se arma sola desde `products.ts` y la foto de prenda de `/brand/products`; una
pieza nueva no pide nada. Fuentes en `assets/fonts` (TTF, ver su README). Dos
trampas de `next/og`, las dos SIN error:

- **Reconoce los WebP pero no los dibuja**: sale el hueco vacío. Todo pasa por
  `sharp` a JPEG antes de dibujar, y el resultado final también sale en JPEG
  (el PNG pesaba ~850 KB y WhatsApp se salta las vistas previas pesadas).
- **Una ruta de archivo armada con variables mete TODO `public` en la función**
  (música y videos incluidos). La carpeta va escrita literal y solo el nombre
  del archivo es variable: `join(raiz, "public/brand/products", basename(...))`.

Para mirarla: `/producto/<slug>/opengraph-image/ficha`. WhatsApp guarda la vista
previa de cada enlace mucho tiempo: un enlace que ya se pasó por un chat puede
seguir mostrando la imagen vieja.

### Dos sustos que no lo eran

- **El género no filtra nada.** Las 24 piezas son `unisex`, así que Hombre/Mujer
  nunca cambia la lista — sólo con qué modelo se enseña cada pieza. Si en móvil
  se muestra la prenda sola, esos botones parecen rotos; por eso con línea
  elegida la card de móvil enseña el modelo.
- **`getFeatured` descarta en silencio** el slug que no encuentra. El home
  estuvo un mes mostrando dos destacados en vez de tres porque `FEATURED_SLUGS`
  apuntaba a una básica renombrada.

---

## 4. Decisiones de producto que ya están tomadas

- **El home es una puerta, no una vitrina**: intro → Hombre/Mujer → Drop. Cero
  enlaces a producto. Se probó poner catálogo y Juan lo quitó el mismo día.
- **El pago se cierra por WhatsApp.** El precio se muestra; no hay pasarela.
- **Se estampa por pedido**, así que hoy no hay stock real que cargar.
- **La música es de M.A.D. Fellaz**, con permiso de palabra (falta por escrito).
  Arranca sola en el primer gesto **después** de que la página cargue, con el
  tema más liviano. No adelantarla: era el 73 % del peso de la página.
- **Las piezas con licencia de terceros se sacan o se renombran.** Ya salieron
  Guns & Roses, The Mills y Offline Pleasure. Y tres de Expedición no nombran
  su fuente a propósito: Our Lady Doom, Survival of the Fittest y Vuelo
  Nocturno.

---

## 5. Qué falta

Todo está en **[PENDIENTES.md](PENDIENTES.md)**, con la lista del 16-oct arriba.
En corto:

1. **Cuatro decisiones de Juan**: Vinland Saga (la única que sigue nombrando la
   obra), la fecha del próximo drop, si refrescamos las fotos de Fundadores, y
   la colaboración con M.A.D. Fellaz.
2. **El JS bajó de 870 a 572 KB** (19-oct): la precarga por intención (ver la
   trampa del prefetch) y Next 16.2.9 → 16.4.2. Lo que queda es casi todo de
   React y Next; lo nuestro es una parte chica.
3. Lo de siempre: dominio propio, analítica, imagen de compartir por pieza,
   páginas de envíos y cambios.
