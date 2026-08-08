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
    <html lang="en" className="w-full overflow-x-hidden bg-white text-slate-900">
      <body className="bg-white text-slate-900 min-h-screen font-sans antialiased overflow-x-hidden w-full selection:bg-[#FF007A] selection:text-white flex flex-col justify-between">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
