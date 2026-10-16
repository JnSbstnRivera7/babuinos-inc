"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/** El navegador pide menos movimiento. Se lee en el momento del clic, no al
 *  montar: la gente cambia el ajuste del sistema sin recargar la página. */
function menosMovimiento() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * Botón "volver al archivo" con rebobinado de cinta.
 *
 * Por qué un efecto y no un simple acordeón: lo que hay detrás del botón es
 * una colección ANTERIOR, y eso hay que decirlo sin texto. Una cinta
 * rebobinando —barra de tracking subiendo, líneas de barrido, el contador al
 * revés— lo dice en medio segundo y nadie necesita que se lo expliquen.
 *
 * Tres cosas que no son adorno:
 *   · con `prefers-reduced-motion` no hay glitch NI espera: el contenido sale
 *     de una, porque hacer esperar a quien pidió menos movimiento es castigarlo;
 *   · el botón es un `button` de verdad con `aria-expanded`, así que el lector
 *     de pantalla anuncia que abre y cierra una sección;
 *   · la animación es interrumpible: volver a pulsar durante el rebobinado
 *     cierra sin esperar a que termine.
 */
export function ArchivoRetro({
  etiqueta,
  etiquetaAbierto,
  anio,
  children,
}: {
  etiqueta: string;
  etiquetaAbierto: string;
  /** Se ve descontando durante el rebobinado, como el contador de la cinta. */
  anio: number;
  children: React.ReactNode;
}) {
  const [abierto, setAbierto] = useState(false);
  const [rebobinando, setRebobinando] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => void (timer.current && clearTimeout(timer.current)), []);

  const alternar = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
    if (abierto) {
      setRebobinando(false);
      setAbierto(false);
      return;
    }
    if (menosMovimiento()) {
      setAbierto(true);
      return;
    }
    setRebobinando(true);
    timer.current = setTimeout(() => {
      setRebobinando(false);
      setAbierto(true);
    }, 700);
  }, [abierto]);

  return (
    <div className="relative">
      <div className="mt-14 flex justify-center">
        <button
          type="button"
          onClick={alternar}
          aria-expanded={abierto}
          className={cn(
            "font-mono group inline-flex min-h-11 items-center gap-3 rounded-full border border-cream/25 px-6 py-3",
            "text-[0.7rem] font-bold tracking-[0.12em] text-cream/80 uppercase",
            "transition hover:border-[var(--accent)] hover:text-[var(--accent)]",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]",
            rebobinando && "vhs-tiembla",
          )}
        >
          <span
            aria-hidden
            className={cn(
              "text-[0.85rem] leading-none transition-transform",
              abierto ? "rotate-90" : "group-hover:-translate-x-0.5",
            )}
          >
            {abierto ? "▾" : "◀◀"}
          </span>
          {abierto ? etiquetaAbierto : etiqueta}
          <span className="tabular-nums text-cream/45">{anio}</span>
        </button>
      </div>

      {/* El rebobinado. Capa suelta y sin eventos: tapa pero no estorba. */}
      {rebobinando && (
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-20 h-40 overflow-hidden">
          <div className="vhs-lineas absolute inset-0 opacity-70" />
          <div className="vhs-barra absolute inset-x-0 h-14 bg-gradient-to-b from-transparent via-cream/25 to-transparent" />
        </div>
      )}

      {/* aria-live para que el lector de pantalla cuente que apareció algo. */}
      <div aria-live="polite" className="sr-only">
        {abierto ? "Archivo abierto" : ""}
      </div>

      {abierto && <div className="vhs-entra mt-10">{children}</div>}
    </div>
  );
}
