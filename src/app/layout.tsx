import type { Metadata } from 'next';
import { Syne, DM_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const syne = Syne({ subsets:['latin'], weight:['400','700','800'], variable:'--font-syne', display:'swap' });
const dmSans = DM_Sans({ subsets:['latin'], weight:['400','500'], variable:'--font-dm', display:'swap' });
const jetbrains = JetBrains_Mono({ subsets:['latin'], weight:['400'], variable:'--font-mono', display:'swap' });

export const metadata: Metadata = {
  title: 'Mohammed Hassoun — Software Engineer',
  description: 'I only design what\'s necessary, not what\'s flashy.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${syne.variable} ${dmSans.variable} ${jetbrains.variable}`}>
      <body style={{ fontFamily: 'var(--font-dm)', background: '#000010' }}>{children}</body>
    </html>
  );
}
