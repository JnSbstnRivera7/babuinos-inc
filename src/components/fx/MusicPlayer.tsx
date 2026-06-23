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
];

/**
 * Jungle-styled floating music player. On the user's first interaction
 * (click/tap/key) it auto-plays a random track. Auto-advances on end.
 */
export function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [index, setIndex] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);

  const playTrack = useCallback((i: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.src = TRACKS[i].src;
    audio.volume = 0.55;
    setIndex(i);
    audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
  }, []);

  const randomOther = useCallback((cur: number) => {
    if (TRACKS.length <= 1) return 0;
    let n = cur;
    while (n === cur) n = Math.floor(Math.random() * TRACKS.length);
    return n;
  }, []);

  // first interaction → start a random track
  useEffect(() => {
    if (started) return;
    const onFirst = () => {
      if (started) return;
      setStarted(true);
      playTrack(Math.floor(Math.random() * TRACKS.length));
    };
    const opts = { once: true } as AddEventListenerOptions;
    window.addEventListener("pointerdown", onFirst, opts);
    window.addEventListener("keydown", onFirst, opts);
    return () => {
      window.removeEventListener("pointerdown", onFirst);
      window.removeEventListener("keydown", onFirst);
    };
  }, [started, playTrack]);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!started) {
      setStarted(true);
      playTrack(index < 0 ? Math.floor(Math.random() * TRACKS.length) : index);
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
    playTrack(randomOther(index));
  };

  return (
    <>
      <audio ref={audioRef} onEnded={next} preload="none" />
      <div className="fixed bottom-4 left-4 z-[80] max-w-[calc(100vw-2rem)]">
        <div className="flex items-center gap-2.5 rounded-full border border-[var(--accent)]/45 bg-ink/85 py-2 pl-2 pr-3 shadow-[0_8px_30px_rgba(0,0,0,.45)] backdrop-blur-md">
          {/* leafy accent */}
          <BaboonMark color="var(--accent)" className="h-5 w-6 shrink-0" />

          <button
            onClick={toggle}
            aria-label={playing ? "Pausar música" : "Reproducir música"}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full transition hover:brightness-95"
            style={{ backgroundColor: "var(--accent)", color: "var(--accent-ink)" }}
          >
            {playing ? <IconPause className="h-4 w-4" /> : <IconPlay className="h-4 w-4" />}
          </button>

          {/* equalizer */}
          <div className="flex h-5 w-5 shrink-0 items-end justify-center gap-[2px]">
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

          <div className="min-w-0 max-w-[40vw] sm:max-w-[200px]">
            <div className="font-mono truncate text-[0.62rem] font-bold tracking-[0.06em] text-cream">
              {started && index >= 0 ? TRACKS[index].title : "Pon la selva 🌿"}
            </div>
            <div className="font-mono text-[0.5rem] tracking-[0.12em] text-cream/45 uppercase">
              Babuinos Radio
            </div>
          </div>

          <button
            onClick={next}
            aria-label="Siguiente canción"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-cream/70 transition hover:bg-cream/10 hover:text-cream"
          >
            <IconSkip className="h-4 w-4" />
          </button>
        </div>
      </div>
    </>
  );
}
