'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/lib/store';
import { ShoppingBag, Search, Menu, X } from 'lucide-react';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { cartCount, openCart, searchQuery, setSearchQuery, siteSettings } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'All Peptides', href: '/products' },
    { name: 'Certificate of Analysis', href: '/coa' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Contact Us', href: '/contact' },
    { name: 'Track Order', href: '/track' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-black border-b border-white/10 shadow-2xl select-none">
      {/* Tier 1: Absolute Center Logo + Animated Expanding Search Icon on Left */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between relative border-b border-white/5 min-h-[72px]">
        {/* Left Side: Animated Expanding Search Bar on Hover/Click */}
        <div className="flex items-center">
          <div className="relative flex items-center">
            {isSearchOpen ? (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 220, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className="flex items-center"
              >
                <input
                  type="text"
                  placeholder="Search peptides..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#111622] text-white text-xs px-3.5 py-2 rounded-l-xl border border-[#FF007A]/50 focus:outline-none focus:border-[#00F0FF] placeholder:text-slate-400"
                  autoFocus
                />
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="bg-[#111622] border-y border-r border-[#FF007A]/50 px-2.5 py-2 rounded-r-xl text-gray-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            ) : (
              <button
                onClick={() => setIsSearchOpen(true)}
                onMouseEnter={() => setIsSearchOpen(true)}
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors cursor-pointer border border-white/10 flex items-center space-x-2 group"
                title="Search peptides"
              >
                <Search className="w-5 h-5 text-[#00F0FF] group-hover:scale-110 transition-transform" />
                <span className="text-xs font-semibold text-slate-300 hidden sm:inline">Search</span>
              </button>
            )}
          </div>
        </div>

        {/* Absolute Dead Center Screen Logo */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center z-10">
          <Link href="/" className="flex items-center justify-center group">
            {siteSettings.logoUrl ? (
              <div className="relative h-14 w-44 sm:h-16 sm:w-56 group-hover:scale-105 transition-transform duration-300">
                <Image src={siteSettings.logoUrl} alt="Brand Logo" fill className="object-contain" />
              </div>
            ) : (
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-[#FF007A] to-[#00F0FF] p-0.5 shadow-[0_0_25px_rgba(255,0,122,0.5)] group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-[#09090D] rounded-[14px] flex items-center justify-center font-black text-2xl text-white">
                  S
                </div>
              </div>
            )}
          </Link>
        </div>

        {/* Right Side: Cart Counter Button & Mobile Menu */}
        <div className="flex items-center space-x-3">
          {/* Cart Counter Button */}
          <button
            onClick={openCart}
            className="relative p-2.5 rounded-xl glow-pink-btn text-white flex items-center justify-center cursor-pointer shadow-lg"
            title="View Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#00F0FF] text-black font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow-[0_0_8px_#00F0FF]">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2.5 rounded-xl bg-white/5 text-gray-300 hover:text-white cursor-pointer border border-white/10"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Tier 2: Next Line Centered Navigation Bar */}
      <div className="hidden lg:block bg-black py-2.5">
        <nav className="max-w-7xl mx-auto px-4 flex items-center justify-center space-x-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-5 py-2 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors ${
                  isActive ? 'text-white font-extrabold' : 'text-slate-300 hover:text-white'
                }`}
              >
                {link.name}
                {isActive && (
                  <motion.div
                    layoutId="activeNavTab"
                    className="absolute inset-0 bg-[#FF007A]/20 border border-[#FF007A]/50 rounded-xl -z-10 shadow-[0_0_15px_rgba(255,0,122,0.3)]"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-black border-b border-white/10 px-4 pt-2 pb-6 space-y-3"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-lg text-base font-medium ${
                  pathname === link.href
                    ? 'bg-[#FF007A]/20 text-white font-bold border border-[#FF007A]/40'
                    : 'text-gray-300 hover:bg-white/5'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
