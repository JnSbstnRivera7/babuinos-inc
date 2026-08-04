/* ════════════════════════════════════════════════════════════
   BABUINOS INC — Copy de marca (fuente única)

   El texto de marca vivía repartido en el footer, el Story, los
   metadatos y el manifest. Acá está una sola vez.
   ════════════════════════════════════════════════════════════ */

export const BRAND = {
  nombre: "Babuinos Inc",

  /** Nombre de calle de la ciudad — es el que se usa en voz de marca. */
  ciudad: "Tábogo",
  /**
   * Nombre real, para donde el cliente necesita entenderlo literal: tiempos de
   * envío y la línea legal del footer.
   */
  ciudadReal: "Bogotá",
  pais: "Colombia",

  /**
   * Altura de la ciudad. Son 2.600 METROS (≈8.530 ft) — es la referencia de
   * "2.600 metros más cerca de las estrellas". Si algún día se quiere en pies,
   * se cambia solo acá.
   */
  altura: "2.600 m",

  est: "2026",
  tagline: "Street Adventure Heritage",

  /** Frase de apertura: de dónde salimos y para quién. */
  origen: "Del asfalto de Tábogo para el mundo. Puro streetwear para alimentar a la manada.",
  /** Bienvenida — cierra la historia y el footer. */
  bienvenida: "Actitud, calle y orgullo local. Bienvenido a la manada de Babuinos Inc en Tábogo.",
  /** Sello corto para estampas y pies de página. */
  sello: "Diseñado a 2.600 m",
} as const;

/** "Est. 2026 · Tábogo · 2.600 m" */
export const SELLO_ORIGEN = `Est. ${BRAND.est} · ${BRAND.ciudad} · ${BRAND.altura}`;
