import type { Metadata } from "next";
import { Shell } from "@/components/layout/Shell";
import { FavoritosClient } from "@/components/favoritos/FavoritosClient";

export const metadata: Metadata = {
  title: "Favoritos — Babuinos Inc",
  description: "Las piezas de la manada que guardaste.",
};

export default function FavoritosPage() {
  return (
    <Shell>
      <FavoritosClient />
    </Shell>
  );
}
