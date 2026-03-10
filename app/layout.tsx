import type { Metadata, Viewport } from 'next'
import { Syne, DM_Sans, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-syne',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-dm-sans',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-jetbrains',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Your Name — Full Stack Engineer & AI Specialist',
  description: 'Portfolio of [Your Name] — Full Stack Engineer specializing in AI, React, and immersive web experiences.',
  keywords: ['Full Stack Engineer', 'AI Specialist', 'React', 'Next.js', 'Three.js', 'Portfolio'],
  authors: [{ name: 'Your Name' }],
  openGraph: {
    title: 'Your Name — Full Stack Engineer & AI Specialist',
    description: 'Building things that matter. Full Stack Engineer & AI Specialist.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Your Name — Full Stack Engineer & AI Specialist',
    description: 'Building things that matter.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#080B14',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}
    >
      <body className="font-dm bg-bg text-text-primary antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  )
}
