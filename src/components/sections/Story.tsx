"use client";

import { BaboonMark } from "@/components/ui/BaboonMark";
import { Reveal } from "@/components/fx/Reveal";
import { IconCompass, IconShirt, IconNeedle, IconLeaf } from "@/components/ui/Icons";

const PILLARS = [
  { Icon: IconCompass, name: "Exploración", desc: "Diseños inspirados en rutas y aventura urbana." },
  { Icon: IconShirt, name: "Fit Oversize", desc: "Cortes amplios pensados para moverse libre." },
  { Icon: IconNeedle, name: "Calidad Real", desc: "Tela pesada, costuras reforzadas, color que dura." },
  { Icon: IconLeaf, name: "Hecho en Colombia", desc: "Producción local, orgullosos de la raíz." },
];

export function Story() {
  return (
    <section id="nosotros" className="cv-auto relative overflow-hidden">
      <div className="relative mx-auto max-w-6xl px-5 py-14 md:px-8 md:py-20">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <Reveal>
              <p className="eyebrow mb-2 text-[var(--accent)]">Street Adventure Heritage</p>
              <h2 className="font-condensed text-[clamp(2rem,5.5vw,3.6rem)] text-cream">
                La manada <span className="shine-gold">de cemento</span>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <blockquote className="my-7 border-l-[3px] border-[var(--accent)] pl-5 font-display text-xl italic text-cream/90">
                “El babuino no sigue la manada — él define su propio territorio.”
              </blockquote>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="text-cream/70">
                Nacimos en Bogotá en 2026 con una obsesión: ropa que dure, que hable y que te
                identifique más allá de la etiqueta. Cada pieza cuenta una historia de exploración,
                actitud y calle.
              </p>
            </Reveal>
            <div className="mt-8 grid grid-cols-2 gap-4">
              {PILLARS.map((p, i) => (
                <Reveal key={p.name} delay={0.1 + i * 0.07}>
                  <div className="glass rounded-xl p-4">
                    <p.Icon className="h-6 w-6 text-[var(--accent)]" />
                    <div className="font-mono mt-2 text-[0.62rem] font-bold tracking-[0.12em] text-[var(--accent)] uppercase">
                      {p.name}
                    </div>
                    <div className="mt-1 text-[0.8rem] text-cream/60">{p.desc}</div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* big baboon stamp */}
          <Reveal delay={0.15}>
            <div className="jungle-bg relative grid aspect-square place-items-center overflow-hidden rounded-3xl">
              <span className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/5 to-black/30" />
              <div className="absolute inset-6 rounded-full border border-cream/15" />
              <div className="absolute inset-12 rounded-full border border-gold/20" />
              <BaboonMark shine className="anim-float w-[52%]" />
              <div className="font-mono absolute bottom-7 left-0 right-0 text-center text-[0.6rem] tracking-[0.3em] text-cream/70 uppercase">
                Est. 2026 · Bogotá
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
