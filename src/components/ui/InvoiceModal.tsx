'use client';

import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Order, SiteSettings } from '@/lib/types';
import { useApp } from '@/lib/store';
import { formatAUD } from '@/lib/utils';
import { X, Download, Building, FileText, Printer, ShieldCheck } from 'lucide-react';

interface InvoiceModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

// 🎨 Direct High-Res (300 DPI) Native Canvas 2D Single-Page A4 Invoice Generator
// (100% resilient to modern CSS color notations like lab(), oklch(), or external CSS stylesheets)
const generateAndDownloadInvoicePNG = async (order: Order, siteSettings: SiteSettings) => {
  const width = 1588; // 2x Standard A4 (794 x 1123 px at 96 DPI -> 1588 x 2246 px at 192 DPI)
  const height = 2246;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // 1. Background White
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, width, height);

  // Helper font setter
  const setFont = (weight: number, size: number, family = 'system-ui, -apple-system, sans-serif') => {
    ctx.font = `${weight} ${size * 2}px ${family}`;
  };

  // 2. Outer Subtle Border
  ctx.strokeStyle = '#E2E8F0';
  ctx.lineWidth = 3;
  ctx.strokeRect(40, 40, width - 80, height - 80);

  const startX = 80;
  let curY = 120;

  // 3. Header: Brand Logo or Brand Text
  let logoLoaded = false;
  if (siteSettings.logoUrl) {
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject();
        img.src = siteSettings.logoUrl;
      });
      const logoW = 240;
      const logoH = (img.height / img.width) * logoW;
      ctx.drawImage(img, startX, curY - 30, logoW, Math.min(logoH, 90));
      logoLoaded = true;
    } catch {
      logoLoaded = false;
    }
  }

  if (!logoLoaded) {
    setFont(900, 24);
    ctx.fillStyle = '#0F172A';
    ctx.fillText('STRAYA', startX, curY + 20);
    ctx.fillStyle = '#FF007A';
    ctx.fillText('.', startX + ctx.measureText('STRAYA').width, curY + 20);
  }

  // Company details under logo
  curY += 75;
  setFont(800, 11);
  ctx.fillStyle = '#FF007A';
  ctx.fillText('STRAYA BIOTECH PTY LTD (ABN 88 619 402 918)', startX, curY);

  curY += 24;
  setFont(500, 11);
  ctx.fillStyle = '#475569';
  ctx.fillText(siteSettings.address || 'Level 24, 200 George Street, Sydney NSW 2000, Australia', startX, curY);

  curY += 22;
  ctx.fillText(`${siteSettings.contactEmail} | ${siteSettings.contactPhone}`, startX, curY);

  // Right Side: Tax Invoice Header Box
  const boxX = width - 80 - 420;
  const boxY = 85;
  ctx.fillStyle = '#F8FAFC';
  ctx.strokeStyle = '#E2E8F0';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(boxX, boxY, 420, 160, 16);
  ctx.fill();
  ctx.stroke();

  setFont(800, 10);
  ctx.fillStyle = '#64748B';
  ctx.fillText('OFFICIAL TAX INVOICE', boxX + 24, boxY + 38);

  setFont(900, 18, 'monospace');
  ctx.fillStyle = '#FF007A';
  ctx.fillText(order.id, boxX + 24, boxY + 76);

  setFont(600, 11);
  ctx.fillStyle = '#475569';
  const orderDate = new Date(order.createdAt).toLocaleDateString('en-AU', { dateStyle: 'medium' });
  ctx.fillText(`Date: ${orderDate}`, boxX + 24, boxY + 108);

  // Status Badge
  ctx.fillStyle = '#0F172A';
  ctx.beginPath();
  ctx.roundRect(boxX + 24, boxY + 120, 150, 28, 6);
  ctx.fill();
  setFont(800, 9);
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText(`STATUS: ${order.paymentStatus.toUpperCase()}`, boxX + 36, boxY + 139);

  // Divider Line
  curY = 275;
  ctx.strokeStyle = '#0F172A';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(startX, curY);
  ctx.lineTo(width - startX, curY);
  ctx.stroke();

  // Two-Column Billed To & Shipping Destination Boxes
  curY += 30;
  const colW = (width - 160 - 30) / 2;

  // Billed To Box
  ctx.fillStyle = '#F8FAFC';
  ctx.strokeStyle = '#E2E8F0';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(startX, curY, colW, 140, 16);
  ctx.fill();
  ctx.stroke();

  setFont(800, 11);
  ctx.fillStyle = '#FF007A';
  ctx.fillText('BILLED TO CUSTOMER:', startX + 24, curY + 36);
  setFont(800, 13);
  ctx.fillStyle = '#0F172A';
  ctx.fillText(`${order.customer?.firstName || 'Guest'} ${order.customer?.lastName || ''}`, startX + 24, curY + 68);
  setFont(500, 11);
  ctx.fillStyle = '#475569';
  ctx.fillText(order.customer?.email || 'N/A', startX + 24, curY + 96);
  ctx.fillText(order.customer?.phone || 'N/A', startX + 24, curY + 120);

  // Shipping Destination Box
  const col2X = startX + colW + 30;
  ctx.fillStyle = '#F8FAFC';
  ctx.beginPath();
  ctx.roundRect(col2X, curY, colW, 140, 16);
  ctx.fill();
  ctx.stroke();

  setFont(800, 11);
  ctx.fillStyle = '#FF007A';
  ctx.fillText('SHIPPING DESTINATION:', col2X + 24, curY + 36);
  setFont(600, 12);
  ctx.fillStyle = '#0F172A';
  ctx.fillText(order.customer?.address?.street || 'N/A', col2X + 24, curY + 68);
  setFont(500, 11);
  ctx.fillStyle = '#475569';
  ctx.fillText(`${order.customer?.address?.suburb || ''}, ${order.customer?.address?.state || ''} ${order.customer?.address?.postcode || ''}`, col2X + 24, curY + 96);
  ctx.fillText('Australia', col2X + 24, curY + 120);

  // Itemized Table
  curY += 175;
  setFont(800, 12);
  ctx.fillStyle = '#0F172A';
  ctx.fillText('ITEMIZED COMPOUNDS', startX, curY);

  curY += 16;
  const tableW = width - 160;

  // Table Header
  ctx.fillStyle = '#0F172A';
  ctx.beginPath();
  ctx.roundRect(startX, curY, tableW, 46, [12, 12, 0, 0]);
  ctx.fill();

  setFont(800, 10);
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText('DESCRIPTION', startX + 24, curY + 28);
  ctx.fillText('QTY', startX + tableW - 380, curY + 28);
  ctx.fillText('UNIT PRICE', startX + tableW - 240, curY + 28);
  ctx.fillText('AMOUNT (AUD)', startX + tableW - 100, curY + 28);

  curY += 46;
  ctx.strokeStyle = '#E2E8F0';
  ctx.lineWidth = 1.5;

  order.items.forEach((item, idx) => {
    const unitPrice = item.product.discountedPrice || item.product.price;
    const lineTotal = unitPrice * item.quantity;
    const rowH = 54;

    ctx.fillStyle = idx % 2 === 0 ? '#FFFFFF' : '#F8FAFC';
    ctx.fillRect(startX, curY, tableW, rowH);
    ctx.strokeRect(startX, curY, tableW, rowH);

    setFont(700, 11);
    ctx.fillStyle = '#0F172A';
    ctx.fillText(item.product.title, startX + 24, curY + 28);

    if (item.product.dosage) {
      setFont(500, 9, 'monospace');
      ctx.fillStyle = '#64748B';
      ctx.fillText(item.product.dosage, startX + 24, curY + 44);
    }

    setFont(700, 11);
    ctx.fillStyle = '#334155';
    ctx.fillText(String(item.quantity), startX + tableW - 365, curY + 34);

    setFont(500, 11, 'monospace');
    ctx.fillText(formatAUD(unitPrice), startX + tableW - 240, curY + 34);

    setFont(800, 11, 'monospace');
    ctx.fillStyle = '#0F172A';
    ctx.fillText(formatAUD(lineTotal), startX + tableW - 100, curY + 34);

    curY += rowH;
  });

  // Summary and Bank Details Section
  curY += 35;
  const bottomColW = (width - 160 - 30) / 2;

  // Bank Info Box
  ctx.fillStyle = '#F8FAFC';
  ctx.strokeStyle = '#E2E8F0';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(startX, curY, bottomColW, 200, 16);
  ctx.fill();
  ctx.stroke();

  setFont(800, 11);
  ctx.fillStyle = '#FF007A';
  ctx.fillText('BANK TRANSFER & PAYID DETAILS', startX + 24, curY + 36);

  setFont(700, 9);
  ctx.fillStyle = '#64748B';
  ctx.fillText('BANK NAME', startX + 24, curY + 70);
  ctx.fillText('BSB', startX + 230, curY + 70);

  setFont(800, 11, 'monospace');
  ctx.fillStyle = '#0F172A';
  ctx.fillText(siteSettings.bankInfo.bankName, startX + 24, curY + 92);
  ctx.fillText(siteSettings.bankInfo.bsb, startX + 230, curY + 92);

  setFont(700, 9);
  ctx.fillStyle = '#64748B';
  ctx.fillText('ACCOUNT NUMBER', startX + 24, curY + 124);
  ctx.fillText('PAYID EMAIL', startX + 230, curY + 124);

  setFont(800, 11, 'monospace');
  ctx.fillStyle = '#0F172A';
  ctx.fillText(siteSettings.bankInfo.accountNumber, startX + 24, curY + 146);
  ctx.fillStyle = '#FF007A';
  ctx.fillText(siteSettings.bankInfo.payId, startX + 230, curY + 146);

  setFont(500, 10);
  ctx.fillStyle = '#64748B';
  ctx.fillText(`Payment Reference: ${order.id} (Quote on bank transfer)`, startX + 24, curY + 180);

  // Totals Box
  const totX = startX + bottomColW + 30;
  ctx.fillStyle = '#F8FAFC';
  ctx.beginPath();
  ctx.roundRect(totX, curY, bottomColW, 200, 16);
  ctx.fill();
  ctx.stroke();

  let totY = curY + 36;
  const drawTotalLine = (label: string, value: string, isBold = false, isPink = false, isLarge = false) => {
    setFont(isBold ? 800 : 500, isLarge ? 15 : 11);
    ctx.fillStyle = isPink ? '#FF007A' : '#475569';
    ctx.fillText(label, totX + 24, totY);
    ctx.fillStyle = isPink ? '#FF007A' : (isBold ? '#0F172A' : '#1E293B');
    const valW = ctx.measureText(value).width;
    ctx.fillText(value, totX + bottomColW - 24 - valW, totY);
    totY += isLarge ? 34 : 26;
  };

  drawTotalLine('Subtotal (Excl. GST):', formatAUD(order.subtotal * 0.9));
  drawTotalLine('GST (10% Inc.):', formatAUD(order.subtotal * 0.1));
  if (order.promoCode) {
    drawTotalLine(`Promo (${order.promoCode.code}):`, `-${formatAUD(order.promoCode.discountAmount)}`, true, true);
  }
  drawTotalLine(`Shipping (${order.deliveryOption.name}):`, formatAUD(order.deliveryOption.price));

  // Divider
  ctx.strokeStyle = '#0F172A';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(totX + 20, totY - 8);
  ctx.lineTo(totX + bottomColW - 20, totY - 8);
  ctx.stroke();

  totY += 12;
  drawTotalLine('Total AUD:', formatAUD(order.totalAmount), true, true, true);

  // Footer / Compliance Note
  const footY = height - 100;
  ctx.strokeStyle = '#E2E8F0';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(startX, footY);
  ctx.lineTo(width - startX, footY);
  ctx.stroke();

  setFont(500, 9);
  ctx.fillStyle = '#64748B';
  ctx.fillText('Analytical laboratory compounds strictly for research purposes. Dispatched via Australia Post Express cold chain packaging.', startX, footY + 28);
  setFont(800, 9);
  ctx.fillStyle = '#0F172A';
  const thankText = 'Thank you for choosing Straya Peptides Australia.';
  const thankW = ctx.measureText(thankText).width;
  ctx.fillText(thankText, width - startX - thankW, footY + 28);

  // Download Trigger
  canvas.toBlob((blob) => {
    if (blob) {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Tax_Invoice_${order.id || 'STRAYA'}.png`;
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        if (document.body.contains(link)) document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 250);
    }
  }, 'image/png', 1.0);
};

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ order, isOpen, onClose }) => {
  const { siteSettings } = useApp();
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  if (!order || !isOpen) return null;

  const handleDownloadPNG = async () => {
    setIsDownloading(true);
    try {
      await generateAndDownloadInvoicePNG(order, siteSettings);
    } catch (err) {
      console.error('Direct Canvas PNG export error:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto print:p-0 print:overflow-visible print:bg-white">
        {/* Dark Backdrop (Hidden on Print) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs print:hidden"
        />

        {/* Modal Window Container */}
        <motion.div
          initial={{ scale: 0.96, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.96, opacity: 0, y: 15 }}
          className="relative z-10 w-full max-w-4xl max-h-[95vh] flex flex-col bg-slate-100 rounded-3xl shadow-2xl overflow-hidden border border-slate-300 my-auto print:max-h-none print:border-none print:shadow-none print:rounded-none print:w-full print:max-w-none print:bg-white print:m-0"
        >
          {/* Header Action Bar (Sticky at Top, Hidden on Print) */}
          <div className="bg-slate-900 text-white px-4 sm:px-6 py-3.5 flex items-center justify-between shrink-0 border-b border-slate-800 print:hidden">
            <div className="flex items-center space-x-2 font-bold text-xs sm:text-sm">
              <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-[#FF007A]" />
              <span>TAX INVOICE — STANDARD A4 DOCUMENT</span>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3">
              <button
                onClick={handlePrint}
                className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center space-x-1.5 cursor-pointer shadow-xs shrink-0 transition-colors"
                title="Print or Save as PDF"
              >
                <Printer className="w-4 h-4 text-[#00F0FF]" />
                <span>Print PDF</span>
              </button>

              <button
                onClick={handleDownloadPNG}
                disabled={isDownloading}
                className="glow-pink-btn text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center space-x-1.5 cursor-pointer disabled:opacity-50 shadow-md shrink-0 active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>{isDownloading ? 'Downloading PNG...' : 'Download PNG'}</span>
              </button>

              <button
                onClick={onClose}
                className="p-1.5 sm:p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white cursor-pointer shrink-0"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Scrollable Viewport with A4 Paper Sheet Center */}
          <div className="overflow-y-auto max-h-[calc(95vh-60px)] p-3 sm:p-6 md:p-8 flex justify-center bg-slate-100 print:p-0 print:max-h-none print:overflow-visible print:bg-white">
            {/* 📄 STANDARD SINGLE PAGE A4 INVOICE SHEET (210mm x 297mm proportions) */}
            <div
              id="printable-invoice"
              ref={invoiceRef}
              style={{
                width: '100%',
                maxWidth: '794px',
                backgroundColor: '#FFFFFF',
                color: '#0F172A',
              }}
              className="shadow-xl border border-slate-300 sm:rounded-2xl p-6 sm:p-8 flex flex-col justify-between space-y-4 print:shadow-none print:border-none print:p-0 print:m-0 print:min-h-0 print:w-full print:rounded-none"
            >
              {/* TOP HEADER: Brand Logo & Invoice Info */}
              <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4 gap-4">
                <div>
                  {siteSettings.logoUrl ? (
                    <div className="relative h-11 w-40 mb-1.5">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={siteSettings.logoUrl}
                        alt="Brand Logo"
                        crossOrigin="anonymous"
                        className="h-11 w-auto object-contain"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-black text-2xl tracking-wider text-slate-900 font-display">
                        STRAYA<span className="text-[#FF007A]">.</span>
                      </span>
                    </div>
                  )}
                  <p className="text-[11px] font-extrabold text-[#FF007A] uppercase tracking-wider">
                    STRAYA BIOTECH PTY LTD (ABN 88 619 402 918)
                  </p>
                  <p className="text-[10.5px] text-slate-600 mt-0.5">{siteSettings.address || 'Level 24, 200 George Street, Sydney NSW 2000'}</p>
                  <p className="text-[10.5px] text-slate-600">{siteSettings.contactEmail} | {siteSettings.contactPhone}</p>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-right min-w-[200px]">
                  <span className="text-[9.5px] font-black text-slate-500 uppercase tracking-widest block">OFFICIAL TAX INVOICE</span>
                  <span className="text-base font-black text-[#FF007A] font-mono">{order.id}</span>
                  <span className="text-[10.5px] text-slate-600 block mt-0.5">
                    Date: {new Date(order.createdAt).toLocaleDateString('en-AU', { dateStyle: 'medium' })}
                  </span>
                  <span className="inline-block mt-1 px-2.5 py-0.5 rounded-md text-[9.5px] font-black uppercase bg-slate-900 text-white tracking-wider">
                    Status: {order.paymentStatus}
                  </span>
                </div>
              </div>

              {/* TWO-COLUMN CUSTOMER & SHIPPING DESTINATION */}
              <div className="grid grid-cols-2 gap-3.5 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
                <div>
                  <h4 className="text-[#FF007A] font-bold uppercase tracking-wider text-[10.5px] mb-0.5">Billed To Customer:</h4>
                  <p className="text-slate-900 font-black text-[13px]">{order.customer?.firstName || 'Guest'} {order.customer?.lastName || ''}</p>
                  <p className="text-slate-600 text-[10.5px] mt-0.5">{order.customer?.email || 'N/A'}</p>
                  <p className="text-slate-600 text-[10.5px]">{order.customer?.phone || 'N/A'}</p>
                </div>

                <div>
                  <h4 className="text-[#FF007A] font-bold uppercase tracking-wider text-[10.5px] mb-0.5">Shipping Destination:</h4>
                  <p className="text-slate-800 font-semibold text-[11.5px]">{order.customer?.address?.street || 'N/A'}</p>
                  <p className="text-slate-800 font-medium text-[11.5px]">
                    {order.customer?.address?.suburb || ''}, {order.customer?.address?.state || ''} {order.customer?.address?.postcode || ''}
                  </p>
                  <p className="text-slate-600 font-bold text-[10.5px]">Australia</p>
                </div>
              </div>

              {/* ITEMIZED PRODUCTS TABLE */}
              <div>
                <h4 className="text-[10.5px] font-black text-slate-800 uppercase tracking-wider mb-1.5">Itemized Compounds</h4>
                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900 text-white font-bold uppercase text-[10.5px]">
                      <tr>
                        <th className="py-2 px-3">Description</th>
                        <th className="py-2 px-3 text-center">Qty</th>
                        <th className="py-2 px-3 text-right">Unit Price</th>
                        <th className="py-2 px-3 text-right">Amount (AUD)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                      {order.items.map(({ product, quantity }) => {
                        const unitPrice = product.discountedPrice || product.price;
                        return (
                          <tr key={product.id}>
                            <td className="py-2 px-3 font-bold text-slate-900">
                              {product.title}
                              {product.dosage && <span className="text-slate-500 font-mono text-[9.5px] block">{product.dosage}</span>}
                            </td>
                            <td className="py-2 px-3 text-center font-bold text-slate-700">{quantity}</td>
                            <td className="py-2 px-3 text-right font-mono text-slate-600">{formatAUD(unitPrice)}</td>
                            <td className="py-2 px-3 text-right font-mono font-black text-slate-900">{formatAUD(unitPrice * quantity)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* SUMMARY & BANK DETAILS ROW */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-0.5 items-start">
                {/* Bank Payment Details */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
                  <div className="flex items-center space-x-1.5 text-slate-900 font-bold text-[10.5px] uppercase tracking-wider">
                    <Building className="w-3.5 h-3.5 text-[#FF007A]" />
                    <span>Bank Transfer & PayID Details</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 text-[10.5px] text-slate-700 font-mono">
                    <div>
                      <span className="text-slate-400 text-[8.5px] uppercase block">Bank Name</span>
                      <span className="font-bold text-slate-900">{siteSettings.bankInfo.bankName}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[8.5px] uppercase block">BSB</span>
                      <span className="font-bold text-slate-900">{siteSettings.bankInfo.bsb}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[8.5px] uppercase block">Account No.</span>
                      <span className="font-bold text-slate-900">{siteSettings.bankInfo.accountNumber}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[8.5px] uppercase block">PayID</span>
                      <span className="font-bold text-[#FF007A]">{siteSettings.bankInfo.payId}</span>
                    </div>
                  </div>
                  <p className="text-[9.5px] text-slate-500 leading-tight pt-0.5">
                    Reference: <strong className="text-slate-900 font-mono">{order.id}</strong> (Quote on bank transfer).
                  </p>
                </div>

                {/* Totals Calculation Box */}
                <div className="flex flex-col items-end space-y-1 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <div className="w-full flex justify-between text-[10.5px]">
                    <span>Subtotal (Excl. GST):</span>
                    <span className="font-mono text-slate-900 font-bold">{formatAUD(order.subtotal * 0.9)}</span>
                  </div>
                  <div className="w-full flex justify-between text-[10.5px]">
                    <span>GST (10% Inc.):</span>
                    <span className="font-mono text-slate-900 font-bold">{formatAUD(order.subtotal * 0.1)}</span>
                  </div>
                  {order.promoCode && (
                    <div className="w-full flex justify-between text-[#FF007A] font-bold text-[10.5px]">
                      <span>Promo ({order.promoCode.code}):</span>
                      <span className="font-mono">-{formatAUD(order.promoCode.discountAmount)}</span>
                    </div>
                  )}
                  <div className="w-full flex justify-between text-[10.5px]">
                    <span>Shipping ({order.deliveryOption.name}):</span>
                    <span className="font-mono text-slate-900 font-bold">{formatAUD(order.deliveryOption.price)}</span>
                  </div>
                  <div className="w-full flex justify-between text-sm sm:text-base font-black text-slate-900 border-t-2 border-slate-900 pt-1 mt-0.5">
                    <span>Total AUD:</span>
                    <span className="font-mono text-[#FF007A]">{formatAUD(order.totalAmount)}</span>
                  </div>
                </div>
              </div>

              {/* COMPLIANCE & FOOTER NOTICE */}
              <div className="border-t border-slate-200 pt-2.5 text-[9.5px] text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-1.5 text-center sm:text-left">
                <div className="flex items-center space-x-1.5 text-slate-700 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#FF007A] shrink-0" />
                  <span>Analytical laboratory compounds. Dispatched via Australia Post Express with cold chain packaging.</span>
                </div>
                <span className="font-bold text-slate-700">Thank you for ordering with Straya Peptides.</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
