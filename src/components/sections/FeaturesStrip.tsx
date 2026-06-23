import { IconTruck, IconShirt, IconNeedle, IconRefresh } from "@/components/ui/Icons";

const FEATURES = [
  { Icon: IconTruck, title: "Envío rápido", sub: "Bogotá 24h · Colombia 3–5 días" },
  { Icon: IconShirt, title: "Fit oversize", sub: "Tallas XS a 3XL" },
  { Icon: IconNeedle, title: "Calidad premium", sub: "100% algodón 220 g/m²" },
  { Icon: IconRefresh, title: "Cambios sin drama", sub: "15 días para tu talla" },
];

export function FeaturesStrip() {
  return (
    <div className="liana-edge border-y border-cream/10 bg-ink/55 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl flex-wrap justify-around gap-6 px-5 py-8 md:px-8">
        {FEATURES.map(({ Icon, title, sub }) => (
          <div key={title} className="flex items-center gap-3 text-cream">
            <Icon className="h-6 w-6 shrink-0 text-[var(--accent)]" />
            <span>
              <strong className="font-mono block text-[0.72rem] font-bold tracking-[0.1em] uppercase">
                {title}
              </strong>
              <small className="text-[0.78rem] text-cream/70">{sub}</small>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
