"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionTemplate } from "framer-motion";
import { Logo } from "@/components/ui/Logo";
import { LeafCanvas } from "@/components/fx/LeafCanvas";
import { CssLeaves } from "@/components/fx/CssLeaves";
import { VideoIntro, type Paso } from "@/components/fx/VideoIntro";
import { BRAND, SELLO_ORIGEN } from "@/lib/brand";

/**
 * Intro de marca.
 *
 * En ESCRITORIO: una ventana crece con el scroll y revela el wallpaper FIJO de
 * selva de cemento que ya vive detrás de la página; al llenarse la pantalla el
 * empalme es invisible porque es la misma imagen.
 *
 * Desde el 25-sep-2026 lo que se ve por la ventana NO es el wallpaper sino el
 * SPOT de la marca (10 s, mudo, `VideoIntro`): la ventana crece con el scroll
 * con el video adentro, y al llenar la pantalla el video se desvanece dejando
 * el wallpaper fijo que ya estaba detrás. Así el mismo deslizar que abre la
 * ventana apaga el video y baja a las dos puertas, sin cortes.
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
  // Antes las dos condiciones iban en UNA sola consulta. Hubo que separarlas
  // porque el celular y "reducir movimiento" ya no quieren lo mismo: el celular
  // sí lleva el video de fondo (medio mega), y quien pidió menos movimiento no.
  // Arranca en `true` para no bajar un video que igual se va a desmontar.
  const [quieto, setQuieto] = useState(true);

  useEffect(() => {
    const chico = window.matchMedia("(max-width: 700px)");
    const menos = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      setAnimated(!chico.matches && !menos.matches);
      setQuieto(menos.matches);
    };
    update();
    chico.addEventListener("change", update);
    menos.addEventListener("change", update);
    return () => {
      chico.removeEventListener("change", update);
      menos.removeEventListener("change", update);
    };
  }, []);

  return animated ? <HeroScroll /> : <HeroStatic conVideo={!quieto} />;
}

/**
 * Velo sobre el video. El spot abre claro (cielo al atardecer) y el logo es
 * crema: sin esto el logo se pierde contra las nubes. Es el mismo degradado
 * del wallpaper fijo, así que al desvanecerse el video no cambia el ambiente.
 */
const VELO =
  "linear-gradient(180deg, rgba(8,14,12,0.38) 0%, rgba(8,14,12,0.20) 42%, rgba(8,14,12,0.62) 100%)";

/**
 * Los bordes del video se deshacen en vez de cortarse.
 *
 * Un rectángulo nítido de video sobre el fondo oscuro se lee como una pantalla
 * pegada encima; difuminado, la imagen parece salir de la oscuridad y entrar de
 * nuevo en ella. Es el mismo gesto que ya hace el logo del hero, que no
 * desaparece sino que se desenfoca.
 *
 * La máscara es relativa al elemento, así que el difuminado guarda la misma
 * proporción mientras la ventana crece: a pantalla completa queda como un
 * viñeteado de cine, no como un marco.
 */
/**
 * Velo EXTRA para los últimos segundos. El spot cierra disolviendo a una
 * tarjeta casi blanca con el logo, y sobre una página oscura eso entra como un
 * flash. Bajada así, la tarjeta se lee como un panel cálido encendido dentro de
 * la selva —el logo negro encima sigue perfectamente legible— y el salto al
 * wallpaper deja de doler. Entra despacio (1.6 s), más de lo que dura la
 * disolvencia del propio video: así nunca se nota entrar.
 */
const VELO_TARJETA =
  "radial-gradient(92% 92% at 50% 50%, rgba(10,15,13,0.34) 0%, rgba(10,15,13,0.52) 62%, rgba(10,15,13,0.70) 100%)";

const DIFUMINADO =
  "radial-gradient(128% 122% at 50% 48%, #000 58%, rgba(0,0,0,0.72) 80%, transparent 100%)";

/* ─── Celular / reducir movimiento: cero framer-motion, cero canvas ─── */
function HeroStatic({ conVideo = false }: { conVideo?: boolean }) {
  return (
    <section
      id="top"
      className="relative flex h-[100svh] flex-col items-center justify-center overflow-hidden"
    >
      {conVideo && (
        /*
         * A SANGRE COMPLETA, con la versión CORTADA EN EL CIELO (6.8 s).
         *
         * El spot es apaisado y un teléfono es lo contrario: a pantalla
         * completa, `object-cover` se come el 60% del ancho. Mientras la cámara
         * mira a la gente caminando eso no molesta —es fondo, y el centro es lo
         * que importa—, pero el letrero del final quedaba partido por los dos
         * lados y se leía "BUINOS". Por eso en celular el video termina justo
         * cuando la cámara sube al cielo: lo que queda en pantalla son nubes, y
         * encima el logo del sitio, que no se aparta nunca porque el video ya
         * no llega a mostrar el suyo (por eso acá no se pasa `alPaso`).
         *
         * 440 KB. El wallpaper fijo sigue detrás, así que si el video no
         * arranca no se ve un hueco negro.
         */
        <>
          <div
            className="absolute inset-0"
            style={{ maskImage: DIFUMINADO, WebkitMaskImage: DIFUMINADO }}
          >
            <VideoIntro movil className="h-full w-full object-cover" />
          </div>
          <div className="pointer-events-none absolute inset-0" style={{ background: VELO }} />
        </>
      )}

      <div
        className="relative z-10 flex flex-col items-center"
      >
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
      </div>

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
  const [video, setVideo] = useState<HTMLVideoElement | null>(null);
  const [paso, setPaso] = useState<Paso>("spot");
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const w = useTransform(scrollYProgress, [0, 0.62], ["66vw", "100vw"]);
  const h = useTransform(scrollYProgress, [0, 0.62], ["56vh", "100svh"]);
  const radius = useTransform(scrollYProgress, [0, 0.62], [26, 0]);

  // El video se apaga DESPUÉS de que la ventana terminó de abrirse (0.62), no
  // durante: si se desvanece mientras crece, se ve el wallpaper aparecer por
  // dentro antes de tiempo y el movimiento se lee como dos cosas en vez de una.
  // Y no se apaga de golpe: se desenfoca y toma aire mientras se va, que es lo
  // mismo que hace el logo del hero. Un corte seco entre dos imágenes distintas
  // (el cielo del spot y la selva del wallpaper) se siente como un cambio de
  // canal; desenfocado, una se deshace en la otra.
  const videoOpacity = useTransform(scrollYProgress, [0.62, 0.78], [1, 0]);
  const videoDesenfoque = useTransform(scrollYProgress, [0.62, 0.78], [0, 12]);
  const videoFiltro = useMotionTemplate`blur(${videoDesenfoque}px)`;
  const videoEscala = useTransform(scrollYProgress, [0.62, 0.78], [1, 1.07]);

  /**
   * Una vez fundido, la capa del video SE QUITA (no basta con dejarla en cero).
   *
   * Medido en Chrome: pasado el 0.9 del recorrido la opacidad que pinta el
   * compositor se despega del scroll y el video REAPARECÍA a media tinta,
   * desenfocado, empañando la selva justo cuando uno va bajando a las puertas.
   * El desenfoque y la escala, que van por el estilo en línea, seguían bien: era
   * sólo la opacidad. Sacando la capa del árbol no queda nada que reaparecer, y
   * de paso el navegador deja de componer un video a pantalla completa con un
   * desenfoque encima mientras nadie lo mira.
   *
   * El umbral de quitarla (0.82) va separado del de volver a ponerla (0.76) a
   * propósito: pegados, un scroll que tiembla en el límite la prendería y
   * apagaría en cada cuadro.
   */
  const [oculto, setOculto] = useState(false);

  // Quieto cuando no se ve: un video decodificando fuera de pantalla gasta
  // batería sin que nadie lo mire. Y si vuelven arriba después de que terminó,
  // el spot se rebobina — el intro tiene que estar igual que al llegar.
  useEffect(
    () =>
      scrollYProgress.on("change", (p) => {
        setOculto((antes) => (antes ? p > 0.76 : p > 0.82));
        if (!video) return;
        if (p > 0.85) {
          if (!video.paused) video.pause();
          return;
        }
        if (p < 0.06 && video.ended) {
          video.currentTime = 0;
          setPaso("spot");
        }
        // `ended` aparte de `paused`: un video terminado también está pausado, y
        // pedirle play() lo manda al segundo cero. Sin esta guarda, cualquier
        // movimiento del scroll después de los 10 s rebobinaba el spot de golpe
        // y el remate saltaba de vuelta a la primera toma.
        if (video.paused && !video.ended) video.play().catch(() => {});
      }),
    [scrollYProgress, video],
  );

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
          className="relative z-0 overflow-hidden ring-1 ring-cream/5"
        >
          {/* El spot, recortado por la ventana. `object-cover` hace que al
              crecer el encuadre se abra en vez de deformarse. Al desvanecerse
              queda el wallpaper fijo, que está detrás desde el principio: por
              eso el empalme no se nota. */}
          <motion.div
            hidden={oculto}
            style={{
              opacity: videoOpacity,
              filter: videoFiltro,
              scale: videoEscala,
              maskImage: DIFUMINADO,
              WebkitMaskImage: DIFUMINADO,
            }}
            className="absolute inset-0"
          >
            <VideoIntro
              alMontar={setVideo}
              alPaso={setPaso}
              className="h-full w-full object-cover"
            />
            <div className="pointer-events-none absolute inset-0" style={{ background: VELO }} />
            <div
              className={`pointer-events-none absolute inset-0 transition-opacity duration-[1600ms] ${paso === "tarjeta" ? "opacity-100" : "opacity-0"}`}
              style={{ background: VELO_TARJETA }}
            />
          </motion.div>
        </motion.div>

        {/* jungle ambiance over the reveal */}
        <CssLeaves />
        <LeafCanvas density={0.6} />

        {/* logo — grows + distorts (blur/skew) until it vanishes */}
        <div
          className={`pointer-events-none absolute z-20 flex justify-center transition-opacity duration-700 ${paso === "spot" ? "opacity-100" : "opacity-0"}`}
        >
          <motion.div
            style={{
              opacity: titleOpacity,
              scale: titleScale,
              skewX: titleSkew,
              filter: titleFilter,
            }}
            className="flex justify-center"
          >
            <Logo
              tone="cream"
              priority
              sizes="460px"
              className="h-auto w-[min(74vw,460px)] drop-shadow-[0_8px_40px_rgba(0,0,0,.7)]"
            />
          </motion.div>
        </div>
        <div
          className={`pointer-events-none absolute bottom-[16%] z-20 transition-opacity duration-700 ${paso === "spot" ? "opacity-100" : "opacity-0"}`}
        >
          <motion.div style={{ opacity: subOpacity }} className="font-mono text-center uppercase">
            <p className="text-[0.7rem] tracking-[0.35em] text-[var(--accent)]">{BRAND.tagline}</p>
            <p className="mt-2 text-[0.55rem] tracking-[0.3em] text-cream/55">{SELLO_ORIGEN}</p>
          </motion.div>
        </div>

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
