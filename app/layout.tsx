import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'

import './globals.css'

const _geist = Geist({ subsets: ['latin'] })
const _geistMono = Geist_Mono({ subsets: ['latin'] })

export const viewport: Viewport = {
  themeColor: '#0066CC',
  userScalable: true,
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  title: 'JustinNews - Premium Tech News & Business Intelligence | 25+ Global Sources',
  description: 'Curated technology, business, and global news from the world\'s most trusted publishers. Real-time updates, AI insights, startup coverage, and expert analysis. 25+ premium sources in one place.',
  keywords: ['tech news', 'technology', 'AI', 'startups', 'business news', 'news aggregator', 'RSS feeds', 'breaking news', 'cryptocurrency', 'gadgets'],
  authors: [{ name: 'JustinNews' }],
  creator: 'JustinNews',
  publisher: 'JustinNews',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: '/favicon.jpg',
    shortcut: '/favicon.jpg',
    apple: '/favicon.jpg',
  },
  openGraph: {
    title: 'JustinNews - Premium Tech News Aggregator',
    description: 'Real-time curated news from 25+ premium publishers. Technology, business, AI, startups, and more.',
    type: 'website',
    url: 'https://www.justinnews.tech',
    siteName: 'JustinNews',
    images: [
      {
        url: '/favicon.jpg',
        width: 512,
        height: 512,
        alt: 'JustinNews Logo',
        type: 'image/jpeg',
      },
    ],
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JustinNews - Premium Tech News',
    description: 'Curated technology and business news from 25+ trusted sources',
    images: ['/favicon.jpg'],
    creator: '@JustinNews',
    site: '@JustinNews',
  },
  alternates: {
    canonical: 'https://www.justinnews.tech',
  },
  appLinks: [
    {
      url: 'https://www.justinnews.tech',
      app_name: 'JustinNews',
      app_store_id: '1234567890',
      play_app_id: 'com.justinnews.app',
    },
  ],
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
