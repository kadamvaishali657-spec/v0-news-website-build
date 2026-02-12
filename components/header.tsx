'use client';

import Link from 'next/link';
import { Settings } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <span className="text-accent-foreground font-bold text-sm">JN</span>
            </div>
            <Link href="/" className="text-2xl font-bold text-foreground hover:text-accent transition-colors">
              JustinNews
              <span className="text-accent">.tech</span>
            </Link>
          </div>
          
          <nav className="flex items-center gap-6">
            <Link 
              href="/" 
              className="text-foreground hover:text-accent transition-colors font-medium"
            >
              Home
            </Link>
            <Link 
              href="/admin" 
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-accent-foreground hover:bg-accent/90 transition-colors font-medium"
            >
              <Settings className="w-4 h-4" />
              Admin
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
