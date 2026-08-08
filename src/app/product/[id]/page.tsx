'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useApp } from '@/lib/store';
import { formatAUD } from '@/lib/utils';
import { ShoppingBag, Star, ShieldCheck, Award, Tag, Plus, Minus, ChevronRight, CheckCircle2 } from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params?.id as string;
  const { products, addToCart } = useApp();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'specs' | 'description'>('specs');

  const product = products.find((p) => p.id === productId) || products[0];

  useEffect(() => {
    if (product.images.length <= 1) return;
    const interval = setInterval(() => {
      setSelectedImageIndex((prev) => (prev + 1) % product.images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [product.images]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-slate-900 bg-white">
        <h2 className="text-2xl font-bold">Product Not Found</h2>
        <Link href="/products" className="text-[#FF007A] hover:underline mt-4 inline-block">
          Return to All Peptides
        </Link>
      </div>
    );
  }

  const discountPercent = product.discountedPrice
    ? Math.round(((product.price - product.discountedPrice) / product.price) * 100)
    : 0;

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {/* Breadcrumbs */}
        <div className="flex items-center space-x-2 text-xs text-slate-500">
          <Link href="/" className="hover:text-slate-900">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/products" className="hover:text-slate-900">All Peptides</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#FF007A] font-bold truncate max-w-xs">{product.title}</span>
        </div>

        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left: Images */}
          <div className="space-y-4">
            <div className="relative aspect-square w-full bg-slate-50 rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
              {discountPercent > 0 && (
                <span className="absolute top-4 left-4 z-10 px-3 py-1 rounded-lg bg-[#FF007A] text-white text-xs font-black uppercase tracking-wider shadow-md">
                  SAVE {discountPercent}%
                </span>
              )}
              {product.purity && (
                <span className="absolute top-4 right-4 z-10 px-3 py-1 rounded-lg bg-slate-900/80 text-[#00F0FF] text-xs font-bold uppercase backdrop-blur-md">
                  {product.purity} HPLC
                </span>
              )}

              <Image
                src={product.images[selectedImageIndex] || product.images[0]}
                alt={product.title}
                fill
                priority
                className="object-cover transition-all duration-500"
              />
            </div>

            {product.images.length > 1 && (
              <div className="flex items-center space-x-3 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                      selectedImageIndex === idx
                        ? 'border-[#FF007A] shadow-md'
                        : 'border-slate-200 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <Image src={img} alt={`Thumbnail ${idx}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Info */}
          <div className="space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-xs">
                <span className="px-2.5 py-1 rounded-md bg-[#FF007A]/10 text-[#FF007A] font-bold uppercase tracking-wider">
                  {product.category}
                </span>
                <span className="text-slate-500 font-mono">• In Stock ({product.stock} Vials)</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight">
                {product.title}
              </h1>



              {/* Price Box */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500 block uppercase font-bold">Research Price</span>
                  <div className="flex items-baseline space-x-3">
                    <span className="text-3xl font-black text-slate-900">
                      {formatAUD(product.discountedPrice || product.price)}
                    </span>
                    {product.discountedPrice && product.discountedPrice < product.price && (
                      <span className="text-base text-slate-400 line-through">
                        {formatAUD(product.price)}
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-xs text-[#FF007A] bg-[#FF007A]/10 px-3 py-1.5 rounded-lg font-bold">
                  AU Express Shipping
                </span>
              </div>

              <p className="text-slate-600 text-sm leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <div className="flex items-center space-x-4">
                <div className="flex items-center bg-slate-100 border border-slate-200 rounded-xl p-1">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-2 text-slate-600 hover:text-slate-900"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 text-base font-black text-slate-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="p-2 text-slate-600 hover:text-slate-900"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={() => addToCart(product, quantity)}
                  className="flex-1 glow-pink-btn text-white font-black py-4 px-8 rounded-xl text-base uppercase tracking-wider flex items-center justify-center space-x-3 transition-all cursor-pointer shadow-lg"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>ADD TO CART ({formatAUD((product.discountedPrice || product.price) * quantity)})</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs text-slate-600 pt-2 font-medium">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#FF007A]" />
                  <span>Mass Spectrometry COA</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#FF007A]" />
                  <span>Cold Packaging Insulation</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Specifications Section */}
        <div className="space-y-6 pt-6 border-t border-slate-200">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Technical Specifications
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {(product.technicalSpecs && product.technicalSpecs.length > 0
              ? product.technicalSpecs
              : [
                  { label: 'COMPOUND NAME', value: product.title.split(' ')[0] },
                  { label: 'PURITY', value: product.purity || '99.79%' },
                  { label: 'FORM', value: 'White lyophilized powder' },
                  { label: 'TESTING METHOD', value: 'HPLC-MS' },
                ]
            ).map((spec, idx) => (
              <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1.5 hover:border-[#FF007A]/40 transition-all">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                  {spec.label}
                </span>
                <span className="text-base font-extrabold text-slate-900 font-mono block leading-snug">
                  {spec.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
