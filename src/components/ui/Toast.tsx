"use client";

import { useToast } from "@/lib/toast";
import { cn } from "@/lib/utils";

export function Toast() {
  const { message, visible } = useToast();
  return (
    /**
     * La región vive SIEMPRE en el DOM con aria-live: si se montara junto con el
     * mensaje, el lector de pantalla no alcanzaría a anunciarlo. Antes no tenía
     * aria-live, así que "a la mochila" era invisible para quien no ve la
     * pantalla. `polite` no interrumpe lo que se esté leyendo.
     */
    <div aria-live="polite" aria-atomic="true">
      {/* Entra y sale con CSS. El nodo se queda montado y solo cambia de clase:
          así no hace falta framer-motion para un fade con desplazamiento. */}
      <div
        className={cn(
          "font-mono fixed bottom-6 left-1/2 z-[120] -translate-x-1/2 rounded-full border border-teal bg-ink px-6 py-3 text-[0.72rem] font-bold tracking-wide text-cream shadow-[0_8px_32px_rgba(0,0,0,.4)] transition duration-300 ease-[cubic-bezier(.22,1,.36,1)]",
          visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-[70px] opacity-0",
        )}
      >
        {message}
      </div>
    </div>
  );
}
