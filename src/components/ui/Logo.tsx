import Image from "next/image";
import { cn } from "@/lib/utils";

const SRC = {
  ink: "/brand/logo-horizontal.png",
  cream: "/brand/logo-cream.png",
  gold: "/brand/logo-gold.png",
} as const;

/** Real brand logo in a solid brand color (no CSS filter — crisp on any surface). */
export function Logo({
  className,
  tone = "ink",
  priority = false,
  sizes = "(max-width: 640px) 60vw, 460px",
}: {
  className?: string;
  tone?: keyof typeof SRC;
  priority?: boolean;
  /** Ancho real que ocupa, para que no baje un render de 3840px en un celular. */
  sizes?: string;
}) {
  return (
    <Image
      src={SRC[tone]}
      alt="Babuinos Inc"
      width={1536}
      height={1024}
      priority={priority}
      sizes={sizes}
      className={cn("max-w-full object-contain", className)}
    />
  );
}
