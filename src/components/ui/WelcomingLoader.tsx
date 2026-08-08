'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/lib/store';

export const WelcomingLoader: React.FC = () => {
  const { siteSettings } = useApp();
  const [isVisible, setIsVisible] = useState(true);
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

    const timer = setTimeout(() => {
      setIsVisible(false);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('straya_loader_seen', 'true');
      }
    }, durationMs);

    return () => clearTimeout(timer);
  }, [durationMs]);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: 'easeInOut' } }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black overflow-hidden select-none"
        >
          {/* Full Opacity Crisp Background Welcoming Video Only (No Text Overlays) */}
          {siteSettings.welcomingVideoUrl ? (
            <video
              key={siteSettings.welcomingVideoUrl}
              autoPlay
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover opacity-100 filter saturate-110"
            >
              <source src={siteSettings.welcomingVideoUrl} type="video/mp4" />
            </video>
          ) : (
            <div className="absolute inset-0 bg-black" />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
