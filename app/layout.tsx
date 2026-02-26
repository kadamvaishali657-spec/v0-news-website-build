import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Toaster } from '@/components/ui/toaster'

import './globals.css'

const _geist = Geist({ subsets: ['latin'] })
const _geistMono = Geist_Mono({ subsets: ['latin'] })

export const viewport: Viewport = {
  themeColor: '#F59E0B',
  userScalable: true,
}

export const metadata: Metadata = {
  title: 'JustinNews.tech - Tech News Aggregator | Latest Technology Updates',
  description: 'Stay updated with the latest technology news from TechCrunch, The Verge, and NY Times. Real-time RSS feed aggregation with advanced filtering and search.',
  keywords: ['tech news', 'technology', 'RSS feeds', 'TechCrunch', 'The Verge', 'news aggregator'],
  authors: [{ name: 'JustinNews.tech' }],
  icons: {
    icon: '/favicon.jpg',
    shortcut: '/favicon.jpg',
    apple: '/favicon.jpg',
  },
  openGraph: {
    title: 'JustinNews.tech - Tech News Delivered Daily',
    description: 'Real-time technology news aggregator with AI, gadgets, startups, and cybersecurity coverage',
    type: 'website',
    url: 'https://justinnews.tech',
    images: [
      {
        url: '/favicon.jpg',
        width: 512,
        height: 512,
        alt: 'JustinNews.tech Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JustinNews.tech - Tech News',
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
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  )
}
