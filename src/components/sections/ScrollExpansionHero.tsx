"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionTemplate } from "framer-motion";
import { Logo } from "@/components/ui/Logo";
import { LeafCanvas } from "@/components/fx/LeafCanvas";
import { CssLeaves } from "@/components/fx/CssLeaves";
import { BRAND, SELLO_ORIGEN } from "@/lib/brand";

/**
 * Intro de marca.
 *
 * En ESCRITORIO: una ventana crece con el scroll y revela el wallpaper FIJO de
 * selva de cemento que ya vive detrás de la página; al llenarse la pantalla el
 * empalme es invisible porque es la misma imagen.
 *
 * En CELULAR (o con "reducir movimiento") se sirve la versión ESTÁTICA: el
 * wallpaper a sangre completa y el logo encima, en una sola pantalla. Motivo:
 * la versión animada recalculaba 7 valores por cada frame de scroll y en un
 * teléfono saturaba el hilo principal justo cuando el usuario bajaba a las
 * puertas de Hombre/Mujer, así que los taps se perdían. De paso el alto pasa de
 * 135vh a una pantalla, así que las puertas quedan a un solo desliz.
 */
export function ScrollExpansionHero() {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 700px), (prefers-reduced-motion: reduce)");
    const update = () => setAnimated(!mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return animated ? <HeroScroll /> : <HeroStatic />;
}

/* ─── Celular / reducir movimiento: cero framer-motion, cero canvas ─── */
function HeroStatic() {
  return (
    <section id="top" className="relative flex h-[100svh] flex-col items-center justify-center">
      <Logo
        tone="cream"
        priority
        sizes="(max-width: 700px) 74vw, 460px"
        className="h-auto w-[min(74vw,460px)] drop-shadow-[0_8px_40px_rgba(0,0,0,.7)]"
      />
      <p className="font-mono mt-6 text-center text-[0.7rem] tracking-[0.35em] text-[var(--accent)] uppercase">
        {BRAND.tagline}
      </p>
      <p className="font-mono mt-2 text-center text-[0.55rem] tracking-[0.3em] text-cream/55 uppercase">
        {SELLO_ORIGEN}
      </p>
      <div className="absolute bottom-7 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2">
        <span className="font-mono text-[0.55rem] tracking-[0.25em] text-cream/60 uppercase">
          Desliza para entrar
        </span>
        <span className="h-9 w-px bg-gradient-to-b from-cream/60 to-transparent" />
      </div>
    </section>
  );
}

/* ─── Escritorio: la ventana que crece con el scroll ─── */
function HeroScroll() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const w = useTransform(scrollYProgress, [0, 0.62], ["66vw", "100vw"]);
  const h = useTransform(scrollYProgress, [0, 0.62], ["56vh", "100svh"]);
  const radius = useTransform(scrollYProgress, [0, 0.62], [26, 0]);

  // title grows + distorts (blur) until it disappears
  const titleOpacity = useTransform(scrollYProgress, [0, 0.42], [1, 0]);
  const titleScale = useTransform(scrollYProgress, [0, 0.42], [1, 2.7]);
  const titleBlur = useTransform(scrollYProgress, [0, 0.42], [0, 20]);
  const titleSkew = useTransform(scrollYProgress, [0, 0.42], [0, -6]);
  const titleFilter = useMotionTemplate`blur(${titleBlur}px)`;
  const subOpacity = useTransform(scrollYProgress, [0, 0.28], [1, 0]);
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
        <CssLeaves />
        <LeafCanvas density={0.6} />

        {/* logo — grows + distorts (blur/skew) until it vanishes */}
        <motion.div
          style={{
            opacity: titleOpacity,
            scale: titleScale,
            skewX: titleSkew,
            filter: titleFilter,
          }}
          className="pointer-events-none absolute z-20 flex justify-center"
        >
          <Logo
            tone="cream"
            priority
            sizes="460px"
            className="h-auto w-[min(74vw,460px)] drop-shadow-[0_8px_40px_rgba(0,0,0,.7)]"
          />
        </motion.div>
        <motion.div
          style={{ opacity: subOpacity }}
          className="font-mono pointer-events-none absolute bottom-[16%] z-20 text-center uppercase"
        >
          <p className="text-[0.7rem] tracking-[0.35em] text-[var(--accent)]">{BRAND.tagline}</p>
          <p className="mt-2 text-[0.55rem] tracking-[0.3em] text-cream/55">{SELLO_ORIGEN}</p>
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
