import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import { Inter } from 'next/font/google'
import { ParticleBackground } from '@/components/particle-background'
import { ThemeProvider } from '@/providers/theme-provider'

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
  verification: {
    google: 'TdsH1dug5CMhswHNx_K_3svi2PelAWOUW2ZWCwSRGsU',
  },
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
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} scroll-smooth bg-background`}>
      <head>
        {/* Google Tag Manager */}
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-PH73JX7W');`,
          }}
        />

        {/* Google Analytics */}
        <Script
          id="ga-script"
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-5TK241WF78"
          strategy="afterInteractive"
        />
        <Script
          id="ga-config"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-5TK241WF78');`,
          }}
        />

        {/* Google AdSense */}
        <Script
          id="adsense-script"
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7901268014546748"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />

        {/* Google Subscribe with Google News */}
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
      </head>
      <body className="font-sans antialiased bg-background min-h-screen relative">
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-PH73JX7W"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>

        <ThemeProvider>
          <ParticleBackground />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
