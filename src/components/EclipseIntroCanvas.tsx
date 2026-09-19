"use client";

import React, { useEffect, useRef } from "react";

// Argus backdrop engine extracted directly from preview_3.html
function createArgusEngine() {
  const Y = Object.defineProperty;
  const kt = Object.getOwnPropertyDescriptor;
  const Ft = Object.getOwnPropertyNames;
  const It = Object.prototype.hasOwnProperty;
  const Bt = (a: any, c: any) => {
    for (const g in c) Y(a, g, { get: c[g], enumerable: true });
  };
  const Dt = (a: any, c: any, g: any, f: any) => {
    if ((c && typeof c === "object") || typeof c === "function") {
      for (const y of Ft(c)) {
        if (!It.call(a, y) && y !== g) {
          Y(a, y, {
            get: () => c[y],
            enumerable: !(f = kt(c, y)) || f.enumerable,
          });
        }
      }
    }
    return a;
  };
  const Ht = (a: any) => Dt(Y({}, "__esModule", { value: true }), a, null, null);
  const Nt: any = {};
  Bt(Nt, { createArgusBackdrop: () => zt });

  const D = Math.PI * 2;
  const W = (a: number, c = 0, g = 1) => Math.min(g, Math.max(c, a));
  const Z = (a: number, c: number, g: number) => a + (c - a) * g;
  const L = (a: number, c: number, g: number) => {
    const f = W((g - a) / (c - a));
    return f * f * (3 - 2 * f);
  };
  const tt = (a: number) => (a * Math.PI) / 180;

  function Wt(a: number) {
    return () => {
      a |= 0;
      a = (a + 1831565813) | 0;
      let c = Math.imul(a ^ (a >>> 15), 1 | a);
      c = (c + Math.imul(c ^ (c >>> 7), 61 | c)) ^ c;
      return ((c ^ (c >>> 14)) >>> 0) / 4294967296;
    };
  }

  function zt(a: HTMLCanvasElement, c: any = {}) {
    const {
      loop: g = false,
      onSettled: f,
      speed: y = 1,
      maxPixels: ht = 23e5,
      radiusH: ft = 0.595,
      radiusWMax: gt = 0.42,
      bottomH: et = 0.59,
      orbitPeriod: z = 9,
      orbitScale: pt = 1.5,
      segmentDeg: xt = 46,
      seed: yt = 11,
    } = c;

    const E = a.getContext("2d")!;
    const Mt =
      typeof matchMedia === "function" &&
      matchMedia("(prefers-reduced-motion: reduce)").matches;
    let x = 0;
    let m = 0;
    let M = 1;
    let N = 0;
    let P = false;
    let _ = 0;
    let K = 0;
    let ot = 0;
    let H = false;
    const T = Wt(yt);
    const St = Array.from({ length: 34 }, () => ({
      x: T(),
      y: T(),
      r: 0.6 + T() * T() * 2.6,
      a: 0.08 + T() * 0.22,
      vy: -(0.004 + T() * 0.012),
      tw: 0.4 + T() * 1.6,
      ph: T() * D,
    }));

    const G = document.createElement("canvas");
    const Ct = G.getContext("2d")!;
    let j = "";
    const U = document.createElement("canvas");
    U.width = U.height = 64;
    {
      const e = U.getContext("2d")!;
      const t = e.createRadialGradient(32, 32, 0, 32, 32, 32);
      t.addColorStop(0, "rgba(220,232,255,1)");
      t.addColorStop(0.3, "rgba(150,180,255,0.4)");
      t.addColorStop(1, "rgba(160,190,255,0)");
      e.fillStyle = t;
      e.fillRect(0, 0, 64, 64);
    }

    function q() {
      const e = a.getBoundingClientRect();
      x = Math.max(1, e.width);
      m = Math.max(1, e.height);
      M = Math.min(window.devicePixelRatio || 1, 2);
      M = Math.min(M, Math.sqrt(ht / (x * m)));
      a.width = Math.round(x * M);
      a.height = Math.round(m * M);
      G.width = a.width;
      G.height = a.height;
      j = "";
    }

    function J(e: number) {
      const t = Math.min(ft * m, gt * x);
      const r = t * (1 + 0.64 * Math.exp(-e / 1.8));
      const o = et * m + 0.012 * m * Math.exp(-e / 2.0);
      return { cx: x / 2, cy: o - r, R: r, Rf: t };
    }

    function rt(e: number) {
      const { Rf: t } = J(e);
      return { cx: x / 2 - 0.02 * t, cy: et * m + 0.27 * t, r: 0.60 * t };
    }

    function nt(e: number) {
      const t = rt(e);
      return { cx: t.cx, cy: t.cy, r: t.r * pt };
    }

    function k(e: number) {
      ot = e;
      const t = E;
      t.setTransform(1, 0, 0, 1, 0, 0);
      t.globalCompositeOperation = "source-over";
      t.globalAlpha = 1;
      t.clearRect(0, 0, a.width, a.height);
      t.setTransform(M, 0, 0, M, 0, 0);
      const r = t.createLinearGradient(0, 0, 0, m);
      r.addColorStop(0, "#02020c");
      r.addColorStop(0.62, "#010109");
      r.addColorStop(1, "#000005");
      t.fillStyle = r;
      t.fillRect(0, 0, x, m);
      const { cx: o, cy: n, R: s, Rf: d } = J(e);
      const l = d / 321;
      const $ = L(0.25, 2.4, e);
      // Slower, majestic arc expansion across the sky
      const p = tt(Z(7, 180, L(0.1, 2.2, e)));
      const v = Math.PI / 2 - p;
      const I = Math.PI / 2 + p;
      t.globalCompositeOperation = "lighter";
      wt(e);
      {
        const w = L(0.08, 0.6, e);
        const R = `${s.toFixed(1)}|${$.toFixed(3)}|${w.toFixed(3)}|${p.toFixed(3)}|${n.toFixed(1)}`;
        if (R !== j) {
          j = R;
          const i = Ct;
          i.setTransform(1, 0, 0, 1, 0, 0);
          i.clearRect(0, 0, G.width, G.height);
          i.setTransform(M, 0, 0, M, 0, 0);
          const O = 2.4 * s;
          const A = 220 * l;
          const u = 175 * l;
          const h = 54 * l; // Thicker radial glow band (was 26 * l)
          const b = i.createRadialGradient(o, n, 0, o, n, O);
          const C = 60;
          for (let V = 0; V <= C; V++) {
            const lt = (V / C) * O;
            const dt = Math.abs(lt - s);
            const Lt =
              Math.exp(-Math.pow(dt / (lt > s ? A : u), 1.35)) * $;
            const ut = Math.exp(-Math.pow(dt / h, 1.2)) * w * 1.15;
            const bt = W(Lt + ut, 0, 1.6);
            const mt = W(ut / Math.max(1e-4, bt));
            const Et = Math.round(Z(18, 96, mt));
            const Gt = Math.round(Z(8, 54, mt));
            b.addColorStop(
              V / C,
              `rgba(${Et},${Gt},255,${Math.min(1, bt).toFixed(3)})`
            );
          }
          i.fillStyle = b;
          i.fillRect(0, 0, x, m);
          i.globalCompositeOperation = "destination-in";
          const X = n + s;
          const B = i.createLinearGradient(0, 0, 0, X + 0.14 * m);
          B.addColorStop(0, "rgba(0,0,0,1)");
          B.addColorStop(0.42, "rgba(0,0,0,0.72)");
          B.addColorStop(0.72, "rgba(0,0,0,0.44)");
          B.addColorStop(X / (X + 0.14 * m), "rgba(0,0,0,0.30)");
          B.addColorStop(1, "rgba(0,0,0,0)");
          i.fillStyle = B;
          i.fillRect(0, 0, x, m);
          if (p < Math.PI - 0.01) {
            i.beginPath();
            i.moveTo(o, n);
            i.arc(o, n, O, v - 0.12, I + 0.12);
            i.closePath();
            i.fillStyle = "#000";
            i.fill();
          }
          i.globalCompositeOperation = "source-over";
          i.setTransform(1, 0, 0, 1, 0, 0);
        }
        t.save();
        t.setTransform(1, 0, 0, 1, 0, 0);
        t.drawImage(G, 0, 0);
        t.restore();
      }
      const S = L(0.04, 0.35, e);
      t.lineCap = "round";

      // Substantially thicker, richer arc strokes with cosmic purple aura
      for (const [w, R, i] of [
        [32, 0.20, "168,85,247"],  // Deep cosmic purple atmosphere
        [20, 0.38, "130,120,255"], // Vibrant indigo glow
        [12, 0.65, "170,170,255"], // Electric neon band
        [6.5, 0.88, "225,220,255"],// High-definition luminous rim
      ] as const) {
        t.lineWidth = (w as number) * l;
        t.strokeStyle = Tt(n, s, i as string, (R as number) * S);
        t.beginPath();
        t.arc(o, n, s, v, I);
        t.stroke();
      }
      // Bright white-hot laser core
      t.lineWidth = 3.6 * l;
      t.strokeStyle = $t(n, s, S);
      t.beginPath();
      t.arc(o, n, s, v, I);
      t.stroke();
      t.save();
      t.beginPath();
      t.arc(o, n, s, 0, D);
      t.clip();
      vt(e, l);
      Rt(e, l);
      t.restore();
      t.globalCompositeOperation = "source-over";
    }

    function Tt(e: number, t: number, r: string, o: number) {
      const n = E.createLinearGradient(0, e - t, 0, e + t);
      n.addColorStop(0, `rgba(190,120,255,${o * 1.2})`);
      n.addColorStop(0.2, `rgba(${r},${o})`);
      n.addColorStop(0.62, `rgba(${r},${o * 0.78})`);
      n.addColorStop(1, `rgba(${r},${o * 0.6})`);
      return n;
    }

    function $t(e: number, t: number, r: number) {
      const o = E.createLinearGradient(0, e - t, 0, e + t);
      o.addColorStop(0, `rgba(255,225,250,${r})`);
      o.addColorStop(0.25, `rgba(232,228,255,${r})`);
      o.addColorStop(1, `rgba(255,255,255,${r})`);
      return o;
    }

    function wt(e: number) {
      const t = E;
      for (const r of St) {
        let o = (r.y + r.vy * e) % 1;
        if (o < 0) o += 1;
        const n = 0.6 + 0.4 * Math.sin(e * r.tw + r.ph);
        t.globalAlpha = W(r.a * n * L(0.6, 2.2, e));
        const s = r.r * Math.max(1, Math.min(x, m) / 540);
        t.drawImage(U, r.x * x - s * 2, o * m - s * 2, s * 4, s * 4);
      }
      t.globalAlpha = 1;
    }

    const at = 3.2;
    function At(e: number) {
      return z ? (D * (e - at)) / z : 0;
    }

    function Pt(e: number) {
      const { cx: t, cy: r, R: o } = J(e);
      const n = nt(e);
      const s = n.cx - t;
      const d = n.cy - r;
      const l = Math.hypot(s, d);
      if (l < 1e-6) return -Math.PI / 2;
      const $ = (o * o - l * l - n.r * n.r) / (2 * n.r);
      const p = W($ / l, -1, 1);
      return Math.atan2(d, s) - Math.acos(p);
    }

    function vt(e: number, t: number) {
      const r = 0.62 * L(2.5, 3.8, e);
      if (r <= 0.001) return;
      const { cx: o, cy: n, r: s } = rt(e);
      const d = E;
      const l = d.createLinearGradient(0, n - s, 0, n);
      l.addColorStop(0, `rgba(150,170,255,${0.5 * r})`);
      l.addColorStop(0.55, `rgba(110,90,255,${0.32 * r})`);
      l.addColorStop(1, `rgba(190,70,220,${0.16 * r})`);
      for (const [$, p] of [
        [18, 0.16],
        [8.5, 0.35],
        [3.2, 0.95],
      ] as const) {
        d.lineWidth = ($ as number) * t;
        d.globalAlpha = p as number;
        d.strokeStyle = l;
        d.beginPath();
        d.arc(o, n, s, 0, D);
        d.stroke();
      }
      d.globalAlpha = 1;
    }

    function Rt(e: number, t: number) {
      if (e < at) return;
      const r = nt(e);
      const o = E;
      const n = tt(xt);
      const s = z ? Pt(e) + tt(4) - At(e) : -Math.PI / 2 + n / 2;
      const d = 1;
      const l = 1;
      const $ = 13 * t;
      const p = r.cx + r.r * Math.cos(s + n * 0.18);
      const v = r.cy + r.r * Math.sin(s + n * 0.18);
      const I = 77 * t * 4.2;
      const S = o.createRadialGradient(p, v, 0, p, v, I);
      S.addColorStop(0, `rgba(120,150,255,${0.55 * d * l})`);
      S.addColorStop(0.16, `rgba(60,90,255,${0.34 * d * l})`);
      S.addColorStop(0.42, `rgba(26,44,240,${0.16 * d * l})`);
      S.addColorStop(0.72, `rgba(16,26,210,${0.06 * d * l})`);
      S.addColorStop(1, "rgba(10,16,180,0)");
      o.fillStyle = S;
      o.beginPath();
      o.arc(p, v, I, 0, D);
      o.fill();
      const w = (i: number) => {
        const A: [number, number][] = [];
        for (let u = 0; u <= 110; u++) {
          const h = u / 110;
          const b = s + n * h;
          const C =
            Math.pow(Math.cos((Math.PI / 2) * Math.pow(h, 0.62)), 1.25) *
            (0.3 + 0.7 * L(0, 0.13, h));
          A.push([Math.cos(b), Math.sin(b), ($ + i) * C] as any);
        }
        o.beginPath();
        A.forEach((u: any, h: number) => {
          const b = r.r + 0.45 * u[2];
          if (h) o.lineTo(r.cx + b * u[0], r.cy + b * u[1]);
          else o.moveTo(r.cx + b * u[0], r.cy + b * u[1]);
        });
        for (let u = A.length - 1; u >= 0; u--) {
          const h: any = A[u];
          const b = r.r - 0.55 * h[2];
          o.lineTo(r.cx + b * h[0], r.cy + b * h[1]);
        }
        o.closePath();
      };
      for (let i = 5; i >= 1; i--) {
        w(i * 4.5 * t);
        o.fillStyle = `rgba(90,120,255,${0.1 * d * l})`;
        o.fill();
      }
      w(2 * t);
      o.fillStyle = `rgba(190,205,255,${0.5 * d * l})`;
      o.fill();
      w(0);
      o.fillStyle = `rgba(255,255,255,${d * l})`;
      o.fill();
      const R = (i: number, O: number, A: number) => {
        const u = s + n * i;
        const h = r.cx + r.r * Math.cos(u);
        const b = r.cy + r.r * Math.sin(u);
        const C = o.createRadialGradient(h, b, 0, h, b, O);
        C.addColorStop(0, `rgba(255,140,220,${A})`);
        C.addColorStop(1, "rgba(255,60,180,0)");
        o.fillStyle = C;
        o.beginPath();
        o.arc(h, b, O, 0, D);
        o.fill();
      };
      R(0.1, 17 * t, 0.34 * d * l);
      R(0.34, 12 * t, 0.2 * d);
    }

    function it(e: number) {
      if (!P) return;
      const t = ((e - _) / 1e3) * y;
      if (!H && t >= 4.4) {
        H = true;
        if (f) f();
      }
      if (g && t >= 6.4) {
        _ = e;
        H = false;
      } else if (!z && t >= 6.4) {
        k(6.4);
        P = false;
        return;
      }
      k(t);
      N = requestAnimationFrame(it);
    }

    function ct() {
      if (!P) {
        if (Mt) {
          k(6.4);
          if (!H) {
            H = true;
            if (f) f();
          }
          return;
        }
        P = true;
        _ = performance.now() - (K * 1e3) / y;
        N = requestAnimationFrame(it);
      }
    }

    function Q() {
      if (P) {
        P = false;
        cancelAnimationFrame(N);
        K = ((performance.now() - _) / 1e3) * y;
      }
    }

    function Ot(e: number) {
      Q();
      K = e;
      k(e);
    }

    const st = () => {
      if (document.hidden) Q();
      else if (K > 0) ct();
    };

    document.addEventListener("visibilitychange", st);
    const F =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => {
            q();
            k(ot);
          })
        : null;

    if (F) F.observe(a);
    q();
    k(0);

    return {
      play: ct,
      pause: Q,
      seek: Ot,
      resize: q,
      destroy() {
        P = false;
        cancelAnimationFrame(N);
        if (F) F.disconnect();
        document.removeEventListener("visibilitychange", st);
      },
    };
  }

  return Ht(Nt);
}

interface EclipseIntroCanvasProps {
  className?: string;
  loop?: boolean;
  speed?: number;
}

export const EclipseIntroCanvas: React.FC<EclipseIntroCanvasProps> = ({
  className = "absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none z-0 bg-[#02020c]",
  loop = false,
  speed = 1,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const engine = createArgusEngine();
    const backdrop = engine.createArgusBackdrop(canvas, {
      loop: loop,
      speed: speed,
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

export default EclipseIntroCanvas;
