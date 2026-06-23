import { clsx, type ClassValue } from "clsx";

/** Tailwind-friendly className combiner */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/** Format a number as Colombian pesos: 89000 -> "$89.000" */
export function formatCOP(value: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value);
}
