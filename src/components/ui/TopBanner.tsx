'use client';

import React from 'react';
import { useApp } from '@/lib/store';
import { Truck } from 'lucide-react';

export const TopBanner: React.FC = () => {
  const { siteSettings } = useApp();

  const rawText = siteSettings.topBannerText || '';
  const isOldSaleText = rawText.includes('STRAYA10') || rawText.includes('10% SALE');
  const bannerText = (!rawText || isOldSaleText)
    ? 'Free Express Shipping on Order Over $200'
    : rawText;

  return (
    <div className="relative z-40 bg-slate-950 text-white text-[11px] sm:text-xs font-semibold py-2 px-4 shadow-sm border-b border-slate-800/80 overflow-hidden select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-center space-x-2 text-center">
        <Truck className="w-3.5 h-3.5 text-[#00F0FF] shrink-0" />
        <span className="tracking-wide font-medium">
          {bannerText}
        </span>
      </div>
    </div>
  );
};

