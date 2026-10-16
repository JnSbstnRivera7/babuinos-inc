/* ════════════════════════════════════════════════════════════
   BABUINOS INC — Catálogo
   Fuente única de verdad: productos, categorías, géneros, colores.

   Dos líneas:
     · Básicas          — algodón pesado sin estampado (la paleta de la casa)
     · Colección Fundadores — las estampadas

   Precios en COP por categoría (`PRECIO`).
   El pago y el envío se coordinan por WhatsApp.

   El TALLAJE ya no vive acá: se edita en /admin y llega desde Supabase
   (`withStock` + tabla `product_stock`). `TALLAS_STD` es solo el respaldo de
   las piezas que todavía no se han cargado.
   ════════════════════════════════════════════════════════════ */

/* ─── Territorios — solo dan el color de acento de sellos y badges ─── */
export type EditionKey = "original" | "safari" | "midnight" | "regal" | "nautical" | "desert";

export interface Edition {
  key: EditionKey;
  name: string;
  tagline: string;
  accent: string; // color de UI para labels/sellos
}

export const EDITIONS: Edition[] = [
  { key: "original", name: "Original", tagline: "Teal / Dorado", accent: "#00736c" },
  { key: "safari", name: "Vintage Safari", tagline: "Oliva / Crema", accent: "#4a5c2a" },
  { key: "midnight", name: "Midnight", tagline: "Negro / Plata", accent: "#6b7280" },
  { key: "regal", name: "Regal Velvet", tagline: "Rojo / Oro", accent: "#8c1c2f" },
  { key: "nautical", name: "Nautical", tagline: "Lila / Celeste", accent: "#6b5ba8" },
  { key: "desert", name: "Desert Gold", tagline: "Arena / Marrón", accent: "#cda214" },
];

export function getEdition(key: EditionKey): Edition {
  return EDITIONS.find((e) => e.key === key) ?? EDITIONS[0];
}

/* ─── Género (línea) — gorra = hombre, cola de caballo = mujer ─── */
export type Genero = "hombre" | "mujer" | "unisex";

export interface GeneroDef {
  key: Genero;
  label: string;
  icon: "cap" | "bow" | "none";
  blurb: string;
}

export const GENEROS: GeneroDef[] = [
  { key: "hombre", label: "Hombre", icon: "cap", blurb: "Quien marca su territorio." },
  { key: "mujer", label: "Mujer", icon: "bow", blurb: "Quien lo domina." },
  { key: "unisex", label: "Unisex", icon: "none", blurb: "Sin etiquetas. Para toda la manada." },
];

/* ─── Categoría de prenda (top-level) ─── */
export interface TopCategory {
  key: string;
  label: string;
  href: string;
  soon: boolean;
  color: string;
}

export const TOP_CATEGORIES: TopCategory[] = [
  { key: "camisas", label: "Camisas", href: "/tienda", soon: false, color: "#00897f" },
  { key: "sacos", label: "Sacos", href: "/sacos", soon: true, color: "#cda214" },
  { key: "medias", label: "Medias", href: "/medias", soon: true, color: "#6b8035" },
  { key: "accesorios", label: "Accesorios", href: "/accesorios", soon: true, color: "#8a6a3a" },
];

/* ─── Sub-tipo: sin estampado / con estampado ─── */
export type Category = "basica" | "estampada";

export const CATEGORIES: { key: Category | "all"; label: string }[] = [
  { key: "all", label: "Todo" },
  { key: "basica", label: "Básicas" },
  { key: "estampada", label: "Estampadas" },
];

/* ─── Colección (la tanda con la que salió la pieza) ───────────────
   No es lo mismo que la categoría: "estampada" dice QUÉ es la prenda y la
   colección dice CUÁNDO salió. La tienda muestra la colección vigente y deja
   volver a las anteriores, para que una tanda nueva no entierre a la vieja. */
export type Coleccion = "basicas" | "fundadores" | "expedicion";

export interface ColeccionDef {
  key: Coleccion;
  label: string;
  /** Lo que se lee bajo el título en la tienda. */
  tagline: string;
  /** Para el orden y el sello: la más reciente primero. */
  anio: number;
  /** `true` = la tanda vigente; `false` = archivo. Las básicas no caducan. */
  vigente: boolean;
  accent: string;
}

export const COLECCIONES: ColeccionDef[] = [
  {
    key: "basicas",
    label: "Básicas",
    tagline: "La paleta de la casa. Sin estampado, todo el año.",
    anio: 2026,
    vigente: true,
    accent: "#00897f",
  },
  {
    key: "expedicion",
    label: "Expedición",
    tagline: "La tanda nueva. Siete piezas, estampado a toda la espalda.",
    anio: 2026,
    vigente: true,
    accent: "#cda214",
  },
  {
    key: "fundadores",
    label: "Fundadores",
    tagline: "Las primeras. El archivo con el que arrancó la marca.",
    anio: 2026,
    vigente: false,
    accent: "#8a6a3a",
  },
];

export function getColeccion(key: Coleccion): ColeccionDef {
  return COLECCIONES.find((c) => c.key === key) ?? COLECCIONES[0];
}

/* ─── Color de la prenda — es lo que la gente filtra de verdad ─── */
export interface ColorDef {
  key: string;
  label: string;
  hex: string;
}

export const COLORES: ColorDef[] = [
  { key: "negro", label: "Negro", hex: "#1e2021" },
  { key: "blanco", label: "Blanco", hex: "#f5f3f0" },
  { key: "crema", label: "Crema", hex: "#e6dcc6" },
  { key: "vino", label: "Vinotinto", hex: "#6b2233" },
  { key: "arena", label: "Arena", hex: "#d9cdb7" },
  { key: "hueso", label: "Hueso", hex: "#e8e0d0" },
  { key: "pardo", label: "Pardo", hex: "#654321" },
  { key: "rojo", label: "Rojo", hex: "#c8102e" },
  { key: "lila", label: "Lila", hex: "#c3a9e6" },
  { key: "verde", label: "Verde", hex: "#1f3d2b" },
  { key: "navy", label: "Azul", hex: "#1b2f5c" },
  { key: "celeste", label: "Celeste", hex: "#a9cce3" },
  // Lavado a la piedra: no es el negro plano de las básicas, se ve jaspeado.
  { key: "lavado", label: "Negro lavado", hex: "#3a3a3c" },
  { key: "gris", label: "Gris jaspeado", hex: "#b9bbbd" },
];

export function getColor(key: string): ColorDef | undefined {
  return COLORES.find((c) => c.key === key);
}

/* ─── Fotos de modelo (camisa puesta) por género y ángulo ─── */
export interface ModelShots {
  frontal: string;
  lateral: string;
  espalda: string;
}

export interface ModelGallery {
  hombre?: ModelShots;
  mujer?: ModelShots;
}

/** Rutas de las fotos de modelo a partir del slug. */
function modelSet(slug: string): ModelGallery {
  const shots = (g: "hombre" | "mujer"): ModelShots => ({
    frontal: `/brand/models/${slug}/${g}-frontal.webp`,
    lateral: `/brand/models/${slug}/${g}-lateral.webp`,
    espalda: `/brand/models/${slug}/${g}-espalda.webp`,
  });
  return { hombre: shots("hombre"), mujer: shots("mujer") };
}

/** Prenda sola: espalda primero (ahí vive el gráfico), luego frente. */
function flatSet(slug: string): string[] {
  return [`/brand/products/${slug}-espalda.webp`, `/brand/products/${slug}-frente.webp`];
}

/* ─── Producto ─── */
export interface SizeStock {
  size: string;
  stock: number; // 0 = agotado
}

export type Badge = "new" | "hot" | "last";

export interface Product {
  id: string;
  slug: string;
  name: string;
  tag: string;
  category: Category;
  /** La tanda con la que salió. No se escribe pieza por pieza: lo pone
   *  `PRODUCTS` según el arreglo del que venga, así no hay forma de que una
   *  pieza quede con la colección de otra. */
  coleccion: Coleccion;
  genero: Genero;
  edition: EditionKey;
  /** key de COLORES — alimenta el filtro de color */
  color: string;
  desc: string;
  descLong?: string;
  fit?: string;
  composicion?: string;
  image: string; // foto principal (carrito, thumbnails)
  images: string[]; // prenda sola para la PDP
  /**
   * Prenda sola DISTINTA por género, para las piezas con dos cortes reales
   * (lo usó Guns & Roses hasta que salió del catálogo: oversize en hombre, crop
   * en mujer). Hoy no lo usa ninguna pieza, pero el soporte queda. Si existe, la
   * galería usa el corte del toggle H/M en vez de `images`.
   */
  imagesByGender?: { hombre: string[]; mujer: string[] };
  models?: ModelGallery; // camisa puesta, por género
  colorway: string;
  sizes: SizeStock[];
  price?: number;
  badge?: Badge;
}

/**
 * Tallaje PROVISIONAL: el que usa una pieza mientras nadie le cargue el suyo en
 * /admin. Cambiar acá afecta a todas las que sigan sin cargar.
 * (10-ago: se estampa por pedido, así que hoy están todas así a propósito.)
 */
export const TALLAS_STD: SizeStock[] = [
  { size: "S", stock: 6 },
  { size: "M", stock: 8 },
  { size: "L", stock: 8 },
  { size: "XL", stock: 6 },
  { size: "2XL", stock: 4 },
];

/**
 * La tela, en UN solo lugar. Se exporta porque la ficha de producto también la
 * muestra: antes repetía el texto a mano y quedaba desincronizada al cambiarlo.
 * Subió de 220 a 250 g/m² el 26-sep-2026, junto con los precios.
 */
export const ALGODON = "100% algodón 250 g/m²";

/* ════════════════ BÁSICAS ════════════════
   Sin estampado. Solo el babuino troquelado en el ruedo y BABUINOS en la nuca.
   Los cinco colores son la paleta oficial de la marca.                        */

/** Una pieza TAL COMO SE ESCRIBE abajo: sin `coleccion`, que la pone
 *  `PRODUCTS` según el arreglo. */
type Pieza = Omit<Product, "coleccion">;

const BASICAS: Pieza[] = [
  {
    id: "base-vino-cordillera",
    slug: "base-vino-cordillera",
    name: "Vino Cordillera",
    tag: "Oversize · Básica",
    category: "basica",
    genero: "unisex",
    edition: "original",
    color: "vino",
    desc: "Vinotinto cerrado, cero estampado. El babuino en el ruedo y BABUINOS en la nuca: lo demás lo pones tú.",
    descLong:
      "El vinotinto de la casa en algodón pesado, sin gráfico que compita. Solo el babuino troquelado en el ruedo y el sello BABUINOS en la nuca. Caída oversize para usarla sola o debajo de todo.",
    fit: "Oversize",
    composicion: ALGODON,
    image: "/brand/products/base-vino-cordillera-frente.webp",
    images: flatSet("base-vino-cordillera"),
    models: modelSet("base-vino-cordillera"),
    colorway: "Vino Cordillera",
    sizes: TALLAS_STD,
    badge: "new",
  },
  {
    id: "base-tinta-explorador",
    slug: "base-tinta-explorador",
    name: "Tinta Explorador",
    tag: "Oversize · Básica",
    category: "basica",
    genero: "unisex",
    edition: "midnight",
    color: "negro",
    desc: "Negro absoluto sin una línea de más. La que siempre funciona.",
    descLong:
      "Negro tinta en algodón pesado de 250 gramos. Sin estampado: el babuino en el ruedo y BABUINOS en la nuca son toda la declaración. La base de cualquier pinta de la manada.",
    fit: "Oversize",
    composicion: ALGODON,
    image: "/brand/products/base-tinta-explorador-frente.webp",
    images: flatSet("base-tinta-explorador"),
    models: modelSet("base-tinta-explorador"),
    colorway: "Negro Tinta",
    sizes: TALLAS_STD,
    badge: "hot",
  },
  {
    id: "base-pardo-tostado",
    slug: "base-pardo-tostado",
    name: "Pardo Tostado",
    tag: "Oversize · Básica",
    category: "basica",
    genero: "unisex",
    edition: "desert",
    color: "pardo",
    desc: "Café tostado, tono tierra. La básica que no se ve como básica.",
    descLong:
      "Pardo tostado, el tono tierra de la marca, en algodón pesado. Sin gráfico, con el babuino en el ruedo y el sello en la nuca. Combina con todo lo que ya tienes y no parece de relleno.",
    fit: "Oversize",
    composicion: ALGODON,
    image: "/brand/products/base-pardo-tostado-frente.webp",
    images: flatSet("base-pardo-tostado"),
    models: modelSet("base-pardo-tostado"),
    colorway: "Pardo Tostado",
    sizes: TALLAS_STD,
  },
  {
    id: "base-arena-paramo",
    slug: "base-arena-paramo",
    name: "Arena Páramo",
    tag: "Oversize · Básica",
    category: "basica",
    genero: "unisex",
    edition: "desert",
    color: "arena",
    desc: "Arena claro, tono neutro. La básica que combina con absolutamente todo.",
    descLong:
      "Beige arena en algodón pesado, sin print: el tono hace el trabajo y deja pasar cualquier cosa encima. Babuino troquelado en el ruedo y BABUINOS en la nuca, los dos en tono sobre tono.",
    fit: "Oversize",
    composicion: ALGODON,
    image: "/brand/products/base-arena-paramo-frente.webp",
    images: flatSet("base-arena-paramo"),
    models: modelSet("base-arena-paramo"),
    colorway: "Arena Páramo",
    sizes: TALLAS_STD,
    badge: "new",
  },
  {
    id: "base-papiro",
    slug: "base-papiro",
    name: "Papiro",
    tag: "Oversize · Básica",
    category: "basica",
    genero: "unisex",
    edition: "safari",
    color: "blanco",
    desc: "Blanco papiro, caída oversize. La base de todo.",
    descLong:
      "Blanco papiro en algodón pesado que no se transparenta. Cero estampado, babuino en el ruedo y sello en la nuca. Sirve de lienzo para todo lo demás.",
    fit: "Oversize",
    composicion: ALGODON,
    image: "/brand/products/base-papiro-frente.webp",
    images: flatSet("base-papiro"),
    models: modelSet("base-papiro"),
    colorway: "Blanco Papiro",
    sizes: TALLAS_STD,
  },
  {
    id: "base-hueso-neblina",
    slug: "base-hueso-neblina",
    name: "Hueso Neblina",
    tag: "Oversize · Básica",
    category: "basica",
    genero: "unisex",
    edition: "original",
    color: "hueso",
    desc: "Hueso cálido con la marca en negro. La básica que sí se deja ver.",
    descLong:
      "Blanco hueso en algodón pesado y, a diferencia de la Arena Páramo, acá el babuino del ruedo y el BABUINOS de la nuca van en NEGRO, a contraste. Caída oversize, para cuando el tono neutro no quiere pasar desapercibido.",
    fit: "Oversize",
    composicion: ALGODON,
    image: "/brand/products/base-hueso-neblina-frente.webp",
    images: flatSet("base-hueso-neblina"),
    models: modelSet("base-hueso-neblina"),
    colorway: "Hueso Neblina",
    sizes: TALLAS_STD,
    badge: "new",
  },
];

/* ════════════════ COLECCIÓN FUNDADORES ════════════════
   Las estampadas. "SG" que aparece en varias es el monograma de SOMOS GRANDES. */

const FUNDADORES: Pieza[] = [
  {
    id: "wear-your-attitude",
    slug: "wear-your-attitude",
    name: "Wear Your Attitude",
    tag: "Oversize · Estampada",
    category: "estampada",
    genero: "unisex",
    edition: "midnight",
    color: "negro",
    desc: "Negra con el manifiesto a la espalda: WEAR YOUR ATTITUDE tachado en rojo. La pieza bandera.",
    descLong:
      "Algodón pesado negro con el manifiesto completo a la espalda: WEAR YOUR ATTITUDE en bloque, el Attitude tachado en script rojo, los cinco pilares —fortitude, strength, confidence, discipline, ambition— y el código de barras con el ESTABLISHED MMXXIV. Al frente, la firma en trazo de graffiti. Discreta de lejos, larga de leer de cerca.",
    fit: "Oversize",
    composicion: ALGODON,
    image: "/brand/products/wear-your-attitude-frente.webp",
    images: flatSet("wear-your-attitude"),
    models: modelSet("wear-your-attitude"),
    colorway: "Negro / Rojo",
    sizes: TALLAS_STD,
    badge: "hot",
  },
  /* Acá vivían "Guns & Roses Red" y "The Mills". Juan las SACÓ del catálogo el
     2026-08-07 por las licencias de terceros (nombre e imagen de las bandas).
     Se borraron también sus fotos del sitio —el material es justo lo que no puede
     quedar público— y sus números salieron del mapa del script de ingesta para
     que una corrida completa no las vuelva a generar. Las láminas originales
     siguen en MATERIAL (local, fuera del repo y del deploy). */
  {
    id: "free-palestine",
    slug: "free-palestine",
    name: "Free Palestine",
    tag: "Oversize · Estampada",
    category: "estampada",
    genero: "unisex",
    edition: "midnight",
    color: "negro",
    desc: "Negra con retrato en kufiya y lettering de graffiti a la espalda. Bandera pequeña al pecho.",
    descLong:
      "Negro en algodón pesado con un retrato a toda la espalda —kufiya, textura de aerosol y la bandera difuminada detrás— bajo el lettering FREE PALESTINE en trazo de graffiti. Al frente, la bandera en tamaño pequeño sobre el pecho.",
    fit: "Oversize",
    composicion: ALGODON,
    image: "/brand/products/free-palestine-frente.webp",
    images: flatSet("free-palestine"),
    models: modelSet("free-palestine"),
    colorway: "Negro",
    sizes: TALLAS_STD,
  },
  {
    id: "rottweiler",
    slug: "rottweiler",
    name: "Rottweiler",
    tag: "Oversize · Estampada",
    category: "estampada",
    genero: "unisex",
    edition: "safari",
    color: "blanco",
    desc: "Blanca con el rottweiler al pecho y SOMOS GRANDES a la espalda en lettering espinoso.",
    descLong:
      "Blanco sobre algodón pesado. Al frente el rottweiler ilustrado con el lettering Babuinos; a la espalda SOMOS GRANDES en tipografía espinosa de cartel de metal. Etiqueta tejida en el ruedo.",
    fit: "Oversize",
    composicion: ALGODON,
    image: "/brand/products/rottweiler-frente.webp",
    images: flatSet("rottweiler"),
    models: modelSet("rottweiler"),
    colorway: "Blanco",
    sizes: TALLAS_STD,
  },
  {
    id: "brave-dog",
    slug: "brave-dog",
    name: "Brave Dog",
    tag: "Lavada al ácido · Estampada",
    category: "estampada",
    genero: "unisex",
    edition: "midnight",
    color: "negro",
    desc: "Negra lavada al ácido con la cabeza del perro en rojo y BABUINOS en lettering de metal.",
    descLong:
      "Lavado al ácido que deja cada prenda distinta a la siguiente. A la espalda, BABUINOS en lettering espinoso sobre la cabeza del perro en rojo puro; al frente, SOMOS GRANDES en pequeño y etiqueta tejida en el ruedo.",
    fit: "Oversize",
    composicion: ALGODON,
    image: "/brand/products/brave-dog-frente.webp",
    images: flatSet("brave-dog"),
    models: modelSet("brave-dog"),
    colorway: "Negro Lavado / Rojo",
    sizes: TALLAS_STD,
    badge: "hot",
  },
  {
    id: "babuinos-lila",
    slug: "babuinos-lila",
    name: "Babuinos Lila",
    tag: "Oversize · Estampada",
    category: "estampada",
    genero: "unisex",
    edition: "nautical",
    color: "lila",
    desc: "Lila con el logo en script celeste a lo ancho de la espalda. La más suave y la que más se nota.",
    descLong:
      "Lila polvo con el wordmark Babuinos en script celeste cruzando la espalda y el monograma SG al pecho. Etiqueta tejida azul en el ruedo. Suave de color, nada de tímida.",
    fit: "Oversize",
    composicion: ALGODON,
    image: "/brand/products/babuinos-lila-frente.webp",
    images: flatSet("babuinos-lila"),
    models: modelSet("babuinos-lila"),
    colorway: "Lila Polvo / Celeste",
    sizes: TALLAS_STD,
  },
  {
    id: "asian-tengu-mask",
    slug: "asian-tengu-mask",
    name: "Asian Tengu Mask",
    tag: "Lavada · Estampada",
    category: "estampada",
    genero: "unisex",
    edition: "desert",
    color: "pardo",
    desc: "Café lavado con el vendedor de máscaras tengu ilustrado a toda la espalda.",
    descLong:
      "Lavado café que hace única cada pieza, con la ilustración del vendedor de máscaras a toda la espalda: tengu, kitsune y oni colgando de los hilos. Al frente, el sello en rojo, y etiqueta tejida en el ruedo.",
    fit: "Oversize",
    composicion: ALGODON,
    image: "/brand/products/asian-tengu-mask-frente.webp",
    images: flatSet("asian-tengu-mask"),
    models: modelSet("asian-tengu-mask"),
    colorway: "Café Lavado",
    sizes: TALLAS_STD,
    badge: "new",
  },
  {
    id: "california-rasta-kid",
    slug: "california-rasta-kid",
    name: "California Rasta Kid",
    tag: "Oversize · Estampada",
    category: "estampada",
    genero: "unisex",
    edition: "safari",
    color: "verde",
    desc: "Verde bosque con el lettering California en rojo y la ilustración a toda la espalda.",
    descLong:
      "Verde bosque profundo con el lettering California en script rojo de estadio y la ilustración del niño de gorra a la espalda, sobre el Golden Beautiful — the future is here. Sello en naranja al pecho.",
    fit: "Oversize",
    composicion: ALGODON,
    image: "/brand/products/california-rasta-kid-frente.webp",
    images: flatSet("california-rasta-kid"),
    models: modelSet("california-rasta-kid"),
    colorway: "Verde Bosque",
    sizes: TALLAS_STD,
  },
  {
    id: "guardian-navy",
    slug: "guardian-navy",
    name: "Guardián Navy",
    tag: "Oversize · Estampada",
    category: "estampada",
    genero: "unisex",
    edition: "nautical",
    color: "navy",
    desc: "Azul marino con el ángel guardián a toda la espalda y el lettering Guardian en rojo. Monograma SG al pecho.",
    descLong:
      "Azul marino profundo con la estatua del ángel guardián ilustrada a toda la espalda, atravesada por rayos, bajo el lettering Guardian en rojo gótico. Al frente, el monograma SG bordado en rojo; etiqueta tejida en el ruedo. Edición limitada.",
    fit: "Oversize",
    composicion: ALGODON,
    image: "/brand/products/guardian-navy-frente.webp",
    images: flatSet("guardian-navy"),
    models: modelSet("guardian-navy"),
    colorway: "Azul Marino / Rojo",
    sizes: TALLAS_STD,
    badge: "new",
  },
  {
    id: "eternal-beauty",
    slug: "eternal-beauty",
    name: "Eternal Beauty",
    tag: "Oversize · Estampada",
    category: "estampada",
    genero: "unisex",
    edition: "midnight",
    color: "negro",
    desc: "Negra con un querubín alado a toda la espalda bajo el lettering Eternal Beauty. 'Our Bond is Forever' al frente.",
    descLong:
      "Negro absoluto con una ilustración de querubín alado sobre las nubes a toda la espalda, bajo el lettering gótico Eternal Beauty y el remate Chasing Dreams. Al frente, 'Our Bond is Forever' en script fino entre tres rosas; babuino troquelado en el ruedo y BABUINOS en la nuca.",
    fit: "Oversize",
    composicion: ALGODON,
    image: "/brand/products/eternal-beauty-frente.webp",
    images: flatSet("eternal-beauty"),
    models: modelSet("eternal-beauty"),
    colorway: "Negro",
    sizes: TALLAS_STD,
    badge: "new",
  },
  {
    id: "doberman-sangre",
    slug: "doberman-sangre",
    name: "Doberman Sangre",
    tag: "Oversize · Estampada",
    category: "estampada",
    genero: "unisex",
    edition: "regal",
    color: "lavado",
    desc: "Lavada a la piedra, con un doberman de facetas y ojos rojos a toda la espalda bajo BABUINOS en death metal.",
    descLong:
      "Negro lavado a la piedra: jaspeado, con ese desgaste que hace que no haya dos exactamente iguales. A toda la espalda, un doberman ilustrado en facetas geométricas con los ojos en rojo, bajo BABUINOS en lettering de death metal. Al frente el sello SOMOS GRANDES en el mismo trazo espinado, babuino troquelado en el ruedo, etiqueta tejida al costado y BABUINOS en la nuca.",
    fit: "Oversize",
    composicion: ALGODON,
    image: "/brand/products/doberman-sangre-frente.webp",
    images: flatSet("doberman-sangre"),
    models: modelSet("doberman-sangre"),
    colorway: "Negro Lavado",
    sizes: TALLAS_STD,
    badge: "new",
  },
];

/* ─── Precios (COP) ───────────────────────────────────────────
   Se inyectan por categoría en un solo lugar, no pieza por pieza, para no
   repetirlos 18 veces. Una pieza puede traer su propio `price` y este NO lo
   pisa.

   26-sep-2026: básicas 50.000 -> 60.000 y estampadas 75.000 -> 80.000, con la
   tela subiendo a 250 g/m² (ver ALGODON). Los pedidos ya guardados en Supabase
   conservan el precio con el que se cerraron: acá sólo cambia lo que se cobra
   de ahora en adelante. */
/* ════════════════ COLECCIÓN EXPEDICIÓN ════════════════
   La tanda del 15-oct-2026. Siete piezas, todas con el gráfico a toda la
   espalda y una marca pequeña al frente.

   OJO CON LAS LICENCIAS: cuatro de las siete citan obra ajena —DOOM, Mobb
   Deep, la escena de la bici contra la luna y Vinland Saga—. Es la misma razón
   por la que salieron del catálogo Guns & Roses, The Mills y Offline Pleasure
   (ver la nota en Fundadores). Dos de ellas evitan nombrar la fuente a
   propósito: la de la luna se llama "Vuelo Nocturno" y no menciona la
   película. Queda anotado para que la decisión sea de Juan y no un descuido.  */

const EXPEDICION: Pieza[] = [
  {
    id: "hanya-mask",
    slug: "hanya-mask",
    name: "Hanya Mask",
    tag: "Oversize · Estampada",
    category: "estampada",
    genero: "unisex",
    edition: "regal",
    color: "negro",
    desc: "Negra con una máscara hanya a toda la espalda y el proverbio de las siete caídas.",
    descLong:
      "Negro en algodón pesado con una máscara hanya —el demonio del teatro nō— ocupando toda la espalda: cuernos, colmillos y peonías en rojo sangre sobre un medallón dorado. A un costado, 七転び八起き: «cae siete veces, levántate ocho». Al frente, el mismo lema en vertical, pequeño, sobre el pecho.",
    fit: "Oversize",
    composicion: ALGODON,
    image: "/brand/products/hanya-mask-frente.webp",
    images: flatSet("hanya-mask"),
    models: modelSet("hanya-mask"),
    colorway: "Negro",
    sizes: TALLAS_STD,
    badge: "new",
  },
  {
    // Nombre y slug NEUTROS a propósito (16-oct): el gráfico cita a un artista
    // ajeno, y mientras no haya permiso por escrito la tienda no lo nombra —
    // ni en el título, ni en la URL, ni en el nombre del archivo.
    id: "our-lady-doom",
    slug: "our-lady-doom",
    name: "Our Lady Doom",
    tag: "Oversize · Estampada",
    category: "estampada",
    genero: "unisex",
    edition: "desert",
    color: "crema",
    desc: "Crema con una virgen enmascarada y un halo de rayos dorados a la espalda.",
    descLong:
      "Crema en algodón pesado con una estampa devocional a toda la espalda: manto verde, túnica naranja, las manos juntas y una máscara metálica donde iría el rostro, bajo un halo de rayos dorados. Un guiño al villano del rap que nunca se quitó la careta. Al frente, la máscara sola, pequeña, sobre el pecho.",
    fit: "Oversize",
    composicion: ALGODON,
    image: "/brand/products/our-lady-doom-frente.webp",
    images: flatSet("our-lady-doom"),
    models: modelSet("our-lady-doom"),
    colorway: "Crema",
    sizes: TALLAS_STD,
    badge: "new",
  },
  {
    // Igual que la anterior: el nombre del grupo es la marca más fuerte que
    // hay aquí, así que no aparece. "Survival of the Fittest" es una frase de
    // uso común, no una marca.
    id: "survival-of-the-fittest",
    slug: "survival-of-the-fittest",
    name: "Survival of the Fittest",
    tag: "Oversize · Estampada",
    category: "estampada",
    genero: "unisex",
    edition: "midnight",
    color: "negro",
    desc: "Negra con un collage de esquina neoyorquina a la espalda y el lettering al pecho.",
    descLong:
      "Negro en algodón pesado con un collage a toda la espalda: la esquina, el edificio de ladrillo, los dos del barrio mirando a cámara y el recorte de prensa encima, todo en pegote de afiche rasgado. Al frente, el lettering en arco sobre el pecho. Boom bap de los noventa, puesto.",
    fit: "Oversize",
    composicion: ALGODON,
    image: "/brand/products/survival-of-the-fittest-frente.webp",
    images: flatSet("survival-of-the-fittest"),
    models: modelSet("survival-of-the-fittest"),
    colorway: "Negro",
    sizes: TALLAS_STD,
    badge: "new",
  },
  {
    // Sale más o menos una al mes en apoyo a Palestina, todas con ese nombre.
    // Cada una necesita su propio slug: comparten nombre, no archivos.
    id: "free-palestine-victoria",
    slug: "free-palestine-victoria",
    name: "Free Palestine · Victoria",
    tag: "Oversize · Estampada",
    category: "estampada",
    genero: "unisex",
    edition: "midnight",
    color: "negro",
    desc: "Negra con el retrato en kufiya haciendo la V y el lettering de graffiti a la espalda.",
    descLong:
      "Negro en algodón pesado con un retrato a toda la espalda: kufiya cubriendo el rostro, la mano en señal de victoria y la bandera difuminada detrás en textura de aerosol, bajo el lettering FREE PALESTINE en trazo de graffiti. Al frente, la bandera en tamaño pequeño sobre el pecho. La segunda de la serie; la primera vive en Fundadores.",
    fit: "Oversize",
    composicion: ALGODON,
    image: "/brand/products/free-palestine-victoria-frente.webp",
    images: flatSet("free-palestine-victoria"),
    models: modelSet("free-palestine-victoria"),
    colorway: "Negro",
    sizes: TALLAS_STD,
    badge: "new",
  },
  {
    id: "football-freedom",
    slug: "football-freedom",
    name: "Football Freedom",
    tag: "Oversize · Estampada",
    category: "estampada",
    genero: "unisex",
    edition: "safari",
    color: "arena",
    desc: "Arena lavada con una futbolista y el lettering en rojo, dorado y verde a la espalda.",
    descLong:
      "Arena lavada a la piedra con una futbolista de rastas a toda la espalda, pisando el balón, y el lettering FOOTBALL FREEDOM escurrido en rojo, dorado y verde. Al frente, la bandera rasta pequeña sobre el pecho. Fútbol de potrero y sound system en la misma prenda.",
    fit: "Oversize",
    composicion: ALGODON,
    image: "/brand/products/football-freedom-frente.webp",
    images: flatSet("football-freedom"),
    models: modelSet("football-freedom"),
    colorway: "Arena lavada",
    sizes: TALLAS_STD,
    badge: "new",
  },
  {
    id: "luna-bicicleta",
    slug: "luna-bicicleta",
    name: "Vuelo Nocturno",
    tag: "Oversize · Estampada",
    category: "estampada",
    genero: "unisex",
    edition: "midnight",
    color: "lavado",
    desc: "Negro lavado con una luna llena enorme y una bici cruzándola sobre el pinar.",
    descLong:
      "Negro lavado a la piedra —jaspeado, nunca plano— con una luna llena ocupando toda la espalda, la silueta de una bici cruzándola por delante y la línea de pinos recortada abajo. Monocromo, sin una palabra. La estampa está tramada para que el lavado se vea a través.",
    fit: "Oversize",
    composicion: ALGODON,
    image: "/brand/products/luna-bicicleta-frente.webp",
    images: flatSet("luna-bicicleta"),
    models: modelSet("luna-bicicleta"),
    colorway: "Negro lavado",
    sizes: TALLAS_STD,
    badge: "new",
  },
  {
    id: "vinland-saga",
    slug: "vinland-saga",
    name: "Vinland Saga",
    tag: "Oversize · Estampada",
    category: "estampada",
    genero: "unisex",
    edition: "regal",
    color: "gris",
    desc: "Gris jaspeada con el guerrero del hacha a toda la espalda y el título en rojo.",
    descLong:
      "Gris jaspeado en algodón pesado con una escena de batalla a toda la espalda: el guerrero de melena al hombro, el hacha cruzada y la tropa detrás, en trazo de tinta. El título en rojo bloque arriba. Al frente, el mismo título en pequeño sobre el pecho.",
    fit: "Oversize",
    composicion: ALGODON,
    image: "/brand/products/vinland-saga-frente.webp",
    images: flatSet("vinland-saga"),
    models: modelSet("vinland-saga"),
    colorway: "Gris jaspeado",
    sizes: TALLAS_STD,
    badge: "new",
  },
  {
    id: "all-cats-are-beautiful",
    slug: "all-cats-are-beautiful",
    name: "All Cats Are Beautiful",
    tag: "Oversize · Estampada",
    category: "estampada",
    genero: "unisex",
    edition: "regal",
    color: "lavado",
    desc: "Negro lavado con la patrulla ardiendo y los tres gatos encapuchados a la espalda.",
    descLong:
      "Negro lavado a la piedra con la escena a toda la espalda: ALL CATS ARE BEAUTIFUL en letras de molde sobre un muro de llamas, la patrulla volcada ardiendo detrás y tres gatos de capucha al frente —el persa, el esfinge y el naranja con la lágrima— mirando a cámara. Al frente, un gato caminando sobre A.C.A.B, pequeño, sobre el pecho. Las siglas de siempre, leídas como toca.",
    fit: "Oversize",
    composicion: ALGODON,
    image: "/brand/products/all-cats-are-beautiful-frente.webp",
    images: flatSet("all-cats-are-beautiful"),
    models: modelSet("all-cats-are-beautiful"),
    colorway: "Negro lavado",
    sizes: TALLAS_STD,
    badge: "new",
  },
];

export const PRECIO: Record<Category, number> = {
  basica: 60000,
  estampada: 80000,
};

/** La colección sale del ARREGLO, no de un campo escrito pieza por pieza: así
 *  no hay manera de que una quede con la etiqueta de otra al copiar y pegar. */
function conColeccion(lista: Pieza[], coleccion: Coleccion): Product[] {
  return lista.map((p) => ({ ...p, coleccion }));
}

export const PRODUCTS: Product[] = [
  ...conColeccion(BASICAS, "basicas"),
  ...conColeccion(EXPEDICION, "expedicion"),
  ...conColeccion(FUNDADORES, "fundadores"),
].map((p) => ({
  ...p,
  price: p.price ?? PRECIO[p.category],
}));

/** Las piezas de una colección, en el orden del catálogo. */
export function porColeccion(key: Coleccion): Product[] {
  return PRODUCTS.filter((p) => p.coleccion === key);
}

/** Formato de peso colombiano sin decimales: 50000 → "$ 50.000". */
export function formatCOP(valor: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(valor);
}

/* ─── Helpers ─── */
export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

/* ─── "Combina con" ──────────────────────────────────────────────
   Antes era `PRODUCTS.filter(...).slice(0, 3)`: las TRES PRIMERAS del
   catálogo, iguales en las 17 fichas. Parecía una recomendación y no lo era. */

/** Número estable a partir de un texto. Estable importa: si esto fuera
 *  aleatorio, el servidor y el navegador pintarían fichas distintas y React
 *  reventaría la hidratación. */
function semilla(texto: string): number {
  let h = 0;
  for (let i = 0; i < texto.length; i++) h = (h * 31 + texto.charCodeAt(i)) >>> 0;
  return h;
}

/**
 * Qué enseñar debajo de una ficha.
 *
 * Dos reglas, las dos de vitrina y no de código:
 *   · una estampada pide BÁSICAS que la dejen respirar, y una básica pide el
 *     gráfico que le falta — así que primero va la categoría contraria;
 *   · no se repite color, porque tres piezas del mismo tono no se leen como
 *     conjunto sino como error.
 * La rotación por slug es lo que hace que cada ficha recomiende algo distinto.
 */
export function relacionados(product: Product, n = 3): Product[] {
  const otros = PRODUCTS.filter((p) => p.slug !== product.slug && inStock(p));
  const contrarias = otros.filter((p) => p.category !== product.category);
  const iguales = otros.filter((p) => p.category === product.category);
  if (!contrarias.length && !iguales.length) return [];

  // La rotación va DENTRO de cada grupo, no sobre la lista entera: rotando el
  // concatenado, el corte caía a media lista de estampadas y las básicas se
  // iban al final, así que una estampada terminaba recomendando tres
  // estampadas — justo lo contrario de lo que dice la regla de arriba.
  const rotar = (lista: Product[]) => {
    if (lista.length < 2) return lista;
    const g = semilla(product.slug) % lista.length;
    return [...lista.slice(g), ...lista.slice(0, g)];
  };
  const girado = [...rotar(contrarias), ...rotar(iguales)];

  const out: Product[] = [];
  const colores = new Set([product.color]);
  for (const p of girado) {
    if (out.length >= n) break;
    if (colores.has(p.color)) continue;
    colores.add(p.color);
    out.push(p);
  }
  // Si lo del color dejó corto (catálogo chico o monocromo), se completa.
  for (const p of girado) {
    if (out.length >= n) break;
    if (!out.includes(p)) out.push(p);
  }
  return out;
}

/** Piezas destacadas para el home: una básica y las dos gráficas más fuertes.
 *  OJO: `getFeatured` descarta en silencio el slug que no encuentre. Aquí vivía
 *  "base-ocre-dorado", que dejó de existir al renombrar las básicas el 22-sep,
 *  y el home llevaba un mes mostrando DOS piezas en vez de tres sin avisar. */
export const FEATURED_SLUGS = ["hanya-mask", "base-arena-paramo", "our-lady-doom"];

export function getFeatured(): Product[] {
  return FEATURED_SLUGS.map((s) => getProduct(s)).filter((p): p is Product => Boolean(p));
}

/**
 * Filtra por género respetando lo unisex: elegir "hombre" o "mujer" también
 * muestra las piezas unisex. "unisex" muestra todo.
 */
export function matchesGenero(product: Product, genero: Genero | "all"): boolean {
  if (genero === "all" || genero === "unisex") return true;
  return product.genero === genero || product.genero === "unisex";
}

export function inStock(product: Product): boolean {
  return product.sizes.some((s) => s.stock > 0);
}

/* ─── Stock real (editable desde /admin) ─────────────────────────────
   El catálogo (nombres, fotos, copy) vive en este archivo porque cambia
   poco y se versiona con el código. El TALLAJE cambia todos los días y no
   puede depender de un despliegue: vive en la tabla `product_stock` de
   Supabase y se pega acá arriba en tiempo de petición.
   Mientras una pieza no tenga filas en la tabla, se queda con el tallaje
   provisional de `TALLAS_STD` — así nada se rompe antes de cargar el
   inventario.                                                          */

/** Todas las tallas que puede tener una pieza, en orden de exhibición. */
export const TALLAS_POSIBLES = ["S", "M", "L", "XL", "2XL", "3XL"] as const;

/** `{ [product_id]: { [talla]: unidades } }` — lo que devuelve `getStockMap()`. */
export type StockMap = Record<string, Record<string, number>>;

/**
 * Pega el stock real sobre una pieza. Una talla que NO está en el mapa no
 * existe para esa pieza (no se muestra); una talla en 0 existe pero está
 * agotada (se muestra tachada). Sin filas → tallaje provisional.
 */
export function withStock(product: Product, map?: StockMap | null): Product {
  const real = map?.[product.id];
  if (!real) return product;
  const sizes: SizeStock[] = TALLAS_POSIBLES.filter((t) => t in real).map((t) => ({
    size: t,
    stock: Math.max(0, Math.trunc(real[t]) || 0),
  }));
  // Una fila vacía no debería dejar la pieza sin tallas: mejor lo provisional.
  return sizes.length ? { ...product, sizes } : product;
}

export function withStockAll(list: Product[], map?: StockMap | null): Product[] {
  return map ? list.map((p) => withStock(p, map)) : list;
}

export function totalStock(product: Product): number {
  return product.sizes.reduce((a, s) => a + s.stock, 0);
}

/** Colores que existen de verdad en el catálogo, en el orden de COLORES. */
export function coloresEnUso(): ColorDef[] {
  const usados = new Set(PRODUCTS.map((p) => p.color));
  return COLORES.filter((c) => usados.has(c.key));
}

/* ─── Cálculo del carrito ─────────────────────────────────────
   Las promos por combo (3 básicas o 2 estampadas por $140.000) se retiraron el
   22-sep por decisión de Juan: cada pieza se cobra a su precio. Queda esta
   función igual porque el carrito, la ficha y el mensaje de WhatsApp piden el
   total por el mismo sitio; si algún día vuelven los combos, el descuento entra
   acá y nadie más se entera. */
export interface PricedLine {
  category: Category;
  price: number;
  qty: number;
}

export interface CartTotals {
  subtotal: number;
  total: number;
}

export function cartTotals(lineas: PricedLine[]): CartTotals {
  const subtotal = lineas.reduce((n, l) => n + l.price * l.qty, 0);
  return { subtotal, total: subtotal };
}
