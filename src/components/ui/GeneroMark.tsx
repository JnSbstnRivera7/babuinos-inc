import { BaboonMark } from "@/components/ui/BaboonMark";
import { IconCap, IconBow } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";
import type { Genero } from "@/lib/products";

/**
 * Babuino de marca con accesorio de género encima (gorra = hombre, moño = mujer).
 * PLACEHOLDER: cuando estén los íconos definitivos del logo con gorra/moño,
 * reemplaza el <IconCap/> / <IconBow/> por <Image src="/brand/genero/hombre.png" .../>.
 */
export function GeneroMark({
  genero,
  color = "var(--color-cream)",
  className,
}: {
  genero: Genero;
  color?: string;
  className?: string;
}) {
  return (
    <span className={cn("relative inline-flex items-center justify-center", className)} aria-hidden>
      <BaboonMark color={color} className="w-full" />
      {genero === "hombre" && (
        <IconCap
          className="absolute left-1/2 top-0 w-[46%] -translate-x-1/2 -translate-y-[38%]"
          style={{ color }}
        />
      )}
      {genero === "mujer" && (
        <IconBow
          className="absolute left-1/2 top-0 w-[34%] -translate-x-1/2 -translate-y-[30%]"
          style={{ color }}
        />
      )}
    </span>
  );
}
