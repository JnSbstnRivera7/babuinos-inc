import type { MetadataRoute } from "next";
import { PRODUCTS } from "@/lib/products";

const BASE = "https://babuinos-inc.vercel.app";

/**
 * Sin sitemap, Google no sabía que existían las 15 fichas de producto.
 * Se sirve en /sitemap.xml y lo referencia robots.ts.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const estaticas: MetadataRoute.Sitemap = [
    { url: BASE, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/tienda`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/tienda?tipo=basica`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/tienda?tipo=estampada`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/nosotros`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/club`, changeFrequency: "monthly", priority: 0.6 },
  ];

  const fichas: MetadataRoute.Sitemap = PRODUCTS.map((p) => ({
    url: `${BASE}/producto/${p.slug}`,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...estaticas, ...fichas];
}
