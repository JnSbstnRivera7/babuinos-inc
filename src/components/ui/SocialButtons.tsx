"use client";

import { IconInstagram, IconWhatsApp, IconFacebook } from "./Icons";
import { cn } from "@/lib/utils";

// Placeholder links (swap handles when real accounts are ready).
const WA_MSG = encodeURIComponent("¡Hola Babuinos! Quiero conocer más de la colección 🦍");
const ITEMS = [
  { label: "Instagram", Icon: IconInstagram, key: "ig", href: "https://instagram.com/babuinos.inc" },
  { label: "WhatsApp", Icon: IconWhatsApp, key: "wa", href: `https://wa.me/573504444668?text=${WA_MSG}` },
  { label: "Facebook", Icon: IconFacebook, key: "fb", href: "https://facebook.com/babuinos.inc" },
];

export function SocialButtons({
  variant = "solid",
  className,
}: {
  variant?: "solid" | "ghost" | "icon";
  className?: string;
}) {
  if (variant === "icon") {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        {ITEMS.map(({ label, Icon, key, href }) => (
          <a
            key={key}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            title={label}
            className="grid h-11 w-11 place-items-center rounded-full border border-cream/15 text-cream/80 transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            <Icon className="h-[18px] w-[18px]" />
          </a>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      {ITEMS.map(({ label, Icon, key, href }) => (
        <a
          key={key}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className={cn(
            "font-mono inline-flex items-center gap-2 rounded-full px-5 py-3 text-[0.72rem] font-bold tracking-[0.1em] uppercase transition",
            variant === "solid"
              ? "bg-cream/10 text-cream hover:bg-[var(--accent)] hover:text-[var(--accent-ink)]"
              : "border border-cream/25 text-cream hover:border-[var(--accent)] hover:text-[var(--accent)]",
          )}
        >
          <Icon className="h-[18px] w-[18px]" />
          {label}
        </a>
      ))}
    </div>
  );
}
