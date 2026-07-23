import Link from "next/link";
import { Reveal } from "@/components/fx/Reveal";
import { GeneroMark } from "@/components/ui/GeneroMark";
import { GENEROS } from "@/lib/products";

const DOORS = GENEROS.filter((g) => g.key !== "unisex");
const UNISEX = GENEROS.find((g) => g.key === "unisex")!;

/** "Dos puertas" de la marca: Hombre (gorra) / Mujer (moño) + entrada unisex. */
export function GeneroSplit() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
        <Reveal>
          <p className="eyebrow mb-2 text-[var(--accent)]">Encuentra tu manada</p>
          <h2 className="font-condensed text-[clamp(2.2rem,6vw,4rem)] text-cream">
            Elige tu <span className="shine-gold">territorio</span>
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {DOORS.map((g, i) => (
            <Reveal key={g.key} delay={0.08 + i * 0.08}>
              <Link
                href={`/tienda?genero=${g.key}`}
                className="jungle-bg group relative flex aspect-[4/5] flex-col items-center justify-center overflow-hidden rounded-3xl border border-cream/10 p-8 text-center transition sm:aspect-[3/4] hover:border-[var(--accent)]/50"
              >
                <span className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/5 to-black/40" />
                <div className="absolute inset-6 rounded-full border border-cream/10" />
                <GeneroMark
                  genero={g.key}
                  className="w-[46%] transition-transform duration-500 group-hover:scale-105"
                />
                <h3 className="font-condensed relative mt-7 text-[clamp(2rem,5vw,3rem)] leading-none text-cream">
                  {g.label}
                </h3>
                <p className="relative mt-2 max-w-[24ch] text-[0.9rem] text-cream/65">{g.blurb}</p>
                <span className="font-mono relative mt-6 inline-flex items-center gap-2 rounded-full border border-cream/30 px-6 py-3 text-[0.7rem] font-bold tracking-[0.12em] text-cream uppercase transition group-hover:border-[var(--accent)] group-hover:text-[var(--accent)]">
                  Entrar →
                </span>
              </Link>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.15}>
          <Link
            href="/tienda"
            className="glass mt-5 flex items-center justify-center gap-3 rounded-2xl px-6 py-5 text-center transition hover:border-cream/30"
          >
            <span className="font-condensed text-[clamp(1.1rem,3vw,1.5rem)] text-cream">
              {UNISEX.label}
            </span>
            <span className="text-cream/50">·</span>
            <span className="font-mono text-[0.7rem] font-bold tracking-[0.12em] text-[var(--accent)] uppercase">
              Ver toda la manada →
            </span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
