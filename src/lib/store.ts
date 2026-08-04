"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "./products";

export interface CartLine {
  id: string;
  name: string;
  tag: string;
  image: string;
  colorway: string;
  size: string;
  qty: number;
  /** Unidades disponibles de ESA talla, para no dejar pedir más de lo que hay. */
  max: number;
}

interface CartState {
  lines: CartLine[];
  isOpen: boolean;
  /** Devuelve false si ya se alcanzó el stock de esa talla. */
  add: (product: Product, size: string) => boolean;
  remove: (id: string, size: string) => void;
  changeQty: (id: string, size: string, delta: number) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
  toggle: () => void;
  count: () => number;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      isOpen: false,
      /**
       * Tope el stock de la talla. Sin esto se podían pedir 10 unidades de una
       * talla con 3 y el pedido llegaba por WhatsApp imposible de despachar.
       */
      add: (product, size) => {
        const max = product.sizes.find((s) => s.size === size)?.stock ?? 0;
        if (max <= 0) return false;

        const existing = get().lines.find((l) => l.id === product.id && l.size === size);
        if (existing && existing.qty >= max) return false;

        set((state) =>
          existing
            ? {
                lines: state.lines.map((l) =>
                  l.id === product.id && l.size === size
                    ? { ...l, qty: Math.min(l.qty + 1, max), max }
                    : l,
                ),
              }
            : {
                lines: [
                  ...state.lines,
                  {
                    id: product.id,
                    name: product.name,
                    tag: product.tag,
                    image: product.image,
                    colorway: product.colorway,
                    size,
                    qty: 1,
                    max,
                  },
                ],
              },
        );
        return true;
      },
      remove: (id, size) =>
        set((state) => ({ lines: state.lines.filter((l) => !(l.id === id && l.size === size)) })),
      changeQty: (id, size, delta) =>
        set((state) => ({
          lines: state.lines
            .map((l) =>
              l.id === id && l.size === size
                ? // `max ?? 99` cubre las líneas que quedaron en localStorage
                  // antes de que existiera el tope.
                  { ...l, qty: Math.min(l.qty + delta, l.max ?? 99) }
                : l,
            )
            .filter((l) => l.qty > 0),
        })),
      clear: () => set({ lines: [] }),
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      toggle: () => set((s) => ({ isOpen: !s.isOpen })),
      count: () => get().lines.reduce((a, l) => a + l.qty, 0),
    }),
    { name: "babuinos-cart" },
  ),
);
