import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Shell } from "@/components/layout/Shell";
import { ProductDetail } from "@/components/producto/ProductDetail";
import { PRODUCTS, getProduct, inStock } from "@/lib/products";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: "Pieza no encontrada — Babuinos Inc" };
  return {
    title: `${product.name} — Babuinos Inc`,
    description: product.descLong ?? product.desc,
  };
}

const BASE = "https://babuinos-inc.vercel.app";

export default async function ProductoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  /**
   * schema.org/Product: es lo que hace que Google muestre foto, marca, precio y
   * disponibilidad en los resultados.
   */
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.descLong ?? product.desc,
    sku: product.slug,
    color: product.colorway,
    material: product.composicion,
    brand: { "@type": "Brand", name: "Babuinos Inc" },
    image: [product.models?.hombre?.frontal, ...product.images]
      .filter(Boolean)
      .map((src) => `${BASE}${src}`),
    offers: {
      "@type": "Offer",
      url: `${BASE}/producto/${product.slug}`,
      ...(typeof product.price === "number"
        ? { price: product.price, priceCurrency: "COP" }
        : {}),
      availability: inStock(product)
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@type": "Organization", name: "Babuinos Inc" },
    },
    size: product.sizes.filter((s) => s.stock > 0).map((s) => s.size),
  };

  return (
    <Shell>
      <script
        type="application/ld+json"
        // Contenido propio del catálogo, no entrada de usuario.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetail product={product} />
    </Shell>
  );
}
