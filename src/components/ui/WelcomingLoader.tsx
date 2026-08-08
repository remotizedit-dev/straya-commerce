'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/lib/store';
import { Sparkles, ArrowRight } from 'lucide-react';

export const WelcomingLoader: React.FC = () => {
  const { siteSettings } = useApp();
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [mounted, setMounted] = useState(false);

  // Dynamic video duration from CMS in seconds (e.g. 2.46s or 3.0s)
  const videoDurationSec = siteSettings.welcomingVideoDurationSec && siteSettings.welcomingVideoDurationSec > 0
    ? siteSettings.welcomingVideoDurationSec
    : 3.0;

  const durationMs = videoDurationSec * 1000;

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      const hasSeenLoader = sessionStorage.getItem('straya_loader_seen');
      if (hasSeenLoader) {
        setIsVisible(false);
        return;
      }
    }

    const intervalTime = 20;
    const increment = (intervalTime / durationMs) * 100;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev + increment >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsVisible(false);
            if (typeof window !== 'undefined') {
              sessionStorage.setItem('straya_loader_seen', 'true');
            }
          }, 200);
          return 100;
        }
        return prev + increment;
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [durationMs]);

  const handleSkip = () => {
    setIsVisible(false);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('straya_loader_seen', 'true');
    }
  };

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02, transition: { duration: 0.8, ease: 'easeInOut' } }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black overflow-hidden select-none"
        >
          {/* Background Welcoming Video Loop with key prop to force instant reload when CMS URL changes */}
          {siteSettings.welcomingVideoUrl ? (
            <video
              key={siteSettings.welcomingVideoUrl}
              autoPlay
              muted
              playsInline
              loop
              className="absolute inset-0 w-full h-full object-cover opacity-50 filter saturate-150 blur-xs scale-105"
            >
              <source src={siteSettings.welcomingVideoUrl} type="video/mp4" />
            </video>
          ) : (
            <div className="absolute inset-0 bg-radial from-[#FF007A]/20 via-[#09090D] to-black" />
          )}

          {/* Dark Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

          {/* Loader Content */}
          <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-lg">
            {/* Logo Badge */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="mb-6 flex items-center space-x-3 px-5 py-2 rounded-full glass-panel border border-[#FF007A]/40 shadow-[0_0_25px_rgba(255,0,122,0.3)]"
            >
              <Sparkles className="w-5 h-5 text-[#00F0FF] animate-pulse" />
              <span className="font-extrabold text-2xl tracking-wider text-white">
                STRAYA<span className="text-[#FF007A]">.</span>
              </span>
            </motion.div>

            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-2xl sm:text-3xl font-black text-white uppercase tracking-wide leading-snug mb-3"
            >
              Australia&apos;s High-Purity <br />
              <span className="gradient-text-pink-cyan">Peptide Laboratory</span>
            </motion.h2>

            <p className="text-gray-300 text-xs sm:text-sm mb-6 tracking-widest uppercase font-medium">
              Initializing HPLC Verified Catalog... ({videoDurationSec.toFixed(2)}s)
            </p>

            {/* Dynamic Progress Bar */}
            <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden mb-6 p-0.5 border border-white/20">
              <motion.div
                className="h-full bg-gradient-to-r from-[#FF007A] via-[#00F0FF] to-[#FF007A] rounded-full shadow-[0_0_15px_#00F0FF]"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Skip Intro Link */}
            <button
              onClick={handleSkip}
              className="text-xs text-slate-300 hover:text-white transition-colors underline flex items-center space-x-1 cursor-pointer font-semibold"
            >
              <span>Skip Intro</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
