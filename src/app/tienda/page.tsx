import type { Metadata } from "next";
import { Shell } from "@/components/layout/Shell";
import { TiendaClient } from "@/components/tienda/TiendaClient";
import type { Genero } from "@/lib/products";

export const metadata: Metadata = {
  title: "Tienda — Babuinos Inc",
  description: "Explora la Colección Fundadores 2026. Camisas oversize para toda la manada.",
};

const VALID: (Genero | "all")[] = ["all", "hombre", "mujer", "unisex"];

export default async function TiendaPage({
  searchParams,
}: {
  searchParams: Promise<{ genero?: string }>;
}) {
  const { genero } = await searchParams;
  const initial = (VALID as string[]).includes(genero ?? "") ? (genero as Genero | "all") : "all";

  return (
    <Shell>
      <TiendaClient initialGenero={initial} />
    </Shell>
  );
}
