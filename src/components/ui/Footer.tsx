'use client';

import React from 'react';
import { WhatsAppIcon, TelegramIcon } from '@/components/ui/BrandIcons';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 text-slate-700 text-xs pt-10 pb-8 select-none">
      {/* End of Page: Direct WhatsApp & Community Support Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-950 to-black text-white p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl border border-slate-800 relative overflow-hidden">
          {/* Subtle background ambient glows */}
          <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-[#25D366]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-10 -top-10 w-60 h-60 bg-[#0088cc]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-center sm:items-start md:items-center space-y-3 sm:space-y-0 sm:space-x-4 z-10 text-center sm:text-left">
            <div className="w-12 h-12 rounded-2xl bg-[#25D366]/20 border border-[#25D366]/40 flex items-center justify-center text-[#25D366] shrink-0 shadow-[0_0_15px_rgba(37,211,102,0.3)]">
              <WhatsAppIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="inline-flex items-center space-x-2 text-[11px] font-extrabold uppercase tracking-wider text-[#25D366] mb-1">
                <span className="w-2 h-2 rounded-full bg-[#25D366] animate-ping" />
                <span>Direct Support &amp; Inquiries</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight text-white">
                Chat Directly With Us on WhatsApp
              </h3>
              <p className="text-xs text-slate-400 max-w-xl mt-0.5 leading-relaxed">
                Have questions regarding peptide batch analyses, order tracking, or synthesis specifications? Reach out instantly.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0 z-10 w-full sm:w-auto">
            <a
              href="https://wa.me/qr/4RBQJ2R3UD4GN1"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-black text-sm flex items-center justify-center space-x-2.5 shadow-lg hover:shadow-[0_0_20px_rgba(37,211,102,0.4)] transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <WhatsAppIcon className="w-5 h-5" />
              <span>CHAT ON WHATSAPP</span>
            </a>

            <a
              href="https://t.me/+eaZoymP6M3U1Nzc1"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#0088cc] hover:bg-[#0099e6] text-white font-black text-sm flex items-center justify-center space-x-2.5 shadow-lg hover:shadow-[0_0_20px_rgba(0,136,204,0.4)] transition-all transform hover:-translate-y-0.5 cursor-pointer border border-sky-400/30"
            >
              <TelegramIcon className="w-5 h-5" />
              <span>JOIN TELEGRAM</span>
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3 pt-2">
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 font-medium text-slate-700 text-xs sm:text-sm">
          <span>© 2026 STRAYA. All rights reserved.</span>
          <span className="text-slate-300">|</span>
          <a
            href="https://wa.me/qr/4RBQJ2R3UD4GN1"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#25D366] hover:underline font-bold"
          >
            WhatsApp Support
          </a>
          <span className="text-slate-300">|</span>
          <a
            href="https://t.me/+eaZoymP6M3U1Nzc1"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#0088cc] hover:underline font-bold"
          >
            Telegram Channel
          </a>
          <span className="text-slate-300">|</span>
          <span className="hover:text-black cursor-pointer">Privacy Policy</span>
          <span className="text-slate-300">|</span>
          <span className="hover:text-black cursor-pointer">Terms of Service</span>
          <span className="text-slate-300">|</span>
          <span className="hover:text-black cursor-pointer">TGA Compliance</span>
          <span className="text-slate-300">|</span>
          <span className="hover:text-black cursor-pointer">Shipping &amp; Return Policy</span>
        </div>
        <div>
          
        </div>
      </div>
    </footer>
  );
};
