/* ════════════════════════════════════════════════════════════
   BABUINOS INC — Catálogo
   Fuente única de verdad: productos, categorías, géneros, colores.

   Dos líneas:
     · Básicas          — algodón pesado sin estampado (la paleta de la casa)
     · Colección Fundadores — las estampadas

   Sin precios por ahora (se coordinan por WhatsApp).
   ⚠️ El stock es PROVISIONAL hasta que Juan pase el inventario real.
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
  { key: "teal", label: "Teal", hex: "#00736c" },
  { key: "ocre", label: "Ocre", hex: "#cda214" },
  { key: "pardo", label: "Pardo", hex: "#654321" },
  { key: "rojo", label: "Rojo", hex: "#c8102e" },
  { key: "lila", label: "Lila", hex: "#c3a9e6" },
  { key: "verde", label: "Verde", hex: "#1f3d2b" },
  { key: "navy", label: "Azul", hex: "#1b2f5c" },
  { key: "celeste", label: "Celeste", hex: "#a9cce3" },
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
   * (hoy solo Guns & Roses: oversize en hombre, crop en mujer). Si existe, la
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
 * Tallaje provisional, igual para toda la colección hasta tener el inventario
 * real. Cambiar acá se refleja en las 15 piezas.
 */
const TALLAS_STD: SizeStock[] = [
  { size: "S", stock: 6 },
  { size: "M", stock: 8 },
  { size: "L", stock: 8 },
  { size: "XL", stock: 6 },
  { size: "2XL", stock: 4 },
];

const ALGODON = "100% algodón 220 g/m²";

/* ════════════════ BÁSICAS ════════════════
   Sin estampado. Solo el babuino troquelado en el ruedo y BABUINOS en la nuca.
   Los cinco colores son la paleta oficial de la marca.                        */

const BASICAS: Product[] = [
  {
    id: "base-teal-expedicion",
    slug: "base-teal-expedicion",
    name: "Teal Expedición",
    tag: "Oversize · Básica",
    category: "basica",
    genero: "unisex",
    edition: "original",
    color: "teal",
    desc: "Teal profundo, cero estampado. El babuino en el ruedo y BABUINOS en la nuca: lo demás lo pones tú.",
    descLong:
      "El verde expedición de la casa en algodón pesado, sin gráfico que compita. Solo el babuino troquelado en el ruedo y el sello BABUINOS en la nuca. Caída oversize para usarla sola o debajo de todo.",
    fit: "Oversize",
    composicion: ALGODON,
    image: "/brand/products/base-teal-expedicion-frente.webp",
    images: flatSet("base-teal-expedicion"),
    models: modelSet("base-teal-expedicion"),
    colorway: "Teal Expedición",
    sizes: TALLAS_STD,
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
      "Negro tinta en algodón pesado de 220 gramos. Sin estampado: el babuino en el ruedo y BABUINOS en la nuca son toda la declaración. La base de cualquier pinta de la manada.",
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
    id: "base-ocre-dorado",
    slug: "base-ocre-dorado",
    name: "Ocre Dorado",
    tag: "Oversize · Básica",
    category: "basica",
    genero: "unisex",
    edition: "desert",
    color: "ocre",
    desc: "Ocre dorado. La única básica que grita sin necesitar estampado.",
    descLong:
      "El dorado de la casa, plano y saturado, en algodón pesado. Sin print: el color hace todo el trabajo. Babuino troquelado en el ruedo y BABUINOS en la nuca.",
    fit: "Oversize",
    composicion: ALGODON,
    image: "/brand/products/base-ocre-dorado-frente.webp",
    images: flatSet("base-ocre-dorado"),
    models: modelSet("base-ocre-dorado"),
    colorway: "Ocre Dorado",
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
];

/* ════════════════ COLECCIÓN FUNDADORES ════════════════
   Las estampadas. "SG" que aparece en varias es el monograma de SOMOS GRANDES. */

const FUNDADORES: Product[] = [
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
  {
    id: "guns-roses-red",
    slug: "guns-roses-red",
    name: "Guns & Roses Red",
    tag: "Crop en mujer · Estampada",
    category: "estampada",
    genero: "unisex",
    edition: "regal",
    color: "rojo",
    desc: "Roja intensa con revólver y rosas a la espalda. En la línea de mujer va en corte crop.",
    descLong:
      "Rojo saturado con el revólver y las rosas a la espalda sobre el DON'T CRY, y el monograma SG bordado tono sobre tono al pecho. En la línea de mujer va en corte crop; en hombre, oversize.",
    fit: "Oversize en hombre · Crop en mujer",
    composicion: ALGODON,
    image: "/brand/products/guns-roses-red-frente.webp",
    images: flatSet("guns-roses-red"),
    // Dos cortes: oversize (hombre) y crop (mujer). La galería muestra el que
    // corresponda al toggle H/M.
    imagesByGender: {
      hombre: flatSet("guns-roses-red-h"),
      mujer: flatSet("guns-roses-red-m"),
    },
    models: modelSet("guns-roses-red"),
    colorway: "Rojo",
    sizes: TALLAS_STD,
    badge: "new",
  },
  {
    id: "the-mills",
    slug: "the-mills",
    name: "The Mills",
    tag: "Oversize · Estampada",
    category: "estampada",
    genero: "unisex",
    edition: "safari",
    color: "crema",
    desc: "Crema con la banda a la espalda y una verdad chiquita al frente: el amor es fácil, las relaciones no.",
    descLong:
      "Algodón crema con el retrato de la banda a la espalda en duotono rojo y negro bajo el lettering THE MILLS. Al frente, en letra pequeña: el amor es fácil, las relaciones no. Para los que llevan la música puesta.",
    fit: "Oversize",
    composicion: ALGODON,
    image: "/brand/products/the-mills-frente.webp",
    images: flatSet("the-mills"),
    models: modelSet("the-mills"),
    colorway: "Crema",
    sizes: TALLAS_STD,
  },
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
    id: "rootwailer",
    slug: "rootwailer",
    name: "Rootwailer",
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
    image: "/brand/products/rootwailer-frente.webp",
    images: flatSet("rootwailer"),
    models: modelSet("rootwailer"),
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
    id: "offline-pleasure",
    slug: "offline-pleasure",
    name: "Offline Pleasure",
    tag: "Oversize · Estampada",
    category: "estampada",
    genero: "unisex",
    edition: "safari",
    color: "blanco",
    desc: "Blanca minimal: bloque tipográfico atrás y el mismo sello en pequeño al frente. Cero ilustración.",
    descLong:
      "Blanca de trabajo tipográfico puro: el bloque MTLS.CORP · Offline Pleasure · HONEST · DESIRE a la espalda y el mismo sello en pequeño al frente. Babuino troquelado en el ruedo. Para los que prefieren desconectarse.",
    fit: "Oversize",
    composicion: ALGODON,
    image: "/brand/products/offline-pleasure-frente.webp",
    images: flatSet("offline-pleasure"),
    models: modelSet("offline-pleasure"),
    colorway: "Blanco",
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
    id: "green-afro-tiki",
    slug: "green-afro-tiki",
    name: "Green Afro Tiki",
    tag: "Oversize · Estampada",
    category: "estampada",
    genero: "unisex",
    edition: "original",
    color: "celeste",
    desc: "Celeste con un tótem tiki verde al costado y la figura afro. 'Beatus' al frente, BABUINOS en la nuca.",
    descLong:
      "Celeste suave con una ilustración tiki en verde teal bajando por el costado: máscaras tótem y una figura afro entre las llamas. Al frente, 'Beatus' en script; en la nuca, el sello BABUINOS. La más fresca de la colección.",
    fit: "Oversize",
    composicion: ALGODON,
    image: "/brand/products/green-afro-tiki-frente.webp",
    images: flatSet("green-afro-tiki"),
    models: modelSet("green-afro-tiki"),
    colorway: "Celeste / Tiki Verde",
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
    desc: "Negra con el hada madrina a toda la espalda bajo el lettering Eternal Beauty. 'You Want Something' al frente.",
    descLong:
      "Negro absoluto con una ilustración de hada madrina de alas de mariposa a toda la espalda, bajo el lettering gótico Eternal Beauty y el remate Chasing Dreams. Al frente, 'You Want Something' en script fino con rosas; babuino troquelado en el ruedo y BABUINOS en la nuca.",
    fit: "Oversize",
    composicion: ALGODON,
    image: "/brand/products/eternal-beauty-frente.webp",
    images: flatSet("eternal-beauty"),
    models: modelSet("eternal-beauty"),
    colorway: "Negro",
    sizes: TALLAS_STD,
    badge: "new",
  },
];

export const PRODUCTS: Product[] = [...BASICAS, ...FUNDADORES];

/* ─── Helpers ─── */
export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

/** Piezas destacadas para el home: una básica y las dos gráficas más fuertes. */
export const FEATURED_SLUGS = ["wear-your-attitude", "base-ocre-dorado", "asian-tengu-mask"];

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

export function totalStock(product: Product): number {
  return product.sizes.reduce((a, s) => a + s.stock, 0);
}

/** Colores que existen de verdad en el catálogo, en el orden de COLORES. */
export function coloresEnUso(): ColorDef[] {
  const usados = new Set(PRODUCTS.map((p) => p.color));
  return COLORES.filter((c) => usados.has(c.key));
}
