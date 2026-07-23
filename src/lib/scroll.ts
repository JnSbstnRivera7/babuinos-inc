type LenisLike = { scrollTo: (target: number, opts?: { immediate?: boolean }) => void };

/**
 * Sube al inicio de la página de forma fiable en PC y móvil.
 * En desktop Lenis controla el scroll (window.scrollTo lo ignora), así que usamos
 * su instancia expuesta en window.__lenis; en táctil Lenis está apagado y usamos nativo.
 */
export function scrollToTop(smooth = false) {
  if (typeof window === "undefined") return;
  const lenis = (window as unknown as { __lenis?: LenisLike }).__lenis;
  if (lenis) {
    lenis.scrollTo(0, { immediate: !smooth });
  } else {
    window.scrollTo({ top: 0, behavior: smooth ? "smooth" : "auto" });
  }
}
