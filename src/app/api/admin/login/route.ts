import { NextResponse } from "next/server";

const COOKIE = "b_admin";
const ADMIN_USER = process.env.ADMIN_USER ?? "ADMIN";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "1234*";

/** POST { user, password } → sets an httpOnly admin cookie when both match. */
export async function POST(request: Request) {
  let user = "";
  let password = "";
  try {
    const body = (await request.json()) as { user?: string; password?: string };
    user = body.user ?? "";
    password = body.password ?? "";
  } catch {
    return NextResponse.json({ error: "Cuerpo inválido" }, { status: 400 });
  }

  if (user.trim().toUpperCase() !== ADMIN_USER.toUpperCase() || password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Credenciales incorrectas" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, ADMIN_PASSWORD, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  return res;
}
