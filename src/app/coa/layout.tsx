import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'HPLC & Mass Spectrometry Certificates of Analysis (COA) | Batch Verification',
  description:
    'View third-party HPLC and Mass Spectrometry Certificates of Analysis (COA) for all Straya Labs compounds. Batch purity reports for Retatrutide (Reta), Tirzepatide, GHK-Cu, and research peptides with >99% purity.',
  keywords:
    'peptide COA Australia, HPLC test reports, Retatrutide purity test, Retatrutide COA Australia, Tirzepatide COA, peptide mass spectrometry, Certificate of Analysis Australia, Straya Labs verification',
  openGraph: {
    title: 'Certificates of Analysis (COA) | Straya Labs Australia',
    description:
      'Verify batch purity with third-party HPLC & MS reports. Retatrutide, Tirzepatide, GHK-Cu >99% purity guaranteed.',
  },
};

export default function COALayout({ children }: { children: React.ReactNode }) {
  return children;
}
