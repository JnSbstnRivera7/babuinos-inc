"use client";

import Link from "next/link";
import { Reveal } from "@/components/fx/Reveal";
import { Logo } from "@/components/ui/Logo";
import { LeafCanvas } from "@/components/fx/LeafCanvas";
import { Lianas } from "@/components/fx/Lianas";
import { SocialButtons } from "@/components/ui/SocialButtons";
import { IconArrowLeft } from "@/components/ui/Icons";

export function ComingSoon({ category }: { category: string }) {
  return (
    <main className="jungle-bg relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 text-center">
      <Lianas />
      <LeafCanvas density={0.9} />

      {/* Entra con fade y subida; el Reveal ya trae esa transición en CSS. */}
      <Reveal className="relative z-10 flex flex-col items-center">
        <Logo tone="cream" priority className="h-auto w-[min(70vw,360px)]" />
        <p className="font-mono mt-8 text-[0.65rem] tracking-[0.3em] text-[var(--accent)] uppercase">
          {category}
        </p>
        <h1 className="font-condensed mt-3 text-[clamp(2.8rem,12vw,6rem)] leading-none text-cream">
          Muy <span className="shine-gold">pronto</span>
        </h1>
        <p className="mt-5 max-w-sm text-cream/65">
          Estamos preparando la línea de {category.toLowerCase()} de la manada. Únete al Club y sé
          el primero en enterarte del drop.
        </p>
        <div className="mt-8 flex flex-col items-center gap-5">
          <Link
            href="/club"
            className="font-mono inline-flex items-center rounded-full bg-cream px-8 py-4 text-[0.78rem] font-bold tracking-[0.1em] text-ink uppercase transition hover:-translate-y-0.5"
            style={{ backgroundColor: "var(--accent)", color: "var(--accent-ink)" }}
          >
            Unirme al Club
          </Link>
          <Link
            href="/tienda"
            className="font-mono inline-flex items-center gap-2 text-[0.72rem] font-bold tracking-[0.1em] text-cream/70 uppercase transition hover:text-cream"
          >
            <IconArrowLeft className="h-4 w-4" /> Volver a la tienda
          </Link>
          <SocialButtons variant="icon" />
        </div>
      </Reveal>
    </main>
  );
}
