"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  speed: number;
  drift: number;
  rot: number;
  vr: number;
  hue: number;
  kind: "leaf" | "fly";
  phase: number;
}

const PALETTE = ["#00736c", "#4a5c2a", "#cda214", "#1a9990"];

/**
 * Lightweight floating jungle particles (leaves drifting down + fireflies).
 * Mobile-friendly: capped DPR, density scales with viewport, pauses when hidden,
 * disabled under reduced-motion.
 */
export function LeafCanvas({ density = 1 }: { density?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Skip the canvas particle loop on phones for smoother performance.
    if (window.innerWidth < 700) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let parts: Particle[] = [];
    let raf = 0;
    let running = true;

    const rand = (a: number, b: number) => a + Math.random() * (b - a);

    function spawn(): Particle {
      const fly = false; // no glowing fireflies — drifting leaves only
      return {
        x: rand(0, w),
        y: rand(0, h),
        size: fly ? rand(1.4, 2.8) : rand(7, 16),
        speed: fly ? rand(0.1, 0.4) : rand(0.4, 1.1),
        drift: rand(-0.5, 0.5),
        rot: rand(0, Math.PI * 2),
        vr: rand(-0.02, 0.02),
        hue: Math.floor(rand(0, PALETTE.length)),
        kind: fly ? "fly" : "leaf",
        phase: rand(0, Math.PI * 2),
      };
    }

    function resize() {
      w = canvas!.clientWidth;
      h = canvas!.clientHeight;
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      const base = Math.round((w * h) / 90000); // ~ area based
      const count = Math.max(10, Math.min(70, Math.round(base * density)));
      parts = Array.from({ length: count }, spawn);
    }

    function drawLeaf(p: Particle) {
      ctx!.save();
      ctx!.translate(p.x, p.y);
      ctx!.rotate(p.rot);
      ctx!.globalAlpha = 0.5;
      ctx!.fillStyle = PALETTE[p.hue];
      ctx!.beginPath();
      ctx!.ellipse(0, 0, p.size, p.size * 0.42, 0, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.strokeStyle = "rgba(205,162,20,.4)";
      ctx!.lineWidth = 0.6;
      ctx!.beginPath();
      ctx!.moveTo(-p.size, 0);
      ctx!.lineTo(p.size, 0);
      ctx!.stroke();
      ctx!.restore();
    }

    function drawFly(p: Particle, t: number) {
      const glow = 0.35 + 0.45 * Math.sin(t * 0.004 + p.phase);
      ctx!.save();
      ctx!.globalAlpha = Math.max(0, glow);
      ctx!.fillStyle = "#cda214";
      ctx!.shadowColor = "#cda214";
      ctx!.shadowBlur = 8;
      ctx!.beginPath();
      ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.restore();
    }

    function frame(t: number) {
      if (!running) return;
      ctx!.clearRect(0, 0, w, h);
      for (const p of parts) {
        if (p.kind === "leaf") {
          p.y += p.speed;
          p.x += p.drift + Math.sin((p.y + p.phase * 50) * 0.01) * 0.6;
          p.rot += p.vr;
          if (p.y - p.size > h) {
            p.y = -p.size;
            p.x = rand(0, w);
          }
          drawLeaf(p);
        } else {
          p.x += Math.sin(t * 0.001 + p.phase) * 0.4 + p.drift * 0.2;
          p.y += Math.cos(t * 0.0013 + p.phase) * 0.3 - p.speed * 0.2;
          if (p.y < -10) p.y = h + 10;
          if (p.x < -10) p.x = w + 10;
          if (p.x > w + 10) p.x = -10;
          drawFly(p, t);
        }
      }
      raf = requestAnimationFrame(frame);
    }

    resize();
    raf = requestAnimationFrame(frame);
    window.addEventListener("resize", resize);
    const onVis = () => {
      running = !document.hidden;
      if (running) raf = requestAnimationFrame(frame);
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [density]);

  return (
    <canvas
      ref={ref}
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  );
}
