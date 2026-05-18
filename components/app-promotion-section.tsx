'use client';

import { Download, Star, Users, Zap, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export function AppPromotionSection() {
  const appUpdates = [
    {
      version: '1.2.0',
      date: 'May 2026',
      features: ['Dark mode support', 'Offline reading', 'Push notifications'],
    },
    {
      version: '1.1.0',
      date: 'April 2026',
      features: ['AI-powered search', 'Personalized feed', 'Article saving'],
    },
    {
      version: '1.0.0',
      date: 'March 2026',
      features: ['Initial launch', 'News aggregation', 'Category filtering'],
    },
  ];

  return (
    <section className="py-20 px-6 bg-gradient-to-b from-background to-card/20">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
            Get <span className="text-accent">INFORMED</span> on the Go
          </h2>
          <p className="text-foreground/70 text-lg max-w-2xl mx-auto">
            Download our Android app for instant news updates, offline reading, and personalized content delivered right to your device.
          </p>
        </div>

        {/* Main CTA Card */}
        <div className="bg-card border-2 border-accent/40 rounded-2xl p-8 md:p-12 mb-16 overflow-hidden relative">
          {/* Gradient background accent */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl -z-10" />

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-accent" />
                </div>
                <span className="text-accent font-display font-bold uppercase text-sm tracking-widest">
                  Now Available
                </span>
              </div>

              <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                INFORMED News App
              </h3>

              <p className="text-foreground/70 mb-8 leading-relaxed">
                Experience news like never before. Get real-time updates, read offline, customize your preferences, and stay informed wherever you go.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-secondary/30 rounded-lg p-4">
                  <Star className="w-5 h-5 text-accent mb-2" />
                  <p className="text-2xl font-bold text-foreground">4.8★</p>
                  <p className="text-sm text-foreground/60">User Rating</p>
                </div>
                <div className="bg-secondary/30 rounded-lg p-4">
                  <Users className="w-5 h-5 text-accent mb-2" />
                  <p className="text-2xl font-bold text-foreground">10K+</p>
                  <p className="text-sm text-foreground/60">Downloads</p>
                </div>
              </div>

              {/* CTA Button */}
              <a
                href="https://play.google.com/store/apps/details?id=com.pranav.punecityguide&hl=en"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-accent to-accent/80 text-accent-foreground font-display font-bold uppercase tracking-wider rounded-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 group"
              >
                <Download className="w-5 h-5 group-hover:animate-bounce" />
                Download on Google Play
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            {/* Right Content - App Preview */}
            <div className="flex justify-center items-center">
              <div className="relative w-64 h-96 bg-gradient-to-b from-accent/20 to-accent/5 rounded-3xl border-8 border-foreground/20 shadow-2xl overflow-hidden">
                {/* Phone mockup content */}
                <div className="p-6 h-full flex flex-col">
                  {/* Status bar */}
                  <div className="flex justify-between items-center mb-4 text-xs text-foreground/60">
                    <span>9:41</span>
                    <div className="flex gap-1">
                      <div className="w-1 h-1 bg-foreground/60 rounded-full" />
                      <div className="w-1 h-1 bg-foreground/60 rounded-full" />
                      <div className="w-1 h-1 bg-foreground/60 rounded-full" />
                    </div>
                  </div>

                  {/* Header */}
                  <div className="bg-foreground/10 rounded-lg p-4 mb-4">
                    <p className="font-bold text-foreground text-sm">Breaking News</p>
                    <p className="text-foreground/70 text-xs">Real-time updates</p>
                  </div>

                  {/* News items */}
                  <div className="space-y-3 flex-1">
                    {[1, 2].map((i) => (
                      <div key={i} className="bg-secondary/30 rounded p-3">
                        <div className="h-2 bg-foreground/20 rounded w-full mb-2" />
                        <div className="h-2 bg-foreground/20 rounded w-3/4" />
                      </div>
                    ))}
                  </div>

                  {/* Bottom action */}
                  <button className="w-full bg-accent text-accent-foreground py-2 rounded-lg font-bold text-xs uppercase mt-4 hover:bg-accent/90">
                    Explore News
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Update History */}
        <div>
          <h3 className="text-2xl font-display font-bold text-foreground mb-8 text-center">
            Latest App <span className="text-accent">Updates</span>
          </h3>

          <div className="grid md:grid-cols-3 gap-6">
            {appUpdates.map((update, idx) => (
              <div
                key={idx}
                className="bg-card border border-border rounded-xl p-6 hover:border-accent/50 transition-colors duration-300 hover:shadow-lg"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-accent font-display font-bold text-lg">v{update.version}</p>
                    <p className="text-foreground/60 text-sm">{update.date}</p>
                  </div>
                  <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                    <Zap className="w-5 h-5 text-accent" />
                  </div>
                </div>

                <ul className="space-y-2">
                  {update.features.map((feature, featureIdx) => (
                    <li key={featureIdx} className="flex items-start gap-2 text-foreground/70 text-sm">
                      <span className="text-accent mt-1">•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Features Highlight */}
        <div className="mt-20 grid md:grid-cols-3 gap-6">
          {[
            {
              icon: Download,
              title: 'Offline Reading',
              description: 'Save articles and read them anytime, anywhere without internet connection.',
            },
            {
              icon: Zap,
              title: 'Real-Time Updates',
              description: 'Get instant push notifications for breaking news and topics you follow.',
            },
            {
              icon: Users,
              title: 'Personalized Feed',
              description: 'Customize your news experience with topics and sources you care about.',
            },
          ].map((feature, idx) => (
            <div key={idx} className="text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/20 transition-colors">
                <feature.icon className="w-8 h-8 text-accent" />
              </div>
              <h4 className="text-lg font-display font-bold text-foreground mb-2">{feature.title}</h4>
              <p className="text-foreground/70 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
