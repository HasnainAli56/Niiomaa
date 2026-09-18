"use client";

import React, { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface DropdownItem {
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
  onItemClick?: (item: DropdownItem, index: number) => void;
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({
  isOpen,
  onClose,
  items,
  align = "center",
  width = "w-72",
  onItemClick,
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
          initial={{ opacity: 0, y: 10, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.96 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className={`absolute top-full mt-3 ${alignmentClass} ${width} z-50 p-2.5 rounded-2xl bg-[#0e0a1f]/95 backdrop-blur-2xl border border-purple-500/20 shadow-2xl shadow-black/90 overflow-hidden`}
        >
          <div className="flex flex-col gap-1">
            {items.map((item, idx) => (
              <button
                key={idx}
                type="button"
                className="group flex flex-col px-3.5 py-2.5 rounded-xl hover:bg-white/[0.08] transition-colors text-left w-full select-none"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onClose();
                  if (onItemClick) {
                    onItemClick(item, idx);
                  }
                }}
              >
                <span className="text-sm font-semibold text-white/90 group-hover:text-white flex items-center justify-between">
                  {item.title}
                  <span className="text-xs text-white/60 opacity-0 group-hover:opacity-100 transition-opacity">
                    →
                  </span>
                </span>
                {item.description && (
                  <span className="text-xs text-white/50 group-hover:text-white/75 mt-0.5 leading-relaxed">
                    {item.description}
                  </span>
                )}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DropdownMenu;
