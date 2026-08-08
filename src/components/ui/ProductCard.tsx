'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Product } from '@/lib/types';
import { useApp } from '@/lib/store';
import { formatAUD } from '@/lib/utils';
import { ShoppingBag, Star, Tag, Sparkles } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useApp();

  const discountPercent = product.discountedPrice
    ? Math.round(((product.price - product.discountedPrice) / product.price) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      whileHover={{ y: -8, scale: 1.015 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
      className="group relative flex flex-col bg-white rounded-2xl border border-slate-200 hover:border-[#FF007A]/50 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300"
    >
      {/* Badges Overlay */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 pointer-events-none">
        {discountPercent > 0 && (
          <motion.span
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="px-2.5 py-1 rounded-md bg-[#FF007A] text-white text-[10px] font-black uppercase tracking-wider shadow-md flex items-center space-x-1"
          >
            <Tag className="w-3 h-3" />
            <span>SAVE {discountPercent}%</span>
          </motion.span>
        )}
        {product.purity && (
          <span className="px-2.5 py-1 rounded-md bg-slate-900/90 border border-slate-700 text-[#00F0FF] text-[10px] font-bold uppercase tracking-wider backdrop-blur-md shadow-sm">
            {product.purity} HPLC
          </span>
        )}
      </div>

      {/* Product Image Container */}
      <Link href={`/product/${product.id}`} className="relative block aspect-square w-full bg-slate-50 overflow-hidden">
        <Image
          src={product.images[0] || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=800&auto=format&fit=crop'}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
        />
        {/* Subtle Ambient Hover Glow */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </Link>

      {/* Product Details */}
      <div className="flex flex-col flex-grow p-4 sm:p-5">
        <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
          <span className="text-[#FF007A] font-bold uppercase tracking-wider truncate max-w-[70%] flex items-center space-x-1">
            <Sparkles className="w-3 h-3 shrink-0" />
            <span className="truncate">{product.category}</span>
          </span>
          {product.dosage && <span className="text-slate-400 font-mono text-[10px]">{product.dosage}</span>}
        </div>

        <Link href={`/product/${product.id}`} className="block mb-2 group-hover:text-[#FF007A] transition-colors">
          <h3 className="text-sm sm:text-base font-bold text-slate-900 line-clamp-2 leading-snug">
            {product.title}
          </h3>
        </Link>

        {/* Rating */}
        {product.rating && (
          <div className="flex items-center space-x-1 mb-3 text-xs text-amber-500">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span className="font-bold text-slate-800">{product.rating}</span>
            <span className="text-slate-400">({product.reviewsCount || 42})</span>
          </div>
        )}

        <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between">
          {/* Price Tag */}
          <div className="flex flex-col">
            <div className="flex items-baseline space-x-2">
              <span className="text-base sm:text-lg font-black text-slate-900">
                {formatAUD(product.discountedPrice || product.price)}
              </span>
              {product.discountedPrice && product.discountedPrice < product.price && (
                <span className="text-xs text-slate-400 line-through">
                  {formatAUD(product.price)}
                </span>
              )}
            </div>
            <span className="text-[10px] text-slate-400">Inc. GST</span>
          </div>

          {/* Quick Add to Cart Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => addToCart(product, 1)}
            className="p-2.5 sm:px-3.5 sm:py-2 rounded-xl glow-pink-btn text-white text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer shadow-md"
            title="Add to Cart"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Add</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
