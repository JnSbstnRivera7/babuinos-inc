import type { Metadata } from "next";
import { Shell } from "@/components/layout/Shell";
import { BaboonMark } from "@/components/ui/BaboonMark";
import { IconWhatsApp } from "@/components/ui/Icons";
import { buildWaLink } from "@/lib/whatsapp";
import { POLITICA, RESPONSABLE, VIGENCIA } from "@/lib/privacidad";

export const metadata: Metadata = {
  title: "Tratamiento de datos — Babuinos Inc",
  description:
    "Política de tratamiento de datos personales de Babuinos Inc, conforme a la Ley 1581 de 2012 y el Decreto 1377 de 2013.",
};

/**
 * Va dentro de `Shell`, así que hereda el wallpaper fijo y el marco de la
 * tienda: es una página de la marca, no un documento legal desconectado.
 */
export default function PrivacidadPage() {
  const wa = buildWaLink(
    RESPONSABLE.whatsapp,
    "🦍 *BABUINOS INC*\n\nQuiero hacer una solicitud sobre mis datos personales.",
  );

  return (
    <Shell>
      <div className="mx-auto max-w-3xl px-5 pb-24 pt-10 md:px-8 md:pt-16">
        <p className="eyebrow mb-2 text-[var(--accent)]">Ley 1581 de 2012</p>
        <h1 className="font-condensed text-[clamp(2rem,6vw,3.4rem)] leading-[0.95] text-cream">
          Tratamiento de <span className="shine-gold">datos personales</span>
        </h1>
        <p className="mt-4 max-w-prose text-cream/75">
          Esto es lo que hacemos con los datos que nos das para despacharte un pedido. Está escrito
          para que se entienda, no para esconder nada.
        </p>
        <p className="font-mono mt-3 text-[0.66rem] tracking-[0.12em] text-cream/60 uppercase">
          Vigente desde el {VIGENCIA}
        </p>

        <div className="mt-10 space-y-9">
          {POLITICA.map((s) => (
            <section key={s.titulo}>
              <h2 className="font-condensed text-[clamp(1.2rem,4vw,1.6rem)] text-cream">
                {s.titulo}
              </h2>
              {s.parrafos?.map((p) => (
                <p key={p} className="mt-3 leading-relaxed text-cream/75">
                  {p}
                </p>
              ))}
              {s.lista && (
                <ul className="mt-3 space-y-2">
                  {s.lista.map((li) => (
                    <li key={li} className="flex gap-3 leading-relaxed text-cream/75">
                      <BaboonMark
                        color="var(--accent)"
                        className="mt-1.5 h-3 w-3.5 shrink-0"
                      />
                      <span>{li}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        {/* Canal para ejercer los derechos */}
        <div className="glass mt-12 rounded-2xl p-6">
          <h2 className="font-condensed text-[clamp(1.2rem,4vw,1.6rem)] text-cream">
            ¿Quieres ver, corregir o borrar tus datos?
          </h2>
          <p className="mt-2 text-cream/75">
            Escríbenos y lo resolvemos. Es gratis y es tu derecho.
          </p>
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono mt-5 inline-flex min-h-12 items-center gap-2 rounded-md bg-[#25D366] px-6 text-[0.75rem] font-bold tracking-[0.1em] text-white uppercase transition hover:brightness-95"
          >
            <IconWhatsApp className="h-4 w-4" /> Escribir por WhatsApp
          </a>
        </div>

        <p className="font-mono mt-8 text-[0.66rem] leading-relaxed tracking-[0.06em] text-cream/60">
          {RESPONSABLE.nombre} · {RESPONSABLE.ciudad}. La autoridad de protección de datos en
          Colombia es la Superintendencia de Industria y Comercio.
        </p>
      </div>
    </Shell>
  );
}
