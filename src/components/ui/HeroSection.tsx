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
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.7, ease: 'easeOut' },
    },
  };

  return (
    <div className="relative min-h-[82vh] flex items-center justify-center overflow-hidden bg-slate-950 text-white select-none">
      {/* Background Video or Image */}
      {siteSettings.heroMediaType === 'video' && siteSettings.heroMediaUrl ? (
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-50 scale-105 filter saturate-150"
        >
          <source src={siteSettings.heroMediaUrl} type="video/mp4" />
        </video>
      ) : (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-45 filter saturate-150"
          style={{ backgroundImage: `url(${siteSettings.heroMediaUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1600&auto=format&fit=crop'})` }}
        />
      )}

      {/* Dark Gradient Overlay for Contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-slate-950/90" />

      {/* Ambient Floating Motion Particles */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-24 left-1/4 w-96 h-96 bg-[#FF007A]/20 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="absolute -bottom-24 right-1/4 w-96 h-96 bg-[#00F0FF]/20 rounded-full blur-3xl pointer-events-none"
      />

      {/* Main Content Box */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center flex flex-col items-center"
      >
        {/* Australian Quality Badge */}
        <motion.div variants={itemVariants} className="inline-block mb-6">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/10 border border-[#00F0FF]/50 text-[#00F0FF] text-xs font-bold uppercase tracking-widest backdrop-blur-md shadow-lg cursor-pointer"
          >
            <Award className="w-4 h-4 text-[#FF007A]" />
            <span>HPLC Verified &gt;99% Purity | Australian Stock</span>
            <Sparkles className="w-3.5 h-3.5 text-[#00F0FF] animate-spin" />
          </motion.div>
        </motion.div>

        {/* Animated Hero Title */}
        {siteSettings.heroTitle && (
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-6xl md:text-7xl font-black text-white uppercase tracking-tight leading-none mb-6"
          >
            {siteSettings.heroTitle.split(' ').map((word, i) => {
              if (word.toLowerCase().includes('research') || word.toLowerCase().includes('peptide') || word.toLowerCase().includes('australia')) {
                return (
                  <span key={i} className="text-[#FF007A] inline-block mr-3">
                    {word}{' '}
                  </span>
                );
              }
              return <span key={i} className="mr-3">{word} </span>;
            })}
          </motion.h1>
        )}

        {/* Animated Subtitle */}
        {siteSettings.heroSubtitle && (
          <motion.p
            variants={itemVariants}
            className="text-slate-200 text-base sm:text-lg md:text-xl max-w-3xl font-light mb-10 leading-relaxed"
          >
            {siteSettings.heroSubtitle}
          </motion.p>
        )}

        {/* Hero CTA Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md sm:max-w-none"
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
            className="w-full sm:w-auto bg-white hover:bg-slate-100 text-slate-900 font-black text-base px-8 py-4 rounded-xl flex items-center justify-center space-x-3 transition-all cursor-pointer shadow-lg"
          >
            <PhoneCall className="w-5 h-5 text-[#FF007A]" />
            <span>REQUEST FOR A CALL</span>
          </motion.button>
        </motion.div>

        {/* Trust Badges Grid */}
        <motion.div
          variants={itemVariants}
          className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-6 text-left text-xs text-slate-300 border-t border-white/10 pt-8 w-full"
        >
          <motion.div whileHover={{ y: -2 }} className="flex items-center space-x-3">
            <ShieldCheck className="w-6 h-6 text-[#00F0FF] shrink-0" />
            <div>
              <p className="text-white font-bold">100% Guaranteed Purity</p>
              <p className="text-[11px] text-slate-400">HPLC Certificate Included</p>
            </div>
          </motion.div>
          <motion.div whileHover={{ y: -2 }} className="flex items-center space-x-3">
            <Zap className="w-6 h-6 text-[#FF007A] shrink-0" />
            <div>
              <p className="text-white font-bold">Same-Day Express Dispatch</p>
              <p className="text-[11px] text-slate-400">Shipped from SYD & MEL</p>
            </div>
          </motion.div>
          <motion.div whileHover={{ y: -2 }} className="flex items-center space-x-3">
            <Award className="w-6 h-6 text-[#00F0FF] shrink-0" />
            <div>
              <p className="text-white font-bold">COA Transparency</p>
              <p className="text-[11px] text-slate-400">Full Batch Mass Spec</p>
            </div>
          </motion.div>
          <motion.div whileHover={{ y: -2 }} className="flex items-center space-x-3">
            <ShieldCheck className="w-6 h-6 text-[#FF007A] shrink-0" />
            <div>
              <p className="text-white font-bold">Australian Support</p>
              <p className="text-[11px] text-slate-400">Fast Local Response</p>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};
