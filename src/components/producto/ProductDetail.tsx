"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  getEdition,
  inStock,
  PRODUCTS,
  type Product,
} from "@/lib/products";
import { ProductCard } from "@/components/producto/ProductCard";
import { BaboonMark } from "@/components/ui/BaboonMark";
import { useCart } from "@/lib/store";
import { useWishlist } from "@/lib/wishlist";
import { useToast } from "@/lib/toast";
import { buildSizeMessage, buildWaLink } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";
import { IconWhatsApp, IconPlus, IconLeaf, IconHeart } from "@/components/ui/Icons";
import { GeneroMark } from "@/components/ui/GeneroMark";

/**
 * Medidas de REFERENCIA para tee oversize de mercado (algodón pesado, hombro
 * caído), en cm sobre la prenda estirada plana. No están medidas pieza por
 * pieza: por eso la guía las muestra como referencia con tolerancia ±2 cm y
 * ofrece pedir las exactas por WhatsApp.
 *
 * Cuando Juan mida el inventario real, reemplazar estos números y quitar el
 * aviso de "referencia" del modal.
 */
const SIZE_GUIDE = [
  { size: "S", ancho: 54, largo: 68, hombro: 50, manga: 21 },
  { size: "M", ancho: 57, largo: 71, hombro: 53, manga: 22 },
  { size: "L", ancho: 60, largo: 73, hombro: 56, manga: 23 },
  { size: "XL", ancho: 63, largo: 76, hombro: 59, manga: 24 },
  { size: "2XL", ancho: 66, largo: 78, hombro: 62, manga: 25 },
  { size: "3XL", ancho: 69, largo: 80, hombro: 65, manga: 26 },
];

/**
 * Lee `?g=` de la URL sin `useSearchParams`: ese hook obliga a envolver la ficha
 * en Suspense y la deja renderizando en el cliente (adiós HTML prerenderizado de
 * cada producto). Con useSyncExternalStore la hidratación usa el snapshot del
 * servidor (null) y React corrige al valor real en el cliente, sin desajuste.
 */
function useLinkGender(): string | null {
  return useSyncExternalStore(
    () => () => {}, // no hay a qué suscribirse: cambiar de ?g= remonta la ficha
    () => new URLSearchParams(window.location.search).get("g"),
    () => null,
  );
}

export function ProductDetail({ product }: { product: Product }) {
  const add = useCart((s) => s.add);
  const openCart = useCart((s) => s.open);
  const showToast = useToast((s) => s.show);
  const saved = useWishlist((s) => s.ids.includes(product.slug));
  const toggleWish = useWishlist((s) => s.toggle);
  const [size, setSize] = useState("");
  const [active, setActive] = useState(0);
  const [guide, setGuide] = useState(false);
  const [zoom, setZoom] = useState(false);
  // Género del modelo en la galería. Manda lo que el usuario elija con el
  // toggle; si no ha elegido, el de la línea por la que llegó (?g=hombre|mujer,
  // que pone ProductCard) y en último caso el de la pieza. Venir de Mujer y ver
  // el modelo hombre era el bug.
  const [pickedGender, setPickedGender] = useState<"hombre" | "mujer" | null>(null);
  const linkGender = useLinkGender();
  const modelGender: "hombre" | "mujer" =
    pickedGender ??
    (linkGender === "hombre" || linkGender === "mujer"
      ? linkGender
      : product.genero === "mujer"
        ? "mujer"
        : "hombre");

  const edition = getEdition(product.edition);
  const linea = product.category === "basica" ? "Básicas" : "Colección Fundadores";
  const available = inStock(product);
  const hasModels = Boolean(product.models?.hombre || product.models?.mujer);

  // Galería: primero la camisa PUESTA (frente/lateral/espalda del género
  // elegido), luego la prenda sola. Misma longitud en ambos géneros, así el
  // toggle conserva el ángulo activo.
  const gallery = useMemo<{ src: string; fit: "cover" | "contain"; label: string }[]>(() => {
    const m = product.models?.[modelGender];
    const worn = m
      ? [
          { src: m.frontal, fit: "cover" as const, label: "Frente" },
          { src: m.lateral, fit: "cover" as const, label: "Lateral" },
          { src: m.espalda, fit: "cover" as const, label: "Espalda" },
        ]
      : [];
    const flat = (product.images.length ? product.images : [product.image]).map((src) => ({
      src,
      fit: "contain" as const,
      label: "Prenda",
    }));
    return [...worn, ...flat];
  }, [product.models, product.images, product.image, modelGender]);

  const safeActive = Math.min(active, gallery.length - 1);
  const activeShot = gallery[safeActive];
  const related = PRODUCTS.filter((p) => p.slug !== product.slug).slice(0, 3);

  const goPrev = useCallback(
    () => setActive((i) => (i - 1 + gallery.length) % gallery.length),
    [gallery.length],
  );
  const goNext = useCallback(() => setActive((i) => (i + 1) % gallery.length), [gallery.length]);

  /* Deslizar con el dedo para cambiar de foto. `swiped` evita que el gesto
     termine abriendo el zoom (el click llega después del touchend). */
  const touchX = useRef<number | null>(null);
  const swiped = useRef(false);

  const onTouchStart = (e: React.TouchEvent) => {
    touchX.current = e.touches[0].clientX;
    swiped.current = false;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const from = touchX.current;
    touchX.current = null;
    if (from === null || gallery.length < 2) return;
    const dx = e.changedTouches[0].clientX - from;
    if (Math.abs(dx) < 40) return; // un toque, no un desliz
    swiped.current = true;
    if (dx < 0) goNext();
    else goPrev();
  };

  // Teclado: flechas navegan la galería; en el zoom, Esc además cierra.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (zoom && e.key === "Escape") setZoom(false);
      else if (e.key === "ArrowRight") goNext();
      else if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [zoom, goNext, goPrev]);

  function requireSize(): boolean {
    if (!size) {
      showToast("Elige una talla primero");
      return false;
    }
    return true;
  }

  function addToBag() {
    if (!available || !requireSize()) return;
    if (!add(product, size)) {
      showToast(`Talla ${size}: no queda más stock`);
      return;
    }
    showToast(`${product.name} · ${size} a la mochila`);
    openCart();
  }


  return (
    <div className="mx-auto max-w-6xl px-5 pb-24 pt-8 md:px-8 md:pt-12">
      {/* breadcrumb */}
      <nav className="font-mono mb-8 flex items-center gap-2 text-[0.68rem] tracking-[0.1em] text-cream/70 uppercase">
        <Link href="/" className="inline-flex min-h-11 items-center hover:text-cream">Inicio</Link>
        <span>/</span>
        <Link href="/tienda" className="inline-flex min-h-11 items-center hover:text-cream">Tienda</Link>
        <span>/</span>
        <span className="text-cream/80">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* galería — min-w-0 en toda la cadena: sin él, el min-width:auto de
            grid y flex deja que la tira de miniaturas estire la columna. */}
        <div className="min-w-0">
          {/* toggle: ver la camisa en modelo Hombre / Mujer */}
          {hasModels && (
            <div className="mb-3 inline-flex items-center gap-2">
              <span className="font-mono text-[0.64rem] font-bold tracking-[0.12em] text-cream/70 uppercase">
                Ver en
              </span>
              <div className="inline-flex rounded-full border border-cream/15 bg-white/5 p-1">
                {(["hombre", "mujer"] as const).map((g) => (
                  <button
                    key={g}
                    onClick={() => setPickedGender(g)}
                    aria-pressed={modelGender === g}
                    className={cn(
                      "font-mono flex min-h-11 items-center gap-1.5 rounded-full px-4 text-[0.68rem] font-bold tracking-[0.1em] uppercase transition",
                      modelGender === g ? "bg-cream text-ink" : "text-cream/60 hover:text-cream",
                    )}
                  >
                    <GeneroMark genero={g} color="currentColor" className="h-3.5 w-4" />
                    {g}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex min-w-0 flex-col-reverse gap-4 sm:flex-row">
            {gallery.length > 1 && (
              /* En celular la tira va en fila y con 5 miniaturas (3 de modelo +
                 2 de prenda) se pasaba de los 375px: se desliza. El min-w-0 es
                 obligatorio — sin él, min-width:auto de flex la deja crecer
                 hasta el contenido y el overflow-x-auto no recorta nada. */
              <div className="no-scrollbar flex min-w-0 gap-3 overflow-x-auto sm:flex-col sm:overflow-x-visible">
                {gallery.map((shot, i) => (
                  <button
                    key={shot.src + i}
                    onClick={() => setActive(i)}
                    aria-label={`Ver ${shot.label}`}
                    aria-pressed={safeActive === i}
                    className={cn(
                      "relative h-20 w-16 shrink-0 overflow-hidden rounded-lg border bg-[#eceae6] transition",
                      safeActive === i ? "border-[var(--accent)]" : "border-transparent opacity-70 hover:opacity-100",
                    )}
                  >
                    <Image
                      src={shot.src}
                      alt=""
                      fill
                      sizes="64px"
                      className={shot.fit === "cover" ? "object-cover" : "object-contain p-1"}
                    />
                  </button>
                ))}
              </div>
            )}

            <div
              className="relative aspect-[4/5] flex-1 select-none"
              style={{ touchAction: "pan-y" }}
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
            >
              <button
                type="button"
                onClick={() => {
                  if (swiped.current) {
                    swiped.current = false;
                    return;
                  }
                  setZoom(true);
                }}
                aria-label="Ampliar foto"
                className="group absolute inset-0 cursor-zoom-in overflow-hidden rounded-2xl bg-[#eceae6]"
              >
                <Image
                  src={activeShot.src}
                  alt={`${product.name} — ${product.colorway} · ${activeShot.label}`}
                  fill
                  priority
                  sizes="(max-width:1024px) 90vw, 45vw"
                  className={cn(
                    "transition-transform duration-500 group-hover:scale-[1.03]",
                    activeShot.fit === "cover" ? "object-cover" : "object-contain p-4",
                  )}
                />
                <span className="font-mono pointer-events-none absolute bottom-3 left-3 rounded-full bg-ink/75 px-2.5 py-1 text-[0.55rem] font-bold tracking-[0.12em] text-cream uppercase backdrop-blur-sm">
                  {activeShot.label}
                </span>
                <span className="pointer-events-none absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-ink/70 text-cream backdrop-blur-sm">
                  <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
                    <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                    <path d="m20 20-3.2-3.2M11 8.2v5.6M8.2 11h5.6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </span>
                {!available && (
                  <span className="absolute left-5 top-5 rounded-full bg-ink px-4 py-1.5 font-mono text-[0.6rem] font-bold tracking-[0.16em] text-cream uppercase">
                    Agotado
                  </span>
                )}
              </button>

              {/* flechas + puntos: deslizar con el dedo o tocar la flecha */}
              {gallery.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={goPrev}
                    aria-label="Foto anterior"
                    className="absolute left-2 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-ink/55 text-xl leading-none text-cream backdrop-blur-sm transition hover:bg-ink/80 active:scale-95"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={goNext}
                    aria-label="Foto siguiente"
                    className="absolute right-2 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-ink/55 text-xl leading-none text-cream backdrop-blur-sm transition hover:bg-ink/80 active:scale-95"
                  >
                    ›
                  </button>
                  <div className="pointer-events-none absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
                    {gallery.map((shot, i) => (
                      <span
                        key={shot.src + i}
                        className={cn(
                          "h-1.5 rounded-full transition-all",
                          safeActive === i ? "w-4 bg-cream" : "w-1.5 bg-cream/45",
                        )}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* compra */}
        <div className="flex flex-col">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[0.62rem] font-bold tracking-[0.16em] text-[var(--accent)] uppercase">
              {product.tag}
            </span>
            <span className="inline-flex items-center gap-1.5 font-mono text-[0.58rem] font-bold tracking-[0.12em] text-cream/55 uppercase">
              <GeneroMark genero={product.genero} color="currentColor" className="h-4 w-5" />
              {product.genero}
            </span>
          </div>

          <h1 className="font-condensed mt-2 text-[clamp(2.4rem,6vw,4rem)] leading-[0.95] text-cream">
            {product.name}
          </h1>

          <div className="mt-3 flex items-center gap-2 text-cream/70">
            <BaboonMark color={edition.accent} className="h-5 w-6" />
            <span className="text-[0.85rem]">
              {product.colorway} · {linea}
            </span>
          </div>

          <p className="mt-5 max-w-prose text-cream/70">{product.descLong ?? product.desc}</p>

          {/* precio / whatsapp */}
          <p className="font-mono mt-6 text-[0.78rem] text-cream/55">
            {typeof product.price === "number"
              ? new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(product.price)
              : "Precio, pago y envío se coordinan por WhatsApp."}
          </p>

          {/* tallas */}
          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between">
              <span className="font-mono text-[0.62rem] font-bold tracking-[0.12em] text-cream/60 uppercase">
                Talla
              </span>
              <button
                onClick={() => setGuide(true)}
                className="font-mono inline-flex min-h-11 items-center text-[0.68rem] font-bold tracking-[0.08em] text-[var(--accent)] uppercase underline-offset-4 hover:underline"
              >
                Guía de tallas
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => {
                const soldOut = s.stock === 0;
                return (
                  <button
                    key={s.size}
                    disabled={soldOut}
                    onClick={() => setSize(s.size)}
                    aria-pressed={size === s.size}
                    className={cn(
                      "font-mono grid h-11 min-w-11 place-items-center rounded-md border px-3 text-[0.8rem] font-bold transition",
                      soldOut
                        ? "cursor-not-allowed border-cream/10 text-cream/25 line-through"
                        : size === s.size
                          ? "border-cream bg-cream text-ink"
                          : "border-cream/25 text-cream/80 hover:border-cream",
                    )}
                  >
                    {s.size}
                  </button>
                );
              })}
            </div>
            {size && (
              <p className="font-mono mt-2 text-[0.68rem] tracking-[0.08em] text-cream/70 uppercase">
                {(product.sizes.find((s) => s.size === size)?.stock ?? 0) <= 3
                  ? "Últimas unidades en esta talla"
                  : "Disponible"}
              </p>
            )}
          </div>

          {/**
           * UN SOLO camino de compra: todo entra a la mochila y el pedido se
           * cierra desde ahí. Antes había un "Comprar por WhatsApp" que abría
           * el chat con UNA pieza y saltándose el carrito, así que quien quería
           * dos camisas terminaba con dos conversaciones y sin sus datos.
           */}
          <div className="mt-7 flex gap-3">
            <button
              onClick={addToBag}
              disabled={!available}
              className="font-mono flex min-h-14 flex-1 items-center justify-center gap-2 rounded-md px-6 text-[0.82rem] font-bold tracking-[0.1em] uppercase shadow-[0_4px_18px_rgba(0,0,0,.28)] transition hover:brightness-95 disabled:cursor-not-allowed disabled:bg-cream/10 disabled:text-cream/35 disabled:shadow-none"
              style={
                available
                  ? { backgroundColor: "var(--accent)", color: "var(--accent-ink)" }
                  : undefined
              }
            >
              <IconPlus className="h-5 w-5" />
              {available ? "Agregar a la mochila" : "Agotado"}
            </button>
            <button
              onClick={() => toggleWish(product.slug)}
              aria-label={saved ? "Quitar de favoritos" : "Guardar en favoritos"}
              aria-pressed={saved}
              className={cn(
                "grid min-h-14 w-14 shrink-0 place-items-center rounded-md border transition",
                saved
                  ? "border-[#c0392b] bg-[#c0392b]/15"
                  : "border-cream/25 text-cream hover:border-cream hover:bg-cream/5",
              )}
            >
              <IconHeart
                className="h-5 w-5"
                style={{ color: saved ? "#e05a48" : undefined }}
                fill={saved ? "currentColor" : "none"}
              />
            </button>
          </div>

          {/* Que quede claro cómo se cierra la compra, sin sacarlo de la ficha. */}
          <p className="mt-3 flex items-start gap-2 text-[0.8rem] leading-relaxed text-cream/70">
            <IconWhatsApp className="mt-0.5 h-4 w-4 shrink-0 text-[#25D366]" />
            <span>
              Arma tu mochila con todo lo que quieras y desde ahí cierras el pedido por WhatsApp:
              precio, pago y envío se coordinan en el chat.
            </span>
          </p>

          <div className="mt-5 flex items-center gap-2 text-cream/70">
            <IconLeaf className="h-4 w-4 text-teal-light" />
            <span className="text-[0.8rem]">Algodón sostenible · Envío a todo el país</span>
          </div>

          {/* acordeones */}
          <div className="mt-8 divide-y divide-cream/10 border-y border-cream/10">
            <Accordion title="Detalles">
              <ul className="space-y-1.5">
                <li>Fit: {product.fit ?? "Oversize"}</li>
                <li>Material: {product.composicion ?? "100% algodón 220 g/m²"}</li>
                <li>Colorway: {product.colorway}</li>
                <li>Línea: {linea}</li>
              </ul>
            </Accordion>
            <Accordion title="Envíos y cambios">
              <p>
                Envío a Bogotá en 24h y al resto de Colombia en 3–5 días. Tienes 15 días para
                cambiar tu talla. Precio y pago se coordinan por WhatsApp.
              </p>
            </Accordion>
          </div>
        </div>
      </div>

      {/* combina con */}
      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="font-condensed text-[clamp(1.7rem,4.5vw,2.8rem)] text-cream">
            Combina con <span className="shine-gold">la manada</span>
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} viewGenero={modelGender} />
            ))}
          </div>
        </section>
      )}

      {/* guía de tallas modal */}
      {guide && (
        <div
          className="fixed inset-0 z-[120] grid place-items-center bg-ink/70 p-4 backdrop-blur-sm"
          onClick={() => setGuide(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-cream p-6 text-ink shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-black">Guía de tallas</h3>
              <button
                onClick={() => setGuide(false)}
                className="font-mono text-[0.7rem] font-bold uppercase text-ink/50 hover:text-ink"
              >
                Cerrar ×
              </button>
            </div>
            <p className="mt-1 text-[0.78rem] text-ink/55">
              Medidas de la prenda estirada plana, en cm (no del cuerpo). Corte{" "}
              {(product.fit ?? "Oversize").toLowerCase()}.
            </p>

            {/* Solo las tallas que esta pieza tiene de verdad. */}
            <table className="mt-4 w-full border-collapse text-[0.82rem]">
              <thead>
                <tr className="border-b border-ink/15 text-left font-mono text-[0.6rem] uppercase tracking-[0.1em] text-ink/50">
                  <th className="py-2">Talla</th>
                  <th className="py-2">Ancho</th>
                  <th className="py-2">Largo</th>
                  <th className="py-2">Hombro</th>
                  <th className="py-2">Manga</th>
                </tr>
              </thead>
              <tbody className="font-mono">
                {SIZE_GUIDE.filter((r) => product.sizes.some((s) => s.size === r.size)).map((r) => (
                  <tr key={r.size} className="border-b border-ink/8">
                    <td className="py-2 font-bold">{r.size}</td>
                    <td className="py-2">{r.ancho}</td>
                    <td className="py-2">{r.largo}</td>
                    <td className="py-2">{r.hombro}</td>
                    <td className="py-2">{r.manga}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* La versión crop de mujer es más corta que la tabla. */}
            {/Crop/i.test(product.fit ?? "") && (
              <p className="mt-3 text-[0.78rem] text-ink/60">
                La versión de mujer va en corte crop: el largo es menor al de la tabla.
              </p>
            )}

            <p className="mt-4 text-[0.75rem] leading-relaxed text-ink/50">
              Referencia de oversize estándar, tolerancia ±2 cm. ¿Quieres la medida exacta de tu
              talla antes de comprar? Escríbenos.
            </p>
            <a
              href={
                process.env.NEXT_PUBLIC_WHATSAPP_NUMBER
                  ? buildWaLink(
                      process.env.NEXT_PUBLIC_WHATSAPP_NUMBER,
                      buildSizeMessage(product.name, product.colorway),
                    )
                  : "#"
              }
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono mt-3 flex w-full items-center justify-center gap-2 rounded-md bg-[#25D366] px-5 py-3 text-[0.72rem] font-bold tracking-[0.1em] text-white uppercase transition hover:brightness-95"
            >
              <IconWhatsApp className="h-4 w-4" /> Preguntar medida exacta
            </a>
          </div>
        </div>
      )}

      {/* zoom / lightbox */}
      {zoom && (
        <div
          className="fixed inset-0 z-[130] flex items-center justify-center bg-ink/92 p-4 backdrop-blur-sm"
          onClick={() => setZoom(false)}
        >
          <button
            onClick={() => setZoom(false)}
            aria-label="Cerrar"
            className="font-mono absolute right-4 top-4 z-10 rounded-full border border-cream/20 px-3 py-1.5 text-[0.62rem] font-bold tracking-[0.08em] text-cream/80 uppercase hover:bg-cream/10"
          >
            Cerrar ×
          </button>

          <div
            className="relative h-[82vh] w-full max-w-3xl"
            style={{ touchAction: "pan-y" }}
            onClick={(e) => e.stopPropagation()}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <Image
              src={activeShot.src}
              alt={`${product.name} — ${product.colorway} · ${activeShot.label}`}
              fill
              sizes="90vw"
              className="object-contain"
            />
          </div>

          {gallery.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goPrev();
                }}
                aria-label="Anterior"
                className="absolute left-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-cream/20 text-2xl leading-none text-cream hover:bg-cream/10"
              >
                ‹
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goNext();
                }}
                aria-label="Siguiente"
                className="absolute right-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-cream/20 text-2xl leading-none text-cream hover:bg-cream/10"
              >
                ›
              </button>
              <span className="font-mono absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-ink/70 px-3 py-1 text-[0.6rem] tracking-[0.1em] text-cream/80 uppercase">
                {activeShot.label} · {safeActive + 1}/{gallery.length}
              </span>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function Accordion({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <details className="group py-4">
      <summary className="flex cursor-pointer list-none items-center justify-between font-mono text-[0.72rem] font-bold tracking-[0.12em] text-cream uppercase">
        {title}
        <span className="text-cream/50 transition group-open:rotate-45">+</span>
      </summary>
      <div className="mt-3 text-[0.85rem] leading-relaxed text-cream/65">{children}</div>
    </details>
  );
}
