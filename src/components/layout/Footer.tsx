import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { SocialButtons } from "@/components/ui/SocialButtons";
import { IconTruck, IconRefresh, IconCheck } from "@/components/ui/Icons";
import { BRAND } from "@/lib/brand";

const TRUST = [
  // Envíos y la línea legal usan el nombre REAL de la ciudad: el cliente
  // necesita entenderlos literal. "Tábogo" es solo voz de marca.
  { Icon: IconTruck, text: `Envío 24h ${BRAND.ciudadReal} · 3-5 días ${BRAND.pais}` },
  { Icon: IconRefresh, text: "Cambios en 15 días" },
  { Icon: IconCheck, text: "Pago seguro por WhatsApp" },
];

/**
 * Solo enlaces que LLEVAN a algún lado. Antes eran 12 con href="#" prometiendo
 * páginas que no existen (Proceso, Sostenibilidad, Prensa, Ediciones Patch...);
 * en una tienda en vivo un footer así lee como que no hay nadie detrás.
 * Cuando existan Envíos/Cambios/FAQ se agregan acá.
 */
const COLS: { title: string; links: { label: string; href: string; externo?: boolean }[] }[] = [
  {
    title: "Tienda",
    links: [
      { label: "Todas las camisas", href: "/tienda" },
      { label: "Básicas", href: "/tienda?tipo=basica" },
      { label: "Estampadas", href: "/tienda?tipo=estampada" },
      { label: "Favoritos", href: "/favoritos" },
    ],
  },
  {
    title: "Info",
    links: [
      { label: "Nuestra historia", href: "/nosotros" },
      { label: "Club Babuinos", href: "/club" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="brick-pattern liana-edge cv-auto relative px-5 pt-10 pb-6 md:px-8">
      {/* barra de confianza */}
      <div className="mx-auto mb-9 flex max-w-6xl flex-col gap-3 border-b border-cream/10 pb-8 sm:flex-row sm:items-center sm:justify-center sm:gap-10">
        {TRUST.map(({ Icon, text }) => (
          <div key={text} className="flex items-center justify-center gap-2.5 text-cream/80">
            <Icon className="h-5 w-5 shrink-0 text-[var(--accent)]" />
            <span className="font-mono text-[0.66rem] font-bold tracking-[0.08em] uppercase">{text}</span>
          </div>
        ))}
      </div>

      <div className="mx-auto grid max-w-6xl gap-8 border-b border-cream/10 pb-7 md:grid-cols-[2fr_1fr_1fr]">
        <div>
          <Logo tone="cream" className="h-9 w-auto" />
          <p className="mt-4 max-w-xs text-[0.85rem] leading-relaxed text-cream/75">
            {BRAND.origen}
          </p>
          <p className="font-mono mt-3 text-[0.68rem] font-bold tracking-[0.16em] text-[var(--accent)] uppercase">
            {BRAND.sello}
          </p>
          <SocialButtons variant="icon" className="mt-5" />
        </div>
        {COLS.map((c) => (
          <div key={c.title}>
            <h4 className="font-mono mb-4 text-[0.68rem] font-bold tracking-[0.16em] text-gold uppercase">
              {c.title}
            </h4>
            <ul className="space-y-1">
              {c.links.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="-mx-2 flex min-h-11 items-center rounded px-2 text-[0.85rem] text-cream/75 transition hover:text-cream"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mx-auto mt-5 flex max-w-6xl flex-wrap items-center justify-between gap-3">
        <p className="font-mono text-[0.68rem] tracking-[0.06em] text-cream/55">
          © {BRAND.est} {BRAND.nombre}. — {BRAND.ciudadReal}, {BRAND.pais}. Todos los derechos
          reservados.
        </p>
        <p className="font-mono text-[0.68rem] text-cream/55">Streetwear Cult · Est. {BRAND.est}</p>
      </div>
    </footer>
  );
}
