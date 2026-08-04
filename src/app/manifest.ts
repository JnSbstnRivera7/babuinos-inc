import type { MetadataRoute } from "next";

/**
 * Web App Manifest — makes Babuinos Inc installable as a PWA on mobile/desktop.
 * Served by Next at /manifest.webmanifest (auto-linked in <head>).
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Babuinos Inc — Streetwear Cult",
    short_name: "Babuinos",
    description:
      "Del asfalto de Tábogo para el mundo. Streetwear oversize para los que no siguen la manada. Diseñado a 2.600 m. 🦍",
    id: "/",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#0e1311",
    theme_color: "#1e2021",
    lang: "es-CO",
    dir: "ltr",
    categories: ["shopping", "lifestyle"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/maskable-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
