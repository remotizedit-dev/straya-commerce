import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Peptide Research FAQ | Storage, Reconstitution & Dispatch',
  description:
    'Frequently asked questions regarding research peptides in Australia. Guidance on lyophilized peptide storage, reconstitution for Retatrutide & Tirzepatide, Bacteriostatic Water, and express domestic delivery.',
  keywords:
    'peptide FAQ Australia, how to store Retatrutide, Retatrutide reconstitution, research peptide delivery Australia, Tirzepatide storage, Bacteriostatic Water mixing, Straya Labs FAQ',
  alternates: {
    canonical: 'https://www.strayalabsau.com/faq',
  },
  openGraph: {
    title: 'Peptide Research FAQ | Straya Labs Australia',
    description:
      'Frequently asked questions about peptide storage, reconstitution, HPLC testing, and express delivery.',
    url: 'https://www.strayalabsau.com/faq',
    siteName: 'Straya Labs',
    locale: 'en_AU',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Peptide Research FAQ | Straya Labs Australia',
    description:
      'Frequently asked questions regarding research peptides in Australia, storage, and express delivery.',
  },
};

export default async function FAQLayout({ children }: { children: React.ReactNode }) {
  let faqEntities: { '@type': string; name: string; acceptedAnswer: { '@type': string; text: string } }[] = [];

  try {
    const dbUrl =
      process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL ||
      'https://straya-peptides-rit-default-rtdb.asia-southeast1.firebasedatabase.app';
    const res = await fetch(`${dbUrl}/faqs.json`, { next: { revalidate: 3600 } });
    if (res.ok) {
      const data = await res.json();
      if (data && typeof data === 'object') {
        const items = Array.isArray(data)
          ? data.filter(Boolean)
          : Object.values(data);
        faqEntities = items
          .filter((f: any) => f && f.question && f.answer)
          .map((f: any) => ({
            '@type': 'Question',
            name: f.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: f.answer,
            },
          }));
      }
    }
  } catch (e) {
    // fallback
  }

  // Fallback high-value SEO FAQs if DB is empty or loading
  if (faqEntities.length === 0) {
    faqEntities = [
      {
        '@type': 'Question',
        name: 'How are Straya Labs peptides tested and verified?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Every batch of research peptides undergoes third-party High-Performance Liquid Chromatography (HPLC) and Mass Spectrometry (MS) analysis to confirm sequence integrity and ensure minimum >99% purity.',
        },
      },
      {
        '@type': 'Question',
        name: 'What are the recommended storage conditions for lyophilized peptides?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Lyophilized (freeze-dried) peptides should be stored in a dry environment at -20°C for long-term storage or 2°C to 8°C for short-term research periods away from direct light.',
        },
      },
      {
        '@type': 'Question',
        name: 'What are domestic shipping and delivery timeframes in Australia?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Orders are dispatched domestically from our Sydney and Melbourne facilities via Australia Post Express with cold insulated packaging, arriving within 1-2 business days across metro Australia.',
        },
      },
    ];
  }

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqEntities,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      {children}
    </>
  );
}
