"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Reveal } from "@/components/fx/Reveal";
import { BaboonMark } from "@/components/ui/BaboonMark";
import { useToast } from "@/lib/toast";

/* ── Config del próximo drop (EDITAR aquí la fecha y el nombre) ── */
const DROP = {
  name: "Drop 02 — Expedición",
  date: "2026-09-04T20:00:00-05:00", // hora Colombia
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export function DropCountdown() {
  const showToast = useToast((s) => s.show);
  const [mounted, setMounted] = useState(false);
  const [left, setLeft] = useState(0);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    setMounted(true);
    const target = new Date(DROP.date).getTime();
    const tick = () => setLeft(Math.max(0, target - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const done = mounted && left <= 0;
  const days = Math.floor(left / 86_400_000);
  const hours = Math.floor((left % 86_400_000) / 3_600_000);
  const mins = Math.floor((left % 3_600_000) / 60_000);
  const secs = Math.floor((left % 60_000) / 1000);

  const units: { v: string; label: string }[] = [
    { v: mounted ? String(days) : "--", label: "Días" },
    { v: mounted ? pad(hours) : "--", label: "Horas" },
    { v: mounted ? pad(mins) : "--", label: "Min" },
    { v: mounted ? pad(secs) : "--", label: "Seg" },
  ];

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!EMAIL_RE.test(email)) {
      showToast("Ingresa un correo válido");
      return;
    }
    setLoading(true);
    try {
      await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setJoined(true);
      setEmail("");
      showToast("Estás en la lista del drop");
    } catch {
      showToast("Algo falló, intenta de nuevo");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="drop" className="relative overflow-hidden">
      <div className="mx-auto max-w-4xl px-5 py-16 md:px-8 md:py-24">
        <Reveal>
          <div className="jungle-bg glass relative overflow-hidden rounded-3xl border border-cream/10 p-8 text-center md:p-12">
            <span className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/5 to-black/40" />
            <BaboonMark shine className="anim-float relative mx-auto mb-6 w-16" />

            <p className="eyebrow relative mb-2 text-[var(--accent)]">
              {done ? "Ya está aquí" : "Lo que viene"}
            </p>
            <h2 className="font-condensed relative text-[clamp(2rem,6vw,3.6rem)] leading-none text-cream">
              {done ? (
                <>
                  El <span className="shine-gold">drop</span> ya salió
                </>
              ) : (
                <>
                  Próximo <span className="shine-gold">drop</span>
                </>
              )}
            </h2>
            <p className="font-mono relative mt-3 text-[0.72rem] font-bold tracking-[0.16em] text-cream/60 uppercase">
              {DROP.name}
            </p>

            {done ? (
              <Link
                href="/tienda"
                className="font-mono relative mt-8 inline-flex rounded-full px-8 py-4 text-[0.78rem] font-bold tracking-[0.1em] uppercase transition hover:brightness-95"
                style={{ backgroundColor: "var(--accent)", color: "var(--accent-ink)" }}
              >
                Ver la tienda →
              </Link>
            ) : (
              <>
                {/* countdown */}
                <div className="relative mx-auto mt-8 flex max-w-md justify-center gap-2.5 sm:gap-4">
                  {units.map((u) => (
                    <div
                      key={u.label}
                      className="flex-1 rounded-2xl border border-cream/10 bg-ink/50 py-4"
                    >
                      <div className="font-condensed text-[clamp(1.8rem,7vw,3rem)] leading-none text-cream tabular-nums">
                        {u.v}
                      </div>
                      <div className="font-mono mt-1 text-[0.62rem] font-bold tracking-[0.14em] text-cream/70 uppercase">
                        {u.label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* waitlist */}
                {joined ? (
                  <p className="font-mono relative mt-8 text-[0.75rem] tracking-[0.06em] text-[var(--accent)]">
                    ✓ Estás en la lista. Te avisamos antes que a nadie.
                  </p>
                ) : (
                  <form
                    onSubmit={submit}
                    className="relative mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
                  >
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tu@correo.com"
                      aria-label="Correo para la lista del drop"
                      className="flex-1 rounded-md border border-cream/20 bg-cream/10 px-5 py-3.5 text-cream placeholder:text-cream/35 focus:border-gold focus:outline-none"
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className="font-mono rounded-md px-6 py-3.5 text-[0.72rem] font-bold tracking-[0.1em] uppercase transition hover:brightness-95 disabled:opacity-60"
                      style={{ backgroundColor: "var(--accent)", color: "var(--accent-ink)" }}
                    >
                      {loading ? "..." : "Avísame →"}
                    </button>
                  </form>
                )}
                <p className="font-mono relative mt-3 text-[0.58rem] tracking-[0.1em] text-cream/35 uppercase">
                  Acceso anticipado para el Club
                </p>
              </>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
