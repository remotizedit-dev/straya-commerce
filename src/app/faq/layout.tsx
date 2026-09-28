import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Peptide Research FAQ | Storage, Reconstitution & Dispatch',
  description:
    'Frequently asked questions regarding research peptides in Australia. Guidance on lyophilized peptide storage, reconstitution for Retatrutide & Tirzepatide, Bacteriostatic Water, and express domestic delivery.',
  keywords:
    'peptide FAQ Australia, how to store Retatrutide, Retatrutide reconstitution, research peptide delivery Australia, Tirzepatide storage, Bacteriostatic Water mixing, Straya Labs FAQ',
  openGraph: {
    title: 'Peptide Research FAQ | Straya Labs Australia',
    description:
      'Frequently asked questions about peptide storage, reconstitution, HPLC testing, and express delivery.',
  },
};

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return children;
}
