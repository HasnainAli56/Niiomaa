"use client";

import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { ArrowLeft, MessageSquare, ExternalLink } from "lucide-react";
import { NavbarLogo } from "./NavbarLogo";
import { EarthGlobe } from "./EarthGlobe";

interface HorizontalExperienceProps {
  onBackToLanding: () => void;
}

export const HorizontalExperience: React.FC<HorizontalExperienceProps> = ({
  onBackToLanding,
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

  const scrollToSection = (index: number) => {
    const el = containerRef.current;
    if (!el) return;
    const sectionWidth = window.innerWidth;
    el.scrollTo({
      left: index * sectionWidth,
      behavior: "smooth",
    });
  };

  const partnerLogos = [
    "BT",
    "easyJet",
    "e&",
    "Comarch",
    "Barclays",
    "Vodafone",
    "HSBC",
    "Tesla",
    "b-yond",
    "Calsoft",
    "Yobu",
    "Alten",
  ];

  return (
    <div className="relative w-full h-screen bg-[#000B1A] overflow-hidden select-none flex flex-col justify-between">
      {/* 1. Global Fixed Floating Navbar (Matching media_1789642141436.png) */}
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-center items-center px-4 sm:px-6 pt-4 sm:pt-6 pointer-events-none">
        <nav
          className="pointer-events-auto w-full max-w-[1432px] h-[72px] sm:h-[80px] rounded-[100px] px-6 sm:px-10 flex items-center justify-between border border-white/[0.12] transition-all"
          style={{
            background: "rgba(112, 47, 160, 0.35)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            boxShadow:
              "0 8px 32px rgba(112, 47, 160, 0.3), inset 0 0 0 1px rgba(255, 255, 255, 0.08)",
          }}
        >
          {/* Brand Logo - Click returns to landing */}
          <div
            onClick={onBackToLanding}
            className="flex-shrink-0 cursor-pointer group flex items-center gap-3"
            title="Return to Landing"
          >
            <NavbarLogo />
          </div>

          {/* Nav Items from Figma reference */}
          <div className="hidden xl:flex items-center gap-4 text-[15px] font-medium text-white/85">
            <button
              onClick={() => scrollToSection(1)}
              className="px-4 py-1.5 rounded-full bg-white/15 text-white font-medium hover:bg-white/20 transition"
            >
              About ▾
            </button>
            <button
              onClick={() => scrollToSection(0)}
              className="hover:text-white transition"
            >
              Ecosystem orchestration ▾
            </button>
            <button
              onClick={() => scrollToSection(2)}
              className="hover:text-white transition"
            >
              Cognitive services ▾
            </button>
            <button
              onClick={() => scrollToSection(3)}
              className="hover:text-white transition"
            >
              Insights
            </button>
            <button
              onClick={() => scrollToSection(4)}
              className="hover:text-white transition"
            >
              FAQ
            </button>
            <button
              onClick={() => scrollToSection(5)}
              className="hover:text-white transition"
            >
              Membership
            </button>
          </div>

          {/* Right Action Items */}
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToLanding}
              className="hidden sm:flex items-center gap-1.5 h-[40px] px-3.5 rounded-[48px] text-[13px] font-medium text-white/80 hover:text-white border border-white/10 hover:bg-white/10 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            <button className="h-[44px] px-5 flex items-center justify-center rounded-[48px] text-[15px] font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/10 backdrop-blur-[2px] transition shadow-sm">
              Sign in
            </button>

            <span className="hidden sm:flex items-center gap-1 text-xs font-medium text-white/70 ml-1">
              🌐 UK - EN
            </span>
          </div>
        </nav>
      </header>

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
          {/* Ambient Deep Blue Space Glow & Atmospheric Radiance */}
          {/* 1. Core bright radiant horizon bloom behind Earth apex */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 75% 65% at 68% 44%, rgba(14, 165, 233, 0.45) 0%, rgba(2, 132, 199, 0.25) 30%, transparent 65%)",
            }}
          />
          {/* 2. Wide ethereal cyan & royal blue atmospheric diffusion */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at 62% 52%, rgba(56, 189, 248, 0.35) 0%, rgba(37, 99, 235, 0.22) 35%, transparent 70%)",
            }}
          />
          {/* 3. Deep celestial navy base glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 95% 80% at 75% 72%, rgba(15, 75, 180, 0.5) 0%, rgba(10, 30, 85, 0.25) 50%, transparent 85%)",
            }}
          />
          {/* 4. Soft space glow behind headline text */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at 22% 52%, rgba(14, 116, 144, 0.16) 0%, transparent 50%)",
            }}
          />

          {/* 3D Infinite Revolving Earth Globe (earth.glb) */}
          <div className="absolute inset-0 w-full h-full pointer-events-auto z-0 overflow-hidden">
            <EarthGlobe className="w-full h-full" autoRotateSpeed={0.0018} />
          </div>

          {/* Subtle soft edge blends for seamless immersion */}
          <div className="absolute top-0 bottom-0 left-0 w-[35vw] bg-gradient-to-r from-[#000B1A]/90 via-[#000B1A]/60 to-transparent pointer-events-none z-10" />
          <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-[#000B1A]/80 via-[#000B1A]/40 to-transparent pointer-events-none z-10" />
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#000B1A]/90 via-[#000B1A]/50 to-transparent pointer-events-none z-10" />

          {/* Content Middle Left (Matching reference media_1789649307799.png) */}
          <div className="relative z-20 max-w-[720px] my-auto pl-2 sm:pl-6 lg:pl-10">
            <h1 className="text-4xl sm:text-5xl lg:text-[62px] font-bold leading-[1.08] tracking-tight text-white drop-shadow-[0_4px_30px_rgba(0,0,0,0.6)]">
              The trusted network<br />
              for technology vendors<br />
              and enterprises
            </h1>
          </div>
        </section>

        {/* ============================================================ */}
        {/* SCREEN 2: About · Overview                                    */}
        {/* ============================================================ */}
        <section className="w-screen h-screen flex-shrink-0 relative snap-start flex flex-col justify-center px-8 sm:px-16 lg:px-24 overflow-hidden">
          <div className="max-w-[920px] flex flex-col gap-6">
            <p className="text-[16px] font-medium text-[#5959cf]">
              Overview
            </p>
            <h2 className="text-4xl sm:text-5xl lg:text-[64px] font-bold text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/75 leading-[1.05] tracking-tight">
              NIIOMA is the new operating system for global business
            </h2>
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
          </div>
        </section>

        {/* ============================================================ */}
        {/* SCREEN 3: About · Vision                                      */}
        {/* ============================================================ */}
        <section className="w-screen h-screen flex-shrink-0 relative snap-start flex flex-col justify-center px-8 sm:px-16 lg:px-24 overflow-hidden">
          <div className="max-w-[960px] flex flex-col gap-6">
            <p className="text-[16px] font-medium text-[#5959cf]">
              Vision
            </p>
            <h2 className="text-4xl sm:text-5xl lg:text-[64px] font-bold text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/75 leading-[1.05] tracking-tight">
              A world where AI connects enterprises and vendors seamlessly,
              opportunity opens at scale, and more people share in it
            </h2>
          </div>
        </section>

        {/* ============================================================ */}
        {/* SCREEN 4: About · Mission                                     */}
        {/* ============================================================ */}
        <section className="w-screen h-screen flex-shrink-0 relative snap-start flex flex-col justify-center px-8 sm:px-16 lg:px-24 overflow-hidden">
          <div className="max-w-[960px] flex flex-col gap-6">
            <p className="text-[16px] font-medium text-[#5959cf]">
              Mission
            </p>
            <h2 className="text-4xl sm:text-5xl lg:text-[64px] font-bold text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/75 leading-[1.05] tracking-tight">
              To build the trusted network where enterprises, vendors and
              people find each other seamlessly
            </h2>
          </div>
        </section>

        {/* ============================================================ */}
        {/* SCREEN 5: About · Leadership (with Azam Beyk Profile Card)   */}
        {/* ============================================================ */}
        <section className="w-screen h-screen flex-shrink-0 relative snap-start flex flex-col justify-center px-8 sm:px-16 lg:px-24 overflow-hidden">
          <div className="w-full max-w-[1400px] flex flex-col lg:flex-row items-center justify-between gap-12">
            {/* Text details */}
            <div className="max-w-[700px] flex flex-col gap-6">
              <p className="text-[16px] font-medium text-[#5959cf]">
                Leadership
              </p>
              <h2 className="text-4xl sm:text-5xl lg:text-[64px] font-bold text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/75 leading-[1.05] tracking-tight">
                The people behind NIIOMA
              </h2>
              <p className="text-[#a9a3c4] text-base sm:text-lg leading-relaxed">
                Profiles are being finalised. The leadership team brings more
                than 200 years of combined executive experience across enterprise
                sales, procurement and transformation.
              </p>
            </div>

            {/* Azam Beyk Interactive Profile Card */}
            <div
              onMouseEnter={() => setIsLeaderHovered(true)}
              onMouseLeave={() => setIsLeaderHovered(false)}
              className="relative w-[341px] h-[455px] rounded-[12px] border-2 border-white/[0.12] overflow-hidden cursor-pointer transition-all duration-300 group shadow-2xl"
              style={{
                background: "rgba(255, 255, 255, 0.04)",
                backdropFilter: "blur(16px)",
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
              <div className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white border border-white/10 hover:bg-purple-600 transition">
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
                className={`absolute inset-0 p-6 z-30 bg-[#000B1A]/90 backdrop-blur-md flex flex-col justify-between transition-all duration-300 ${
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
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* SCREEN 6: About · Culture                                     */}
        {/* ============================================================ */}
        <section className="w-screen h-screen flex-shrink-0 relative snap-start flex flex-col justify-center px-8 sm:px-16 lg:px-24 overflow-hidden">
          <div className="max-w-[920px] flex flex-col gap-6">
            <p className="text-[16px] font-medium text-[#5959cf]">
              Culture
            </p>
            <h2 className="text-4xl sm:text-5xl lg:text-[64px] font-bold text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/75 leading-[1.05] tracking-tight">
              Good hearts. Bright minds.
              <br />
              Great attitude.
            </h2>
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
          </div>
        </section>

        {/* ============================================================ */}
        {/* SCREEN 7: About · AI for Good                                 */}
        {/* ============================================================ */}
        <section className="w-screen h-screen flex-shrink-0 relative snap-start flex flex-col justify-center px-8 sm:px-16 lg:px-24 overflow-hidden">
          <div className="w-full max-w-[1400px] flex flex-col lg:flex-row items-center justify-between gap-16">
            {/* Left Stat Box */}
            <div className="max-w-[720px] flex flex-col gap-6">
              <p className="text-[16px] font-medium text-[#5959cf]">
                AI for Good
              </p>
              <h2 className="text-4xl sm:text-5xl lg:text-[64px] font-bold text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/75 leading-[1.05] tracking-tight">
                Technology only matters
                <br />
                when it uplifts people
              </h2>

              <div className="flex items-center gap-8 pt-4">
                <div className="text-7xl sm:text-8xl lg:text-[90px] font-bold text-white tracking-tight">
                  5%
                </div>
                <p className="text-[#a9a3c4] text-base sm:text-lg leading-relaxed max-w-[420px]">
                  of revenue goes to work that applies AI to social and
                  environmental challenges, in partnership with organisations
                  doing this work on the ground.
                </p>
              </div>
            </div>

            {/* Right Pillars List */}
            <div className="w-full max-w-[480px] flex flex-col gap-6">
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
            </div>
          </div>
        </section>
      </div>

      {/* 3. Global Fixed Bottom Footer (Matching media_1789642141436.png) */}
      <footer className="fixed bottom-0 left-0 right-0 z-40 h-[68px] px-8 sm:px-16 border-t border-white/[0.08] bg-[#000B1A]/85 backdrop-blur-md flex items-center justify-between">
        <div className="text-xs sm:text-sm text-white/60">
          © 2026 NIIOMA Ltd. Legal and contact
        </div>

        {/* Center Tagline & Scroll Indicator */}
        <div className="flex items-center gap-6">
          <span className="text-xs text-white/40 hidden md:inline font-light">
            The new operating system for global business
          </span>
          <div className="w-24 h-1 bg-white/10 rounded-full overflow-hidden hidden sm:block">
            <div
              className="h-full bg-purple-500 rounded-full transition-all duration-150"
              style={{ width: `${Math.max(5, scrollProgress * 100)}%` }}
            />
          </div>
        </div>

        {/* Chat with NIIOMA Button (Pill shaped) */}
        <button className="flex items-center gap-2 h-[38px] px-4 rounded-full text-[13px] font-medium text-white bg-[#702FA0]/50 border border-white/15 hover:bg-[#702FA0]/75 backdrop-blur-[2px] transition shadow-sm">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Chat with NIIOMA</span>
        </button>
      </footer>
    </div>
  );
};
