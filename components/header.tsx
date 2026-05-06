'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Settings, Menu, X, ChevronDown, Flame, Bookmark, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/providers/theme-provider';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const categories = [
    'Global News',
    'Technology',
    'Business',
    'Science',
    'Sports',
    'Entertainment',
    'Education',
    'Lifestyle',
    'Politics',
    'Environment',
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
              href="/explore" 
              className="text-foreground hover:text-accent transition-colors font-display text-sm uppercase tracking-wider"
            >
              Explore
            </Link>

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

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-accent/10 hover:bg-accent/20 transition-colors duration-300"
              aria-label="Toggle dark mode"
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5 text-accent" />
              ) : (
                <Sun className="w-5 h-5 text-accent" />
              )}
            </button>
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
              href="/explore" 
              className="block text-foreground hover:text-accent transition-colors font-display uppercase tracking-wider text-sm"
              onClick={() => setMobileMenuOpen(false)}
            >
              Explore
            </Link>

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

            {/* Dark Mode Toggle Mobile */}
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <span className="text-foreground font-display text-sm uppercase tracking-wider">Theme</span>
              <button
                onClick={() => {
                  toggleTheme();
                  setMobileMenuOpen(false);
                }}
                className="p-2 rounded-lg bg-accent/10 hover:bg-accent/20 transition-colors duration-300"
                aria-label="Toggle dark mode"
              >
                {theme === 'light' ? (
                  <Moon className="w-5 h-5 text-accent" />
                ) : (
                  <Sun className="w-5 h-5 text-accent" />
                )}
              </button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
