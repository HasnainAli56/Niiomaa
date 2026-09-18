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
    <div className="flex flex-col items-center justify-center text-center max-w-[540px] mx-auto px-4 z-10 gap-3.5 sm:gap-4 md:gap-5">
      {/* Main Headline: Slow, Dramatic Letter-by-Letter Animation */}
      <DramaticText
        text={`${content.hero.headline.line1}\n${content.hero.headline.line2}`}
        as="h1"
        whileInView={false}
        className="text-white font-semibold text-lg sm:text-2xl md:text-[28px] lg:text-[32px] leading-[1.15] tracking-tight select-none"
        delay={2.1}
        stagger={0.045}
        letterDuration={1.3}
      />

      {/* Action Button: Enter Website & Subheadline */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.92, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
        transition={{ duration: 1.6, delay: 3.8, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center gap-2.5"
      >
        <motion.button
          whileHover={{
            scale: 1.04,
            boxShadow:
              "0 0 22px rgba(168, 85, 247, 0.5), 0 0 12px rgba(147, 51, 234, 0.35)",
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

        {/* Subheadline / guarantee under button: Dramatic letter-by-letter reveal */}
        {content.hero.subheadline && (
          <DramaticText
            text={content.hero.subheadline}
            as="p"
            whileInView={false}
            className="text-[11px] sm:text-[12px] text-white/70 font-normal tracking-wide select-none max-w-[440px]"
            delay={4.2}
            stagger={0.025}
            letterDuration={1.1}
          />
        )}
      </motion.div>
    </div>
  );
};

export default HeroContent;
