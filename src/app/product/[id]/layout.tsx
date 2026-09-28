import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const id = resolvedParams?.id;

  let title = 'HPLC Verified Research Peptide | Straya Labs';
  let description =
    'High-purity laboratory research peptide verified by HPLC and Mass Spectrometry testing (>99% purity). Express domestic dispatch from Sydney & Melbourne by Straya Labs.';
  let keywords =
    'Retatrutide Australia, Retatrutide Reta, buy Retatrutide Australia, research peptides Australia, HPLC tested peptides, Straya Labs';
  let images: string[] = [];

  try {
    const dbUrl =
      process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL ||
      'https://straya-peptides-rit-default-rtdb.asia-southeast1.firebasedatabase.app';
    const res = await fetch(`${dbUrl}/products/${id}.json`, { next: { revalidate: 60 } });
    if (res.ok) {
      const product = await res.json();
      if (product) {
        title = `${product.title} | HPLC Verified Peptides Australia`;
        const spec = product.specification
          ? ` Specification: ${product.specification}.`
          : ' Guaranteed >99% HPLC purity.';
        const cleanDesc = product.description
          ? product.description.replace(/\s+/g, ' ').slice(0, 160)
          : '';
        description = `${product.title} available in Australia from Straya Labs.${spec} ${cleanDesc} Batch verified with Certificate of Analysis. Express dispatched nationwide.`;
        keywords = `${product.title}, buy ${product.title} Australia, ${product.title} price Australia, Retatrutide Australia, Retatrutide Reta, ${product.category || 'research peptides'}, HPLC tested peptides, Straya Labs`;
        if (Array.isArray(product.images) && product.images[0]) {
          images = [product.images[0]];
        }
      }
    }
  } catch (e) {
    // fallback gracefully
  }

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      images,
      siteName: 'Straya Labs',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images,
    },
  };
}

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return children;
}
