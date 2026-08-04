import type { MetadataRoute } from "next";

const BASE = "https://babuinos-inc.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // El panel ya es noindex por metadata, pero mejor que no lo rastreen.
      disallow: ["/admin", "/api/"],
    },
    sitemap: `${BASE}/sitemap.xml`,
  };
}
