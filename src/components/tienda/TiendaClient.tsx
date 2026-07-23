"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ProductCard } from "@/components/producto/ProductCard";
import { GeneroMark } from "@/components/ui/GeneroMark";
import { IconFilter, IconClose } from "@/components/ui/Icons";
import {
  PRODUCTS,
  CATEGORIES,
  EDITIONS,
  matchesGenero,
  type Category,
  type Genero,
  type EditionKey,
} from "@/lib/products";
import { cn } from "@/lib/utils";

// El género es CONTEXTO (ya entraste por una puerta), no una fila de filtros.
const GENERO_SEG: { key: Genero | "all"; label: string }[] = [
  { key: "all", label: "Todos" },
  { key: "hombre", label: "Hombre" },
  { key: "mujer", label: "Mujer" },
];

export function TiendaClient({ initialGenero = "all" }: { initialGenero?: Genero | "all" }) {
  const [genero, setGenero] = useState<Genero | "all">(initialGenero);
  const [category, setCategory] = useState<Category | "all">("all");
  const [territorio, setTerritorio] = useState<EditionKey | "all">("all");
  const [open, setOpen] = useState(false);

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

  const activeCount = (category !== "all" ? 1 : 0) + (territorio !== "all" ? 1 : 0);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const clearAll = () => {
    setCategory("all");
    setTerritorio("all");
  };

  return (
    <div className="mx-auto max-w-6xl px-5 pb-24 pt-10 md:px-8 md:pt-16">
      <p className="eyebrow mb-2 text-[var(--accent)]">Tienda · Fundadores 2026</p>
      <h1 className="font-condensed text-[clamp(2.2rem,6vw,4rem)] text-cream">
        La <span className="shine-gold">manada</span>
      </h1>

      {/* barra slim: género (contexto) + conteo + botón Filtros */}
      <div className="sticky top-14 z-[80] mt-5 flex items-center justify-between gap-3 border-y border-cream/10 bg-ink/90 py-3 sm:bg-ink/55 sm:backdrop-blur-md">
        <div className="flex items-center gap-1 rounded-full border border-cream/15 p-1">
          {GENERO_SEG.map((g) => (
            <button
              key={g.key}
              onClick={() => setGenero(g.key)}
              className={cn(
                "font-mono inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[0.64rem] font-bold tracking-[0.06em] uppercase transition sm:px-3",
                genero === g.key ? "bg-cream text-ink" : "text-cream/60 hover:text-cream",
              )}
            >
              {(g.key === "hombre" || g.key === "mujer") && (
                <GeneroMark genero={g.key} color="currentColor" className="hidden h-3.5 w-4 sm:inline-block" />
              )}
              {g.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <span className="font-mono hidden text-[0.7rem] font-bold tracking-[0.1em] text-cream/50 uppercase sm:block">
            {list.length} {list.length === 1 ? "pieza" : "piezas"}
          </span>
          <div className="relative">
            <button
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              className={cn(
                "font-mono inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[0.66rem] font-bold tracking-[0.1em] uppercase transition",
                activeCount
                  ? "border-[var(--accent)] text-[var(--accent)]"
                  : "border-cream/25 text-cream/80 hover:border-cream",
              )}
            >
              <IconFilter className="h-4 w-4" /> Filtros
              {activeCount > 0 && (
                <span className="grid h-4 min-w-4 place-items-center rounded-full bg-[var(--accent)] px-1 text-[0.58rem] font-bold text-[var(--accent-ink)]">
                  {activeCount}
                </span>
              )}
            </button>

            {/* panel de filtros — transparente (glass): dropdown en PC, bottom-sheet en móvil */}
            <AnimatePresence>
              {open && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setOpen(false)}
                    className="fixed inset-0 z-[100] bg-ink/60 sm:bg-transparent"
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 28 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 28 }}
                    transition={{ type: "tween", duration: 0.24, ease: [0.4, 0, 0.2, 1] }}
                    className="glass fixed inset-x-0 bottom-0 z-[101] max-h-[82svh] overflow-y-auto rounded-t-3xl p-6 sm:absolute sm:inset-x-auto sm:bottom-auto sm:right-0 sm:top-[calc(100%+10px)] sm:w-80 sm:rounded-2xl sm:p-5"
                  >
                    <div className="mb-4 flex items-center justify-between sm:hidden">
                      <span className="font-condensed text-2xl text-cream">Filtros</span>
                      <button onClick={() => setOpen(false)} aria-label="Cerrar filtros" className="text-cream/60">
                        <IconClose className="h-6 w-6" />
                      </button>
                    </div>

                    <FilterGroup label="Tipo">
                      {CATEGORIES.map((c) => (
                        <Chip key={c.key} active={category === c.key} onClick={() => setCategory(c.key)}>
                          {c.label}
                        </Chip>
                      ))}
                    </FilterGroup>

                    <FilterGroup label="Territorio">
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
                    </FilterGroup>

                    <div className="mt-5 flex items-center justify-between gap-3 border-t border-cream/10 pt-4">
                      <button
                        onClick={clearAll}
                        className="font-mono text-[0.66rem] font-bold tracking-[0.1em] text-cream/60 uppercase transition hover:text-cream"
                      >
                        Limpiar
                      </button>
                      <button
                        onClick={() => setOpen(false)}
                        className="font-mono rounded-full px-5 py-2.5 text-[0.66rem] font-bold tracking-[0.1em] uppercase transition hover:brightness-95"
                        style={{ backgroundColor: "var(--accent)", color: "var(--accent-ink)" }}
                      >
                        Ver {list.length} {list.length === 1 ? "pieza" : "piezas"}
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* chips de filtros activos */}
      {activeCount > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {category !== "all" && (
            <ActiveChip onRemove={() => setCategory("all")}>
              {CATEGORIES.find((c) => c.key === category)?.label}
            </ActiveChip>
          )}
          {territorio !== "all" && (
            <ActiveChip onRemove={() => setTerritorio("all")}>
              {EDITIONS.find((e) => e.key === territorio)?.name}
            </ActiveChip>
          )}
          <button
            onClick={clearAll}
            className="font-mono text-[0.62rem] font-bold tracking-[0.1em] text-cream/45 uppercase transition hover:text-cream"
          >
            Limpiar todo
          </button>
        </div>
      )}

      {/* grid — la ropa aparece de inmediato */}
      {list.length > 0 ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
              clearAll();
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

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-5 last:mb-0">
      <p className="font-mono mb-2.5 text-[0.58rem] font-bold tracking-[0.16em] text-cream/45 uppercase">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">{children}</div>
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
        "font-mono inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-[0.64rem] font-bold tracking-[0.06em] uppercase transition",
        active ? "border-cream bg-cream text-ink" : "border-cream/20 text-cream/70 hover:border-cream/60",
      )}
    >
      {dot && <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: dot }} />}
      {children}
    </button>
  );
}

function ActiveChip({ children, onRemove }: { children: React.ReactNode; onRemove: () => void }) {
  return (
    <span className="font-mono inline-flex items-center gap-1.5 rounded-full bg-cream/10 px-3 py-1.5 text-[0.62rem] font-bold tracking-[0.08em] text-cream uppercase">
      {children}
      <button onClick={onRemove} aria-label="Quitar filtro" className="grid h-4 w-4 place-items-center rounded-full bg-cream/15 hover:bg-cream/30">
        <IconClose className="h-3 w-3" />
      </button>
    </span>
  );
}
