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
  onNavigateSection?: (section: string | number) => void;
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
        onNavigateSection("about");
      }
    }
  };

  const handleDropdownItemClick = (item: DropdownItem) => {
    let targetSection = "overview";
    const lower = item.title.toLowerCase();

    if (lower.includes("overview")) targetSection = "overview";
    else if (lower.includes("vision")) targetSection = "vision";
    else if (lower.includes("mission")) targetSection = "mission";
    else if (lower.includes("leadership") || lower.includes("advisory")) targetSection = "leadership";
    else if (lower.includes("culture") || lower.includes("principle")) targetSection = "culture";
    else if (lower.includes("ai") || lower.includes("good") || lower.includes("compliance")) targetSection = "ai-for-good";

    setActiveDropdown(null);
    if (onNavigateSection) {
      onNavigateSection(targetSection);
    }
  };

  return (
    <>
      <motion.header
        initial={isInsideExperience ? false : { opacity: 0, y: -24, filter: "blur(12px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{
          duration: 1.5,
          delay: isInsideExperience ? 0 : 0.85,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="fixed top-0 left-0 right-0 z-50 flex justify-center items-center px-4 sm:px-6 pt-2.5 sm:pt-3 pointer-events-none"
      >
        <nav
          className="pointer-events-auto w-full max-w-[1160px] h-[48px] sm:h-[52px] rounded-[100px] px-4 sm:px-6 flex items-center justify-between transition-all select-none"
          style={{
            background: "rgba(18, 11, 36, 0.78)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid rgba(168, 85, 247, 0.22)",
            boxShadow:
              "0 16px 36px -8px rgba(0, 0, 0, 0.85), 0 0 20px rgba(120, 60, 220, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.12)",
          }}
        >
          {/* 1. Left Brand Logo */}
          <div
            onClick={() => {
              if (onNavigateSection) {
                onNavigateSection("landing");
              } else if (onBackToLanding) {
                onBackToLanding();
              }
            }}
            className="flex-shrink-0 flex items-center gap-2.5 cursor-pointer hover:opacity-85 transition"
            title="NIIOMA"
          >
            <NavbarLogo />
          </div>

          {/* 2. Center Nav Items (Desktop) */}
          <div className="hidden xl:flex items-center gap-1 sm:gap-1.5">
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
                    className={`flex items-center gap-1 h-[30px] sm:h-[32px] px-3 sm:px-3.5 rounded-full text-[12px] sm:text-[12.5px] font-medium transition-all select-none ${
                      isAbout
                        ? "bg-[#381c6e] text-white border border-purple-400/35 shadow-[0_0_10px_rgba(147,51,234,0.22)] cursor-pointer"
                        : "text-white/65 hover:text-white/85 cursor-default"
                    }`}
                  >
                    <span>{item.label}</span>
                    {item.hasDropdown && (
                      <ChevronDown
                        className={`w-3 h-3 transition-transform duration-200 ${
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
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* If inside website experience, optional Back button */}
            {isInsideExperience && onBackToLanding && (
              <button
                type="button"
                onClick={onBackToLanding}
                className="flex items-center gap-1 h-[30px] sm:h-[32px] px-3 rounded-full text-[12px] font-medium text-white/90 hover:text-white border border-white/20 bg-white/10 hover:bg-white/20 backdrop-blur-md transition-all select-none cursor-pointer"
              >
                <ArrowLeft className="w-3 h-3" />
                <span>Back</span>
              </button>
            )}

            {/* Sign In Purple Pill Button */}
            <motion.button
              whileHover={{
                scale: 1.03,
                boxShadow: "0 0 16px rgba(168, 85, 247, 0.45)",
              }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setIsSignInOpen(true)}
              className="h-[30px] sm:h-[32px] px-4 sm:px-5 flex items-center justify-center rounded-full text-[12px] sm:text-[12.5px] font-medium text-white transition-all select-none cursor-pointer"
              style={{
                background: "linear-gradient(135deg, #4c248c 0%, #3b1c6e 100%)",
                border: "1px solid rgba(168, 85, 247, 0.35)",
                boxShadow: "0 0 12px rgba(124, 58, 237, 0.25)",
              }}
            >
              {content.navigation.signIn.label}
            </motion.button>

            {/* Language Selector */}
            <div className="relative hidden md:block">
              <button
                type="button"
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-1.5 h-[30px] sm:h-[32px] px-2.5 rounded-full text-[12px] font-medium text-white/80 hover:text-white hover:bg-white/[0.08] transition select-none cursor-pointer"
              >
                <Globe className="w-3 h-3 text-white/80" />
                <span>{selectedLang}</span>
              </button>

              <DropdownMenu
                isOpen={isLangOpen}
                onClose={() => setIsLangOpen(false)}
                align="right"
                width="w-36"
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
              className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/10 xl:hidden transition"
              aria-label="Toggle Menu"
            >
              <Menu className="w-5 h-5" />
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
