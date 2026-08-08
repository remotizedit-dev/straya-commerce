'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useApp } from '@/lib/store';
import { HeroSection } from '@/components/ui/HeroSection';
import { ProductCard } from '@/components/ui/ProductCard';
import { Search, Flame, Award, ShieldAlert, Sparkles, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';

export default function HomePage() {
  const { products, siteSettings, searchQuery, setSearchQuery } = useApp();

  const bestSaleProducts = products
    .filter((p) => p.type === 'best_sell' || p.rating! >= 4.85)
    .filter((p) => p.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .slice(0, 4);

  const featuredProducts = products
    .filter((p) => p.type === 'featured' || p.category === 'Blends & Complexes' || p.category === 'Anti-Aging & Cellular')
    .filter((p) => p.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .slice(0, 4);

  const searchedProducts = searchQuery.trim()
    ? products.filter((p) => p.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : null;

  return (
    <div className="bg-white text-slate-900 space-y-16 pb-20">
      {/* Hero Section */}
      <HeroSection />

      {/* 6/ Functional Search Bar Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3 w-full md:w-auto">
            <div className="p-3 rounded-xl bg-[#FF007A]/10 text-[#FF007A] shrink-0">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Instant Product Lookup
              </h3>
              <p className="text-xs text-slate-500">Search by peptide sequence, name or CAS number</p>
            </div>
          </div>

          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Search BPC-157, Semaglutide, GHK-Cu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 text-slate-900 text-sm px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-[#FF007A] transition-colors pr-10"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 text-xs font-bold"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Search Results Drawer Overlay */}
        {searchedProducts && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-6 rounded-2xl bg-white border border-[#FF007A]/40 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-sm font-bold text-slate-900">
                Found {searchedProducts.length} Product{searchedProducts.length === 1 ? '' : 's'} matching &quot;{searchQuery}&quot;
              </span>
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-[#FF007A] font-bold hover:underline cursor-pointer"
              >
                Reset Search
              </button>
            </div>

            {searchedProducts.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">
                No research peptides matching your query. Try searching for &quot;BPC-157&quot; or &quot;Semaglutide&quot;.
              </p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {searchedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </section>

      {/* 7/ Best Peptides in Australia Intro Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-slate-50 border border-slate-200 p-8 sm:p-12 overflow-hidden shadow-sm">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-2 space-y-4">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#FF007A]/10 border border-[#FF007A]/30 text-[#FF007A] text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Australian Certified Quality</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 uppercase tracking-tight">
                {siteSettings.introTitle || 'Best Peptides in Australia'}
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                {siteSettings.introText}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="flex items-center space-x-2 text-xs font-semibold text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-[#FF007A] shrink-0" />
                  <span>&gt;99% HPLC Verified</span>
                </div>
                <div className="flex items-center space-x-2 text-xs font-semibold text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-[#FF007A] shrink-0" />
                  <span>Overnight Express Post</span>
                </div>
                <div className="flex items-center space-x-2 text-xs font-semibold text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-[#FF007A] shrink-0" />
                  <span>Discreet Cold Packaging</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white border border-slate-200 text-center space-y-4 shadow-sm">
              <Award className="w-12 h-12 text-[#FF007A]" />
              <div>
                <h4 className="text-slate-900 font-extrabold text-base uppercase">HPLC Verified</h4>
                <p className="text-xs text-slate-500">Full Batch Mass Spectrometry Transparency</p>
              </div>
              <Link
                href="/coa"
                className="w-full py-2.5 px-4 rounded-xl glow-pink-btn text-white font-extrabold text-xs tracking-wider uppercase"
              >
                VIEW COA REPORTS
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 8/ Best Sale Section (4 items desktop / 2 items mobile) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <div className="flex items-center space-x-2 text-[#FF007A] font-bold text-xs uppercase tracking-widest mb-1">
              <Flame className="w-4 h-4 fill-current" />
              <span>Top Demanded Compounds</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase tracking-tight">
              Best Sale Peptides
            </h2>
          </div>

          <Link
            href="/products"
            className="text-xs font-bold text-[#FF007A] hover:underline flex items-center space-x-1 group"
          >
            <span>View All Compounds</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Product Cards Grid: 4 items desktop / 2 items mobile */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {bestSaleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 9/ Disclaimer Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 sm:p-8 rounded-2xl bg-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-start space-x-4">
            <div className="p-3 rounded-xl bg-[#FF007A]/20 text-[#FF007A] shrink-0">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-extrabold text-white uppercase tracking-wider">
                Laboratory Research Notice
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed max-w-4xl">
                {siteSettings.disclaimerText}
              </p>
            </div>
          </div>

          <Link
            href="/faq"
            className="shrink-0 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors"
          >
            Compliance FAQ
          </Link>
        </div>
      </section>

      {/* 10/ Featured Products Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <div className="flex items-center space-x-2 text-[#FF007A] font-bold text-xs uppercase tracking-widest mb-1">
              <Zap className="w-4 h-4" />
              <span>Laboratory Spotlight</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase tracking-tight">
              Featured Research Products
            </h2>
          </div>

          <Link
            href="/products"
            className="text-xs font-bold text-[#FF007A] hover:underline flex items-center space-x-1 group"
          >
            <span>Explore Full Catalog</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Featured Product Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
