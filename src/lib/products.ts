/* ════════════════════════════════════════════════════════════
   BABUINOS INC — Catálogo (Colección Fundadores 2026)
   Sin precios por ahora. Fotos e iconografía reales.
   ════════════════════════════════════════════════════════════ */

export type EditionKey = "original" | "safari" | "midnight" | "regal" | "nautical" | "desert";

export interface Edition {
  key: EditionKey;
  name: string;
  tagline: string;
  accent: string; // for labels/UI
}

export const EDITIONS: Edition[] = [
  { key: "original", name: "Original", tagline: "Teal / Dorado", accent: "#00736c" },
  { key: "safari", name: "Vintage Safari", tagline: "Oliva / Crema", accent: "#4a5c2a" },
  { key: "midnight", name: "Midnight", tagline: "Gris / Plata", accent: "#6b7280" },
  { key: "regal", name: "Regal Velvet", tagline: "Burdeos / Oro", accent: "#6b1c2f" },
  { key: "nautical", name: "Nautical", tagline: "Azul / Mostaza", accent: "#1b2f5c" },
  { key: "desert", name: "Desert Gold", tagline: "Arena / Marrón", accent: "#cda214" },
];

/** Four editions arranged in the X identity layout (matches brand mockup). */
export const FEATURED_EDITIONS: EditionKey[] = ["original", "safari", "midnight", "regal"];

export type Category = "esencial" | "grafica";

export interface Product {
  id: string;
  name: string;
  tag: string;
  category: Category;
  edition: EditionKey;
  desc: string;
  image: string;
  colorway: string;
  sizes: string[];
  badge?: "new" | "hot";
}

export const PRODUCTS: Product[] = [
  {
    id: "lila-manada",
    name: "Lila Manada",
    tag: "Oversize · Esencial",
    category: "esencial",
    edition: "original",
    desc: "Algodón pesado en lila polvo con el lettering Babuinos a la espalda. La pieza que abrió la manada.",
    image: "/brand/products/lilac.webp",
    colorway: "Lila Polvo",
    sizes: ["S", "M", "L", "XL"],
    badge: "new",
  },
  {
    id: "marfil-expedicion",
    name: "Marfil Expedición",
    tag: "Oversize · Gráfica",
    category: "grafica",
    edition: "desert",
    desc: "Oversize marfil, estampado editorial al dorso. Minimal al frente, declaración atrás.",
    image: "/brand/products/white.webp",
    colorway: "Marfil",
    sizes: ["S", "M", "L", "XL", "2XL"],
  },
  {
    id: "negro-tono",
    name: "Negro Tono",
    tag: "Oversize · Esencial",
    category: "esencial",
    edition: "midnight",
    desc: "Negro sobre negro. Estampado tonal para los que hablan bajo y pegan duro.",
    image: "/brand/products/black-tonal.webp",
    colorway: "Negro",
    sizes: ["S", "M", "L", "XL", "2XL"],
    badge: "hot",
  },
  {
    id: "gris-heritage",
    name: "Gris Heritage",
    tag: "Oversize · Gráfica",
    category: "grafica",
    edition: "safari",
    desc: "Gris jaspe con gráfico dorado de gran formato a la espalda. Heritage puro de la selva.",
    image: "/brand/products/grey-gold.webp",
    colorway: "Gris Jaspe",
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: "negro-oro",
    name: "Negro Oro",
    tag: "Oversize · Gráfica",
    category: "grafica",
    edition: "regal",
    desc: "Negro absoluto con gráfico dorado statement. La joya de la corona de los Fundadores.",
    image: "/brand/products/black-gold.webp",
    colorway: "Negro / Oro",
    sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
    badge: "hot",
  },
];

export const CATEGORIES: { key: Category | "all"; label: string }[] = [
  { key: "all", label: "Todo" },
  { key: "esencial", label: "Esenciales" },
  { key: "grafica", label: "Gráficas" },
];

export function getEdition(key: EditionKey): Edition {
  return EDITIONS.find((e) => e.key === key) ?? EDITIONS[0];
}
