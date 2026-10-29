"use client";

import { useState } from "react";
import Image from "next/image";
import { IconWhatsApp } from "@/components/ui/Icons";
import { COLORES_POCILLO, waPocillo } from "@/lib/pocillos";
import { cn } from "@/lib/utils";

/**
 * El mostrario: una foto grande del pocillo y las seis muestras que la cambian.
 *
 * Las seis fotos están montadas una encima de otra y solo cambia la opacidad,
 * así el cambio es inmediato (ya están bajadas: comparten sitio en pantalla y
 * la carga diferida las pide juntas) y se funde en vez de saltar.
 *
 * El botón de WhatsApp lleva escrito el color elegido: el cliente no tiene que
 * explicar cuál le gustó.
 */
export function Mostrario() {
  const [elegido, setElegido] = useState(COLORES_POCILLO[0]);

  return (
    <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
      <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-3xl border border-cream/10 bg-ink lg:max-w-none">
        {COLORES_POCILLO.map((c) => {
          const activo = c.key === elegido.key;
          return (
            <Image
              key={c.key}
              src={c.foto}
              alt={activo ? `Pocillo blanco con tapa, base y cuchara en color ${c.nombre.toLowerCase()}` : ""}
              aria-hidden={!activo}
              fill
              sizes="(min-width:1024px) 540px, (min-width:480px) 448px, calc(100vw - 40px)"
              className={cn(
                "object-cover transition-opacity duration-300 ease-out",
                activo ? "opacity-100" : "opacity-0",
              )}
            />
          );
        })}
      </div>

      <div>
        <p className="eyebrow mb-2 text-[var(--accent)]">Mostrario</p>
        <h2 id="t-colores" className="font-condensed text-[clamp(1.9rem,5vw,3.2rem)] text-cream">
          Elige tu <span className="shine-gold">color</span>
        </h2>
        <p className="mt-3 max-w-md text-cream/75">
          La tapa, la base y la cuchara van del mismo color. El pocillo es de cerámica blanca, listo
          para tu diseño.
        </p>

        <div
          role="group"
          aria-label="Color de la tapa, la base y la cuchara"
          className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3"
        >
          {COLORES_POCILLO.map((c) => {
            const activo = c.key === elegido.key;
            return (
              <button
                key={c.key}
                type="button"
                aria-pressed={activo}
                onClick={() => setElegido(c)}
                className={cn(
                  "flex min-h-12 items-center gap-2.5 rounded-xl border px-3 text-left text-[0.85rem] font-semibold transition",
                  activo
                    ? "border-[var(--accent)] bg-cream/10 text-cream"
                    : "border-cream/15 text-cream/75 hover:border-cream/40 hover:text-cream",
                )}
              >
                <span
                  aria-hidden
                  className="h-6 w-6 shrink-0 rounded-full ring-1 ring-cream/40"
                  style={{ backgroundColor: c.hex }}
                />
                {c.nombre}
              </button>
            );
          })}
        </div>

        <a
          href={waPocillo(elegido.nombre)}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono mt-7 inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full px-7 text-[0.76rem] font-bold tracking-[0.1em] uppercase transition hover:-translate-y-0.5 hover:brightness-95"
          style={{ backgroundColor: "var(--accent)", color: "var(--accent-ink)" }}
        >
          <IconWhatsApp className="h-5 w-5" />
          Lo quiero en {elegido.nombre.toLowerCase()}
        </a>
        <p className="mt-3 text-[0.82rem] text-cream/55">¿Buscas otro color? Pregúntanos en el mismo mensaje.</p>
      </div>
    </div>
  );
}
