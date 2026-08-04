"use client";

import { SmoothScroll } from "@/components/fx/SmoothScroll";
import { FixedWallpaper } from "@/components/fx/FixedWallpaper";
import { PageVines } from "@/components/fx/PageVines";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ScrollExpansionHero } from "@/components/sections/ScrollExpansionHero";
import { GeneroSplit } from "@/components/sections/GeneroSplit";
import { Destacados } from "@/components/sections/Destacados";
import { DropCountdown } from "@/components/sections/DropCountdown";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { Toast } from "@/components/ui/Toast";
import { BRAND } from "@/lib/brand";

/**
 * Home = la entrada. Intro de marca → "elige tu territorio" → vitrina de piezas
 * → Drop. Lo demás vive en su propia página: /tienda, /nosotros, /club.
 *
 * `Destacados` es clave: sin él el home no mostraba NI UN producto (cero enlaces
 * a /producto/) y el visitante tenía que adivinar antes de ver mercancía.
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
          <Destacados />
          <DropCountdown />
        </main>
        <Footer />
      </div>

      <CartDrawer />
      <Toast />
    </>
  );
}
