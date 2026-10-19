"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePresence } from "@/lib/presence";
import { ProductCard } from "@/components/producto/ProductCard";
import { ArchivoRetro, menosMovimiento, type ArchivoMando } from "@/components/tienda/ArchivoRetro";
import { GeneroMark } from "@/components/ui/GeneroMark";
import { IconFilter, IconClose } from "@/components/ui/Icons";
import {
  PRODUCTS,
  CATEGORIES,
  COLECCIONES,
  coloresEnUso,
  getColor,
  matchesGenero,
  withStockAll,
  type Category,
  type Coleccion,
  type Genero,
  type Product,
  type StockMap,
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
  stockMap,
}: {
  initialGenero?: Genero | "all";
  initialTipo?: Category | "all";
  /** Tallaje real desde /admin; sin él manda el provisional del catálogo. */
  stockMap?: StockMap;
}) {
  const [genero, setGenero] = useState<Genero | "all">(initialGenero);
  const [category, setCategory] = useState<Category | "all">(initialTipo);
  const [color, setColor] = useState<string | "all">("all");
  const [open, setOpen] = useState(false);
  const panel = usePresence(open, 240);

  const catalogo = useMemo(() => withStockAll(PRODUCTS, stockMap), [stockMap]);

  const list = useMemo(
    () =>
      catalogo.filter(
        (p) =>
          matchesGenero(p, genero) &&
          (category === "all" || p.category === category) &&
          (color === "all" || p.color === color),
      ),
    [catalogo, genero, category, color],
  );

  // El archivo (Fundadores) con los filtros de ahora: alimenta la tarjeta de
  // abajo y el atajo de arriba, que solo aparecen si queda alguna pieza.
  const fundadores = useMemo(() => list.filter((p) => p.coleccion === "fundadores"), [list]);
  const archivo = useRef<ArchivoMando>(null);
  const defArchivo = COLECCIONES.find((c) => c.key === "fundadores");

  /**
   * El atajo al archivo. La colección vieja vive al final, detrás de la cinta,
   * a propósito (lo nuevo no entierra lo viejo, pero tampoco al revés); el
   * problema era que desde arriba nadie sabía que existía. Este enlace lo dice
   * y lleva hasta allá, con la cinta ya rebobinando.
   * El #archivo queda en la URL para poder compartirla abierta.
   */
  const irAlArchivo = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.history.replaceState(null, "", "#archivo");
    document
      .getElementById("archivo")
      ?.scrollIntoView({ behavior: menosMovimiento() ? "auto" : "smooth", block: "start" });
    archivo.current?.abrir();
  };

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
  // Menos cuando se llega a /tienda#archivo: ahí el navegador ya bajó hasta la cinta.
  useEffect(() => {
    if (window.location.hash === "#archivo") return;
    scrollToTop(false);
  }, []);

  const pickGenero = (k: Genero | "all") => {
    // SIN scrollToTop, a diferencia del tipo: las 24 piezas son unisex, así que
    // elegir línea no cambia la lista — solo con qué modelo se enseña. Saltar
    // al inicio por un cambio que no mueve la rejilla se siente como un fallo:
    // tocas el botón, la página pega un brinco y "no pasa nada".
    setGenero(k);
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
      <p className="eyebrow mb-2 text-[var(--accent)]">Tienda · Expedición 2026</p>
      <div className="flex items-end justify-between gap-3">
        <h1 className="font-condensed text-[clamp(2.2rem,6vw,4rem)] text-cream">
          La <span className="shine-gold">manada</span>
        </h1>
        {fundadores.length > 0 && (
          <a
            href="#archivo"
            onClick={irAlArchivo}
            aria-label={`Ir al archivo: colección Fundadores, ${fundadores.length} ${fundadores.length === 1 ? "pieza" : "piezas"}`}
            className="font-mono mb-2 inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border border-cream/25 bg-ink/50 px-4 text-[0.64rem] font-bold tracking-[0.1em] text-cream/85 uppercase transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            <span aria-hidden className="text-[0.8rem] leading-none">
              ◀◀
            </span>
            Archivo
            <span className="tabular-nums text-cream/50">{fundadores.length}</span>
          </a>
        )}
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

            {/* panel de filtros — transparente (glass): dropdown en PC, bottom-sheet en móvil.
                Entra y sale con CSS (`usePresence` monta y prende data-abierto). */}
            {panel.render && (
              <>
                <div
                  data-abierto={panel.abierto}
                  onClick={() => setOpen(false)}
                  className="fixed inset-0 z-[100] bg-ink/60 opacity-0 transition-opacity duration-240 data-[abierto=true]:opacity-100 sm:bg-transparent"
                />
                <div
                  data-abierto={panel.abierto}
                  /* pb con safe-area: sin esto la fila de Limpiar/Ver queda
                     debajo de la barra de gestos del celular. */
                  style={{ paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))" }}
                  className="glass fixed inset-x-0 bottom-0 z-[101] max-h-[82svh] translate-y-7 overflow-y-auto rounded-t-3xl p-6 opacity-0 transition duration-240 ease-[cubic-bezier(.4,0,.2,1)] data-[abierto=true]:translate-y-0 data-[abierto=true]:opacity-100 sm:absolute sm:inset-x-auto sm:bottom-auto sm:right-0 sm:top-[calc(100%+10px)] sm:w-80 sm:rounded-2xl sm:p-5"
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
                </div>
              </>
            )}
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

      {/* La tienda va POR COLECCIONES, no en una grilla corrida.
          Antes eran 17 piezas seguidas y una básica quedaba pegada a una
          estampada sin nada que las separara. Ahora cada tanda tiene su
          cabecera y su aire, y la anterior vive detrás del botón de archivo:
          sacar algo nuevo deja de enterrar lo viejo. */}
      {list.length > 0 ? (
        <div className="mt-8">
          {VIGENTES.map((key) => (
            <SeccionColeccion
              key={key}
              coleccion={key}
              items={list.filter((p) => p.coleccion === key)}
              genero={genero}
            />
          ))}

          {fundadores.length > 0 && defArchivo && (
            <ArchivoRetro
              ref={archivo}
              id="archivo"
              titulo={defArchivo.label}
              bajada={defArchivo.tagline}
              cuantas={fundadores.length}
              portadas={fundadores.map((p) => ({ src: p.images[0] ?? p.image, alt: p.name }))}
              etiqueta="Rebobinar al archivo"
              etiquetaAbierto="Cerrar el archivo"
              anio={defArchivo.anio}
            >
              {/* Sin cabecera: la tarjeta del archivo ya dice nombre, piezas y bajada. */}
              <SeccionColeccion
                coleccion="fundadores"
                items={fundadores}
                genero={genero}
                conCabecera={false}
              />
            </ArchivoRetro>
          )}
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

/** Las que se muestran siempre, en este orden. El resto va al archivo. */
const VIGENTES: Coleccion[] = ["expedicion", "basicas"];

/**
 * Una tanda del catálogo, con cabecera propia.
 *
 * La grilla va a DOS COLUMNAS desde el móvil: a una sola, cada card ocupaba
 * una pantalla entera y ver seis piezas eran seis scrollazos. A dos se ve el
 * conjunto, que es como se compra ropa. Por eso la card de móvil enseña la
 * prenda sola y no el modelo — a 157 px el modelo no deja ver el estampado.
 */
function SeccionColeccion({
  coleccion,
  items,
  genero,
  conCabecera = true,
}: {
  coleccion: Coleccion;
  items: Product[];
  genero: Genero | "all";
  /** Sin cabecera cuando otra pieza ya la dice (la tarjeta del archivo). */
  conCabecera?: boolean;
}) {
  if (!items.length) return null;
  const def = COLECCIONES.find((c) => c.key === coleccion);
  if (!def) return null;

  return (
    <section className="mt-14 first:mt-0">
      {conCabecera && (
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b border-cream/10 pb-4">
          <h2 className="font-condensed text-[clamp(1.5rem,4vw,2.4rem)] leading-none text-cream">
            {def.label}
          </h2>
          <span
            className="font-mono text-[0.6rem] font-bold tracking-[0.14em] uppercase"
            style={{ color: def.accent }}
          >
            {items.length} {items.length === 1 ? "pieza" : "piezas"}
          </span>
          <p className="w-full text-[0.85rem] leading-relaxed text-cream/60 sm:w-auto sm:flex-1">
            {def.tagline}
          </p>
        </div>
      )}
      <div className={cn("grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3", conCabecera && "mt-6")}>
        {items.map((p) => (
          <ProductCard key={p.id} product={p} viewGenero={genero} />
        ))}
      </div>
    </section>
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
