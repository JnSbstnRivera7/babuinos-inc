import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * La pieza 05 se llamaba "Rootwailer" (mal escrito) y pasó a "Rottweiler", la
   * raza. Cambiar el slug rompe cualquier enlace que ya se haya pasado por
   * WhatsApp, así que la vieja URL redirige permanente (308) a la nueva.
   */
  async redirects() {
    return [
      {
        source: "/producto/rootwailer",
        destination: "/producto/rottweiler",
        permanent: true,
      },
      /**
       * Piezas retiradas del catálogo (licencias de terceros, 7-ago). Sus fichas
       * ya no existen: en vez de dejar un 404 —hay enlaces compartidos por
       * WhatsApp y las URLs estaban en el sitemap— caen en la tienda.
       */
      { source: "/producto/guns-roses-red", destination: "/tienda", permanent: true },
      { source: "/producto/the-mills", destination: "/tienda", permanent: true },
    ];
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
      {
        // The service worker must never be cached, so PWA updates ship instantly.
        source: "/sw.js",
        headers: [
          { key: "Content-Type", value: "application/javascript; charset=utf-8" },
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
        ],
      },
    ];
  },
};

export default nextConfig;
