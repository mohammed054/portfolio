import type { Metadata, Viewport } from 'next';
import { Syne, DM_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-syne',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-dm',
  display: 'swap',
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#000000',
  colorScheme: 'dark',
};

export const metadata: Metadata = {
  title: 'Mohammed Hassoun — Software Engineer',
  description:
    'Software engineer specializing in precision interfaces, high-performance systems, and immersive digital experiences. Based in Dubai, UAE.',
  keywords: [
    'Mohammed Hassoun',
    'Software Engineer',
    'Frontend Engineer',
    'React',
    'Next.js',
    'Three.js',
    'Dubai',
  ],
  authors: [{ name: 'Mohammed Hassoun' }],
  openGraph: {
    title: 'Mohammed Hassoun — Software Engineer',
    description: 'I only design what\'s necessary, not what\'s flashy.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mohammed Hassoun — Software Engineer',
    description: 'I only design what\'s necessary, not what\'s flashy.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${dmSans.variable} ${jetbrains.variable}`}
    >
      <body style={{ fontFamily: 'var(--font-dm, DM Sans), sans-serif', background: '#000' }}>
        {children}
      </body>
    </html>
  );
}