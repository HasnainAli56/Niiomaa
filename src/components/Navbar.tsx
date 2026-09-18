"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, Globe, Menu, ArrowLeft } from "lucide-react";
import { LandingContent } from "@/content/landing-content";
import { NavbarLogo } from "./NavbarLogo";
import { DropdownMenu, DropdownItem } from "./DropdownMenu";
import { MobileMenu } from "./MobileMenu";
import { SignInModal } from "./SignInModal";

interface NavbarProps {
  content: LandingContent;
  onNavigateSection?: (sectionIndex: number) => void;
  onBackToLanding?: () => void;
  isInsideExperience?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  content,
  onNavigateSection,
  onBackToLanding,
  isInsideExperience = false,
}) => {
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState(
    content.navigation.languages.current
  );

  const toggleDropdown = (index: number) => {
    setActiveDropdown((prev) => (prev === index ? null : index));
  };

  const handleNavClick = (idx: number, itemLabel: string) => {
    const lower = itemLabel.toLowerCase();
    // Only "About" works because the other content pages haven't been created yet
    if (lower.includes("about")) {
      setActiveDropdown(null);
      if (onNavigateSection) {
        onNavigateSection(1); // Overview section
      }
    }
    // Other items are inactive until user adds their pages
  };

  const handleDropdownItemClick = (item: DropdownItem) => {
    let targetSection = 1;
    const lower = item.title.toLowerCase();

    if (lower.includes("overview")) targetSection = 1;
    else if (lower.includes("vision")) targetSection = 2;
    else if (lower.includes("mission")) targetSection = 3;
    else if (lower.includes("leadership") || lower.includes("advisory")) targetSection = 4;
    else if (lower.includes("culture") || lower.includes("principle")) targetSection = 5;
    else if (lower.includes("ai") || lower.includes("good") || lower.includes("compliance")) targetSection = 6;

    setActiveDropdown(null);
    if (onNavigateSection) {
      onNavigateSection(targetSection);
    }
  };

  return (
    <>
      <motion.header
        initial={isInsideExperience ? false : { opacity: 0, y: -32, filter: "blur(14px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{
          duration: 1.5,
          delay: isInsideExperience ? 0 : 0.85,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="fixed top-0 left-0 right-0 z-50 flex justify-center items-center px-4 sm:px-6 pt-3 sm:pt-4 pointer-events-none"
      >
        <nav
          className="pointer-events-auto w-full max-w-[1360px] h-[64px] sm:h-[70px] rounded-[100px] px-5 sm:px-8 flex items-center justify-between transition-all select-none"
          style={{
            background: "rgba(18, 11, 36, 0.78)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid rgba(168, 85, 247, 0.22)",
            boxShadow:
              "0 20px 45px -10px rgba(0, 0, 0, 0.85), 0 0 25px rgba(120, 60, 220, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.12)",
          }}
        >
          {/* 1. Left Brand Logo */}
          <div
            onClick={() => {
              if (isInsideExperience && onBackToLanding) {
                onBackToLanding();
              }
            }}
            className={`flex-shrink-0 flex items-center gap-3 ${
              isInsideExperience ? "cursor-pointer hover:opacity-85 transition" : ""
            }`}
            title={isInsideExperience ? "Return to Landing" : "NIIOMA"}
          >
            <NavbarLogo />
          </div>

          {/* 2. Center Nav Items (Desktop) */}
          <div className="hidden xl:flex items-center gap-2">
            {content.navigation.items.map((item, idx) => {
              const isAbout = item.label.toLowerCase().includes("about");
              const isMenuOpen = activeDropdown === idx;

              return (
                <div key={idx} className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      if (isAbout) {
                        if (item.hasDropdown) {
                          toggleDropdown(idx);
                        } else {
                          handleNavClick(idx, item.label);
                        }
                      }
                    }}
                    className={`flex items-center gap-1.5 h-[38px] px-4 rounded-full text-[14px] font-medium transition-all select-none ${
                      isAbout
                        ? "bg-[#381c6e] text-white border border-purple-400/35 shadow-[0_0_12px_rgba(147,51,234,0.25)] cursor-pointer"
                        : "text-white/65 hover:text-white/85 cursor-default"
                    }`}
                  >
                    <span>{item.label}</span>
                    {item.hasDropdown && (
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          isAbout ? "opacity-90" : "opacity-50"
                        } ${isMenuOpen ? "rotate-180" : ""}`}
                      />
                    )}
                  </button>

                  {/* Dropdown Menu - only active for About */}
                  {isAbout && item.hasDropdown && item.children && (
                    <DropdownMenu
                      isOpen={isMenuOpen}
                      onClose={() => setActiveDropdown(null)}
                      items={item.children}
                      align="left"
                      onItemClick={handleDropdownItemClick}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* 3. Right Action Items */}
          <div className="flex items-center gap-3">
            {/* If inside website horizontal experience, provide Back button */}
            {isInsideExperience && onBackToLanding && (
              <button
                type="button"
                onClick={onBackToLanding}
                className="flex items-center gap-1.5 h-[38px] px-3.5 rounded-full text-[13px] font-medium text-white/90 hover:text-white border border-white/20 bg-white/10 hover:bg-white/20 backdrop-blur-md transition-all select-none cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            )}

            {/* Sign In Purple Pill Button */}
            <motion.button
              whileHover={{
                scale: 1.03,
                boxShadow: "0 0 20px rgba(168, 85, 247, 0.45)",
              }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setIsSignInOpen(true)}
              className="h-[38px] sm:h-[40px] px-5 sm:px-6 flex items-center justify-center rounded-full text-[13px] sm:text-[14px] font-medium text-white transition-all select-none cursor-pointer"
              style={{
                background: "linear-gradient(135deg, #4c248c 0%, #3b1c6e 100%)",
                border: "1px solid rgba(168, 85, 247, 0.35)",
                boxShadow: "0 0 14px rgba(124, 58, 237, 0.3)",
              }}
            >
              {content.navigation.signIn.label}
            </motion.button>

            {/* Language Selector */}
            <div className="relative hidden md:block">
              <button
                type="button"
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-1.5 h-[38px] px-3 rounded-full text-[13px] font-medium text-white/80 hover:text-white hover:bg-white/[0.08] transition select-none cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5 text-white/80" />
                <span>{selectedLang}</span>
              </button>

              <DropdownMenu
                isOpen={isLangOpen}
                onClose={() => setIsLangOpen(false)}
                align="right"
                width="w-40"
                items={content.navigation.languages.options.map((lang) => ({
                  title: lang,
                }))}
                onItemClick={(item) => setSelectedLang(item.title)}
              />
            </div>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setIsMobileOpen(true)}
              className="p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 xl:hidden transition"
              aria-label="Toggle Menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Drawer */}
      <MobileMenu
        isOpen={isMobileOpen}
        onClose={() => setIsMobileOpen(false)}
        content={content}
        onOpenSignIn={() => setIsSignInOpen(true)}
        onNavigateSection={onNavigateSection}
      />

      {/* Sign In Modal */}
      <SignInModal
        isOpen={isSignInOpen}
        onClose={() => setIsSignInOpen(false)}
      />
    </>
  );
};

export default Navbar;
