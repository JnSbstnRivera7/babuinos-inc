"use client";

const GREENS = ["#1f7a4d", "#2b8f57", "#176b41", "#3d7a2f", "#245c3a", "#0e5a51"];
const LEAF = "M0 0 C9 5 12 20 3 31 C-2 23 -7 11 0 0Z";

/** A full-height hanging vine (ceiling → floor), drawn in a tall viewBox. */
function TallVine({
  left,
  delay,
  dur,
  seed,
  mirror,
}: {
  left: string;
  delay: number;
  dur: number;
  seed: number;
  mirror?: boolean;
}) {
  const VB_W = 90;
  const VB_H = 1200;
  // meandering stem from top to bottom
  const stem =
    "M45 0 C32 150 60 300 40 450 C26 600 58 760 38 920 C28 1040 50 1130 42 1200";
  // ~13 leaf nodes following the stem
  const nodes = [
    [42, 70], [56, 150], [34, 240], [60, 330], [36, 430], [58, 530],
    [34, 630], [60, 730], [38, 830], [56, 930], [36, 1020], [54, 1100], [42, 1170],
  ];
  return (
    <svg
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      preserveAspectRatio="xMidYMin meet"
      style={{
        position: "absolute",
        top: 0,
        left,
        height: "100dvh",
        width: "auto",
        transformOrigin: "top center",
        transform: mirror ? "scaleX(-1)" : undefined,
        animation: `vine-tall ${dur}s ease-in-out ${delay}s infinite`,
        filter: "drop-shadow(0 4px 6px rgba(0,0,0,.25))",
      }}
      fill="none"
    >
      <path d={stem} stroke="#19583c" strokeWidth="3" strokeLinecap="round" opacity="0.95" />
      <path d={stem} stroke="#2b8f57" strokeWidth="1.1" strokeLinecap="round" opacity="0.5" />
      {nodes.map(([x, y], i) => {
        const side = (i + seed) % 2 === 0 ? 1 : -1;
        const wob = ((i * 29 + seed * 13) % 20) - 10;
        const rot = 150 + side * 35 + wob;
        const sc = 0.9 + ((i + seed) % 3) * 0.25;
        const hue = GREENS[(i + seed) % GREENS.length];
        return (
          <g key={i} transform={`translate(${x} ${y}) rotate(${rot}) scale(${sc})`}>
            <path d={LEAF} fill={hue} opacity="0.92" />
            <path d="M0 0 L2 28" stroke="rgba(0,0,0,.18)" strokeWidth="0.7" />
          </g>
        );
      })}
      <path d="M42 1200 C52 1192 56 1206 46 1212 C38 1216 36 1208 42 1204" stroke="#2b8f57" strokeWidth="1.6" />
    </svg>
  );
}

/**
 * Full-page hanging vines: fixed layer behind the UI, vines drape from the
 * ceiling to the floor across the page (mostly along the edges so they frame
 * the content without covering it). Stays in view while scrolling.
 */
export function PageVines() {
  const vines = [
    { left: "1%", delay: 0, dur: 13, seed: 0, hideMobile: false },
    { left: "8%", delay: 1.4, dur: 15, seed: 3, hideMobile: true },
    { left: "16%", delay: 2.3, dur: 14, seed: 5, hideMobile: true, mirror: true },
    { left: "84%", delay: 0.8, dur: 14.5, seed: 1, hideMobile: true },
    { left: "92%", delay: 1.9, dur: 13.5, seed: 4, mirror: true, hideMobile: false },
    { left: "98%", delay: 0.4, dur: 15.5, seed: 2, hideMobile: true },
    { left: "38%", delay: 2.6, dur: 16, seed: 6, hideMobile: true },
    { left: "62%", delay: 1.1, dur: 16.5, seed: 7, mirror: true, hideMobile: true },
  ];
  return (
    <div className="pointer-events-none fixed inset-0 z-[3] overflow-hidden opacity-45" aria-hidden>
      {vines.map((v, i) => (
        <div key={i} className={v.hideMobile ? "hidden sm:block" : ""}>
          <TallVine left={v.left} delay={v.delay} dur={v.dur} seed={v.seed} mirror={v.mirror} />
        </div>
      ))}
    </div>
  );
}
