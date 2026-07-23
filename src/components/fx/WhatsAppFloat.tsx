"use client";

import { IconWhatsApp } from "@/components/ui/Icons";
import { buildWaLink } from "@/lib/whatsapp";

const NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "573504444668";
const MSG = "¡Hola Babuinos! Tengo una duda 🦍";

/** Botón flotante global de WhatsApp (venta conversacional) — esquina inferior derecha. */
export function WhatsAppFloat() {
  return (
    <a
      href={buildWaLink(NUMBER, MSG)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp"
      className="fixed bottom-4 right-4 z-[80] grid h-12 w-12 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_8px_28px_rgba(37,211,102,.4)] transition hover:scale-105 active:scale-95"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <IconWhatsApp className="h-6 w-6" />
    </a>
  );
}
