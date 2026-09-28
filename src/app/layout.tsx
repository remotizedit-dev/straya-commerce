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

const DEFAULT_SEO_TITLE = "Straya Labs | Australia's Highest Purity Research Peptides";
const DEFAULT_SEO_DESC = "Buy HPLC-verified research peptides in Australia from Straya Labs. Premium Retatrutide (Reta), Tirzepatide, GHK-Cu, BPC-157, TB-500, Semaglutide >99% purity. Express domestic dispatch from Sydney & Melbourne.";
const DEFAULT_SEO_KEYWORDS = "Retatrutide Australia, Retatrutide Reta, buy Retatrutide Australia, Reta peptide Australia, Retatrutide Sydney Melbourne, Retatrutide 10mg, Retatrutide 20mg, Retatrutide 30mg, Tirzepatide Australia, GHK-Cu Australia, BPC-157 Australia, TB-500 Australia, Semaglutide Australia, HPLC research peptides, Straya Labs, Straya Peptides";

export async function generateMetadata(): Promise<Metadata> {
  let title = DEFAULT_SEO_TITLE;
  let description = DEFAULT_SEO_DESC;
  let keywords = DEFAULT_SEO_KEYWORDS;

  try {
    const dbUrl = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || "https://straya-peptides-rit-default-rtdb.asia-southeast1.firebasedatabase.app";
    const res = await fetch(`${dbUrl}/siteSettings.json`, { next: { revalidate: 60 } });
    if (res.ok) {
      const data = await res.json();
      if (data?.seoTitle) title = data.seoTitle;
      if (data?.seoMetaDescription) description = data.seoMetaDescription;
      if (data?.seoKeywords) keywords = data.seoKeywords;
    }
  } catch (e) {
    // fallback gracefully to rich defaults
  }

  return {
    metadataBase: new URL('https://straya-peptides.com.au'),
    title: {
      default: title,
      template: '%s | Straya Labs',
    },
    description,
    keywords,
    icons: {
      icon: '/favicon.ico',
      shortcut: '/favicon.ico',
      apple: '/favicon.ico',
    },
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'en_AU',
      siteName: 'Straya Labs',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
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
  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${outfit.variable} ${jetbrainsMono.variable} w-full overflow-x-hidden bg-white text-slate-900`}>
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
