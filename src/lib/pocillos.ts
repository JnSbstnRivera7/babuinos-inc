/* ════════════════════════════════════════════════════════════
   BABUINOS INC — Pocillos personalizados (fuente única)

   El pocillo se estampa por pedido con el diseño del cliente, así que no
   pasa por el carrito: lo que se elige es el tipo (normal o mágico) y el
   color de la tapa, la base y la cuchara, y el pedido se arma por WhatsApp.
   Las fotos y el video salen de MATERIAL/Pocillos (fuera del repo).
   ════════════════════════════════════════════════════════════ */

import { buildWaLink } from "./whatsapp";

const NUMERO = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "573504444668";

export interface ColorPocillo {
  key: string;
  nombre: string;
  /**
   * Tono de la tapa para la muestra redonda. Medido en la foto, entre la
   * sombra y el brillo: la mediana pura sale casi negra en los oscuros.
   */
  hex: string;
  foto: string;
}

/** El mostrario: el mismo pocillo blanco con tapa, base y cuchara de cada color. */
export const COLORES_POCILLO: ColorPocillo[] = [
  { key: "azul-marino", nombre: "Azul marino", hex: "#222b4a", foto: "/brand/pocillos/azul-marino.webp" },
  { key: "azul-cielo", nombre: "Azul cielo", hex: "#86b2e0", foto: "/brand/pocillos/azul-cielo.webp" },
  { key: "amarillo", nombre: "Amarillo", hex: "#f4dd72", foto: "/brand/pocillos/amarillo.webp" },
  { key: "verde-menta", nombre: "Verde menta", hex: "#a3c08a", foto: "/brand/pocillos/verde-menta.webp" },
  { key: "verde-bosque", nombre: "Verde bosque", hex: "#1f4136", foto: "/brand/pocillos/verde-bosque.webp" },
  { key: "negro", nombre: "Negro", hex: "#1c1c1c", foto: "/brand/pocillos/negro.webp" },
];

export interface DisenoCliente {
  key: string;
  titulo: string;
  desc: string;
  src: string;
  ancho: number;
  alto: number;
}

/**
 * Diseños que ya se hicieron para clientes: la vuelta completa del pocillo,
 * extendida. Van por la IDEA y no por el nombre del cliente (no hay permiso
 * para publicar nombres), y sin nombrar marcas ajenas en el texto.
 */
export const DISENOS_CLIENTES: DisenoCliente[] = [
  {
    key: "retrato-mascota",
    titulo: "Retrato de mascota",
    desc: "Su perro en el centro, entre huellas y corazones de colores.",
    src: "/brand/pocillos/disenos/retrato-mascota.webp",
    ancho: 1585,
    alto: 737,
  },
  {
    key: "album-magico",
    titulo: "Álbum mágico",
    desc: "Su perrito en fotos tipo polaroid, con escoba, bufanda y varita.",
    src: "/brand/pocillos/disenos/album-magico.webp",
    ancho: 1600,
    alto: 772,
  },
  {
    key: "collage-stickers",
    titulo: "Collage de stickers",
    desc: "Diez momentos de su perrito y, en el centro, un retrato de rey.",
    src: "/brand/pocillos/disenos/collage-stickers.webp",
    ancho: 1600,
    alto: 730,
  },
];

/**
 * Los tres diseños juntos en UNA imagen (láminas en zigzag, fondo
 * transparente), para que la sección no ocupe tres pantallas. La arma
 * `scripts/collage_pocillos.py` con los WebP de arriba; si cambia un diseño,
 * se corre de nuevo y se copian aquí las zonas que imprime. `zonas` es la caja
 * de cada lámina en % de la imagen: ahí van los botones que abren cada diseño.
 */
export const COLLAGE_DISENOS = {
  src: "/brand/pocillos/disenos/collage.webp",
  ancho: 1680,
  alto: 1170,
  zonas: [
    { key: "retrato-mascota", x: 2.1, y: 2.1, w: 59.5, h: 42.7 },
    { key: "album-magico", x: 38.4, y: 28.2, w: 59.4, h: 43.7 },
    { key: "collage-stickers", x: 2.4, y: 54.6, w: 59.0, h: 40.3 },
  ],
};

/**
 * Enlace a WhatsApp con el mensaje empezado. Termina en "Mi idea es: " para
 * que el cliente siga escribiendo ahí mismo; si eligió color, ya va escrito.
 */
export function waPocillo(color?: string): string {
  // "en color …" y no el adjetivo suelto: "tapa, base y cuchara amarillo" no concuerda.
  const pedido = color
    ? `Quiero un pocillo personalizado con tapa, base y cuchara en color ${color.toLowerCase()}.`
    : "Quiero un pocillo personalizado.";
  return buildWaLink(NUMERO, `¡Hola Babuinos! ${pedido} Mi idea es: `);
}
