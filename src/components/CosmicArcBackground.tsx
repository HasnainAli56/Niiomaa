"use client";

import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring } from "framer-motion";

interface CosmicArcBackgroundProps {
  className?: string;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  pulseSpeed: number;
  pulseOffset: number;
  color: string;
}

export const CosmicArcBackground: React.FC<CosmicArcBackgroundProps> = ({
  className = "absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none z-0 bg-[#000814]",
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Mouse interaction values with smooth physics spring
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 30, stiffness: 60 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const xNorm = (e.clientX / innerWidth - 0.5) * 2; // -1 to 1
      const yNorm = (e.clientY / innerHeight - 0.5) * 2;
      mouseX.set(xNorm * 18);
      mouseY.set(yNorm * 12);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let dpr = 1;

    // High-resolution particle stars
    const particleColors = [
      "rgba(255, 255, 255, ",
      "rgba(165, 243, 252, ", // Cyan
      "rgba(147, 197, 253, ", // Soft blue
      "rgba(192, 132, 252, ", // Lavender
      "rgba(96, 165, 250, ",  // Electric blue
    ];

    let particles: Particle[] = [];

    const initParticles = () => {
      const count = Math.min(Math.floor((width * height) / 11000), 120);
      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 1.8 + 0.6,
          speedX: (Math.random() - 0.5) * 0.22,
          speedY: (Math.random() - 0.5) * 0.18,
          opacity: Math.random() * 0.7 + 0.25,
          pulseSpeed: Math.random() * 0.02 + 0.008,
          pulseOffset: Math.random() * Math.PI * 2,
          color: particleColors[Math.floor(Math.random() * particleColors.length)],
        });
      }
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2.5);
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);
      initParticles();
    };

    resize();
    window.addEventListener("resize", resize);

    let time = 0;

    const render = () => {
      time += 0.016;

      ctx.clearRect(0, 0, width, height);

      // 1. Center Volumetric Ambient Glow Pulse (Breathing aura)
      const centerX = width * 0.5;
      const arcCenterY = height * 0.44;
      const breath = Math.sin(time * 0.8) * 0.08 + 1;

      const auraRadius = Math.max(width * 0.38, 380) * breath;
      const auraGradient = ctx.createRadialGradient(
        centerX,
        arcCenterY - 40,
        10,
        centerX,
        arcCenterY - 20,
        auraRadius
      );
      auraGradient.addColorStop(0, "rgba(37, 99, 235, 0.22)");
      auraGradient.addColorStop(0.35, "rgba(30, 64, 175, 0.14)");
      auraGradient.addColorStop(0.7, "rgba(17, 24, 39, 0.06)");
      auraGradient.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.save();
      ctx.fillStyle = auraGradient;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();

      // 2. Ultra-Crisp Floating Stardust Particles
      ctx.save();
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.speedX;
        p.y += p.speedY;

        // Wrap around boundaries
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        const currentOpacity =
          p.opacity * (0.6 + 0.4 * Math.sin(time * 2 * p.pulseSpeed * 60 + p.pulseOffset));

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${currentOpacity.toFixed(3)})`;
        ctx.shadowBlur = p.size > 1.4 ? 6 : 2;
        ctx.shadowColor = "rgba(147, 197, 253, 0.8)";
        ctx.fill();
      }
      ctx.restore();

      // 3. Dynamic Traveling Photon Wave along the Arc
      // Parametric arc equation:
      // x(t) = centerX + radiusX * cos(theta), y(t) = arcCenterY + radiusY * sin(theta)
      // theta spans from ~ 0.12*PI to 0.88*PI
      const rx = width * 0.52;
      const ry = height * 0.52;
      const arcCenterPosY = height * -0.06;

      // Traveling light pulse (cycles smoothly from left to right)
      const pulseProgress = (time * 0.28) % 1; // 0 to 1
      const pulseTheta = Math.PI * 0.18 + pulseProgress * (Math.PI * 0.64);
      const pulseX = centerX + Math.cos(pulseTheta) * rx;
      const pulseY = arcCenterPosY + Math.sin(pulseTheta) * ry;

      // Draw brilliant photon glow along arc
      ctx.save();
      ctx.globalCompositeOperation = "screen";

      const photonGrad = ctx.createRadialGradient(
        pulseX,
        pulseY,
        0,
        pulseX,
        pulseY,
        Math.min(width * 0.12, 140)
      );
      photonGrad.addColorStop(0, "rgba(255, 255, 255, 0.95)");
      photonGrad.addColorStop(0.15, "rgba(56, 189, 248, 0.85)");
      photonGrad.addColorStop(0.45, "rgba(37, 99, 235, 0.4)");
      photonGrad.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.fillStyle = photonGrad;
      ctx.beginPath();
      ctx.arc(pulseX, pulseY, Math.min(width * 0.12, 140), 0, Math.PI * 2);
      ctx.fill();

      // Secondary specular streak
      ctx.strokeStyle = "rgba(255, 255, 255, 0.75)";
      ctx.lineWidth = 2.5;
      ctx.shadowBlur = 12;
      ctx.shadowColor = "#38BDF8";
      ctx.beginPath();
      const streakSpan = 0.04;
      ctx.ellipse(
        centerX,
        arcCenterPosY,
        rx,
        ry,
        0,
        pulseTheta - streakSpan,
        pulseTheta + streakSpan
      );
      ctx.stroke();

      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className={className}>
      {/* 1. Base Deep Cosmic Space Gradient */}
      <div className="absolute inset-0 bg-[#000714] bg-[radial-gradient(ellipse_80%_60%_at_50%_20%,rgba(15,23,42,0.8)_0%,#000714_100%)]" />

      {/* 2. Razor-Sharp Master Arc Asset (High-Fidelity PNG, Zero Video Blurriness) */}
      <motion.div
        style={{
          x: smoothMouseX,
          y: smoothMouseY,
        }}
        className="absolute inset-0 w-full h-full will-change-transform pointer-events-none"
      >
        <Image
          src="/hero_bg.png"
          alt="NIIOMA Cosmic Horizon Arc"
          fill
          priority
          sizes="100vw"
          className="object-cover object-top filter contrast-[1.08] brightness-[1.02]"
        />
      </motion.div>

      {/* 3. Top Corner Coronal Flares (Magenta-Violet Pulsing Optics matching mockup-ref) */}
      <div className="absolute -top-12 -left-12 w-80 h-80 sm:w-96 sm:h-96 rounded-full bg-[radial-gradient(circle,rgba(217,70,239,0.45)_0%,rgba(147,51,234,0.25)_40%,transparent_70%)] blur-2xl pointer-events-none animate-pulse" style={{ animationDuration: "5s" }} />
      <div className="absolute -top-12 -right-12 w-80 h-80 sm:w-96 sm:h-96 rounded-full bg-[radial-gradient(circle,rgba(217,70,239,0.45)_0%,rgba(147,51,234,0.25)_40%,transparent_70%)] blur-2xl pointer-events-none animate-pulse" style={{ animationDuration: "5s", animationDelay: "1.5s" }} />

      {/* 4. High-Resolution Dynamic Canvas Overlay (Particles, Traveling Photon Beam, Aura) */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
      />

      {/* 5. Smooth Bottom Space Falloff into deep space #000B1A */}
      <div className="absolute bottom-0 left-0 right-0 h-[28vh] bg-gradient-to-t from-[#000B1A] via-[#000B1A]/80 to-transparent pointer-events-none z-10" />
    </div>
  );
};

export default CosmicArcBackground;
