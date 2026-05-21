import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import { ParticleBackground } from '@/components/particle-background'
import { ThemeProvider } from '@/providers/theme-provider'

import './globals.css'

export const viewport: Viewport = {
  themeColor: '#6366f1',
  userScalable: true,
}

export const metadata: Metadata = {
  title: 'Informed - Tech News Aggregator | Latest Technology Updates',
  description: 'Stay updated with the latest technology news from TechCrunch, The Verge, and NY Times. Real-time RSS feed aggregation with advanced filtering and search.',
  keywords: ['tech news', 'technology', 'RSS feeds', 'TechCrunch', 'The Verge', 'news aggregator'],
  authors: [{ name: 'Informed' }],
  verification: process.env.NEXT_PUBLIC_GOOGLE_VERIFY ? {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFY,
  } : undefined,
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
  openGraph: {
    title: 'Informed - Tech News Delivered Daily',
    description: 'Real-time technology news aggregator with AI, gadgets, startups, and cybersecurity coverage',
    type: 'website',
    url: 'https://informed.tech',
    images: [
      {
        url: '/favicon.png',
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
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
    'max-video-preview': -1,
  },
}

// Render analytics only if enabled via environment variables
const analyticsConfig = {
  gtmId: process.env.NEXT_PUBLIC_GTM_ID,
  gaId: process.env.NEXT_PUBLIC_GA_ID,
  adsenseClient: process.env.NEXT_PUBLIC_ADSENSE_CLIENT,
  enableAnalytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="scroll-smooth bg-background">
      <head>
        {/* Google Tag Manager */}
        {analyticsConfig.enableAnalytics && analyticsConfig.gtmId && (
          <Script
            id="gtm-script"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${analyticsConfig.gtmId}');`,
            }}
          />
        )}

        {/* Google Analytics */}
        {analyticsConfig.enableAnalytics && analyticsConfig.gaId && (
          <>
            <Script
              id="ga-script"
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${analyticsConfig.gaId}`}
              strategy="afterInteractive"
            />
            <Script
              id="ga-config"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${analyticsConfig.gaId}');`,
              }}
            />
          </>
        )}

        {/* Google AdSense */}
        {analyticsConfig.enableAnalytics && analyticsConfig.adsenseClient && (
          <Script
            id="adsense-script"
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${analyticsConfig.adsenseClient}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}

        {/* Google Subscribe with Google News */}
        {analyticsConfig.enableAnalytics && (
          <>
            <Script
              id="swg-script"
              async
              src="https://news.google.com/swg/js/v1/swg-basic.js"
              strategy="afterInteractive"
            />
            <Script
              id="swg-config"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `(self.SWG_BASIC = self.SWG_BASIC || []).push(basicSubscriptions => {
    basicSubscriptions.init({
      type: "NewsArticle",
      isPartOfType: ["Product"],
      isPartOfProductId: "CAowo8_GDA:openaccess",
      clientOptions: { theme: "light", lang: "en" },
    });
  });`,
              }}
            />
          </>
        )}
      </head>
      <body className="font-sans antialiased bg-background min-h-screen relative">
        {/* Google Tag Manager (noscript) */}
        {analyticsConfig.enableAnalytics && analyticsConfig.gtmId && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${analyticsConfig.gtmId}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        )}

        <ThemeProvider>
          <ParticleBackground />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
