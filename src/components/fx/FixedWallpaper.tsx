/**
 * Wallpaper "selva de cemento" fijo detrás de toda la página (hasta que el
 * footer opaco lo cubre). El contenido scrollea encima con un velo de lectura.
 *
 * Art-directed con <picture>: en móvil (<768px) sirve la versión VERTICAL, en
 * escritorio la HORIZONTAL. El navegador descarga solo la que corresponde al
 * viewport (no las dos).
 */
export function FixedWallpaper() {
  return (
    <div className="fixed inset-0 -z-10" aria-hidden>
      <picture>
        <source media="(max-width: 767px)" srcSet="/brand/jungle/concrete-jungle-mobile.webp" />
        <img
          src="/brand/jungle/concrete-jungle.webp"
          alt=""
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </picture>
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
