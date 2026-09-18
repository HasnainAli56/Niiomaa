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
  initialSection?: number;
}

export const HorizontalExperience: React.FC<HorizontalExperienceProps> = ({
  onBackToLanding,
  initialSection = 0,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isLeaderHovered, setIsLeaderHovered] = useState(false);

  // Wheel listener: Map vertical scroll to horizontal scroll
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
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

    el.addEventListener("wheel", handleWheel, { passive: false });
    el.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      el.removeEventListener("wheel", handleWheel);
      el.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Jump to initialSection if requested from Landing Page navbar
  useEffect(() => {
    if (initialSection !== undefined && initialSection > 0 && containerRef.current) {
      const sectionWidth = window.innerWidth;
      setTimeout(() => {
        if (containerRef.current) {
          containerRef.current.scrollTo({
            left: initialSection * sectionWidth,
            behavior: "smooth",
          });
        }
      }, 60);
    }
  }, [initialSection]);

  const scrollToSection = (index: number) => {
    const el = containerRef.current;
    if (!el) return;
    const sectionWidth = window.innerWidth;
    el.scrollTo({
      left: index * sectionWidth,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative w-full h-screen bg-[#000B1A] overflow-hidden select-none flex flex-col justify-between">
      {/* 1. Global Fixed Floating Navbar (Black Glass, matching Landing Page) */}
      <Navbar
        content={defaultLandingContent}
        isInsideExperience={true}
        onBackToLanding={onBackToLanding}
        onNavigateSection={scrollToSection}
      />

      {/* 2. Main Horizontal Scroll Container */}
      <div
        ref={containerRef}
        className="w-full h-screen overflow-x-auto overflow-y-hidden flex scroll-smooth snap-x snap-mandatory relative z-10"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {/* ============================================================ */}
        {/* SCREEN 1: Home / Discover (with Zoomed 3D Earth Globe)        */}
        {/* ============================================================ */}
        <section className="w-screen h-screen flex-shrink-0 relative snap-start flex flex-col justify-center px-8 sm:px-16 lg:px-24 pt-24 pb-20 overflow-hidden">
          {/* Celestial Cosmic Glow & Nebula Atmosphere behind Earth */}
          {/* Layer 1: Radiant Electric Cyan Core behind Earth's Horizon */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at 65% 50%, rgba(0, 205, 255, 0.62) 0%, rgba(14, 116, 245, 0.48) 26%, rgba(10, 50, 190, 0.28) 48%, transparent 72%)",
            }}
          />
          {/* Layer 2: Expansive Sapphire/Royal Blue Celestial Aura */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 80% 70% at 70% 52%, rgba(25, 105, 255, 0.58) 0%, rgba(14, 60, 210, 0.42) 34%, rgba(5, 25, 110, 0.28) 60%, transparent 88%)",
            }}
          />
          {/* Layer 3: Upper Sky Illumination above the Planet */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at 62% 32%, rgba(30, 144, 255, 0.38) 0%, rgba(10, 50, 160, 0.22) 38%, transparent 68%)",
            }}
          />
          {/* Layer 4: Deep Interstellar Blue Underglow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 95% 85% at 75% 65%, rgba(15, 65, 185, 0.48) 0%, rgba(2, 15, 60, 0.32) 55%, transparent 90%)",
            }}
          />
          {/* Layer 5: Soft Horizon Rim Back-Glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 55% 40% at 52% 54%, rgba(56, 189, 248, 0.32) 0%, rgba(29, 78, 216, 0.16) 35%, transparent 65%)",
            }}
          />

          {/* 3D Infinite Revolving Earth Globe (earth.glb) */}
          <div className="absolute inset-0 w-full h-full pointer-events-auto z-0 overflow-hidden">
            <EarthGlobe className="w-full h-full" autoRotateSpeed={0.0018} />
          </div>

          {/* Subtle soft edge blends for seamless immersion */}
          <div className="absolute top-0 bottom-0 left-0 w-[42vw] bg-gradient-to-r from-[#000814]/95 via-[#000814]/70 to-transparent pointer-events-none z-10" />
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#000814]/85 via-[#000814]/40 to-transparent pointer-events-none z-10" />

          {/* Content Middle Left with Dramatic Letter-by-Letter Animation */}
          <div className="relative z-20 max-w-[720px] my-auto pl-2 sm:pl-6 lg:pl-10">
            <DramaticText
              text={"The trusted network\nfor technology vendors\nand enterprises"}
              as="h1"
              whileInView={true}
              delay={0.25}
              stagger={0.045}
              letterDuration={1.25}
              className="text-4xl sm:text-5xl lg:text-[62px] font-bold leading-[1.08] tracking-tight text-white drop-shadow-[0_4px_30px_rgba(0,0,0,0.6)]"
            />
          </div>
        </section>

        {/* ============================================================ */}
        {/* SCREEN 2: About · Overview                                    */}
        {/* ============================================================ */}
        <section className="w-screen h-screen flex-shrink-0 relative snap-start flex flex-col justify-center px-8 sm:px-16 lg:px-24 overflow-hidden">
          <motion.div
            initial={{ opacity: 0, y: 40, filter: "blur(14px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-[920px] flex flex-col gap-6"
          >
            <p className="text-[14px] font-semibold text-[#6e72ee] tracking-widest uppercase">
              Overview
            </p>
            <DramaticText
              text="NIIOMA is the new operating system for global business"
              as="h2"
              whileInView={true}
              delay={0.2}
              stagger={0.035}
              letterDuration={1.15}
              className="text-4xl sm:text-5xl lg:text-[64px] font-bold text-white leading-[1.05] tracking-tight"
            />
            <div className="text-[#a9a3c4] text-base sm:text-lg leading-relaxed flex flex-col gap-4 mt-2">
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
        <section className="w-screen h-screen flex-shrink-0 relative snap-start flex flex-col justify-center px-8 sm:px-16 lg:px-24 overflow-hidden">
          <motion.div
            initial={{ opacity: 0, y: 40, filter: "blur(14px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-[960px] flex flex-col gap-6"
          >
            <p className="text-[14px] font-semibold text-[#6e72ee] tracking-widest uppercase">
              Vision
            </p>
            <DramaticText
              text={"A world where AI connects enterprises and vendors seamlessly,\nopportunity opens at scale, and more people share in it"}
              as="h2"
              whileInView={true}
              delay={0.2}
              stagger={0.028}
              letterDuration={1.15}
              className="text-4xl sm:text-5xl lg:text-[64px] font-bold text-white leading-[1.05] tracking-tight"
            />
          </motion.div>
        </section>

        {/* ============================================================ */}
        {/* SCREEN 4: About · Mission                                     */}
        {/* ============================================================ */}
        <section className="w-screen h-screen flex-shrink-0 relative snap-start flex flex-col justify-center px-8 sm:px-16 lg:px-24 overflow-hidden">
          <motion.div
            initial={{ opacity: 0, y: 40, filter: "blur(14px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-[960px] flex flex-col gap-6"
          >
            <p className="text-[14px] font-semibold text-[#6e72ee] tracking-widest uppercase">
              Mission
            </p>
            <DramaticText
              text={"To build the trusted network where enterprises, vendors and\npeople find each other seamlessly"}
              as="h2"
              whileInView={true}
              delay={0.2}
              stagger={0.03}
              letterDuration={1.15}
              className="text-4xl sm:text-5xl lg:text-[64px] font-bold text-white leading-[1.05] tracking-tight"
            />
          </motion.div>
        </section>

        {/* ============================================================ */}
        {/* SCREEN 5: About · Leadership (with Azam Beyk Profile Card)   */}
        {/* ============================================================ */}
        <section className="w-screen h-screen flex-shrink-0 relative snap-start flex flex-col justify-center px-8 sm:px-16 lg:px-24 overflow-hidden">
          <div className="w-full max-w-[1400px] flex flex-col lg:flex-row items-center justify-between gap-12">
            {/* Text details */}
            <motion.div
              initial={{ opacity: 0, y: 40, filter: "blur(14px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-[700px] flex flex-col gap-6"
            >
              <p className="text-[14px] font-semibold text-[#6e72ee] tracking-widest uppercase">
                Leadership
              </p>
              <DramaticText
                text="The people behind NIIOMA"
                as="h2"
                whileInView={true}
                delay={0.2}
                stagger={0.045}
                letterDuration={1.2}
                className="text-4xl sm:text-5xl lg:text-[64px] font-bold text-white leading-[1.05] tracking-tight"
              />
              <p className="text-[#a9a3c4] text-base sm:text-lg leading-relaxed">
                Profiles are being finalised. The leadership team brings more
                than 200 years of combined executive experience across enterprise
                sales, procurement and transformation.
              </p>
            </motion.div>

            {/* Azam Beyk Interactive Profile Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, filter: "blur(12px)" }}
              whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 1.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              onMouseEnter={() => setIsLeaderHovered(true)}
              onMouseLeave={() => setIsLeaderHovered(false)}
              className="relative w-[341px] h-[455px] rounded-[16px] border border-white/[0.15] overflow-hidden cursor-pointer transition-all duration-300 group shadow-2xl shadow-black/80"
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
              <div className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white border border-white/15 hover:bg-purple-600 transition">
                <ExternalLink className="w-4 h-4" />
              </div>

              {/* Normal State Info */}
              <div
                className={`absolute bottom-0 left-0 right-0 p-6 z-20 transition-all duration-300 ${
                  isLeaderHovered ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
                }`}
              >
                <h3 className="text-2xl font-semibold text-white">
                  Azam Beyk
                </h3>
                <p className="text-sm text-white/70 mt-1">
                  Founder and Vision Steward
                </p>
              </div>

              {/* Hover State Detailed Bio */}
              <div
                className={`absolute inset-0 p-6 z-30 bg-[#000B1A]/95 backdrop-blur-md flex flex-col justify-between transition-all duration-300 ${
                  isLeaderHovered
                    ? "opacity-100 pointer-events-auto"
                    : "opacity-0 pointer-events-none"
                }`}
              >
                <div>
                  <h3 className="text-xl font-bold text-white">Azam Beyk</h3>
                  <p className="text-xs text-purple-400 mt-0.5">
                    Founder and Vision Steward
                  </p>
                  <p className="text-xs text-[#a9a3c4] leading-relaxed mt-4">
                    Built AI and enterprise systems at Vodafone, Comarch and
                    Gartner, serving tens of millions of users. Founded NIIOMA
                    to close the gap between enterprises and the vendors they
                    cannot find. Leads the company and sets product direction.
                  </p>
                </div>
                <div className="text-[11px] text-white/50 border-t border-white/10 pt-3">
                  Executive Leader · 20+ Years Experience
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* SCREEN 6: About · Culture                                     */}
        {/* ============================================================ */}
        <section className="w-screen h-screen flex-shrink-0 relative snap-start flex flex-col justify-center px-8 sm:px-16 lg:px-24 overflow-hidden">
          <motion.div
            initial={{ opacity: 0, y: 40, filter: "blur(14px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-[920px] flex flex-col gap-6"
          >
            <p className="text-[14px] font-semibold text-[#6e72ee] tracking-widest uppercase">
              Culture
            </p>
            <DramaticText
              text={"Good hearts. Bright minds.\nGreat attitude."}
              as="h2"
              whileInView={true}
              delay={0.2}
              stagger={0.04}
              letterDuration={1.2}
              className="text-4xl sm:text-5xl lg:text-[64px] font-bold text-white leading-[1.05] tracking-tight"
            />
            <p className="text-lg font-medium text-white/90 mt-2">
              People who care. People who can. People who own it.
            </p>
            <p className="text-[#a9a3c4] text-base leading-relaxed max-w-[840px]">
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
        <section className="w-screen h-screen flex-shrink-0 relative snap-start flex flex-col justify-center px-8 sm:px-16 lg:px-24 overflow-hidden">
          <div className="w-full max-w-[1400px] flex flex-col lg:flex-row items-center justify-between gap-16">
            {/* Left Stat Box */}
            <motion.div
              initial={{ opacity: 0, y: 40, filter: "blur(14px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-[720px] flex flex-col gap-6"
            >
              <p className="text-[14px] font-semibold text-[#6e72ee] tracking-widest uppercase">
                AI for Good
              </p>
              <DramaticText
                text={"Technology only matters\nwhen it uplifts people"}
                as="h2"
                whileInView={true}
                delay={0.2}
                stagger={0.04}
                letterDuration={1.2}
                className="text-4xl sm:text-5xl lg:text-[64px] font-bold text-white leading-[1.05] tracking-tight"
              />

              <div className="flex items-center gap-8 pt-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="text-7xl sm:text-8xl lg:text-[90px] font-bold text-white tracking-tight"
                >
                  5%
                </motion.div>
                <p className="text-[#a9a3c4] text-base sm:text-lg leading-relaxed max-w-[420px]">
                  of revenue goes to work that applies AI to social and
                  environmental challenges, in partnership with organisations
                  doing this work on the ground.
                </p>
              </div>
            </motion.div>

            {/* Right Pillars List */}
            <motion.div
              initial={{ opacity: 0, y: 40, filter: "blur(14px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 1.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-[480px] flex flex-col gap-6"
            >
              <div className="border-t border-white/20 pt-6">
                <h3 className="text-2xl sm:text-3xl font-medium text-white/80 hover:text-white transition">
                  AI for children
                </h3>
              </div>
              <div className="border-t border-white/20 pt-6">
                <h3 className="text-2xl sm:text-3xl font-medium text-white/80 hover:text-white transition">
                  AI for poverty alleviation
                </h3>
              </div>
              <div className="border-t border-white/20 pt-6 border-b pb-6">
                <h3 className="text-2xl sm:text-3xl font-medium text-white/80 hover:text-white transition">
                  AI for food security
                </h3>
              </div>
            </motion.div>
          </div>
        </section>
      </div>

      {/* 3. Global Fixed Bottom Footer (Transparent Frosted Blur with Centered Note) */}
      <footer
        className="fixed bottom-0 left-0 right-0 z-40 h-[62px] sm:h-[66px] px-6 sm:px-12 lg:px-16 flex items-center justify-between transition-all select-none"
        style={{
          background: "rgba(5, 9, 24, 0.22)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderTop: "1px solid rgba(255, 255, 255, 0.12)",
          boxShadow: "0 -4px 30px rgba(0, 0, 0, 0.15)",
        }}
      >
        {/* Left: Copyright & Legal */}
        <div className="text-[12px] sm:text-[13px] text-white/60 hover:text-white/90 font-light tracking-wide transition cursor-pointer select-none drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]">
          © 2026 NIIOMA Ltd. Legal and contact
        </div>

        {/* Center Note: Tagline + Purple Dot + Capsule Progress */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-3 select-none pointer-events-none drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]">
          <span className="text-[12px] sm:text-[13px] text-white/70 font-light tracking-wide whitespace-nowrap">
            The new operating system for global business
          </span>
          <div className="hidden sm:flex items-center gap-1.5 pl-1">
            {/* Glowing purple dot */}
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_8px_#c084fc]" />
            {/* Capsule track */}
            <div className="w-16 sm:w-20 h-[3px] bg-white/15 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-400 to-blue-400 rounded-full transition-all duration-300"
                style={{ width: `${Math.max(12, scrollProgress * 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right: Chat with NIIOMA Purple Glass Pill Button */}
        <button
          type="button"
          className="flex items-center gap-2 h-[38px] px-4 sm:px-5 rounded-full text-[13px] font-medium text-white transition-all select-none cursor-pointer"
          style={{
            background: "rgba(43, 22, 82, 0.82)",
            border: "1px solid rgba(168, 85, 247, 0.35)",
            boxShadow: "0 0 16px rgba(147, 51, 234, 0.2)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(63, 31, 118, 0.92)";
            e.currentTarget.style.boxShadow = "0 0 22px rgba(168, 85, 247, 0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(43, 22, 82, 0.82)";
            e.currentTarget.style.boxShadow = "0 0 16px rgba(147, 51, 234, 0.2)";
          }}
        >
          <MessageSquare className="w-3.5 h-3.5 text-purple-200" />
          <span>Chat with NIIOMA</span>
        </button>
      </footer>
    </div>
  );
};

export default HorizontalExperience;
