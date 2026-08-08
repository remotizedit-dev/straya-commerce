'use client';

import React from 'react';
import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import { useApp } from '@/lib/store';
import { ShoppingBag, PhoneCall, ShieldCheck, ArrowRight, Award, Zap, Sparkles } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { siteSettings, openCallModal } = useApp();

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.05,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  return (
    <div className="relative min-h-[88vh] flex flex-col justify-end overflow-hidden bg-slate-950 text-white select-none pb-12 pt-28">
      {/* Background Video or Image - Bright, Vibrant & Clear */}
      {siteSettings.heroMediaType === 'video' && siteSettings.heroMediaUrl ? (
        <video
          key={siteSettings.heroMediaUrl}
          autoPlay
          muted
          loop
          playsInline
          // @ts-ignore
          webkit-playsinline="true"
          x5-playsinline="true"
          controls={false}
          className="absolute inset-0 w-full h-full object-cover opacity-100 scale-100 filter brightness-110 saturate-125"
        >
          <source src={siteSettings.heroMediaUrl} type="video/mp4" />
        </video>
      ) : (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-100 filter brightness-110 saturate-125"
          style={{ backgroundImage: `url(${siteSettings.heroMediaUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1600&auto=format&fit=crop'})` }}
        />
      )}

      {/* Subtle Bottom Vignette for Text Contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

      {/* Ambient Motion Glow */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-10 left-1/4 w-96 h-96 bg-[#FF007A]/15 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="absolute bottom-10 right-1/4 w-96 h-96 bg-[#00F0FF]/15 rounded-full blur-3xl pointer-events-none"
      />

      {/* Main Content Box - Shifted Lower Down */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center mt-auto space-y-6"
      >
        {/* Australian Quality Badge */}
        <motion.div variants={itemVariants}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-slate-950/80 border border-[#00F0FF]/60 text-[#00F0FF] text-xs font-bold uppercase tracking-widest backdrop-blur-md shadow-2xl cursor-pointer"
          >
            <Award className="w-4 h-4 text-[#FF007A]" />
            <span>HPLC VERIFIED &gt;99% PURITY | AUSTRALIAN STOCK</span>
            <Sparkles className="w-3.5 h-3.5 text-[#00F0FF] animate-spin" />
          </motion.div>
        </motion.div>

        {/* Animated Hero Title */}
        {siteSettings.heroTitle && (
          <motion.h1
            variants={itemVariants}
            style={{ color: siteSettings.heroTextColor || '#FFFFFF' }}
            className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight leading-none drop-shadow-xl"
          >
            {siteSettings.heroTitle}
          </motion.h1>
        )}

        {/* Animated Subtitle */}
        {siteSettings.heroSubtitle && (
          <motion.p
            variants={itemVariants}
            className="text-slate-100 text-base sm:text-lg md:text-xl max-w-3xl font-medium leading-relaxed drop-shadow-md"
          >
            {siteSettings.heroSubtitle}
          </motion.p>
        )}

        {/* Hero CTA Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md sm:max-w-none pt-2"
        >
          {/* Shop Now Pink Button */}
          <Link href="/products" className="w-full sm:w-auto">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="glow-pink-btn text-white font-black text-base px-8 py-4 rounded-xl flex items-center justify-center space-x-3 group cursor-pointer shadow-2xl"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>SHOP NOW</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
            </motion.div>
          </Link>

          {/* Request For A Call Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={openCallModal}
            className="w-full sm:w-auto bg-white hover:bg-slate-100 text-slate-900 font-black text-base px-8 py-4 rounded-xl flex items-center justify-center space-x-3 transition-all cursor-pointer shadow-xl"
          >
            <PhoneCall className="w-5 h-5 text-[#FF007A]" />
            <span>REQUEST FOR A CALL</span>
          </motion.button>
        </motion.div>

        {/* Trust Badges Grid - Positioned Nicely at the Bottom */}
        <motion.div
          variants={itemVariants}
          className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-left text-xs text-slate-100 border border-white/15 pt-5 pb-5 px-6 w-full backdrop-blur-md bg-slate-950/70 rounded-2xl shadow-2xl"
        >
          <motion.div whileHover={{ y: -2 }} className="flex items-center space-x-3">
            <ShieldCheck className="w-6 h-6 text-[#00F0FF] shrink-0" />
            <div>
              <p className="text-white font-bold">100% Guaranteed Purity</p>
              <p className="text-[11px] text-slate-300">HPLC Certificate Included</p>
            </div>
          </motion.div>
          <motion.div whileHover={{ y: -2 }} className="flex items-center space-x-3">
            <Zap className="w-6 h-6 text-[#FF007A] shrink-0" />
            <div>
              <p className="text-white font-bold">Same-Day Express Dispatch</p>
              <p className="text-[11px] text-slate-300">Shipped from SYD & MEL</p>
            </div>
          </motion.div>
          <motion.div whileHover={{ y: -2 }} className="flex items-center space-x-3">
            <Award className="w-6 h-6 text-[#00F0FF] shrink-0" />
            <div>
              <p className="text-white font-bold">COA Transparency</p>
              <p className="text-[11px] text-slate-300">Full Batch Mass Spec</p>
            </div>
          </motion.div>
          <motion.div whileHover={{ y: -2 }} className="flex items-center space-x-3">
            <ShieldCheck className="w-6 h-6 text-[#FF007A] shrink-0" />
            <div>
              <p className="text-white font-bold">Australian Support</p>
              <p className="text-[11px] text-slate-300">Fast Local Response</p>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};
