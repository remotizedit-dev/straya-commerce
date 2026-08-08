'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/lib/store';
import { COAItem } from '@/lib/types';
import { Award, Eye, Download, X, Search } from 'lucide-react';

export default function COAPage() {
  const { coas } = useApp();
  const [selectedCOA, setSelectedCOA] = useState<COAItem | null>(null);
  const [searchFilter, setSearchFilter] = useState('');

  const filteredCOAs = coas.filter(
    (item) =>
      item.productTitle.toLowerCase().includes(searchFilter.toLowerCase()) ||
      item.batchNumber.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        {/* Header Banner */}
        <div className="relative rounded-3xl bg-slate-900 text-white p-8 sm:p-12 overflow-hidden shadow-xl text-center">
          <div className="relative z-10 max-w-3xl mx-auto space-y-3 flex flex-col items-center justify-center">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#FF007A]/20 text-[#FF007A] text-xs font-bold uppercase tracking-wider">
              <Award className="w-4 h-4" />
              <span>High Performance Liquid Chromatography (HPLC)</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-center">
              Certificate of Analysis (COA)
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed text-center max-w-2xl">
              Transparency is our core standard. View and inspect batch-specific HPLC and Mass Spectrometry laboratory reports for all Straya research peptides.
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between gap-4">
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

          <span className="text-xs text-[#FF007A] font-bold hidden sm:inline-block">
            Showing {filteredCOAs.length} Verified Lab Reports
          </span>
        </div>

        {/* Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCOAs.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ y: -4 }}
              className="group bg-white rounded-2xl border border-slate-200 hover:border-[#FF007A]/50 overflow-hidden shadow-sm hover:shadow-xl flex flex-col justify-between transition-all"
            >
              <div
                onClick={() => setSelectedCOA(item)}
                className="relative aspect-[1/1.414] w-full bg-slate-100 cursor-pointer overflow-hidden group-hover:brightness-95 transition-all"
              >
                <Image
                  src={item.imageUrl}
                  alt={item.productTitle}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                  <span className="px-4 py-2 rounded-xl glow-pink-btn text-white font-bold text-xs flex items-center space-x-1.5 shadow-lg">
                    <Eye className="w-4 h-4" />
                    <span>PREVIEW FULLSCREEN</span>
                  </span>
                </div>
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-[#FF007A] text-white text-[10px] font-black uppercase">
                  {item.purity} PURITY
                </span>
              </div>

              <div className="p-5 space-y-3 bg-white">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 line-clamp-1">{item.productTitle}</h3>
                  <div className="flex items-center justify-between text-xs text-slate-500 mt-1 font-mono">
                    <span>Batch: <strong className="text-[#FF007A]">{item.batchNumber}</strong></span>
                    <span>Date: {item.date}</span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedCOA(item)}
                  className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs flex items-center justify-center space-x-2 transition-colors cursor-pointer"
                >
                  <Eye className="w-4 h-4 text-[#FF007A]" />
                  <span>View Certificate</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Modal Lightbox */}
        <AnimatePresence>
          {selectedCOA && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedCOA(null)}
                className="fixed inset-0 bg-black/80 backdrop-blur-sm"
              />

              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative z-10 w-full max-w-4xl bg-slate-900 text-white rounded-2xl overflow-hidden shadow-2xl p-6 space-y-4"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">{selectedCOA.productTitle}</h3>
                    <p className="text-xs text-[#00F0FF] font-mono">
                      Batch: {selectedCOA.batchNumber} | Purity: {selectedCOA.purity} | Dated: {selectedCOA.date}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedCOA(null)}
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="relative aspect-[16/10] w-full bg-black rounded-xl overflow-hidden">
                  <Image
                    src={selectedCOA.imageUrl}
                    alt={selectedCOA.productTitle}
                    fill
                    className="object-contain"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <a
                    href={selectedCOA.imageUrl}
                    target="_blank"
                    rel="noreferrer"
                    download
                    className="glow-pink-btn text-white font-bold text-xs px-6 py-3 rounded-xl flex items-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download High-Res COA</span>
                  </a>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
