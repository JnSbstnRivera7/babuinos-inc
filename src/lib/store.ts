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
}

interface CartState {
  lines: CartLine[];
  isOpen: boolean;
  add: (product: Product, size: string) => void;
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
      add: (product, size) =>
        set((state) => {
          const existing = state.lines.find((l) => l.id === product.id && l.size === size);
          if (existing) {
            return {
              lines: state.lines.map((l) =>
                l.id === product.id && l.size === size ? { ...l, qty: l.qty + 1 } : l,
              ),
            };
          }
          return {
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
              },
            ],
          };
        }),
      remove: (id, size) =>
        set((state) => ({ lines: state.lines.filter((l) => !(l.id === id && l.size === size)) })),
      changeQty: (id, size, delta) =>
        set((state) => ({
          lines: state.lines
            .map((l) => (l.id === id && l.size === size ? { ...l, qty: l.qty + delta } : l))
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
