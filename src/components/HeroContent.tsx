"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { LandingContent } from "@/content/landing-content";
import { DramaticText } from "./DramaticText";

interface HeroContentProps {
  content: LandingContent;
  onEnter?: () => void;
}

export const HeroContent: React.FC<HeroContentProps> = ({ content, onEnter }) => {
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    setClicked(true);
    if (onEnter) {
      setTimeout(() => {
        onEnter();
        setClicked(false);
      }, 400);
    } else {
      setTimeout(() => setClicked(false), 1500);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-center max-w-[640px] mx-auto px-4 z-10 gap-5 sm:gap-6 md:gap-7">
      {/* Main Headline: Slow, Dramatic Letter-by-Letter Animation */}
      <DramaticText
        text={`${content.hero.headline.line1}\n${content.hero.headline.line2}`}
        as="h1"
        whileInView={false}
        className="text-white font-semibold text-2xl sm:text-3xl md:text-[36px] lg:text-[40px] leading-[1.15] sm:leading-[1.1] md:leading-[105%] tracking-tight select-none"
        delay={2.1}
        stagger={0.045}
        letterDuration={1.3}
      />

      {/* Action Button: Enter Website & Subheadline */}
      <motion.div
        initial={{ opacity: 0, y: 26, scale: 0.9, filter: "blur(12px)" }}
        animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
        transition={{ duration: 1.6, delay: 3.8, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center gap-3.5"
      >
        <motion.button
          whileHover={{
            scale: 1.05,
            boxShadow:
              "0 0 35px rgba(255, 255, 255, 0.5), 0 0 25px rgba(112, 47, 160, 0.6)",
          }}
          whileTap={{ scale: 0.96 }}
          onClick={handleClick}
          className="relative group flex items-center justify-center h-[46px] sm:h-[48px] px-8 sm:px-9 rounded-[48px] text-sm sm:text-base font-semibold text-[#0a0518] bg-white hover:bg-white/95 transition-all duration-300 select-none overflow-hidden shadow-[0_0_24px_rgba(255,255,255,0.35)] cursor-pointer"
        >
          {/* Subtle sheen highlight */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/[0.04] to-white/40 pointer-events-none" />

          <span className="relative z-10 font-semibold tracking-tight">
            {clicked ? "Loading..." : content.hero.ctaButton.label}
          </span>
        </motion.button>

        {/* Subheadline / guarantee under button: Dramatic letter-by-letter reveal */}
        {content.hero.subheadline && (
          <DramaticText
            text={content.hero.subheadline}
            as="p"
            whileInView={false}
            className="text-xs sm:text-sm text-white/70 font-normal tracking-wide select-none max-w-[500px]"
            delay={4.2}
            stagger={0.025}
            letterDuration={1.1}
          />
        )}
      </motion.div>
    </div>
  );
};
