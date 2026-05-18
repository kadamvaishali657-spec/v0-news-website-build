'use client';

import Link from 'next/link';
import { Mail, Shield, FileText, Info, Globe, Sparkles, Heart, ExternalLink } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-card/20 backdrop-blur-md relative overflow-hidden mt-16">
      {/* Decorative background light */}
      <div className="absolute -bottom-24 -left-24 w-[300px] h-[300px] bg-gradient-radial from-indigo-500/5 via-transparent to-transparent pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-[300px] h-[300px] bg-gradient-radial from-purple-500/5 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-glow group-hover:shadow-glow-lg transition-shadow duration-300">
                <span className="text-white font-black text-xs tracking-tight">I</span>
              </div>
              <span className="text-lg font-bold text-foreground tracking-tight">
                Informed
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
              A modern, professional technology news aggregator bringing you real-time stories from TechCrunch, The Verge, NY Times, and beyond.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">Navigation</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/about" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group">
                  <Info className="w-4 h-4 text-muted-foreground/60 group-hover:text-primary transition-colors" />
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group">
                  <Mail className="w-4 h-4 text-muted-foreground/60 group-hover:text-primary transition-colors" />
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal / Policy */}
          <div>
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">Legal</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/privacy" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group">
                  <Shield className="w-4 h-4 text-muted-foreground/60 group-hover:text-primary transition-colors" />
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group">
                  <FileText className="w-4 h-4 text-muted-foreground/60 group-hover:text-primary transition-colors" />
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-border/40 w-full mb-8" />

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>&copy; {new Date().getFullYear()} Informed. All rights reserved.</span>
          </div>
          
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-indigo-500" />
              Real-time Feeds
            </span>
            <span className="hidden sm:inline">&middot;</span>
            <span className="flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-purple-500" />
              Verified Outlets
            </span>
            <span className="hidden sm:inline">&middot;</span>
            <span className="flex items-center gap-1 hover:text-foreground transition-colors cursor-default">
              Made with <Heart className="w-3 h-3 text-red-500 fill-current animate-pulse" /> for tech lovers
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
