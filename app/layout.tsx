import type { Metadata } from 'next';
import { DM_Sans, DM_Serif_Display } from 'next/font/google';
import Providers from './providers';
import { SITE_URL } from '@/lib/constants';
import './globals.css';

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-dm-sans',
  display: 'swap',
});

const dmSerif = DM_Serif_Display({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-dm-serif',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Imisioluwa — Shop Authentic African Traditional & Spiritual Products Online',
    template: '%s | Imisioluwa',
  },
  description: 'Shop authentic African traditional soaps, spiritual oils, herbal remedies, and food products. Sourced from trusted makers with free delivery in Nigeria and worldwide shipping.',
  openGraph: {
    siteName: 'Imisioluwa',
    locale: 'en_NG',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  other: {
    'theme-color': '#5C3D2E',
  },
  alternates: {
    languages: {
      en: SITE_URL,
      yo: `${SITE_URL}?lang=yo`,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${dmSans.variable} ${dmSerif.variable}`} suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
