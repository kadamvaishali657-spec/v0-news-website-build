import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { ParticleBackground } from '@/components/particle-background'
import { ScaryHeroOverlay } from '@/components/scary-hero-overlay'

import './globals.css'

const _geist = Geist({ subsets: ['latin'] })
const _geistMono = Geist_Mono({ subsets: ['latin'] })

export const viewport: Viewport = {
  themeColor: '#F59E0B',
  userScalable: true,
}

export const metadata: Metadata = {
  title: 'INFORMED - Reimagined News Experience',
  description: 'Experience revolutionary news aggregation with AI insights, immersive visuals, and interactive storytelling. Breaking stories from 25+ trusted sources.',
  keywords: ['news', 'technology', 'RSS feeds', 'news aggregator', 'AI insights', 'breaking news'],
  authors: [{ name: 'INFORMED' }],
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
  openGraph: {
    title: 'INFORMED - Revolutionary News Experience',
    description: 'AI-powered news aggregation with immersive visuals and interactive storytelling',
    type: 'website',
    url: 'https://informed-news.vercel.app',
    images: [
      {
        url: '/favicon.png',
        width: 512,
        height: 512,
        alt: 'INFORMED Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'INFORMED - News Reimagined',
    description: 'Latest technology news aggregated from top sources',
    images: ['/favicon.jpg'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="scroll-smooth bg-background">
      <body className="font-sans antialiased bg-background min-h-screen relative">
        <ScaryHeroOverlay />
        <ParticleBackground />
        {children}
      </body>
    </html>
  )
}
