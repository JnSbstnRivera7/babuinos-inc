import type { Metadata } from "next";
import { Shell } from "@/components/layout/Shell";
import { TiendaClient } from "@/components/tienda/TiendaClient";
import { getStockMap } from "@/lib/stock";
import type { Category, Genero } from "@/lib/products";

export const metadata: Metadata = {
  title: "Tienda — Babuinos Inc",
  description: "Explora la Colección Fundadores 2026. Camisas oversize para toda la manada.",
};

const VALID: (Genero | "all")[] = ["all", "hombre", "mujer", "unisex"];
const VALID_TIPO: (Category | "all")[] = ["all", "basica", "estampada"];

export default async function TiendaPage({
  searchParams,
}: {
  searchParams: Promise<{ genero?: string; tipo?: string }>;
}) {
  const { genero, tipo } = await searchParams;
  const initial = (VALID as string[]).includes(genero ?? "") ? (genero as Genero | "all") : "all";
  const initialTipo = (VALID_TIPO as string[]).includes(tipo ?? "")
    ? (tipo as Category | "all")
    : "all";

  // Tallaje real desde Supabase (lo que Juan edita en /admin). Si la tabla aún
  // no existe llega vacío y el catálogo usa su tallaje provisional.
  const stockMap = await getStockMap();

  return (
    <Shell>
      {/* key remonta al cambiar los params para que los filtros sigan a la URL */}
      <TiendaClient
        key={`${initial}-${initialTipo}`}
        initialGenero={initial}
        initialTipo={initialTipo}
        stockMap={stockMap}
      />
    </Shell>
  );
}
