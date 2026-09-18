"use client";

import React from "react";
import { defaultLandingContent } from "@/content/landing-content";
import { Navbar } from "./Navbar";
import { EarthGlobe } from "./EarthGlobe";
import { DramaticText } from "./DramaticText";
import { Footer } from "./Footer";

interface ExperienceProps {
  onBackToLanding?: () => void;
}

export const AboutExperience: React.FC<ExperienceProps> = ({ onBackToLanding }) => {
  return (
    <div className="relative w-full h-screen h-[100dvh] overflow-hidden flex flex-col justify-between bg-[#000B1A] select-none">
      {/* 1. Fixed Floating Navbar with Back button */}
      <Navbar
        content={defaultLandingContent}
        isInsideExperience={true}
        onBackToLanding={onBackToLanding}
      />

      {/* ============================================================ */}
      {/* SINGLE SCREEN: Earth Globe & Hero Section (#about)           */}
      {/* ============================================================ */}
      <section className="relative w-full h-full flex flex-col justify-center px-8 sm:px-14 lg:px-20 overflow-hidden">
        {/* Celestial Cosmic Glow & Nebula Atmosphere behind Earth (Exact Reference Match) */}
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

        {/* Subtle edge blends for seamless immersion */}
        <div className="absolute top-0 bottom-0 left-0 w-[42vw] bg-gradient-to-r from-[#000814]/95 via-[#000814]/65 to-transparent pointer-events-none z-10" />
        <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-[#000814]/85 via-[#000814]/40 to-transparent pointer-events-none z-10" />

        {/* Dramatic Left Headline */}
        <div className="relative z-20 max-w-[560px] my-auto pl-2 sm:pl-6 lg:pl-10">
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

      {/* 3. Frosted Blur Footer */}
      <Footer />

      {/* ============================================================ */}
      {/* COMMENTED OUT ALL OTHER ABOUT CONTENT AS REQUESTED:          */}
      {/* (Overview, Vision, Mission, Leadership, Culture, AI for Good) */}
      {/* ============================================================ */}
      {/*
      <section id="overview">
        <h2>NIIOMA is the new operating system for global business</h2>
      </section>
      <section id="vision">
        <h2>A world where AI connects enterprises and vendors seamlessly</h2>
      </section>
      <section id="mission">
        <h2>To build the trusted network where enterprises, vendors and people find each other seamlessly</h2>
      </section>
      <section id="leadership">
        <h2>The people behind NIIOMA</h2>
      </section>
      <section id="culture">
        <h2>Good hearts. Bright minds. Great attitude.</h2>
      </section>
      <section id="ai-for-good">
        <h2>Technology only matters when it uplifts people</h2>
      </section>
      */}
    </div>
  );
};

export const HorizontalExperience = AboutExperience;
export default AboutExperience;
