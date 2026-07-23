"use client";

import { useEffect, useRef, useState } from "react";
import { BaboonMark } from "@/components/ui/BaboonMark";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISS_KEY = "bbn-install-dismissed";
const DISMISS_DAYS = 14;

/**
 * Tiny "install the app" chip (PWA). Registers the service worker, then:
 *  - Android/Chrome → captures `beforeinstallprompt` and shows an Install button.
 *  - iOS Safari → shows the manual "Compartir → Añadir a inicio" hint.
 * Hides when already installed (standalone) or recently dismissed.
 */
export function InstallPrompt() {
  const [show, setShow] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const deferred = useRef<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    // Register the service worker (needs HTTPS — works on Vercel + localhost).
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => {});
    }

    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      // iOS Safari exposes this non-standard flag when launched from home screen.
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    if (standalone) return;

    // Respect a recent dismissal.
    const dismissedAt = Number(localStorage.getItem(DISMISS_KEY) || 0);
    if (dismissedAt && Date.now() - dismissedAt < DISMISS_DAYS * 864e5) return;

    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
    setIsIOS(ios);

    const onBIP = (e: Event) => {
      e.preventDefault();
      deferred.current = e as BeforeInstallPromptEvent;
      setShow(true);
    };
    window.addEventListener("beforeinstallprompt", onBIP);
    window.addEventListener("appinstalled", () => setShow(false));

    // iOS never fires beforeinstallprompt → show the hint after a short delay.
    let t: ReturnType<typeof setTimeout> | undefined;
    if (ios) t = setTimeout(() => setShow(true), 2500);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBIP);
      if (t) clearTimeout(t);
    };
  }, []);

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
    setShow(false);
  };

  const install = async () => {
    const ev = deferred.current;
    if (!ev) return;
    await ev.prompt();
    await ev.userChoice;
    deferred.current = null;
    setShow(false);
  };

  if (!show) return null;

  return (
    <div
      className="fixed left-1/2 top-2 z-[95] -translate-x-1/2 max-w-[calc(100vw-1rem)]"
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <div className="flex items-center gap-2 rounded-full border border-[var(--accent)]/45 bg-ink/85 py-1.5 pl-2 pr-1.5 shadow-[0_8px_30px_rgba(0,0,0,.45)] backdrop-blur-md">
        <BaboonMark color="var(--accent)" className="h-4 w-5 shrink-0" />

        {isIOS ? (
          <span className="font-mono text-[0.58rem] leading-tight tracking-[0.04em] text-cream">
            Instálala: Compartir <span aria-hidden>⎋</span> → Añadir a inicio{" "}
            <span aria-hidden>➕</span>
          </span>
        ) : (
          <>
            <span className="font-mono text-[0.58rem] tracking-[0.04em] text-cream">
              Lleva la selva contigo
            </span>
            <button
              onClick={install}
              className="rounded-full px-2.5 py-1 text-[0.58rem] font-bold tracking-wide transition hover:brightness-95"
              style={{ backgroundColor: "var(--accent)", color: "var(--accent-ink)" }}
            >
              Instalar app
            </button>
          </>
        )}

        <button
          onClick={dismiss}
          aria-label="Cerrar"
          className="grid h-5 w-5 shrink-0 place-items-center rounded-full text-cream/55 transition hover:bg-cream/10 hover:text-cream"
        >
          <span className="text-[0.7rem] leading-none">×</span>
        </button>
      </div>
    </div>
  );
}
