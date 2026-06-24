"use client";

import { ImageAutoSlider } from "@/components/ui/ImageAutoSlider";
import { PRODUCTS } from "@/lib/products";
import { Reveal } from "@/components/fx/Reveal";

const SHOTS = PRODUCTS.map((p) => ({ src: p.image, alt: `${p.name} — ${p.colorway}` }));
const ROW_A = SHOTS;
const ROW_B = [...SHOTS].reverse();

export function Lookbook() {
  return (
    <section className="relative overflow-hidden py-12 md:py-16">
      <div className="relative mx-auto mb-8 max-w-6xl px-5 md:px-8">
        <Reveal>
          <p className="eyebrow mb-2 text-teal-light">Lookbook · Fundadores 2026</p>
          <h2 className="font-condensed text-[clamp(1.9rem,5.5vw,3.6rem)] text-cream">
            La colección en <span className="shine-gold">movimiento</span>
          </h2>
        </Reveal>
      </div>

      <div className="flex flex-col gap-5">
        <ImageAutoSlider images={ROW_A} fit="contain" speed={42} />
        <div className="hidden sm:block">
          <ImageAutoSlider images={ROW_B} fit="contain" speed={52} reverse />
        </div>
      </div>
    </section>
  );
}
