/* ════════════════════════════════════════════════════════════
   BABUINOS INC — Catálogo (Colección Fundadores 2026)
   Fuente única de verdad: productos, categorías, géneros y territorios.
   Sin precios por ahora (se coordinan por WhatsApp).
   ════════════════════════════════════════════════════════════ */

/* ─── Territorios (antes "ediciones" / colorways) ─── */
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
  { key: "midnight", name: "Midnight", tagline: "Gris / Plata", accent: "#6b7280" },
  { key: "regal", name: "Regal Velvet", tagline: "Burdeos / Oro", accent: "#6b1c2f" },
  { key: "nautical", name: "Nautical", tagline: "Azul / Mostaza", accent: "#1b2f5c" },
  { key: "desert", name: "Desert Gold", tagline: "Arena / Marrón", accent: "#cda214" },
];

export function getEdition(key: EditionKey): Edition {
  return EDITIONS.find((e) => e.key === key) ?? EDITIONS[0];
}

/* ─── Género (línea) — con íconos de marca: gorra = hombre, moño = mujer ─── */
export type Genero = "hombre" | "mujer" | "unisex";

export interface GeneroDef {
  key: Genero;
  label: string;
  /** Accesorio del babuino que representa la línea (placeholder hasta tener los íconos reales). */
  icon: "cap" | "bow" | "none";
  blurb: string;
}

export const GENEROS: GeneroDef[] = [
  { key: "hombre", label: "Hombre", icon: "cap", blurb: "Quien marca su territorio." },
  { key: "mujer", label: "Mujer", icon: "bow", blurb: "Quien lo domina." },
  { key: "unisex", label: "Unisex", icon: "none", blurb: "Sin etiquetas. Para toda la manada." },
];

/* ─── Categoría de prenda (top-level) — antes duplicada en Navbar y Catalog ─── */
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

/* ─── Sub-tipo dentro de camisas ─── */
export type Category = "esencial" | "grafica";

export const CATEGORIES: { key: Category | "all"; label: string }[] = [
  { key: "all", label: "Todo" },
  { key: "esencial", label: "Esenciales" },
  { key: "grafica", label: "Gráficas" },
];

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

/** Genera las rutas de las fotos de modelo a partir del slug del producto. */
function modelSet(slug: string): ModelGallery {
  const shots = (g: "hombre" | "mujer"): ModelShots => ({
    frontal: `/brand/models/${slug}/${g}-frontal.webp`,
    lateral: `/brand/models/${slug}/${g}-lateral.webp`,
    espalda: `/brand/models/${slug}/${g}-espalda.webp`,
  });
  return { hombre: shots("hombre"), mujer: shots("mujer") };
}

/* ─── Producto ─── */
export interface SizeStock {
  size: string;
  stock: number; // 0 = agotado
}

export type Badge = "new" | "hot" | "last";

export interface Product {
  id: string;
  slug: string; // usado en /producto/[slug]
  name: string;
  tag: string;
  category: Category;
  genero: Genero;
  edition: EditionKey; // territorio
  desc: string;
  descLong?: string;
  fit?: string;
  composicion?: string;
  image: string; // foto principal (card, carrito, thumbnails)
  images: string[]; // galería de la prenda sola (flat lay) para la PDP
  models?: ModelGallery; // fotos con la camisa puesta, por género (toggle en la PDP)
  colorway: string;
  sizes: SizeStock[];
  price?: number; // opcional (sigue coordinándose por WhatsApp)
  badge?: Badge;
}

export const PRODUCTS: Product[] = [
  {
    id: "lila-manada",
    slug: "lila-manada",
    name: "Lila Manada",
    tag: "Oversize · Esencial",
    category: "esencial",
    genero: "mujer",
    edition: "original",
    desc: "Algodón pesado en lila polvo con el lettering Babuinos a la espalda. La pieza que abrió la manada.",
    descLong:
      "La primera de la manada. Algodón pesado en lila polvo, caída oversize y el lettering Babuinos bordado a la espalda. Minimal al frente, declaración atrás.",
    fit: "Oversize",
    composicion: "100% algodón 220 g/m²",
    image: "/brand/products/lilac.webp",
    images: ["/brand/products/lilac.webp"],
    models: modelSet("lila-manada"),
    colorway: "Lila Polvo",
    sizes: [
      { size: "S", stock: 5 },
      { size: "M", stock: 8 },
      { size: "L", stock: 6 },
      { size: "XL", stock: 3 },
    ],
    badge: "new",
  },
  {
    id: "marfil-expedicion",
    slug: "marfil-expedicion",
    name: "Marfil Expedición",
    tag: "Oversize · Gráfica",
    category: "grafica",
    genero: "unisex",
    edition: "desert",
    desc: "Oversize marfil, estampado editorial al dorso. Minimal al frente, declaración atrás.",
    descLong:
      "Marfil sobre algodón pesado con un estampado editorial de gran formato a la espalda. Para los que exploran sin hacer ruido.",
    fit: "Oversize",
    composicion: "100% algodón 220 g/m²",
    image: "/brand/products/white.webp",
    images: ["/brand/products/white.webp"],
    models: modelSet("marfil-expedicion"),
    colorway: "Marfil",
    sizes: [
      { size: "S", stock: 4 },
      { size: "M", stock: 6 },
      { size: "L", stock: 5 },
      { size: "XL", stock: 4 },
      { size: "2XL", stock: 2 },
    ],
  },
  {
    id: "negro-tono",
    slug: "negro-tono",
    name: "Negro Tono",
    tag: "Oversize · Esencial",
    category: "esencial",
    genero: "unisex",
    edition: "midnight",
    desc: "Negro sobre negro. Estampado tonal para los que hablan bajo y pegan duro.",
    descLong:
      "Negro absoluto con estampado tonal negro sobre negro. Discreto de lejos, brutal de cerca. Para los que hablan bajo y pegan duro.",
    fit: "Oversize",
    composicion: "100% algodón 220 g/m²",
    image: "/brand/products/black-tonal.webp",
    images: ["/brand/products/black-tonal.webp"],
    models: modelSet("negro-tono"),
    colorway: "Negro",
    sizes: [
      { size: "S", stock: 0 },
      { size: "M", stock: 7 },
      { size: "L", stock: 9 },
      { size: "XL", stock: 5 },
      { size: "2XL", stock: 3 },
    ],
    badge: "hot",
  },
  {
    id: "gris-heritage",
    slug: "gris-heritage",
    name: "Gris Heritage",
    tag: "Oversize · Gráfica",
    category: "grafica",
    genero: "hombre",
    edition: "safari",
    desc: "Gris jaspe con gráfico dorado de gran formato a la espalda. Heritage puro de la selva.",
    descLong:
      "Gris jaspe con un gráfico dorado de gran formato a la espalda. Heritage puro de la selva de cemento, en tela pesada que dura.",
    fit: "Oversize",
    composicion: "100% algodón 220 g/m²",
    image: "/brand/products/grey-gold.webp",
    images: ["/brand/products/grey-gold.webp"],
    models: modelSet("gris-heritage"),
    colorway: "Gris Jaspe",
    sizes: [
      { size: "S", stock: 4 },
      { size: "M", stock: 5 },
      { size: "L", stock: 6 },
      { size: "XL", stock: 2 },
    ],
  },
  {
    id: "negro-oro",
    slug: "negro-oro",
    name: "Negro Oro",
    tag: "Oversize · Gráfica",
    category: "grafica",
    genero: "unisex",
    edition: "regal",
    desc: "Negro absoluto con gráfico dorado statement. La joya de la corona de los Fundadores.",
    descLong:
      "Negro absoluto con un gráfico dorado statement a la espalda. La joya de la corona de la Colección Fundadores.",
    fit: "Oversize",
    composicion: "100% algodón 220 g/m²",
    image: "/brand/products/black-gold.webp",
    images: ["/brand/products/black-gold.webp"],
    models: modelSet("negro-oro"),
    colorway: "Negro / Oro",
    sizes: [
      { size: "S", stock: 3 },
      { size: "M", stock: 6 },
      { size: "L", stock: 5 },
      { size: "XL", stock: 4 },
      { size: "2XL", stock: 2 },
      { size: "3XL", stock: 0 },
    ],
    badge: "hot",
  },
];

/* ─── Helpers ─── */
export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

/** Piezas destacadas para el home (subconjunto curado). */
export const FEATURED_SLUGS = ["negro-oro", "lila-manada", "gris-heritage"];

export function getFeatured(): Product[] {
  return FEATURED_SLUGS.map((s) => getProduct(s)).filter((p): p is Product => Boolean(p));
}

/**
 * Filtra por género respetando lo unisex: elegir "hombre" o "mujer" también
 * muestra las piezas unisex (encajan en ambas líneas). "unisex" muestra todo.
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
