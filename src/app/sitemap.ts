import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.strayalabsau.com';

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/coa`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/track`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.6,
    },
  ];

  try {
    const dbUrl =
      process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL ||
      'https://straya-peptides-rit-default-rtdb.asia-southeast1.firebasedatabase.app';
    const res = await fetch(`${dbUrl}/products.json`, { next: { revalidate: 3600 } });
    if (res.ok) {
      const data = await res.json();
      if (data && typeof data === 'object') {
        const productUrls: MetadataRoute.Sitemap = Object.keys(data).map((id) => ({
          url: `${baseUrl}/product/${id}`,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.9,
        }));
        return [...staticRoutes, ...productUrls];
      }
    }
  } catch (e) {
    // fallback to static routes
  }

  return staticRoutes;
}
