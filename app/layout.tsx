import type { Metadata, Viewport } from 'next'
import { Syne, DM_Sans, JetBrains_Mono } from 'next/font/google'
import './globals.css'

/* ── Fonts — wired to CSS variables ─────────────────── */
const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-syne',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-dm',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Your Name — Full Stack Engineer & AI Specialist',
  description:
    'Portfolio of [Your Name] — Full Stack Engineer specializing in AI, React, and immersive web experiences.',
  keywords: ['Full Stack Engineer', 'AI Specialist', 'React', 'Next.js', 'Three.js'],
  authors: [{ name: 'Your Name' }],
  openGraph: {
    title: 'Your Name — Full Stack Engineer & AI Specialist',
    description: 'Building things that matter.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Your Name — Full Stack Engineer & AI Specialist',
    description: 'Building things that matter.',
  },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#080B14',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      /* Expose all three font variables so CSS vars resolve */
      className={`${syne.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}
      style={
        {
          /* Map Next.js font vars to our design-system vars */
          '--font-display': 'var(--font-syne)',
          '--font-body':    'var(--font-dm)',
        } as React.CSSProperties
      }
    >
      <body>
        {children}
      </body>
    </html>
  )
}
