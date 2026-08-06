"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Aparece con fade y subida al entrar en pantalla. Antes era `whileInView` de
 * framer-motion; ahora es un IntersectionObserver + una transición de CSS
 * (`.reveal` en globals.css), que es lo mismo sin 222 KB.
 *
 * RED DE SEGURIDAD: si el observador no contesta —navegador sin soporte, pestaña
 * que nunca compone frames— se muestra todo a los 1.5 s. Un efecto de entrada
 * jamás puede dejar el contenido invisible: es preferible perder la animación.
 */
export function Reveal({
  children,
  delay = 0,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li" | "section";
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      const t = window.setTimeout(() => setVisible(true), 0);
      return () => window.clearTimeout(t);
    }

    let contesto = false;
    const io = new IntersectionObserver(
      (entradas) => {
        contesto = true;
        if (entradas.some((e) => e.isIntersecting)) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: "-12% 0px" },
    );
    io.observe(el);

    // Si en 1.5 s el observador no dio señales, se muestra sin animación.
    const red = window.setTimeout(() => {
      if (!contesto) setVisible(true);
    }, 1500);

    return () => {
      io.disconnect();
      window.clearTimeout(red);
    };
  }, []);

  return (
    <Tag
      // Callback ref porque `as` puede ser div, li o section y cada uno tipa el
      // ref distinto; una función que acepta HTMLElement sirve para los tres.
      ref={(el: HTMLElement | null) => {
        ref.current = el;
      }}
      className={cn("reveal", visible && "reveal-visible", className)}
      style={delay ? { transitionDelay: `${delay}s` } : undefined}
    >
      {children}
    </Tag>
  );
}
