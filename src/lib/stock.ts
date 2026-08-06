import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { StockMap } from "./products";

/**
 * Lectura y escritura del tallaje real (tabla `product_stock`).
 *
 * Va con la SERVICE ROLE porque la tabla tiene RLS sin políticas: nadie entra
 * desde el navegador, solo el servidor. Si la tabla no existe todavía o faltan
 * las variables de entorno, `getStockMap()` devuelve `{}` y el catálogo se
 * queda con su tallaje provisional en vez de romperse.
 */

export const STOCK_TABLE = "product_stock";

export interface StockRow {
  product_id: string;
  size: string;
  stock: number;
}

function admin(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return url && key ? createClient(url, key, { auth: { persistSession: false } }) : null;
}

/** Filas crudas + el error, para que el panel pueda decir qué pasó. */
export async function readStock(): Promise<{ rows: StockRow[]; error: string }> {
  const db = admin();
  if (!db) return { rows: [], error: "Supabase no configurado (faltan variables de entorno)." };
  const { data, error } = await db.from(STOCK_TABLE).select("product_id, size, stock");
  if (error) return { rows: [], error: error.message };
  return { rows: (data as StockRow[]) ?? [], error: "" };
}

export function toStockMap(rows: StockRow[]): StockMap {
  const map: StockMap = {};
  for (const r of rows) {
    (map[r.product_id] ??= {})[r.size] = r.stock;
  }
  return map;
}

/** Lo que consumen las páginas de la tienda. Nunca lanza. */
export async function getStockMap(): Promise<StockMap> {
  const { rows } = await readStock();
  return toStockMap(rows);
}

/**
 * Deja el tallaje de UNA pieza exactamente como lo mandó el panel: sube las
 * tallas que llegan y borra las que ya no. Sin la parte del borrado, una talla
 * que se quita del formulario seguiría viva en la tienda.
 */
export async function saveProductStock(
  productId: string,
  sizes: { size: string; stock: number }[],
): Promise<{ error: string }> {
  const db = admin();
  if (!db) return { error: "Supabase no configurado." };

  // `updated_at` se manda a mano: el default de la tabla solo aplica al insertar,
  // y en el upsert la fila actualizada se quedaría con la fecha vieja.
  const ahora = new Date().toISOString();
  const filas = sizes.map((s) => ({
    product_id: productId,
    size: s.size,
    stock: s.stock,
    updated_at: ahora,
  }));
  // Entrecomillado porque PostgREST parte la lista por comas.
  const quedan = filas.map((f) => `"${f.size}"`).join(",");

  const borrado = quedan.length
    ? await db.from(STOCK_TABLE).delete().eq("product_id", productId).not("size", "in", `(${quedan})`)
    : await db.from(STOCK_TABLE).delete().eq("product_id", productId);
  if (borrado.error) return { error: borrado.error.message };

  if (!filas.length) return { error: "" };
  const { error } = await db.from(STOCK_TABLE).upsert(filas, { onConflict: "product_id,size" });
  return { error: error?.message ?? "" };
}
