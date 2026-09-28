import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Research Support Desk',
  description:
    'Contact Straya Labs Australia for HPLC verification inquiries, custom peptide synthesis, and general research compound support. Domestic dispatch across Sydney, Melbourne & Brisbane.',
  keywords:
    'contact Straya Labs, peptide customer support Australia, peptide supplier contact, research peptide inquiries Australia, Straya Labs contact',
  openGraph: {
    title: 'Contact Research Support Desk | Straya Labs Australia',
    description:
      'Get in touch with the Straya Labs research support desk for compound inquiries and HPLC verification assistance.',
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
