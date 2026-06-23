"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "@/lib/store";
import { useToast } from "@/lib/toast";
import { IconClose, IconPlus, IconMinus, IconWhatsApp, IconBag } from "@/components/ui/Icons";

export function CartDrawer() {
  const { lines, isOpen, close, remove, changeQty } = useCart();
  const showToast = useToast((s) => s.show);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [note, setNote] = useState("");

  async function checkout() {
    if (!lines.length) return;
    if (!name.trim()) {
      showToast("⚠️ Escribe tu nombre para el pedido");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lines, name, phone, city, note }),
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
            <header className="flex items-center justify-between bg-ink px-6 py-5">
              <h2 className="font-display flex items-center gap-2 text-xl font-black text-cream">
                <IconBag className="h-5 w-5 text-gold" /> Tu <span className="text-gold">mochila</span>
              </h2>
              <button
                onClick={close}
                aria-label="Cerrar"
                className="grid h-9 w-9 place-items-center rounded-full bg-cream/10 text-cream transition hover:bg-cream/20"
              >
                <IconClose className="h-5 w-5" />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-6 py-5">
              {lines.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-4 text-center text-ink/50">
                  <IconBag className="h-12 w-12 opacity-30" />
                  <p className="text-sm">
                    Tu mochila está vacía.
                    <br />
                    Explora la manada.
                  </p>
                </div>
              ) : (
                lines.map((l) => (
                  <div key={`${l.id}-${l.size}`} className="flex gap-4 border-b border-ink/10 py-4">
                    <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-md bg-[#eceae6]">
                      <Image src={l.image} alt={l.name} fill sizes="64px" className="object-contain p-1" />
                    </div>
                    <div className="flex-1">
                      <div className="font-display text-[0.95rem] font-black text-ink">{l.name}</div>
                      <div className="font-mono text-[0.62rem] tracking-[0.08em] text-ink/50 uppercase">
                        {l.colorway} · Talla {l.size}
                      </div>
                      <div className="mt-2 flex items-center gap-2.5">
                        <button
                          onClick={() => changeQty(l.id, l.size, -1)}
                          aria-label="Quitar una unidad"
                          className="grid h-7 w-7 place-items-center rounded-full bg-ink/10 transition hover:bg-ink hover:text-white"
                        >
                          <IconMinus className="h-3.5 w-3.5" />
                        </button>
                        <span className="font-mono w-5 text-center text-sm font-bold">{l.qty}</span>
                        <button
                          onClick={() => changeQty(l.id, l.size, 1)}
                          aria-label="Agregar una unidad"
                          className="grid h-7 w-7 place-items-center rounded-full bg-ink/10 transition hover:bg-ink hover:text-white"
                        >
                          <IconPlus className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => remove(l.id, l.size)}
                          className="font-mono ml-1 text-[0.62rem] tracking-[0.08em] text-umber/60 uppercase transition hover:text-burgundy"
                        >
                          Quitar
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <footer className="border-t-2 border-ink/10 bg-white px-6 py-5">
              {lines.length > 0 && (
                <div className="mb-3">
                  <p className="font-mono mb-2 text-[0.6rem] font-bold tracking-[0.12em] text-ink/50 uppercase">
                    Tus datos
                  </p>
                  <div className="grid gap-2">
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Nombre y apellido *"
                      className="w-full rounded-md border border-ink/15 bg-cream/40 px-3 py-2.5 text-[0.85rem] text-ink placeholder:text-ink/40 focus:border-teal focus:outline-none"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        inputMode="tel"
                        placeholder="Teléfono"
                        className="w-full rounded-md border border-ink/15 bg-cream/40 px-3 py-2.5 text-[0.85rem] text-ink placeholder:text-ink/40 focus:border-teal focus:outline-none"
                      />
                      <input
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Ciudad"
                        className="w-full rounded-md border border-ink/15 bg-cream/40 px-3 py-2.5 text-[0.85rem] text-ink placeholder:text-ink/40 focus:border-teal focus:outline-none"
                      />
                    </div>
                    <input
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Nota (opcional): color, dirección, etc."
                      className="w-full rounded-md border border-ink/15 bg-cream/40 px-3 py-2.5 text-[0.85rem] text-ink placeholder:text-ink/40 focus:border-teal focus:outline-none"
                    />
                  </div>
                </div>
              )}
              <p className="mb-3 text-center text-[0.78rem] text-ink/55">
                Precio, pago y envío se coordinan por WhatsApp.
              </p>
              <button
                onClick={checkout}
                disabled={lines.length === 0 || loading}
                className="font-mono flex w-full items-center justify-center gap-2 rounded-md bg-[#25D366] px-6 py-4 text-[0.8rem] font-bold tracking-[0.1em] text-white uppercase shadow-[0_4px_18px_rgba(37,211,102,.35)] transition hover:brightness-95 disabled:cursor-not-allowed disabled:bg-ink/10 disabled:text-ink/40 disabled:shadow-none"
              >
                <IconWhatsApp className="h-5 w-5" />
                {loading ? "Preparando..." : "Enviar pedido por WhatsApp"}
              </button>
            </footer>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
