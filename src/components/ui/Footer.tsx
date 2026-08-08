'use client';

import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 text-slate-700 text-xs py-8 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 font-medium text-slate-700 text-xs sm:text-sm">
          <span>© 2026 STRAYA. All rights reserved.</span>
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
          <p className="text-slate-500 font-medium text-xs">
            Developed by{' '}
            <a
              href="https://remotizedit.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-[#FF007A] hover:underline"
            >
              RemotizedIT
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};
