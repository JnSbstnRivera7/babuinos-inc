import { BaboonMark } from "@/components/ui/BaboonMark";
import { cn } from "@/lib/utils";
import type { Genero } from "@/lib/products";

/**
 * Babuino de marca por género (íconos reales de Juan):
 *  - hombre = babuino con gorra   → /brand/genero/hombre.png
 *  - mujer  = babuino con gorra + cola de caballo → /brand/genero/mujer.png
 *  - unisex = babuino normal (BaboonMark)
 * Se pintan por CSS mask, así se recolorean a cream/accent como el resto de la marca.
 */
const MARKS: Record<"hombre" | "mujer", { src: string; ratio: string }> = {
  hombre: { src: "/brand/genero/hombre.svg", ratio: "944 / 714" },
  mujer: { src: "/brand/genero/mujer.svg", ratio: "868 / 714" },
};

export function GeneroMark({
  genero,
  color = "var(--color-cream)",
  shine = false,
  className,
  style,
}: {
  genero: Genero;
  color?: string;
  shine?: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  if (genero === "unisex") {
    return <BaboonMark color={color} shine={shine} className={className} style={style} />;
  }

  const m = MARKS[genero];
  const paint: React.CSSProperties = shine
    ? {
        background: "linear-gradient(100deg, #a88210 18%, #f6e7a8 46%, #cda214 56%, #a88210 82%)",
        backgroundSize: "200% auto",
        animation: "shine-slide 6s linear infinite",
      }
    : { backgroundColor: color };

  return (
    <span
      aria-hidden
      className={cn("inline-block", className)}
      style={{
        ...paint,
        aspectRatio: m.ratio,
        WebkitMaskImage: `url(${m.src})`,
        maskImage: `url(${m.src})`,
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
        WebkitMaskSize: "contain",
        maskSize: "contain",
        ...style,
      }}
    />
  );
}
