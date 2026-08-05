import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { buildOrderMessage, buildWaLink, type OrderPayload } from "@/lib/whatsapp";

/**
 * La nota que se guarda deja constancia de la autorización de datos (Ley 1581)
 * sin necesitar una columna nueva en la tabla. Cuando exista `privacy_accepted`
 * conviene guardarlo también como booleano aparte.
 */
function buildNote(p: OrderPayload): string | null {
  const consent = p.privacyAccepted ? "[Autorizó tratamiento de datos · Ley 1581]" : "";
  return [p.note, consent].filter(Boolean).join(" ") || null;
}

/**
 * POST /api/checkout
 * Body: OrderPayload  →  { url } (wa.me deep link)
 * Optionally persists the order to Supabase and fires a webhook,
 * but always returns a working WhatsApp link even with no backend.
 */
export async function POST(request: Request) {
  let payload: OrderPayload;
  try {
    payload = (await request.json()) as OrderPayload;
  } catch {
    return NextResponse.json({ error: "Cuerpo inválido" }, { status: 400 });
  }

  if (!payload.lines?.length) {
    return NextResponse.json({ error: "El carrito está vacío" }, { status: 400 });
  }

  const message = buildOrderMessage(payload);
  const number = process.env.WHATSAPP_NUMBER ?? process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";
  const url = number ? buildWaLink(number, message) : "";

  // Best-effort: persist to Supabase (orders table) if configured.
  try {
    const sbUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const sbKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (sbUrl && sbKey) {
      const supabase = createClient(sbUrl, sbKey);
      // OJO: no metas `privacy_accepted` acá hasta agregar la columna a la tabla
      // `orders`. PostgREST NO ignora columnas desconocidas: falla el insert
      // entero y, como esto va en try/catch, dejaría de guardarse TODO pedido en
      // silencio. Por ahora la prueba del consentimiento viaja en la nota y en
      // el mensaje de WhatsApp. Ver PENDIENTES para la migración.
      await supabase.from("orders").insert({
        customer_name: payload.name ?? null,
        phone: payload.phone ?? null,
        city: payload.city ?? null,
        note: buildNote(payload),
        items: payload.lines,
      });
    }
  } catch {
    // swallow — never block the sale on backend issues
  }

  // Best-effort: fire an outbound webhook (n8n, Make, etc.).
  try {
    const hook = process.env.WHATSAPP_WEBHOOK_URL;
    if (hook) {
      await fetch(hook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, ...payload }),
      });
    }
  } catch {
    // swallow
  }

  return NextResponse.json({ url, message, configured: Boolean(number) });
}
