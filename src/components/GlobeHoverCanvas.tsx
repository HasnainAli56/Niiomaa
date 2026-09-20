"use client";

import React, { useEffect, useRef } from "react";

// SVG viewBox dimensions (must match the SVG in HorizontalExperience)
const VB_W = 2779;
const VB_H = 1083;
// Globe circle parameters in viewBox space
const GLOBE_CX = 1425;
const GLOBE_CY = 1068;
const GLOBE_R  = 1006;
// Hover pink brush radius (viewBox pixels)
const HOVER_R  = 170;
// Blue back-glow center and radius (shadow/night side – right area of globe)
const BACK_CX  = 1900;
const BACK_CY  = 600;
const BACK_R   = 580;

interface GlobeHoverCanvasProps {
  /** Mouse position in SVG viewBox coordinates (0-2779, 0-1083) */
  mousePos: { x: number; y: number } | null;
  isHovered: boolean;
}

export const GlobeHoverCanvas: React.FC<GlobeHoverCanvasProps> = ({
  mousePos,
  isHovered,
}) => {
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const offscreenRef = useRef<HTMLCanvasElement | null>(null);
  const imgReadyRef  = useRef(false);
  const alphaRef     = useRef(0);
  const rafRef       = useRef<number>(0);
  const mpRef        = useRef(mousePos);

  // Keep mousePos ref in sync without re-triggering the animation effect
  useEffect(() => { mpRef.current = mousePos; }, [mousePos]);

  // Load globe_base.png into an offscreen canvas for pixel-colour sampling
  useEffect(() => {
    const off = document.createElement("canvas");
    off.width  = VB_W;
    off.height = VB_H;
    offscreenRef.current = off;

    const img = new Image();
    img.onload = () => {
      off.getContext("2d")!.drawImage(img, 0, 0, VB_W, VB_H);
      imgReadyRef.current = true;
    };
    img.onerror = () => { imgReadyRef.current = false; };
    // Same-origin asset – no crossOrigin header needed
    img.src = "/globe_base.png";
  }, []);

  // Main animation / render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    // Temporary canvas used to route ImageData through drawImage so clip works
    const tmp    = document.createElement("canvas");
    tmp.width    = VB_W;
    tmp.height   = VB_H;
    const tmpCtx = tmp.getContext("2d")!;

    const frame = () => {
      rafRef.current = requestAnimationFrame(frame);

      // Smooth alpha transition
      const target = isHovered ? 0.6 : 0;
      const diff   = target - alphaRef.current;
      if (Math.abs(diff) > 0.003) alphaRef.current += diff * 0.08;
      else                          alphaRef.current  = target;

      const alpha = alphaRef.current;
      ctx.clearRect(0, 0, VB_W, VB_H);
      if (alpha < 0.005) return;

      // ── 1. Blue back-side glow (shadow/night hemisphere) ─────────────────
      const bg = ctx.createRadialGradient(BACK_CX, BACK_CY, 0, BACK_CX, BACK_CY, BACK_R);
      bg.addColorStop(0,    `rgba(30,  110, 255, ${0.14 * alpha})`);
      bg.addColorStop(0.30, `rgba(20,  75,  230, ${0.09 * alpha})`);
      bg.addColorStop(0.60, `rgba(10,  45,  200, ${0.04 * alpha})`);
      bg.addColorStop(0.85, `rgba(5,   20,  150, ${0.02 * alpha})`);
      bg.addColorStop(1,    `rgba(0,   10,  100, 0)`);

      ctx.save();
      ctx.beginPath();
      ctx.arc(GLOBE_CX, GLOBE_CY, GLOBE_R, 0, Math.PI * 2);
      ctx.clip();
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, VB_W, VB_H);
      ctx.restore();

      // ── 2. Pink land highlight under cursor ───────────────────────────────
      const mp = mpRef.current;
      if (mp && imgReadyRef.current && offscreenRef.current) {
        const { x: mx, y: my } = mp;

        // Bounding box of hover region (clamped to viewBox)
        const x0 = Math.max(0, Math.floor(mx - HOVER_R));
        const y0 = Math.max(0, Math.floor(my - HOVER_R));
        const x1 = Math.min(VB_W - 1, Math.ceil(mx + HOVER_R));
        const y1 = Math.min(VB_H - 1, Math.ceil(my + HOVER_R));
        const rw = x1 - x0 + 1;
        const rh = y1 - y0 + 1;

        if (rw > 0 && rh > 0) {
          const srcData = offscreenRef.current
            .getContext("2d")!
            .getImageData(x0, y0, rw, rh);
          const outData = new ImageData(rw, rh);

          for (let j = 0; j < rh; j++) {
            for (let i = 0; i < rw; i++) {
              const si = (j * rw + i) * 4;

              // Skip fully-transparent pixels
              if (srcData.data[si + 3] < 20) continue;

              // Must be inside the globe circle
              const gx = x0 + i - GLOBE_CX;
              const gy = y0 + j - GLOBE_CY;
              if (gx * gx + gy * gy > GLOBE_R * GLOBE_R) continue;

              // Distance from cursor — skip outside hover radius
              const dx   = x0 + i - mx;
              const dy   = y0 + j - my;
              const dist = Math.sqrt(dx * dx + dy * dy);
              if (dist > HOVER_R) continue;

              const r = srcData.data[si];
              const g = srcData.data[si + 1];
              const b = srcData.data[si + 2];

              // Land detection: yellow/green/brown areas have more R than B
              // (blue ocean has B > R; dark night-side has all low values)
              const isLand = r > 65 && r > b + 30;
              if (!isLand) continue;

              // Smooth radial falloff
              const falloff  = 1 - dist / HOVER_R;
              const pinkAlpha = Math.round(falloff * falloff * 235 * alpha);

              outData.data[si]     = 255; // R – vivid pink
              outData.data[si + 1] = 38;  // G
              outData.data[si + 2] = 145; // B
              outData.data[si + 3] = pinkAlpha;
            }
          }

          // putImageData ignores canvas clip → draw via tmp canvas + drawImage
          tmpCtx.clearRect(x0, y0, rw, rh);
          tmpCtx.putImageData(outData, x0, y0);

          ctx.save();
          ctx.beginPath();
          ctx.arc(GLOBE_CX, GLOBE_CY, GLOBE_R, 0, Math.PI * 2);
          ctx.clip();
          ctx.drawImage(tmp, x0, y0, rw, rh, x0, y0, rw, rh);
          ctx.restore();
        }
      }
    };

    rafRef.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isHovered]);

  return (
    <canvas
      ref={canvasRef}
      width={VB_W}
      height={VB_H}
      className="absolute inset-0 w-full h-full object-contain object-bottom pointer-events-none select-none"
      style={{ zIndex: 9 }}
    />
  );
};

export default GlobeHoverCanvas;
