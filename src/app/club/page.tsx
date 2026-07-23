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
      <div className="grid min-h-[70svh] place-items-center">
        <Newsletter />
      </div>
    </Shell>
  );
}
