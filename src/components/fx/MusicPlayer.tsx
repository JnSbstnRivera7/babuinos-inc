"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { BaboonMark } from "@/components/ui/BaboonMark";
import { IconPlay, IconPause, IconSkip, IconClose } from "@/components/ui/Icons";

interface Track {
  src: string;
  title: string;
}

const TRACKS: Track[] = [
  { src: "/music/2pac-hit-em-up.mp3", title: "2Pac — Hit 'Em Up" },
  { src: "/music/50cent-in-da-club.mp3", title: "50 Cent — In Da Club" },
  { src: "/music/vico-c-desahogo.mp3", title: "Vico C — Desahogo" },
  { src: "/music/shaggy-luv-me-up.mp3", title: "Shaggy — Luv Me Up" },
  { src: "/music/dmx-party-up-in-here.mp3", title: "DMX — Party Up In Here" },
  { src: "/music/eminem-without-me.mp3", title: "Eminem — Without Me" },
  { src: "/music/eminem-shake-that.mp3", title: "Eminem ft. Nate Dogg — Shake That" },
  { src: "/music/eminem-ass-like-that.mp3", title: "Eminem — Ass Like That" },
  { src: "/music/snoop-dogg-gin-and-juice.mp3", title: "Snoop Dogg — Gin and Juice" },
];

/**
 * Reproductor "Babuinos Radio" GLOBAL (en toda la página vía layout).
 * Colapsado = botón redondo chico en la esquina inferior izquierda; se ABRE al
 * hacer clic para mostrar los controles.
 *
 * En ESCRITORIO la música arranca sola en el primer gesto. En CELULAR **no**:
 * un tema son ~2.5 MB y arrancarlo justo en el primer toque le robaba el ancho
 * de banda a la navegación (el tap a Hombre/Mujer parecía no responder) además
 * de sumar dos tercios del peso de la página.
 *
 * Pero en móvil arranca con UN SOLO TOQUE: el botón colapsado abre el panel Y
 * pone música a la vez. Antes hacían falta dos toques (abrir, luego play).
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

  // Autostart en el primer gesto (re-arma si el navegador lo bloquea).
  // Solo en escritorio: ver la nota del componente. Misma consulta que usa el
  // hero — cubre teléfonos y ventanas angostas, no solo pantallas táctiles.
  useEffect(() => {
    if (started) return;
    if (window.matchMedia("(max-width: 700px), (pointer: coarse)").matches) return;
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
            aria-label={started ? "Abrir Babuinos Radio" : "Poner Babuinos Radio"}
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
              <div className="font-mono truncate text-[0.62rem] font-bold tracking-[0.06em] text-cream">
                {started && index >= 0 ? TRACKS[index].title : "Babuinos Radio"}
              </div>
              <div className="font-mono text-[0.6rem] tracking-[0.12em] text-cream/70 uppercase">
                Toca para la selva
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
