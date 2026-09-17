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
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  content,
  onOpenSignIn,
}) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleExpand = (idx: number) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
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
            className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-[#0c071d] border-l border-white/15 p-6 flex flex-col justify-between overflow-y-auto z-10"
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-6 border-b border-white/10">
                <span className="text-white font-bold tracking-[0.2em] text-xl">
                  {content.brand.name}
                </span>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10"
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
                          onClose();
                        }
                      }}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition ${
                        item.isActive
                          ? "bg-purple-900/40 text-white font-semibold"
                          : "text-white/80 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <span className="text-base">{item.label}</span>
                      {item.hasDropdown && (
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-200 ${
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
                        className="pl-6 pr-2 py-2 flex flex-col gap-2 border-l-2 border-purple-500/30 ml-4 my-1"
                      >
                        {item.children?.map((sub, sIdx) => (
                          <a
                            key={sIdx}
                            href={sub.href || "#"}
                            onClick={onClose}
                            className="text-sm text-white/60 hover:text-white py-1 block"
                          >
                            <span className="font-medium text-white/80 block">
                              {sub.title}
                            </span>
                            <span className="text-xs text-white/50 block">
                              {sub.description}
                            </span>
                          </a>
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
                className="w-full py-3 px-4 rounded-full border border-white/20 text-white font-semibold hover:bg-white/10 transition text-center"
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
