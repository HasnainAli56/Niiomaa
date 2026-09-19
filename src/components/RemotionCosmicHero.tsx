"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

const W = 1280;
const H = 720;
const DURATION = 23.0; // Matches full 23s reference video timeline

// Deterministic seed random
const seededRandom = (seedStr: string) => {
  let hash = 0;
  for (let i = 0; i < seedStr.length; i++) {
    hash = (hash << 5) - hash + seedStr.charCodeAt(i);
    hash |= 0;
  }
  const x = Math.sin(Math.abs(hash) + 1) * 10000;
  return x - Math.floor(x);
};

export const RemotionCosmicHero: React.FC<{ className?: string }> = ({
  className = "absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none z-0 bg-[#01020d]",
}) => {
  const [t, setT] = useState(0);

  useEffect(() => {
    let animId: number;
    let startTime: number | null = null;

    const loop = (timestamp: number) => {
      if (startTime === null) startTime = timestamp;
      const elapsed = (timestamp - startTime) / 1000;
      setT(elapsed % DURATION);
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  // 1. Floating Bokeh Particles (Matching reference video)
  const bokehParticles = useMemo(() => {
    return new Array(110).fill(0).map((_, i) => ({
      x: seededRandom("x" + i) * W,
      y: seededRandom("y" + i) * H,
      r: 0.8 + Math.pow(seededRandom("r" + i), 2.2) * 14,
      sp: 4 + seededRandom("s" + i) * 16,
      ph: seededRandom("p" + i) * Math.PI * 2,
      isCyan: seededRandom("c" + i) > 0.45,
    }));
  }, []);

  // 2. Center Concentric HUD Rings Geometry
  const cx = 640;
  const cy = 465;

  // Timings from video
  // Outer flare sweeping rotation
  const sweepAngle1 = (t * 70) % 360;
  const sweepAngle2 = (-t * 48 + 45) % 360;
  const sweepAngle3 = (t * 95 + 120) % 360;
  const beadOrbitAngle = (t * 26) % 360;

  // Arc entry fade-in (0s to 1.2s)
  const introFade = Math.min(1, t / 1.0);
  const ring2Fade = Math.min(1, Math.max(0, (t - 1.2) / 1.0));
  const ring3Fade = Math.min(1, Math.max(0, (t - 3.0) / 1.2));
  const beadsFade = Math.min(1, Math.max(0, (t - 4.5) / 1.5));

  // Beads array along radius 175
  const beads = useMemo(() => {
    const arr = [];
    const count = 38;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      // Cluster density distribution like video
      const rOffset = (seededRandom("b_r" + i) - 0.5) * 12;
      const size = 1.2 + seededRandom("b_s" + i) * 2.4;
      const op = 0.4 + seededRandom("b_o" + i) * 0.6;
      arr.push({ baseAngle: angle, rOffset, size, op });
    }
    return arr;
  }, []);

  // Star sparkle pulse (bottom right)
  const starScale = 0.85 + 0.25 * Math.sin(t * 2.8);
  const starGlow = 0.7 + 0.3 * Math.cos(t * 2.8);

  return (
    <div className={className}>
      {/* Background Deep Space Gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 95% 75% at 50% 25%, #061138 0%, #02071a 45%, #01020d 100%)",
        }}
      />

      {/* SVG Canvas Matching 1280x720 1:1 Aspect Ratio with Screen-fit */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Multi-tier Gaussian Blur Filters */}
          <filter id="b2" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={2} />
          </filter>
          <filter id="b4" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={4} />
          </filter>
          <filter id="b8" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={8} />
          </filter>
          <filter id="b16" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={16} />
          </filter>
          <filter id="b28" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={28} />
          </filter>

          {/* Gradients */}
          <linearGradient id="mainArcGrad" x1="0" y1="0" x2={W} y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="10%" stopColor="#818cf8" />
            <stop offset="50%" stopColor="#60a5fa" />
            <stop offset="90%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#ffffff" />
          </linearGradient>

          <linearGradient id="mainArcGlow" x1="0" y1="0" x2={W} y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#c084fc" />
            <stop offset="12%" stopColor="#3b82f6" />
            <stop offset="50%" stopColor="#1d4ed8" />
            <stop offset="88%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#c084fc" />
          </linearGradient>

          <radialGradient id="ringGlowRadial" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00d2ff" stopOpacity="0.4" />
            <stop offset="45%" stopColor="#1d4ed8" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="topAuraRadial" cx="50%" cy="30%" r="60%">
            <stop offset="0%" stopColor="#2563eb" stopOpacity="0.32" />
            <stop offset="50%" stopColor="#1e1b4b" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ambient Top Atmospheric Aura */}
        <rect x={0} y={0} width={W} height={H} fill="url(#topAuraRadial)" />

        {/* Floating Bokeh Dust (Drifting upward) */}
        <g style={{ mixBlendMode: "screen" }}>
          {bokehParticles.map((p, i) => {
            const y = (((p.y - t * p.sp) % H) + H) % H;
            const x = p.x + Math.sin(t * 0.35 + p.ph) * 14;
            const tw = 0.35 + 0.45 * Math.sin(t * 1.6 + p.ph);
            const fill = p.isCyan ? "#38bdf8" : "#818cf8";
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r={p.r}
                fill={fill}
                opacity={p.r > 7 ? tw * 0.35 : tw}
                filter={p.r > 6 ? "url(#b4)" : undefined}
              />
            );
          })}
        </g>

        {/* ============================================================ */}
        {/* 1. TOP MASSIVE HORIZON ARC (Exact curve matching video)      */}
        {/* ============================================================ */}
        <g opacity={introFade} style={{ mixBlendMode: "screen" }}>
          {/* Deep royal blue volumetric aura */}
          <path
            d="M -120 -60 C 260 470, 1020 470, 1400 -60"
            fill="none"
            stroke="url(#mainArcGlow)"
            strokeWidth={56}
            filter="url(#b28)"
            opacity={0.85}
          />
          {/* Neon electric blue atmospheric glow */}
          <path
            d="M -120 -60 C 260 470, 1020 470, 1400 -60"
            fill="none"
            stroke="#2563eb"
            strokeWidth={22}
            filter="url(#b8)"
            opacity={0.95}
          />
          {/* Cyan secondary aura */}
          <path
            d="M -120 -60 C 260 470, 1020 470, 1400 -60"
            fill="none"
            stroke="#38bdf8"
            strokeWidth={8}
            filter="url(#b2)"
            opacity={0.9}
          />
          {/* Crisp laser core */}
          <path
            d="M -120 -60 C 260 470, 1020 470, 1400 -60"
            fill="none"
            stroke="url(#mainArcGrad)"
            strokeWidth={3.8}
            strokeLinecap="round"
          />

          {/* Top Left & Right Coronal Flare Flares */}
          <ellipse cx={20} cy={20} rx={120} ry={120} fill="#ffffff" opacity={0.25} filter="url(#b16)" />
          <ellipse cx={1260} cy={20} rx={120} ry={120} fill="#ffffff" opacity={0.25} filter="url(#b16)" />
        </g>

        {/* ============================================================ */}
        {/* 2. CENTER CONCENTRIC HUD RINGS (Matching video 0:02-0:23)    */}
        {/* ============================================================ */}
        {/* Radial ambient glow behind concentric rings */}
        <circle cx={cx} cy={cy} r={240} fill="url(#ringGlowRadial)" opacity={ring2Fade} />

        {/* Ring 1: Middle / Primary Celestial Ring (r = 142) */}
        <g opacity={introFade} style={{ mixBlendMode: "screen" }}>
          {/* Base circle */}
          <circle
            cx={cx}
            cy={cy}
            r={142}
            fill="none"
            stroke="#1d4ed8"
            strokeWidth={14}
            filter="url(#b8)"
            opacity={0.7}
          />
          <circle
            cx={cx}
            cy={cy}
            r={142}
            fill="none"
            stroke="#00e5ff"
            strokeWidth={2.4}
            opacity={0.8}
          />

          {/* Rotating bright sweeping arc with hot head flare */}
          <g transform={`rotate(${sweepAngle1} ${cx} ${cy})`}>
            {/* Trailing electric cyan streak */}
            <circle
              cx={cx}
              cy={cy}
              r={142}
              fill="none"
              pathLength={100}
              strokeDasharray="22 78"
              stroke="#38bdf8"
              strokeWidth={12}
              filter="url(#b4)"
              strokeLinecap="round"
              opacity={0.9}
            />
            {/* White hot laser core */}
            <circle
              cx={cx}
              cy={cy}
              r={142}
              fill="none"
              pathLength={100}
              strokeDasharray="14 86"
              stroke="#ffffff"
              strokeWidth={4.5}
              strokeLinecap="round"
            />
            {/* Flare head burst */}
            <circle
              cx={cx + 142}
              cy={cy}
              r={7}
              fill="#ffffff"
              filter="url(#b2)"
            />
            <ellipse
              cx={cx + 142}
              cy={cy}
              rx={28}
              ry={6}
              fill="#ffffff"
              filter="url(#b4)"
              opacity={0.85}
            />
          </g>
        </g>

        {/* Ring 2: Concentric Outer Precision Track (r = 166) */}
        <g opacity={ring2Fade} style={{ mixBlendMode: "screen" }}>
          <circle
            cx={cx}
            cy={cy}
            r={166}
            fill="none"
            stroke="#0284c7"
            strokeWidth={1.8}
            opacity={0.7}
          />

          {/* Counter-rotating cyan segment */}
          <g transform={`rotate(${sweepAngle2} ${cx} ${cy})`}>
            <circle
              cx={cx}
              cy={cy}
              r={166}
              fill="none"
              pathLength={100}
              strokeDasharray="30 70"
              stroke="#00f0ff"
              strokeWidth={5}
              filter="url(#b2)"
              strokeLinecap="round"
            />
            <circle
              cx={cx}
              cy={cy}
              r={166}
              fill="none"
              pathLength={100}
              strokeDasharray="12 88"
              stroke="#ffffff"
              strokeWidth={2.5}
              strokeLinecap="round"
            />
          </g>
        </g>

        {/* Ring 3: Concentric Inner Precision Track (r = 105) */}
        <g opacity={ring3Fade} style={{ mixBlendMode: "screen" }}>
          <circle
            cx={cx}
            cy={cy}
            r={105}
            fill="none"
            stroke="#2563eb"
            strokeWidth={1.5}
            opacity={0.65}
          />
          <g transform={`rotate(${sweepAngle3} ${cx} ${cy})`}>
            <circle
              cx={cx}
              cy={cy}
              r={105}
              fill="none"
              pathLength={100}
              strokeDasharray="20 80"
              stroke="#60a5fa"
              strokeWidth={3}
              strokeLinecap="round"
            />
          </g>
        </g>

        {/* Ring 4: Orbiting Particle Beads (Matching video 0:06-0:23) */}
        <g
          transform={`rotate(${beadOrbitAngle} ${cx} ${cy})`}
          opacity={beadsFade}
          style={{ mixBlendMode: "screen" }}
        >
          {beads.map((b, i) => {
            const rad = 172 + b.rOffset;
            const bx = cx + Math.cos(b.baseAngle) * rad;
            const by = cy + Math.sin(b.baseAngle) * rad;
            return (
              <g key={i}>
                <circle
                  cx={bx}
                  cy={by}
                  r={b.size}
                  fill="#67e8f9"
                  opacity={b.op}
                />
                {b.size > 2.0 && (
                  <circle
                    cx={bx}
                    cy={by}
                    r={b.size * 2.2}
                    fill="#38bdf8"
                    opacity={b.op * 0.45}
                    filter="url(#b2)"
                  />
                )}
              </g>
            );
          })}
        </g>


      </svg>
    </div>
  );
};

export default RemotionCosmicHero;
