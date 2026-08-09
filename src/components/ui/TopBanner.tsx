'use client';

import React from 'react';
import { useApp } from '@/lib/store';
import { Tag, Sparkles } from 'lucide-react';

export const TopBanner: React.FC = () => {
  const { siteSettings } = useApp();

  if (!siteSettings.topBannerText) return null;

  return (
    <div className="relative z-40 bg-gradient-to-r from-black via-[#FF007A]/90 to-black text-white text-[11px] sm:text-[13px] font-semibold py-2.5 px-4 shadow-md border-b border-[#FF007A]/30 overflow-hidden select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-center space-x-2.5 text-center">
        <Sparkles className="w-3.5 h-3.5 text-[#00F0FF] animate-bounce shrink-0" />
        <span className="tracking-wide">
          {siteSettings.topBannerText}
        </span>
        <Tag className="w-3.5 h-3.5 text-[#00F0FF] hidden sm:inline-block shrink-0" />
      </div>
    </div>
  );
};
