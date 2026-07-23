"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  getEdition,
  inStock,
  PRODUCTS,
  type Product,
} from "@/lib/products";
import { ProductCard } from "@/components/producto/ProductCard";
import { BaboonMark } from "@/components/ui/BaboonMark";
import { useCart } from "@/lib/store";
import { useWishlist } from "@/lib/wishlist";
import { useToast } from "@/lib/toast";
import { buildProductMessage, buildWaLink } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";
import { IconWhatsApp, IconPlus, IconLeaf, IconHeart } from "@/components/ui/Icons";
import { GeneroMark } from "@/components/ui/GeneroMark";

const SIZE_GUIDE = [
  { size: "S", pecho: 56, largo: 70, hombro: 52 },
  { size: "M", pecho: 58, largo: 72, hombro: 54 },
  { size: "L", pecho: 60, largo: 74, hombro: 56 },
  { size: "XL", pecho: 62, largo: 76, hombro: 58 },
  { size: "2XL", pecho: 64, largo: 78, hombro: 60 },
  { size: "3XL", pecho: 66, largo: 80, hombro: 62 },
];

export function ProductDetail({ product }: { product: Product }) {
  const add = useCart((s) => s.add);
  const openCart = useCart((s) => s.open);
  const showToast = useToast((s) => s.show);
  const saved = useWishlist((s) => s.ids.includes(product.slug));
  const toggleWish = useWishlist((s) => s.toggle);
  const [size, setSize] = useState("");
  const [active, setActive] = useState(0);
  const [guide, setGuide] = useState(false);

  const edition = getEdition(product.edition);
  const available = inStock(product);
  const gallery = product.images.length ? product.images : [product.image];
  const related = PRODUCTS.filter((p) => p.slug !== product.slug).slice(0, 3);

  function requireSize(): boolean {
    if (!size) {
      showToast("Elige una talla primero");
      return false;
    }
    return true;
  }

  function addToBag() {
    if (!available || !requireSize()) return;
    add(product, size);
    showToast(`${product.name} · ${size} a la mochila`);
    openCart();
  }

  function buyWhatsApp() {
    if (!available || !requireSize()) return;
    const num = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
    if (!num) {
      addToBag();
      return;
    }
    const msg = buildProductMessage(product.name, product.colorway, size);
    window.open(buildWaLink(num, msg), "_blank", "noopener,noreferrer");
  }

  return (
    <div className="mx-auto max-w-6xl px-5 pb-24 pt-8 md:px-8 md:pt-12">
      {/* breadcrumb */}
      <nav className="font-mono mb-8 flex items-center gap-2 text-[0.62rem] tracking-[0.1em] text-cream/45 uppercase">
        <Link href="/" className="hover:text-cream">Inicio</Link>
        <span>/</span>
        <Link href="/tienda" className="hover:text-cream">Tienda</Link>
        <span>/</span>
        <span className="text-cream/80">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* galería */}
        <div className="flex flex-col-reverse gap-4 sm:flex-row">
          {gallery.length > 1 && (
            <div className="flex gap-3 sm:flex-col">
              {gallery.map((src, i) => (
                <button
                  key={src + i}
                  onClick={() => setActive(i)}
                  aria-label={`Ver foto ${i + 1}`}
                  className={cn(
                    "relative h-20 w-16 shrink-0 overflow-hidden rounded-lg border bg-[#eceae6] transition",
                    active === i ? "border-[var(--accent)]" : "border-transparent opacity-70 hover:opacity-100",
                  )}
                >
                  <Image src={src} alt="" fill sizes="64px" className="object-contain p-1" />
                </button>
              ))}
            </div>
          )}
          <div className="relative aspect-[4/5] flex-1 overflow-hidden rounded-2xl bg-[#eceae6]">
            <Image
              src={gallery[active]}
              alt={`${product.name} — ${product.colorway}`}
              fill
              priority
              sizes="(max-width:1024px) 90vw, 45vw"
              className="object-contain p-4"
            />
            {!available && (
              <span className="absolute left-5 top-5 rounded-full bg-ink px-4 py-1.5 font-mono text-[0.6rem] font-bold tracking-[0.16em] text-cream uppercase">
                Agotado
              </span>
            )}
          </div>
        </div>

        {/* compra */}
        <div className="flex flex-col">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[0.62rem] font-bold tracking-[0.16em] text-[var(--accent)] uppercase">
              {product.tag}
            </span>
            <span className="inline-flex items-center gap-1.5 font-mono text-[0.58rem] font-bold tracking-[0.12em] text-cream/55 uppercase">
              <GeneroMark genero={product.genero} color="currentColor" className="h-4 w-5" />
              {product.genero}
            </span>
          </div>

          <h1 className="font-condensed mt-2 text-[clamp(2.4rem,6vw,4rem)] leading-[0.95] text-cream">
            {product.name}
          </h1>

          <div className="mt-3 flex items-center gap-2 text-cream/70">
            <BaboonMark color={edition.accent} className="h-5 w-6" />
            <span className="text-[0.85rem]">
              {product.colorway} · Territorio {edition.name}
            </span>
          </div>

          <p className="mt-5 max-w-prose text-cream/70">{product.descLong ?? product.desc}</p>

          {/* precio / whatsapp */}
          <p className="font-mono mt-6 text-[0.78rem] text-cream/55">
            {typeof product.price === "number"
              ? new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(product.price)
              : "Precio, pago y envío se coordinan por WhatsApp."}
          </p>

          {/* tallas */}
          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between">
              <span className="font-mono text-[0.62rem] font-bold tracking-[0.12em] text-cream/60 uppercase">
                Talla
              </span>
              <button
                onClick={() => setGuide(true)}
                className="font-mono text-[0.62rem] font-bold tracking-[0.08em] text-[var(--accent)] uppercase underline-offset-4 hover:underline"
              >
                Guía de tallas
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => {
                const soldOut = s.stock === 0;
                return (
                  <button
                    key={s.size}
                    disabled={soldOut}
                    onClick={() => setSize(s.size)}
                    aria-pressed={size === s.size}
                    className={cn(
                      "font-mono grid h-11 min-w-11 place-items-center rounded-md border px-3 text-[0.8rem] font-bold transition",
                      soldOut
                        ? "cursor-not-allowed border-cream/10 text-cream/25 line-through"
                        : size === s.size
                          ? "border-cream bg-cream text-ink"
                          : "border-cream/25 text-cream/80 hover:border-cream",
                    )}
                  >
                    {s.size}
                  </button>
                );
              })}
            </div>
            {size && (
              <p className="font-mono mt-2 text-[0.62rem] tracking-[0.08em] text-cream/45 uppercase">
                {(product.sizes.find((s) => s.size === size)?.stock ?? 0) <= 3
                  ? "Últimas unidades en esta talla"
                  : "Disponible"}
              </p>
            )}
          </div>

          {/* CTAs */}
          <div className="mt-7 flex flex-col gap-3">
            <button
              onClick={buyWhatsApp}
              disabled={!available}
              className="font-mono flex w-full items-center justify-center gap-2 rounded-md bg-[#25D366] px-6 py-4 text-[0.8rem] font-bold tracking-[0.1em] text-white uppercase shadow-[0_4px_18px_rgba(37,211,102,.32)] transition hover:brightness-95 disabled:cursor-not-allowed disabled:bg-cream/10 disabled:text-cream/35 disabled:shadow-none"
            >
              <IconWhatsApp className="h-5 w-5" /> Comprar por WhatsApp
            </button>
            <div className="flex gap-3">
              <button
                onClick={addToBag}
                disabled={!available}
                className="font-mono flex flex-1 items-center justify-center gap-2 rounded-md border border-cream/25 px-6 py-4 text-[0.8rem] font-bold tracking-[0.1em] text-cream uppercase transition hover:border-cream hover:bg-cream/5 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <IconPlus className="h-4 w-4" /> Agregar a la mochila
              </button>
              <button
                onClick={() => toggleWish(product.slug)}
                aria-label={saved ? "Quitar de favoritos" : "Guardar en favoritos"}
                aria-pressed={saved}
                className={cn(
                  "grid w-14 shrink-0 place-items-center rounded-md border transition",
                  saved ? "border-[#c0392b] bg-[#c0392b]/15" : "border-cream/25 text-cream hover:border-cream hover:bg-cream/5",
                )}
              >
                <IconHeart
                  className="h-5 w-5"
                  style={{ color: saved ? "#e05a48" : undefined }}
                  fill={saved ? "currentColor" : "none"}
                />
              </button>
            </div>
          </div>

          <div className="mt-5 flex items-center gap-2 text-cream/55">
            <IconLeaf className="h-4 w-4 text-teal-light" />
            <span className="text-[0.78rem]">Algodón sostenible · Envío a todo el país</span>
          </div>

          {/* acordeones */}
          <div className="mt-8 divide-y divide-cream/10 border-y border-cream/10">
            <Accordion title="Detalles">
              <ul className="space-y-1.5">
                <li>Fit: {product.fit ?? "Oversize"}</li>
                <li>Material: {product.composicion ?? "100% algodón 220 g/m²"}</li>
                <li>Colorway: {product.colorway}</li>
                <li>Territorio: {edition.name} ({edition.tagline})</li>
              </ul>
            </Accordion>
            <Accordion title="Envíos y cambios">
              <p>
                Envío a Bogotá en 24h y al resto de Colombia en 3–5 días. Tienes 15 días para
                cambiar tu talla. Precio y pago se coordinan por WhatsApp.
              </p>
            </Accordion>
          </div>
        </div>
      </div>

      {/* combina con */}
      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="font-condensed text-[clamp(1.7rem,4.5vw,2.8rem)] text-cream">
            Combina con <span className="shine-gold">la manada</span>
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* guía de tallas modal */}
      {guide && (
        <div
          className="fixed inset-0 z-[120] grid place-items-center bg-ink/70 p-4 backdrop-blur-sm"
          onClick={() => setGuide(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-cream p-6 text-ink shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-black">Guía de tallas</h3>
              <button
                onClick={() => setGuide(false)}
                className="font-mono text-[0.7rem] font-bold uppercase text-ink/50 hover:text-ink"
              >
                Cerrar ×
              </button>
            </div>
            <p className="mt-1 text-[0.78rem] text-ink/55">
              Medidas de la prenda en cm (no del cuerpo). Modelo: 1.80 m, usa talla M.
            </p>
            <table className="mt-4 w-full border-collapse text-[0.82rem]">
              <thead>
                <tr className="border-b border-ink/15 text-left font-mono text-[0.6rem] uppercase tracking-[0.1em] text-ink/50">
                  <th className="py-2">Talla</th>
                  <th className="py-2">Pecho</th>
                  <th className="py-2">Largo</th>
                  <th className="py-2">Hombro</th>
                </tr>
              </thead>
              <tbody className="font-mono">
                {SIZE_GUIDE.map((r) => (
                  <tr key={r.size} className="border-b border-ink/8">
                    <td className="py-2 font-bold">{r.size}</td>
                    <td className="py-2">{r.pecho}</td>
                    <td className="py-2">{r.largo}</td>
                    <td className="py-2">{r.hombro}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function Accordion({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <details className="group py-4">
      <summary className="flex cursor-pointer list-none items-center justify-between font-mono text-[0.72rem] font-bold tracking-[0.12em] text-cream uppercase">
        {title}
        <span className="text-cream/50 transition group-open:rotate-45">+</span>
      </summary>
      <div className="mt-3 text-[0.85rem] leading-relaxed text-cream/65">{children}</div>
    </details>
  );
}
