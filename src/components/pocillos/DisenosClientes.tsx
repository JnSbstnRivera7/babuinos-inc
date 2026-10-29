"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { COLLAGE_DISENOS, DISENOS_CLIENTES } from "@/lib/pocillos";

/**
 * Diseños hechos para clientes, para que el que llega se inspire.
 *
 * Van los tres en UNA imagen (pedido de Juan, 29-oct: en tarjetas sueltas la
 * sección ocupaba casi tres pantallas en el celular). Encima de cada lámina
 * hay un botón invisible que abre ESE diseño completo; el último de la lista
 * queda encima, igual que su lámina en la imagen.
 *
 * Cada diseño es la vuelta completa del pocillo, extendida: más del doble de
 * ancho que de alto. En el visor del celular va a lo ALTO de la pantalla y se
 * desliza de lado, que es como darle la vuelta al pocillo. Abre centrado,
 * donde va el retrato principal de cada diseño.
 *
 * El visor copia el zoom de la ficha —mismo fondo, mismo "Cerrar ×", mismas
 * flechas— pero es un <dialog> nativo: Esc, el foco atrapado y el resto de la
 * página inerte vienen solos. Lo que no trae es frenar el scroll de atrás:
 * en celular se bloquea a mano, y `data-lenis-prevent` es para el
 * computador, donde Lenis escucha la rueda del mouse en window.
 */
export function DisenosClientes() {
  const visor = useRef<HTMLDialogElement>(null);
  const carril = useRef<HTMLDivElement>(null);
  const [actual, setActual] = useState(0);
  const [abierto, setAbierto] = useState(false);
  const d = DISENOS_CLIENTES[actual];
  const total = DISENOS_CLIENTES.length;

  useEffect(() => {
    if (!abierto) return;
    const html = document.documentElement;
    html.style.overflow = "hidden";
    return () => {
      html.style.overflow = "";
    };
  }, [abierto]);

  // Dos cuadros: uno para que React pinte el diseño nuevo y otro para medirlo.
  const centrar = () =>
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        const c = carril.current;
        if (c) c.scrollLeft = (c.scrollWidth - c.clientWidth) / 2;
      }),
    );
  const abrir = (i: number) => {
    setActual(i);
    setAbierto(true);
    visor.current?.showModal();
    centrar();
  };
  const mover = (paso: number) => {
    setActual((i) => (i + paso + total) % total);
    centrar();
  };
  const cerrarSiEsFondo = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) visor.current?.close();
  };

  return (
    <>
      <div className="relative">
        <Image
          src={COLLAGE_DISENOS.src}
          alt={`Tres diseños de pocillo hechos para clientes: ${DISENOS_CLIENTES.map((x) => x.titulo.toLowerCase()).join(", ")}`}
          width={COLLAGE_DISENOS.ancho}
          height={COLLAGE_DISENOS.alto}
          sizes="(min-width:1152px) 640px, (min-width:1024px) 56vw, calc(100vw - 40px)"
          className="h-auto w-full"
        />
        {COLLAGE_DISENOS.zonas.map((z) => {
          const i = DISENOS_CLIENTES.findIndex((x) => x.key === z.key);
          return (
            <button
              key={z.key}
              type="button"
              onClick={() => abrir(i)}
              aria-label={`Ver en grande: ${DISENOS_CLIENTES[i].titulo}`}
              className="absolute cursor-zoom-in rounded-2xl"
              style={{ left: `${z.x}%`, top: `${z.y}%`, width: `${z.w}%`, height: `${z.h}%` }}
            />
          );
        })}
      </div>

      <dialog
        ref={visor}
        data-lenis-prevent
        aria-label={`Diseño: ${d.titulo}`}
        onClick={cerrarSiEsFondo}
        onClose={() => setAbierto(false)}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") mover(1);
          if (e.key === "ArrowLeft") mover(-1);
        }}
        className="m-0 h-dvh max-h-none w-dvw max-w-none border-0 bg-ink/92 p-0 text-cream backdrop-blur-sm backdrop:bg-transparent"
      >
        <button
          type="button"
          onClick={() => visor.current?.close()}
          aria-label="Cerrar"
          className="font-mono absolute right-4 top-4 z-10 min-h-11 rounded-full border border-cream/20 px-4 text-[0.62rem] font-bold tracking-[0.08em] text-cream/80 uppercase hover:bg-cream/10"
        >
          Cerrar ×
        </button>

        <div onClick={cerrarSiEsFondo} className="flex h-full flex-col justify-center gap-4 py-16">
          <div
            ref={carril}
            onClick={cerrarSiEsFondo}
            className="no-scrollbar w-full overflow-x-auto overscroll-x-contain px-4 sm:overflow-x-visible sm:px-8"
          >
            <Image
              key={d.key}
              src={d.src}
              alt={`Diseño de pocillo: ${d.titulo.toLowerCase()}`}
              width={d.ancho}
              height={d.alto}
              sizes="(min-width:640px) 96vw, 1200px"
              className="mx-auto block h-[min(58dvh,520px)] w-auto max-w-none rounded-xl sm:h-auto sm:max-h-[70dvh] sm:max-w-full"
            />
          </div>
          <p className="font-mono text-center text-[0.6rem] tracking-[0.14em] text-cream/50 uppercase sm:hidden">
            ‹ Desliza para darle la vuelta ›
          </p>
          <p className="mx-auto max-w-xl px-6 text-center text-[0.9rem] text-cream/75">
            <span className="font-mono text-[0.68rem] font-bold tracking-[0.14em] text-[var(--accent)] uppercase">
              {d.titulo}
            </span>{" "}
            · {d.desc}
          </p>
          <div className="flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => mover(-1)}
              aria-label="Diseño anterior"
              className="grid h-11 w-11 place-items-center rounded-full border border-cream/20 text-2xl leading-none text-cream hover:bg-cream/10"
            >
              ‹
            </button>
            <span className="font-mono min-w-10 text-center text-[0.66rem] tracking-[0.1em] text-cream/80 tabular-nums">
              {actual + 1}/{total}
            </span>
            <button
              type="button"
              onClick={() => mover(1)}
              aria-label="Diseño siguiente"
              className="grid h-11 w-11 place-items-center rounded-full border border-cream/20 text-2xl leading-none text-cream hover:bg-cream/10"
            >
              ›
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}
