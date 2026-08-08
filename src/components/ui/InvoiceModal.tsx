'use client';

import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Order } from '@/lib/types';
import { useApp } from '@/lib/store';
import { formatAUD } from '@/lib/utils';
import { X, Download, Printer, CheckCircle, Building, FileText, ShieldCheck } from 'lucide-react';
import html2canvas from 'html2canvas';

interface InvoiceModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ order, isOpen, onClose }) => {
  const { siteSettings } = useApp();
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  if (!order || !isOpen) return null;

  const handleDownloadPNG = async () => {
    if (!invoiceRef.current) return;
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(invoiceRef.current, {
        backgroundColor: '#0D0D15',
        scale: 2,
      });
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `Invoice_${order.id}.png`;
      link.click();
    } catch (err) {
      console.error('Invoice download failed', err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative z-10 w-full max-w-2xl bg-[#0C0C14] border border-[#00F0FF]/40 rounded-2xl shadow-[0_0_50px_rgba(0,240,255,0.2)] overflow-hidden my-8"
        >
          {/* Header Bar */}
          <div className="bg-[#11111E] px-6 py-4 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center space-x-2 text-[#00F0FF] font-bold text-sm">
              <FileText className="w-5 h-5" />
              <span>OFFICIAL ORDER INVOICE SUMMARY</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleDownloadPNG}
                disabled={isDownloading}
                className="glow-cyan-btn text-black text-xs font-extrabold px-4 py-2 rounded-lg flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                <span>{isDownloading ? 'Exporting...' : 'Save as PNG'}</span>
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Printable Invoice Container */}
          <div ref={invoiceRef} className="p-8 bg-[#0D0D15] text-white space-y-6">
            {/* Invoice Top Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-white/10 pb-6">
              <div>
                <h1 className="text-3xl font-black tracking-wider text-white">
                  STRAYA<span className="text-[#FF007A]">.</span>
                </h1>
                <p className="text-xs text-[#00F0FF] font-semibold tracking-widest uppercase">
                  Peptides Australia Pty Ltd
                </p>
                <p className="text-[11px] text-gray-400 mt-1">{siteSettings.address}</p>
                <p className="text-[11px] text-gray-400">{siteSettings.contactEmail}</p>
              </div>

              <div className="mt-4 sm:mt-0 text-left sm:text-right bg-[#151522] p-4 rounded-xl border border-white/10">
                <span className="text-[10px] text-gray-400 uppercase tracking-widest block">ORDER NUMBER</span>
                <span className="text-xl font-black text-[#FF007A] font-mono">{order.id}</span>
                <span className="text-[11px] text-gray-400 block mt-1">
                  Date: {new Date(order.createdAt).toLocaleDateString('en-AU')}
                </span>
              </div>
            </div>

            {/* Customer Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-[#131320] p-5 rounded-xl border border-white/5 text-xs">
              <div>
                <h4 className="text-[#00F0FF] font-bold uppercase tracking-wider mb-2">Customer Details</h4>
                <p className="text-white font-bold">{order.customer.firstName} {order.customer.lastName}</p>
                <p className="text-gray-300">{order.customer.email}</p>
                <p className="text-gray-300">{order.customer.phone}</p>
              </div>

              <div>
                <h4 className="text-[#00F0FF] font-bold uppercase tracking-wider mb-2">Shipping Destination</h4>
                <p className="text-gray-300">{order.customer.address.street}</p>
                <p className="text-gray-300">
                  {order.customer.address.suburb}, {order.customer.address.state} {order.customer.address.postcode}
                </p>
                <p className="text-gray-300">Australia</p>
              </div>
            </div>

            {/* Items Table */}
            <div>
              <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-3">Items Summary</h4>
              <div className="border border-white/10 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#171726] text-gray-300 font-bold uppercase">
                    <tr>
                      <th className="p-3">Product Item</th>
                      <th className="p-3 text-center">Qty</th>
                      <th className="p-3 text-right">Unit Price</th>
                      <th className="p-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10 bg-[#0F0F1A]">
                    {order.items.map(({ product, quantity }) => {
                      const unitPrice = product.discountedPrice || product.price;
                      return (
                        <tr key={product.id}>
                          <td className="p-3 font-semibold text-white">
                            {product.title}
                            {product.dosage && <span className="text-gray-400 font-mono text-[11px] block">{product.dosage}</span>}
                          </td>
                          <td className="p-3 text-center text-gray-300 font-bold">{quantity}</td>
                          <td className="p-3 text-right font-mono text-gray-300">{formatAUD(unitPrice)}</td>
                          <td className="p-3 text-right font-mono font-bold text-white">{formatAUD(unitPrice * quantity)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Totals & Delivery */}
            <div className="flex flex-col items-end space-y-1.5 text-xs text-gray-300 border-t border-white/10 pt-4">
              <div className="w-full max-w-xs flex justify-between">
                <span>Subtotal:</span>
                <span className="font-mono text-white">{formatAUD(order.subtotal)}</span>
              </div>
              {order.promoCode && (
                <div className="w-full max-w-xs flex justify-between text-[#FF007A]">
                  <span>Promo ({order.promoCode.code}):</span>
                  <span className="font-mono">-{formatAUD(order.promoCode.discountAmount)}</span>
                </div>
              )}
              <div className="w-full max-w-xs flex justify-between text-gray-400">
                <span>Delivery ({order.deliveryOption.name}):</span>
                <span className="font-mono text-white">{formatAUD(order.deliveryOption.price)}</span>
              </div>
              <div className="w-full max-w-xs flex justify-between text-base font-black text-[#00F0FF] border-t border-white/20 pt-2">
                <span>Total Amount:</span>
                <span className="font-mono">{formatAUD(order.totalAmount)}</span>
              </div>
            </div>

            {/* Bank Payment Instructions */}
            <div className="p-5 rounded-xl bg-[#141424] border border-[#FF007A]/40 space-y-3">
              <div className="flex items-center space-x-2 text-[#FF007A] font-bold text-xs uppercase tracking-wider">
                <Building className="w-4 h-4" />
                <span>Bank Transfer & PayID Payment Details</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px] text-gray-300 font-mono">
                <div>
                  <span className="text-gray-500 block">Bank Name</span>
                  <span className="font-bold text-white">{siteSettings.bankInfo.bankName}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Account Name</span>
                  <span className="font-bold text-white">{siteSettings.bankInfo.accountName}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">BSB</span>
                  <span className="font-bold text-white">{siteSettings.bankInfo.bsb}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Account No.</span>
                  <span className="font-bold text-white">{siteSettings.bankInfo.accountNumber}</span>
                </div>
              </div>
              <p className="text-[11px] text-[#00F0FF]">
                <strong>PayID Email:</strong> {siteSettings.bankInfo.payId}
              </p>
              <p className="text-[11px] text-gray-400 leading-snug">
                {siteSettings.bankInfo.instructions}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
