import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Research Peptides Catalog Australia | Retatrutide, Tirzepatide, GHK-Cu',
  description: 'Explore Australia\'s premier research peptide catalog by Straya Labs. HPLC verified >99% purity Retatrutide (10mg, 20mg, 30mg), Tirzepatide (10mg, 20mg), GHK-Cu (50mg), Bacteriostatic Water. Express domestic dispatch from Sydney & Melbourne.',
  keywords: 'Retatrutide Australia, Retatrutide Reta, buy Retatrutide Australia, Retatrutide 10mg, Retatrutide 20mg, Retatrutide 30mg, Tirzepatide Australia, GHK-Cu Australia, BPC-157 Australia, TB-500, buy peptides online Australia, HPLC verified peptides, Straya Labs',
  openGraph: {
    title: 'Research Peptides Catalog Australia | Retatrutide, Tirzepatide | Straya Labs',
    description: 'HPLC verified >99% purity research peptides. Retatrutide, Tirzepatide, GHK-Cu with Certificate of Analysis. Express shipping across Australia.',
  },
};

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
