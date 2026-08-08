'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/lib/store';

export const WelcomingLoader: React.FC = () => {
  const { siteSettings } = useApp();
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Dynamic video duration from CMS in seconds (e.g. 2.46s or 3.0s)
  const videoDurationSec = siteSettings.welcomingVideoDurationSec && siteSettings.welcomingVideoDurationSec > 0
    ? siteSettings.welcomingVideoDurationSec
    : 3.0;

  const durationMs = videoDurationSec * 1000;

  const dismissLoader = () => {
    setIsVisible(false);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('straya_loader_seen', 'true');
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hasSeenLoader = sessionStorage.getItem('straya_loader_seen');
      if (hasSeenLoader) {
        setIsVisible(false);
        return;
      }
    }

    // Programmatic play trigger for iOS Safari and Android Chrome
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.defaultMuted = true;
      videoRef.current.play().catch(() => {
        // If mobile OS Low Power mode blocks video autoplay, proceed smoothly
        dismissLoader();
      });
    }

    const timer = setTimeout(() => {
      dismissLoader();
    }, durationMs);

    return () => clearTimeout(timer);
  }, [durationMs]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: 'easeInOut' } }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black overflow-hidden select-none"
        >
          {/* iOS Safari & Android Chrome Optimized Video Tag */}
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            // @ts-ignore
            webkit-playsinline="true"
            x5-playsinline="true"
            controls={false}
            disablePictureInPicture
            preload="auto"
            onEnded={dismissLoader}
            onError={dismissLoader}
            className="absolute inset-0 w-full h-full object-cover opacity-100 filter brightness-110 saturate-120"
          >
            <source src="/videos/welcoming_intro.webm" type="video/webm" />
            <source src="/videos/welcoming_intro.mp4" type="video/mp4" />
          </video>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
