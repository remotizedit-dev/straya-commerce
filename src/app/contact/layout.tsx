import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Research Support Desk | Straya Labs Australia',
  description:
    'Contact Straya Labs Australia for HPLC verification inquiries, custom peptide synthesis, and general research compound support. Domestic dispatch across Sydney, Melbourne & Brisbane.',
  keywords:
    'contact Straya Labs, peptide customer support Australia, peptide supplier contact, research peptide inquiries Australia, Straya Labs contact',
  alternates: {
    canonical: 'https://www.strayalabsau.com/contact',
  },
  openGraph: {
    title: 'Contact Research Support Desk | Straya Labs Australia',
    description:
      'Get in touch with the Straya Labs research support desk for compound inquiries and HPLC verification assistance.',
    url: 'https://www.strayalabsau.com/contact',
    siteName: 'Straya Labs',
    locale: 'en_AU',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Research Support Desk | Straya Labs Australia',
    description:
      'Contact Straya Labs Australia for HPLC verification inquiries and research peptide support.',
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  const contactJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact Straya Labs Research Desk',
    url: 'https://www.strayalabsau.com/contact',
    mainEntity: {
      '@type': 'Organization',
      name: 'Straya Labs',
      email: 'support@straya-peptides.com.au',
      telephone: '+61 1800 787 292',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Level 24, 200 George Street',
        addressLocality: 'Sydney',
        addressRegion: 'NSW',
        postalCode: '2000',
        addressCountry: 'AU',
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactJsonLd) }}
      />
      {children}
    </>
  );
}
