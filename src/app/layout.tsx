import type { Metadata, Viewport } from 'next';
import { DM_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://hassoun.work';

const suisse = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-suisse',
  display: 'swap',
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Mohammed Hassoun - Computational Designer & Developer',
  description:
    'A camera-driven traversal through the internal layers of a computational system.',
  openGraph: {
    title: 'Mohammed Hassoun',
    description: 'Computational Designer & Developer',
    url: siteUrl,
    siteName: 'Mohammed Hassoun',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Mohammed Hassoun - Computational Designer & Developer',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mohammed Hassoun',
    description: 'Computational Designer & Developer',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/icon.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#050507',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-system-state="IDLE">
      <body className={`${suisse.variable} ${jetbrains.variable}`}>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
