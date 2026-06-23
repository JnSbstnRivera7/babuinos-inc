"use client";

import { create } from "zustand";

interface ToastState {
  message: string;
  visible: boolean;
  show: (message: string) => void;
  hide: () => void;
}

let timer: ReturnType<typeof setTimeout> | null = null;

export const useToast = create<ToastState>((set) => ({
  message: "",
  visible: false,
  show: (message) => {
    set({ message, visible: true });
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => set({ visible: false }), 2600);
  },
  hide: () => set({ visible: false }),
}));
