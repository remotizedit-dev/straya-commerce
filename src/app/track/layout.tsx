import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Track Your Peptide Order | Australia Post Express Delivery',
  description:
    'Track your Straya Labs research order in real time. Enter your Order ID to check payment verification, lab processing, and Australia Post shipping tracking ID.',
  keywords:
    'track peptide order Australia, Australia Post peptide tracking, Straya Labs order tracking, shipping status, peptide dispatch tracking',
  alternates: {
    canonical: 'https://www.strayalabsau.com/track',
  },
  openGraph: {
    title: 'Track Your Peptide Order | Straya Labs Australia',
    description:
      'Track your research order status and Australia Post dispatch tracking ID in real time.',
    url: 'https://www.strayalabsau.com/track',
    siteName: 'Straya Labs',
    locale: 'en_AU',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Track Your Peptide Order | Straya Labs Australia',
    description:
      'Track your research order status and Australia Post dispatch tracking ID in real time.',
  },
};

export default function TrackLayout({ children }: { children: React.ReactNode }) {
  return children;
}
