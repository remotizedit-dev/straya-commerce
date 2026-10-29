import type { Metadata } from 'next';

type Props = {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
};

async function getProduct(id: string) {
  try {
    const dbUrl =
      process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL ||
      'https://straya-peptides-rit-default-rtdb.asia-southeast1.firebasedatabase.app';
    const res = await fetch(`${dbUrl}/products/${id}.json`, { next: { revalidate: 60 } });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    // fallback gracefully
  }
  return null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.strayalabsau.com';

  if (!product) {
    return {
      title: 'Research Peptide | Straya Labs Australia',
      description:
        'Buy HPLC-verified research peptides online in Australia from Straya Labs. High purity laboratory compounds with fast domestic shipping.',
      alternates: {
        canonical: `${baseUrl}/product/${id}`,
      },
    };
  }

  const title = `${product.title} | Buy HPLC Tested Peptides Australia`;
  const description = product.description
    ? `${product.description.slice(0, 150)}... Buy HPLC-verified ${product.title} in Australia from Straya Labs. Express domestic dispatch.`
    : `Buy HPLC-verified ${product.title} in Australia from Straya Labs. >99% purity guaranteed with Certificate of Analysis. Express domestic dispatch across Sydney, Melbourne & Australia.`;

  const images =
    product.images && product.images.length > 0
      ? product.images
      : [`${baseUrl}/icon.png`];
  const canonicalUrl = `${baseUrl}/product/${id}`;

  return {
    title,
    description,
    keywords: `${product.title}, buy ${product.title} Australia, ${product.category || 'research peptides'}, HPLC peptides Australia, Straya Labs, Sydney peptides, Melbourne peptides`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${product.title} | Straya Labs Australia`,
      description,
      url: canonicalUrl,
      siteName: 'Straya Labs',
      type: 'website',
      images: images.map((img: string) => ({
        url: img,
        alt: product.title,
      })),
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.title} | Straya Labs`,
      description,
      images,
    },
  };
}

export default async function ProductDetailLayout({ params, children }: Props) {
  const { id } = await params;
  const product = await getProduct(id);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.strayalabsau.com';

  const productJsonLd = product
    ? {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'Product',
            '@id': `${baseUrl}/product/${id}#product`,
            name: product.title,
            description: product.description || `Laboratory research grade ${product.title}`,
            image: product.images || [`${baseUrl}/icon.png`],
            sku: product.id || id,
            category: product.category,
            brand: {
              '@type': 'Brand',
              name: 'Straya Labs',
            },
            offers: {
              '@type': 'Offer',
              url: `${baseUrl}/product/${id}`,
              priceCurrency: 'AUD',
              price:
                (product.discountedPrice && product.discountedPrice > 0
                  ? product.discountedPrice
                  : product.price) || 0,
              priceValidUntil: '2027-12-31',
              availability:
                product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
              itemCondition: 'https://schema.org/NewCondition',
              seller: {
                '@type': 'Organization',
                name: 'Straya Labs',
              },
            },
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: product.rating || 5,
              reviewCount: product.reviewsCount || 1,
            },
          },
          {
            '@type': 'BreadcrumbList',
            '@id': `${baseUrl}/product/${id}#breadcrumb`,
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: baseUrl,
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'Peptides Catalog',
                item: `${baseUrl}/products`,
              },
              {
                '@type': 'ListItem',
                position: 3,
                name: product.title,
                item: `${baseUrl}/product/${id}`,
              },
            ],
          },
        ],
      }
    : null;

  return (
    <>
      {productJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
        />
      )}
      {children}
    </>
  );
}
