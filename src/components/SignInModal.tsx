"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Lock, ArrowRight } from "lucide-react";

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SignInModal: React.FC<SignInModalProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-md"
          />

          {/* Dialog Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative w-full max-w-md rounded-3xl bg-[#0f0924]/95 border border-white/20 p-8 shadow-2xl shadow-purple-950/80 z-10 overflow-hidden"
          >
            {/* Top decorative glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 bg-purple-600/25 blur-3xl pointer-events-none" />

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex flex-col items-center text-center mt-2 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center mb-3 text-purple-300">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-white tracking-wide">
                NIIOMA Access
              </h3>
              <p className="text-sm text-white/60 mt-1">
                Enter your enterprise credentials to connect.
              </p>
            </div>

            {/* Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("Sign-in authentication simulated successfully!");
                onClose();
              }}
              className="flex flex-col gap-4"
            >
              <div>
                <label className="block text-xs font-semibold text-white/75 mb-1.5 uppercase tracking-wider">
                  Corporate Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@enterprise.com"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white placeholder-white/35 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/75 mb-1.5 uppercase tracking-wider">
                  Security Token / Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white placeholder-white/35 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition"
                />
              </div>

              <button
                type="submit"
                className="mt-2 w-full py-3.5 px-4 rounded-full bg-[#702FA0] hover:bg-[#8338ba] text-white font-semibold transition-all shadow-lg shadow-purple-900/40 flex items-center justify-center gap-2 group"
              >
                <span>Authorize Session</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </button>
            </form>

            <div className="mt-6 text-center">
              <span className="text-xs text-white/40">
                Encrypted via Zero-Knowledge Enterprise Protocol
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
