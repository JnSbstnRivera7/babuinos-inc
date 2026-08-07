"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Category, Product } from "./products";

export type LineGenero = "hombre" | "mujer";

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
  /** Para las promos por combo (3 básicas / 2 estampadas). */
  category: Category;
  /** Precio unitario en COP. */
  price: number;
  /** Cómo lo quiere el cliente; en una pieza de dos cortes define cuál (oversize/crop). */
  genero: LineGenero;
}

/** Misma pieza + talla + género = misma línea. El género separa (crop vs oversize). */
const sameLine = (l: CartLine, id: string, size: string, genero: LineGenero) =>
  l.id === id && l.size === size && l.genero === genero;

interface CartState {
  lines: CartLine[];
  isOpen: boolean;
  /** Devuelve false si ya se alcanzó el stock de esa talla. */
  add: (product: Product, size: string, genero: LineGenero) => boolean;
  remove: (id: string, size: string, genero: LineGenero) => void;
  changeQty: (id: string, size: string, genero: LineGenero, delta: number) => void;
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
      add: (product, size, genero) => {
        const max = product.sizes.find((s) => s.size === size)?.stock ?? 0;
        if (max <= 0) return false;

        const existing = get().lines.find((l) => sameLine(l, product.id, size, genero));
        if (existing && existing.qty >= max) return false;

        set((state) =>
          existing
            ? {
                lines: state.lines.map((l) =>
                  sameLine(l, product.id, size, genero)
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
                    category: product.category,
                    price: product.price ?? 0,
                    genero,
                  },
                ],
              },
        );
        return true;
      },
      remove: (id, size, genero) =>
        set((state) => ({ lines: state.lines.filter((l) => !sameLine(l, id, size, genero)) })),
      changeQty: (id, size, genero, delta) =>
        set((state) => ({
          lines: state.lines
            .map((l) =>
              sameLine(l, id, size, genero)
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
    {
      name: "babuinos-cart",
      // v2: las líneas ganaron category/price/genero. Un carrito guardado antes
      // de eso daría precios NaN, así que se descarta al migrar (mejor vaciar
      // que mostrar totales rotos).
      // v3 (7-ago): salieron dos piezas del catálogo y sus fotos del sitio. Un
      // carrito guardado con ellas mostraría una imagen rota y dejaría pedir algo
      // que ya no se vende, así que también se descarta.
      version: 3,
      migrate: () => ({ lines: [], isOpen: false }),
    },
  ),
);
