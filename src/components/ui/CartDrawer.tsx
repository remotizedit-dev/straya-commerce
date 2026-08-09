// 'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/lib/store';
import { formatAUD } from '@/lib/utils';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, ShieldCheck, Tag } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const router = useRouter();
  const {
    cart,
    isCartOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    cartSubtotal,
    cartCount,
  } = useApp();

  const handleShopMore = () => {
    closeCart();
    router.push('/products');
  };

  const handleCheckout = () => {
    closeCart();
    router.push('/checkout');
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            {/* Desktop Slide Drawer / Mobile Full Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-screen max-w-md bg-white border-l border-slate-200 shadow-2xl flex flex-col justify-between text-slate-900"
            >
              {/* Header */}
              <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-xl bg-[#FF007A]/10 text-[#FF007A] border border-[#FF007A]/30">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black uppercase text-slate-900 tracking-wide">
                      Your Research Cart
                    </h2>
                    <p className="text-xs text-[#00A8B8]">
                      {cartCount} {cartCount === 1 ? 'Item' : 'Items'} Selected
                    </p>
                  </div>
                </div>

                <button
                  onClick={closeCart}
                  className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-12 text-slate-500">
                    <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                      <ShoppingBag className="w-8 h-8 text-slate-400" />
                    </div>
                    <p className="text-base font-bold text-slate-900 mb-1">Your cart is currently empty</p>
                    <p className="text-xs text-slate-500 max-w-xs mb-6">
                      Explore Australia&apos;s highest purity research peptides catalog to add items.
                    </p>
                    <button
                      onClick={handleShopMore}
                      className="glow-pink-btn text-white text-xs font-bold px-6 py-3 rounded-xl cursor-pointer"
                    >
                      BROWSE ALL PEPTIDES
                    </button>
                  </div>
                ) : (
                  cart.map(({ product, quantity }) => {
                    const itemPrice = product.discountedPrice || product.price;
                    return (
                      <div
                        key={product.id}
                        className="flex items-center space-x-4 p-3.5 rounded-xl bg-white border border-slate-200 hover:border-[#FF007A]/40 transition-colors shadow-sm"
                      >
                        <div className="relative w-16 h-16 rounded-lg bg-slate-100 overflow-hidden shrink-0">
                          <Image
                            src={product.images[0] || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=800&auto=format&fit=crop'}
                            alt={product.title}
                            fill
                            className="object-cover"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-slate-900 truncate">{product.title}</h4>
                          <p className="text-[11px] text-[#00A8B8] font-mono mb-2">
                            {formatAUD(itemPrice)} / vial
                          </p>

                          {/* Quantity Controls */}
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center bg-slate-100 border border-slate-200 rounded-lg">
                              <button
                                onClick={() => updateQuantity(product.id, quantity - 1)}
                                className="p-1 text-slate-500 hover:text-slate-900 cursor-pointer"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="px-2 text-xs font-bold text-slate-900">{quantity}</span>
                              <button
                                onClick={() => updateQuantity(product.id, quantity + 1)}
                                className="p-1 text-slate-500 hover:text-slate-900 cursor-pointer"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <button
                              onClick={() => removeFromCart(product.id)}
                              className="text-slate-400 hover:text-red-500 p-1"
                              title="Remove item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-xs font-black text-slate-900">
                            {formatAUD(itemPrice * quantity)}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Drawer Footer with Action Buttons */}
              {cart.length > 0 && (
                <div className="p-6 border-t border-slate-200 bg-slate-50 space-y-4">
                  <div className="space-y-1.5 text-xs text-slate-600">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-mono text-slate-900">{formatAUD(cartSubtotal)}</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Shipping Calculated at Checkout</span>
                      <span className="text-[#00A8B8]">AU Post Express</span>
                    </div>
                    <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-200">
                      <span>Estimated Total</span>
                      <span className="text-[#00A8B8] text-base">{formatAUD(cartSubtotal)}</span>
                    </div>
                  </div>

                  {/* Two Buttons: Shop More & Check Out */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button
                      onClick={handleShopMore}
                      className="w-full py-3 px-4 rounded-xl bg-slate-100 border border-slate-200 hover:bg-slate-200 text-slate-900 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer text-center"
                    >
                      Shop More
                    </button>
                    <button
                      onClick={handleCheckout}
                      className="w-full glow-pink-btn text-white font-black text-xs py-3 px-4 rounded-xl uppercase tracking-wider flex items-center justify-center space-x-1.5 transition-all cursor-pointer shadow-lg"
                    >
                      <span>Check Out</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-[10px] text-slate-500 text-center flex items-center justify-center space-x-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#00A8B8]" />
                    <span>HPLC Certificate of Analysis Included With Every Order</span>
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};