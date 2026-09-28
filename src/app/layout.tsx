import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Outfit, JetBrains_Mono } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { AppShell } from '@/components/layout/AppShell';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sans',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['600', '700', '800', '900'],
  variable: '--font-display',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-mono',
  display: 'swap',
});

const DEFAULT_SEO_TITLE = "Retatrutide (Reta) Australia | Straya Labs - Highest Purity Peptides";
const DEFAULT_SEO_DESC = "Buy HPLC-verified Retatrutide (Reta) in Australia from Straya Labs. Premium 10mg, 20mg & 30mg research grade Retatrutide, Tirzepatide, GHK-Cu >99% purity with Certificate of Analysis. Express domestic dispatch from Sydney & Melbourne.";
const DEFAULT_SEO_KEYWORDS = "Retatrutide Australia, Retatrutide Reta Australia, buy Retatrutide Australia, Retatrutide 10mg Australia, Retatrutide 20mg Australia, Retatrutide 30mg Australia, Reta peptide Australia, buy Reta Australia, Retatrutide Sydney, Retatrutide Melbourne, Tirzepatide Australia, GHK-Cu Australia, BPC-157 Australia, TB-500 Australia, Semaglutide Australia, HPLC research peptides, Straya Labs, Straya Labs Australia";

export async function generateMetadata(): Promise<Metadata> {
  let title = DEFAULT_SEO_TITLE;
  let description = DEFAULT_SEO_DESC;
  let keywords = DEFAULT_SEO_KEYWORDS;

  try {
    const dbUrl = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || "https://straya-peptides-rit-default-rtdb.asia-southeast1.firebasedatabase.app";
    const res = await fetch(`${dbUrl}/siteSettings.json`, { next: { revalidate: 60 } });
    if (res.ok) {
      const data = await res.json();
      if (data?.seoTitle) {
        // If CMS title is set, prioritize it while ensuring Retatrutide & Straya Labs are represented
        title = data.seoTitle;
      }
      if (data?.seoMetaDescription) description = data.seoMetaDescription;
      if (data?.seoKeywords) keywords = data.seoKeywords;
    }
  } catch (e) {
    // fallback gracefully to rich defaults
  }

  return {
    metadataBase: new URL('https://www.strayalabsau.com'),
    alternates: {
      canonical: 'https://www.strayalabsau.com',
    },
    title: {
      default: title,
      template: '%s | Straya Labs',
    },
    description,
    keywords,
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: 'any' },
        { url: '/icon.png', sizes: '256x256', type: 'image/png' },
      ],
      shortcut: '/favicon.ico',
      apple: [
        { url: '/apple-icon.png', sizes: '256x256', type: 'image/png' },
      ],
    },
    openGraph: {
      title,
      description,
      url: 'https://www.strayalabsau.com',
      siteName: 'Straya Labs',
      locale: 'en_AU',
      type: 'website',
      images: [
        {
          url: 'https://www.strayalabsau.com/icon.png',
          width: 256,
          height: 256,
          alt: 'Straya Labs Logo',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['https://www.strayalabsau.com/icon.png'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://www.strayalabsau.com/#organization',
        name: 'Straya Labs',
        url: 'https://www.strayalabsau.com',
        logo: 'https://www.strayalabsau.com/icon.png',
        description: "Australia's premier laboratory supplier of HPLC-verified research peptides including Retatrutide (Reta), Tirzepatide, and GHK-Cu.",
        address: {
          '@type': 'PostalAddress',
          addressCountry: 'AU',
        },
        sameAs: [
          'https://t.me/strayapeptides',
          'https://instagram.com/strayapeptides',
        ],
      },
      {
        '@type': 'WebSite',
        '@id': 'https://www.strayalabsau.com/#website',
        url: 'https://www.strayalabsau.com',
        name: 'Straya Labs',
        description: 'Buy HPLC-verified research peptides in Australia including Retatrutide (Reta) and Tirzepatide.',
        publisher: {
          '@id': 'https://www.strayalabsau.com/#organization',
        },
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://www.strayalabsau.com/products?search={search_term_string}',
          'query-input': 'required name=search_term_string',
        },
      },
    ],
  };

  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${outfit.variable} ${jetbrainsMono.variable} w-full overflow-x-hidden bg-white text-slate-900`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="256x256" href="/icon.png" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-white text-slate-900 min-h-screen font-sans antialiased overflow-x-hidden w-full selection:bg-[#FF007A] selection:text-white flex flex-col justify-between">
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-NLWF5EZG18"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-NLWF5EZG18');
          `}
        </Script>

        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
