"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronDown, Globe } from "lucide-react";
import { LandingContent } from "@/content/landing-content";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  content: LandingContent;
  onOpenSignIn: () => void;
  onNavigateSection?: (section: string | number) => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  content,
  onOpenSignIn,
  onNavigateSection,
}) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleExpand = (idx: number) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  const handleNavClick = (label: string) => {
    const lower = label.toLowerCase();
    if (lower.includes("about")) {
      onClose();
      if (onNavigateSection) {
        onNavigateSection("about");
      }
    }
  };

  const handleSubItemClick = (title: string) => {
    let target = "overview";
    const lower = title.toLowerCase();
    if (lower.includes("overview")) target = "overview";
    else if (lower.includes("vision")) target = "vision";
    else if (lower.includes("mission")) target = "mission";
    else if (lower.includes("leadership") || lower.includes("advisory")) target = "leadership";
    else if (lower.includes("culture") || lower.includes("principle")) target = "culture";
    else if (lower.includes("ai") || lower.includes("good") || lower.includes("compliance")) target = "ai-for-good";

    onClose();
    if (onNavigateSection) {
      onNavigateSection(target);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 xl:hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-[#06080F]/95 backdrop-blur-2xl border-l border-white/15 p-6 flex flex-col justify-between overflow-y-auto z-10"
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-6 border-b border-white/10">
                <span className="text-white font-bold tracking-[0.2em] text-xl">
                  {content.brand.name}
                </span>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Links */}
              <div className="flex flex-col gap-2 mt-6">
                {content.navigation.items.map((item, idx) => (
                  <div key={idx} className="flex flex-col">
                    <div
                      onClick={() => {
                        if (item.hasDropdown) {
                          toggleExpand(idx);
                        } else {
                          handleNavClick(item.label);
                        }
                      }}
                      className="flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition text-white/85 hover:text-white hover:bg-white/[0.08]"
                    >
                      <span className="text-base font-medium">{item.label}</span>
                      {item.hasDropdown && (
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-200 opacity-70 ${
                            expandedIndex === idx ? "rotate-180" : ""
                          }`}
                        />
                      )}
                    </div>

                    {/* Submenu */}
                    {item.hasDropdown && expandedIndex === idx && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="pl-6 pr-2 py-2 flex flex-col gap-2 border-l border-white/20 ml-4 my-1"
                      >
                        {item.children?.map((sub, sIdx) => (
                          <button
                            key={sIdx}
                            type="button"
                            onClick={() => handleSubItemClick(sub.title)}
                            className="text-left text-sm text-white/70 hover:text-white py-1.5 block transition"
                          >
                            <span className="font-semibold text-white/90 block">
                              {sub.title}
                            </span>
                            <span className="text-xs text-white/50 block mt-0.5">
                              {sub.description}
                            </span>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-white/10 flex flex-col gap-3">
              <button
                onClick={() => {
                  onClose();
                  onOpenSignIn();
                }}
                className="w-full py-3 px-4 rounded-full bg-white text-[#06080F] font-semibold hover:bg-white/90 transition text-center shadow-lg shadow-white/10"
              >
                {content.navigation.signIn.label}
              </button>

              <div className="flex items-center justify-center gap-2 py-2 text-sm text-white/70">
                <Globe className="w-4 h-4" />
                <span>{content.navigation.languages.current}</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;
