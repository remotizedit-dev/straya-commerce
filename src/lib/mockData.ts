import { Product, SiteSettings, COAItem, FAQItem, PromoCode, Order, Lead, CustomerRecord } from './types';

export const INITIAL_SITE_SETTINGS: SiteSettings = {
  logoUrl: '',
  welcomingVideoUrl: '',
  welcomingVideoDurationSec: 3.0,
  topBannerText: '🔥 10% SALE ON GOING - USE CODE "STRAYA10" AT CHECKOUT FOR FREE EXPRESS SHIPPING ACROSS AUSTRALIA 🔥',
  heroMediaType: 'video',
  heroMediaUrl: '',
  heroTitle: 'Australia\'s Premier Research Peptide Source',
  heroSubtitle: 'HPLC Tested & Verified >99% Purity. Premium Grade Peptides Dispatched Express Daily from Sydney & Melbourne.',
  heroTextColor: '#FFFFFF',
  introTitle: 'Best Peptides in Australia',
  introText: 'Welcome to Straya Peptides – Australia\'s trusted laboratory supplier for high-purity research peptides. Every batch undergoes rigorous High-Performance Liquid Chromatography (HPLC) and Mass Spectrometry (MS) testing to guarantee quality, sequence accuracy, and potency.',
  disclaimerText: 'STRAYA PEPTIDES DISCLAIMER: All items sold on this website are strictly intended for laboratory research and analytical purposes only. They are not intended for human consumption, cosmetic use, or veterinary applications. Please consult Australian TGA guidelines.',
  contactEmail: 'support@straya-peptides.com.au',
  contactPhone: '+61 1800 787 292',
  businessHours: 'Monday - Friday: 8:00 AM - 6:00 PM AEST | Sat: 9:00 AM - 2:00 PM',
  address: 'Level 24, 200 George Street, Sydney NSW 2000, Australia',
  mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3312.839210292723!2d151.2062634!3d-33.8643868!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b12ae43ee5723b7%3A0x6b8568b20dbb8830!2s200%20George%20St%2C%20Sydney%20NSW%202000!5e0!3m2!1sen!2sau!4v1700000000000!5m2!1sen!2sau',
  socialLinks: {
    instagram: 'https://instagram.com/strayapeptides',
    twitter: 'https://twitter.com/strayapeptides',
    facebook: 'https://facebook.com/strayapeptides',
    telegram: 'https://t.me/strayapeptides',
  },
  bankInfo: {
    bankName: 'National Australia Bank (NAB)',
    accountName: 'STRAYA BIOTECH PTY LTD',
    bsb: '082-057',
    accountNumber: '88392-1049',
    payId: 'pay@straya-peptides.com.au',
    instructions: 'Please use your Order Number (e.g. STRAYA-XXXXXX) as the payment description/reference when completing your bank transfer or PayID. Orders are dispatched immediately upon payment verification.',
  },
  deliveryOptions: [
    {
      id: 'del-std',
      name: 'Australia Post Standard',
      description: '3-5 Business Days with Tracking',
      price: 12.00,
    },
    {
      id: 'del-exp',
      name: 'Express Post Courier',
      description: '1-2 Business Days Express Dispatch',
      price: 18.00,
    },
    {
      id: 'del-free',
      name: 'Free Express Post (Orders over $200)',
      description: 'Priority Same-Day Dispatch',
      price: 0.00,
    },
  ],
  categories: ['Tissue Repair', 'Metabolic & Fat Loss', 'Anti-Aging & Cellular', 'Cognitive & GHRP', 'Blends & Complexes'],
  seoTitle: 'Straya Peptides | Australia\'s Highest Purity Research Peptides',
  seoMetaDescription: 'Buy high purity research peptides in Australia. HPLC tested BPC-157, TB-500, Semaglutide, Tirzepatide, GHK-Cu with Certificate of Analysis. Express overnight shipping.',
  seoKeywords: 'peptides Australia, buy BPC-157 Sydney, TB-500 Melbourne, Semaglutide Australia, HPLC research peptides, GHK-Cu, Straya peptides',
};

// 100% Real-time Server Architecture: Zero Mock Data across products, coas, faqs, promos, leads, customers, and orders
export const INITIAL_PRODUCTS: Product[] = [];
export const INITIAL_COAS: COAItem[] = [];
export const INITIAL_FAQS: FAQItem[] = [];
export const INITIAL_PROMO_CODES: PromoCode[] = [];
export const INITIAL_LEADS: Lead[] = [];
export const INITIAL_CUSTOMERS: CustomerRecord[] = [];
export const INITIAL_ORDERS: Order[] = [];
