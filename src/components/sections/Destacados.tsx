import Link from "next/link";
import { Reveal } from "@/components/fx/Reveal";
import { ProductCard } from "@/components/producto/ProductCard";
import { getFeatured } from "@/lib/products";

/** Vitrina de piezas destacadas en el home. Cada card lleva a su PDP; el CTA a /tienda. */
export function Destacados() {
  const featured = getFeatured();

  return (
    <section id="destacados" className="relative overflow-hidden">
      <div className="mx-auto max-w-6xl px-5 py-14 md:px-8 md:py-20">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow mb-2 text-teal-light">Colección Fundadores 2026</p>
              <h2 className="font-condensed text-[clamp(2rem,5.5vw,3.6rem)] text-cream">
                Lo más <span className="shine-gold">buscado</span>
              </h2>
            </div>
            <Link
              href="/tienda"
              className="font-mono inline-flex items-center gap-2 rounded-full border border-cream/25 px-6 py-3 text-[0.7rem] font-bold tracking-[0.12em] text-cream uppercase transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              Ver toda la tienda →
            </Link>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p, i) => (
            <Reveal key={p.id} delay={0.06 + i * 0.06}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
