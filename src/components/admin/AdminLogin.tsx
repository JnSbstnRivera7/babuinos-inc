"use client";

import { useState } from "react";
import { Logo } from "@/components/ui/Logo";
import { BaboonMark } from "@/components/ui/BaboonMark";
import { Lianas } from "@/components/fx/Lianas";
import { CssLeaves } from "@/components/fx/CssLeaves";

const PALETTE = ["#00897f", "#cda214", "#6b8035", "#8a6a3a", "#1b2f5c"];

export function AdminLogin() {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user, password }),
      });
      if (res.ok) window.location.reload();
      else setError("Usuario o clave incorrectos");
    } catch {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="jungle-bg relative flex min-h-[100svh] items-center justify-center overflow-hidden px-6">
      <Lianas />
      <CssLeaves />

      <form
        onSubmit={submit}
        className="glass relative z-10 w-full max-w-sm rounded-3xl border-2 border-[var(--accent)]/30 p-8 text-center shadow-[0_24px_70px_rgba(0,0,0,.5)]"
      >
        {/* baboon ring */}
        <div className="mb-5 flex justify-center gap-2">
          {PALETTE.map((c, i) => (
            <BaboonMark key={i} color={c} className="h-6 w-7" />
          ))}
        </div>

        <Logo tone="cream" className="mx-auto h-auto w-[210px]" />

        <p className="font-mono mt-5 text-[0.6rem] tracking-[0.24em] text-[var(--accent)] uppercase">
          🦍 Panel de la manada
        </p>
        <h1 className="font-condensed mt-1 text-3xl text-cream">Acceso privado</h1>

        <input
          value={user}
          onChange={(e) => setUser(e.target.value)}
          placeholder="Usuario"
          autoComplete="username"
          autoFocus
          className="mt-6 w-full rounded-xl border border-cream/20 bg-ink/40 px-4 py-3 text-cream placeholder:text-cream/40 focus:border-[var(--accent)] focus:outline-none"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Clave"
          autoComplete="current-password"
          className="mt-3 w-full rounded-xl border border-cream/20 bg-ink/40 px-4 py-3 text-cream placeholder:text-cream/40 focus:border-[var(--accent)] focus:outline-none"
        />
        {error && <p className="mt-3 text-[0.8rem] text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="font-mono mt-5 w-full rounded-xl px-6 py-3.5 text-[0.75rem] font-bold tracking-[0.12em] uppercase transition hover:-translate-y-0.5 hover:brightness-95 disabled:opacity-60"
          style={{ backgroundColor: "var(--accent)", color: "var(--accent-ink)" }}
        >
          {loading ? "Entrando a la selva..." : "Entrar"}
        </button>

        <p className="font-mono mt-5 text-[0.55rem] tracking-[0.18em] text-cream/35 uppercase">
          Babuinos Inc · Street Adventure Heritage
        </p>
      </form>
    </main>
  );
}
