import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Secure Checkout | Express Domestic Peptide Dispatch',
  description:
    'Complete your research peptide order with secure checkout. Express Australia Post delivery across Sydney, Melbourne, Brisbane, and nationwide by Straya Labs.',
  keywords:
    'buy peptides checkout Australia, Straya Labs checkout, express shipping peptides Australia',
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
