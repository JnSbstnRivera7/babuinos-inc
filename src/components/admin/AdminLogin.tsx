"use client";

import { useState } from "react";
import { Logo } from "@/components/ui/Logo";

export function AdminLogin() {
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
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        window.location.reload();
      } else {
        setError("Clave incorrecta");
      }
    } catch {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="jungle-bg flex min-h-[100svh] items-center justify-center px-6">
      <form
        onSubmit={submit}
        className="glass w-full max-w-sm rounded-2xl p-8 text-center"
      >
        <Logo tone="cream" className="mx-auto h-auto w-[200px]" />
        <p className="font-mono mt-6 text-[0.6rem] tracking-[0.2em] text-[var(--accent)] uppercase">
          Panel · Babuinos
        </p>
        <h1 className="font-condensed mt-2 text-3xl text-cream">Acceso privado</h1>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Clave de administrador"
          autoFocus
          className="mt-6 w-full rounded-md border border-cream/20 bg-cream/10 px-4 py-3 text-cream placeholder:text-cream/40 focus:border-[var(--accent)] focus:outline-none"
        />
        {error && <p className="mt-2 text-[0.8rem] text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="font-mono mt-4 w-full rounded-md px-6 py-3 text-[0.75rem] font-bold tracking-[0.1em] uppercase transition hover:brightness-95 disabled:opacity-60"
          style={{ backgroundColor: "var(--accent)", color: "var(--accent-ink)" }}
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </main>
  );
}
