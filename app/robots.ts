import { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://imisioluwa.com';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/cart', '/checkout', '/order-confirmation'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
