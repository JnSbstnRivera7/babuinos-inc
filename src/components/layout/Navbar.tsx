"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "@/components/ui/Logo";
import { SocialButtons } from "@/components/ui/SocialButtons";
import { BaboonMark } from "@/components/ui/BaboonMark";
import { IconBag, IconMenu, IconClose, IconChevronDown, IconHeart } from "@/components/ui/Icons";
import { GeneroMark } from "@/components/ui/GeneroMark";
import { useCart } from "@/lib/store";
import { useWishlist } from "@/lib/wishlist";
import { useTheme, COLORWAYS } from "@/lib/theme";
import { TOP_CATEGORIES, GENEROS, type Genero } from "@/lib/products";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/nosotros", label: "Nosotros" },
  { href: "/club", label: "Club" },
];

const GENERO_COLOR: Record<Genero, string> = {
  hombre: "#00897f",
  mujer: "#cda214",
  unisex: "#e7d8c5",
};

function GeneroGlyph({ genero, color }: { genero: Genero; color: string }) {
  return <GeneroMark genero={genero} color={color} className="h-6 w-8 shrink-0" />;
}

function Swatches({ onPick }: { onPick?: () => void }) {
  const { key, setTheme } = useTheme();
  return (
    <div className="flex items-center gap-2">
      {COLORWAYS.map((c) => (
        <button
          key={c.key}
          onClick={() => {
            setTheme(c.key);
            onPick?.();
          }}
          aria-label={`Tema ${c.name}`}
          title={c.name}
          className={cn(
            "h-6 w-6 rounded-full ring-2 ring-offset-2 ring-offset-ink transition",
            key === c.key ? "ring-cream" : "ring-transparent hover:ring-cream/40",
          )}
          style={{ backgroundColor: c.accent }}
        />
      ))}
    </div>
  );
}

export function Navbar() {
  const count = useCart((s) => s.count());
  const open = useCart((s) => s.open);
  const wishCount = useWishlist((s) => s.ids.length);
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const [shop, setShop] = useState(false);
  const [theme, setThemeOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={cn(
        "sticky top-0 z-[90] border-b transition-colors duration-300",
        scrolled
          ? "border-cream/15 bg-ink/95 sm:bg-ink/90 sm:backdrop-blur-md"
          : "border-transparent bg-ink",
      )}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5 md:px-8">
        <Link href="/" aria-label="Babuinos Inc — inicio" className="flex items-center">
          <Logo tone="cream" priority className="h-9 w-auto md:h-10" />
        </Link>

        {/* desktop nav */}
        <ul className="hidden items-center gap-7 md:flex">
          <li className="relative" onMouseLeave={() => setShop(false)}>
            <Link
              href="/tienda"
              onClick={() => setShop(false)}
              onMouseEnter={() => setShop(true)}
              className="font-mono flex items-center gap-1 text-[0.72rem] font-bold tracking-[0.12em] text-cream/80 uppercase transition hover:text-[var(--accent)]"
            >
              Tienda <IconChevronDown className={cn("h-3.5 w-3.5 transition", shop && "rotate-180")} />
            </Link>
            <AnimatePresence>
              {shop && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="absolute left-0 top-9 w-60 overflow-hidden rounded-xl border border-cream/10 bg-ink-soft p-1.5 shadow-2xl"
                >
                  <p className="font-mono px-3 pb-1 pt-2 text-[0.5rem] tracking-[0.18em] text-cream/40 uppercase">
                    Líneas
                  </p>
                  {GENEROS.map((g) => (
                    <Link
                      key={g.key}
                      href={g.key === "unisex" ? "/tienda" : `/tienda?genero=${g.key}`}
                      onClick={() => setShop(false)}
                      className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[0.82rem] font-semibold text-cream transition hover:bg-cream/10"
                    >
                      <GeneroGlyph genero={g.key} color={GENERO_COLOR[g.key]} />
                      <span className="flex-1">{g.label}</span>
                    </Link>
                  ))}
                  <div className="my-1.5 border-t border-cream/10" />
                  <p className="font-mono px-3 pb-1 pt-1 text-[0.5rem] tracking-[0.18em] text-cream/40 uppercase">
                    Categorías
                  </p>
                  {TOP_CATEGORIES.map((t) => (
                    <Link
                      key={t.key}
                      href={t.href}
                      onClick={() => setShop(false)}
                      className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[0.82rem] font-semibold text-cream transition hover:bg-cream/10"
                    >
                      <BaboonMark color={t.color} className="h-5 w-6 shrink-0" />
                      <span className="flex-1">{t.label}</span>
                      {t.soon && (
                        <span
                          className="font-mono rounded-full px-2 py-0.5 text-[0.5rem] tracking-[0.1em] uppercase"
                          style={{ backgroundColor: t.color + "33", color: t.color }}
                        >
                          Pronto
                        </span>
                      )}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </li>
          {LINKS.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="font-mono text-[0.72rem] font-bold tracking-[0.12em] text-cream/80 uppercase transition hover:text-[var(--accent)]"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <div className="relative hidden sm:block">
            <button
              onClick={() => setThemeOpen((t) => !t)}
              aria-label="Cambiar tema de color"
              className="h-7 w-7 rounded-full ring-2 ring-cream/30 transition hover:ring-cream"
              style={{ backgroundColor: "var(--accent)" }}
            />
            <AnimatePresence>
              {theme && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="absolute right-0 top-10 rounded-xl border border-cream/10 bg-ink-soft p-3 shadow-2xl"
                >
                  <p className="font-mono mb-2 text-[0.55rem] tracking-[0.14em] text-cream/50 uppercase">
                    Colorway
                  </p>
                  <Swatches onPick={() => setThemeOpen(false)} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <SocialButtons variant="icon" className="hidden lg:flex" />

          <Link
            href="/favoritos"
            aria-label="Favoritos"
            className="relative grid h-10 w-10 place-items-center rounded-md text-cream/80 transition hover:text-cream"
          >
            <IconHeart className="h-[20px] w-[20px]" />
            {wishCount > 0 && (
              <span className="font-mono absolute right-0.5 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-[var(--accent)] px-1 text-[0.55rem] font-bold text-[var(--accent-ink)]">
                {wishCount}
              </span>
            )}
          </Link>

          <button
            onClick={open}
            aria-label="Abrir carrito"
            className="relative flex items-center gap-2 rounded-md px-4 py-2.5 text-[var(--accent-ink)] transition hover:brightness-95"
            style={{ backgroundColor: "var(--accent)" }}
          >
            <IconBag className="h-[18px] w-[18px]" />
            <span className="font-mono grid h-5 min-w-5 place-items-center rounded-full bg-ink px-1 text-[0.62rem] font-bold text-cream">
              {count}
            </span>
          </button>

          <button
            onClick={() => setMenu((m) => !m)}
            aria-label={menu ? "Cerrar menú" : "Abrir menú"}
            className="grid h-10 w-10 place-items-center rounded-md text-cream md:hidden"
          >
            {menu ? <IconClose className="h-6 w-6" /> : <IconMenu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* mobile menu */}
      <AnimatePresence>
        {menu && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-cream/10 bg-ink md:hidden"
          >
            <div className="px-6 py-4">
              <p className="font-mono mb-2 text-[0.55rem] tracking-[0.16em] text-[var(--accent)] uppercase">
                Líneas
              </p>
              <ul className="mb-4">
                {GENEROS.map((g) => (
                  <li key={g.key}>
                    <Link
                      href={g.key === "unisex" ? "/tienda" : `/tienda?genero=${g.key}`}
                      onClick={() => setMenu(false)}
                      className="flex items-center gap-3 py-2.5 text-[0.95rem] font-semibold text-cream"
                    >
                      <GeneroGlyph genero={g.key} color={GENERO_COLOR[g.key]} />
                      <span className="flex-1">{g.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <p className="font-mono mb-2 text-[0.55rem] tracking-[0.16em] text-cream/50 uppercase">
                Categorías
              </p>
              <ul className="mb-4">
                {TOP_CATEGORIES.map((t) => (
                  <li key={t.key}>
                    <Link
                      href={t.href}
                      onClick={() => setMenu(false)}
                      className="flex items-center gap-3 py-2.5 text-[0.95rem] font-semibold text-cream"
                    >
                      <BaboonMark color={t.color} className="h-5 w-6 shrink-0" />
                      <span className="flex-1">{t.label}</span>
                      {t.soon && (
                        <span className="font-mono text-[0.5rem] tracking-[0.1em] uppercase" style={{ color: t.color }}>
                          Pronto
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
              <ul className="mb-4 border-t border-cream/10 pt-3">
                {LINKS.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      onClick={() => setMenu(false)}
                      className="block py-2.5 text-[0.95rem] font-medium text-cream/85"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <p className="font-mono mb-2 text-[0.55rem] tracking-[0.16em] text-cream/50 uppercase">
                Colorway
              </p>
              <Swatches onPick={() => setMenu(false)} />
              <div className="mt-4 border-t border-cream/10 pt-4">
                <SocialButtons variant="ghost" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
