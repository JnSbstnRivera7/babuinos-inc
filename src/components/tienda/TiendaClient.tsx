"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ProductCard } from "@/components/producto/ProductCard";
import { GeneroMark } from "@/components/ui/GeneroMark";
import { IconFilter, IconClose } from "@/components/ui/Icons";
import {
  PRODUCTS,
  CATEGORIES,
  PROMOS,
  coloresEnUso,
  formatCOP,
  getColor,
  matchesGenero,
  type Category,
  type Genero,
} from "@/lib/products";
import { cn } from "@/lib/utils";
import { scrollToTop } from "@/lib/scroll";

// El género es CONTEXTO (ya entraste por una puerta), no una fila de filtros.
const GENERO_SEG: { key: Genero | "all"; label: string }[] = [
  { key: "all", label: "Todos" },
  { key: "hombre", label: "Hombre" },
  { key: "mujer", label: "Mujer" },
];

export function TiendaClient({
  initialGenero = "all",
  initialTipo = "all",
}: {
  initialGenero?: Genero | "all";
  initialTipo?: Category | "all";
}) {
  const [genero, setGenero] = useState<Genero | "all">(initialGenero);
  const [category, setCategory] = useState<Category | "all">(initialTipo);
  const [color, setColor] = useState<string | "all">("all");
  const [open, setOpen] = useState(false);

  const list = useMemo(
    () =>
      PRODUCTS.filter(
        (p) =>
          matchesGenero(p, genero) &&
          (category === "all" || p.category === category) &&
          (color === "all" || p.color === color),
      ),
    [genero, category, color],
  );

  // El tipo ya se ve en la barra, así que el contador del panel solo cuenta
  // lo que sigue adentro (color).
  const activeCount = color !== "all" ? 1 : 0;

  /** Cuántas piezas hay en cada tipo dentro de la línea que se está viendo. */
  const countBy = (key: Category | "all", g: Genero | "all") =>
    PRODUCTS.filter((p) => matchesGenero(p, g) && (key === "all" || p.category === key)).length;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Al entrar a la tienda (o cambiar de género vía URL → remonta por key) arranca desde arriba.
  useEffect(() => {
    scrollToTop(false);
  }, []);

  const pickGenero = (k: Genero | "all") => {
    setGenero(k);
    scrollToTop();
  };

  const pickCategory = (k: Category | "all") => {
    setCategory(k);
    scrollToTop();
  };

  const clearAll = () => {
    setColor("all");
  };

  return (
    <div className="mx-auto max-w-6xl px-5 pb-24 pt-10 md:px-8 md:pt-16">
      <p className="eyebrow mb-2 text-[var(--accent)]">Tienda · Fundadores 2026</p>
      <h1 className="font-condensed text-[clamp(2.2rem,6vw,4rem)] text-cream">
        La <span className="shine-gold">manada</span>
      </h1>

      {/* Banner de promos por combo */}
      <div className="mt-4 flex flex-wrap gap-2">
        <span className="font-mono inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/45 bg-[var(--accent)]/10 px-3.5 py-1.5 text-[0.62rem] font-bold tracking-[0.06em] text-[var(--accent)] uppercase">
          🔥 3 básicas {formatCOP(PROMOS.basica.precio)}
        </span>
        <span className="font-mono inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/45 bg-[var(--accent)]/10 px-3.5 py-1.5 text-[0.62rem] font-bold tracking-[0.06em] text-[var(--accent)] uppercase">
          🔥 2 estampadas {formatCOP(PROMOS.estampada.precio)}
        </span>
      </div>

      {/**
       * Básicas vs Estampadas: la decisión principal del cliente, así que va a
       * la vista y no dentro del panel de Filtros.
       *
       * Son PESTAÑAS, no píldoras. Como píldoras los tres necesitaban 363px y
       * solo hay 335 en un celular, así que "Estampadas" caía a una segunda fila
       * y se veía apilado. Con flex-1 cada una toma un tercio y el clamp encoge
       * el texto, así que siempre entran en UNA fila. De paso ya no se confunden
       * con el segmentado Hombre/Mujer de abajo, que sí es de píldoras.
       */}
      <div role="tablist" aria-label="Tipo de prenda" className="mt-6 flex border-b border-cream/15">
        {CATEGORIES.map((c) => {
          const activa = category === c.key;
          return (
            <button
              key={c.key}
              role="tab"
              aria-selected={activa}
              onClick={() => pickCategory(c.key)}
              className={cn(
                "font-condensed relative flex min-h-12 flex-1 items-center justify-center gap-1.5 px-1 text-[clamp(0.95rem,3.6vw,1.25rem)] leading-none uppercase transition",
                activa ? "text-cream" : "text-cream/60 hover:text-cream",
              )}
            >
              {c.label}
              <span className="font-mono text-[0.55rem] opacity-70">{countBy(c.key, genero)}</span>
              {activa && (
                <span
                  aria-hidden
                  className="absolute inset-x-0 -bottom-px h-[3px] rounded-full bg-[var(--accent)]"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* barra slim: género (contexto) + conteo + botón Filtros */}
      {/* A 320px el grupo de género (232px) + el botón (111px) no caben en los
          280 disponibles y con justify-between + nowrap el botón de Filtros
          quedaba CORTADO por el borde. Ahora el género puede encogerse y
          deslizarse, y el botón nunca se encoge. */}
      <div className="sticky top-14 z-[80] mt-3 flex items-center justify-between gap-2 border-b border-cream/10 bg-ink/90 py-3 sm:gap-3 sm:bg-ink/55 sm:backdrop-blur-md">
        <div className="no-scrollbar flex min-w-0 items-center gap-1 overflow-x-auto rounded-full border border-cream/15 p-1">
          {GENERO_SEG.map((g) => (
            <button
              key={g.key}
              onClick={() => pickGenero(g.key)}
              className={cn(
                "font-mono inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-full px-3 text-[0.68rem] font-bold tracking-[0.06em] uppercase transition sm:px-4",
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

        <div className="flex shrink-0 items-center gap-3">
          <span className="font-mono hidden text-[0.7rem] font-bold tracking-[0.1em] text-cream/50 uppercase sm:block">
            {list.length} {list.length === 1 ? "pieza" : "piezas"}
          </span>
          <div className="relative">
            <button
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-label="Filtros"
              className={cn(
                "font-mono inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-full border px-3 text-[0.66rem] font-bold tracking-[0.1em] uppercase transition sm:px-4",
                activeCount
                  ? "border-[var(--accent)] text-[var(--accent)]"
                  : "border-cream/25 text-cream/80 hover:border-cream",
              )}
            >
              {/* En celular solo el ícono: la palabra costaba ~60px de los 280 */}
              <IconFilter className="h-4 w-4" /> <span className="hidden sm:inline">Filtros</span>
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
                    /* pb con safe-area: sin esto la fila de Limpiar/Ver queda
                       debajo de la barra de gestos del celular. */
                    style={{ paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))" }}
                    className="glass fixed inset-x-0 bottom-0 z-[101] max-h-[82svh] overflow-y-auto rounded-t-3xl p-6 sm:absolute sm:inset-x-auto sm:bottom-auto sm:right-0 sm:top-[calc(100%+10px)] sm:w-80 sm:rounded-2xl sm:p-5"
                  >
                    <div className="mb-4 flex items-center justify-between sm:hidden">
                      <span className="font-condensed text-2xl text-cream">Filtros</span>
                      <button onClick={() => setOpen(false)} aria-label="Cerrar filtros" className="text-cream/60">
                        <IconClose className="h-6 w-6" />
                      </button>
                    </div>

                    {/* "Tipo" (Básicas/Estampadas) ya vive en la barra de arriba. */}
                    <FilterGroup label="Color">
                      <Chip active={color === "all"} onClick={() => setColor("all")}>
                        Todos
                      </Chip>
                      {coloresEnUso().map((c) => (
                        <Chip
                          key={c.key}
                          active={color === c.key}
                          onClick={() => setColor(c.key)}
                          dot={c.hex}
                        >
                          {c.label}
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
                        onClick={() => {
                          setOpen(false);
                          scrollToTop();
                        }}
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

      {/* chips de filtros activos (el tipo no: ya se ve marcado en la barra) */}
      {activeCount > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {color !== "all" && (
            <ActiveChip onRemove={() => setColor("all")}>
              {getColor(color)?.label}
            </ActiveChip>
          )}
          <button
            onClick={clearAll}
            className="font-mono min-h-11 text-[0.68rem] font-bold tracking-[0.1em] text-cream/70 uppercase transition hover:text-cream"
          >
            Limpiar todo
          </button>
        </div>
      )}

      {/* grid — la ropa aparece de inmediato.
          El h2 cierra el salto h1→h3: los nombres de las piezas son h3 y antes
          no había ningún h2 en medio. */}
      {list.length > 0 ? (
        <div className="mt-8">
          <h2 className="sr-only">
            {category === "basica"
              ? "Básicas"
              : category === "estampada"
                ? "Estampadas"
                : "Todas las piezas"}
            {genero !== "all" && genero !== "unisex" ? ` — línea ${genero}` : ""}
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((p) => (
              <ProductCard key={p.id} product={p} viewGenero={genero} />
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-16 text-center">
          <p className="font-condensed text-[clamp(1.6rem,5vw,2.6rem)] text-cream/80">
            {category === "basica" ? "Básicas en camino" : "Nada por acá… todavía"}
          </p>
          <p className="mt-2 text-cream/55">
            {category === "basica"
              ? "Algodón pesado, sin estampado, puro fit. Entérate primero por el Club."
              : "Prueba con otro tipo, otra línea u otro color."}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {category === "basica" && (
              <Link
                href="/club"
                className="font-mono inline-flex rounded-full px-6 py-3 text-[0.7rem] font-bold tracking-[0.12em] uppercase transition hover:brightness-95"
                style={{ backgroundColor: "var(--accent)", color: "var(--accent-ink)" }}
              >
                Avísame cuando lleguen
              </Link>
            )}
            <button
              onClick={() => {
                setGenero("all");
                setCategory("all");
                clearAll();
              }}
              className="font-mono inline-flex rounded-full border border-cream/30 px-6 py-3 text-[0.7rem] font-bold tracking-[0.12em] text-cream uppercase transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              Ver todo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-5 last:mb-0">
      <p className="font-mono mb-2.5 text-[0.64rem] font-bold tracking-[0.16em] text-cream/70 uppercase">
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
