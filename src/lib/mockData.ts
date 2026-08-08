import { Product, SiteSettings, COAItem, FAQItem, PromoCode, Order, Lead, CustomerRecord } from './types';

export const INITIAL_SITE_SETTINGS: SiteSettings = {
  logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=300&auto=format&fit=crop',
  welcomingVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-futuristic-glowing-digital-lines-31589-large.mp4',
  welcomingVideoDurationSec: 3.0,
  topBannerText: '🔥 10% SALE ON GOING - USE CODE "STRAYA10" AT CHECKOUT FOR FREE EXPRESS SHIPPING ACROSS AUSTRALIA 🔥',
  heroMediaType: 'video',
  heroMediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-abstract-glowing-cyan-and-pink-particles-loop-42861-large.mp4',
  heroTitle: 'Australia\'s Premier Research Peptide Source',
  heroSubtitle: 'HPLC Tested & Verified >99% Purity. Premium Grade Peptides Dispatched Express Daily from Sydney & Melbourne.',
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

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-bpc157-5mg',
    title: 'BPC-157 (Body Protection Compound)',
    images: [
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1579165466741-7f35e4755660?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=800&auto=format&fit=crop'
    ],
    description: 'BPC-157 is a pentadecapeptide composed of 15 amino acids derived from human gastric juice. Renowned in research literature for tendon, ligament, and gut mucosal cellular studies.',
    technicalSpecs: [
      { label: 'Sequence', value: 'Gly-Glu-Pro-Pro-Pro-Gly-Lys-Pro-Ala-Asp-Asp-Ala-Gly-Leu-Val' },
      { label: 'Purity', value: '99.6% (HPLC Verified)' },
      { label: 'Molecular Weight', value: '1419.5 g/mol' },
      { label: 'CAS Number', value: '137525-51-0' },
      { label: 'Form', value: 'Lyophilized White Powder' },
      { label: 'Storage', value: '-20°C Desiccated' }
    ],
    price: 85.00,
    discountedPrice: 72.25,
    category: 'Tissue Repair',
    type: 'best_sell',
    stock: 45,
    rating: 4.9,
    reviewsCount: 128,
    dosage: '5mg Vial',
    purity: '99.6%'
  },
  {
    id: 'prod-tb500-5mg',
    title: 'TB-500 (Thymosin Beta-4 Derivative)',
    images: [
      'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=800&auto=format&fit=crop'
    ],
    description: 'TB-500 is a synthetic version of the active region of Thymosin Beta-4, studied for actin binding and cellular migration dynamics in cellular regeneration models.',
    technicalSpecs: [
      { label: 'Sequence', value: 'Ac-Ser-Asp-Lys-Pro-Asp-Met-Ala-Glu-Ile-Glu-Lys-Phe-Asp-Lys-Ser-Lys-Leu-Lys' },
      { label: 'Purity', value: '99.4% (HPLC)' },
      { label: 'Molecular Weight', value: '4963.5 g/mol' },
      { label: 'CAS Number', value: '77591-33-4' },
      { label: 'Form', value: 'Lyophilized White Powder' }
    ],
    price: 95.00,
    discountedPrice: 80.75,
    category: 'Tissue Repair',
    type: 'best_sell',
    stock: 30,
    rating: 4.85,
    reviewsCount: 94,
    dosage: '5mg Vial',
    purity: '99.4%'
  },
  {
    id: 'prod-semaglutide-5mg',
    title: 'Semaglutide Research Solution',
    images: [
      'https://images.unsplash.com/photo-1579165466741-7f35e4755660?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=800&auto=format&fit=crop'
    ],
    description: 'Long-acting GLP-1 receptor agonist studied for glucose homeostasis, appetite regulation pathways, and metabolic signaling in preclinical research.',
    technicalSpecs: [
      { label: 'Purity', value: '99.8% (HPLC Mass Spec)' },
      { label: 'Molecular Formula', value: 'C187H291N45O59' },
      { label: 'Molecular Weight', value: '4113.58 g/mol' },
      { label: 'Form', value: 'Lyophilized Crystal' }
    ],
    price: 160.00,
    discountedPrice: 136.00,
    category: 'Metabolic & Fat Loss',
    type: 'best_sell',
    stock: 25,
    rating: 5.0,
    reviewsCount: 160,
    dosage: '5mg Vial',
    purity: '99.8%'
  },
  {
    id: 'prod-tirzepatide-10mg',
    title: 'Tirzepatide Dual GLP-1/GIP Agonist',
    images: [
      'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?q=80&w=800&auto=format&fit=crop'
    ],
    description: 'Dual GIP and GLP-1 receptor co-agonist peptide evaluated for synergy in metabolic pathways and glycemic control research.',
    technicalSpecs: [
      { label: 'Purity', value: '99.7% (HPLC)' },
      { label: 'Molecular Weight', value: '4813.45 g/mol' },
      { label: 'Form', value: 'Lyophilized Sterile Powder' }
    ],
    price: 240.00,
    discountedPrice: 204.00,
    category: 'Metabolic & Fat Loss',
    type: 'best_sell',
    stock: 18,
    rating: 4.95,
    reviewsCount: 110,
    dosage: '10mg Vial',
    purity: '99.7%'
  },
  {
    id: 'prod-ghkcu-50mg',
    title: 'GHK-Cu Copper Tripeptide',
    images: [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=800&auto=format&fit=crop'
    ],
    description: 'Naturally occurring copper tripeptide studied for collagen matrix synthesis, skin fibroblast activity, and extracellular remodeling.',
    technicalSpecs: [
      { label: 'Sequence', value: 'Gly-His-Lys (Cu2+ Bound)' },
      { label: 'Purity', value: '99.5% (HPLC)' },
      { label: 'Appearance', value: 'Vibrant Blue Lyophilized Powder' }
    ],
    price: 110.00,
    discountedPrice: 93.50,
    category: 'Anti-Aging & Cellular',
    type: 'featured',
    stock: 40,
    rating: 4.9,
    reviewsCount: 88,
    dosage: '50mg Vial',
    purity: '99.5%'
  },
  {
    id: 'prod-wolverine-blend',
    title: 'Wolverine Repair Blend (BPC-157 5mg + TB-500 5mg)',
    images: [
      'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1579165466741-7f35e4755660?q=80&w=800&auto=format&fit=crop'
    ],
    description: 'Synergistic combination vial containing 5mg BPC-157 and 5mg TB-500 co-lyophilized for tissue repair research.',
    technicalSpecs: [
      { label: 'Ratio', value: '1:1 (5mg BPC-157 / 5mg TB-500)' },
      { label: 'Purity', value: '99.6% Combined' },
      { label: 'Form', value: 'Lyophilized Dual Powder' }
    ],
    price: 165.00,
    discountedPrice: 140.25,
    category: 'Blends & Complexes',
    type: 'featured',
    stock: 22,
    rating: 5.0,
    reviewsCount: 142,
    dosage: '10mg Dual Vial',
    purity: '99.6%'
  }
];

export const INITIAL_COAS: COAItem[] = [
  {
    id: 'coa-1',
    productTitle: 'BPC-157 (Body Protection Compound) 5mg',
    batchNumber: 'STR-BPC-2026-08',
    purity: '99.6%',
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1000&auto=format&fit=crop',
    date: '2026-08-01',
  },
  {
    id: 'coa-2',
    productTitle: 'TB-500 (Thymosin Beta-4) 5mg',
    batchNumber: 'STR-TB500-2026-07',
    purity: '99.4%',
    imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1000&auto=format&fit=crop',
    date: '2026-07-28',
  },
  {
    id: 'coa-3',
    productTitle: 'Semaglutide Solution 5mg',
    batchNumber: 'STR-SEMA-2026-08',
    purity: '99.8%',
    imageUrl: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?q=80&w=1000&auto=format&fit=crop',
    date: '2026-08-03',
  }
];

export const INITIAL_FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'Orders & Shipping',
    question: 'Where are Straya peptides shipped from?',
    answer: 'All orders are stocked, tested, and dispatched directly from our climate-controlled facilities in Sydney and Melbourne, Australia. We send via Australia Post Express with full door-to-door tracking.'
  },
  {
    id: 'faq-2',
    category: 'Purity & Quality',
    question: 'How do you verify the purity of your peptides?',
    answer: 'Every single batch undergoes independent laboratory analysis utilizing High-Performance Liquid Chromatography (HPLC) and Mass Spectrometry (MS). Certificates of Analysis (COAs) with batch numbers are published directly on our COA page.'
  },
  {
    id: 'faq-3',
    category: 'Storage & Handling',
    question: 'How should lyophilized peptides be stored upon arrival?',
    answer: 'Lyophilized (dry) peptides should be stored in a freezer at -20°C away from light. Once reconstituted with bacteriostatic water, store in a refrigerator between 2°C to 8°C and use within 30 days.'
  },
  {
    id: 'faq-4',
    category: 'Payment Options',
    question: 'What payment methods do you accept?',
    answer: 'We accept direct Australian Bank Transfers (EFT / Osko / PayID) for immediate, secure processing. Once your order is placed, full bank details and an order reference are rendered on your checkout screen.'
  },
  {
    id: 'faq-5',
    category: 'Legal Disclaimer',
    question: 'Are these peptides approved for human therapeutic use?',
    answer: 'No. All compounds listed on Straya Peptides are exclusively synthesized for laboratory research, in-vitro testing, and chemical analysis. They are strictly not for human consumption, cosmetic, or therapeutic use under Australian TGA laws.'
  }
];

export const INITIAL_PROMO_CODES: PromoCode[] = [
  {
    id: 'promo-straya10',
    code: 'STRAYA10',
    discountType: 'percentage',
    discountValue: 10,
    maxUsage: 1000,
    usedCount: 0,
    active: true,
    createdAt: new Date().toISOString(),
  }
];

export const INITIAL_LEADS: Lead[] = [
  {
    id: 'lead-1',
    name: 'Dr. Harrison Vance',
    phone: '0401 229 881',
    email: 'h.vance@researchlab.com.au',
    source: 'call_request',
    message: 'Inquiring about bulk HPLC peptide batch COA documents.',
    status: 'new',
    createdAt: new Date().toISOString(),
  },
];

export const INITIAL_CUSTOMERS: CustomerRecord[] = [
  {
    id: 'cust-1',
    firstName: 'Lachlan',
    lastName: 'MacKenzie',
    email: 'lachlan.m@sydneybio.au',
    phone: '0412 890 314',
    street: '42 Macquarie Street',
    suburb: 'Sydney',
    state: 'NSW',
    postcode: '2000',
    totalOrders: 3,
    totalSpent: 1050,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'cust-2',
    firstName: 'Sarah',
    lastName: 'Jenkins',
    email: 's.jenkins@melbournechem.com.au',
    phone: '0488 512 901',
    street: '150 Collins Street',
    suburb: 'Melbourne',
    state: 'VIC',
    postcode: '3000',
    totalOrders: 1,
    totalSpent: 280,
    createdAt: new Date().toISOString(),
  },
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'STRAYA-894102',
    createdAt: new Date().toISOString(),
    customer: {
      firstName: 'Lachlan',
      lastName: 'MacKenzie',
      email: 'lachlan.m@sydneybio.au',
      phone: '0412 890 314',
      address: {
        street: '42 Macquarie Street',
        suburb: 'Sydney',
        state: 'NSW',
        postcode: '2000',
        country: 'Australia',
      },
    },
    billingSameAsShipping: true,
    items: [
      {
        product: INITIAL_PRODUCTS[0],
        quantity: 2,
      },
      {
        product: INITIAL_PRODUCTS[1],
        quantity: 1,
      },
    ],
    subtotal: 350,
    deliveryOption: INITIAL_SITE_SETTINGS.deliveryOptions[0],
    totalAmount: 350,
    paymentStatus: 'paid',
    deliveryStatus: 'Shipped',
  },
  {
    id: 'STRAYA-741295',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    customer: {
      firstName: 'Sarah',
      lastName: 'Jenkins',
      email: 's.jenkins@melbournechem.com.au',
      phone: '0488 512 901',
      address: {
        street: '150 Collins Street',
        suburb: 'Melbourne',
        state: 'VIC',
        postcode: '3000',
        country: 'Australia',
      },
    },
    billingSameAsShipping: true,
    items: [
      {
        product: INITIAL_PRODUCTS[2],
        quantity: 1,
      },
    ],
    subtotal: 280,
    deliveryOption: INITIAL_SITE_SETTINGS.deliveryOptions[0],
    totalAmount: 280,
    paymentStatus: 'unpaid',
    deliveryStatus: 'Payment Received',
  },
];
