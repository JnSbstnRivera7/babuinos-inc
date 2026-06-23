"use client";

import { SmoothScroll } from "@/components/fx/SmoothScroll";
import { FixedWallpaper } from "@/components/fx/FixedWallpaper";
import { AnnounceBar } from "@/components/layout/AnnounceBar";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ScrollExpansionHero } from "@/components/sections/ScrollExpansionHero";
import { FeaturesStrip } from "@/components/sections/FeaturesStrip";
import { BaboonStrip } from "@/components/fx/BaboonStrip";
import { Lookbook } from "@/components/sections/Lookbook";
import { Catalog } from "@/components/sections/Catalog";
import { Story } from "@/components/sections/Story";
import { Newsletter } from "@/components/sections/Newsletter";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { Toast } from "@/components/ui/Toast";

export function Experience() {
  return (
    <>
      <FixedWallpaper />
      <SmoothScroll />

      <div className="relative z-[2]">
        <AnnounceBar />
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
      <Toast />
    </>
  );
}
