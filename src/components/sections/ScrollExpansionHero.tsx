"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Logo } from "@/components/ui/Logo";
import { SocialButtons } from "@/components/ui/SocialButtons";
import { LeafCanvas } from "@/components/fx/LeafCanvas";
import { Lianas } from "@/components/fx/Lianas";
import { CssLeaves } from "@/components/fx/CssLeaves";
import { IconArrowRight } from "@/components/ui/Icons";

const STATS = [
  { num: "100%", label: "Cotton Oversize" },
  { num: "5", label: "Colorways" },
  { num: "∞", label: "Actitud" },
];

/**
 * Immersive intro: a window grows on scroll, revealing the FIXED concrete-jungle
 * wallpaper that already lives behind the page. When the window fills the screen
 * the reveal is seamless — the same image simply stays as the page background.
 */
export function ScrollExpansionHero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const w = useTransform(scrollYProgress, [0, 0.62], ["66vw", "100vw"]);
  const h = useTransform(scrollYProgress, [0, 0.62], ["56vh", "100svh"]);
  const radius = useTransform(scrollYProgress, [0, 0.62], [26, 0]);

  const titleOpacity = useTransform(scrollYProgress, [0, 0.36], [1, 0]);
  const titleY = useTransform(scrollYProgress, [0, 0.36], [0, -50]);
  const subY = useTransform(scrollYProgress, [0, 0.36], [0, 50]);

  const contentOpacity = useTransform(scrollYProgress, [0.5, 0.86], [0, 1]);
  const contentY = useTransform(scrollYProgress, [0.5, 0.86], [40, 0]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);

  return (
    <section id="top" ref={ref} className="relative h-[200vh]">
      {/* transparent pin: the FIXED wallpaper shows through the growing window */}
      <div className="sticky top-0 flex h-[100svh] items-center justify-center overflow-hidden">
        {/* growing window — dark box-shadow masks the rest, revealing the fixed bg inside */}
        <motion.div
          style={{
            width: w,
            height: h,
            borderRadius: radius,
            boxShadow: "0 0 0 100vmax #0a0f0d",
          }}
          className="relative z-0 ring-1 ring-cream/10"
        />

        {/* jungle ambiance over the reveal */}
        <Lianas />
        <CssLeaves />
        <LeafCanvas density={0.6} />

        {/* split title (on top, fades out as the window opens) */}
        <motion.h1
          style={{ opacity: titleOpacity, y: titleY }}
          className="font-condensed pointer-events-none absolute z-20 text-center text-[clamp(2.4rem,9vw,5.5rem)] leading-none text-cream drop-shadow-[0_6px_30px_rgba(0,0,0,.7)]"
        >
          Babuinos
        </motion.h1>
        <motion.p
          style={{ opacity: titleOpacity, y: subY }}
          className="font-mono pointer-events-none absolute bottom-[18%] z-20 text-center text-[0.7rem] tracking-[0.35em] text-[var(--accent)] uppercase"
        >
          Street Adventure Heritage
        </motion.p>

        {/* brand content, revealed once the jungle fills the screen */}
        <motion.div
          style={{ opacity: contentOpacity, y: contentY }}
          className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center"
        >
          <Logo tone="cream" priority className="w-[min(80vw,460px)] drop-shadow-[0_10px_40px_rgba(0,0,0,.7)]" />
          <p className="mt-6 max-w-md text-[1.02rem] leading-relaxed text-cream/80">
            Streetwear oversize con identidad. Selva de cemento, actitud de explorador.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <a
              href="#catalogo"
              className="font-mono inline-flex items-center gap-2 rounded-full px-8 py-4 text-[0.78rem] font-bold tracking-[0.1em] uppercase transition hover:-translate-y-0.5"
              style={{ backgroundColor: "var(--accent)", color: "var(--accent-ink)" }}
            >
              Ver colección <IconArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#nosotros"
              className="font-mono inline-flex items-center rounded-full border border-cream/40 px-7 py-4 text-[0.78rem] font-bold tracking-[0.1em] text-cream uppercase transition hover:bg-cream/10"
            >
              Manifiesto
            </a>
          </div>
          <SocialButtons variant="ghost" className="mt-5 justify-center" />
          <div className="mt-9 flex justify-center gap-10">
            {STATS.map((s) => (
              <div key={s.label}>
                <div className="font-condensed text-3xl text-[var(--accent)]">{s.num}</div>
                <div className="font-mono mt-1 text-[0.55rem] tracking-[0.14em] text-cream/55 uppercase">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* scroll cue */}
        <motion.div
          style={{ opacity: cueOpacity }}
          className="absolute bottom-7 left-1/2 z-30 flex -translate-x-1/2 flex-col items-center gap-2"
        >
          <span className="font-mono text-[0.55rem] tracking-[0.25em] text-cream/60 uppercase">
            Scroll para entrar
          </span>
          <span className="h-9 w-px bg-gradient-to-b from-cream/60 to-transparent" />
        </motion.div>
      </div>
    </section>
  );
}
