'use client';

import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Order } from '@/lib/types';
import { useApp } from '@/lib/store';
import { formatAUD } from '@/lib/utils';
import { X, Download, Building, FileText, Printer } from 'lucide-react';
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
      await new Promise((resolve) => setTimeout(resolve, 150));

      const canvas = await html2canvas(invoiceRef.current, {
        backgroundColor: '#FFFFFF',
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        imageTimeout: 10000,
        scrollX: 0,
        scrollY: 0,
      });

      const dataUrl = canvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `Invoice_${order.id || 'STRAYA'}.png`;
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        if (document.body.contains(link)) {
          document.body.removeChild(link);
        }
      }, 200);
    } catch (err) {
      console.warn('PNG export failed, invoking print fallback', err);
      window.print();
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Dark Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs"
        />

        {/* Modal Window Container (Responsive Height & Flex Column) */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 15 }}
          className="relative z-10 w-full max-w-3xl max-h-[92vh] flex flex-col bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 my-auto"
        >
          {/* Header Action Bar (Sticky at Top) */}
          <div className="bg-slate-900 text-white px-4 sm:px-6 py-3.5 flex items-center justify-between shrink-0 border-b border-slate-800">
            <div className="flex items-center space-x-2 font-bold text-xs sm:text-sm">
              <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-[#FF007A]" />
              <span>OFFICIAL TAX INVOICE</span>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3">
              <button
                onClick={handlePrint}
                className="bg-slate-800 hover:bg-slate-700 text-white text-[11px] sm:text-xs font-bold px-3 py-2 rounded-xl flex items-center space-x-1.5 cursor-pointer shadow-xs shrink-0"
                title="Print or Save as PDF"
              >
                <Printer className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Print / PDF</span>
              </button>

              <button
                onClick={handleDownloadPNG}
                disabled={isDownloading}
                className="glow-pink-btn text-white text-[11px] sm:text-xs font-bold px-3.5 py-2 rounded-xl flex items-center space-x-1.5 cursor-pointer disabled:opacity-50 shadow-md shrink-0 active:scale-95"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isDownloading ? 'Exporting PNG...' : 'Download PNG'}</span>
              </button>

              <button
                onClick={onClose}
                className="p-1.5 sm:p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white cursor-pointer shrink-0"
                title="Close Modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Scrollable Crisp White Invoice Body */}
          <div className="overflow-y-auto max-h-[calc(92vh-60px)] p-5 sm:p-8 space-y-6 sm:space-y-8 bg-white text-slate-900 select-text">
            <div ref={invoiceRef} className="p-4 sm:p-6 bg-white text-slate-900 space-y-6 sm:space-y-8">
              {/* Header: Brand Logo from Navbar & Invoice Info */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-200 pb-6 gap-4">
                <div>
                  {siteSettings.logoUrl ? (
                    <div className="relative h-12 w-44 mb-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={siteSettings.logoUrl}
                        alt="Brand Logo"
                        crossOrigin="anonymous"
                        className="h-12 w-auto object-contain"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-black text-2xl sm:text-3xl tracking-wider text-slate-900">
                        STRAYA<span className="text-[#FF007A]">.</span>
                      </span>
                    </div>
                  )}
                  <p className="text-xs font-bold text-[#FF007A] uppercase tracking-wider">
                    STRAYA BIOTECH PTY LTD (ABN 88 619 402 918)
                  </p>
                  <p className="text-xs text-slate-600 mt-1">{siteSettings.address}</p>
                  <p className="text-xs text-slate-600">{siteSettings.contactEmail} | {siteSettings.contactPhone}</p>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left sm:text-right min-w-[200px] w-full sm:w-auto">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">TAX INVOICE NO.</span>
                  <span className="text-lg sm:text-xl font-black text-[#FF007A] font-mono">{order.id}</span>
                  <span className="text-xs text-slate-500 block mt-1">
                    Date: {new Date(order.createdAt).toLocaleDateString('en-AU', { dateStyle: 'medium' })}
                  </span>
                  <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-slate-900 text-white">
                    Status: {order.paymentStatus}
                  </span>
                </div>
              </div>

              {/* Customer & Shipping Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 bg-slate-50 p-5 sm:p-6 rounded-2xl border border-slate-200 text-xs">
                <div>
                  <h4 className="text-[#FF007A] font-bold uppercase tracking-wider mb-2">Billed To Customer:</h4>
                  <p className="text-slate-900 font-extrabold text-sm">{order.customer?.firstName || 'Guest'} {order.customer?.lastName || ''}</p>
                  <p className="text-slate-600 mt-0.5">{order.customer?.email || 'N/A'}</p>
                  <p className="text-slate-600">{order.customer?.phone || 'N/A'}</p>
                </div>

                <div>
                  <h4 className="text-[#FF007A] font-bold uppercase tracking-wider mb-2">Shipping Destination:</h4>
                  <p className="text-slate-800 font-medium">{order.customer?.address?.street || 'N/A'}</p>
                  <p className="text-slate-800 font-medium">
                    {order.customer?.address?.suburb || ''}, {order.customer?.address?.state || ''} {order.customer?.address?.postcode || ''}
                  </p>
                  <p className="text-slate-600 font-bold">Australia</p>
                </div>
              </div>

              {/* Product Items Table */}
              <div>
                <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-3">Itemized Compounds</h4>
                <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900 text-white font-bold uppercase">
                      <tr>
                        <th className="p-3.5">Description</th>
                        <th className="p-3.5 text-center">Qty</th>
                        <th className="p-3.5 text-right">Unit Price</th>
                        <th className="p-3.5 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                      {order.items.map(({ product, quantity }) => {
                        const unitPrice = product.discountedPrice || product.price;
                        return (
                          <tr key={product.id}>
                            <td className="p-3.5 font-bold text-slate-900">
                              {product.title}
                              {product.dosage && <span className="text-slate-500 font-mono text-[11px] block">{product.dosage}</span>}
                            </td>
                            <td className="p-3.5 text-center font-bold text-slate-700">{quantity}</td>
                            <td className="p-3.5 text-right font-mono text-slate-600">{formatAUD(unitPrice)}</td>
                            <td className="p-3.5 text-right font-mono font-extrabold text-slate-900">{formatAUD(unitPrice * quantity)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Totals & GST Summary */}
              <div className="flex flex-col items-end space-y-2 text-xs text-slate-600 border-t border-slate-200 pt-4">
                <div className="w-full max-w-xs flex justify-between">
                  <span>Subtotal (Excl. GST):</span>
                  <span className="font-mono text-slate-900 font-bold">{formatAUD(order.subtotal * 0.9)}</span>
                </div>
                <div className="w-full max-w-xs flex justify-between">
                  <span>GST (10% Inc.):</span>
                  <span className="font-mono text-slate-900 font-bold">{formatAUD(order.subtotal * 0.1)}</span>
                </div>
                {order.promoCode && (
                  <div className="w-full max-w-xs flex justify-between text-[#FF007A] font-bold">
                    <span>Promo Discount ({order.promoCode.code}):</span>
                    <span className="font-mono">-{formatAUD(order.promoCode.discountAmount)}</span>
                  </div>
                )}
                <div className="w-full max-w-xs flex justify-between">
                  <span>Shipping ({order.deliveryOption.name}):</span>
                  <span className="font-mono text-slate-900 font-bold">{formatAUD(order.deliveryOption.price)}</span>
                </div>
                <div className="w-full max-w-xs flex justify-between text-base font-black text-slate-900 border-t-2 border-slate-900 pt-2">
                  <span>Total AUD:</span>
                  <span className="font-mono text-[#FF007A]">{formatAUD(order.totalAmount)}</span>
                </div>
              </div>

              {/* Bank Payment Instructions */}
              <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center space-x-2 text-slate-900 font-bold text-xs uppercase tracking-wider">
                  <Building className="w-4 h-4 text-[#FF007A]" />
                  <span>Bank Transfer & PayID Instructions</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-700 font-mono">
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase block">Bank Name</span>
                    <span className="font-bold text-slate-900">{siteSettings.bankInfo.bankName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase block">Account Name</span>
                    <span className="font-bold text-slate-900">{siteSettings.bankInfo.accountName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase block">BSB</span>
                    <span className="font-bold text-slate-900">{siteSettings.bankInfo.bsb}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase block">Account No.</span>
                    <span className="font-bold text-slate-900">{siteSettings.bankInfo.accountNumber}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-900 font-bold">
                  PayID Email: <span className="text-[#FF007A]">{siteSettings.bankInfo.payId}</span> (Reference: <span className="font-mono">{order.id}</span>)
                </p>
                <p className="text-xs text-slate-500 leading-snug">
                  {siteSettings.bankInfo.instructions}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
