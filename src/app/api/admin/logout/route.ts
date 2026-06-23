import { NextResponse } from "next/server";

/** GET → clears the admin cookie and returns to /admin. */
export async function GET(request: Request) {
  const res = NextResponse.redirect(new URL("/admin", request.url));
  res.cookies.set("b_admin", "", { path: "/", maxAge: 0 });
  return res;
}
