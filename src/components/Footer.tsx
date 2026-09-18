"use client";

import React, { useEffect, useState } from "react";
import { MessageSquare } from "lucide-react";

export const Footer: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const docEl = document.documentElement;
      const totalScroll = docEl.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress(Math.min(1, Math.max(0, window.scrollY / totalScroll)));
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
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

      {/* Right: Chat with NIIOMA Purple Glass Pill Button */}
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
  );
};

export default Footer;
