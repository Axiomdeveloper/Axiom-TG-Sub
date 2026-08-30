"use client";

import { useEffect, useRef } from "react";

const MINT = [0, 224, 164] as const;
const VIOL = [124, 92, 255] as const;

/**
 * Full-page ambient layer: particle constellation canvas + aurora blobs
 * + top grid + film grain. Purely decorative, pointer-events: none.
 */
export default function BackgroundFX() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let w = 0;
    let h = 0;
    const DPR = Math.min(window.devicePixelRatio || 1, 1.5);

    interface P {
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
      c: readonly [number, number, number];
    }
    let pts: P[] = [];

    const seed = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * DPR;
      canvas.height = h * DPR;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      const n = Math.round(Math.min(90, (w * h) / 26000));
      pts = Array.from({ length: n }, (_, i) => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        r: Math.random() * 1.6 + 0.6,
        c: i % 3 === 0 ? VIOL : MINT,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const LINK = 130;
      for (const p of pts) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20;
        if (p.y > h + 20) p.y = -20;
      }
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const a = pts[i];
          const b = pts[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d = Math.hypot(dx, dy);
          if (d < LINK) {
            const alpha = (1 - d / LINK) * 0.16;
            ctx.strokeStyle = `rgba(${a.c[0]},${a.c[1]},${a.c[2]},${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      for (const p of pts) {
        ctx.fillStyle = `rgba(${p.c[0]},${p.c[1]},${p.c[2]},0.55)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const loop = () => {
      draw();
      raf = requestAnimationFrame(loop);
    };

    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
      } else if (!reduced) {
        raf = requestAnimationFrame(loop);
      }
    };

    seed();
    if (reduced) {
      draw(); // single static frame
    } else {
      raf = requestAnimationFrame(loop);
    }

    const onResize = () => {
      seed();
      if (reduced) draw();
    };
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* aurora media bed */}
      <div
        className="absolute inset-0 opacity-[0.30] mix-blend-screen"
        style={{
          backgroundImage: "url(/images/aurora.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          maskImage: "radial-gradient(ellipse 100% 80% at 50% 0%, #000 35%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse 100% 80% at 50% 0%, #000 35%, transparent 80%)",
        }}
      />
      {/* constellation canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 opacity-70" />
      {/* drifting color blobs */}
      <div className="halo" style={{ width: 520, height: 520, top: "-14%", right: "-8%" }} />
      <div
        className="halo"
        style={{ width: 420, height: 420, top: "38%", left: "-12%", animationDelay: "-9s", opacity: 0.16 }}
      />
      <div
        className="halo"
        style={{ width: 380, height: 380, bottom: "-10%", right: "24%", animationDelay: "-17s", opacity: 0.12 }}
      />
      {/* grid */}
      <div className="grid-bg absolute inset-x-0 top-0 h-[640px]" />
      {/* vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_100%_at_50%_0%,transparent_40%,rgba(4,5,10,0.9)_100%)]" />
    </div>
  );
}
