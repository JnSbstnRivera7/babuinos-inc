import { cn } from "@/lib/utils";

/**
 * The real brand baboon (extracted from the logo) rendered as a recolorable
 * vector-like mark via CSS mask. `color` accepts any CSS color.
 */
export function BaboonMark({
  color = "var(--color-ink)",
  shine = false,
  className,
  style,
}: {
  color?: string;
  shine?: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  const shineStyle: React.CSSProperties = shine
    ? {
        background:
          "linear-gradient(100deg, #a88210 18%, #f6e7a8 46%, #cda214 56%, #a88210 82%)",
        backgroundSize: "200% auto",
        animation: "shine-slide 6s linear infinite",
      }
    : { backgroundColor: color };

  return (
    <span
      aria-hidden
      className={cn("inline-block", className)}
      style={{
        ...shineStyle,
        aspectRatio: "372 / 320",
        // WebP con solo el alfa (lo único que usa la máscara): 174 KB → 18 KB.
        WebkitMaskImage: "url(/brand/baboon.webp)",
        maskImage: "url(/brand/baboon.webp)",
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
