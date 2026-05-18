import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'

import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const viewport: Viewport = {
  themeColor: '#6366f1',
  userScalable: true,
}

export const metadata: Metadata = {
  title: 'Informed - Tech News Aggregator | Latest Technology Updates',
  description: 'Stay updated with the latest technology news from TechCrunch, The Verge, and NY Times. Real-time RSS feed aggregation with advanced filtering and search.',
  keywords: ['tech news', 'technology', 'RSS feeds', 'TechCrunch', 'The Verge', 'news aggregator'],
  authors: [{ name: 'Informed' }],
  icons: {
    icon: '/favicon.jpg',
    shortcut: '/favicon.jpg',
    apple: '/favicon.jpg',
  },
  openGraph: {
    title: 'Informed - Tech News Delivered Daily',
    description: 'Real-time technology news aggregator with AI, gadgets, startups, and cybersecurity coverage',
    type: 'website',
    url: 'https://informed.tech',
    images: [
      {
        url: '/favicon.jpg',
        width: 512,
        height: 512,
        alt: 'Informed Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Informed - Tech News',
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
    <html lang="en" className={inter.variable}>
      <head>
        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-5TK241WF78"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', 'G-5TK241WF78');
            `,
          }}
        />
      </head>
      <body className="font-sans antialiased min-h-screen">{children}</body>
    </html>
  )
}
