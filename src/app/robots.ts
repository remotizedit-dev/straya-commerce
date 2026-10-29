import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.strayalabsau.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/cms', '/cms/*', '/api/', '/checkout'],
      },
      {
        userAgent: 'Googlebot-Image',
        allow: ['/', '/icon.png', '/apple-icon.png', '/favicon.ico'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
