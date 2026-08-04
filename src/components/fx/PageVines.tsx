"use client";

import { useEffect, useState } from "react";

const DARK = ["#1f7a4d", "#2b8f57", "#176b41", "#3d7a2f", "#245c3a", "#0e5a51"];
const LIGHT = ["#5bb87e", "#74c98f", "#49a86c", "#84cf73", "#62c79a", "#9bd9a0"];
const LEAF = "M0 0 C9 5 12 20 3 31 C-2 23 -7 11 0 0Z";

interface VineDef {
  left: string;
  h: number; // height in dvh (uneven lengths)
  delay: number;
  dur: number;
  seed: number;
  mirror?: boolean;
  light?: boolean;
}

function TallVine({ left, h, delay, dur, seed, mirror, light }: VineDef) {
  const VB_W = 90;
  const VB_H = 1200;
  const palette = light ? LIGHT : DARK;
  const stemA = light ? "#3a9e63" : "#19583c";
  const stemB = light ? "#7bcf96" : "#2b8f57";
  const stem =
    "M45 0 C32 150 60 300 40 450 C26 600 58 760 38 920 C28 1040 50 1130 42 1200";
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
        height: `${h}dvh`,
        width: "auto",
        transformOrigin: "top center",
        transform: mirror ? "scaleX(-1)" : undefined,
        animation: `vine-tall ${dur}s ease-in-out ${delay}s infinite`,
        filter: "drop-shadow(0 4px 6px rgba(0,0,0,.22))",
      }}
      fill="none"
    >
      <path d={stem} stroke={stemA} strokeWidth="3" strokeLinecap="round" opacity="0.95" />
      <path d={stem} stroke={stemB} strokeWidth="1.1" strokeLinecap="round" opacity="0.5" />
      {nodes.map(([x, y], i) => {
        const side = (i + seed) % 2 === 0 ? 1 : -1;
        const wob = ((i * 29 + seed * 13) % 20) - 10;
        const rot = 150 + side * 35 + wob;
        const sc = 0.9 + ((i + seed) % 3) * 0.25;
        const hue = palette[(i + seed) % palette.length];
        return (
          <g key={i} transform={`translate(${x} ${y}) rotate(${rot}) scale(${sc})`}>
            <path d={LEAF} fill={hue} opacity="0.92" />
            <path d="M0 0 L2 28" stroke="rgba(0,0,0,.16)" strokeWidth="0.7" />
          </g>
        );
      })}
      <path d="M42 1200 C52 1192 56 1206 46 1212 C38 1216 36 1208 42 1204" stroke={stemB} strokeWidth="1.6" />
    </svg>
  );
}

/**
 * Full-page hanging vines along the SIDES only (ceiling → floor), fixed behind
 * the UI. Mixes long dark vines with shorter, lighter-green ones for an uneven,
 * real-jungle feel.
 *
 * En CELULAR no se renderiza NINGUNA: son 8 SVG de ~87 hojas cada uno con
 * animación infinita. Ocultarlas por CSS mataba la animación pero el markup
 * seguía viajando (≈40 KB de HTML), así que se montan solo en pantalla ancha.
 */
export function PageVines() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 640px) and (prefers-reduced-motion: no-preference)");
    const update = () => setShow(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  if (!show) return null;

  const vines: VineDef[] = [
    // left side
    { left: "0.5%", h: 100, delay: 0, dur: 13, seed: 0 },
    { left: "5%", h: 60, delay: 1.6, dur: 15, seed: 3, light: true },
    { left: "11%", h: 80, delay: 2.4, dur: 14, seed: 5, light: true, mirror: true },
    { left: "16%", h: 46, delay: 0.9, dur: 16, seed: 8, light: true },
    // right side
    { left: "83%", h: 100, delay: 0.7, dur: 13.5, seed: 1, mirror: true },
    { left: "89%", h: 56, delay: 2.0, dur: 15.5, seed: 4, light: true },
    { left: "94%", h: 78, delay: 1.1, dur: 14.5, seed: 2, light: true, mirror: true },
    { left: "99%", h: 50, delay: 2.7, dur: 16.5, seed: 6, light: true, mirror: true },
  ];
  return (
    <div
      className="pointer-events-none fixed inset-0 z-[3] overflow-hidden opacity-45"
      aria-hidden
    >
      {vines.map((v, i) => (
        <TallVine key={i} {...v} />
      ))}
    </div>
  );
}
