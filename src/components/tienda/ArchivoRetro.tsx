"use client";

import { useCallback, useEffect, useImperativeHandle, useRef, useState, type Ref } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

/** El navegador pide menos movimiento. Se lee en el momento del clic, no al
 *  montar: la gente cambia el ajuste del sistema sin recargar la página. */
export function menosMovimiento() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/** Lo que el resto de la tienda puede pedirle al archivo desde afuera. */
export interface ArchivoMando {
  abrir: () => void;
}

/**
 * La entrada al archivo: una CINTA, con rebobinado al abrirla.
 *
 * Por qué un efecto y no un simple acordeón: lo que hay detrás es una colección
 * ANTERIOR, y eso hay que decirlo sin texto. Una cinta rebobinando —barra de
 * tracking subiendo, líneas de barrido— lo dice en medio segundo y nadie
 * necesita que se lo expliquen.
 *
 * Por qué una tarjeta con fotos y no el botón de antes (19-oct): el botón era
 * una píldora delgada al final de la página, después de 14 camisas y con texto
 * al 80 % sobre el wallpaper. Un amigo de Juan no encontró la colección vieja;
 * en escritorio ni se veía. Ahora es una tarjeta del ancho de la rejilla que
 * dice qué hay (nombre, cuántas piezas) y lo ENSEÑA: las espaldas de cinco
 * piezas, apagadas como en cinta vieja, que recuperan el color al pasar el
 * mouse. Toda la tarjeta es el botón, así que no hay que apuntarle a nada.
 *
 * Tres cosas que no son adorno:
 *   · con `prefers-reduced-motion` no hay glitch NI espera: el contenido sale
 *     de una, porque hacer esperar a quien pidió menos movimiento es castigarlo;
 *   · es un `button` de verdad con `aria-expanded`, así que el lector de
 *     pantalla anuncia que abre y cierra una sección;
 *   · la animación es interrumpible: volver a pulsar durante el rebobinado
 *     cierra sin esperar a que termine.
 *
 * `/tienda#archivo` llega con el archivo abierto, y el atajo de arriba de la
 * tienda lo abre con `ref.abrir()`.
 */
export function ArchivoRetro({
  ref,
  id,
  titulo,
  bajada,
  cuantas,
  portadas,
  etiqueta,
  etiquetaAbierto,
  anio,
  children,
}: {
  ref?: Ref<ArchivoMando>;
  /** Ancla de la sección (`#archivo`). */
  id: string;
  titulo: string;
  bajada: string;
  cuantas: number;
  /** Las fotos de la tarjeta; se muestran hasta cinco. */
  portadas: { src: string; alt: string }[];
  etiqueta: string;
  etiquetaAbierto: string;
  anio: number;
  children: React.ReactNode;
}) {
  const [abierto, setAbierto] = useState(false);
  const [rebobinando, setRebobinando] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Espejo de `abierto` para `abrir()`, que se llama desde afuera y no debe
  // rebobinar una cinta que ya está abierta.
  const abiertoRef = useRef(false);
  useEffect(() => {
    abiertoRef.current = abierto;
  }, [abierto]);

  useEffect(() => () => void (timer.current && clearTimeout(timer.current)), []);

  const abrir = useCallback(() => {
    if (abiertoRef.current || timer.current) return;
    if (menosMovimiento()) {
      setAbierto(true);
      return;
    }
    setRebobinando(true);
    timer.current = setTimeout(() => {
      timer.current = null;
      setRebobinando(false);
      setAbierto(true);
    }, 700);
  }, []);

  const cerrar = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
    setRebobinando(false);
    setAbierto(false);
  }, []);

  useImperativeHandle(ref, () => ({ abrir }), [abrir]);

  // El enlace para compartir: /tienda#archivo llega con la cinta rebobinando.
  // Un respiro antes de arrancar, para que el efecto se vea al llegar.
  useEffect(() => {
    if (window.location.hash !== `#${id}`) return;
    const t = setTimeout(abrir, 250);
    return () => clearTimeout(t);
  }, [id, abrir]);

  const alternar = () => (abierto || rebobinando ? cerrar() : abrir());

  return (
    // scroll-mt: que al saltar acá la tarjeta no quede debajo del menú y la
    // barra de filtros, que son pegajosos.
    <section id={id} className="mt-16 scroll-mt-36">
      <button
        type="button"
        onClick={alternar}
        aria-expanded={abierto}
        aria-controls={`${id}-contenido`}
        aria-label={
          abierto
            ? `${etiquetaAbierto}: colección ${titulo}`
            : `${etiqueta}: colección ${titulo}, ${cuantas} ${cuantas === 1 ? "pieza" : "piezas"}`
        }
        className={cn(
          "group relative block w-full overflow-hidden rounded-[var(--radius-md)] border border-cream/15 bg-ink/85 p-5 text-left",
          "transition hover:border-[var(--accent)]/60 sm:bg-ink/60 sm:p-7 sm:backdrop-blur-md",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]",
          rebobinando && "vhs-tiembla",
        )}
      >
        {/* Textura de cinta: el mismo barrido del rebobinado, quieto y suave. */}
        <span aria-hidden className="vhs-lineas pointer-events-none absolute inset-0 opacity-35" />

        <span className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
          <span className="block min-w-0">
            <span className="font-mono block text-[0.6rem] font-bold tracking-[0.18em] text-cream/55 uppercase">
              Archivo · {anio}
            </span>
            <span className="mt-1.5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="font-condensed text-[clamp(1.6rem,4.4vw,2.6rem)] leading-none text-cream">
                {titulo}
              </span>
              <span className="font-mono text-[0.6rem] font-bold tracking-[0.14em] text-cream/55 uppercase">
                {cuantas} {cuantas === 1 ? "pieza" : "piezas"}
              </span>
            </span>
            <span className="mt-2 block max-w-md text-[0.85rem] leading-relaxed text-cream/65">
              {bajada}
            </span>
          </span>

          {/* Las espaldas, que es donde vive el gráfico. Apagadas como cinta
              vieja; con el mouse encima recuperan el color. El filtro va en la
              CASILLA y no en la foto: las fotos traen el mismo fondo que la
              casilla, y teñida solo la foto se veía un recuadro adentro. Filtro
              LITERAL y no las clases de Tailwind (ver la trampa de blur-* en
              HANDOFF). */}
          {!abierto && portadas.length > 0 && (
            <span aria-hidden className="grid grid-cols-5 gap-2 sm:flex sm:shrink-0 sm:gap-3">
              {portadas.slice(0, 5).map((p) => (
                <span
                  key={p.src}
                  className="relative block aspect-[4/5] overflow-hidden rounded-lg bg-[#eceae6] transition-[filter] duration-500 [filter:saturate(.45)_sepia(.25)] group-hover:[filter:none] sm:w-[84px] lg:w-[96px]"
                >
                  <Image
                    src={p.src}
                    alt=""
                    fill
                    sizes="(max-width:639px) 18vw, 96px"
                    className="object-contain p-1"
                  />
                </span>
              ))}
            </span>
          )}
        </span>

        <span className="relative mt-5 flex">
          <span
            className={cn(
              "font-mono inline-flex min-h-11 items-center gap-2.5 rounded-full px-5 text-[0.68rem] font-bold tracking-[0.12em] uppercase transition",
              abierto ? "border border-cream/30 text-cream" : "group-hover:brightness-95",
            )}
            style={abierto ? undefined : { backgroundColor: "var(--accent)", color: "var(--accent-ink)" }}
          >
            <span aria-hidden className="text-[0.85rem] leading-none">
              {abierto ? "▾" : "◀◀"}
            </span>
            {abierto ? etiquetaAbierto : etiqueta}
          </span>
        </span>

        {/* El rebobinado. Capa suelta y sin eventos: tapa pero no estorba. */}
        {rebobinando && (
          <span aria-hidden className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
            <span className="vhs-lineas absolute inset-0 opacity-70" />
            <span className="vhs-barra absolute inset-x-0 h-14 bg-gradient-to-b from-transparent via-cream/25 to-transparent" />
          </span>
        )}
      </button>

      {/* aria-live para que el lector de pantalla cuente que apareció algo. */}
      <div aria-live="polite" className="sr-only">
        {abierto ? "Archivo abierto" : ""}
      </div>

      <div id={`${id}-contenido`}>
        {abierto && <div className="vhs-entra mt-8">{children}</div>}
      </div>
    </section>
  );
}
