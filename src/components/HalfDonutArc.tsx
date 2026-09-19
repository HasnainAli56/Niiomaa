"use client";

import React from "react";
import { motion } from "framer-motion";

interface HalfDonutArcProps {
  className?: string;
}

export const HalfDonutArc: React.FC<HalfDonutArcProps> = ({ className = "" }) => {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 45,
        x: 35,
        scale: 0.92,
      }}
      animate={{
        opacity: 1,
        y: 0,
        x: 0,
        scale: 1,
      }}
      transition={{
        duration: 2.2,
        delay: 1.2,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={`w-full aspect-[600/320] select-none pointer-events-none relative ${className}`}
      aria-hidden="true"
    >
      {/* Continuous gentle celestial drift from Right to Left */}
      <motion.div
        animate={{
          x: [24, -24, 24],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="w-full h-full relative"
      >
        <svg
          viewBox="0 0 600 320"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full overflow-visible pointer-events-none"
        >
          <defs>
            {/* Multi-layer glowing filters with subtle purple / cosmic ultraviolet aura */}
            <filter id="hda-donut-glow" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="4" result="blur1" />
              <feGaussianBlur stdDeviation="12" result="blur2" />
              <feMerge>
                <feMergeNode in="blur2" />
                <feMergeNode in="blur1" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <filter id="hda-endpoint-glow" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="3" result="b1" />
              <feGaussianBlur stdDeviation="9" result="b2" />
              <feGaussianBlur stdDeviation="22" result="b3" />
              <feMerge>
                <feMergeNode in="b3" />
                <feMergeNode in="b2" />
                <feMergeNode in="b1" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <filter id="hda-comet-flare-filter" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="3" result="cb1" />
              <feGaussianBlur stdDeviation="10" result="cb2" />
              <feGaussianBlur stdDeviation="26" result="cb3" />
              <feMerge>
                <feMergeNode in="cb3" />
                <feMergeNode in="cb2" />
                <feMergeNode in="cb1" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Ambient Cosmic Purple Radial Atmosphere behind the dome */}
            <radialGradient
              id="hda-purple-halo"
              cx="50%"
              cy="70%"
              r="60%"
            >
              <stop offset="0%" stopColor="rgba(168, 85, 247, 0.32)" />
              <stop offset="35%" stopColor="rgba(126, 34, 206, 0.18)" />
              <stop offset="65%" stopColor="rgba(59, 130, 246, 0.08)" />
              <stop offset="100%" stopColor="rgba(0, 11, 26, 0)" />
            </radialGradient>

            {/* Gradient fill for translucent donut band: blue blending with cosmic purple */}
            <linearGradient
              id="hda-donut-band"
              x1="300"
              y1="30"
              x2="300"
              y2="300"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="rgba(168, 85, 247, 0.42)" />
              <stop offset="28%" stopColor="rgba(99, 102, 241, 0.32)" />
              <stop offset="60%" stopColor="rgba(59, 130, 246, 0.18)" />
              <stop offset="85%" stopColor="rgba(30, 58, 138, 0.06)" />
              <stop offset="100%" stopColor="rgba(10, 20, 120, 0.0)" />
            </linearGradient>

            {/* Outer rim gradient with violet & electric blue luminescence */}
            <linearGradient
              id="hda-outer-rim-grad"
              x1="300"
              y1="30"
              x2="300"
              y2="300"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#e9d5ff" stopOpacity="0.98" />
              <stop offset="35%" stopColor="#c084fc" stopOpacity="0.92" />
              <stop offset="65%" stopColor="#60a5fa" stopOpacity="0.85" />
              <stop offset="90%" stopColor="#3b82f6" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#2563eb" stopOpacity="0.05" />
            </linearGradient>

            {/* Inner rim gradient with delicate purple-cyan sheen */}
            <linearGradient
              id="hda-inner-rim-grad"
              x1="300"
              y1="75"
              x2="300"
              y2="300"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#c084fc" stopOpacity="0.75" />
              <stop offset="45%" stopColor="#818cf8" stopOpacity="0.55" />
              <stop offset="85%" stopColor="#3b82f6" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.0" />
            </linearGradient>

            {/* Left endpoint gradient */}
            <linearGradient
              id="hda-left-glow"
              x1="30"
              y1="300"
              x2="70"
              y2="170"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
              <stop offset="25%" stopColor="#f3e8ff" stopOpacity="0.95" />
              <stop offset="55%" stopColor="#c084fc" stopOpacity="0.7" />
              <stop offset="80%" stopColor="#60a5fa" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </linearGradient>

            {/* Right endpoint gradient */}
            <linearGradient
              id="hda-right-glow"
              x1="570"
              y1="300"
              x2="530"
              y2="170"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
              <stop offset="25%" stopColor="#fae8ff" stopOpacity="0.95" />
              <stop offset="55%" stopColor="#e879f9" stopOpacity="0.7" />
              <stop offset="80%" stopColor="#818cf8" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </linearGradient>

            {/* Upper-right comet gradient with glowing purple & white-hot core */}
            <linearGradient
              id="hda-comet-gradient"
              x1="360"
              y1="35"
              x2="535"
              y2="165"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#818cf8" stopOpacity="0" />
              <stop offset="20%" stopColor="#c084fc" stopOpacity="0.65" />
              <stop offset="45%" stopColor="#f3e8ff" stopOpacity="0.88" />
              <stop offset="65%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="85%" stopColor="#e9d5ff" stopOpacity="0.82" />
              <stop offset="95%" stopColor="#a855f7" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* 0. Ambient Subtle Purple Halo behind the Arch */}
          <ellipse
            cx="300"
            cy="175"
            rx="275"
            ry="125"
            fill="url(#hda-purple-halo)"
            style={{ mixBlendMode: "screen", pointerEvents: "none" }}
          />

          {/* 
            Geometry:
            Center = (300, 300)
            Outer Radius = 270 (Left: 30, Top: 30, Right: 570)
            Inner Radius = 226 (Left: 74, Top: 74, Right: 526)
            Spacious inner opening: 452px wide, 226px tall (more room inside like the reference pic)
          */}

          {/* 1. Translucent Donut Band */}
          <path
            d="M 30 300 A 270 270 0 0 1 570 300 L 526 300 A 226 226 0 0 0 74 300 Z"
            fill="url(#hda-donut-band)"
          />

          {/* 2. Outer Semicircular Rim with purple-blue glow */}
          <path
            d="M 30 300 A 270 270 0 0 1 570 300"
            fill="none"
            stroke="url(#hda-outer-rim-grad)"
            strokeWidth="2.4"
            style={{
              filter:
                "drop-shadow(0 -2px 10px rgba(168, 85, 247, 0.75)) drop-shadow(0 0 24px rgba(59, 130, 246, 0.5))",
            }}
          />

          {/* 3. Inner Semicircular Rim (spacious dome) */}
          <path
            d="M 74 300 A 226 226 0 0 1 526 300"
            fill="none"
            stroke="url(#hda-inner-rim-grad)"
            strokeWidth="1.6"
            style={{
              filter:
                "drop-shadow(0 -1px 8px rgba(192, 132, 252, 0.45)) drop-shadow(0 0 16px rgba(99, 102, 241, 0.3))",
            }}
          />

          {/* 4. Left Endpoint Glow */}
          <path
            d="M 30 300 A 270 270 0 0 1 68 170"
            fill="none"
            stroke="url(#hda-left-glow)"
            strokeWidth="8.5"
            strokeLinecap="round"
            filter="url(#hda-endpoint-glow)"
            opacity="0.85"
          />
          <path
            d="M 30 300 A 270 270 0 0 1 68 170"
            fill="none"
            stroke="url(#hda-left-glow)"
            strokeWidth="3.4"
            strokeLinecap="round"
            style={{
              filter:
                "drop-shadow(0 0 4px #ffffff) drop-shadow(0 0 12px rgba(233, 213, 255, 0.95)) drop-shadow(0 0 25px rgba(168, 85, 247, 0.8))",
            }}
          />

          {/* 5. Right Endpoint Glow */}
          <path
            d="M 532 170 A 270 270 0 0 1 570 300"
            fill="none"
            stroke="url(#hda-right-glow)"
            strokeWidth="8.5"
            strokeLinecap="round"
            filter="url(#hda-endpoint-glow)"
            opacity="0.85"
          />
          <path
            d="M 532 170 A 270 270 0 0 1 570 300"
            fill="none"
            stroke="url(#hda-right-glow)"
            strokeWidth="3.4"
            strokeLinecap="round"
            style={{
              filter:
                "drop-shadow(0 0 4px #ffffff) drop-shadow(0 0 12px rgba(245, 208, 254, 0.95)) drop-shadow(0 0 25px rgba(192, 132, 252, 0.8))",
            }}
          />

          {/* 
            6. Sweeping Comet Flare:
            Rotates smoothly along the arc curve from Right to Left!
            transformOrigin is the center of the arc at (300px, 300px)
          */}
          <motion.g
            style={{
              transformOrigin: "300px 300px",
            }}
            animate={{
              rotate: [8, -26, 8],
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {/* Comet Flare Halo along the outer curve */}
            <path
              d="M 370 38 A 270 270 0 0 1 530 155"
              fill="none"
              stroke="url(#hda-comet-gradient)"
              strokeWidth="9.5"
              strokeLinecap="round"
              filter="url(#hda-comet-flare-filter)"
              opacity="0.95"
            />

            {/* Comet Core along the outer curve */}
            <path
              d="M 370 38 A 270 270 0 0 1 530 155"
              fill="none"
              stroke="url(#hda-comet-gradient)"
              strokeWidth="4"
              strokeLinecap="round"
              style={{
                filter:
                  "drop-shadow(0 0 6px #ffffff) drop-shadow(0 0 16px rgba(233, 213, 255, 0.98)) drop-shadow(0 0 36px rgba(168, 85, 247, 0.9))",
              }}
            />

            {/* Radiant Comet Head Sparkle */}
            <circle
              cx="480"
              cy="106"
              r="4.2"
              fill="#ffffff"
              style={{
                filter:
                  "drop-shadow(0 0 6px #ffffff) drop-shadow(0 0 18px rgba(243, 232, 255, 1)) drop-shadow(0 0 35px rgba(192, 132, 252, 0.95))",
              }}
            />
          </motion.g>
        </svg>
      </motion.div>
    </motion.div>
  );
};

export default HalfDonutArc;
