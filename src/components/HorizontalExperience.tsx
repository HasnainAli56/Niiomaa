"use client";

import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { MessageSquare, ExternalLink } from "lucide-react";
import { defaultLandingContent } from "@/content/landing-content";
import { Navbar } from "./Navbar";
import { EarthGlobe } from "./EarthGlobe";
import { DramaticText } from "./DramaticText";

interface HorizontalExperienceProps {
  onBackToLanding: () => void;
  initialSection?: string | number;
}

export const HorizontalExperience: React.FC<HorizontalExperienceProps> = ({
  onBackToLanding,
  initialSection = 0,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isLeaderHovered, setIsLeaderHovered] = useState(false);

  // Wheel listener on window: Vertical scroll action -> Horizontal scroll reaction
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      // If user scrolls vertically (mouse wheel up/down), react by scrolling horizontally
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        el.scrollLeft += e.deltaY * 1.5;
      }
    };

    const handleScroll = () => {
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (maxScroll > 0) {
        setScrollProgress(el.scrollLeft / maxScroll);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const sectionWidth = window.innerWidth;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        el.scrollBy({ left: sectionWidth * 0.85, behavior: "smooth" });
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        el.scrollBy({ left: -sectionWidth * 0.85, behavior: "smooth" });
      }
    };

    // Attach to window so wheel anywhere on the screen works seamlessly
    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("keydown", handleKeyDown);
    el.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
      el.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToSection = (target: string | number) => {
    const el = containerRef.current;
    if (!el) return;
    const sectionWidth = window.innerWidth;
    let index = 0;

    if (typeof target === "number") {
      index = target;
    } else {
      const lower = target.toLowerCase();
      if (lower.includes("overview")) index = 1;
      else if (lower.includes("vision")) index = 2;
      else if (lower.includes("mission")) index = 3;
      else if (lower.includes("leadership") || lower.includes("advisory")) index = 4;
      else if (lower.includes("culture") || lower.includes("principle")) index = 5;
      else if (lower.includes("ai") || lower.includes("good")) index = 6;
      else index = 0;
    }

    el.scrollTo({
      left: index * sectionWidth,
      behavior: "smooth",
    });
  };

  // Jump to initialSection if entered via a specific About navbar dropdown item
  useEffect(() => {
    if (initialSection !== undefined && initialSection !== 0 && containerRef.current) {
      setTimeout(() => {
        scrollToSection(initialSection);
      }, 70);
    }
  }, [initialSection]);

  return (
    <div className="relative w-full h-screen h-[100dvh] bg-[#000B1A] overflow-hidden select-none flex flex-col justify-between">
      {/* 1. Global Fixed Floating Navbar (Compact Black Glass with Back Button) */}
      <Navbar
        content={defaultLandingContent}
        isInsideExperience={true}
        onBackToLanding={onBackToLanding}
        onNavigateSection={scrollToSection}
      />

      {/* 2. Horizontal Scroll Container: Vertical Wheel Action -> Horizontal Reaction */}
      <div
        ref={containerRef}
        className="w-full h-screen overflow-x-auto overflow-y-hidden flex relative z-10"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {/* ============================================================ */}
        {/* Continuous Earth & Celestial Atmosphere Background           */}
        {/* Anchored on Screen 1 with seamless extension into Screen 2   */}
        {/* ============================================================ */}
        <div
          className="absolute top-0 left-0 w-[145vw] h-screen pointer-events-none z-0 overflow-hidden select-none"
        >
          {/* Celestial Cosmic Glow & Nebula Atmosphere behind Earth */}
          {/* Layer 1: Subtle Pale Blue Rayleigh Atmospheric Core behind Earth's Horizon (#7DB7FF) */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle 750px at 74vw 48%, rgba(125, 183, 255, 0.16) 0%, rgba(45, 95, 195, 0.18) 25%, rgba(10, 30, 85, 0.14) 50%, transparent 75%)",
            }}
          />
          {/* Layer 2: Expansive Deep Space Midnight Sapphire Aura */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 1100px 900px at 77vw 52%, rgba(18, 48, 120, 0.25) 0%, rgba(8, 24, 75, 0.18) 38%, rgba(2, 10, 40, 0.10) 65%, transparent 88%)",
            }}
          />
          {/* Layer 3: Upper Sunlit Ambient Scattering */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle 650px at 72vw 32%, rgba(125, 183, 255, 0.10) 0%, rgba(20, 60, 140, 0.12) 35%, transparent 68%)",
            }}
          />
          {/* Layer 4: Deep Interstellar Midnight Blue Underglow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 1300px 1000px at 80vw 65%, rgba(6, 22, 65, 0.24) 0%, rgba(2, 9, 32, 0.15) 55%, transparent 90%)",
            }}
          />
          {/* Layer 5: Horizon Soft Ambient Scattering */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 700px 480px at 68vw 53%, rgba(125, 183, 255, 0.08) 0%, rgba(15, 45, 110, 0.10) 35%, transparent 65%)",
            }}
          />

          {/* 3D Infinite Revolving Earth Globe spanning Screen 1 & seamlessly into Screen 2 */}
          <div className="absolute inset-0 w-full h-full pointer-events-auto z-0">
            <EarthGlobe
              className="w-full h-full"
              autoRotateSpeed={0.0018}
            />
          </div>

          {/* Subtle edge blends for seamless immersion */}
          <div className="absolute top-0 bottom-0 left-0 w-[42vw] bg-gradient-to-r from-[#000814]/95 via-[#000814]/65 to-transparent pointer-events-none z-10" />
          <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-[#000814]/85 via-[#000814]/40 to-transparent pointer-events-none z-10" />
        </div>

        {/* ============================================================ */}
        {/* SCREEN 1: Earth Globe & Hero Section                         */}
        {/* ============================================================ */}
        <section className="w-screen h-screen flex-shrink-0 relative flex flex-col justify-center px-8 sm:px-14 lg:px-20 z-10 pointer-events-none">
          {/* Content Middle Left with Dramatic Letter-by-Letter Animation */}
          <div className="relative z-20 max-w-[560px] my-auto pl-2 sm:pl-6 lg:pl-10 pointer-events-auto">
            <DramaticText
              text={"The trusted network\nfor technology vendors\nand enterprises"}
              as="h1"
              whileInView={true}
              delay={0.2}
              stagger={0.045}
              letterDuration={1.25}
              className="text-2xl sm:text-3xl lg:text-[42px] font-bold leading-[1.12] tracking-tight text-white drop-shadow-[0_4px_30px_rgba(0,0,0,0.6)]"
            />
          </div>
        </section>

        {/* ============================================================ */}
        {/* SCREEN 2: About · Overview                                    */}
        {/* ============================================================ */}
        <section className="w-screen h-screen flex-shrink-0 relative flex flex-col justify-center px-8 sm:px-14 lg:px-20 z-10 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, y: 35, filter: "blur(12px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-[760px] flex flex-col gap-5 pointer-events-auto relative z-20"
          >
            <p className="text-[12px] font-semibold text-[#6e72ee] tracking-widest uppercase drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]">
              Overview
            </p>
            <DramaticText
              text="NIIOMA is the new operating system for global business"
              as="h2"
              whileInView={true}
              delay={0.2}
              stagger={0.035}
              letterDuration={1.15}
              className="text-2xl sm:text-3xl lg:text-[44px] font-bold text-white leading-[1.08] tracking-tight drop-shadow-[0_4px_30px_rgba(0,0,0,0.7)]"
            />
            <div className="text-[#a9a3c4] text-sm sm:text-[15px] leading-relaxed flex flex-col gap-3.5 mt-1 drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]">
              <p>
                Our name comes from Neoma, ‘new moon’, Latin in origin, a symbol
                of fresh beginnings. The world is moving from the digital
                economy into the Cognitive Economy, reshaping how people and
                businesses connect.
              </p>
              <p>
                We are building the foundation of that shift: an AI-orchestrated
                ecosystem where enterprises and vendors connect seamlessly, and
                human and artificial intelligence drive growth, innovation and
                impact.
              </p>
            </div>
          </motion.div>
        </section>

        {/* ============================================================ */}
        {/* SCREEN 3: About · Vision                                      */}
        {/* ============================================================ */}
        <section className="w-screen h-screen flex-shrink-0 relative flex flex-col justify-center px-8 sm:px-14 lg:px-20 overflow-hidden">
          <motion.div
            initial={{ opacity: 0, y: 35, filter: "blur(12px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-[820px] flex flex-col gap-5"
          >
            <p className="text-[12px] font-semibold text-[#6e72ee] tracking-widest uppercase">
              Vision
            </p>
            <DramaticText
              text={
                "A world where AI connects enterprises and vendors seamlessly,\nopportunity opens at scale, and more people share in it"
              }
              as="h2"
              whileInView={true}
              delay={0.2}
              stagger={0.028}
              letterDuration={1.15}
              className="text-2xl sm:text-3xl lg:text-[44px] font-bold text-white leading-[1.1] tracking-tight"
            />
          </motion.div>
        </section>

        {/* ============================================================ */}
        {/* SCREEN 4: About · Mission                                     */}
        {/* ============================================================ */}
        <section className="w-screen h-screen flex-shrink-0 relative flex flex-col justify-center px-8 sm:px-14 lg:px-20 overflow-hidden">
          <motion.div
            initial={{ opacity: 0, y: 35, filter: "blur(12px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-[820px] flex flex-col gap-5"
          >
            <p className="text-[12px] font-semibold text-[#6e72ee] tracking-widest uppercase">
              Mission
            </p>
            <DramaticText
              text={
                "To build the trusted network where enterprises, vendors and\npeople find each other seamlessly"
              }
              as="h2"
              whileInView={true}
              delay={0.2}
              stagger={0.03}
              letterDuration={1.15}
              className="text-2xl sm:text-3xl lg:text-[44px] font-bold text-white leading-[1.1] tracking-tight"
            />
          </motion.div>
        </section>

        {/* ============================================================ */}
        {/* SCREEN 5: About · Leadership (Azam Beyk Profile Card)        */}
        {/* ============================================================ */}
        <section className="w-screen h-screen flex-shrink-0 relative flex flex-col justify-center px-8 sm:px-14 lg:px-20 overflow-hidden">
          <div className="w-full max-w-[1200px] flex flex-col lg:flex-row items-center justify-between gap-10">
            {/* Text details */}
            <motion.div
              initial={{ opacity: 0, y: 35, filter: "blur(12px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-[560px] flex flex-col gap-5"
            >
              <p className="text-[12px] font-semibold text-[#6e72ee] tracking-widest uppercase">
                Leadership
              </p>
              <DramaticText
                text="The people behind NIIOMA"
                as="h2"
                whileInView={true}
                delay={0.2}
                stagger={0.045}
                letterDuration={1.2}
                className="text-2xl sm:text-3xl lg:text-[44px] font-bold text-white leading-[1.08] tracking-tight"
              />
              <p className="text-[#a9a3c4] text-sm sm:text-[15px] leading-relaxed">
                Profiles are being finalised. The leadership team brings more
                than 200 years of combined executive experience across enterprise
                sales, procurement and transformation.
              </p>
            </motion.div>

            {/* Azam Beyk Interactive Profile Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, filter: "blur(10px)" }}
              whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 1.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              onMouseEnter={() => setIsLeaderHovered(true)}
              onMouseLeave={() => setIsLeaderHovered(false)}
              className="relative w-[275px] h-[368px] rounded-[14px] border border-white/[0.15] overflow-hidden cursor-pointer transition-all duration-300 group shadow-2xl shadow-black/80"
              style={{
                background: "rgba(6, 9, 18, 0.65)",
                backdropFilter: "blur(20px)",
              }}
            >
              {/* Photo */}
              <div className="absolute inset-0 z-0 transition-transform duration-500 group-hover:scale-105">
                <Image
                  src="/azam_beyk.png"
                  alt="Azam Beyk"
                  fill
                  className="object-cover object-top"
                />
              </div>

              {/* Bottom Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#000B1A] via-[#000B1A]/60 to-transparent z-10 pointer-events-none" />

              {/* Social Icon */}
              <div className="absolute top-3.5 right-3.5 z-20 w-7 h-7 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white border border-white/15 hover:bg-purple-600 transition">
                <ExternalLink className="w-3.5 h-3.5" />
              </div>

              {/* Normal State Info */}
              <div
                className={`absolute bottom-0 left-0 right-0 p-5 z-20 transition-all duration-300 ${
                  isLeaderHovered
                    ? "opacity-0 translate-y-3"
                    : "opacity-100 translate-y-0"
                }`}
              >
                <h3 className="text-xl font-semibold text-white">Azam Beyk</h3>
                <p className="text-xs text-white/70 mt-0.5">
                  Founder and Vision Steward
                </p>
              </div>

              {/* Hover State Detailed Bio */}
              <div
                className={`absolute inset-0 p-5 z-30 bg-[#000B1A]/95 backdrop-blur-md flex flex-col justify-between transition-all duration-300 ${
                  isLeaderHovered
                    ? "opacity-100 pointer-events-auto"
                    : "opacity-0 pointer-events-none"
                }`}
              >
                <div>
                  <h3 className="text-lg font-bold text-white">Azam Beyk</h3>
                  <p className="text-xs text-purple-400 mt-0.5">
                    Founder and Vision Steward
                  </p>
                  <p className="text-[11.5px] text-[#a9a3c4] leading-relaxed mt-3">
                    Built AI and enterprise systems at Vodafone, Comarch and
                    Gartner, serving tens of millions of users. Founded NIIOMA to
                    close the gap between enterprises and the vendors they cannot
                    find. Leads the company and sets product direction.
                  </p>
                </div>
                <div className="text-[10.5px] text-white/50 border-t border-white/10 pt-2.5">
                  Executive Leader · 20+ Years Experience
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* SCREEN 6: About · Culture                                     */}
        {/* ============================================================ */}
        <section className="w-screen h-screen flex-shrink-0 relative flex flex-col justify-center px-8 sm:px-14 lg:px-20 overflow-hidden">
          <motion.div
            initial={{ opacity: 0, y: 35, filter: "blur(12px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-[760px] flex flex-col gap-5"
          >
            <p className="text-[12px] font-semibold text-[#6e72ee] tracking-widest uppercase">
              Culture
            </p>
            <DramaticText
              text={"Good hearts. Bright minds.\nGreat attitude."}
              as="h2"
              whileInView={true}
              delay={0.2}
              stagger={0.04}
              letterDuration={1.2}
              className="text-2xl sm:text-3xl lg:text-[44px] font-bold text-white leading-[1.08] tracking-tight"
            />
            <p className="text-base sm:text-lg font-medium text-white/90 mt-1">
              People who care. People who can. People who own it.
            </p>
            <p className="text-[#a9a3c4] text-sm sm:text-[15px] leading-relaxed max-w-[720px]">
              We are working towards a fresh beginning, for how businesses
              engage and for the people behind them. We want opportunity to open
              up at scale, and to open up to more people. So we built an
              operating model around it. We are flat and mission-driven, with
              full autonomy and a shared sense of leadership. We work focused
              hours, four days and six hours, and give the rest back to AI for
              good.
            </p>
          </motion.div>
        </section>

        {/* ============================================================ */}
        {/* SCREEN 7: About · AI for Good                                 */}
        {/* ============================================================ */}
        <section className="w-screen h-screen flex-shrink-0 relative flex flex-col justify-center px-8 sm:px-14 lg:px-20 overflow-hidden">
          <div className="w-full max-w-[1200px] flex flex-col lg:flex-row items-center justify-between gap-12">
            {/* Left Stat Box */}
            <motion.div
              initial={{ opacity: 0, y: 35, filter: "blur(12px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-[580px] flex flex-col gap-5"
            >
              <p className="text-[12px] font-semibold text-[#6e72ee] tracking-widest uppercase">
                AI for Good
              </p>
              <DramaticText
                text={"Technology only matters\nwhen it uplifts people"}
                as="h2"
                whileInView={true}
                delay={0.2}
                stagger={0.04}
                letterDuration={1.2}
                className="text-2xl sm:text-3xl lg:text-[44px] font-bold text-white leading-[1.08] tracking-tight"
              />

              <div className="flex items-center gap-6 pt-3">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 1.6,
                    delay: 0.2,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="text-5xl sm:text-6xl lg:text-[72px] font-bold text-white tracking-tight"
                >
                  5%
                </motion.div>
                <p className="text-[#a9a3c4] text-xs sm:text-sm leading-relaxed max-w-[340px]">
                  of revenue goes to work that applies AI to social and
                  environmental challenges, in partnership with organisations
                  doing this work on the ground.
                </p>
              </div>
            </motion.div>

            {/* Right Pillars List */}
            <motion.div
              initial={{ opacity: 0, y: 35, filter: "blur(12px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 1.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-[420px] flex flex-col gap-5"
            >
              <div className="border-t border-white/20 pt-5">
                <h3 className="text-xl sm:text-2xl font-medium text-white/80 hover:text-white transition">
                  AI for children
                </h3>
              </div>
              <div className="border-t border-white/20 pt-5">
                <h3 className="text-xl sm:text-2xl font-medium text-white/80 hover:text-white transition">
                  AI for poverty alleviation
                </h3>
              </div>
              <div className="border-t border-white/20 pt-5 border-b pb-5">
                <h3 className="text-xl sm:text-2xl font-medium text-white/80 hover:text-white transition">
                  AI for food security
                </h3>
              </div>
            </motion.div>
          </div>
        </section>
      </div>

      {/* 3. Global Fixed Bottom Footer (Frosted Blur with Live Horizontal Progress) */}
      <footer
        className="fixed bottom-0 left-0 right-0 z-40 h-[48px] sm:h-[52px] px-6 sm:px-10 lg:px-14 flex items-center justify-between transition-all select-none"
        style={{
          background: "rgba(5, 9, 24, 0.22)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderTop: "1px solid rgba(255, 255, 255, 0.12)",
          boxShadow: "0 -4px 25px rgba(0, 0, 0, 0.15)",
        }}
      >
        {/* Left: Copyright & Legal */}
        <div className="text-[11px] sm:text-[11.5px] text-white/60 hover:text-white/90 font-light tracking-wide transition cursor-pointer select-none drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]">
          © 2026 NIIOMA Ltd. Legal and contact
        </div>

        {/* Center Note: Tagline + Purple Dot + Capsule Progress */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2.5 select-none pointer-events-none drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]">
          <span className="text-[11px] sm:text-[11.5px] text-white/70 font-light tracking-wide whitespace-nowrap">
            The new operating system for global business
          </span>
          <div className="hidden sm:flex items-center gap-1.5 pl-1">
            {/* Glowing purple dot */}
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_8px_#c084fc]" />
            {/* Capsule track */}
            <div className="w-14 sm:w-16 h-[2.5px] bg-white/15 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-400 to-blue-400 rounded-full transition-all duration-300"
                style={{ width: `${Math.max(12, scrollProgress * 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right: Chat with NIIOMA Button */}
        <button
          type="button"
          className="flex items-center gap-1.5 h-[30px] sm:h-[32px] px-3.5 sm:px-4 rounded-full text-[11.5px] sm:text-[12px] font-medium text-white transition-all select-none cursor-pointer"
          style={{
            background: "rgba(43, 22, 82, 0.82)",
            border: "1px solid rgba(168, 85, 247, 0.35)",
            boxShadow: "0 0 14px rgba(147, 51, 234, 0.2)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(63, 31, 118, 0.92)";
            e.currentTarget.style.boxShadow = "0 0 20px rgba(168, 85, 247, 0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(43, 22, 82, 0.82)";
            e.currentTarget.style.boxShadow = "0 0 14px rgba(147, 51, 234, 0.2)";
          }}
        >
          <MessageSquare className="w-3 h-3 text-purple-200" />
          <span>Chat with NIIOMA</span>
        </button>
      </footer>
    </div>
  );
};

export const AboutExperience = HorizontalExperience;
export default HorizontalExperience;
