import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { PRODUCTS, TALLAS_POSIBLES } from "@/lib/products";
import { saveProductStock } from "@/lib/stock";

/**
 * Guarda el tallaje de una o varias piezas. Mismo candado que el resto del
 * panel: la cookie httpOnly `b_admin` (nadie sin sesión de admin escribe stock).
 *
 * Cuerpo: `{ items: [{ product_id, sizes: [{ size, stock }] }] }`
 * Cada pieza se guarda ENTERA: lo que no venga en `sizes` se borra, así que una
 * pieza con `sizes: []` queda sin tallas (y sale como agotada en la tienda).
 */

const COOKIE = "b_admin";
const IDS = new Set(PRODUCTS.map((p) => p.id));
const SLUG_POR_ID = new Map(PRODUCTS.map((p) => [p.id, p.slug]));
const TALLAS = new Set<string>(TALLAS_POSIBLES);

interface ItemEntrada {
  product_id: string;
  sizes: { size: string; stock: number }[];
}

function esItemValido(x: unknown): x is ItemEntrada {
  if (!x || typeof x !== "object") return false;
  const { product_id, sizes } = x as Record<string, unknown>;
  if (typeof product_id !== "string" || !IDS.has(product_id)) return false;
  if (!Array.isArray(sizes)) return false;
  return sizes.every((s) => {
    if (!s || typeof s !== "object") return false;
    const { size, stock } = s as Record<string, unknown>;
    return (
      typeof size === "string" &&
      TALLAS.has(size) &&
      typeof stock === "number" &&
      Number.isInteger(stock) &&
      stock >= 0 &&
      stock <= 9999
    );
  });
}

export async function POST(request: Request) {
  const store = await cookies();
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "1234*";
  if (store.get(COOKIE)?.value !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  let items: unknown;
  try {
    items = ((await request.json()) as { items?: unknown }).items;
  } catch {
    return NextResponse.json({ error: "Cuerpo inválido" }, { status: 400 });
  }
  if (!Array.isArray(items) || !items.length) {
    return NextResponse.json({ error: "No llegó ninguna pieza" }, { status: 400 });
  }
  // Una pieza inválida (id inexistente, talla rara, negativo) tumba el guardado
  // completo: mejor un error claro que un inventario a medias.
  if (!items.every(esItemValido)) {
    return NextResponse.json({ error: "Hay datos inválidos en el inventario" }, { status: 400 });
  }

  for (const it of items as ItemEntrada[]) {
    // Sin duplicados de talla: la última gana (la tabla tiene PK compuesta).
    const unicas = new Map(it.sizes.map((s) => [s.size, s.stock]));
    const { error } = await saveProductStock(
      it.product_id,
      [...unicas].map(([size, stock]) => ({ size, stock })),
    );
    if (error) return NextResponse.json({ error }, { status: 500 });
  }

  // La tienda y las fichas leen el tallaje en el servidor: sin esto habría que
  // esperar los 30 s del revalidate para ver el cambio.
  revalidatePath("/tienda");
  revalidatePath("/favoritos");
  for (const it of items as ItemEntrada[]) {
    const slug = SLUG_POR_ID.get(it.product_id);
    if (slug) revalidatePath(`/producto/${slug}`);
  }

  return NextResponse.json({ ok: true, piezas: items.length });
}
