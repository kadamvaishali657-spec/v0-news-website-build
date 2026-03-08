import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'

import './globals.css'

const _geist = Geist({ subsets: ['latin'] })
const _geistMono = Geist_Mono({ subsets: ['latin'] })

export const viewport: Viewport = {
  themeColor: '#F59E0B',
  userScalable: true,
}

export const metadata: Metadata = {
  title: 'Just in news - Global News Aggregator | Latest Updates',
  description: 'Stay updated with the latest news from TechCrunch, BBC, NASA and more. Real-time RSS feed aggregation with advanced filtering and search.',
  keywords: ['news', 'tech news', 'science news', 'RSS feeds', 'news aggregator', 'Just in news'],
  authors: [{ name: 'Just in news' }],
  icons: {
    icon: '/favicon.jpg',
    shortcut: '/favicon.jpg',
    apple: '/favicon.jpg',
  },
  openGraph: {
    title: 'Just in news - Real-time News Aggregator',
    description: 'Real-time news aggregator with Tech, Science, Global News, and Sports coverage',
    type: 'website',
    url: 'https://justinnews.tech',
    images: [
      {
        url: '/favicon.jpg',
        width: 512,
        height: 512,
        alt: 'Just in news Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Just in news - Global News',
    description: 'Latest news aggregated from top sources around the world',
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
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
