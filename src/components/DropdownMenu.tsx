"use client";

import React, { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface DropdownItem {
  title: string;
  description?: string;
  href?: string;
}

interface DropdownMenuProps {
  isOpen: boolean;
  onClose: () => void;
  items: DropdownItem[];
  align?: "left" | "center" | "right";
  width?: string;
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({
  isOpen,
  onClose,
  items,
  align = "center",
  width = "w-72",
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen, onClose]);

  const alignmentClass =
    align === "left"
      ? "left-0"
      : align === "right"
      ? "right-0"
      : "left-1/2 -translate-x-1/2";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, y: 8, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 6, scale: 0.95 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className={`absolute top-full mt-3 ${alignmentClass} ${width} z-50 p-2 rounded-2xl bg-[#140a2b]/90 backdrop-blur-xl border border-white/15 shadow-2xl shadow-purple-950/60 overflow-hidden`}
        >
          <div className="flex flex-col gap-1">
            {items.map((item, idx) => (
              <a
                key={idx}
                href={item.href || "#"}
                className="group flex flex-col px-3.5 py-2.5 rounded-xl hover:bg-white/10 transition-colors text-left"
                onClick={() => onClose()}
              >
                <span className="text-sm font-semibold text-white/90 group-hover:text-white flex items-center justify-between">
                  {item.title}
                  <span className="text-xs text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    →
                  </span>
                </span>
                {item.description && (
                  <span className="text-xs text-white/55 group-hover:text-white/75 mt-0.5 leading-relaxed">
                    {item.description}
                  </span>
                )}
              </a>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
