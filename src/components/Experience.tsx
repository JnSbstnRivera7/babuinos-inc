"use client";

import { SmoothScroll } from "@/components/fx/SmoothScroll";
import { FixedWallpaper } from "@/components/fx/FixedWallpaper";
import { PageVines } from "@/components/fx/PageVines";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ScrollExpansionHero } from "@/components/sections/ScrollExpansionHero";
import { GeneroSplit } from "@/components/sections/GeneroSplit";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { Toast } from "@/components/ui/Toast";

/**
 * Home = SOLO la entrada. Intro de marca + "elige tu territorio" (las dos puertas).
 * Todo lo demás vive en su propia sección/página: /tienda, /nosotros, /club.
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
          <ScrollExpansionHero />
          <GeneroSplit />
        </main>
        <Footer />
      </div>

      <CartDrawer />
      <Toast />
    </>
  );
}
