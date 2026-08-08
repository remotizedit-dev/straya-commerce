'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/lib/store';
import { ShoppingBag, Search, Menu, X, ShieldCheck, PhoneCall } from 'lucide-react';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { cartCount, openCart, searchQuery, setSearchQuery, openCallModal, siteSettings } = useApp();
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
    <header className="sticky top-0 z-40 w-full bg-black/90 backdrop-blur-md border-b border-white/10 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF007A] to-[#00F0FF] p-0.5 shadow-[0_0_15px_rgba(255,0,122,0.4)] group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#09090D] rounded-[10px] flex items-center justify-center font-black text-xl text-white">
              S
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-black text-xl sm:text-2xl tracking-wider text-white">
              STRAYA<span className="text-[#FF007A]">.</span>
            </span>
            <span className="text-[9px] tracking-widest text-[#00F0FF] uppercase font-bold -mt-1">
              Peptides Australia
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'text-white font-bold' : 'text-gray-300 hover:text-white'
                }`}
              >
                {link.name}
                {isActive && (
                  <motion.div
                    layoutId="activeNavTab"
                    className="absolute inset-0 bg-[#FF007A]/15 border border-[#FF007A]/40 rounded-lg -z-10 shadow-[0_0_12px_rgba(255,0,122,0.2)]"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Action Icons & Buttons */}
        <div className="flex items-center space-x-3">
          {/* Quick Search Toggle */}
          <div className="relative">
            {isSearchOpen ? (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 220, opacity: 1 }}
                className="flex items-center"
              >
                <input
                  type="text"
                  placeholder="Search peptides..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#151520] text-white text-xs px-3 py-2 rounded-l-lg border border-[#FF007A]/50 focus:outline-none focus:border-[#00F0FF]"
                  autoFocus
                />
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="bg-[#151520] border-y border-r border-[#FF007A]/50 px-2 py-2 rounded-r-lg text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            ) : (
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors cursor-pointer"
                title="Search products"
              >
                <Search className="w-5 h-5 text-[#00F0FF]" />
              </button>
            )}
          </div>

          {/* Request Call Quick Button */}
          <button
            onClick={openCallModal}
            className="hidden sm:flex items-center space-x-2 text-xs font-semibold px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-[#FF007A]/40 text-gray-200 hover:text-white transition-all cursor-pointer"
          >
            <PhoneCall className="w-3.5 h-3.5 text-[#FF007A]" />
            <span>Request Call</span>
          </button>

          {/* Cart Counter Button */}
          <button
            onClick={openCart}
            className="relative p-2.5 rounded-lg glow-pink-btn text-white flex items-center justify-center cursor-pointer"
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
            className="lg:hidden p-2 rounded-lg bg-white/5 text-gray-300 hover:text-white"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-black/95 border-b border-white/10 px-4 pt-2 pb-6 space-y-3"
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
            <div className="pt-2">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  openCallModal();
                }}
                className="w-full flex items-center justify-center space-x-2 py-3 rounded-lg bg-gradient-to-r from-[#FF007A] to-[#00F0FF] text-white font-bold text-sm shadow-md"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Request Call Back</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
