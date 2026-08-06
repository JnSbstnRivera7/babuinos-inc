"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { TALLAS_POSIBLES } from "@/lib/products";
import { cn } from "@/lib/utils";

/**
 * Inventario editable: es la pantalla que saca el tallaje del código.
 *
 * Regla de la casilla, que es lo único que hay que entender:
 *   vacía → la talla NO existe para esa pieza (no se muestra en la tienda)
 *   0     → existe pero está agotada (sale tachada)
 *   n     → hay n unidades (el carrito no deja pedir más)
 */

export interface PiezaInv {
  id: string;
  name: string;
  slug: string;
  colorway: string;
  image: string;
  category: "basica" | "estampada";
}

type Draft = Record<string, Record<string, string>>;

function draftDesde(
  piezas: PiezaInv[],
  guardado: Record<string, Record<string, number>>,
): Draft {
  const d: Draft = {};
  for (const p of piezas) {
    d[p.id] = {};
    for (const t of TALLAS_POSIBLES) {
      const v = guardado[p.id]?.[t];
      d[p.id][t] = typeof v === "number" ? String(v) : "";
    }
  }
  return d;
}

const SQL = `create table if not exists public.product_stock (
  product_id text        not null,
  size       text        not null,
  stock      integer     not null default 0 check (stock >= 0),
  updated_at timestamptz not null default now(),
  primary key (product_id, size)
);

-- Solo el servidor (service role) entra: RLS prendido y sin políticas.
alter table public.product_stock enable row level security;`;

export function AdminInventario({
  piezas,
  guardado,
  provisional,
  dbError,
}: {
  piezas: PiezaInv[];
  /** Lo que hay hoy en la tabla: { [id]: { [talla]: unidades } } */
  guardado: Record<string, Record<string, number>>;
  /** Tallaje provisional del catálogo, para arrancar de algo real. */
  provisional: { size: string; stock: number }[];
  dbError?: string;
}) {
  const inicial = useMemo(() => draftDesde(piezas, guardado), [piezas, guardado]);
  const [draft, setDraft] = useState<Draft>(inicial);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  /** "La tabla no existe" se reconoce por el mensaje de PostgREST, y también
   *  puede aparecer al guardar (no solo al leer). */
  const esTablaFaltante = (m: string) =>
    /product_stock|relation .* does not exist|schema cache/i.test(m);
  const faltaTabla = esTablaFaltante(dbError ?? "") || esTablaFaltante(error);
  /** Cualquier otro problema de lectura (sin red, llave mala, RLS): decirlo tal cual. */
  const otroErrorLectura = dbError && !esTablaFaltante(dbError) ? dbError : "";

  const cambiadas = useMemo(
    () =>
      piezas
        .filter((p) => TALLAS_POSIBLES.some((t) => (draft[p.id]?.[t] ?? "") !== inicial[p.id][t]))
        .map((p) => p.id),
    [draft, inicial, piezas],
  );

  const setCelda = (id: string, talla: string, valor: string) => {
    // Solo dígitos: el input numérico deja pegar cualquier cosa.
    const limpio = valor.replace(/[^\d]/g, "").slice(0, 4);
    setDraft((d) => ({ ...d, [id]: { ...d[id], [talla]: limpio } }));
    setMsg("");
    setError("");
  };

  const cargarProvisional = (soloVacias: boolean) => {
    setDraft((d) => {
      const next: Draft = { ...d };
      for (const p of piezas) {
        const vacia = TALLAS_POSIBLES.every((t) => !(d[p.id]?.[t] ?? ""));
        if (soloVacias && !vacia) continue;
        next[p.id] = { ...d[p.id] };
        for (const t of TALLAS_POSIBLES) {
          const prov = provisional.find((s) => s.size === t);
          next[p.id][t] = prov ? String(prov.stock) : "";
        }
      }
      return next;
    });
    setMsg("");
  };

  const total = (id: string) =>
    TALLAS_POSIBLES.reduce((a, t) => a + (parseInt(draft[id]?.[t] ?? "", 10) || 0), 0);

  const tieneDatos = (id: string) => TALLAS_POSIBLES.some((t) => (draft[id]?.[t] ?? "") !== "");

  async function guardar() {
    if (!cambiadas.length) return;
    setSaving(true);
    setError("");
    setMsg("");
    try {
      const items = cambiadas.map((id) => ({
        product_id: id,
        sizes: TALLAS_POSIBLES.filter((t) => (draft[id][t] ?? "") !== "").map((t) => ({
          size: t,
          stock: parseInt(draft[id][t], 10) || 0,
        })),
      }));
      const res = await fetch("/api/admin/stock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string; piezas?: number };
      if (!res.ok || !data.ok) {
        setError(data.error || "No se pudo guardar");
        return;
      }
      setMsg(
        `Guardado: ${data.piezas} ${data.piezas === 1 ? "pieza" : "piezas"}. La tienda ya lo muestra.`,
      );
      // El draft pasa a ser lo guardado: recargar deja ver lo mismo.
      window.setTimeout(() => window.location.reload(), 900);
    } catch {
      setError("No se pudo guardar (sin conexión con el servidor)");
    } finally {
      setSaving(false);
    }
  }

  const sinDatos = piezas.filter((p) => !tieneDatos(p.id)).length;

  return (
    <section className="mt-10">
      <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-condensed text-2xl text-cream">Inventario</h2>
          <p className="mt-1 max-w-xl text-[0.82rem] leading-relaxed text-cream/70">
            Casilla <strong className="text-cream">vacía</strong> = esa talla no existe para la pieza
            (no se muestra) · <strong className="text-cream">0</strong> = existe pero agotada (sale
            tachada) · <strong className="text-cream">n</strong> = unidades disponibles, y el carrito
            no deja pedir más.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => cargarProvisional(true)}
            className="font-mono rounded-md border border-cream/25 px-3 py-2 text-[0.62rem] font-bold tracking-[0.1em] text-cream/75 uppercase transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            Llenar las {sinDatos} sin datos
          </button>
          <button
            onClick={() => setDraft(inicial)}
            disabled={!cambiadas.length}
            className="font-mono rounded-md border border-cream/25 px-3 py-2 text-[0.62rem] font-bold tracking-[0.1em] text-cream/75 uppercase transition hover:border-cream/50 disabled:opacity-35"
          >
            Descartar
          </button>
          <button
            onClick={guardar}
            disabled={!cambiadas.length || saving}
            className="font-mono rounded-md bg-[var(--accent)] px-4 py-2 text-[0.62rem] font-bold tracking-[0.1em] text-[var(--accent-ink)] uppercase transition hover:brightness-95 disabled:opacity-35"
          >
            {saving
              ? "Guardando..."
              : cambiadas.length
                ? `Guardar ${cambiadas.length}`
                : "Sin cambios"}
          </button>
        </div>
      </div>

      {faltaTabla && (
        <div className="mb-4 rounded-xl border border-[var(--accent)]/40 bg-[var(--accent)]/[0.07] p-4">
          <p className="text-[0.85rem] text-cream/85">
            Falta crear la tabla en Supabase. Pega esto en el <strong>SQL Editor</strong> de tu
            proyecto y vuelve a cargar. Mientras tanto la tienda usa el tallaje provisional, así que
            nada se rompe.
          </p>
          <pre className="mt-3 overflow-x-auto rounded-md bg-ink/60 p-3 text-[0.7rem] leading-relaxed text-cream/80">
            {SQL}
          </pre>
          <button
            onClick={() => navigator.clipboard?.writeText(SQL)}
            className="font-mono mt-2 rounded-md border border-cream/25 px-3 py-1.5 text-[0.6rem] font-bold tracking-[0.1em] text-cream/75 uppercase transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            Copiar el SQL
          </button>
        </div>
      )}

      {otroErrorLectura && (
        <p className="mb-4 rounded-md border border-amber-400/40 bg-amber-400/10 px-4 py-3 text-sm text-amber-200">
          No se pudo leer el inventario de Supabase: {otroErrorLectura}. Mientras tanto la tienda usa
          el tallaje provisional, y lo que guardes acá tampoco va a llegar hasta que la conexión
          funcione.
        </p>
      )}

      {(msg || error) && (
        <p
          className={cn(
            "mb-4 rounded-md px-4 py-3 text-sm",
            error
              ? "border border-red-500/30 bg-red-500/10 text-red-300"
              : "border border-teal/40 bg-teal/10 text-cream",
          )}
        >
          {error || msg}
        </p>
      )}

      <div className="grid gap-3 lg:grid-cols-2">
        {piezas.map((p) => {
          const cambiada = cambiadas.includes(p.id);
          const t = total(p.id);
          return (
            <article
              key={p.id}
              className={cn(
                "rounded-xl border p-3 transition",
                cambiada
                  ? "border-[var(--accent)]/60 bg-[var(--accent)]/[0.06]"
                  : "border-cream/10 bg-cream/[0.03]",
              )}
            >
              <div className="flex items-center gap-3">
                <div className="relative h-14 w-12 shrink-0 overflow-hidden rounded bg-[#eceae6]">
                  <Image src={p.image} alt="" fill sizes="48px" className="object-contain p-0.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate font-display text-[0.95rem] font-black text-cream">
                    {p.name}
                  </div>
                  <div className="font-mono text-[0.6rem] tracking-[0.08em] text-cream/55 uppercase">
                    {p.category === "basica" ? "Básica" : "Estampada"} · {p.colorway}
                  </div>
                </div>
                {/* Sin datos NO es lo mismo que agotada: sin datos manda el
                    tallaje provisional del catálogo. */}
                <div className="text-right">
                  <div
                    className={cn(
                      "font-condensed text-2xl leading-none",
                      !tieneDatos(p.id)
                        ? "text-cream/40"
                        : t > 0
                          ? "text-[var(--accent)]"
                          : "text-red-400",
                    )}
                  >
                    {tieneDatos(p.id) ? t : "—"}
                  </div>
                  <div className="font-mono text-[0.52rem] tracking-[0.1em] text-cream/50 uppercase">
                    {!tieneDatos(p.id) ? "provisional" : t > 0 ? "unidades" : "agotada"}
                  </div>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-6 gap-1.5">
                {TALLAS_POSIBLES.map((talla) => (
                  <label key={talla} className="block">
                    <span className="font-mono mb-1 block text-center text-[0.58rem] font-bold tracking-[0.08em] text-cream/60 uppercase">
                      {talla}
                    </span>
                    <input
                      value={draft[p.id]?.[talla] ?? ""}
                      onChange={(e) => setCelda(p.id, talla, e.target.value)}
                      inputMode="numeric"
                      placeholder="—"
                      aria-label={`${p.name} — talla ${talla}`}
                      className="w-full min-h-11 rounded-md border border-cream/20 bg-ink/50 px-1 text-center text-[0.9rem] font-bold text-cream placeholder:text-cream/25 focus:border-[var(--accent)] focus:outline-none"
                    />
                  </label>
                ))}
              </div>

              {!tieneDatos(p.id) && (
                <p className="font-mono mt-2 text-[0.58rem] tracking-[0.08em] text-cream/45 uppercase">
                  Sin cargar — la tienda usa el tallaje provisional
                </p>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
