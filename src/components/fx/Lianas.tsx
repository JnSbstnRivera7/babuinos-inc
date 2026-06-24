"use client";

const GREENS = ["#1f7a4d", "#2b8f57", "#176b41", "#3d7a2f", "#245c3a", "#0e5a51"];

/** A drooping leaf (hangs down-and-out from the vine). */
const LEAF = "M0 0 C9 5 12 20 3 31 C-2 23 -7 11 0 0Z";

/**
 * One draping vine: an organic curved stem with clustered, drooping leaves and
 * a couple of curling tendrils. Deterministic (SSR-safe). Sways from its anchor.
 */
function Vine({
  height,
  mirror,
  delay,
  dur,
  seed,
}: {
  height: number;
  mirror?: boolean;
  delay: number;
  dur: number;
  seed: number;
}) {
  const VB = 480;
  const W = 130;
  // gently meandering stem that drapes downward
  const stem =
    "M65 0 C52 70 86 120 66 190 C50 255 84 305 62 375 C50 420 66 448 60 480";
  // leaf anchor points roughly following the stem
  const anchors = [
    [62, 55], [70, 95], [54, 140], [78, 175], [58, 215], [82, 255],
    [56, 295], [76, 335], [60, 372], [72, 408], [62, 440],
  ];

  return (
    <svg
      viewBox={`0 0 ${W} ${VB}`}
      preserveAspectRatio="xMidYMin meet"
      style={{
        height,
        width: W * (height / VB),
        transformOrigin: "top center",
        transform: mirror ? "scaleX(-1)" : undefined,
        animation: `liana-sway ${dur}s ease-in-out ${delay}s infinite`,
        filter: "drop-shadow(0 6px 8px rgba(0,0,0,.28))",
      }}
      fill="none"
    >
      {/* stem */}
      <path d={stem} stroke="#19583c" strokeWidth="3" strokeLinecap="round" opacity="0.95" />
      <path d={stem} stroke="#2b8f57" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />

      {/* drooping leaves, alternating sides */}
      {anchors.map(([x, y], i) => {
        const side = (i + seed) % 2 === 0 ? 1 : -1;
        const wob = ((i * 31 + seed * 17) % 22) - 11;
        const rot = 150 + side * 35 + wob; // point down & outward
        const sc = 0.85 + ((i + seed) % 3) * 0.22;
        const hue = GREENS[(i + seed) % GREENS.length];
        return (
          <g key={i} transform={`translate(${x} ${y}) rotate(${rot}) scale(${sc})`}>
            <path d={LEAF} fill={hue} opacity="0.94" />
            <path d="M0 0 L2 28" stroke="rgba(0,0,0,.18)" strokeWidth="0.7" />
          </g>
        );
      })}

      {/* hanging tendril at the tip */}
      <path d="M60 480 C70 472 74 486 64 492 C56 496 54 488 60 484" stroke="#2b8f57" strokeWidth="1.6" />
    </svg>
  );
}

/**
 * Vines draping from the top corners down the sides (and a couple from the top
 * center). Soft, leafy, gently swaying. Extra vines hide on small screens.
 */
export function Lianas({ className }: { className?: string }) {
  // left edge
  const left = [
    { x: "-1.5rem", h: 360, delay: 0, dur: 12, seed: 0, hideMobile: false },
    { x: "2.5rem", h: 250, delay: 1.6, dur: 14, seed: 3, hideMobile: true },
    { x: "6.5rem", h: 180, delay: 0.8, dur: 13, seed: 5, hideMobile: true },
  ];
  // right edge (mirrored)
  const right = [
    { x: "-1.5rem", h: 360, delay: 0.5, dur: 12.5, seed: 1, hideMobile: false },
    { x: "2.5rem", h: 240, delay: 2.1, dur: 13.5, seed: 4, hideMobile: true },
    { x: "6.5rem", h: 190, delay: 1.1, dur: 14.5, seed: 2, hideMobile: true },
  ];
  // top center accents
  const top = [
    { left: "34%", h: 150, delay: 1.2, dur: 13, seed: 6 },
    { left: "62%", h: 130, delay: 0.4, dur: 15, seed: 7 },
  ];

  return (
    <div
      className={`pointer-events-none absolute inset-0 z-[1] overflow-hidden ${className ?? ""}`}
      aria-hidden
    >
      {left.map((v, i) => (
        <div
          key={`l${i}`}
          className={`absolute top-0 ${v.hideMobile ? "hidden sm:block" : ""}`}
          style={{ left: v.x, opacity: 0.72 }}
        >
          <Vine height={v.h} delay={v.delay} dur={v.dur} seed={v.seed} />
        </div>
      ))}
      {right.map((v, i) => (
        <div
          key={`r${i}`}
          className={`absolute top-0 ${v.hideMobile ? "hidden sm:block" : ""}`}
          style={{ right: v.x, opacity: 0.72 }}
        >
          <Vine height={v.h} mirror delay={v.delay} dur={v.dur} seed={v.seed} />
        </div>
      ))}
      {top.map((v, i) => (
        <div key={`t${i}`} className="absolute top-0 hidden md:block" style={{ left: v.left, opacity: 0.6 }}>
          <Vine height={v.h} delay={v.delay} dur={v.dur} seed={v.seed} />
        </div>
      ))}
    </div>
  );
}
