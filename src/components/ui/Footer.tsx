'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/store';
import { ShieldAlert, Mail, Phone, MapPin, Send, Globe, MessageSquare, Share2 } from 'lucide-react';

export const Footer: React.FC = () => {
  const { siteSettings } = useApp();

  return (
    <footer className="bg-[#050508] border-t border-white/10 text-gray-400 text-xs pt-16 pb-12 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF007A] to-[#00F0FF] p-0.5 shadow-[0_0_15px_rgba(255,0,122,0.4)]">
                <div className="w-full h-full bg-[#09090D] rounded-[10px] flex items-center justify-center font-black text-lg text-white">
                  S
                </div>
              </div>
              <span className="font-black text-2xl tracking-wider text-white">
                STRAYA<span className="text-[#FF007A]">.</span>
              </span>
            </Link>
            <p className="text-gray-400 text-xs leading-relaxed max-w-sm">
              Australia&apos;s leading high-purity research peptide laboratory provider. Every batch is rigorously HPLC mass spectrometry tested for analytical precision.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <a
                href={siteSettings.socialLinks.instagram}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-white/5 hover:bg-[#FF007A]/20 hover:text-white transition-colors"
                title="Instagram Channel"
              >
                <Share2 className="w-4 h-4 text-[#FF007A]" />
              </a>
              <a
                href={siteSettings.socialLinks.twitter}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-white/5 hover:bg-[#00F0FF]/20 hover:text-white transition-colors"
                title="Twitter X Updates"
              >
                <Globe className="w-4 h-4 text-[#00F0FF]" />
              </a>
              <a
                href={siteSettings.socialLinks.facebook}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-white/5 hover:bg-[#FF007A]/20 hover:text-white transition-colors"
                title="Facebook Community"
              >
                <MessageSquare className="w-4 h-4 text-[#FF007A]" />
              </a>
              <a
                href={siteSettings.socialLinks.telegram}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-white/5 hover:bg-[#00F0FF]/20 hover:text-white transition-colors"
                title="Telegram Direct Channel"
              >
                <Send className="w-4 h-4 text-[#00F0FF]" />
              </a>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="space-y-3">
            <h4 className="text-white font-extrabold uppercase tracking-wider text-xs border-b border-[#FF007A]/40 pb-2 inline-block">
              Navigation
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-white transition-colors">All Peptides</Link>
              </li>
              <li>
                <Link href="/coa" className="hover:text-white transition-colors">Certificate of Analysis</Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">Frequently Asked Questions</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link>
              </li>
            </ul>
          </div>

          {/* Australian Support */}
          <div className="space-y-3">
            <h4 className="text-white font-extrabold uppercase tracking-wider text-xs border-b border-[#00F0FF]/40 pb-2 inline-block">
              Australia Contact
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-400">
              <li className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-[#FF007A] shrink-0 mt-0.5" />
                <span>{siteSettings.address}</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-[#00F0FF] shrink-0" />
                <span>{siteSettings.contactPhone}</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-[#FF007A] shrink-0" />
                <span>{siteSettings.contactEmail}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* TGA & Research Disclaimer Box */}
        <div className="p-5 rounded-2xl bg-[#0A0A10] border border-[#FF007A]/30 flex flex-col md:flex-row items-start space-y-3 md:space-y-0 md:space-x-4">
          <ShieldAlert className="w-6 h-6 text-[#FF007A] shrink-0 mt-0.5" />
          <p className="text-[11px] text-gray-400 leading-relaxed">
            <strong className="text-white">RESEARCH DISCLAIMER:</strong> {siteSettings.disclaimerText}
          </p>
        </div>

        {/* Copyright Footer Line */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-500 gap-3">
          <p>© {new Date().getFullYear()} Straya Biotech Pty Ltd. All Rights Reserved. Made for Australia.</p>
          <div className="flex items-center space-x-4">
            <span className="hover:text-gray-300">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-gray-300">Terms of Service</span>
            <span>•</span>
            <span className="hover:text-gray-300">TGA Compliance</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
