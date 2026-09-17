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
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center justify-center text-center max-w-[640px] mx-auto px-4 z-10 gap-5 sm:gap-6 md:gap-7"
    >
      {/* Main Headline */}
      <h1 className="text-white font-semibold text-2xl sm:text-3xl md:text-[38px] lg:text-[42px] leading-[1.15] sm:leading-[1.1] md:leading-[105%] tracking-tight select-none">
        <span className="block">{content.hero.headline.line1}</span>
        <span className="block mt-1">{content.hero.headline.line2}</span>
      </h1>

      {/* Action Button: Enter Website */}
      <motion.button
        whileHover={{
          scale: 1.05,
          boxShadow: "0 0 25px rgba(112, 47, 160, 0.6)",
        }}
        whileTap={{ scale: 0.96 }}
        onClick={handleClick}
        className="relative group flex items-center justify-center h-[44px] sm:h-[46px] px-6 sm:px-7 rounded-[45px] text-sm sm:text-base font-semibold text-white transition-all duration-300 select-none overflow-hidden"
        style={{
          background: "#702FA0",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(2px)",
          WebkitBackdropFilter: "blur(2px)",
        }}
      >
        {/* Subtle button surface sheen */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-white/10 pointer-events-none" />

        {/* Dynamic button pulse on hover */}
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full blur-md opacity-0 group-hover:opacity-35 transition-opacity duration-300 pointer-events-none" />

        <span className="relative z-10">
          {clicked ? "Loading..." : content.hero.ctaButton.label}
        </span>
      </motion.button>
    </motion.div>
  );
};
