"use client";

const GREENS = ["#1f7a4d", "#2b8f57", "#16613c", "#3d7a2f", "#245c3a", "#0e5a51"];

/** A lanceolate leaf with a midrib, pointing along the vine. */
function leafPath() {
  return "M0 0 C5 -8 5 -19 0 -27 C-5 -19 -5 -8 0 0Z";
}

/**
 * One organic hanging vine: a tapering wavy stem with clustered leaves on
 * alternating sides. Deterministic (no random → SSR-safe). Sways gently.
 */
function Vine({
  height,
  delay,
  dur,
  seed,
}: {
  height: number;
  delay: number;
  dur: number;
  seed: number;
}) {
  const vb = 400;
  const nodes = 9;
  const leaves: { y: number; side: number; rot: number; scale: number; hue: string }[] = [];
  for (let i = 1; i <= nodes; i++) {
    const y = (i / (nodes + 0.5)) * vb;
    const side = (i + seed) % 2 === 0 ? 1 : -1;
    const wobble = ((i * 37 + seed * 13) % 16) - 8;
    leaves.push({
      y,
      side,
      rot: side * (40 + wobble) + 90, // leaves fan outward + downward
      scale: 0.7 + ((i + seed) % 3) * 0.18,
      hue: GREENS[(i + seed) % GREENS.length],
    });
    // a second smaller leaf per node for density
    if (i % 2 === 0) {
      leaves.push({
        y: y - 6,
        side: -side,
        rot: -side * (28 + wobble) + 90,
        scale: 0.5 + ((i + seed) % 2) * 0.12,
        hue: GREENS[(i + seed + 2) % GREENS.length],
      });
    }
  }

  return (
    <svg
      viewBox={`0 0 60 ${vb}`}
      preserveAspectRatio="xMidYMin meet"
      style={{
        height,
        width: 60,
        transformOrigin: "top center",
        animation: `liana-sway ${dur}s ease-in-out ${delay}s infinite`,
        filter: "drop-shadow(0 4px 6px rgba(0,0,0,.25))",
      }}
      fill="none"
    >
      {/* stem */}
      <path
        d={`M30 0 C22 ${vb * 0.2} 40 ${vb * 0.4} 26 ${vb * 0.6} C16 ${vb * 0.78} 34 ${vb * 0.9} 28 ${vb}`}
        stroke="#1b5e3f"
        strokeWidth="2.4"
        strokeLinecap="round"
        opacity="0.9"
      />
      {/* leaves */}
      {leaves.map((l, i) => {
        const x = 30 + l.side * 4;
        return (
          <g key={i} transform={`translate(${x} ${l.y}) rotate(${l.rot}) scale(${l.scale})`}>
            <path d={leafPath()} fill={l.hue} opacity="0.92" />
            <path d="M0 0 L0 -25" stroke="rgba(0,0,0,0.18)" strokeWidth="0.8" />
          </g>
        );
      })}
    </svg>
  );
}

/** Decorative hanging vines across the top edge — soft, leafy, gently swaying. */
export function Lianas({ className }: { className?: string }) {
  const vines = [
    { left: "3%", height: 240, delay: 0, dur: 11, seed: 0 },
    { left: "15%", height: 160, delay: 1.5, dur: 13, seed: 1 },
    { left: "29%", height: 300, delay: 0.6, dur: 12, seed: 2 },
    { left: "43%", height: 200, delay: 2.2, dur: 14, seed: 3 },
    { left: "57%", height: 270, delay: 0.9, dur: 11.5, seed: 4 },
    { left: "71%", height: 180, delay: 1.8, dur: 13.5, seed: 5 },
    { left: "85%", height: 320, delay: 0.3, dur: 12.5, seed: 6 },
    { left: "95%", height: 150, delay: 2.6, dur: 14.5, seed: 7 },
  ];
  return (
    <div
      className={`pointer-events-none absolute inset-x-0 top-0 z-[1] overflow-hidden ${className ?? ""}`}
      aria-hidden
    >
      {vines.map((v, i) => (
        <div key={i} className="absolute top-0" style={{ left: v.left, opacity: 0.7 }}>
          <Vine height={v.height} delay={v.delay} dur={v.dur} seed={v.seed} />
        </div>
      ))}
    </div>
  );
}
