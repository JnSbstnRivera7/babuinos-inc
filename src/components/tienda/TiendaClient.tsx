"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "@/components/producto/ProductCard";
import {
  PRODUCTS,
  CATEGORIES,
  EDITIONS,
  GENEROS,
  TOP_CATEGORIES,
  matchesGenero,
  type Category,
  type Genero,
  type EditionKey,
} from "@/lib/products";
import { cn } from "@/lib/utils";

const GENERO_TABS: { key: Genero | "all"; label: string }[] = [
  { key: "all", label: "Todo" },
  ...GENEROS.map((g) => ({ key: g.key, label: g.label })),
];

export function TiendaClient({ initialGenero = "all" }: { initialGenero?: Genero | "all" }) {
  const [genero, setGenero] = useState<Genero | "all">(initialGenero);
  const [category, setCategory] = useState<Category | "all">("all");
  const [territorio, setTerritorio] = useState<EditionKey | "all">("all");

  const list = useMemo(
    () =>
      PRODUCTS.filter(
        (p) =>
          matchesGenero(p, genero) &&
          (category === "all" || p.category === category) &&
          (territorio === "all" || p.edition === territorio),
      ),
    [genero, category, territorio],
  );

  return (
    <div className="mx-auto max-w-6xl px-5 pb-24 pt-10 md:px-8 md:pt-16">
      <p className="eyebrow mb-2 text-[var(--accent)]">Tienda · Fundadores 2026</p>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="font-condensed text-[clamp(2.2rem,6vw,4rem)] text-cream">
          La <span className="shine-gold">manada</span>
        </h1>
        <span className="font-mono pb-2 text-[0.72rem] font-bold tracking-[0.1em] text-cream/50 uppercase">
          {list.length} {list.length === 1 ? "pieza" : "piezas"}
        </span>
      </div>

      {/* categorías top-level (camisas activa · resto pronto) */}
      <div className="mt-7 flex flex-wrap gap-2.5">
        {TOP_CATEGORIES.map((c) =>
          c.soon ? (
            <span
              key={c.key}
              className="font-mono inline-flex cursor-not-allowed items-center gap-2 rounded-full border border-cream/15 px-5 py-2.5 text-[0.7rem] font-bold tracking-[0.1em] text-cream/40 uppercase"
            >
              {c.label}
              <span className="text-[0.5rem] text-[var(--accent)]">• pronto</span>
            </span>
          ) : (
            <span
              key={c.key}
              className="font-mono inline-flex items-center gap-2 rounded-full bg-cream px-5 py-2.5 text-[0.7rem] font-bold tracking-[0.1em] text-ink uppercase"
            >
              {c.label}
            </span>
          ),
        )}
      </div>

      {/* filtros */}
      <div className="mt-6 flex flex-col gap-3 border-y border-cream/10 py-5">
        <FilterRow label="Línea">
          {GENERO_TABS.map((g) => (
            <Chip key={g.key} active={genero === g.key} onClick={() => setGenero(g.key)}>
              {g.label}
            </Chip>
          ))}
        </FilterRow>
        <FilterRow label="Tipo">
          {CATEGORIES.map((c) => (
            <Chip key={c.key} active={category === c.key} onClick={() => setCategory(c.key)}>
              {c.label}
            </Chip>
          ))}
        </FilterRow>
        <FilterRow label="Territorio">
          <Chip active={territorio === "all"} onClick={() => setTerritorio("all")}>
            Todos
          </Chip>
          {EDITIONS.map((e) => (
            <Chip
              key={e.key}
              active={territorio === e.key}
              onClick={() => setTerritorio(e.key)}
              dot={e.accent}
            >
              {e.name}
            </Chip>
          ))}
        </FilterRow>
      </div>

      {/* grid */}
      {list.length > 0 ? (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="mt-16 text-center">
          <p className="font-condensed text-[clamp(1.6rem,5vw,2.6rem)] text-cream/80">
            Nada por acá… todavía
          </p>
          <p className="mt-2 text-cream/55">Prueba con otra línea o territorio.</p>
          <button
            onClick={() => {
              setGenero("all");
              setCategory("all");
              setTerritorio("all");
            }}
            className="font-mono mt-6 inline-flex rounded-full border border-cream/30 px-6 py-3 text-[0.7rem] font-bold tracking-[0.12em] text-cream uppercase transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            Limpiar filtros
          </button>
        </div>
      )}
    </div>
  );
}

function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="font-mono w-20 shrink-0 text-[0.58rem] font-bold tracking-[0.14em] text-cream/40 uppercase">
        {label}
      </span>
      {children}
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
  dot,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  dot?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "font-mono inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-[0.66rem] font-bold tracking-[0.08em] uppercase transition",
        active
          ? "border-cream bg-cream text-ink"
          : "border-cream/20 text-cream/70 hover:border-cream/60",
      )}
    >
      {dot && <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: dot }} />}
      {children}
    </button>
  );
}
