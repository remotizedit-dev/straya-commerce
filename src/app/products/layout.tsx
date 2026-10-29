import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Research Peptides Catalog Australia | Retatrutide, Tirzepatide, GHK-Cu',
  description:
    "Explore Australia's premier research peptide catalog by Straya Labs. HPLC verified >99% purity Retatrutide (10mg, 20mg, 30mg), Tirzepatide (10mg, 20mg), GHK-Cu (50mg), Bacteriostatic Water. Express domestic dispatch from Sydney & Melbourne.",
  keywords:
    'Retatrutide Australia, Retatrutide Reta, buy Retatrutide Australia, Retatrutide 10mg, Retatrutide 20mg, Retatrutide 30mg, Tirzepatide Australia, GHK-Cu Australia, BPC-157 Australia, TB-500, buy peptides online Australia, HPLC verified peptides, Straya Labs',
  alternates: {
    canonical: 'https://www.strayalabsau.com/products',
  },
  openGraph: {
    title: 'Research Peptides Catalog Australia | Retatrutide, Tirzepatide | Straya Labs',
    description:
      'HPLC verified >99% purity research peptides. Retatrutide, Tirzepatide, GHK-Cu with Certificate of Analysis. Express shipping across Australia.',
    url: 'https://www.strayalabsau.com/products',
    siteName: 'Straya Labs',
    locale: 'en_AU',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Research Peptides Catalog Australia | Straya Labs',
    description:
      'HPLC verified >99% purity research peptides. Retatrutide, Tirzepatide, GHK-Cu with Certificate of Analysis.',
  },
};

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Research Peptides Catalog Australia',
    description:
      'Complete catalog of HPLC verified >99% purity research peptides by Straya Labs including Retatrutide, Tirzepatide, and GHK-Cu.',
    url: 'https://www.strayalabsau.com/products',
    isPartOf: {
      '@type': 'WebSite',
      name: 'Straya Labs',
      url: 'https://www.strayalabsau.com',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      {children}
    </>
  );
}
