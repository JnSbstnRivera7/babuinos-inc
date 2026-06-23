import type { Metadata } from "next";
import { ComingSoon } from "@/components/ComingSoon";

export const metadata: Metadata = { title: "Medias — Babuinos Inc (Muy pronto)" };

export default function MediasPage() {
  return <ComingSoon category="Medias" />;
}
