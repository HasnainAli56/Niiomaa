"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { LandingContent } from "@/content/landing-content";

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
    <div className="flex flex-col items-center justify-center text-center max-w-[580px] mx-auto px-4 z-10 gap-4 sm:gap-4 md:gap-5">
      {/* 1. Sub-headline: Smooth Slide-up & Fade-in right as NIIOMA letters finish assembling */}
      <motion.h1
        initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{
          duration: 1.3,
          delay: 4.1,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="text-white font-semibold text-lg sm:text-2xl md:text-[28px] lg:text-[32px] leading-[1.22] tracking-tight select-none m-0 will-change-transform"
      >
        <span>{content.hero.headline.line1}</span>{" "}
        <span className="inline sm:block">{content.hero.headline.line2}</span>
      </motion.h1>

      {/* 2. Action Button ('Enter website'): Follows with fluid delay, sliding up from below */}
      <div className="flex flex-col items-center gap-2.5 w-full">
        <motion.div
          initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{
            duration: 1.2,
            delay: 4.5,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="will-change-transform"
        >
          <motion.button
            whileHover={{
              scale: 1.04,
              boxShadow:
                "0 0 24px rgba(168, 85, 247, 0.55), 0 0 12px rgba(147, 51, 234, 0.4)",
            }}
            whileTap={{ scale: 0.96 }}
            onClick={handleClick}
            className="relative group flex items-center justify-center h-[36px] sm:h-[38px] px-6 sm:px-7 rounded-full text-xs sm:text-[13px] font-medium text-white transition-all duration-300 select-none overflow-hidden cursor-pointer"
            style={{
              background: "linear-gradient(135deg, #4c248c 0%, #3b1c6e 100%)",
              border: "1px solid rgba(168, 85, 247, 0.4)",
              boxShadow:
                "0 0 16px rgba(147, 51, 234, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.15)",
            }}
          >
            {/* Subtle glossy sheen highlight */}
            <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/[0.04] to-white/[0.12] pointer-events-none group-hover:opacity-100 opacity-60 transition-opacity" />

            <span className="relative z-10 font-medium tracking-tight">
              {clicked ? "Loading..." : content.hero.ctaButton.label}
            </span>
          </motion.button>
        </motion.div>

        {/* 3. Supporting Text: Fluid sequential entrance, sliding up right after the button */}
        {content.hero.subheadline && (
          <motion.p
            initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{
              duration: 1.2,
              delay: 4.85,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="text-[11px] sm:text-[12px] text-white/70 font-normal tracking-wide select-none max-w-[480px] m-0 will-change-transform"
          >
            {content.hero.subheadline}
          </motion.p>
        )}
      </div>
    </div>
  );
};

export default HeroContent;
