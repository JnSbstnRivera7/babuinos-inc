"use client";

import { SmoothScroll } from "@/components/fx/SmoothScroll";
import { FixedWallpaper } from "@/components/fx/FixedWallpaper";
import { PageVines } from "@/components/fx/PageVines";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ScrollExpansionHero } from "@/components/sections/ScrollExpansionHero";
import { GeneroSplit } from "@/components/sections/GeneroSplit";
import { DropCountdown } from "@/components/sections/DropCountdown";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { Toast } from "@/components/ui/Toast";
import { BRAND } from "@/lib/brand";

/**
 * Home = SOLO la entrada: intro de marca → "elige tu territorio" → Drop.
 * Lo demás vive en su propia página: /tienda, /nosotros, /club.
 *
 * Nota: `Destacados` (la vitrina "Lo más buscado") se probó acá el 4-ago y Juan
 * la quitó — quiere el home como puerta, no como catálogo. El componente sigue
 * en el repo listo para volver a enchufarse con una línea si cambia de idea.
 */
export function Experience() {
  return (
    <>
      <FixedWallpaper />
      <PageVines />
      <SmoothScroll />

      <div className="relative z-[2]">
        <Navbar />
        <main>
          {/* El home no tenía NINGÚN h1 (solo h2). Va oculto a la vista porque el
              título visual del hero es el logo, pero Google y los lectores de
              pantalla necesitan el encabezado principal. */}
          <h1 className="sr-only">
            {BRAND.nombre} — streetwear oversize desde {BRAND.ciudad}, {BRAND.sello.toLowerCase()}
          </h1>
          <ScrollExpansionHero />
          <GeneroSplit />
          <DropCountdown />
        </main>
        <Footer />
      </div>

      <CartDrawer />
      <Toast />
    </>
  );
}
