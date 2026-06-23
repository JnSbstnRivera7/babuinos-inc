import type { Metadata } from "next";
import { ComingSoon } from "@/components/ComingSoon";

export const metadata: Metadata = { title: "Sacos — Babuinos Inc (Muy pronto)" };

export default function SacosPage() {
  return <ComingSoon category="Sacos" />;
}
