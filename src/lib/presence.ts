"use client";

import { useEffect, useState } from "react";

/**
 * Montar y desmontar CON animación de salida, sin librería.
 *
 * Es lo único que se usaba de framer-motion en el marco de la página (nav,
 * mochila, toast, panel de filtros): abrir y cerrar con un fade/slide. La
 * librería pesa 222 KB y venía en TODAS las páginas por culpa del Navbar, así
 * que estos cuatro casos van con transiciones de CSS.
 *
 *   const { render, abierto } = usePresence(open);
 *   {render && <div data-abierto={abierto} className="opacity-0 transition
 *                    data-[abierto=true]:opacity-100" />}
 *
 * El truco es el orden: al abrir hay que RENDERIZAR primero con los estilos de
 * cerrado y prender la clase en el siguiente frame, o el navegador no interpola
 * nada. Al cerrar es al revés: se apaga la clase y se desmonta cuando ya pasó la
 * transición.
 *
 * `prefers-reduced-motion` no necesita nada acá: globals.css ya deja todas las
 * transiciones en 0.001ms, así que el desmontaje sigue cayendo en su `ms`.
 */
export function usePresence(open: boolean, ms = 300): { render: boolean; abierto: boolean } {
  const [render, setRender] = useState(open);
  const [abierto, setAbierto] = useState(false);

  useEffect(() => {
    // Se piden las DOS vías: el frame (lo normal, queda suave) y un temporizador
    // de respaldo. `requestAnimationFrame` no corre en pestañas que no pintan ni
    // cuando el hilo principal está atascado, y sin respaldo el panel se
    // quedaría montado sin abrirse nunca. El estado es idempotente, así que
    // gana la que llegue primero.
    const cambiar = (v: boolean) => {
      const frame = requestAnimationFrame(() => (v ? abrir() : setAbierto(false)));
      const respaldo = window.setTimeout(() => (v ? abrir() : setAbierto(false)), 30);
      return () => {
        cancelAnimationFrame(frame);
        window.clearTimeout(respaldo);
      };
    };
    const abrir = () => {
      setRender(true);
      setAbierto(true);
    };

    if (open) return cambiar(true);

    const cancelar = cambiar(false);
    const desmontar = window.setTimeout(() => setRender(false), ms);
    return () => {
      cancelar();
      window.clearTimeout(desmontar);
    };
  }, [open, ms]);

  // `|| open` para que el primer render del abierto ya exista en el DOM.
  return { render: render || open, abierto };
}
