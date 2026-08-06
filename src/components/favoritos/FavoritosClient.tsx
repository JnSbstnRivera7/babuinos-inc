"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useWishlist } from "@/lib/wishlist";
import { PRODUCTS, withStockAll, type StockMap } from "@/lib/products";
import { ProductCard } from "@/components/producto/ProductCard";

export function FavoritosClient({ stockMap }: { stockMap?: StockMap }) {
  const ids = useWishlist((s) => s.ids);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const items = withStockAll(
    PRODUCTS.filter((p) => ids.includes(p.slug)),
    stockMap,
  );

  return (
    <div className="mx-auto max-w-6xl px-5 pb-24 pt-10 md:px-8 md:pt-16">
      <p className="eyebrow mb-2 text-[var(--accent)]">Tu selección</p>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="font-condensed text-[clamp(2.2rem,6vw,4rem)] text-cream">
          Tus <span className="shine-gold">favoritos</span>
        </h1>
        {mounted && items.length > 0 && (
          <span className="font-mono pb-2 text-[0.72rem] font-bold tracking-[0.1em] text-cream/50 uppercase">
            {items.length} {items.length === 1 ? "pieza" : "piezas"}
          </span>
        )}
      </div>

      {!mounted ? (
        <div className="mt-16 text-center text-cream/40">Cargando…</div>
      ) : items.length > 0 ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="mt-16 text-center">
          <p className="font-condensed text-[clamp(1.6rem,5vw,2.6rem)] text-cream/80">
            Aún no guardas nada
          </p>
          <p className="mt-2 text-cream/55">
            Toca el corazón en las piezas que te gusten y aparecerán acá.
          </p>
          <Link
            href="/tienda"
            className="font-mono mt-6 inline-flex rounded-full px-6 py-3 text-[0.7rem] font-bold tracking-[0.12em] uppercase transition hover:brightness-95"
            style={{ backgroundColor: "var(--accent)", color: "var(--accent-ink)" }}
          >
            Explorar la tienda
          </Link>
        </div>
      )}
    </div>
  );
}
