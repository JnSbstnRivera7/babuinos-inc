import type { Metadata } from "next";
import Link from "next/link";
import { Shell } from "@/components/layout/Shell";
import { BaboonMark } from "@/components/ui/BaboonMark";

export const metadata: Metadata = {
  title: "Esta pieza no existe — Babuinos Inc",
  robots: { index: false },
};

/**
 * Antes un enlace roto mostraba el 404 crudo de Next: sin marca y sin salida.
 * Acá el usuario siempre tiene a dónde ir.
 */
export default function NotFound() {
  return (
    <Shell>
      <div className="mx-auto grid min-h-[62svh] max-w-lg place-items-center px-5 py-20 text-center">
        <div>
          <BaboonMark color="var(--accent)" className="anim-float mx-auto w-20" />
          <p className="font-mono mt-6 text-[0.7rem] font-bold tracking-[0.3em] text-[var(--accent)] uppercase">
            Error 404
          </p>
          <h1 className="font-condensed mt-3 text-[clamp(2.2rem,7vw,3.6rem)] leading-[0.95] text-cream">
            Te salíste del <span className="shine-gold">territorio</span>
          </h1>
          <p className="mt-4 text-cream/75">
            Esta página no existe o la pieza ya salió de la manada. Volvamos al camino.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/tienda"
              className="font-mono inline-flex min-h-12 items-center rounded-full px-7 text-[0.72rem] font-bold tracking-[0.12em] uppercase transition hover:brightness-95"
              style={{ backgroundColor: "var(--accent)", color: "var(--accent-ink)" }}
            >
              Ver la tienda
            </Link>
            <Link
              href="/"
              className="font-mono inline-flex min-h-12 items-center rounded-full border border-cream/30 px-7 text-[0.72rem] font-bold tracking-[0.12em] text-cream uppercase transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              Ir al inicio
            </Link>
          </div>
        </div>
      </div>
    </Shell>
  );
}
