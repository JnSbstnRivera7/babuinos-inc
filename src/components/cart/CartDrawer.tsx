"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "@/lib/store";
import { useToast } from "@/lib/toast";
import { cartTotals, formatCOP } from "@/lib/products";
import {
  IconClose,
  IconPlus,
  IconMinus,
  IconWhatsApp,
  IconBag,
  IconArrowLeft,
} from "@/components/ui/Icons";

/**
 * La mochila va en DOS PASOS a propósito. Antes el formulario de datos vivía en
 * el footer fijo junto a los totales: en un celular se comía el alto del panel y
 * las prendas quedaban en una franja de scroll de dos dedos. Paso 1 = solo las
 * camisas (ver, cambiar cantidades, quitar); paso 2 = los datos, y solo cuando
 * la persona ya decidió comprar.
 */
type Paso = "mochila" | "datos";

export function CartDrawer() {
  const { lines, isOpen, close, remove, changeQty } = useCart();
  const totales = cartTotals(lines);
  const showToast = useToast((s) => s.show);
  const [paso, setPaso] = useState<Paso>("mochila");
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [note, setNote] = useState("");
  /**
   * Autorización de tratamiento de datos (Ley 1581 de 2012). Arranca en FALSE a
   * propósito: la ley exige autorización previa y expresa, así que no puede
   * venir premarcada ni deducirse del hecho de comprar.
   */
  const [aceptaDatos, setAceptaDatos] = useState(false);

  const unidades = lines.reduce((a, l) => a + l.qty, 0);

  // Al cerrar la mochila se vuelve al paso 1: quien la reabre espera ver sus
  // camisas, no el formulario a medio llenar.
  useEffect(() => {
    if (!isOpen) setPaso("mochila");
  }, [isOpen]);

  // Si se queda vacía (quitó la última prenda) no tiene sentido pedir datos.
  useEffect(() => {
    if (!lines.length) setPaso("mochila");
  }, [lines.length]);

  async function checkout() {
    if (!lines.length) return;
    if (!name.trim()) {
      showToast("⚠️ Escribe tu nombre para el pedido");
      return;
    }
    if (!aceptaDatos) {
      showToast("⚠️ Acepta el tratamiento de datos para continuar");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // `privacyAccepted` queda guardado con el pedido: es la prueba de la
        // autorización que el titular puede pedirnos (art. 8, literal b).
        body: JSON.stringify({ lines, name, phone, city, note, privacyAccepted: true, totals: totales }),
      });
      const data = (await res.json()) as { url?: string };
      if (data.url) {
        window.open(data.url, "_blank");
        showToast("🚀 Abriendo WhatsApp...");
      } else {
        showToast("⚠️ Falta configurar el WhatsApp de la tienda");
      }
    } catch {
      showToast("⚠️ No se pudo iniciar el pedido");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 z-[110] bg-ink/60 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            className="fixed inset-y-0 right-0 z-[111] flex w-[min(420px,100vw)] flex-col bg-cream shadow-[-8px_0_40px_rgba(30,32,33,.2)]"
          >
            <header className="flex items-center justify-between gap-3 bg-ink px-5 py-4">
              {paso === "datos" ? (
                <button
                  onClick={() => setPaso("mochila")}
                  className="font-mono flex min-h-11 items-center gap-2 rounded-full bg-cream/10 px-3 text-[0.68rem] font-bold tracking-[0.1em] text-cream uppercase transition hover:bg-cream/20"
                >
                  <IconArrowLeft className="h-4 w-4" strokeWidth={2.25} /> Mochila
                </button>
              ) : (
                <h2 className="font-display flex items-center gap-2 text-xl font-black text-cream">
                  <IconBag className="h-5 w-5 text-gold" strokeWidth={2} /> Tu{" "}
                  <span className="text-gold">mochila</span>
                  {unidades > 0 && (
                    <span className="font-mono ml-0.5 rounded-full bg-gold px-2 py-0.5 text-[0.66rem] font-bold text-ink">
                      {unidades}
                    </span>
                  )}
                </h2>
              )}
              {paso === "datos" && (
                <h2 className="font-display text-[1.05rem] font-black text-cream">
                  Tus <span className="text-gold">datos</span>
                </h2>
              )}
              <button
                onClick={close}
                aria-label="Cerrar"
                className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-cream/10 text-cream transition hover:bg-cream/20"
              >
                <IconClose className="h-5 w-5" strokeWidth={2.25} />
              </button>
            </header>

            {/* ── PASO 1 · solo las prendas ── */}
            {paso === "mochila" && (
              <>
                <div className="flex-1 overflow-y-auto px-5 py-4">
                  {lines.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                      <IconBag className="h-12 w-12 text-ink/25" />
                      <p className="text-sm text-ink/70">
                        Tu mochila está vacía.
                        <br />
                        Explora la manada.
                      </p>
                      <Link
                        href="/tienda"
                        onClick={close}
                        className="font-mono inline-flex min-h-11 items-center rounded-md bg-ink px-5 text-[0.72rem] font-bold tracking-[0.1em] text-cream uppercase transition hover:bg-ink/85"
                      >
                        Ver camisas
                      </Link>
                    </div>
                  ) : (
                    <ul className="divide-y divide-ink/10">
                      {lines.map((l) => (
                        <li key={`${l.id}-${l.size}-${l.genero}`} className="flex gap-3.5 py-4">
                          <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-md bg-[#eceae6]">
                            <Image
                              src={l.image}
                              alt={l.name}
                              fill
                              sizes="80px"
                              className="object-contain p-1"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-baseline justify-between gap-2">
                              <div className="font-display text-[1rem] leading-tight font-black text-ink">
                                {l.name}
                              </div>
                              {typeof l.price === "number" && (
                                <span className="font-mono shrink-0 text-[0.82rem] font-bold text-ink tabular-nums">
                                  {formatCOP(l.price * l.qty)}
                                </span>
                              )}
                            </div>
                            <div className="mt-0.5 text-[0.78rem] text-ink/70">{l.colorway}</div>
                            <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                              <span className={CHIP_CLS}>Talla {l.size}</span>
                              {l.genero && <span className={CHIP_CLS}>{l.genero}</span>}
                            </div>

                            <div className="mt-2.5 flex items-center gap-2">
                              {/* Stepper en una sola pastilla con borde: los dos
                                  círculos grises con el glifo diminuto adentro no
                                  se leían como botones. */}
                              <div className="flex items-center rounded-full border border-ink/25 bg-white">
                                <button
                                  onClick={() => changeQty(l.id, l.size, l.genero, -1)}
                                  aria-label={`Quitar una unidad de ${l.name}`}
                                  className="grid h-11 w-11 place-items-center rounded-l-full text-ink transition hover:bg-ink hover:text-cream"
                                >
                                  <IconMinus className="h-[1.15rem] w-[1.15rem]" strokeWidth={2.75} />
                                </button>
                                <span className="font-display w-7 text-center text-[1.05rem] font-black text-ink tabular-nums">
                                  {l.qty}
                                </span>
                                {/* Tope el stock de la talla: al llegar al máximo el + se apaga. */}
                                <button
                                  onClick={() => changeQty(l.id, l.size, l.genero, 1)}
                                  disabled={l.qty >= (l.max ?? 99)}
                                  aria-label={`Agregar una unidad de ${l.name}`}
                                  className="grid h-11 w-11 place-items-center rounded-r-full text-ink transition hover:bg-ink hover:text-cream disabled:cursor-not-allowed disabled:text-ink/30 disabled:hover:bg-transparent disabled:hover:text-ink/30"
                                >
                                  <IconPlus className="h-[1.15rem] w-[1.15rem]" strokeWidth={2.75} />
                                </button>
                              </div>
                              {l.qty >= (l.max ?? 99) && (
                                <span className="font-mono text-[0.6rem] font-bold tracking-[0.08em] text-umber uppercase">
                                  Máx.
                                </span>
                              )}
                              <button
                                onClick={() => remove(l.id, l.size, l.genero)}
                                className="font-mono ml-auto inline-flex min-h-11 items-center px-1 text-[0.68rem] font-bold tracking-[0.08em] text-umber uppercase transition hover:text-burgundy"
                              >
                                Quitar
                              </button>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {lines.length > 0 && (
                  <footer className="border-t-2 border-ink/10 bg-white px-5 py-4">
                    <Totales totales={totales} />
                    <button
                      onClick={() => setPaso("datos")}
                      className="font-mono mt-3 flex min-h-14 w-full items-center justify-center gap-2 rounded-md bg-ink px-6 text-[0.8rem] font-bold tracking-[0.1em] text-cream uppercase transition hover:bg-ink/85"
                    >
                      Continuar con el pedido
                    </button>
                    <Link
                      href="/tienda"
                      onClick={close}
                      className="font-mono mt-1 flex min-h-11 items-center justify-center text-[0.68rem] font-bold tracking-[0.08em] text-ink/70 uppercase transition hover:text-ink"
                    >
                      Seguir viendo camisas
                    </Link>
                  </footer>
                )}
              </>
            )}

            {/* ── PASO 2 · los datos, ya con la compra decidida ── */}
            {paso === "datos" && (
              <>
                <div className="flex-1 overflow-y-auto px-5 py-4">
                  {/* Resumen mínimo para no perder de vista qué se está pidiendo. */}
                  <button
                    onClick={() => setPaso("mochila")}
                    className="mb-4 flex w-full items-center gap-3 rounded-md border border-ink/15 bg-white p-2.5 text-left transition hover:border-ink/30"
                  >
                    <div className="flex shrink-0 gap-1">
                      {lines.slice(0, 3).map((l) => (
                        <div
                          key={`mini-${l.id}-${l.size}-${l.genero}`}
                          className="relative h-11 w-9 overflow-hidden rounded bg-[#eceae6]"
                        >
                          <Image
                            src={l.image}
                            alt=""
                            fill
                            sizes="36px"
                            className="object-contain p-0.5"
                          />
                        </div>
                      ))}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-display text-[0.9rem] font-black text-ink">
                        {unidades} {unidades === 1 ? "prenda" : "prendas"} · {formatCOP(totales.total)}
                      </div>
                      <div className="font-mono text-[0.62rem] font-bold tracking-[0.08em] text-teal uppercase">
                        Ver o editar la mochila
                      </div>
                    </div>
                  </button>

                  <p className="font-mono mb-2 text-[0.66rem] font-bold tracking-[0.12em] text-ink/70 uppercase">
                    Tus datos
                  </p>
                  {/* Con label visible: los placeholder desaparecen al escribir
                      y en el checkout es donde menos se puede dudar qué campo
                      se está llenando. */}
                  <div className="grid gap-2.5">
                    <Campo id="cart-nombre" label="Nombre y apellido" required>
                      <input
                        id="cart-nombre"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        autoComplete="name"
                        required
                        className={CAMPO_CLS}
                      />
                    </Campo>
                    <div className="grid grid-cols-2 gap-2">
                      <Campo id="cart-tel" label="Teléfono">
                        <input
                          id="cart-tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          inputMode="tel"
                          type="tel"
                          autoComplete="tel"
                          className={CAMPO_CLS}
                        />
                      </Campo>
                      <Campo id="cart-ciudad" label="Ciudad">
                        <input
                          id="cart-ciudad"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          autoComplete="address-level2"
                          className={CAMPO_CLS}
                        />
                      </Campo>
                    </div>
                    <Campo id="cart-nota" label="Nota" hint="color, dirección, referencias…">
                      <input
                        id="cart-nota"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        className={CAMPO_CLS}
                      />
                    </Campo>
                  </div>

                  {/* Autorización expresa y previa (Ley 1581 de 2012) */}
                  <label
                    htmlFor="cart-datos"
                    className="mt-4 flex cursor-pointer items-start gap-3 rounded-md border border-ink/15 bg-white p-3"
                  >
                    <input
                      id="cart-datos"
                      type="checkbox"
                      checked={aceptaDatos}
                      onChange={(e) => setAceptaDatos(e.target.checked)}
                      className="mt-0.5 h-5 w-5 shrink-0 accent-teal"
                    />
                    <span className="text-[0.78rem] leading-relaxed text-ink/80">
                      Autorizo el tratamiento de mis datos personales para coordinar y despachar este
                      pedido, conforme a la{" "}
                      <Link
                        href="/privacidad"
                        target="_blank"
                        className="font-bold text-teal underline underline-offset-2"
                      >
                        política de tratamiento de datos
                      </Link>{" "}
                      y a la Ley 1581 de 2012.
                    </span>
                  </label>
                </div>

                <footer className="border-t-2 border-ink/10 bg-white px-5 py-4">
                  <div className="font-display mb-3 flex items-baseline justify-between">
                    <span className="font-mono text-[0.7rem] font-bold tracking-[0.1em] text-ink/70 uppercase">
                      Total
                    </span>
                    <span className="text-[1.15rem] font-black text-ink tabular-nums">
                      {formatCOP(totales.total)}
                    </span>
                  </div>
                  <p className="mb-3 text-center text-[0.72rem] text-ink/70">
                    Pago y envío se coordinan por WhatsApp.
                  </p>
                  <button
                    onClick={checkout}
                    disabled={lines.length === 0 || loading || !aceptaDatos}
                    className="font-mono flex min-h-14 w-full items-center justify-center gap-2 rounded-md bg-[#25D366] px-6 text-[0.8rem] font-bold tracking-[0.1em] text-white uppercase shadow-[0_4px_18px_rgba(37,211,102,.35)] transition hover:brightness-95 disabled:cursor-not-allowed disabled:bg-ink/10 disabled:text-ink/40 disabled:shadow-none"
                  >
                    <IconWhatsApp className="h-5 w-5" />
                    {loading ? "Preparando..." : "Enviar pedido por WhatsApp"}
                  </button>
                  {!aceptaDatos && (
                    <p className="font-mono mt-2 text-center text-[0.64rem] tracking-[0.08em] text-ink/70 uppercase">
                      Marca la autorización para continuar
                    </p>
                  )}
                </footer>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

/** Subtotal + promos por combo + total. Igual en los dos pasos. */
function Totales({ totales }: { totales: ReturnType<typeof cartTotals> }) {
  return (
    <div className="font-mono space-y-1.5 text-[0.8rem] tabular-nums">
      <div className="flex justify-between text-ink/70">
        <span>Subtotal</span>
        <span>{formatCOP(totales.subtotal)}</span>
      </div>
      {totales.promos.map((p) => (
        <div key={p.category} className="flex justify-between font-bold text-teal">
          <span>
            Promo {p.combos}× {p.cada} {p.category === "basica" ? "básicas" : "estampadas"}
          </span>
          <span>−{formatCOP(p.ahorro)}</span>
        </div>
      ))}
      <div className="flex justify-between border-t border-ink/10 pt-1.5 text-[1rem] font-black text-ink">
        <span>Total</span>
        <span>{formatCOP(totales.total)}</span>
      </div>
    </div>
  );
}

/** Alto ≥44px para cumplir el mínimo de toque en móvil. */
const CAMPO_CLS =
  "w-full min-h-11 rounded-md border border-ink/15 bg-white px-3 text-[0.9rem] text-ink focus:border-teal";

/** Talla y género como etiquetas: la línea "COLORWAY · TALLA · GÉNERO" en mono
 *  de 10 px quedaba apretada e ilegible. */
const CHIP_CLS =
  "font-mono rounded border border-ink/20 bg-ink/[0.04] px-1.5 py-0.5 text-[0.64rem] font-bold tracking-[0.08em] text-ink/85 uppercase";

function Campo({
  id,
  label,
  hint,
  required,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="font-mono mb-1 block text-[0.6rem] font-bold tracking-[0.1em] text-ink/70 uppercase"
      >
        {label}
        {required && <span className="ml-1 text-burgundy">*</span>}
        {hint && <span className="ml-1.5 font-normal normal-case tracking-normal text-ink/65">({hint})</span>}
      </label>
      {children}
    </div>
  );
}
