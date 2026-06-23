import type { CartLine } from "./store";

export interface OrderPayload {
  lines: CartLine[];
  name?: string;
  note?: string;
}

/** Builds the order summary sent to WhatsApp (no prices — coordinated in chat). */
export function buildOrderMessage({ lines, name, note }: OrderPayload): string {
  const header = "🦍 *PEDIDO — BABUINOS INC*\n_Colección Fundadores 2026_\n";
  const items = lines
    .map((l, i) => `${i + 1}. *${l.name}* — ${l.colorway}\n   Talla ${l.size} · x${l.qty}`)
    .join("\n");
  const who = name ? `\n\n👤 *Cliente:* ${name}` : "";
  const extra = note ? `\n📝 *Nota:* ${note}` : "";
  const footer =
    "\n\n_Quiero coordinar precio, pago y envío de estas piezas. ¡Listo para entrar a la manada!_ 🌿";
  return `${header}\n${items}${who}${extra}${footer}`;
}

/** Normalizes a phone number to digits only (wa.me format, no +). */
export function normalizeNumber(raw: string): string {
  return raw.replace(/[^0-9]/g, "");
}

/** Builds a wa.me deep link with the encoded order message. */
export function buildWaLink(numberRaw: string, message: string): string {
  return `https://wa.me/${normalizeNumber(numberRaw)}?text=${encodeURIComponent(message)}`;
}
