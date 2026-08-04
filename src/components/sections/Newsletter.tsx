"use client";

import { useState } from "react";
import { useToast } from "@/lib/toast";

export function Newsletter() {
  const showToast = useToast((s) => s.show);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showToast("⚠️ Ingresa un correo válido");
      return;
    }
    setLoading(true);
    try {
      await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      showToast("✓ ¡Bienvenido al Cult, explorador!");
      setEmail("");
    } catch {
      showToast("⚠️ Algo falló, intenta de nuevo");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="club" className="cv-auto liana-edge border-y border-cream/10 bg-ink/60 sm:bg-ink/45 sm:backdrop-blur-sm">
      <div className="mx-auto max-w-2xl px-5 py-16 text-center md:px-8">
        <p className="eyebrow mb-3 text-[var(--accent)]">Club Babuinos</p>
        <h2 className="font-condensed text-[clamp(2.2rem,6vw,3.6rem)] text-cream">
          Únete al <span className="shine-gold">Cult</span>
        </h2>
        <p className="mx-auto mt-3 max-w-md text-cream/65">
          Drops exclusivos, preventas fundadoras y acceso anticipado a cada nueva expedición.
        </p>
        <form onSubmit={submit} className="mx-auto mt-9 flex max-w-md flex-col gap-3 sm:flex-row">
          <div className="flex-1 text-left">
            <label
              htmlFor="club-email"
              className="font-mono mb-1.5 block text-[0.6rem] font-bold tracking-[0.12em] text-cream/70 uppercase"
            >
              Tu correo
            </label>
            <input
              id="club-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              placeholder="tu@correo.com"
              className="w-full rounded-md border border-cream/20 bg-cream/10 px-5 py-3.5 text-cream placeholder:text-cream/50 focus:border-gold"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="font-mono min-h-12 rounded-md px-6 text-[0.72rem] font-bold tracking-[0.1em] uppercase transition hover:brightness-95 disabled:opacity-60 sm:mt-[1.6rem]"
            style={{ backgroundColor: "var(--accent)", color: "var(--accent-ink)" }}
          >
            {loading ? "..." : "Entrar →"}
          </button>
        </form>
      </div>
    </section>
  );
}
