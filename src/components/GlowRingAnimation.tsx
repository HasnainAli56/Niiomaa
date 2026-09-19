"use client";

import React from "react";
import "./glow-ring.css";

export const GlowRingAnimation: React.FC = () => {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none z-0 lp-hero-container">
      {/* 1. Deep Space Cosmic Radial Gradient */}
      <div className="absolute inset-0 w-full h-full lp-hero-bg" />

      {/* 2. Glow Ring & Rising Donut Arc */}
      <div aria-hidden="true" className="w-full h-full relative">
        {/* Outer Big Glow Ring */}
        <div className="lp-ring-wrap">
          <div className="lp-ring">
            <div className="lp-ring__halo" />
            <div className="lp-ring__fill" />
            <div className="lp-ring__rim">
              <svg
                className="lp-ring__svg"
                viewBox="0 0 1000 1000"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <filter id="lp-head-glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="6" result="blur1" />
                    <feGaussianBlur stdDeviation="16" result="blur2" />
                    <feMerge>
                      <feMergeNode in="blur2" />
                      <feMergeNode in="blur1" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>

                  {/* Linear gradient: low/zero opacity at bottom center (y=1000), expanding at navbar sides (y<=350) */}
                  <linearGradient id="lp-navbar-taper" x1="0" y1="1000" x2="0" y2="250" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
                    <stop offset="30%" stopColor="#ffffff" stopOpacity="0.05" />
                    <stop offset="55%" stopColor="#ffffff" stopOpacity="0.45" />
                    <stop offset="80%" stopColor="#ffffff" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#ffffff" stopOpacity="1" />
                  </linearGradient>
                </defs>

                {/* Base thin crisp white ring trail (left & right paths) */}
                <path
                  className="lp-ring__path lp-ring__path--left"
                  d="M 500 990 A 490 490 0 0 1 500 10"
                />
                <path
                  className="lp-ring__path lp-ring__path--right"
                  d="M 500 990 A 490 490 0 0 0 500 10"
                />

                {/* Tapered widening stroke: thin at bottom center, expanding in width & glow toward navbar */}
                <path
                  className="lp-ring__taper lp-ring__path--left"
                  d="M 500 990 A 490 490 0 0 1 500 10"
                  stroke="url(#lp-navbar-taper)"
                />
                <path
                  className="lp-ring__taper lp-ring__path--right"
                  d="M 500 990 A 490 490 0 0 0 500 10"
                  stroke="url(#lp-navbar-taper)"
                />

                {/* Luminous leading-edge heads (temporary extra brightness during reveal) */}
                <path
                  className="lp-ring__head lp-ring__head--left"
                  d="M 500 990 A 490 490 0 0 1 500 10"
                />
                <path
                  className="lp-ring__head lp-ring__head--right"
                  d="M 500 990 A 490 490 0 0 0 500 10"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Inner Half-Donut Object physically rising from DOWN -> UP */}
        <div className="lp-arc">
          <svg
            className="lp-donut__svg"
            viewBox="0 0 600 320"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Multi-layer glowing filters for endpoints and comet */}
              <filter id="lp-donut-glow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="3" result="blur1" />
                <feGaussianBlur stdDeviation="10" result="blur2" />
                <feMerge>
                  <feMergeNode in="blur2" />
                  <feMergeNode in="blur1" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              <filter id="lp-endpoint-glow" x="-60%" y="-60%" width="220%" height="220%">
                <feGaussianBlur stdDeviation="3" result="b1" />
                <feGaussianBlur stdDeviation="8" result="b2" />
                <feGaussianBlur stdDeviation="20" result="b3" />
                <feMerge>
                  <feMergeNode in="b3" />
                  <feMergeNode in="b2" />
                  <feMergeNode in="b1" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              <filter id="lp-comet-flare-filter" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="cb1" />
                <feGaussianBlur stdDeviation="10" result="cb2" />
                <feGaussianBlur stdDeviation="24" result="cb3" />
                <feMerge>
                  <feMergeNode in="cb3" />
                  <feMergeNode in="cb2" />
                  <feMergeNode in="cb1" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* Gradient fill for the translucent blue donut band */}
              <linearGradient id="lp-donut-band" x1="300" y1="40" x2="300" y2="300" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="rgba(40, 100, 255, 0.42)" />
                <stop offset="45%" stopColor="rgba(30, 60, 230, 0.22)" />
                <stop offset="80%" stopColor="rgba(20, 35, 180, 0.08)" />
                <stop offset="100%" stopColor="rgba(10, 20, 120, 0.0)" />
              </linearGradient>

              {/* Outer and Inner rim gradients that softly taper at the bottom endpoints */}
              <linearGradient id="lp-outer-rim-grad" x1="300" y1="40" x2="300" y2="300" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#a0c8ff" stopOpacity="0.95" />
                <stop offset="70%" stopColor="#6595ff" stopOpacity="0.85" />
                <stop offset="92%" stopColor="#3565ff" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#2045ff" stopOpacity="0.05" />
              </linearGradient>

              <linearGradient id="lp-inner-rim-grad" x1="300" y1="85" x2="300" y2="300" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#6595ff" stopOpacity="0.7" />
                <stop offset="70%" stopColor="#4070ff" stopOpacity="0.5" />
                <stop offset="92%" stopColor="#2040ff" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#1020ff" stopOpacity="0.0" />
              </linearGradient>

              {/* Left endpoint gradient: bright white along the curve, fading softly toward tip and top */}
              <linearGradient id="lp-left-glow" x1="40" y1="300" x2="75" y2="175" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
                <stop offset="20%" stopColor="#ffffff" stopOpacity="1" />
                <stop offset="45%" stopColor="#eeddff" stopOpacity="0.92" />
                <stop offset="75%" stopColor="#85a0ff" stopOpacity="0.55" />
                <stop offset="100%" stopColor="#3050ff" stopOpacity="0" />
              </linearGradient>

              {/* Right endpoint gradient: bright white along the curve, fading softly toward tip and top */}
              <linearGradient id="lp-right-glow" x1="560" y1="300" x2="525" y2="175" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
                <stop offset="20%" stopColor="#ffffff" stopOpacity="1" />
                <stop offset="45%" stopColor="#ffd8fa" stopOpacity="0.92" />
                <stop offset="75%" stopColor="#aa80ff" stopOpacity="0.55" />
                <stop offset="100%" stopColor="#3050ff" stopOpacity="0" />
              </linearGradient>

              {/* Upper-right comet gradient hugging the curve */}
              <linearGradient id="lp-comet-gradient" x1="370" y1="48" x2="520" y2="160" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#5080ff" stopOpacity="0" />
                <stop offset="25%" stopColor="#d5ccff" stopOpacity="0.75" />
                <stop offset="65%" stopColor="#ffffff" stopOpacity="1" />
                <stop offset="88%" stopColor="#eeddff" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#4570ff" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Donut band between outer radius 260 and inner radius 215 */}
            <path
              className="lp-donut__body"
              d="M 40 300 A 260 260 0 0 1 560 300 L 515 300 A 215 215 0 0 0 85 300 Z"
              fill="url(#lp-donut-band)"
            />

            {/* Outer electric-blue semicircular rim */}
            <path
              className="lp-donut__outer-rim"
              d="M 40 300 A 260 260 0 0 1 560 300"
              stroke="url(#lp-outer-rim-grad)"
            />

            {/* Inner concentric electric-blue rim */}
            <path
              className="lp-donut__inner-rim"
              d="M 85 300 A 215 215 0 0 1 515 300"
              stroke="url(#lp-inner-rim-grad)"
            />

            {/* Left Endpoint Glow: attached to the half-donut left tip, elongated along the curve */}
            <path
              className="lp-donut__side-halo lp-donut__side-halo--left"
              d="M 40 300 A 260 260 0 0 1 75 175"
              stroke="url(#lp-left-glow)"
            />
            <path
              className="lp-donut__side-core lp-donut__side-core--left"
              d="M 40 300 A 260 260 0 0 1 75 175"
              stroke="url(#lp-left-glow)"
            />

            {/* Right Endpoint Glow: attached to the half-donut right tip, elongated along the curve */}
            <path
              className="lp-donut__side-halo lp-donut__side-halo--right"
              d="M 525 175 A 260 260 0 0 1 560 300"
              stroke="url(#lp-right-glow)"
            />
            <path
              className="lp-donut__side-core lp-donut__side-core--right"
              d="M 525 175 A 260 260 0 0 1 560 300"
              stroke="url(#lp-right-glow)"
            />

            {/* Upper-right Comet Flare: hugging the upper-right arc curve */}
            <path
              className="lp-donut__comet-halo"
              d="M 370 48 A 260 260 0 0 1 520 160"
              stroke="url(#lp-comet-gradient)"
            />
            <path
              className="lp-donut__comet-core"
              d="M 370 48 A 260 260 0 0 1 520 160"
              stroke="url(#lp-comet-gradient)"
            />
            <circle
              className="lp-donut__comet-head"
              cx="472"
              cy="114"
              r="3"
              fill="#ffffff"
            />
          </svg>
        </div>
      </div>

      {/* 3. Film Grain Overlay */}
      <div className="lp-grain" aria-hidden="true" />
    </div>
  );
};

export default GlowRingAnimation;
