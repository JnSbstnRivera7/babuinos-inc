import type { Metadata } from "next";
import { Shell } from "@/components/layout/Shell";
import { Reveal } from "@/components/fx/Reveal";
import { VideoPocillos } from "@/components/pocillos/VideoPocillos";
import { Mostrario } from "@/components/pocillos/Mostrario";
import { DisenosClientes } from "@/components/pocillos/DisenosClientes";
import { IconPocillo, IconPocilloVapor, IconWhatsApp } from "@/components/ui/Icons";
import { waPocillo } from "@/lib/pocillos";

const DESCRIPCION =
  "Tu diseño en un pocillo de cerámica, con tapa, base y cuchara del color que quieras. Normal o mágico: con agua caliente cambia de color.";

export const metadata: Metadata = {
  title: "Pocillos personalizados — Babuinos Inc",
  description: DESCRIPCION,
  // La imagen la pone opengraph-image.jpg de esta carpeta.
  openGraph: {
    title: "Pocillos personalizados — Babuinos Inc",
    description: DESCRIPCION,
    url: "/pocillos",
    siteName: "Babuinos Inc",
    locale: "es_CO",
    type: "website",
  },
};

const TIPOS = [
  {
    Icono: IconPocillo,
    titulo: "Normal",
    desc: "Cerámica blanca con tu diseño a todo color, a la vista desde el primer día.",
  },
  {
    Icono: IconPocilloVapor,
    titulo: "Mágico",
    desc: "Con agua caliente cambia de color y deja ver tu diseño: la sorpresa llega con el primer café.",
  },
];

const PASOS = ["Nos mandas tu idea", "Eliges el tipo y el color", "Lo estampamos para ti"];

/** El botón principal de la página: el color de acento del tema, como el resto del sitio. */
const BOTON =
  "font-mono inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full px-7 text-[0.76rem] font-bold tracking-[0.1em] uppercase transition hover:-translate-y-0.5 hover:brightness-95";
const ACENTO = { backgroundColor: "var(--accent)", color: "var(--accent-ink)" };

/**
 * Pocillos personalizados. No son una pieza del carrito: cada uno se estampa
 * con el diseño del cliente, así que la página entera empuja a escribir por
 * WhatsApp. Orden: el video (lo que más vende), las dos versiones, el
 * mostrario de colores, diseños reales de clientes y el cierre.
 */
export default function PocillosPage() {
  return (
    <Shell>
      <div className="mx-auto max-w-6xl px-5 pb-24 pt-8 md:px-8 md:pt-14">
        {/* ── Portada: en celular el video va primero; en el HTML, el texto. ── */}
        <section className="grid items-center gap-7 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <p className="eyebrow mb-2 text-[var(--accent)]">Nuevo · Pocillos personalizados</p>
            <h1 className="font-condensed text-[clamp(2.5rem,7.5vw,4.6rem)] text-cream">
              Tu idea en un <span className="shine-gold">pocillo</span>
            </h1>
            <p className="mt-4 max-w-md text-cream/75">
              Lo estampamos con el diseño que quieras —tu mascota, un dibujo, una frase— y tú eliges
              el color de la tapa, la base y la cuchara.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
              <a href={waPocillo()} target="_blank" rel="noopener noreferrer" className={BOTON} style={ACENTO}>
                <IconWhatsApp className="h-5 w-5" />
                Diseñar el mío
              </a>
              <a
                href="#colores"
                className="font-mono inline-flex min-h-11 items-center text-[0.72rem] font-bold tracking-[0.12em] text-cream/75 uppercase underline-offset-4 transition hover:text-[var(--accent)] hover:underline"
              >
                Ver colores
              </a>
            </div>
          </div>
          <div className="order-first lg:order-none lg:col-span-7">
            <VideoPocillos />
          </div>
        </section>

        {/* ── Normal o mágico ── */}
        <section aria-labelledby="t-tipos" className="mt-16 md:mt-24">
          <Reveal>
            <p className="eyebrow mb-2 text-[var(--accent)]">Dos versiones</p>
            <h2 id="t-tipos" className="font-condensed text-[clamp(1.9rem,5vw,3.2rem)] text-cream">
              Normal o <span className="shine-gold">mágico</span>
            </h2>
          </Reveal>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {TIPOS.map((t, i) => (
              <Reveal key={t.titulo} delay={0.08 * i}>
                <div className="glass h-full rounded-2xl p-5 md:p-6">
                  <t.Icono className="h-8 w-8 text-[var(--accent)]" />
                  <h3 className="font-mono mt-3 text-[0.8rem] font-bold tracking-[0.14em] text-[var(--accent)] uppercase">
                    {t.titulo}
                  </h3>
                  <p className="mt-2 text-cream/75">{t.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── Mostrario de colores ── */}
        <section id="colores" aria-labelledby="t-colores" className="mt-16 scroll-mt-20 md:mt-24">
          <Mostrario />
        </section>

        {/* ── Diseños de clientes: los tres en una sola imagen ── */}
        <section
          aria-labelledby="t-disenos"
          className="mt-16 grid items-center gap-6 md:mt-24 lg:grid-cols-12 lg:gap-12"
        >
          <Reveal className="lg:col-span-5">
            <p className="eyebrow mb-2 text-[var(--accent)]">Hechos para la manada</p>
            <h2 id="t-disenos" className="font-condensed text-[clamp(1.9rem,5vw,3.2rem)] text-cream">
              Ideas que ya <span className="shine-gold">salieron</span>
            </h2>
            <p className="mt-3 max-w-md text-cream/75">
              Un retrato de mascota, un álbum mágico y un collage de stickers: tres diseños que
              hicimos para clientes, con la vuelta completa del pocillo. Toca uno para verlo en
              grande.
            </p>
          </Reveal>
          <div className="lg:col-span-7">
            <DisenosClientes />
          </div>
        </section>

        {/* ── Cierre ── */}
        <section aria-labelledby="t-idea" className="mt-16 md:mt-24">
          <Reveal>
            <div className="jungle-bg relative overflow-hidden rounded-3xl border border-cream/10 px-6 py-10 text-center md:px-12 md:py-14">
              <h2 id="t-idea" className="font-condensed text-[clamp(2rem,6vw,3.6rem)] text-cream">
                ¿Tienes una <span className="shine-gold">idea</span>?
              </h2>
              <p className="mx-auto mt-3 max-w-lg text-cream/75">
                Mándanos por WhatsApp una foto, un dibujo o una frase. Elegimos juntos el tipo y el
                color, y lo estampamos para ti.
              </p>
              <ol className="mx-auto mt-7 grid max-w-2xl gap-3 text-left sm:grid-cols-3">
                {PASOS.map((p, i) => (
                  <li key={p} className="glass flex items-center gap-3 rounded-xl px-4 py-3">
                    <span className="font-condensed text-[1.7rem] text-[var(--accent)]">{i + 1}</span>
                    <span className="text-[0.88rem] text-cream/80">{p}</span>
                  </li>
                ))}
              </ol>
              <a
                href={waPocillo()}
                target="_blank"
                rel="noopener noreferrer"
                className={`${BOTON} mt-8`}
                style={ACENTO}
              >
                <IconWhatsApp className="h-5 w-5" />
                Escribir por WhatsApp
              </a>
            </div>
          </Reveal>
        </section>
      </div>
    </Shell>
  );
}
