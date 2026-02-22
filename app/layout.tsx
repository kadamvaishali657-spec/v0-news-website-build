import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono, Playfair_Display } from 'next/font/google'

import './globals.css'

const _geist = Geist({ subsets: ['latin'] })
const _geistMono = Geist_Mono({ subsets: ['latin'] })
const _playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })

export const viewport: Viewport = {
  themeColor: '#F59E0B',
  userScalable: true,
}

export const metadata: Metadata = {
  title: 'JustinNews.tech - Tech News Aggregator',
  description: 'Stay updated with the latest technology news from TechCrunch, The Verge, and NY Times. Real-time RSS feed aggregation with advanced filtering and search.',
  keywords: ['tech news', 'technology', 'RSS feeds', 'TechCrunch', 'The Verge', 'news aggregator'],
  authors: [{ name: 'JustinNews.tech' }],
  icons: {
    icon: '/favicon.jpg',
    shortcut: '/favicon.jpg',
    apple: '/favicon.jpg',
  },
  canonical: 'https://justinnews.tech',
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
  const schemaMarkup = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://justinnews.tech/#organization',
        name: 'JustinNews.tech',
        url: 'https://justinnews.tech',
        logo: {
          '@type': 'ImageObject',
          url: 'https://justinnews.tech/favicon.jpg',
          width: 512,
          height: 512,
        },
        description: 'Real-time technology news aggregator with AI-powered insights',
        sameAs: [
          'https://twitter.com/justinnewstech',
          'https://facebook.com/justinnewstech',
          'https://linkedin.com/company/justinnewstech',
        ],
      },
      {
        '@type': 'WebSite',
        '@id': 'https://justinnews.tech/#website',
        url: 'https://justinnews.tech',
        name: 'JustinNews.tech',
        description: 'Tech News Aggregator - Stay updated with latest technology news',
        publisher: {
          '@id': 'https://justinnews.tech/#organization',
        },
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: 'https://justinnews.tech/search?q={search_term_string}',
          },
          'query-input': 'required name=search_term_string',
        },
      },
    ],
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
        />
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-XXXXXXXXXX');
            `,
          }}
        />
      </head>
      <body className={`${_playfair.variable} font-sans antialiased bg-background text-foreground`}>{children}</body>
    </html>
  )
}
