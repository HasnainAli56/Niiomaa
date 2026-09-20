"use client";

import React, { useEffect, useRef } from "react";

// Argus backdrop engine extracted directly from preview_6.html
// "Hero backdrop - Subtle Dust Particles" animation
function createArgusBackdropEngine() {
  var SETTLED = 4.4;
  var TOTAL = 6.4;
  var TAU = Math.PI * 2;
  var clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  var lerp = (a: number, b: number, t: number) => a + (b - a) * t;
  var smooth = (a: number, b: number, x: number) => {
    const t = clamp((x - a) / (b - a));
    return t * t * (3 - 2 * t);
  };
  var rad = (d: number) => (d * Math.PI) / 180;

  function mulberry32(a: number) {
    return () => {
      a |= 0;
      a = (a + 1831565813) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function createArgusBackdrop(canvas: HTMLCanvasElement, opts: any = {}) {
    const {
      loop = true,
      onSettled,
      speed = 0.65,
      maxPixels = 23e5,
      radiusH = 0.595,
      radiusWMax = 0.42,
      bottomH = 0.59,
      orbitPeriod = 11,
      orbitScale = 1.45,
      segmentDeg = 100,
      thickness = 0.6,
      seed = 11,
    } = opts;

    const ctx = canvas.getContext("2d")!;
    const reduced =
      typeof matchMedia === "function" &&
      matchMedia("(prefers-reduced-motion: reduce)").matches;
    let W = 0,
      H = 0,
      dpr = 1;
    let raf = 0,
      playing = false,
      t0 = 0,
      tPause = 0,
      cur = 0,
      fired = false;
    const rnd = mulberry32(seed);

    const dust = Array.from({ length: 45 }, () => ({
      x: rnd(),
      y: rnd(),
      r: 0.6 + rnd() * rnd() * 1.8,
      a: 0.12 + rnd() * 0.2,
      vy: -(2e-3 + rnd() * 0.006),
      tw: 0.4 + rnd() * 1.6,
      ph: rnd() * TAU,
    }));

    const layer = document.createElement("canvas");
    const lctx = layer.getContext("2d")!;
    let layerKey = "";

    const sprite = document.createElement("canvas");
    sprite.width = sprite.height = 64;
    {
      const g = sprite.getContext("2d")!;
      const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
      gr.addColorStop(0, "rgba(255,240,255,1)");
      gr.addColorStop(0.3, "rgba(190,150,255,0.5)");
      gr.addColorStop(1, "rgba(160,190,255,0)");
      g.fillStyle = gr;
      g.fillRect(0, 0, 64, 64);
    }

    function resize() {
      const r = canvas.getBoundingClientRect();
      W = Math.max(1, r.width);
      H = Math.max(1, r.height);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      dpr = Math.min(dpr, Math.sqrt(maxPixels / (W * H)));
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      layer.width = canvas.width;
      layer.height = canvas.height;
      layerKey = "";
    }

    function bigCircle(t: number) {
      const Rf = Math.min(radiusH * H, radiusWMax * W);
      const R = Rf * (1 + 0.64 * Math.exp(-t / 0.8));
      const bottom = bottomH * H + 0.012 * H * Math.exp(-t / 1.2);
      return { cx: W / 2, cy: bottom - R, R, Rf };
    }

    function domeCircle(t: number) {
      const { Rf } = bigCircle(t);
      return {
        cx: W / 2 - 0.02 * Rf,
        cy: bottomH * H + 0.12 * Rf,
        r: 0.48 * Rf,
      };
    }

    function glowCircle(t: number) {
      const d = domeCircle(t);
      return { cx: d.cx, cy: d.cy, r: d.r * orbitScale };
    }

    function crescentRadius(t: number) {
      return 0.6 * bigCircle(t).Rf;
    }

    const CRESCENT_W = [
      0.5, 1.2, 2.2, 3.8, 5.5, 8, 12, 17, 21, 23, 22, 20, 17, 13, 9, 6, 4,
      2.5, 1.5, 0.8, 0.4,
    ];

    function crescentWidth(x: number) {
      const n = CRESCENT_W.length - 1;
      const u = clamp(x) * n;
      const i = Math.min(n - 1, Math.floor(u));
      const w = thickness * lerp(CRESCENT_W[i], CRESCENT_W[i + 1], u - i);
      return w * Math.min(smooth(0, 0.035, x), smooth(0, 0.035, 1 - x));
    }

    function dustField(t: number) {
      const c = ctx;
      for (const p of dust) {
        let y = (p.y + p.vy * t) % 1;
        if (y < 0) y += 1;
        const tw = 0.6 + 0.4 * Math.sin(t * p.tw + p.ph);
        c.globalAlpha = clamp(p.a * tw);
        const r = p.r * Math.max(1, Math.min(W, H) / 540);
        c.drawImage(sprite, p.x * W - r * 2, y * H - r * 2, r * 4, r * 4);
      }
      c.globalAlpha = 1;
    }

    function render(t: number) {
      cur = t;
      const c = ctx;
      c.setTransform(1, 0, 0, 1, 0, 0);
      c.globalCompositeOperation = "source-over";
      c.globalAlpha = 1;
      c.clearRect(0, 0, canvas.width, canvas.height);
      c.setTransform(dpr, 0, 0, dpr, 0, 0);

      const bg = c.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, "#02020c");
      bg.addColorStop(0.62, "#010109");
      bg.addColorStop(1, "#000005");
      c.fillStyle = bg;
      c.fillRect(0, 0, W, H);

      c.globalCompositeOperation = "lighter";
      dustField(t);

      const { cx, cy, R, Rf } = bigCircle(t);
      const k = Rf / 321;
      const grow = smooth(0.25, 2.4, t);
      const half = rad(lerp(7, 180, smooth(0.05, 0.78, t)));
      const a0 = Math.PI / 2 - half,
        a1 = Math.PI / 2 + half;

      {
        const near = smooth(0.06, 0.4, t);
        const key = `${R.toFixed(1)}|${grow.toFixed(3)}|${near.toFixed(3)}|${half.toFixed(3)}|${cy.toFixed(1)}`;
        if (key !== layerKey) {
          layerKey = key;
          const l = lctx;
          l.setTransform(1, 0, 0, 1, 0, 0);
          l.clearRect(0, 0, layer.width, layer.height);
          l.setTransform(dpr, 0, 0, dpr, 0, 0);
          const reach = 2.1 * R;
          const sigOut = 150 * k,
            sigIn = 122 * k,
            sigCore = 26 * k;
          const g = l.createRadialGradient(cx, cy, 0, cx, cy, reach);
          const STOPS = 60;
          for (let i = 0; i <= STOPS; i++) {
            const r = (i / STOPS) * reach;
            const d = Math.abs(r - R);
            const field =
              Math.exp(-Math.pow(d / (r > R ? sigOut : sigIn), 1.35)) * grow;
            const core =
              Math.exp(-Math.pow(d / sigCore, 1.2)) * near * 1.15;
            const v = clamp(field + core, 0, 1.6);
            const m = clamp(core / Math.max(1e-4, v));
            const R8 = Math.round(lerp(100, 180, m));
            const G8 = Math.round(lerp(40, 90, m));
            const B8 = Math.round(lerp(240, 255, m));
            g.addColorStop(
              i / STOPS,
              `rgba(${R8},${G8},${B8},${Math.min(1, v).toFixed(3)})`
            );
          }
          l.fillStyle = g;
          l.fillRect(0, 0, W, H);
          l.globalCompositeOperation = "destination-in";
          const bottom = cy + R;
          const vg = l.createLinearGradient(0, 0, 0, bottom + 0.14 * H);
          vg.addColorStop(0, "rgba(0,0,0,1)");
          vg.addColorStop(0.42, "rgba(0,0,0,0.72)");
          vg.addColorStop(0.72, "rgba(0,0,0,0.44)");
          vg.addColorStop(
            bottom / (bottom + 0.14 * H),
            "rgba(0,0,0,0.30)"
          );
          vg.addColorStop(1, "rgba(0,0,0,0)");
          l.fillStyle = vg;
          l.fillRect(0, 0, W, H);
          if (half < Math.PI - 0.01) {
            l.beginPath();
            l.moveTo(cx, cy);
            l.arc(cx, cy, reach, a0 - 0.12, a1 + 0.12);
            l.closePath();
            l.fillStyle = "#000";
            l.fill();
          }
          l.globalCompositeOperation = "source-over";
          l.setTransform(1, 0, 0, 1, 0, 0);
        }
        c.save();
        c.setTransform(1, 0, 0, 1, 0, 0);
        c.drawImage(layer, 0, 0);
        c.restore();
      }

      const coreA = smooth(0.02, 0.18, t);
      c.lineCap = "round";
      for (const [w, a, rgb] of [
        [18, 0.65, "210,150,255"],
        [10, 0.85, "235,210,255"],
        [5.0, 1.0, "255,255,255"],
      ] as [number, number, string][]) {
        c.lineWidth = w * k;
        c.strokeStyle = arcGradient(cy, R, rgb, a * coreA);
        c.beginPath();
        c.arc(cx, cy, R, a0, a1);
        c.stroke();
      }
      c.lineWidth = 3.0 * k;
      c.strokeStyle = coreGradient(cy, R, coreA);
      c.beginPath();
      c.arc(cx, cy, R, a0, a1);
      c.stroke();
      c.save();
      c.beginPath();
      c.arc(cx, cy, R, 0, TAU);
      c.clip();
      drawDome(t, k);
      drawComet(t, k);
      c.restore();
      c.globalCompositeOperation = "source-over";
    }

    function arcGradient(cy: number, R: number, rgb: string, a: number) {
      const g = ctx.createLinearGradient(0, cy - R, 0, cy + R);
      g.addColorStop(0,    `rgba(255,180,255,${a * 4.0})`);
      g.addColorStop(0.12, `rgba(255,200,255,${a * 3.0})`);
      g.addColorStop(0.35, `rgba(${rgb},${a * 1.8})`);
      g.addColorStop(0.65, `rgba(${rgb},${a * 0.5})`);
      g.addColorStop(1,    `rgba(160,130,255,${a * 0.05})`);
      return g;
    }

    function coreGradient(cy: number, R: number, a: number) {
      const g = ctx.createLinearGradient(0, cy - R, 0, cy + R);
      g.addColorStop(0,    `rgba(255,245,255,${a * 3.5})`);
      g.addColorStop(0.1,  `rgba(255,230,255,${a * 2.8})`);
      g.addColorStop(0.3,  `rgba(240,210,255,${a * 1.4})`);
      g.addColorStop(1,    `rgba(255,255,255,${a * 0.25})`);
      return g;
    }

    const ENTER_AT = 0.5;

    function orbitAngle(t: number) {
      if (!orbitPeriod) return 0;
      return (TAU * (t - ENTER_AT)) / orbitPeriod;
    }

    function entryAngle(t: number) {
      const { cx, cy, R } = bigCircle(t);
      const g = glowCircle(t);
      const dx = g.cx - cx,
        dy = g.cy - cy;
      const D = Math.hypot(dx, dy);
      if (D < 1e-6) return -Math.PI / 2;
      const K = (R * R - D * D - g.r * g.r) / (2 * g.r);
      const cosB = clamp(K / D, -1, 1);
      return Math.atan2(dy, dx) - Math.acos(cosB);
    }

    function drawDome(t: number, k: number) {
      const a = 0.62 * smooth(0.1, 1.2, t);
      if (a <= 1e-3) return;
      const { cx, cy, r } = domeCircle(t);
      const c = ctx;
      const g = c.createLinearGradient(0, cy - r, 0, cy);
      g.addColorStop(0, `rgba(200,160,255,${0.6 * a})`);
      g.addColorStop(0.55, `rgba(150,100,255,${0.4 * a})`);
      g.addColorStop(1, `rgba(200,70,250,${0.25 * a})`);
      c.strokeStyle = g;
      c.lineWidth = 6 * k;
      c.globalAlpha = 0.25;
      c.beginPath();
      c.arc(cx, cy, r, 0, TAU);
      c.stroke();
      c.lineWidth = 1.5 * k;
      c.globalAlpha = 1;
      c.beginPath();
      c.arc(cx, cy, r, 0, TAU);
      c.stroke();
    }

    function drawComet(t: number, k: number) {
      if (t < ENTER_AT) return;
      const p = glowCircle(t);
      const rc = crescentRadius(t);
      const c = ctx;
      const theta = orbitPeriod
        ? entryAngle(t) + rad(4) - orbitAngle(t)
        : -Math.PI / 2;
      const px = p.cx + p.r * Math.cos(theta);
      const py = p.cy + p.r * Math.sin(theta);
      const span = rad(segmentDeg);
      c.save();
      c.translate(px, py);
      c.rotate(theta + Math.PI / 2);
      c.translate(0, rc);
      const head = -Math.PI / 2 + span / 2;
      const mid = head - span / 2;
      const bx = rc * Math.cos(mid) * 0.9;
      const by = rc * Math.sin(mid) * 0.9;
      const BR = rc * 0.95;
      const bloom = c.createRadialGradient(bx, by, 0, bx, by, BR);
      bloom.addColorStop(0, "rgba(180,150,255,0.7)");
      bloom.addColorStop(0.2, "rgba(130,90,255,0.5)");
      bloom.addColorStop(0.5, "rgba(70,50,250,0.22)");
      bloom.addColorStop(1, "rgba(10,16,180,0)");
      c.fillStyle = bloom;
      c.beginPath();
      c.arc(bx, by, BR, 0, TAU);
      c.fill();

      const shape = () => {
        const N = 160;
        const pts: [number, number, number][] = [];
        for (let i = 0; i <= N; i++) {
          const u = i / N;
          const ang = head - span * u;
          pts.push([Math.cos(ang), Math.sin(ang), crescentWidth(u) * k]);
        }
        c.beginPath();
        pts.forEach((q, i) => {
          if (i) c.lineTo(rc * q[0], rc * q[1]);
          else c.moveTo(rc * q[0], rc * q[1]);
        });
        for (let i = pts.length - 1; i >= 0; i--) {
          const q = pts[i],
            r = rc - q[2];
          c.lineTo(r * q[0], r * q[1]);
        }
        c.closePath();
      };

      c.save();
      for (const [blur, a] of [
        [40, 0.7],
        [20, 0.7],
        [10, 0.9],
      ] as [number, number][]) {
        c.shadowColor = `rgba(200,120,255,${a})`;
        c.shadowBlur = blur * k;
        c.fillStyle = "rgba(220,200,255,0.75)";
        shape();
        c.fill();
      }
      c.restore();
      shape();
      c.fillStyle = "rgb(255,255,255)";
      c.fill();

      const glint = (u: number, r: number, a: number) => {
        const ang = head - span * u;
        const rr = rc - crescentWidth(u) * k;
        const x = rr * Math.cos(ang),
          y = rr * Math.sin(ang);
        const g = c.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, `rgba(255,160,250,${a})`);
        g.addColorStop(1, "rgba(255,80,200,0)");
        c.fillStyle = g;
        c.beginPath();
        c.arc(x, y, r, 0, TAU);
        c.fill();
      };
      glint(0.42, 18 * k, 0.45);
      glint(0.66, 14 * k, 0.35);
      c.restore();
    }

    function frame(now: number) {
      if (!playing) return;
      const t = ((now - t0) / 1e3) * speed;
      if (!fired && t >= SETTLED) {
        fired = true;
        if (onSettled) onSettled();
      }
      if (loop && t >= TOTAL) {
        t0 = now;
        fired = false;
      } else if (!orbitPeriod && t >= TOTAL) {
        render(TOTAL);
        playing = false;
        return;
      }
      render(t);
      raf = requestAnimationFrame(frame);
    }

    function play() {
      if (playing) return;
      if (reduced) {
        render(TOTAL);
        if (!fired) {
          fired = true;
          if (onSettled) onSettled();
        }
        return;
      }
      playing = true;
      t0 = performance.now() - (tPause * 1e3) / speed;
      raf = requestAnimationFrame(frame);
    }

    function pause() {
      if (!playing) return;
      playing = false;
      cancelAnimationFrame(raf);
      tPause = ((performance.now() - t0) / 1e3) * speed;
    }

    function seek(t: number) {
      pause();
      tPause = t;
      render(t);
    }

    const onVis = () => {
      if (document.hidden) pause();
      else if (tPause > 0) play();
    };
    document.addEventListener("visibilitychange", onVis);

    const ro =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => {
            resize();
            render(cur);
          })
        : null;
    if (ro) ro.observe(canvas);
    resize();
    render(0);

    return {
      play,
      pause,
      seek,
      resize,
      destroy() {
        playing = false;
        cancelAnimationFrame(raf);
        if (ro) ro.disconnect();
        document.removeEventListener("visibilitychange", onVis);
      },
    };
  }

  return { createArgusBackdrop };
}

interface ArgusBackdropCanvasProps {
  className?: string;
  loop?: boolean;
  speed?: number;
}

export const ArgusBackdropCanvas: React.FC<ArgusBackdropCanvasProps> = ({
  className = "absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none z-0",
  loop = true,
  speed = 0.65,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const engine = createArgusBackdropEngine();
    const backdrop = engine.createArgusBackdrop(canvas, {
      loop,
      speed,
    });

    backdrop.play();

    return () => {
      backdrop.destroy();
    };
  }, [loop, speed]);

  return (
    <div className={className}>
      <canvas
        ref={canvasRef}
        className="block w-full h-full object-cover pointer-events-none"
      />
    </div>
  );
};

export default ArgusBackdropCanvas;
