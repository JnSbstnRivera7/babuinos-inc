import type { Metadata } from "next";
import { Shell } from "@/components/layout/Shell";
import { Newsletter } from "@/components/sections/Newsletter";

export const metadata: Metadata = {
  title: "Club — Babuinos Inc",
  description: "Únete al Cult: drops exclusivos, preventas fundadoras y acceso anticipado.",
};

export default function ClubPage() {
  return (
    <Shell>
      {/* grid-cols-1 (= minmax(0,1fr)) es lo que impide el desborde: la columna
          implícita "auto" se dimensionaba al max-content de Newsletter (672px
          del max-w-2xl + padding) y la página se iba 325px en celular. El
          centrado horizontal lo hace el mx-auto de la sección. */}
      <div className="grid min-h-[70svh] grid-cols-1 items-center">
        <Newsletter />
      </div>
    </Shell>
  );
}
