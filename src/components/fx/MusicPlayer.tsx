"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { BaboonMark } from "@/components/ui/BaboonMark";
import { IconPlay, IconPause, IconSkip } from "@/components/ui/Icons";

interface Track {
  src: string;
  title: string;
}

const TRACKS: Track[] = [
  { src: "/music/2pac-hit-em-up.mp3", title: "2Pac — Hit 'Em Up" },
  { src: "/music/50cent-in-da-club.mp3", title: "50 Cent — In Da Club" },
  { src: "/music/house-of-pain-back-from-the-dead.mp3", title: "House of Pain — Back From the Dead" },
  { src: "/music/six-days-remix.mp3", title: "Six Days (Remix)" },
  { src: "/music/vico-c-desahogo.mp3", title: "Vico C — Desahogo" },
  { src: "/music/shaggy-luv-me-up.mp3", title: "Shaggy — Luv Me Up" },
];

function Leaf({ className, hue = "#2b8f57" }: { className?: string; hue?: string }) {
  return (
    <svg viewBox="0 0 40 24" className={className} aria-hidden>
      <path d="M2 12 C14 1 30 1 38 12 C30 23 14 23 2 12Z" fill={hue} />
      <path d="M2 12 H38" stroke="rgba(0,0,0,.25)" strokeWidth="1" />
    </svg>
  );
}

/**
 * Jungle-styled floating music player. Tries to start a random track on the
 * user's first interaction (tap/click/key, the touch used to scroll on mobile,
 * and the wheel where the browser allows it). If the browser blocks the play
 * (e.g. a desktop wheel-scroll, which is not a valid autoplay gesture), it
 * keeps listening and starts on the next gesture instead of staying silent.
 */
export function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [index, setIndex] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);

  /** Sets src + plays a track synchronously (to preserve the user gesture). */
  const playTrack = useCallback((i: number) => {
    const audio = audioRef.current;
    if (!audio) return Promise.reject(new Error("no audio"));
    audio.src = TRACKS[i].src;
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

  // First-interaction autostart (re-arms if the browser blocks the gesture).
  useEffect(() => {
    if (started) return;
    const events = ["pointerdown", "click", "touchend", "keydown", "wheel", "touchstart", "scroll"];
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
        .catch(() => {
          /* blocked by autoplay policy → wait for the next gesture */
        });
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

  return (
    <>
      <audio ref={audioRef} onEnded={next} preload="none" />
      <div className="fixed bottom-4 left-4 z-[80] max-w-[calc(100vw-2rem)]">
        <div className="relative">
          <svg className="anim-leaf pointer-events-none absolute -top-4 left-6 z-10 h-6 w-8" viewBox="0 0 32 24" aria-hidden>
            <path d="M16 24 C10 16 10 8 16 0" stroke="#1b5e3f" strokeWidth="2" fill="none" />
            <path d="M16 6 C22 3 28 6 30 12 C24 13 18 11 16 6Z" fill="#2b8f57" />
          </svg>
          <Leaf className="anim-leaf pointer-events-none absolute -top-3 right-7 z-10 h-3.5 w-5 -rotate-12" hue="#3d7a2f" />

          <div className="relative flex items-center gap-2.5 overflow-hidden rounded-full border border-[var(--accent)]/45 bg-ink/85 py-2 pl-2 pr-3 shadow-[0_8px_30px_rgba(0,0,0,.45)] backdrop-blur-md">
            <span className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#0c5a54]/25 via-transparent to-[#4a5c2a]/25" />

            <BaboonMark color="var(--accent)" className="relative h-5 w-6 shrink-0" />

            <button
              onClick={toggle}
              aria-label={playing ? "Pausar música" : "Reproducir música"}
              className={`relative grid h-9 w-9 shrink-0 place-items-center rounded-full transition hover:brightness-95 ${
                started ? "" : "anim-pulse"
              }`}
              style={{ backgroundColor: "var(--accent)", color: "var(--accent-ink)" }}
            >
              {playing ? <IconPause className="h-4 w-4" /> : <IconPlay className="h-4 w-4" />}
            </button>

            <div className="relative flex h-5 w-5 shrink-0 items-end justify-center gap-[2px]">
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

            <div className="relative min-w-0 max-w-[40vw] sm:max-w-[200px]">
              <div className="font-mono truncate text-[0.62rem] font-bold tracking-[0.06em] text-cream">
                {started && index >= 0 ? TRACKS[index].title : "Toca para la selva 🌿"}
              </div>
              <div className="font-mono flex items-center gap-1 text-[0.5rem] tracking-[0.12em] text-cream/45 uppercase">
                <Leaf className="h-2 w-3" hue="#2b8f57" /> Babuinos Radio
              </div>
            </div>

            <button
              onClick={next}
              aria-label="Siguiente canción"
              className="relative grid h-8 w-8 shrink-0 place-items-center rounded-full text-cream/70 transition hover:bg-cream/10 hover:text-cream"
            >
              <IconSkip className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
