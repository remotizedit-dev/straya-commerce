'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { AppProvider } from '@/lib/store';
import { ResearchDisclaimerModal } from '@/components/ui/ResearchDisclaimerModal';
import { TopBanner } from '@/components/ui/TopBanner';
import { Navbar } from '@/components/ui/Navbar';
import { CartDrawer } from '@/components/ui/CartDrawer';
import { RequestCallModal } from '@/components/ui/RequestCallModal';
import { Footer } from '@/components/ui/Footer';

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const [isCMSHost, setIsCMSHost] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const host = window.location.hostname;
      if (
        host.startsWith('cms.') ||
        host.startsWith('cms-') ||
        host.includes('cms.domain.com') ||
        host.includes('cms-domain.com')
      ) {
        setIsCMSHost(true);
      }
    }
  }, []);

  const isCMSPage = pathname.startsWith('/cms') || isCMSHost;

  return (
    <AppProvider>
      {isCMSPage ? (
        // Dedicated CMS Portal Shell (NO Storefront Navbar, NO TopBanner, NO Footer)
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased">
          {children}
        </div>
      ) : (
        // Storefront Shell (White Main Body + Black Navbar & Footer)
        <div className="min-h-screen flex flex-col bg-white text-slate-900 font-sans antialiased">
          <ResearchDisclaimerModal />
          <TopBanner />
          <Navbar />
          <main className="flex-grow">{children}</main>
          <CartDrawer />
          <RequestCallModal />
          <Footer />
        </div>
      )}
    </AppProvider>
  );
};
