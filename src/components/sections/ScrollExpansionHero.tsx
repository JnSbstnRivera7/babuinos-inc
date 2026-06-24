"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useMotionTemplate } from "framer-motion";
import { Logo } from "@/components/ui/Logo";
import { LeafCanvas } from "@/components/fx/LeafCanvas";
import { CssLeaves } from "@/components/fx/CssLeaves";

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
          style={{ opacity: titleOpacity, scale: titleScale, skewX: titleSkew, filter: titleFilter }}
          className="pointer-events-none absolute z-20 flex justify-center"
        >
          <Logo tone="cream" priority className="h-auto w-[min(74vw,460px)] drop-shadow-[0_8px_40px_rgba(0,0,0,.7)]" />
        </motion.div>
        <motion.p
          style={{ opacity: subOpacity }}
          className="font-mono pointer-events-none absolute bottom-[16%] z-20 text-center text-[0.7rem] tracking-[0.35em] text-[var(--accent)] uppercase"
        >
          Street Adventure Heritage
        </motion.p>

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
