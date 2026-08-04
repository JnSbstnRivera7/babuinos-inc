import type { Metadata } from "next";
import { Shell } from "@/components/layout/Shell";
import { Story } from "@/components/sections/Story";

export const metadata: Metadata = {
  title: "Nosotros — Babuinos Inc",
  description:
    "Street Adventure Heritage. La manada de cemento, nacida en Tábogo en 2026 y diseñada a 2.600 m.",
};

export default function NosotrosPage() {
  return (
    <Shell>
      <Story />
    </Shell>
  );
}
