export function AnnounceBar() {
  const text = "🌿 Selva de cemento, actitud de explorador · Colección Fundadores 2026 — Stock limitado · 🦍";
  return (
    <div className="shimmer-sweep bg-teal text-cream">
      <div className="overflow-hidden whitespace-nowrap py-1.5">
        <div className="font-mono inline-block animate-[marquee_22s_linear_infinite] text-[0.7rem] font-bold tracking-[0.14em] uppercase">
          <span className="px-8">{text}</span>
          <span className="px-8">{text}</span>
        </div>
      </div>
    </div>
  );
}
