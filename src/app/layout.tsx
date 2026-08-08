import type { Metadata } from 'next';
import './globals.css';
import { AppShell } from '@/components/layout/AppShell';

export const metadata: Metadata = {
  title: 'Straya Peptides | Australia\'s Highest Purity Research Peptides',
  description: 'Buy high purity research peptides in Australia. HPLC tested BPC-157, TB-500, Semaglutide, Tirzepatide, GHK-Cu with Certificate of Analysis. Express overnight shipping.',
  keywords: 'peptides Australia, buy BPC-157 Sydney, TB-500 Melbourne, Semaglutide Australia, HPLC research peptides, GHK-Cu, Straya peptides',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-gray-100 min-h-screen font-sans antialiased selection:bg-[#FF007A] selection:text-white">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
