"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { IconPause, IconPlay } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";

/** Lee una media query sin romper la hidratación: el servidor contesta `servidor`. */
function useConsulta(consulta: string, servidor: boolean): boolean {
  return useSyncExternalStore(
    (avisar) => {
      const mq = window.matchMedia(consulta);
      mq.addEventListener("change", avisar);
      return () => mq.removeEventListener("change", avisar);
    },
    () => window.matchMedia(consulta).matches,
    () => servidor,
  );
}

/** "Ahorro de datos" del celular (Chrome en Android). No cambia en caliente. */
function useAhorroDatos(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => Boolean((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData),
    () => true,
  );
}

/**
 * El spot de los pocillos: 32 s y MUDO (el archivo ni siquiera trae pista de
 * audio; el sitio ya tiene su reproductor de música). Va ENTERO, en una
 * pantalla con marco y no recortado de fondo: en Sunrise Fest el promo a
 * pantalla completa se veía pixelado y con los bordes cortados.
 *
 * - Celular y computador piden archivos distintos: 480p (1,9 MB) y 720p (4 MB).
 * - Corre solo mientras se ve; fuera de pantalla se pausa (batería y datos).
 * - Con "reducir movimiento" o ahorro de datos no arranca solo: queda la
 *   portada con el botón de ver. En el HTML del servidor tampoco hay video,
 *   así que nadie lo baja antes de que el navegador decida.
 * - Entra con fundido sobre la portada cuando de verdad empieza a moverse
 *   (`playing`): nunca se ve el cuadro negro de la carga.
 * - La pausa está siempre a mano: un video que se mueve solo por más de 5 s
 *   tiene que poder detenerse.
 */
export function VideoPocillos() {
  const zona = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const pc = useConsulta("(min-width: 768px)", true);
  const menos = useConsulta("(prefers-reduced-motion: reduce)", true);
  const ahorro = useAhorroDatos();
  // null = decide el navegador; true/false = lo decidió la persona con el botón.
  const [eleccion, setEleccion] = useState<boolean | null>(null);
  const [visible, setVisible] = useState(false);
  const [corriendo, setCorriendo] = useState(false);

  const quiereVideo = eleccion ?? !(menos || ahorro);
  // Si la persona lo pausó, el video se queda montado para seguir donde iba.
  const montado = quiereVideo || eleccion === false;
  const base = pc ? "/video/pocillos" : "/video/pocillos-movil";

  useEffect(() => {
    const el = zona.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    // `muted` como PROPIEDAD: es lo que mira el navegador para dejarlo arrancar solo.
    v.muted = true;
    if (quiereVideo && visible) v.play().catch(() => {});
    else v.pause();
  }, [quiereVideo, visible, montado, base]);

  return (
    <div
      ref={zona}
      className="relative aspect-video overflow-hidden rounded-2xl border border-cream/15 bg-ink shadow-[0_30px_90px_-30px_color-mix(in_srgb,var(--accent)_45%,transparent)]"
    >
      <Image
        src="/video/pocillos-cartel.webp"
        alt=""
        fill
        priority
        sizes="(min-width:1152px) 640px, (min-width:1024px) 55vw, calc(100vw - 40px)"
        className="object-cover"
      />
      {montado && (
        <video
          key={base}
          ref={video}
          muted
          loop
          playsInline
          preload="none"
          disablePictureInPicture
          aria-hidden="true"
          tabIndex={-1}
          onPlaying={() => setCorriendo(true)}
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-700",
            corriendo ? "opacity-100" : "opacity-0",
          )}
        >
          <source src={`${base}.webm`} type="video/webm" />
          <source src={`${base}.mp4`} type="video/mp4" />
        </video>
      )}
      <p className="sr-only">
        Video sin sonido: un pocillo blanco cambia de diseño y de color de tapa, en la calle y en la
        selva, y termina con el logo de Babuinos Inc.
      </p>

      {quiereVideo ? (
        <button
          type="button"
          onClick={() => setEleccion(false)}
          aria-label="Pausar el video"
          className="absolute bottom-3 right-3 grid h-11 w-11 place-items-center rounded-full bg-ink/75 text-cream ring-1 ring-cream/25 transition hover:bg-ink"
        >
          <IconPause className="h-4 w-4" />
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setEleccion(true)}
          className="font-mono absolute inset-0 m-auto flex h-12 w-fit items-center gap-2.5 rounded-full bg-ink/80 px-5 text-[0.7rem] font-bold tracking-[0.12em] text-cream uppercase ring-1 ring-cream/30 transition hover:bg-ink"
        >
          <IconPlay className="h-4 w-4 text-[var(--accent)]" />
          Ver el video
        </button>
      )}
    </div>
  );
}
