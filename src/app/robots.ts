import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/cms', '/api/'],
      },
      {
        userAgent: 'Googlebot-Image',
        allow: ['/', '/icon.png', '/apple-icon.png', '/favicon.ico'],
      },
    ],
    sitemap: 'https://www.strayalabsau.com/sitemap.xml',
  };
}
