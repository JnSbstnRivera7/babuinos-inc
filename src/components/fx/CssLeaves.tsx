"use client";

const LEAVES = [
  { left: "6%", size: 26, dur: 11, delay: 0, hue: "#0c5a54" },
  { left: "18%", size: 18, dur: 14, delay: 3, hue: "#4a5c2a" },
  { left: "32%", size: 30, dur: 9, delay: 1.5, hue: "#3d7a2f" },
  { left: "47%", size: 16, dur: 13, delay: 5, hue: "#0c5a54" },
  { left: "60%", size: 24, dur: 10, delay: 2.5, hue: "#4a5c2a" },
  { left: "73%", size: 20, dur: 12.5, delay: 4, hue: "#3d7a2f" },
  { left: "86%", size: 28, dur: 9.5, delay: 0.8, hue: "#0c5a54" },
  { left: "94%", size: 15, dur: 15, delay: 6, hue: "#4a5c2a" },
];

/** CSS-driven falling leaves overlay (pairs with the JS LeafCanvas for depth). */
export function CssLeaves() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[2] overflow-hidden" aria-hidden>
      {LEAVES.map((l, i) => (
        <svg
          key={i}
          viewBox="0 0 40 24"
          className={i % 2 === 1 ? "hidden sm:block" : ""}
          style={{
            position: "absolute",
            top: "-6%",
            left: l.left,
            width: l.size,
            color: l.hue,
            animation: `leaf-fall ${l.dur}s linear ${l.delay}s infinite`,
          }}
        >
          <path d="M2 12 C12 2 30 2 38 12 C30 22 12 22 2 12Z" fill="currentColor" opacity="0.55" />
          <path d="M2 12 H38" stroke="#cda214" strokeWidth="1" opacity="0.4" />
        </svg>
      ))}
    </div>
  );
}
