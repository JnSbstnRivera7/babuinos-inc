import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/** POST /api/waitlist  Body: { email }  → joins the Club Babuinos waitlist. */
export async function POST(request: Request) {
  let email: string | undefined;
  try {
    ({ email } = (await request.json()) as { email?: string });
  } catch {
    return NextResponse.json({ error: "Cuerpo inválido" }, { status: 400 });
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Correo inválido" }, { status: 400 });
  }

  try {
    const sbUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const sbKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (sbUrl && sbKey) {
      const supabase = createClient(sbUrl, sbKey);
      await supabase.from("waitlist").upsert({ email }, { onConflict: "email" });
    }
  } catch {
    // swallow — confirm to the user regardless
  }

  return NextResponse.json({ ok: true });
}
