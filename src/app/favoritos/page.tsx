import type { Metadata } from "next";
import { Shell } from "@/components/layout/Shell";
import { FavoritosClient } from "@/components/favoritos/FavoritosClient";
import { getStockMap } from "@/lib/stock";

export const metadata: Metadata = {
  title: "Favoritos — Babuinos Inc",
  description: "Las piezas de la manada que guardaste.",
};

/** Igual que las fichas: prerenderizada, con el tallaje fresco cada 30 s. */
export const revalidate = 30;

export default async function FavoritosPage() {
  const stockMap = await getStockMap();
  return (
    <Shell>
      <FavoritosClient stockMap={stockMap} />
    </Shell>
  );
}
