import type { ReactNode } from "react";
import { FixedWallpaper } from "@/components/fx/FixedWallpaper";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { Toast } from "@/components/ui/Toast";

/** Marco compartido para páginas internas (tienda, producto): fondo + nav + footer + carrito. */
export function Shell({ children }: { children: ReactNode }) {
  return (
    <>
      <FixedWallpaper />
      <div className="relative z-[2] flex min-h-[100svh] flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
      <CartDrawer />
      <Toast />
    </>
  );
}
