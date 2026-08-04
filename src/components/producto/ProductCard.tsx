"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getEdition, inStock, type Genero, type Product } from "@/lib/products";
import { GeneroMark } from "@/components/ui/GeneroMark";
import { useCart } from "@/lib/store";
import { useWishlist } from "@/lib/wishlist";
import { useToast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { IconPlus, IconLeaf, IconHeart } from "@/components/ui/Icons";

const BADGES: Record<string, { label: string; cls: string }> = {
  new: { label: "Nuevo", cls: "bg-teal text-white" },
  hot: { label: "Hot", cls: "bg-gold text-ink" },
  last: { label: "Últimas", cls: "bg-burgundy text-white" },
};

export function ProductCard({
  product,
  viewGenero = "all",
}: {
  product: Product;
  /** Género en contexto (p.ej. filtro de tienda) para elegir el modelo de la card. */
  viewGenero?: Genero | "all";
}) {
  const add = useCart((s) => s.add);
  const openCart = useCart((s) => s.open);
  const showToast = useToast((s) => s.show);
  const saved = useWishlist((s) => s.ids.includes(product.slug));
  const toggleWish = useWishlist((s) => s.toggle);
  const [size, setSize] = useState("");

  const available = inStock(product);
  const badge = product.badge ? BADGES[product.badge] : null;

  // Se lleva el género en contexto a la ficha (?g=), para que abrir una pieza
  // desde la línea Mujer no la muestre en modelo hombre.
  const href =
    viewGenero === "hombre" || viewGenero === "mujer"
      ? `/producto/${product.slug}?g=${viewGenero}`
      : `/producto/${product.slug}`;

  // Modelo a mostrar: el del contexto (Hombre/Mujer) si existe; si no, el de la
  // ficha (mujer → mujer, resto → hombre). Fallback a la prenda sola.
  const cardGenero: "hombre" | "mujer" =
    viewGenero === "hombre" || viewGenero === "mujer"
      ? viewGenero
      : product.genero === "mujer"
        ? "mujer"
        : "hombre";
  const shots = product.models?.[cardGenero] ?? product.models?.hombre ?? product.models?.mujer;
  const useModel = Boolean(shots);
  const frontSrc = shots?.frontal ?? product.image;
  const backSrc = shots?.espalda ?? product.image;

  function handleAdd() {
    if (!available) return;
    if (!size) {
      showToast("Elige una talla primero");
      return;
    }
    add(product, size);
    showToast(`${product.name} · ${size} a la mochila`);
    openCart();
  }

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[var(--radius-md)] bg-white shadow-[0_8px_40px_rgba(30,32,33,.12)]">
      <button
        type="button"
        onClick={() => toggleWish(product.slug)}
        aria-label={saved ? "Quitar de favoritos" : "Guardar en favoritos"}
        aria-pressed={saved}
        className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-white/90 shadow-[0_2px_10px_rgba(30,32,33,.18)] transition hover:scale-110"
      >
        <IconHeart
          className="h-[18px] w-[18px]"
          style={{ color: saved ? "#c0392b" : "#1e2021" }}
          fill={saved ? "currentColor" : "none"}
        />
      </button>
      <Link
        href={href}
        aria-label={`Ver ${product.name}`}
        className="relative block aspect-[4/5] w-full shrink-0 overflow-hidden bg-[#eceae6]"
      >
        {/* frontal (por defecto) */}
        <Image
          src={frontSrc}
          alt={`${product.name} — ${product.colorway}`}
          fill
          sizes="(max-width:640px) 88vw, (max-width:1024px) 45vw, 30vw"
          className={cn(
            "transition-all duration-500 group-hover:scale-[1.03]",
            useModel ? "object-cover group-hover:opacity-0" : "object-contain p-2",
          )}
        />
        {/* espalda (aparece al pasar el mouse — el gráfico va atrás) */}
        {useModel && (
          <Image
            src={backSrc}
            alt=""
            aria-hidden
            fill
            sizes="(max-width:640px) 88vw, (max-width:1024px) 45vw, 30vw"
            className="object-cover opacity-0 transition-all duration-500 group-hover:scale-[1.03] group-hover:opacity-100"
          />
        )}
        {badge && (
          <span
            className={cn(
              "font-mono absolute left-4 top-4 rounded-full px-3 py-1 text-[0.58rem] font-bold tracking-[0.12em] uppercase",
              badge.cls,
            )}
          >
            {badge.label}
          </span>
        )}
        <span className="absolute bottom-3 right-3 grid h-11 w-11 place-items-center rounded-full bg-cream shadow-[0_4px_14px_rgba(30,32,33,.18)]">
          <GeneroMark genero={product.genero} color={getEdition(product.edition).accent} className="w-6" />
        </span>
        {!available && (
          <span className="absolute inset-0 grid place-items-center bg-ink/45">
            <span className="font-mono rounded-full bg-ink px-4 py-1.5 text-[0.62rem] font-bold tracking-[0.16em] text-cream uppercase">
              Agotado
            </span>
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <Link href={href} className="block">
          <div className="font-mono text-[0.6rem] font-bold tracking-[0.16em] text-teal uppercase">
            {product.tag}
          </div>
          <h3 className="font-display mt-1.5 text-lg font-black leading-tight text-ink transition group-hover:text-teal">
            {product.name}
          </h3>
        </Link>
        <p className="mt-1.5 line-clamp-2 text-[0.82rem] leading-relaxed text-ink/55">
          {product.desc}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <span className="font-mono text-[0.6rem] font-bold tracking-[0.12em] text-ink/45 uppercase">
            {product.colorway}
          </span>
          <span className="font-mono inline-flex items-center gap-1.5 rounded-full bg-teal/10 px-2.5 py-1 text-[0.55rem] font-bold tracking-[0.1em] text-teal uppercase">
            <IconLeaf className="h-3 w-3" /> Sostenible
          </span>
        </div>

        {/* size pills */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {product.sizes.map((s) => {
            const soldOut = s.stock === 0;
            return (
              <button
                key={s.size}
                type="button"
                disabled={soldOut}
                onClick={() => setSize(s.size)}
                aria-pressed={size === s.size}
                className={cn(
                  "font-mono grid h-8 min-w-8 place-items-center rounded-md border px-2 text-[0.7rem] font-bold transition",
                  soldOut
                    ? "cursor-not-allowed border-ink/10 text-ink/25 line-through"
                    : size === s.size
                      ? "border-ink bg-ink text-cream"
                      : "border-ink/20 text-ink/70 hover:border-ink",
                )}
              >
                {s.size}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={handleAdd}
          disabled={!available}
          className="font-mono mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-ink px-5 py-3 text-[0.7rem] font-bold tracking-[0.1em] text-cream uppercase transition hover:-translate-y-0.5 hover:bg-teal active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-ink/15 disabled:text-ink/40 disabled:hover:translate-y-0"
        >
          <IconPlus className="h-4 w-4" /> {available ? "A la mochila" : "Agotado"}
        </button>
      </div>
    </article>
  );
}
