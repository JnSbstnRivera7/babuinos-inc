"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { PRODUCTS, CATEGORIES, getEdition, type Product, type Category } from "@/lib/products";
import { BaboonMark } from "@/components/ui/BaboonMark";
import { Reveal } from "@/components/fx/Reveal";
import { useCart } from "@/lib/store";
import { useToast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { IconLeaf, IconArrowLeft, IconArrowRight, IconPlus } from "@/components/ui/Icons";

function ProductCard({ product }: { product: Product }) {
  const add = useCart((s) => s.add);
  const openCart = useCart((s) => s.open);
  const showToast = useToast((s) => s.show);
  const [size, setSize] = useState("");

  const handleAdd = () => {
    if (!size) {
      showToast("⚠️ Elige una talla primero");
      return;
    }
    add(product, size);
    showToast(`✓ ${product.name} · ${size} a la mochila`);
    openCart();
  };

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-[var(--radius-md)] bg-white shadow-[0_8px_40px_rgba(30,32,33,.1)]">
      {/* photo */}
      <div className="relative h-[clamp(190px,26vw,300px)] w-full shrink-0 overflow-hidden bg-[#eceae6]">
        <Image
          src={product.image}
          alt={`${product.name} — ${product.colorway}`}
          fill
          sizes="(max-width: 640px) 88vw, (max-width: 1024px) 60vw, 40vw"
          className="object-contain p-2"
        />
        {product.badge === "new" && (
          <span className="font-mono absolute left-4 top-4 rounded-full bg-teal px-3 py-1 text-[0.6rem] font-bold tracking-[0.12em] text-white uppercase">
            ✦ Nuevo
          </span>
        )}
        {product.badge === "hot" && (
          <span className="font-mono absolute left-4 top-4 rounded-full bg-gold px-3 py-1 text-[0.6rem] font-bold tracking-[0.12em] text-ink uppercase">
            Hot
          </span>
        )}
        <span className="absolute bottom-3 right-3 grid h-11 w-11 place-items-center rounded-full bg-cream shadow-[0_4px_14px_rgba(30,32,33,.18)]">
          <BaboonMark color={getEdition(product.edition).accent} className="w-6" />
        </span>
      </div>

      {/* info */}
      <div className="flex flex-1 flex-col p-6">
        <div className="font-mono text-[0.62rem] font-bold tracking-[0.16em] text-teal uppercase">
          {product.tag}
        </div>
        <h3 className="font-display mt-2 text-xl font-black leading-tight text-ink">{product.name}</h3>
        <p className="mt-2 text-[0.88rem] leading-relaxed text-ink/55">{product.desc}</p>

        <div className="mt-5 flex items-center justify-between gap-3">
          <label className="font-mono flex items-center gap-2 text-[0.62rem] font-bold tracking-[0.12em] text-ink/50 uppercase">
            Talla
            <select
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="font-mono rounded border border-ink/15 bg-cream px-2 py-1.5 text-[0.72rem] font-bold text-ink focus:border-teal focus:outline-none"
            >
              <option value="">—</option>
              {product.sizes.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          <span className="font-mono inline-flex items-center gap-1.5 rounded-full bg-teal/10 px-3 py-1.5 text-[0.58rem] font-bold tracking-[0.1em] text-teal uppercase">
            <IconLeaf className="h-3.5 w-3.5" /> Sostenible
          </span>
        </div>

        <button
          onClick={handleAdd}
          className="font-mono mt-5 flex w-full items-center justify-center gap-2 rounded-md bg-ink px-5 py-3.5 text-[0.72rem] font-bold tracking-[0.1em] text-cream uppercase transition hover:-translate-y-0.5 hover:bg-teal active:scale-[0.98]"
        >
          <IconPlus className="h-4 w-4" /> Agregar a la mochila
        </button>
      </div>
    </div>
  );
}

export function Catalog() {
  const [category, setCategory] = useState<Category | "all">("all");
  const list = category === "all" ? PRODUCTS : PRODUCTS.filter((p) => p.category === category);

  const [emblaRef, embla] = useEmblaCarousel({ loop: true, align: "start" });
  const [selected, setSelected] = useState(0);
  const [snaps, setSnaps] = useState<number[]>([]);

  const onSelect = useCallback(() => {
    if (embla) setSelected(embla.selectedScrollSnap());
  }, [embla]);

  useEffect(() => {
    if (!embla) return;
    setSnaps(embla.scrollSnapList());
    embla.on("select", onSelect);
    onSelect();
  }, [embla, onSelect]);

  useEffect(() => {
    if (embla) {
      embla.reInit();
      embla.scrollTo(0);
      setSnaps(embla.scrollSnapList());
    }
  }, [category, embla]);

  return (
    <section id="catalogo" className="relative overflow-hidden">
      <div className="relative mx-auto max-w-6xl px-5 py-14 md:px-8 md:py-20">
        <Reveal>
          <p className="eyebrow mb-2 text-[var(--accent)]">Colección Fundadores 2026</p>
          <h2 className="font-condensed text-[clamp(2rem,5.5vw,3.8rem)] text-cream">
            Explora el <span className="shine-gold">territorio</span>
          </h2>
          <p className="mt-3 max-w-lg text-cream/65">
            Cada pieza es una declaración. Desliza para conocer la manada y suma tu talla a la mochila.
          </p>
        </Reveal>

        <div className="mt-8 flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c.key}
              onClick={() => setCategory(c.key)}
              className={cn(
                "font-mono rounded-full border px-5 py-2 text-[0.68rem] font-bold tracking-[0.1em] uppercase transition",
                category === c.key
                  ? "border-cream bg-cream text-ink"
                  : "border-cream/25 text-cream/70 hover:border-cream/60",
              )}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="mt-10 overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {list.map((p) => (
              <div key={p.id} className="min-w-0 shrink-0 grow-0 basis-[88%] pr-5 sm:basis-[60%] lg:basis-[40%]">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between">
          <div className="font-mono text-[0.75rem] font-bold text-cream/50">
            <span className="text-lg text-[var(--accent)]">{String(selected + 1).padStart(2, "0")}</span>
            <span className="mx-1">/</span>
            {String(list.length).padStart(2, "0")}
          </div>
          <div className="flex gap-2">
            {snaps.map((_, i) => (
              <button
                key={i}
                onClick={() => embla?.scrollTo(i)}
                aria-label={`Ir a ${i + 1}`}
                className={cn("h-2 rounded-full transition-all", i === selected ? "w-7 bg-[var(--accent)]" : "w-2 bg-cream/20")}
              />
            ))}
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => embla?.scrollPrev()}
              aria-label="Anterior"
              className="grid h-11 w-11 place-items-center rounded-full bg-cream text-ink transition hover:scale-110"
            >
              <IconArrowLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => embla?.scrollNext()}
              aria-label="Siguiente"
              className="grid h-11 w-11 place-items-center rounded-full bg-cream text-ink transition hover:scale-110"
            >
              <IconArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
