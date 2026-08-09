'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/lib/store';

export const WelcomingLoader: React.FC = () => {
  const { siteSettings } = useApp();
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const loaderVideoUrl = siteSettings.welcomingVideoUrl && siteSettings.welcomingVideoUrl.trim() !== ''
    ? siteSettings.welcomingVideoUrl
    : '/videos/welcoming_intro.webm';

  // Dynamic video duration from CMS in seconds (default 3.5s)
  const videoDurationSec =
    siteSettings.welcomingVideoDurationSec && siteSettings.welcomingVideoDurationSec > 0
      ? siteSettings.welcomingVideoDurationSec
      : 3.5;

  const durationMs = (videoDurationSec + 0.5) * 1000;

  const dismissLoader = () => {
    setIsVisible(false);
  };

  useEffect(() => {
    const playVideo = () => {
      if (videoRef.current) {
        videoRef.current.muted = true;
        videoRef.current.defaultMuted = true;
        videoRef.current.setAttribute('playsinline', 'true');
        videoRef.current.setAttribute('webkit-playsinline', 'true');
        videoRef.current.setAttribute('x5-playsinline', 'true');

        const promise = videoRef.current.play();
        if (promise !== undefined) {
          promise.catch((err) => {
            console.warn('Mobile video autoplay pending user gesture:', err);
          });
        }
      }
    };

    playVideo();

    // Attach touch/click fallback listener for low power mode on mobile iOS/Android
    const handleInteraction = () => {
      playVideo();
      window.removeEventListener('touchstart', handleInteraction);
      window.removeEventListener('click', handleInteraction);
    };

    window.addEventListener('touchstart', handleInteraction, { passive: true });
    window.addEventListener('click', handleInteraction, { passive: true });

    const timer = setTimeout(() => {
      dismissLoader();
    }, durationMs);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('touchstart', handleInteraction);
      window.removeEventListener('click', handleInteraction);
    };
  }, [durationMs, loaderVideoUrl]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: 'easeInOut' } }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black overflow-hidden select-none"
        >
          {/* Mobile & Web Video Player with Fail-Safe Sources */}
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
            onCanPlay={() => {
              if (videoRef.current) {
                videoRef.current.play().catch(() => {});
              }
            }}
            className="absolute inset-0 w-full h-full object-cover opacity-100 filter brightness-110 saturate-120"
          >
            {loaderVideoUrl && (
              <source
                src={loaderVideoUrl}
                type={loaderVideoUrl.toLowerCase().endsWith('.webm') ? 'video/webm' : 'video/mp4'}
              />
            )}
            <source src="/videos/welcoming_intro.webm" type="video/webm" />
            <source src="/videos/welcoming_intro.mp4" type="video/mp4" />
            <source src="/videos/welcome_intro.webm" type="video/webm" />
            <source src="/videos/welcome_intro.mp4" type="video/mp4" />
          </video>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
