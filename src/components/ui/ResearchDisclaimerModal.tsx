'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/lib/store';
import { ShieldAlert, ExternalLink, RefreshCw } from 'lucide-react';

export const ResearchDisclaimerModal: React.FC = () => {
  const { siteSettings } = useApp();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isDenied, setIsDenied] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      const accepted = sessionStorage.getItem('straya_terms_accepted');
      if (accepted !== 'true') {
        setIsOpen(true);
      }
    } catch {
      setIsOpen(true);
    }
  }, []);

  const handleAgree = () => {
    try {
      sessionStorage.setItem('straya_terms_accepted', 'true');
    } catch {
      // Storage unavailable fallback
    }
    setIsOpen(false);
  };

  const handleDecline = () => {
    setIsDenied(true);
  };

  const handleReconsider = () => {
    setIsDenied(false);
  };

  const handleExit = () => {
    window.location.href = 'https://www.google.com';
  };

  if (!isMounted || !isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-950/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative z-10 w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 p-6 sm:p-8 text-slate-900"
        >
          {!isDenied ? (
            <div className="space-y-6">
              {/* Top Logo / Diamond Badge */}
              <div className="flex justify-center">
                {siteSettings.logoUrl ? (
                  <div className="relative h-12 w-44">
                    <Image
                      src={siteSettings.logoUrl}
                      alt="Brand Logo"
                      fill
                      className="object-contain"
                      priority
                      unoptimized
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#00F0FF] via-[#0080FF] to-[#FF007A] p-0.5 shadow-md flex items-center justify-center">
                    <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center font-black text-xl text-slate-900">
                      ◆
                    </div>
                  </div>
                )}
              </div>

              {/* Title & Introduction */}
              <div className="text-center space-y-2">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Research Peptides — Terms of Use
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  By entering this site you acknowledge and agree to the following:
                </p>
              </div>

              {/* Compliance Terms Bullet Points */}
              <ul className="space-y-3 text-xs sm:text-[13px] text-slate-700 leading-relaxed">
                <li className="flex items-start space-x-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00F0FF] mt-2 shrink-0 shadow-xs" />
                  <span>
                    All products are intended <strong className="text-slate-900 font-extrabold">strictly for in-vitro research and laboratory development use only</strong>
                  </span>
                </li>

                <li className="flex items-start space-x-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00F0FF] mt-2 shrink-0 shadow-xs" />
                  <span>
                    Products are <strong className="text-slate-900 font-extrabold">strictly not for human consumption</strong>, veterinary use, or any therapeutic or diagnostic purpose whatsoever
                  </span>
                </li>

                <li className="flex items-start space-x-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00F0FF] mt-2 shrink-0 shadow-xs" />
                  <span>
                    You are a <strong className="text-slate-900 font-extrabold">verified academic, clinical, or commercial researcher</strong> or authorised purchasing agent
                  </span>
                </li>

                <li className="flex items-start space-x-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00F0FF] mt-2 shrink-0 shadow-xs" />
                  <span>
                    You are <strong className="text-slate-900 font-extrabold">18 years of age or older</strong>
                  </span>
                </li>

                <li className="flex items-start space-x-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00F0FF] mt-2 shrink-0 shadow-xs" />
                  <span>
                    You will handle all peptide products in compliance with <strong className="text-slate-900 font-extrabold">applicable Australian laws</strong> and regulations
                  </span>
                </li>
              </ul>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  onClick={handleAgree}
                  className="w-full bg-slate-900 hover:bg-black text-white font-extrabold text-xs sm:text-sm py-3.5 px-4 rounded-xl transition-all cursor-pointer shadow-md flex items-center justify-center space-x-2 active:scale-95"
                >
                  <span>I Agree — Enter Site</span>
                </button>

                <button
                  onClick={handleDecline}
                  className="w-full bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 hover:text-slate-900 font-extrabold text-xs sm:text-sm py-3.5 px-4 rounded-xl transition-all cursor-pointer shadow-xs flex items-center justify-center space-x-2 active:scale-95"
                >
                  <span>Decline</span>
                </button>
              </div>
            </div>
          ) : (
            /* Access Denied View */
            <div className="space-y-6 text-center py-2">
              <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-600 mx-auto flex items-center justify-center shadow-inner">
                <ShieldAlert className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  Access Denied
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-sm mx-auto">
                  In compliance with Australian regulatory standards, entry to this website is restricted exclusively to authorized researchers who have accepted our laboratory Terms of Use.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <button
                  onClick={handleReconsider}
                  className="w-full bg-slate-900 hover:bg-black text-white font-extrabold text-xs sm:text-sm py-3.5 px-4 rounded-xl transition-all cursor-pointer shadow-md flex items-center justify-center space-x-2 active:scale-95"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Review Terms Again</span>
                </button>

                <button
                  onClick={handleExit}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs sm:text-sm py-3 px-4 rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Leave Website</span>
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
