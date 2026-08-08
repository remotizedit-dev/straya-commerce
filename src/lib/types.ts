export type ProductType = 'best_sell' | 'featured' | 'standard';

export interface Product {
  id: string;
  title: string;
  images: string[];
  description: string;
  technicalSpecs: { label: string; value: string }[];
  price: number;
  discountedPrice: number;
  category: string;
  type: ProductType;
  stock: number;
  rating?: number;
  reviewsCount?: number;
  dosage?: string;
  purity?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CustomerAddress {
  street: string;
  suburb: string;
  state: string; // NSW, VIC, QLD, WA, SA, TAS, ACT, NT
  postcode: string;
  country: string;
}

export interface CustomerDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: CustomerAddress;
}

export interface DeliveryOption {
  id: string;
  name: string;
  description: string;
  price: number;
}

export type PaymentStatus = 'unpaid' | 'paid';
export type DeliveryStatus = 'Payment Received' | 'Processing' | 'Shipped' | 'Delivered';

export interface Order {
  id: string; // Order Number e.g. STRAYA-894102
  createdAt: string;
  customer: CustomerDetails;
  billingSameAsShipping: boolean;
  billingAddress?: CustomerAddress;
  items: CartItem[];
  subtotal: number;
  deliveryOption: DeliveryOption;
  promoCode?: {
    code: string;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    discountAmount: number;
  };
  totalAmount: number;
  paymentStatus: PaymentStatus;
  deliveryStatus: DeliveryStatus;
  notes?: string;
}

export interface CustomerRecord {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  street: string;
  suburb: string;
  state: string;
  postcode: string;
  totalOrders: number;
  totalSpent: number;
  createdAt: string;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  source: 'call_request' | 'contact_form';
  message?: string;
  status: 'new' | 'contacted' | 'resolved';
  createdAt: string;
}

export interface PromoCode {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number; // e.g. 10 for 10% or 20 for $20 AUD off
  maxUsage: number;
  usedCount: number;
  active: boolean;
  createdAt: string;
}

export interface BankInfo {
  bankName: string;
  accountName: string;
  bsb: string;
  accountNumber: string;
  payId: string;
  instructions: string;
}

export interface SiteSettings {
  logoUrl: string;
  welcomingVideoUrl: string;
  welcomingVideoDurationSec?: number; // Dynamic Duration in seconds (e.g. 3.0 or 2.46)
  topBannerText: string;
  heroMediaType: 'video' | 'image';
  heroMediaUrl: string;
  heroTitle: string;
  heroSubtitle: string;
  heroTextColor?: string;
  introTitle: string;
  introText: string;
  disclaimerText: string;
  contactEmail: string;
  contactPhone: string;
  businessHours: string;
  address: string;
  mapEmbedUrl: string;
  socialLinks: {
    instagram: string;
    twitter: string;
    facebook: string;
    telegram: string;
  };
  bankInfo: BankInfo;
  deliveryOptions: DeliveryOption[];
  categories: string[];
  seoTitle: string;
  seoMetaDescription: string;
  seoKeywords: string;
}

export interface COAItem {
  id: string;
  productTitle: string;
  batchNumber: string;
  purity: string;
  imageUrl: string;
  pdfUrl?: string;
  date: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}
