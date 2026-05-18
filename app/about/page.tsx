'use client';

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Info, Zap, Shield, Cpu, Code, Rss, ArrowLeft, Layers } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  const coreValues = [
    {
      icon: Rss,
      title: 'Real-time Aggregation',
      description: 'We continuously poll and parse live feeds from the tech industry’s leading outlets like TechCrunch, The Verge, and the New York Times, consolidating them into one central command center.'
    },
    {
      icon: Layers,
      title: 'Deep Category Indexing',
      description: 'Filter stories seamlessly through 8 distinct categories, from technology and business to education and sports, so you can locate what matters in a heartbeat.'
    },
    {
      icon: Shield,
      title: 'Zero-Trackers & No Databases',
      description: 'Your privacy is paramount. Informed runs entirely in your browser. All configuration preferences, saved articles, and custom RSS feeds are stored locally in your browser’s localStorage.'
    },
    {
      icon: Zap,
      title: 'Speed & Optimization',
      description: 'Enjoy a fluid user interface built with asynchronous fetch strategies, client-side caching, debounced searching, and dynamic page layouts optimized for any device.'
    }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      <div>
        <Header />

        {/* Hero Header */}
        <section className="relative overflow-hidden border-b border-border/40">
          <div className="absolute inset-0 mesh-gradient" />
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-radial from-indigo-500/10 via-transparent to-transparent pointer-events-none" />
          
          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors mb-6 font-medium">
              <ArrowLeft className="w-4 h-4" />
              Back to News Desk
            </Link>

            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20">
                <Info className="w-7 h-7 text-white" />
              </div>
            </div>

            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground mb-6">
              About <span className="gradient-text">Informed</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              We aggregate and curate the world’s technology news so you can stay ahead of the curve, distraction-free.
            </p>
          </div>
        </section>

        {/* Main Content Area */}
        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          
          {/* Mission Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
            <div className="space-y-6">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                Our Mission: Curate the Pulse of Tech
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                In an era flooded with clickbait and fragmented websites, Informed was created to offer a clean, unified space for tech professionals, enthusiasts, and innovators. 
              </p>
              <p className="text-muted-foreground leading-relaxed">
                We believe in an open web, giving you direct control over your news sources. Through our customized Admin dashboard, you can add your own XML feeds, disable default sources, and structure a custom-tailored front page that fits your exact interests.
              </p>
            </div>
            
            {/* Visual Callout Box */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300" />
              <div className="relative bg-card border border-border/60 rounded-3xl p-8 shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                    <Cpu className="w-5 h-5 text-purple-500" />
                  </div>
                  <h3 className="font-bold text-foreground text-lg">Platform Architecture</h3>
                </div>
                <ul className="space-y-4 text-sm text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <Code className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" />
                    <span><strong>100% Client-Driven:</strong> All RSS parsing is handled live within your browser via DOMParser.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Zap className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Hybrid CORS Proxies:</strong> Leverages seamless CORS-anywhere fallbacks for unrestricted access.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Rss className="w-4 h-4 text-pink-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Verified Source Curation:</strong> Direct XML parsing from top publications with complete editorial transparency.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Core Pillars */}
          <div className="space-y-8">
            <div className="text-center max-w-xl mx-auto mb-12">
              <h3 className="text-xl md:text-2xl font-bold text-foreground">Why Informed?</h3>
              <p className="text-sm text-muted-foreground mt-2">Built around four fundamental pillars designed for premium news reading.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {coreValues.map(({ icon: Icon, title, description }) => (
                <div key={title} className="bg-card border border-border/40 p-6 rounded-2xl card-hover relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-500 to-purple-600" />
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <h4 className="font-bold text-foreground text-base">{title}</h4>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed pl-1">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </div>
          
        </main>
      </div>

      <Footer />
    </div>
  );
}
