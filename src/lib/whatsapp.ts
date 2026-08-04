import type { CartLine } from "./store";

export interface OrderPayload {
  lines: CartLine[];
  name?: string;
  phone?: string;
  city?: string;
  note?: string;
}

/** Builds the order summary sent to WhatsApp (no prices — coordinated in chat). */
export function buildOrderMessage({ lines, name, phone, city, note }: OrderPayload): string {
  const header = "🦍 *PEDIDO — BABUINOS INC*\n_Colección Fundadores 2026_\n";
  const items = lines
    .map((l, i) => `${i + 1}. *${l.name}* — ${l.colorway}\n   Talla ${l.size} · x${l.qty}`)
    .join("\n");
  const datos = [
    name ? `👤 *Nombre:* ${name}` : "",
    phone ? `📱 *Teléfono:* ${phone}` : "",
    city ? `📍 *Ciudad:* ${city}` : "",
    note ? `📝 *Nota:* ${note}` : "",
  ]
    .filter(Boolean)
    .join("\n");
  const datosBlock = datos ? `\n\n${datos}` : "";
  const footer =
    "\n\n_Quiero coordinar precio, pago y envío de estas piezas. ¡Listo para entrar a la manada!_ 🌿";
  return `${header}\n${items}${datosBlock}${footer}`;
}

/** Builds a single-product WhatsApp message, pre-filled from the PDP selection. */
export function buildProductMessage(name: string, colorway: string, size?: string): string {
  const header = "🦍 *BABUINOS INC*\n_Colección Fundadores 2026_\n";
  const item = `Quiero esta pieza:\n*${name}* — ${colorway}${size ? `\nTalla ${size}` : ""}`;
  const footer = "\n\n_¿Me ayudas a coordinar precio, pago y envío? ¡Listo para la manada!_ 🌿";
  return `${header}\n${item}${footer}`;
}

/** Consulta de talla: mientras no haya tabla de medidas, se resuelve en el chat. */
export function buildSizeMessage(name: string, colorway: string): string {
  const header = "🦍 *BABUINOS INC*\n";
  const item = `Quiero saber qué talla me sirve en:\n*${name}* — ${colorway}`;
  const footer = "\n\n_¿Me pasas las medidas de la prenda?_ 🌿";
  return `${header}\n${item}${footer}`;
}

/** Normalizes a phone number to digits only (wa.me format, no +). */
export function normalizeNumber(raw: string): string {
  return raw.replace(/[^0-9]/g, "");
}

/** Builds a wa.me deep link with the encoded order message. */
export function buildWaLink(numberRaw: string, message: string): string {
  return `https://wa.me/${normalizeNumber(numberRaw)}?text=${encodeURIComponent(message)}`;
}
