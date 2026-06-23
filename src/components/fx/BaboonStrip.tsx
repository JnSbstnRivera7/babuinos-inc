import { BaboonMark } from "@/components/ui/BaboonMark";

const COLORS = [
  "#00736c", // teal
  "#cda214", // gold
  "#4a5c2a", // olive
  "#1b2f5c", // navy
  "#6b1c2f", // burgundy
  "#f3e9e2", // cream
  "#1a9990", // teal light
  "#654321", // umber
];

/** Marquee band of the brand baboon repeated in palette colors. */
export function BaboonStrip({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const items = [...COLORS, ...COLORS, ...COLORS];
  return (
    <div
      className={`relative overflow-hidden border-y py-6 backdrop-blur-sm ${
        tone === "dark" ? "border-cream/10 bg-ink/40" : "border-ink/10 bg-cream-2"
      }`}
    >
      <div
        className="flex w-max items-center gap-10"
        style={{ animation: "marquee 30s linear infinite" }}
      >
        {items.map((c, i) => (
          <BaboonMark key={i} color={c} className="h-9 w-11 shrink-0 opacity-90" />
        ))}
      </div>
    </div>
  );
}
