"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * El spot de la marca ("babuinos 2"), como FONDO VIVO del intro.
 *
 * SIEMPRE MUDO, y sin pista de audio siquiera: los archivos se codificaron con
 * `-an` (ver README). Así no hay manera de que se cruce con el reproductor de
 * música. De todos modos ningún navegador deja arrancar solo un video con
 * sonido.
 *
 * VA ENTERO, los 10 s, hasta que el babuino llega al final del fondo (Juan lo
 * pidió así). Eso trae un problema que hay que resolver por fuera: en el
 * segundo 8 el spot disuelve a una TARJETA CASI BLANCA con el logo, y este
 * sitio es oscuro — sin ayuda, esa tarjeta mete un rectángulo encendido en
 * medio de la selva. Por eso el paso se avisa afuera (ver `alPaso`) y el hero
 * le pone un velo encima: la tarjeta queda como un panel cálido y bajo, dentro
 * de la paleta de la página, en vez de un flash.
 *
 * DOS TAMAÑOS, elegidos por quien lo monta (no por `media`, que el navegador ya
 * no mira dentro de <video>): 1280x720 en escritorio (1.8 MB) y 720x406 en
 * celular (0.5 MB). Primero WebM/VP9 y de respaldo H.264, que es lo que toma
 * Safari. El 2 tiene mucho más follaje que el 1 y comprime peor, por eso la
 * versión de celular baja a 720 de ancho.
 *
 * NO SE REPITE EN BUCLE a propósito: volver de golpe a la primera toma sería un
 * corte feo cada diez segundos. Se queda quieto en la tarjeta del final.
 *
 * AVISA EN QUÉ VA (`alPaso`), y el hero reacciona:
 *
 *   "spot"     0 - 6.3 s   la gente caminando y el cielo abriéndose
 *   "remate"   6.3 - 7.6   el babuino cruza y se forma el letrero: el logo DEL
 *                          SITIO se aparta, porque es el mismo letrero y
 *                          encimados se leen como un error de impresión
 *   "tarjeta"  7.6 - 10    la tarjeta clara del final, que se baja con un velo
 *
 * Los 6.3 no son redondos: el letrero del video se termina de formar sobre los
 * 7.0-7.45 s, así que avisando a los 6.3 el del sitio alcanza a desvanecerse y
 * queda un respiro de cielo vacío en el medio que hace de entrada.
 *
 * El elemento se guarda en ESTADO y no en una ref, y se entrega por `alMontar`
 * en vez de recibir una ref de afuera: es lo que pide el linter de React 19
 * (una ref no se lee ni se escribe durante el render) y además avisa solo
 * cuando el <video> ya existe, que es cuando el de afuera puede tocarlo.
 */
const REMATE = 6.3;
const TARJETA = 7.6;

export type Paso = "spot" | "remate" | "tarjeta";

interface Props {
  movil?: boolean;
  className?: string;
  /** Entrega el elemento para pausarlo o rebobinarlo desde afuera. */
  alMontar?: (v: HTMLVideoElement | null) => void;
  alPaso?: (paso: Paso) => void;
}

export function VideoIntro({ movil = false, className, alMontar, alPaso }: Props) {
  const [el, setEl] = useState<HTMLVideoElement | null>(null);
  const base = movil ? "/video/intro-movil" : "/video/intro";
  const cartel = movil ? "/video/intro-cartel-movil.webp" : "/video/intro-cartel.webp";

  /**
   * Apagar el sonido en el instante en que nace el elemento, no en un efecto
   * posterior: `muted` como PROPIEDAD es lo que miran los navegadores para
   * dejar arrancar solo, y React lo pone como propiedad, no como atributo del
   * HTML que llega del servidor. Un cuadro tarde ya sería tarde.
   */
  const montar = useCallback((v: HTMLVideoElement | null) => {
    if (v) v.muted = true;
    setEl(v);
  }, []);

  useEffect(() => {
    if (!el) return;
    el.play().catch(() => {
      /* si lo bloquean, queda el cartel fijo y no pasa nada */
    });
    const mirar = () => {
      const t = el.currentTime;
      alPaso?.(t >= TARJETA ? "tarjeta" : t >= REMATE ? "remate" : "spot");
    };
    el.addEventListener("timeupdate", mirar);
    return () => el.removeEventListener("timeupdate", mirar);
  }, [el, alPaso]);

  useEffect(() => {
    alMontar?.(el);
  }, [el, alMontar]);

  return (
    <video
      ref={montar}
      className={className}
      autoPlay
      muted
      playsInline
      preload="metadata"
      poster={cartel}
      aria-hidden
      tabIndex={-1}
    >
      <source src={`${base}.webm`} type="video/webm" />
      <source src={`${base}.mp4`} type="video/mp4" />
    </video>
  );
}
