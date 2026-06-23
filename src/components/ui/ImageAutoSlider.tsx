"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Smooth infinite horizontal image loop (inspired by 21st.dev image-auto-slider).
 * Duplicates the set once and translates -50% for a seamless marquee.
 */
export function ImageAutoSlider({
  images,
  speed = 38,
  className,
  reverse = false,
  aspect = "16 / 11",
  fit = "cover",
}: {
  images: { src: string; alt: string }[];
  speed?: number;
  className?: string;
  reverse?: boolean;
  aspect?: string;
  fit?: "cover" | "contain";
}) {
  const loop = [...images, ...images];
  return (
    <div className={cn("group relative w-full overflow-hidden", className)}>
      {/* edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-ink to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-ink to-transparent" />

      <div
        className="flex w-max gap-5 group-hover:[animation-play-state:paused]"
        style={{
          animation: `marquee ${speed}s linear infinite`,
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        {loop.map((img, i) => (
          <div
            key={i}
            className="relative h-[clamp(220px,40vh,420px)] w-auto shrink-0 overflow-hidden rounded-2xl bg-[#eceae6] ring-1 ring-cream/10"
            style={{ aspectRatio: aspect }}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              sizes="560px"
              className={cn(
                "transition-transform duration-700 hover:scale-105",
                fit === "cover" ? "object-cover" : "object-contain p-3",
              )}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
