"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { defaultLandingContent } from "@/content/landing-content";
import { HeroArc } from "@/components/HeroArc";
import { Navbar } from "@/components/Navbar";
import { NiiomaWordmark } from "@/components/NiiomaWordmark";
import { HeroContent } from "@/components/HeroContent";
import { HorizontalExperience } from "@/components/HorizontalExperience";
import { preloadEarthModel } from "@/components/EarthGlobe";

export default function Home() {
  const content = defaultLandingContent;
  const [isEntered, setIsEntered] = useState(false);

  // Preload 3D Earth model in the background immediately
  useEffect(() => {
    preloadEarthModel().catch(() => {});
  }, []);

  return (
    <AnimatePresence mode="wait">
      {!isEntered ? (
        <motion.main
          key="landing"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full h-screen h-[100dvh] bg-[#000B1A] overflow-hidden select-none"
        >
          {/* 1. Background Arc (Locked and sticky, never zooms out of place) */}
          <HeroArc />

          {/* 2. Top Navigation Bar (Translucent purple pill shape with glassmorphism) */}
          <Navbar content={content} />

          {/* 3. Center Branding: Large 'NIIOMA' Text (Locked right on the sticky arc) */}
          <div className="fixed left-1/2 top-[46%] sm:top-[47%] -translate-x-1/2 -translate-y-1/2 w-[min(92vw,1440px)] px-4 sm:px-6 z-20 pointer-events-none flex justify-center items-center">
            <NiiomaWordmark />
          </div>

          {/* 4. Hero Content: Subtitle & CTA Button */}
          <div className="fixed left-1/2 -translate-x-1/2 top-[calc(46%+55px)] sm:top-[calc(47%+65px)] md:top-[calc(47%+75px)] z-30 w-full max-w-[660px] px-4 flex justify-center">
            <HeroContent
              content={content}
              onEnter={() => setIsEntered(true)}
            />
          </div>
        </motion.main>
      ) : (
        <motion.div
          key="horizontal-experience"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full h-screen overflow-hidden"
        >
          <HorizontalExperience onBackToLanding={() => setIsEntered(false)} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
