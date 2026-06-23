import { Logo } from "@/components/ui/Logo";
import { SocialButtons } from "@/components/ui/SocialButtons";

const COLS = [
  { title: "Tienda", links: ["Camisas Oversize", "Ediciones Patch", "Drops Exclusivos", "Guía de Tallas"] },
  { title: "Info", links: ["Nuestra Historia", "Proceso", "Sostenibilidad", "Prensa"] },
  { title: "Ayuda", links: ["Envíos y Tiempos", "Cambios", "FAQ", "Contacto"] },
];

export function Footer() {
  return (
    <footer className="brick-pattern liana-edge relative px-5 pt-10 pb-6 md:px-8">
      <div className="mx-auto grid max-w-6xl gap-8 border-b border-cream/10 pb-7 md:grid-cols-[2fr_1fr_1fr_1fr]">
        <div>
          <Logo tone="cream" className="h-9 w-auto" />
          <p className="mt-4 max-w-xs text-[0.85rem] leading-relaxed text-cream/45">
            Streetwear Cult desde Bogotá para el mundo. Ropa oversize con identidad, actitud y un
            parche que te representa.
          </p>
          <SocialButtons variant="icon" className="mt-5" />
        </div>
        {COLS.map((c) => (
          <div key={c.title}>
            <h4 className="font-mono mb-4 text-[0.62rem] font-bold tracking-[0.16em] text-gold uppercase">
              {c.title}
            </h4>
            <ul className="space-y-2.5">
              {c.links.map((l) => (
                <li key={l}>
                  <a href="#" className="text-[0.85rem] text-cream/45 transition hover:text-cream">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mx-auto mt-5 flex max-w-6xl flex-wrap items-center justify-between gap-3">
        <p className="font-mono text-[0.62rem] tracking-[0.06em] text-cream/25">
          © 2026 Babuinos Inc. — Bogotá, Colombia. Todos los derechos reservados.
        </p>
        <p className="font-mono text-[0.62rem] text-cream/25">Streetwear Cult · Est. 2026</p>
      </div>
    </footer>
  );
}
