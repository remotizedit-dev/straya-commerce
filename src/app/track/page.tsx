'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useApp } from '@/lib/store';
import { Order } from '@/lib/types';
import { formatAUD } from '@/lib/utils';
import { InvoiceModal } from '@/components/ui/InvoiceModal';
import {
  Truck,
  Search,
  PackageCheck,
  CreditCard,
  Building,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('id') || searchParams.get('orderId') || '';

  const { orders, siteSettings } = useApp();
  const [query, setQuery] = useState(initialQuery);
  const [matchedOrders, setMatchedOrders] = useState<Order[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<Order | null>(null);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) {
      setMatchedOrders([]);
      setHasSearched(false);
      return;
    }

    const found = orders.filter((o) => {
      const matchId = o.id.toLowerCase().includes(trimmed);
      const matchEmail = o.customer.email.toLowerCase().includes(trimmed);
      return matchId || matchEmail;
    });

    setMatchedOrders(found);
    setHasSearched(true);
  };

  useEffect(() => {
    if (initialQuery) {
      handleSearch();
    }
  }, [initialQuery, orders]);

  // Stage indicator calculation
  const getStageIndex = (status: Order['deliveryStatus']) => {
    switch (status) {
      case 'Payment Received':
        return 1;
      case 'Processing':
        return 2;
      case 'Shipped':
        return 3;
      case 'Delivered':
        return 4;
      default:
        return 1;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#FF007A]/10 text-[#FF007A] text-xs font-bold uppercase tracking-wider">
          <Truck className="w-4 h-4" />
          <span>Australia Post Express Tracking</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 uppercase tracking-tight">
          Track Your Research Order
        </h1>
        <p className="text-slate-600 text-sm max-w-lg mx-auto leading-relaxed">
          Enter your Order Number (e.g. STRAYA-894102) or Email Address to check real-time payment status, laboratory dispatch stage, and download official invoices.
        </p>
      </div>

      {/* Search Input Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-lg space-y-4">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Enter Order ID (STRAYA-XXXXXX) or Email Address..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm text-slate-900 focus:outline-none focus:border-[#FF007A] pr-12 font-medium"
            />
            <Search className="w-5 h-5 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2" />
          </div>

          <button
            type="submit"
            className="glow-pink-btn text-white font-black text-sm px-8 py-4 rounded-2xl uppercase tracking-wider flex items-center justify-center space-x-2 cursor-pointer shadow-lg shrink-0"
          >
            <span>Track Order</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Search Results */}
      {hasSearched && (
        <div className="space-y-6">
          {matchedOrders.length === 0 ? (
            <div className="p-10 rounded-3xl bg-slate-50 border border-slate-200 text-center space-y-3">
              <AlertCircle className="w-12 h-12 text-slate-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-900">No Orders Found for &quot;{query}&quot;</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Please verify your Order ID (e.g. STRAYA-894102) or the email address used during checkout.
              </p>
            </div>
          ) : (
            matchedOrders.map((order) => {
              const stageIdx = getStageIndex(order.deliveryStatus);
              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xl space-y-6"
                >
                  {/* Top Order Card Header */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-100 pb-4 gap-2">
                    <div>
                      <div className="flex items-center space-x-3">
                        <span className="text-xs font-bold text-slate-400 uppercase">ORDER ID</span>
                        <span className="text-xl font-black text-[#FF007A] font-mono">{order.id}</span>
                      </div>
                      <span className="text-xs text-slate-500 font-mono">
                        Placed on: {new Date(order.createdAt).toLocaleDateString('en-AU', { dateStyle: 'medium' })}
                      </span>
                    </div>

                    <div className="flex items-center space-x-3">
                      {/* Payment Status Badge */}
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-black uppercase border ${
                          order.paymentStatus === 'paid'
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                            : 'bg-amber-50 text-amber-600 border-amber-200'
                        }`}
                      >
                        Payment: {order.paymentStatus}
                      </span>

                      <span className="text-base font-black text-slate-900 font-mono">
                        {formatAUD(order.totalAmount)}
                      </span>
                    </div>
                  </div>

                  {/* Visual Status Progress Tracker */}
                  <div className="space-y-3 py-2">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                      <span>Dispatch Stage:</span>
                      <span className="text-[#FF007A] uppercase">{order.deliveryStatus}</span>
                    </div>

                    <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-bold">
                      <div className={`p-2 rounded-xl border ${stageIdx >= 1 ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
                        1. Payment Received
                      </div>
                      <div className={`p-2 rounded-xl border ${stageIdx >= 2 ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
                        2. Lab Processing
                      </div>
                      <div className={`p-2 rounded-xl border ${stageIdx >= 3 ? 'bg-[#FF007A] text-white border-[#FF007A]' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
                        3. Express Shipped (On Way)
                      </div>
                      <div className={`p-2 rounded-xl border ${stageIdx >= 4 ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
                        4. Delivered
                      </div>
                    </div>
                  </div>

                  {/* Unpaid Warning & Bank Details Shortcut */}
                  {order.paymentStatus === 'unpaid' && (
                    <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-2">
                      <div className="flex items-center space-x-2 font-bold">
                        <Building className="w-4 h-4 text-amber-600" />
                        <span>Bank Transfer Required for Dispatch</span>
                      </div>
                      <p className="text-[11px] leading-relaxed">
                        Please transfer <strong>{formatAUD(order.totalAmount)}</strong> to NAB Account <strong>{siteSettings.bankInfo.accountNumber}</strong> (BSB: {siteSettings.bankInfo.bsb}) or PayID <strong>{siteSettings.bankInfo.payId}</strong> with description <strong>{order.id}</strong>.
                      </p>
                    </div>
                  )}

                  {/* Order Items List */}
                  <div className="space-y-3 pt-2">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ordered Compounds</h4>
                    <div className="space-y-2">
                      {order.items.map(({ product, quantity }) => (
                        <div key={product.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                          <div className="flex items-center space-x-3">
                            <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-slate-200 shrink-0">
                              <Image
                                src={product.images[0] || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=800&auto=format&fit=crop'}
                                alt={product.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <p className="font-bold text-slate-900">{product.title}</p>
                              <span className="text-slate-500">Qty: {quantity}</span>
                            </div>
                          </div>
                          <span className="font-mono text-slate-900 font-bold">
                            {formatAUD((product.discountedPrice || product.price) * quantity)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Export PNG Invoice Action Button */}
                  <div className="pt-3 border-t border-slate-100 flex justify-end">
                    <button
                      onClick={() => {
                        setSelectedOrderForInvoice(order);
                        setIsInvoiceOpen(true);
                      }}
                      className="glow-pink-btn text-white text-xs font-bold px-6 py-3 rounded-xl flex items-center space-x-2 cursor-pointer shadow-md"
                    >
                      <FileText className="w-4 h-4" />
                      <span>View / Download Official Invoice</span>
                    </button>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      )}

      {/* Invoice Modal Lightbox */}
      {selectedOrderForInvoice && (
        <InvoiceModal
          order={selectedOrderForInvoice}
          isOpen={isInvoiceOpen}
          onClose={() => {
            setIsInvoiceOpen(false);
            setSelectedOrderForInvoice(null);
          }}
        />
      )}
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <div className="bg-white min-h-screen select-none">
      <Suspense fallback={<div className="p-12 text-center text-xs text-slate-500">Loading order tracker...</div>}>
        <TrackOrderContent />
      </Suspense>
    </div>
  );
}
