'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/lib/store';
import { COAItem } from '@/lib/types';
import {
  Award,
  Eye,
  Download,
  X,
  Search,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ExternalLink,
  ShieldCheck,
  FileCheck,
} from 'lucide-react';

export default function COAPage() {
  const { coas } = useApp();
  const [selectedCOA, setSelectedCOA] = useState<COAItem | null>(null);
  const [searchFilter, setSearchFilter] = useState('');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const filteredCOAs = coas.filter(
    (item) =>
      item.productTitle.toLowerCase().includes(searchFilter.toLowerCase()) ||
      item.batchNumber.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const handleOpenCOA = (coa: COAItem) => {
    setSelectedCOA(coa);
    setZoomLevel(1);
  };

  const handleCloseCOA = () => {
    setSelectedCOA(null);
    setZoomLevel(1);
  };

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(3.5, Number((prev + 0.25).toFixed(2))));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(0.5, Number((prev - 0.25).toFixed(2))));
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
  };

  const handleToggleZoom = () => {
    setZoomLevel((prev) => (prev > 1.2 ? 1 : 2));
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
        {/* Header Banner */}
        <div className="relative rounded-3xl bg-slate-900 text-white p-8 sm:p-12 overflow-hidden shadow-xl text-center">
          <div className="relative z-10 max-w-3xl mx-auto space-y-3.5 flex flex-col items-center justify-center">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#FF007A]/20 border border-[#FF007A]/40 text-[#FF007A] text-xs font-black uppercase tracking-wider shadow-sm">
              <Award className="w-4 h-4" />
              <span>High Performance Liquid Chromatography (HPLC)</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-center">
              Certificate of Analysis (COA)
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed text-center max-w-2xl">
              Transparency is our core standard. Inspect batch-specific HPLC and Mass Spectrometry laboratory reports for all Straya research peptides.
            </p>
          </div>
        </div>

        {/* Search Bar & Counter */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Search by product name or batch number (e.g. STR-BPC-2026)..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full bg-slate-50 text-slate-900 text-xs px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-[#FF007A]"
            />
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
          </div>

          <div className="flex items-center space-x-2 text-xs font-bold text-slate-600">
            <ShieldCheck className="w-4 h-4 text-[#FF007A]" />
            <span>Showing <strong className="text-slate-900">{filteredCOAs.length}</strong> Verified Lab Reports</span>
          </div>
        </div>

        {/* COA Cards Grid (A4 Preview Proportion) */}
        {filteredCOAs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredCOAs.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ y: -4 }}
                className="group bg-white rounded-3xl border border-slate-200 hover:border-[#FF007A]/50 overflow-hidden shadow-xs hover:shadow-xl flex flex-col justify-between transition-all"
              >
                {/* A4 Report Thumbnail */}
                <div
                  onClick={() => handleOpenCOA(item)}
                  className="relative aspect-[1/1.3] w-full bg-slate-100 cursor-pointer overflow-hidden group-hover:brightness-95 transition-all p-3"
                >
                  <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-inner bg-white">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.imageUrl || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=800&auto=format&fit=crop'}
                      alt={item.productTitle}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=800&auto=format&fit=crop';
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                      <span className="px-4 py-2.5 rounded-xl glow-pink-btn text-white font-bold text-xs flex items-center space-x-2 shadow-lg">
                        <Eye className="w-4 h-4" />
                        <span>PREVIEW CERTIFICATE</span>
                      </span>
                    </div>
                  </div>
                  <span className="absolute top-5 left-5 px-3 py-1 rounded-lg bg-slate-900/90 text-emerald-400 text-[10px] font-black uppercase tracking-wider backdrop-blur-xs shadow-md">
                    {item.purity} PURITY
                  </span>
                </div>

                <div className="p-5 space-y-3.5 bg-white border-t border-slate-100">
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 line-clamp-1">{item.productTitle}</h3>
                    <div className="flex items-center justify-between text-xs text-slate-500 mt-1 font-mono">
                      <span>Batch: <strong className="text-[#FF007A]">{item.batchNumber}</strong></span>
                      <span>Date: {item.date}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleOpenCOA(item)}
                    className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-900 font-bold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer"
                  >
                    <FileCheck className="w-4 h-4 text-[#FF007A]" />
                    <span>Inspect Full Report</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-slate-50 rounded-3xl border border-slate-200">
            <Award className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-700 font-bold text-sm">No COA reports match your search query.</p>
            <button
              onClick={() => setSearchFilter('')}
              className="mt-3 text-xs text-[#FF007A] font-bold hover:underline cursor-pointer"
            >
              Clear Filter
            </button>
          </div>
        )}

        {/* 🌟 CRISP WHITE COA VIEWER LIGHTBOX MODAL WITH INTERACTIVE ZOOM IN / OUT & PAN */}
        <AnimatePresence>
          {selectedCOA && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-hidden select-none">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={handleCloseCOA}
                className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs"
              />

              {/* Modal Container */}
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 15 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 15 }}
                className="relative z-10 w-full max-w-5xl max-h-[94vh] flex flex-col bg-white text-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200"
              >
                {/* Header Action Bar */}
                <div className="bg-slate-900 text-white px-4 sm:px-6 py-3.5 flex items-center justify-between shrink-0 border-b border-slate-800 gap-2">
                  <div className="min-w-0">
                    <h3 className="text-sm sm:text-base font-extrabold truncate text-white">
                      {selectedCOA.productTitle}
                    </h3>
                    <p className="text-[11px] text-[#00F0FF] font-mono truncate">
                      Batch: <span className="text-white">{selectedCOA.batchNumber}</span> | Purity: <span className="text-emerald-400 font-bold">{selectedCOA.purity}</span> | Dated: {selectedCOA.date}
                    </p>
                  </div>

                  {/* Zoom Controls & Actions */}
                  <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
                    {/* Zoom Out Button */}
                    <button
                      onClick={handleZoomOut}
                      disabled={zoomLevel <= 0.5}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white cursor-pointer disabled:opacity-40 transition-colors"
                      title="Zoom Out"
                    >
                      <ZoomOut className="w-4 h-4" />
                    </button>

                    {/* Zoom Level Indicator & Reset */}
                    <button
                      onClick={handleResetZoom}
                      className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-[11px] font-mono font-bold text-[#00F0FF] cursor-pointer"
                      title="Reset Zoom (100%)"
                    >
                      {Math.round(zoomLevel * 100)}%
                    </button>

                    {/* Zoom In Button */}
                    <button
                      onClick={handleZoomIn}
                      disabled={zoomLevel >= 3.5}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white cursor-pointer disabled:opacity-40 transition-colors"
                      title="Zoom In"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </button>

                    {/* Reset Button */}
                    <button
                      onClick={handleResetZoom}
                      className="hidden sm:flex p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white cursor-pointer"
                      title="Reset View"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>

                    {/* Open Full Image In New Tab */}
                    <a
                      href={selectedCOA.imageUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white cursor-pointer"
                      title="Open Full Image in New Tab"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>

                    {/* Download Button */}
                    <a
                      href={selectedCOA.imageUrl}
                      target="_blank"
                      rel="noreferrer"
                      download
                      className="glow-pink-btn text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center space-x-1.5 shadow-md shrink-0 cursor-pointer"
                      title="Download Certificate"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Download</span>
                    </a>

                    {/* Close Modal Button */}
                    <button
                      onClick={handleCloseCOA}
                      className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white cursor-pointer ml-1"
                      title="Close"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Interactive Zoomable Viewport */}
                <div
                  ref={scrollContainerRef}
                  onDoubleClick={handleToggleZoom}
                  className="relative flex-1 overflow-auto bg-slate-100 p-4 sm:p-8 flex items-center justify-center min-h-[60vh] max-h-[calc(94vh-65px)] cursor-grab active:cursor-grabbing select-none"
                >
                  <div
                    style={{
                      transform: `scale(${zoomLevel})`,
                      transformOrigin: 'center center',
                      transition: 'transform 0.2s cubic-bezier(0.25, 1, 0.5, 1)',
                    }}
                    className="relative max-w-full rounded-2xl shadow-xl bg-white p-2 border border-slate-300/80"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={selectedCOA.imageUrl || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=800&auto=format&fit=crop'}
                      alt={selectedCOA.productTitle}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=800&auto=format&fit=crop';
                      }}
                      className="max-h-[78vh] w-auto object-contain rounded-xl select-none pointer-events-none"
                    />
                  </div>
                </div>

                {/* Footer Quick Instructions */}
                <div className="bg-white px-6 py-2.5 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                  <span className="hidden sm:inline">
                    💡 Tip: Double-click to toggle zoom, or use the <strong>+</strong> and <strong>-</strong> buttons above to inspect batch purity details.
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    High Purity Verified Analytical Certificate
                  </span>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
