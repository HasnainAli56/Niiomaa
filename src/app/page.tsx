"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { defaultLandingContent } from "@/content/landing-content";
import { BackgroundVideo } from "@/components/BackgroundVideo";
import { Navbar } from "@/components/Navbar";
import { NiiomaWordmark } from "@/components/NiiomaWordmark";
import { HeroContent } from "@/components/HeroContent";
import { HorizontalExperience } from "@/components/HorizontalExperience";
import { preloadEarthModel } from "@/components/EarthGlobe";

export default function Home() {
  const content = defaultLandingContent;
  const [isEntered, setIsEntered] = useState(false);
  const [initialSection, setInitialSection] = useState<string | number>(0);

  // Preload 3D Earth model immediately in the background
  useEffect(() => {
    preloadEarthModel().catch(() => {});
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("about") === "true" || window.location.hash.includes("about")) {
        const sec = params.get("section") || 0;
        setInitialSection(sec);
        setIsEntered(true);
      }
    }
  }, []);

  const handleEnterExperience = (section: string | number = 0) => {
    setInitialSection(section);
    setIsEntered(true);
  };

  return (
    <div className="relative w-full h-screen h-[100dvh] bg-[#000B1A] text-white selection:bg-[#702FA0] selection:text-white overflow-hidden select-none">
      <AnimatePresence mode="wait">
        {!isEntered ? (
          <motion.main
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full h-full overflow-hidden flex flex-col justify-center items-center"
          >
            {/* Top Navbar */}
            <Navbar
              content={content}
              isInsideExperience={false}
              onNavigateSection={handleEnterExperience}
            />

            {/* Background Video (faststart, 0.1s instant streaming) */}
            <BackgroundVideo />

            {/* Center Wordmark */}
            <div className="absolute left-1/2 top-[42%] sm:top-[43%] -translate-x-1/2 -translate-y-1/2 w-[min(84vw,1120px)] px-4 sm:px-6 z-20 pointer-events-none flex justify-center items-center">
              <NiiomaWordmark />
            </div>

            {/* Hero CTA Button & Subtitle */}
            <div className="absolute left-1/2 -translate-x-1/2 top-[calc(42%+44px)] sm:top-[calc(43%+50px)] md:top-[calc(43%+56px)] lg:top-[calc(43%+62px)] z-30 w-full max-w-[540px] px-4 flex justify-center">
              <HeroContent
                content={content}
                onEnter={() => handleEnterExperience(0)}
              />
            </div>
          </motion.main>
        ) : (
          <motion.div
            key="about"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full h-full overflow-hidden"
          >
            <HorizontalExperience
              initialSection={initialSection}
              onBackToLanding={() => {
                setInitialSection(0);
                setIsEntered(false);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
