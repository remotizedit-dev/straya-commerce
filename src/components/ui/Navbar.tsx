'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/lib/store';
import { ShoppingBag, Search, Menu, X } from 'lucide-react';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { cartCount, openCart, siteSettings } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'All Peptides', href: '/products' },
    { name: 'Certificate of Analysis', href: '/coa' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Contact Us', href: '/contact' },
    { name: 'Track Order', href: '/track' },
  ];

  const handleSearchClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (pathname === '/') {
      const el = document.getElementById('search-lookup') || document.getElementById('products');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const inputEl = el.querySelector('input');
        if (inputEl) inputEl.focus();
      }
    } else {
      router.push('/#search-lookup');
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-slate-200 shadow-sm select-none">
      {/* Tier 1: Left Search Icon Only, Center Logo, Right Cart */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between relative border-b border-slate-100 min-h-[72px]">
        {/* Left Side: Search Icon Only (Click redirects/scrolls to homepage search section) */}
        <div className="flex items-center">
          <button
            onClick={handleSearchClick}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors cursor-pointer border border-slate-200 flex items-center justify-center group"
            title="Search Products on Homepage"
          >
            <Search className="w-5 h-5 text-[#FF007A] group-hover:scale-110 transition-transform" />
          </button>
        </div>

        {/* Absolute Dead Center Screen Logo */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center z-10">
          <Link href="/" className="flex items-center justify-center group">
            {siteSettings.logoUrl ? (
              <div className="relative h-14 w-44 sm:h-16 sm:w-56 group-hover:scale-105 transition-transform duration-300">
                <Image src={siteSettings.logoUrl} alt="Brand Logo" fill className="object-contain" />
              </div>
            ) : (
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-[#FF007A] to-[#00F0FF] p-0.5 shadow-md group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center font-black text-2xl text-slate-900">
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
            className="relative p-2.5 rounded-xl glow-pink-btn text-white flex items-center justify-center cursor-pointer shadow-md"
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
            className="lg:hidden p-2.5 rounded-xl bg-slate-100 text-slate-800 hover:text-black cursor-pointer border border-slate-200"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Tier 2: Next Line Centered Navigation Bar */}
      <div className="hidden lg:block bg-white py-2">
        <nav className="max-w-7xl mx-auto px-4 flex items-center justify-center space-x-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-5 py-2 rounded-xl text-xs sm:text-sm font-extrabold uppercase tracking-wider transition-colors ${
                  isActive ? 'text-[#FF007A]' : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                {link.name}
                {isActive && (
                  <motion.div
                    layoutId="activeNavTab"
                    className="absolute inset-0 bg-[#FF007A]/10 border border-[#FF007A]/30 rounded-xl -z-10"
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
            className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-2 text-center"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-lg text-base font-bold ${
                  pathname === link.href
                    ? 'bg-[#FF007A]/10 text-[#FF007A] font-extrabold border border-[#FF007A]/30'
                    : 'text-slate-700 hover:bg-slate-100'
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
