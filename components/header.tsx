'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Settings, Menu, X, ChevronDown, Flame, Bookmark } from 'lucide-react';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);

  const categories = [
    'Global News',
    'Tech & Innovation',
    'Business & Finance',
    'Sports',
    'Entertainment & Culture',
    'Learning & Education',
    'Social Media Digest',
    'Random Interesting',
  ];

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          {/* Logo - Minimalist */}
          <Link href="/" className="font-display text-2xl text-foreground hover:text-accent transition-colors duration-300 tracking-tight">
            INFORMED
          </Link>

          {/* Desktop Navigation - Minimal */}
          <nav className="hidden md:flex items-center gap-8">
            <Link 
              href="/trending" 
              className="text-foreground hover:text-accent transition-colors font-display text-sm uppercase tracking-wider"
            >
              Trending
            </Link>

            <Link 
              href="/saved" 
              className="text-foreground hover:text-accent transition-colors font-display text-sm uppercase tracking-wider"
            >
              Saved
            </Link>

            <Link 
              href="/admin" 
              className="text-foreground hover:text-accent transition-colors font-display text-sm uppercase tracking-wider"
            >
              Admin
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-6 space-y-4 pb-4 border-t border-border pt-4">
            <Link 
              href="/trending" 
              className="block text-foreground hover:text-accent transition-colors font-display uppercase tracking-wider text-sm"
              onClick={() => setMobileMenuOpen(false)}
            >
              Trending
            </Link>

            <Link 
              href="/saved" 
              className="block text-foreground hover:text-accent transition-colors font-display uppercase tracking-wider text-sm"
              onClick={() => setMobileMenuOpen(false)}
            >
              Saved
            </Link>

            <Link 
              href="/admin" 
              className="block text-foreground hover:text-accent transition-colors font-display uppercase tracking-wider text-sm"
              onClick={() => setMobileMenuOpen(false)}
            >
              Admin
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
