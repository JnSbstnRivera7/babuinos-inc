"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatCOP, getEdition, inStock, type Genero, type Product } from "@/lib/products";
import { GeneroMark } from "@/components/ui/GeneroMark";
import { useCart } from "@/lib/store";
import { useWishlist } from "@/lib/wishlist";
import { useToast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { IconPlus, IconLeaf, IconHeart, IconGirar } from "@/components/ui/Icons";

const BADGES: Record<string, { label: string; cls: string }> = {
  new: { label: "Nuevo", cls: "bg-teal text-white" },
  hot: { label: "Hot", cls: "bg-gold text-ink" },
  last: { label: "Últimas", cls: "bg-burgundy text-white" },
};

export function ProductCard({
  product,
  viewGenero = "all",
}: {
  product: Product;
  /** Género en contexto (p.ej. filtro de tienda) para elegir el modelo de la card. */
  viewGenero?: Genero | "all";
}) {
  const add = useCart((s) => s.add);
  const openCart = useCart((s) => s.open);
  const showToast = useToast((s) => s.show);
  const saved = useWishlist((s) => s.ids.includes(product.slug));
  const toggleWish = useWishlist((s) => s.toggle);
  const [size, setSize] = useState("");
  // La card GIRA para enseñar la espalda. Hace falta porque el gráfico de
  // estas piezas vive atrás: una grilla que solo muestra el frente enseña
  // siete camisas lisas. En escritorio ya giraba al pasar el mouse, pero en
  // el teléfono no hay mouse y no había forma de ver el estampado sin entrar.
  const [vuelta, setVuelta] = useState(false);

  const available = inStock(product);
  const badge = product.badge ? BADGES[product.badge] : null;

  // Se lleva el género en contexto a la ficha (?g=), para que abrir una pieza
  // desde la línea Mujer no la muestre en modelo hombre.
  const href =
    viewGenero === "hombre" || viewGenero === "mujer"
      ? `/producto/${product.slug}?g=${viewGenero}`
      : `/producto/${product.slug}`;

  // Modelo a mostrar: el del contexto (Hombre/Mujer) si existe; si no, el de la
  // ficha (mujer → mujer, resto → hombre). Fallback a la prenda sola.
  const cardGenero: "hombre" | "mujer" =
    viewGenero === "hombre" || viewGenero === "mujer"
      ? viewGenero
      : product.genero === "mujer"
        ? "mujer"
        : "hombre";
  // En móvil manda la PRENDA, salvo que se haya elegido línea. Las 24 piezas
  // son unisex: Hombre/Mujer no filtra nada, lo único que cambia es con qué
  // modelo se ve. Si en móvil siempre se enseña la prenda, esos dos botones no
  // hacen nada visible y parecen rotos — que es justo lo que pasaba.
  const lineaElegida = viewGenero === "hombre" || viewGenero === "mujer";
  const shots = product.models?.[cardGenero] ?? product.models?.hombre ?? product.models?.mujer;
  const useModel = Boolean(shots);
  const frontSrc = shots?.frontal ?? product.image;
  const backSrc = shots?.espalda ?? product.image;

  function handleAdd() {
    if (!available) return;
    if (!size) {
      showToast("Elige una talla primero");
      return;
    }
    // El género del modelo que se está viendo en la card (contexto o el de la pieza).
    if (!add(product, size, cardGenero)) {
      showToast(`Talla ${size}: no queda más stock`);
      return;
    }
    showToast(`${product.name} · ${size} a la mochila`);
    openCart();
  }

  return (
    <article
      data-vuelta={vuelta ? "si" : "no"}
      className="group relative flex h-full flex-col overflow-hidden rounded-[var(--radius-md)] bg-white shadow-[0_8px_40px_rgba(30,32,33,.12)]"
    >
      <button
        type="button"
        onClick={() => toggleWish(product.slug)}
        aria-label={saved ? "Quitar de favoritos" : "Guardar en favoritos"}
        aria-pressed={saved}
        className="absolute right-2 top-2 z-10 grid h-11 w-11 place-items-center rounded-full bg-white/90 shadow-[0_2px_10px_rgba(30,32,33,.18)] transition hover:scale-110"
      >
        <IconHeart
          className="h-[18px] w-[18px]"
          style={{ color: saved ? "#c0392b" : "#1e2021" }}
          fill={saved ? "currentColor" : "none"}
        />
      </button>
      {/* Botón de girar. Va FUERA del enlace: un button dentro de un link no
          es HTML válido, y además así el dedo elige — girar o entrar. */}
      <button
        type="button"
        onClick={() => setVuelta((v) => !v)}
        aria-label={vuelta ? `Ver el frente de ${product.name}` : `Ver la espalda de ${product.name}`}
        aria-pressed={vuelta}
        // Abajo a la izquierda: arriba choca con el sello de "Nuevo" y abajo a la
        // derecha está la marca de género. Es la única esquina libre.
        className="absolute bottom-2 left-2 z-10 grid h-11 w-11 place-items-center rounded-full bg-white/90 shadow-[0_2px_10px_rgba(30,32,33,.18)] transition hover:scale-110 active:scale-95"
      >
        <IconGirar className={cn("h-[18px] w-[18px] text-ink transition-transform duration-500", vuelta && "rotate-180")} />
      </button>

      <div className="relative aspect-[4/5] w-full shrink-0 overflow-hidden bg-[#eceae6]">
      <Link
        href={href}
        aria-label={`Ver ${product.name}`}
        className="absolute inset-0 block"
      >
        {/* EL CRUCE ES UN DIFUMINADO, no un giro de carta. El giro 3D depende
            de `backface-visibility` y de la perspectiva, y en los navegadores
            de teléfono se ve a tirones; el desenfoque cruzado es la misma idea
            —una cara se va, la otra llega— y se comporta igual en todas
            partes. Lo maneja `data-vuelta` en el <article>, así el mismo
            estado sirve para el botón y para el mouse. */}
        <div
          className={cn(
            "absolute inset-0 transition-[opacity,filter,transform] duration-[450ms] ease-out",
            "group-hover:scale-[1.03] group-hover:opacity-0 group-hover:blur-md",
            "group-data-[vuelta=si]:scale-[1.03] group-data-[vuelta=si]:opacity-0 group-data-[vuelta=si]:blur-md",
          )}
        >
          {/* En móvil manda la prenda; con línea elegida, el modelo. El `sizes`
              de 1px en el que queda oculto NO es un adorno: sin eso el
              navegador se baja las dos versiones y el móvil paga el doble. */}
          <Image
            src={product.image}
            alt={`${product.name} — ${product.colorway}`}
            fill
            sizes={lineaElegida ? "1px" : "(max-width:639px) 46vw, 1px"}
            className={cn("object-contain p-3", lineaElegida ? "hidden" : "sm:hidden")}
          />
          <Image
            src={frontSrc}
            alt={`${product.name} — ${product.colorway}`}
            fill
            sizes={
              lineaElegida
                ? "(max-width:639px) 46vw, (max-width:1024px) 45vw, 30vw"
                : "(max-width:639px) 1px, (max-width:1024px) 45vw, 30vw"
            }
            className={cn(
              lineaElegida ? "block" : "hidden sm:block",
              useModel ? "object-cover" : "object-contain p-2",
            )}
          />
        </div>
        {badge && (
          <span
            className={cn(
              "font-mono absolute left-4 top-4 rounded-full px-3 py-1 text-[0.58rem] font-bold tracking-[0.12em] uppercase",
              badge.cls,
            )}
          >
            {badge.label}
          </span>
        )}
        <span className="absolute bottom-3 right-3 grid h-11 w-11 place-items-center rounded-full bg-cream shadow-[0_4px_14px_rgba(30,32,33,.18)]">
          <GeneroMark genero={product.genero} color={getEdition(product.edition).accent} className="w-6" />
        </span>
        {!available && (
          <span className="absolute inset-0 grid place-items-center bg-ink/45">
            <span className="font-mono rounded-full bg-ink px-4 py-1.5 text-[0.62rem] font-bold tracking-[0.16em] text-cream uppercase">
              Agotado
            </span>
          </span>
        )}
      </Link>

        {/* LA ESPALDA, que es donde vive el gráfico. Llega enfocándose
            mientras el frente se va. */}
        <div
          aria-hidden
          className={cn(
            // pointer-events-none: esta capa tapa el enlace, y sin esto, con la
            // card difuminada el dedo golpea el div y tocar la camisa no lleva
            // a ninguna parte.
            "pointer-events-none absolute inset-0 scale-[1.03] opacity-0 blur-md transition-[opacity,filter,transform] duration-[450ms] ease-out",
            "group-hover:scale-100 group-hover:opacity-100 group-hover:blur-0",
            "group-data-[vuelta=si]:scale-100 group-data-[vuelta=si]:opacity-100 group-data-[vuelta=si]:blur-0",
          )}
        >
          <Image
            src={product.images[0] ?? product.image}
            alt=""
            fill
            sizes={lineaElegida ? "1px" : "(max-width:639px) 46vw, 1px"}
            className={cn("object-contain p-3", lineaElegida ? "hidden" : "sm:hidden")}
          />
          <Image
            src={backSrc}
            alt=""
            fill
            sizes={
              lineaElegida
                ? "(max-width:639px) 46vw, (max-width:1024px) 45vw, 30vw"
                : "(max-width:639px) 1px, (max-width:1024px) 45vw, 30vw"
            }
            className={cn(
              lineaElegida ? "block" : "hidden sm:block",
              useModel ? "object-cover" : "object-contain p-2",
            )}
          />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-3 sm:p-5">
        <Link href={href} className="block">
          <div className="font-mono text-[0.55rem] font-bold tracking-[0.14em] text-teal uppercase sm:text-[0.6rem] sm:tracking-[0.16em]">
            {product.tag}
          </div>
          <div className="mt-1.5 flex items-baseline justify-between gap-2">
            <h3 className="font-display text-[0.95rem] leading-tight font-black text-ink transition group-hover:text-teal sm:text-lg">
              {product.name}
            </h3>
            {typeof product.price === "number" && (
              <span className="font-mono shrink-0 text-[0.78rem] font-bold text-ink tabular-nums sm:text-[0.9rem]">
                {formatCOP(product.price)}
              </span>
            )}
          </div>
        </Link>
        {/* /55 daba 3.71:1 — es el copy que vende, tiene que leerse */}
        <p className="mt-1.5 line-clamp-2 hidden text-[0.85rem] leading-relaxed text-ink/75 sm:block">
          {product.desc}
        </p>

        {/* De aquí abajo, NADA en móvil. A 157 px de ancho las cinco tallas de
            44 px se parten en tres filas y la card se vuelve un formulario;
            el que compra desde la grilla toca la foto y elige en la ficha, que
            es donde además ve el modelo. */}
        <div className="mt-4 hidden items-center justify-between sm:flex">
          {/* /45 daba 2.81:1 a 10px — bajo el mínimo AA de 4.5 */}
          <span className="font-mono text-[0.68rem] font-bold tracking-[0.12em] text-ink/70 uppercase">
            {product.colorway}
          </span>
          <span className="font-mono inline-flex items-center gap-1.5 rounded-full bg-teal/10 px-2.5 py-1 text-[0.55rem] font-bold tracking-[0.1em] text-teal uppercase">
            <IconLeaf className="h-3 w-3" /> Sostenible
          </span>
        </div>

        {/* size pills — 44px: son el control con el que se decide la compra
            desde la grilla y estaban en 32, doce por debajo del mínimo */}
        <div className="mt-4 hidden flex-wrap gap-1.5 sm:flex">
          {product.sizes.map((s) => {
            const soldOut = s.stock === 0;
            return (
              <button
                key={s.size}
                type="button"
                disabled={soldOut}
                onClick={() => setSize(s.size)}
                aria-pressed={size === s.size}
                aria-label={`Talla ${s.size}${soldOut ? " — agotada" : ""}`}
                className={cn(
                  "font-mono grid h-11 min-w-11 place-items-center rounded-md border px-2 text-[0.75rem] font-bold transition",
                  soldOut
                    ? "cursor-not-allowed border-ink/10 text-ink/25 line-through"
                    : size === s.size
                      ? "border-ink bg-ink text-cream"
                      : "border-ink/20 text-ink/70 hover:border-ink",
                )}
              >
                {s.size}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={handleAdd}
          disabled={!available}
          className="font-mono mt-4 hidden min-h-11 w-full items-center justify-center gap-2 rounded-md bg-ink px-5 text-[0.72rem] font-bold tracking-[0.1em] text-cream uppercase transition hover:-translate-y-0.5 hover:bg-teal active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-ink/15 disabled:text-ink/40 disabled:hover:translate-y-0 sm:flex"
        >
          <IconPlus className="h-4 w-4" /> {available ? "A la mochila" : "Agotado"}
        </button>

        {/* El equivalente en móvil: una sola acción, ir a la ficha. */}
        <Link
          href={href}
          className="font-mono mt-3 flex min-h-11 w-full items-center justify-center rounded-md border border-ink/20 px-2 text-center text-[0.62rem] leading-tight font-bold tracking-[0.08em] text-ink uppercase transition active:scale-[0.98] sm:hidden"
        >
          {available ? "Elegir talla" : "Agotado"}
        </Link>
      </div>
    </article>
  );
}
