import type { CartLine } from "./store";
import { formatCOP } from "./products";

export interface OrderTotals {
  subtotal: number;
  total: number;
}

export interface OrderPayload {
  lines: CartLine[];
  name?: string;
  phone?: string;
  city?: string;
  note?: string;
  /** El cliente marcó la autorización de datos (Ley 1581). */
  privacyAccepted?: boolean;
  /** Totales ya calculados en el carrito. */
  totals?: OrderTotals;
}

/** Un guión de género corto para la línea (mayúscula inicial). */
function generoLabel(g?: string): string {
  if (g === "hombre") return " · Hombre";
  if (g === "mujer") return " · Mujer";
  return "";
}

/** Builds the order summary sent to WhatsApp. */
export function buildOrderMessage({
  lines,
  name,
  phone,
  city,
  note,
  privacyAccepted,
  totals,
}: OrderPayload): string {
  const header = "🦍 *PEDIDO — BABUINOS INC*\n_Colección Fundadores 2026_\n";
  const items = lines
    .map((l, i) => {
      const precio = typeof l.price === "number" ? `  ·  ${formatCOP(l.price * l.qty)}` : "";
      return `${i + 1}. *${l.name}* — ${l.colorway}\n   Talla ${l.size}${generoLabel(l.genero)} · x${l.qty}${precio}`;
    })
    .join("\n");

  // Total del pedido. Desde el 22-sep no hay promos por combo, así que el
  // subtotal y el total son el mismo número: se manda una sola línea.
  const totalesBlock = totals ? `\n\n✅ *Total:* ${formatCOP(totals.total)}` : "";

  const datos = [
    name ? `👤 *Nombre:* ${name}` : "",
    phone ? `📱 *Teléfono:* ${phone}` : "",
    city ? `📍 *Ciudad:* ${city}` : "",
    note ? `📝 *Nota:* ${note}` : "",
  ]
    .filter(Boolean)
    .join("\n");
  const datosBlock = datos ? `\n\n${datos}` : "";
  // Deja constancia en el propio chat de que autorizó el tratamiento de datos.
  const consentimiento = privacyAccepted
    ? "\n\n✅ _Autoricé el tratamiento de mis datos (Ley 1581/2012)._"
    : "";
  const footer = "\n\n_Confirmo mi pedido. Coordinemos pago y envío. ¡Listo para la manada!_ 🌿";
  return `${header}\n${items}${totalesBlock}${datosBlock}${consentimiento}${footer}`;
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
