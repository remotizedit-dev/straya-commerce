'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useApp } from '@/lib/store';
import { DeliveryOption, Order } from '@/lib/types';
import { formatAUD } from '@/lib/utils';
import { InvoiceModal } from '@/components/ui/InvoiceModal';
import { ShieldCheck, Truck, Tag, CreditCard, Building, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function CheckoutPage() {
  const router = useRouter();
  const {
    cart,
    cartSubtotal,
    siteSettings,
    validatePromoCode,
    createOrder,
  } = useApp();

  const statesAU = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT'];

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [suburb, setSuburb] = useState('');
  const [state, setState] = useState('NSW');
  const [postcode, setPostcode] = useState('');

  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);

  const deliveryOptions = siteSettings.deliveryOptions || [];
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryOption>(
    deliveryOptions[0] || { id: 'std', name: 'Australia Post Standard', description: '3-5 Days', price: 12.00 }
  );

  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{
    code: string;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    discountAmount: number;
  } | null>(null);
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');

  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const calculateDiscount = (subtotal: number, promo: typeof appliedPromo) => {
    if (!promo) return 0;
    if (promo.discountType === 'percentage') {
      return (subtotal * promo.discountValue) / 100;
    }
    return Math.min(subtotal, promo.discountValue);
  };

  const discountAmount = calculateDiscount(cartSubtotal, appliedPromo);
  const deliveryFee = selectedDelivery ? selectedDelivery.price : 0;
  const totalAmount = Math.max(0, cartSubtotal - discountAmount + deliveryFee);

  const handleApplyPromo = () => {
    setPromoError('');
    setPromoSuccess('');
    if (!promoInput) return;

    const validated = validatePromoCode(promoInput);
    if (!validated) {
      setPromoError('Invalid or expired promo code.');
      setAppliedPromo(null);
      return;
    }

    let amt = 0;
    if (validated.discountType === 'percentage') {
      amt = (cartSubtotal * validated.discountValue) / 100;
    } else {
      amt = Math.min(cartSubtotal, validated.discountValue);
    }

    setAppliedPromo({
      code: validated.code,
      discountType: validated.discountType,
      discountValue: validated.discountValue,
      discountAmount: amt,
    });
    setPromoSuccess(`Applied ${validated.code}! Saved ${formatAUD(amt)}`);
  };

  const handleProceedToPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !phone || !street || !suburb || !postcode) {
      setFormError('Please fill out all required shipping fields.');
      return;
    }

    if (cart.length === 0 && !createdOrder) {
      setFormError('Your cart is empty.');
      return;
    }

    setIsSubmitting(true);
    setFormError('');

    try {
      const order = await createOrder({
        customer: {
          firstName,
          lastName,
          email,
          phone,
          address: {
            street,
            suburb,
            state,
            postcode,
            country: 'Australia',
          },
        },
        billingSameAsShipping,
        items: cart,
        subtotal: cartSubtotal,
        deliveryOption: selectedDelivery,
        promoCode: appliedPromo || undefined,
        totalAmount,
        paymentStatus: 'unpaid',
        deliveryStatus: 'Payment Received',
      });

      setCreatedOrder(order);
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (err) {
      setFormError('Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div>
            <Link href="/products" className="text-xs text-slate-500 hover:text-slate-900 flex items-center space-x-1 mb-2">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to All Peptides</span>
            </Link>
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">
              Checkout & Order Review
            </h1>
          </div>

          <div className="flex items-center space-x-2 text-xs text-[#FF007A] font-bold">
            <ShieldCheck className="w-5 h-5" />
            <span className="hidden sm:inline">Encrypted Australian Checkout</span>
          </div>
        </div>

        {createdOrder ? (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-3xl mx-auto space-y-6"
          >
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 text-center space-y-4 shadow-md">
              <CheckCircle2 className="w-16 h-16 text-[#FF007A] mx-auto animate-bounce" />
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block">ORDER PLACED SUCCESSFULLY</span>
              <h2 className="text-4xl font-black text-[#FF007A] font-mono">{createdOrder.id}</h2>
              <p className="text-sm text-slate-700">
                Thank you, <strong className="text-slate-900">{createdOrder.customer.firstName}</strong>. Your order is registered in our system.
              </p>
              <div className="inline-block px-4 py-2 rounded-xl bg-white border border-slate-200 text-lg font-black text-slate-900 font-mono shadow-sm">
                Total Due: <span className="text-[#FF007A]">{formatAUD(createdOrder.totalAmount)}</span>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-slate-200 space-y-6 shadow-md">
              <div className="flex items-center space-x-3 border-b border-slate-100 pb-4">
                <div className="p-3 rounded-xl bg-[#FF007A]/10 text-[#FF007A]">
                  <Building className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 uppercase">Bank Transfer & PayID Instructions</h3>
                  <p className="text-xs text-slate-500">Managed via Straya CMS Site Settings</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono bg-slate-50 p-5 rounded-2xl border border-slate-200">
                <div>
                  <span className="text-slate-500 block">Bank Name:</span>
                  <strong className="text-slate-900 text-sm">{siteSettings.bankInfo.bankName}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Account Name:</span>
                  <strong className="text-slate-900 text-sm">{siteSettings.bankInfo.accountName}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">BSB Number:</span>
                  <strong className="text-slate-900 text-sm">{siteSettings.bankInfo.bsb}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Account Number:</span>
                  <strong className="text-slate-900 text-sm">{siteSettings.bankInfo.accountNumber}</strong>
                </div>
                <div className="sm:col-span-2 pt-2 border-t border-slate-200">
                  <span className="text-slate-500 block">PayID Email:</span>
                  <strong className="text-[#FF007A] text-sm">{siteSettings.bankInfo.payId}</strong>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
                <strong className="text-slate-900 block mb-1">Payment Reference Notice:</strong>
                {siteSettings.bankInfo.instructions}
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setIsInvoiceOpen(true)}
                  className="w-full glow-pink-btn text-white font-black text-sm py-4 px-6 rounded-2xl uppercase tracking-wider flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-lg"
                >
                  <CreditCard className="w-5 h-5" />
                  <span>CONFIRM PAYMENT & GENERATE INVOICE</span>
                </button>
              </div>
            </div>

            <InvoiceModal
              order={createdOrder}
              isOpen={isInvoiceOpen}
              onClose={() => setIsInvoiceOpen(false)}
            />
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Form */}
            <form onSubmit={handleProceedToPayment} className="lg:col-span-7 space-y-8">
              {formError && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-3">
                  1. Customer & Shipping Address (Australia)
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">First Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Harrison"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#FF007A]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Last Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Vance"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#FF007A]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="harrison@vance.com.au"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#FF007A]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Australian Phone *</label>
                    <input
                      type="tel"
                      required
                      placeholder="0412 884 920"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#FF007A]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Street Address *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 42 Macquarie Street"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#FF007A]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Suburb / City *</label>
                    <input
                      type="text"
                      required
                      placeholder="Sydney"
                      value={suburb}
                      onChange={(e) => setSuburb(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#FF007A]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">State *</label>
                    <select
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#FF007A] cursor-pointer"
                    >
                      {statesAU.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Postcode *</label>
                    <input
                      type="text"
                      required
                      placeholder="2000"
                      value={postcode}
                      onChange={(e) => setPostcode(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#FF007A]"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center space-x-3 select-none">
                  <input
                    type="checkbox"
                    id="billingCheck"
                    checked={billingSameAsShipping}
                    onChange={(e) => setBillingSameAsShipping(e.target.checked)}
                    className="w-4 h-4 accent-[#FF007A] rounded cursor-pointer"
                  />
                  <label htmlFor="billingCheck" className="text-xs font-semibold text-slate-700 cursor-pointer">
                    Billing Address same as Shipping Address
                  </label>
                </div>
              </div>

              {/* Delivery Options */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
                  <Truck className="w-5 h-5 text-[#FF007A]" />
                  <h3 className="text-lg font-black text-slate-900 uppercase tracking-wide">
                    2. Australian Delivery Method
                  </h3>
                </div>

                <div className="space-y-3">
                  {deliveryOptions.map((option) => {
                    const isSelected = selectedDelivery?.id === option.id;
                    return (
                      <div
                        key={option.id}
                        onClick={() => setSelectedDelivery(option)}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-slate-50 border-[#FF007A] shadow-sm'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              isSelected ? 'border-[#FF007A] bg-[#FF007A]' : 'border-slate-300'
                            }`}
                          >
                            {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-slate-900">{option.name}</h4>
                            <p className="text-[11px] text-slate-500">{option.description}</p>
                          </div>
                        </div>

                        <span className="text-xs font-mono font-bold text-[#FF007A]">
                          {option.price === 0 ? 'FREE' : formatAUD(option.price)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full glow-pink-btn text-white font-black py-4 px-8 rounded-2xl uppercase tracking-wider text-sm flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-lg disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Generating Order...</span>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    <span>PROCEED TO PAYMENT ({formatAUD(totalAmount)})</span>
                  </>
                )}
              </button>
            </form>

            {/* Right Summary Column */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 sticky top-28">
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-3">
                  Order Summary
                </h3>

                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {cart.map(({ product, quantity }) => {
                    const pPrice = product.discountedPrice || product.price;
                    return (
                      <div key={product.id} className="flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-3">
                          <div className="relative w-12 h-12 rounded-lg bg-slate-50 border border-slate-200 overflow-hidden shrink-0">
                            <Image
                              src={product.images[0] || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=800&auto=format&fit=crop'}
                              alt={product.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 truncate max-w-[150px]">{product.title}</p>
                            <span className="text-slate-500">Qty: {quantity}</span>
                          </div>
                        </div>
                        <span className="font-mono text-slate-900 font-bold">{formatAUD(pPrice * quantity)}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-2">
                  <label className="block text-xs font-bold text-slate-700">Optional Promo Code</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      placeholder="e.g. STRAYA10"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 uppercase focus:outline-none focus:border-[#FF007A]"
                    />
                    <button
                      type="button"
                      onClick={handleApplyPromo}
                      className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs cursor-pointer shrink-0"
                    >
                      Apply
                    </button>
                  </div>

                  {promoError && <p className="text-[11px] text-red-500 font-medium">{promoError}</p>}
                  {promoSuccess && <p className="text-[11px] text-[#FF007A] font-bold">{promoSuccess}</p>}
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-mono text-slate-900 font-bold">{formatAUD(cartSubtotal)}</span>
                  </div>

                  {appliedPromo && (
                    <div className="flex justify-between text-[#FF007A] font-bold">
                      <span>Promo ({appliedPromo.code})</span>
                      <span className="font-mono">-{formatAUD(discountAmount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Delivery ({selectedDelivery?.name})</span>
                    <span className="font-mono text-slate-900 font-bold">
                      {deliveryFee === 0 ? 'FREE' : formatAUD(deliveryFee)}
                    </span>
                  </div>

                  <div className="flex justify-between text-base font-black text-slate-900 pt-3 border-t border-slate-200">
                    <span>Total (Inc. GST)</span>
                    <span className="text-[#FF007A] text-xl font-mono">{formatAUD(totalAmount)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
