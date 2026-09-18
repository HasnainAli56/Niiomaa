"use client";

import React from "react";
import { motion } from "framer-motion";

interface DramaticTextProps {
  text: string;
  className?: string;
  letterClassName?: string;
  delay?: number;
  stagger?: number;
  letterDuration?: number;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";
  whileInView?: boolean;
  once?: boolean;
}

export const DramaticText: React.FC<DramaticTextProps> = ({
  text,
  className = "",
  letterClassName = "",
  delay = 0.2,
  stagger = 0.035,
  letterDuration = 1.0,
  as = "div",
  whileInView = true,
  once = true,
}) => {
  const Component = motion[as] as any;
  const lines = text.split("\n");

  let globalCharCount = 0;

  return (
    <Component
      initial="hidden"
      variants={{
        hidden: { opacity: 1 },
        visible: { opacity: 1 },
      }}
      {...(whileInView
        ? { whileInView: "visible", viewport: { once, amount: 0.05 } }
        : { animate: "visible" })}
      className={`select-none text-white ${className}`}
      aria-label={text.replace(/\n/g, " ")}
    >
      {lines.map((line, lineIdx) => {
        const words = line.split(" ");
        return (
          <span key={lineIdx} className="block">
            {words.map((word, wordIdx) => (
              <span
                key={wordIdx}
                className="inline-block whitespace-nowrap mr-[0.28em]"
              >
                {Array.from(word).map((char, charIdx) => {
                  const charIndex = globalCharCount++;
                  return (
                    <motion.span
                      key={charIdx}
                      variants={{
                        hidden: {
                          opacity: 0,
                          y: 20,
                          filter: "blur(12px)",
                          scale: 0.94,
                        },
                        visible: {
                          opacity: 1,
                          y: 0,
                          filter: "blur(0px)",
                          scale: 1,
                          transition: {
                            duration: letterDuration,
                            delay: delay + charIndex * stagger,
                            ease: [0.16, 1, 0.3, 1],
                          },
                        },
                      }}
                      className={`inline-block text-white will-change-transform ${letterClassName}`}
                      style={{ color: "#ffffff" }}
                    >
                      {char}
                    </motion.span>
                  );
                })}
              </span>
            ))}
          </span>
        );
      })}
    </Component>
  );
};

export default DramaticText;
