"use client";

import { create } from "zustand";

export interface Colorway {
  key: string;
  name: string;
  accent: string;
  ink: string; // readable text on accent
}

// Solo paleta oficial Babuinos (sin rojo): Ocre, Teal, Oliva, Pardo, Papiro.
export const COLORWAYS: Colorway[] = [
  { key: "gold", name: "Ocre Dorado", accent: "#cda214", ink: "#1e2021" },
  { key: "teal", name: "Teal Expedición", accent: "#00897f", ink: "#f3e9e2" },
  { key: "olive", name: "Oliva Safari", accent: "#6b8035", ink: "#f3e9e2" },
  { key: "umber", name: "Pardo Tostado", accent: "#8a6a3a", ink: "#f3e9e2" },
  { key: "cream", name: "Papiro", accent: "#e7d8c5", ink: "#1e2021" },
];

interface ThemeState {
  key: string;
  setTheme: (key: string) => void;
}

export const useTheme = create<ThemeState>((set) => ({
  key: "gold",
  setTheme: (key) => {
    const cw = COLORWAYS.find((c) => c.key === key) ?? COLORWAYS[0];
    if (typeof document !== "undefined") {
      document.documentElement.style.setProperty("--accent", cw.accent);
      document.documentElement.style.setProperty("--accent-ink", cw.ink);
    }
    set({ key });
  },
}));
