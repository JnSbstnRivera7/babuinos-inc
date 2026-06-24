"use client";

import { SmoothScroll } from "@/components/fx/SmoothScroll";
import { FixedWallpaper } from "@/components/fx/FixedWallpaper";
import { PageVines } from "@/components/fx/PageVines";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ScrollExpansionHero } from "@/components/sections/ScrollExpansionHero";
import { FeaturesStrip } from "@/components/sections/FeaturesStrip";
import dynamic from "next/dynamic";
import { BaboonStrip } from "@/components/fx/BaboonStrip";
import { Story } from "@/components/sections/Story";
import { Newsletter } from "@/components/sections/Newsletter";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { MusicPlayer } from "@/components/fx/MusicPlayer";
import { Toast } from "@/components/ui/Toast";

// Lazy-loaded below-the-fold sections (split their JS off the initial bundle).
const Lookbook = dynamic(() => import("@/components/sections/Lookbook").then((m) => m.Lookbook), {
  ssr: false,
});
const Catalog = dynamic(() => import("@/components/sections/Catalog").then((m) => m.Catalog));

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
          <FeaturesStrip />
          <Lookbook />
          <BaboonStrip />
          <Catalog />
          <Story />
          <Newsletter />
        </main>
        <Footer />
      </div>

      <CartDrawer />
      <MusicPlayer />
      <Toast />
    </>
  );
}
