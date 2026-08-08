'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { ProductCard } from '@/components/ui/ProductCard';
import { Filter, Search, SlidersHorizontal, Grid, Tag } from 'lucide-react';

export default function AllPeptidesPage() {
  const { products, siteSettings, selectedCategory, setSelectedCategory, searchQuery, setSearchQuery } = useApp();
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'purity'>('featured');

  let filtered = products.filter((product) => {
    const matchesCategory =
      selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch =
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (sortBy === 'price-asc') {
    filtered.sort((a, b) => (a.discountedPrice || a.price) - (b.discountedPrice || b.price));
  } else if (sortBy === 'price-desc') {
    filtered.sort((a, b) => (b.discountedPrice || b.price) - (a.discountedPrice || a.price));
  } else if (sortBy === 'purity') {
    filtered.sort((a, b) => (b.purity || '').localeCompare(a.purity || ''));
  }

  const allCategories = ['All', ...(siteSettings.categories || [])];

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        {/* Header Banner */}
        <div className="relative rounded-3xl bg-slate-900 text-white p-8 sm:p-12 overflow-hidden shadow-xl text-center">
          <div className="relative z-10 max-w-3xl mx-auto space-y-3 flex flex-col items-center justify-center">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#FF007A]/20 text-[#FF007A] text-xs font-bold uppercase tracking-wider">
              <Grid className="w-3.5 h-3.5" />
              <span>HPLC Tested Catalog</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-center">
              All Research Peptides
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed text-center max-w-2xl">
              Browse Australia&apos;s complete catalog of high-purity laboratory compounds. Every product includes batch-specific HPLC mass spectrometry verification.
            </p>
          </div>
        </div>

        {/* Category Dropdown & Search Bar */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-3 w-full md:w-auto">
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-700 shrink-0">
              <Filter className="w-4 h-4 text-[#FF007A]" />
              <span>Category:</span>
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full sm:w-auto bg-slate-50 text-slate-900 text-xs font-bold px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#FF007A] cursor-pointer"
            >
              {allCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-3 w-full md:w-auto">
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 text-slate-900 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#FF007A]"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            </div>

            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <SlidersHorizontal className="w-4 h-4 text-[#FF007A] shrink-0" />
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="w-full sm:w-auto bg-slate-50 text-slate-900 text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none cursor-pointer font-semibold"
              >
                <option value="featured">Sort: Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="purity">Highest Purity</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {filtered.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-slate-50 border border-slate-200 text-slate-500">
            <Tag className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-900 mb-1">No Peptides Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
              Try resetting your search query or selecting a different category from the dropdown above.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="glow-pink-btn text-white text-xs font-bold px-5 py-2.5 rounded-xl cursor-pointer"
            >
              RESET FILTERS
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
