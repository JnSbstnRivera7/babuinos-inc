import Image from "next/image";

/**
 * Static concrete-jungle wallpaper fixed behind the whole page (until the
 * opaque footer covers it). Content scrolls over it with a readability scrim.
 */
export function FixedWallpaper() {
  return (
    <div className="fixed inset-0 -z-10" aria-hidden>
      <Image
        src="/brand/jungle/concrete-jungle.webp"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(8,14,12,0.34) 0%, rgba(8,14,12,0.48) 45%, rgba(8,14,12,0.64) 100%)",
        }}
      />
    </div>
  );
}
