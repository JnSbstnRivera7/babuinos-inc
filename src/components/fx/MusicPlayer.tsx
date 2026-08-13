"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { BaboonMark } from "@/components/ui/BaboonMark";
import { IconPlay, IconPause, IconSkip, IconClose } from "@/components/ui/Icons";

interface Track {
  src: string;
  title: string;
}

/**
 * Temas de **M.A.D. Fellaz**, usados CON AUTORIZACIÓN de la banda (son amigos de
 * la casa; Juan lo confirmó el 10-ago-2026). Antes acá había música comercial y
 * por eso se quitó todo el 10-ago: ahora la selección es legítima, y por eso el
 * reproductor los acredita en pantalla mientras suenan.
 *
 * Los MP3 vienen a 105-137 kb/s desde el original, así que se copian tal cual:
 * recomprimir otra vez solo perdería calidad sin ahorrar peso.
 */
const CREDITO = "Babuinos Ft M.A.D. Fellaz";

const TRACKS: Track[] = [
  { src: "/music/mad-fellaz-tabogo-zoo.mp3", title: "Tabogo Zoo" },
  { src: "/music/mad-fellaz-crimentales.mp3", title: "Crimentales" },
  { src: "/music/mad-fellaz-no-diggedy.mp3", title: "No Diggedy" },
  { src: "/music/achepe-mad-fellaz-23-celcius.mp3", title: "23 Celcius · con Achepe" },
];

/**
 * Reproductor GLOBAL (en toda la página vía layout) con los temas de
 * M.A.D. Fellaz, acreditados en pantalla como "Babuinos Ft M.A.D. Fellaz".
 * Colapsado = botón redondo chico en la esquina inferior izquierda; se ABRE al
 * hacer clic para mostrar los controles.
 *
 * La música arranca sola en el PRIMER GESTO del usuario (toque/click/scroll en
 * cualquier parte), tanto en escritorio como en celular — así lo pidió Juan.
 * Los navegadores solo permiten `audio.play()` dentro de un gesto, por eso se
 * engancha a los eventos globales una sola vez.
 *
 * (Hubo una etapa en que en celular NO autoarrancaba, para no robarle ancho de
 * banda a la navegación con los ~2.5 MB del tema; se revirtió a pedido de Juan.
 * El tema baja por streaming —206 Partial— así que no bloquea la primera vista.)
 */
export function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [index, setIndex] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [open, setOpen] = useState(false);

  const playTrack = useCallback((i: number) => {
    const audio = audioRef.current;
    if (!audio) return Promise.reject(new Error("no audio"));
    if (audio.src === "" || !audio.src.endsWith(TRACKS[i].src)) {
      audio.src = TRACKS[i].src;
    }
    audio.volume = 0.55;
    setIndex(i);
    return audio.play().then(() => setPlaying(true));
  }, []);

  const randomOther = useCallback((cur: number) => {
    if (TRACKS.length <= 1) return 0;
    let n = cur;
    while (n === cur) n = Math.floor(Math.random() * TRACKS.length);
    return n;
  }, []);

  // Autostart en el primer gesto, en cualquier dispositivo (re-arma si el
  // navegador lo bloquea).
  useEffect(() => {
    if (started) return;
    const events = ["touchend", "pointerup", "click", "keydown", "pointerdown", "touchstart", "wheel", "scroll"];
    let done = false;
    const cleanup = () => events.forEach((e) => window.removeEventListener(e, onFirst));
    function onFirst() {
      if (done) return;
      playTrack(Math.floor(Math.random() * TRACKS.length))
        .then(() => {
          done = true;
          setStarted(true);
          cleanup();
        })
        .catch(() => {});
    }
    const opts = { passive: true } as AddEventListenerOptions;
    events.forEach((e) => window.addEventListener(e, onFirst, opts));
    return cleanup;
  }, [started, playTrack]);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!started) {
      setStarted(true);
      playTrack(index < 0 ? Math.floor(Math.random() * TRACKS.length) : index).catch(() => {});
      return;
    }
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play().then(() => setPlaying(true)).catch(() => {});
    }
  };

  const next = () => {
    setStarted(true);
    playTrack(randomOther(index)).catch(() => {});
  };

  /**
   * Un solo toque = panel abierto + música sonando. El play va en el MISMO
   * handler del toque porque los navegadores solo permiten audio.play() dentro
   * del gesto del usuario; si se hiciera en un efecto posterior lo bloquearían.
   */
  const abrirYSonar = () => {
    setOpen(true);
    if (!started) {
      setStarted(true);
      playTrack(Math.floor(Math.random() * TRACKS.length)).catch(() => {});
    }
  };

  return (
    <>
      <audio ref={audioRef} onEnded={next} preload="metadata" playsInline />

      <div
        className="fixed bottom-4 left-4 z-[80] max-w-[calc(100vw-2rem)]"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        {!open ? (
          /* Colapsado: botón redondo — se abre al hacer clic */
          <button
            onClick={abrirYSonar}
            aria-label={started ? `Abrir ${CREDITO}` : `Poner ${CREDITO}`}
            className="relative grid h-12 w-12 place-items-center rounded-full border border-[var(--accent)]/45 bg-ink/85 shadow-[0_8px_28px_rgba(0,0,0,.45)] backdrop-blur-md transition hover:scale-105"
          >
            <BaboonMark color="var(--accent)" className={`h-6 w-7 ${playing ? "" : started ? "" : "anim-pulse"}`} />
            {playing && (
              <span className="absolute -right-0.5 -top-0.5 flex h-3.5 items-end gap-[1.5px] rounded-sm bg-ink/70 px-[3px]">
                {[0, 1, 2].map((b) => (
                  <span
                    key={b}
                    className="eq-bar w-[2px] rounded-sm bg-[var(--accent)]"
                    style={{ height: "100%", animationDelay: `${b * 0.15}s` }}
                  />
                ))}
              </span>
            )}
          </button>
        ) : (
          /* Abierto: controles */
          <div className="relative flex items-center gap-2.5 overflow-hidden rounded-full border border-[var(--accent)]/45 bg-ink/90 py-2 pl-2 pr-2 shadow-[0_8px_30px_rgba(0,0,0,.5)] sm:backdrop-blur-md">
            <span className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#0c5a54]/25 via-transparent to-[#4a5c2a]/25" />

            <button
              onClick={toggle}
              aria-label={playing ? "Pausar música" : "Reproducir música"}
              className={`relative grid h-9 w-9 shrink-0 place-items-center rounded-full transition hover:brightness-95 ${started ? "" : "anim-pulse"}`}
              style={{ backgroundColor: "var(--accent)", color: "var(--accent-ink)" }}
            >
              {playing ? <IconPause className="h-4 w-4" /> : <IconPlay className="h-4 w-4" />}
            </button>

            <div className="relative flex h-5 w-4 shrink-0 items-end justify-center gap-[2px]">
              {[0, 1, 2, 3].map((b) => (
                <span
                  key={b}
                  className="eq-bar w-[3px] rounded-sm bg-[var(--accent)]"
                  style={{
                    height: "100%",
                    animationDelay: `${b * 0.15}s`,
                    animationPlayState: playing ? "running" : "paused",
                    opacity: playing ? 1 : 0.4,
                  }}
                />
              ))}
            </div>

            <div className="relative min-w-0 max-w-[38vw] sm:max-w-[190px]">
              {/* Arriba el tema que suena; abajo el crédito de la banda, que
                  queda a la vista todo el tiempo que hay música. Sin sonar aún,
                  arriba va el nombre del reproductor. */}
              <div className="font-mono truncate text-[0.62rem] font-bold tracking-[0.06em] text-cream">
                {started && index >= 0 ? TRACKS[index].title : CREDITO}
              </div>
              <div className="font-mono truncate text-[0.6rem] tracking-[0.12em] text-cream/70 uppercase">
                {started && index >= 0 ? CREDITO : "Toca para la selva"}
              </div>
            </div>

            <button
              onClick={next}
              aria-label="Siguiente canción"
              className="relative grid h-8 w-8 shrink-0 place-items-center rounded-full text-cream/70 transition hover:bg-cream/10 hover:text-cream"
            >
              <IconSkip className="h-4 w-4" />
            </button>

            <button
              onClick={() => setOpen(false)}
              aria-label="Cerrar reproductor"
              className="relative grid h-8 w-8 shrink-0 place-items-center rounded-full text-cream/55 transition hover:bg-cream/10 hover:text-cream"
            >
              <IconClose className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </>
  );
}
