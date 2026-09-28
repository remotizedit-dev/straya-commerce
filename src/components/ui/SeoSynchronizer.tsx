'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useApp } from '@/lib/store';

export function SeoSynchronizer() {
  const { siteSettings } = useApp();
  const pathname = usePathname();

  useEffect(() => {
    if (typeof document === 'undefined') return;

    // Only update homepage automatically from CMS siteSettings.seoTitle
    // Other sub-pages will maintain their own specific page titles
    if (pathname === '/' && siteSettings.seoTitle) {
      document.title = siteSettings.seoTitle;
    }

    // Update global meta description if available
    if (pathname === '/' && siteSettings.seoMetaDescription) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', siteSettings.seoMetaDescription);
    }

    // Update global keywords if available
    if (pathname === '/' && siteSettings.seoKeywords) {
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.setAttribute('name', 'keywords');
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute('content', siteSettings.seoKeywords);
    }
  }, [pathname, siteSettings.seoTitle, siteSettings.seoMetaDescription, siteSettings.seoKeywords]);

  return null;
}
