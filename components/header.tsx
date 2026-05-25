'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Settings, Menu, X, ChevronDown, Flame, Globe, Cpu, TrendingUp, Gamepad2, GraduationCap, MessageSquare, Sparkles, Zap } from 'lucide-react';

const categoryIcons: Record<string, typeof Globe> = {
  'Global News': Globe,
  'Tech & Innovation': Cpu,
  'Business & Finance': TrendingUp,
  'Sports': Gamepad2,
  'Entertainment & Culture': Sparkles,
  'Learning & Education': GraduationCap,
  'Social Media Digest': MessageSquare,
  'Random Interesting': Zap,
};

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'glass border-b border-border/40 shadow-lg shadow-black/[0.05]'
        : 'bg-background/80 backdrop-blur-md border-b border-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:shadow-lg group-hover:shadow-indigo-500/30 transition-all duration-300">
              <span className="text-white font-black text-sm tracking-tight">I</span>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-300 -z-10" />
            </div>
            <div className="hidden sm:block">
              <span className="text-lg font-black text-foreground tracking-tight">Informed</span>
              <p className="text-xs text-foreground/50 font-bold">NEWS AGGREGATOR</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {/* Categories Dropdown */}
            <div className="relative group">
              <button className="px-4 py-2 rounded-lg text-sm text-foreground/70 hover:text-foreground hover:bg-gradient-to-r hover:from-primary/10 hover:to-accent/10 transition-all duration-200 font-bold flex items-center gap-2">
                Categories
                <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180 duration-300" />
              </button>
              <div className="absolute left-1/2 -translate-x-1/2 mt-3 w-56 bg-card/95 border border-border/40 rounded-xl shadow-xl shadow-black/[0.1] backdrop-blur-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2 z-50">
                {categories.map((category) => {
                  const Icon = categoryIcons[category] || Globe;
                  return (
                    <Link
                      key={category}
                      href={`/#category=${category}`}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground/70 hover:text-foreground hover:bg-gradient-to-r hover:from-primary/10 hover:to-transparent transition-all duration-150 font-medium"
                    >
                      <Icon className="w-4 h-4 text-primary/70" />
                      {category}
                    </Link>
                  );
                })}
              </div>
            </div>

            <Link
              href="/trending"
              className="px-4 py-2 rounded-lg text-sm text-foreground/70 hover:text-foreground hover:bg-gradient-to-r hover:from-primary/10 hover:to-accent/10 transition-all duration-200 font-bold flex items-center gap-2"
            >
              <Flame className="w-4 h-4 text-orange-500" />
              Trending
            </Link>

            <Link
              href="/saved"
              className="px-4 py-2 rounded-lg text-sm text-foreground/70 hover:text-foreground hover:bg-gradient-to-r hover:from-primary/10 hover:to-accent/10 transition-all duration-200 font-bold"
            >
              Saved
            </Link>

            <Link
              href="/admin"
              className="ml-4 flex items-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 font-bold text-sm shadow-lg shadow-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/30 hover:-translate-y-0.5"
            >
              <Settings className="w-4 h-4" />
              Admin
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-muted/60 transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5 text-foreground" />
            ) : (
              <Menu className="w-5 h-5 text-foreground" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden pb-4 space-y-1 border-t border-border/30 pt-4 animate-slide-down">
            <Link
              href="/"
              className="block px-4 py-3 rounded-lg text-foreground hover:bg-gradient-to-r hover:from-primary/10 hover:to-accent/10 transition-all font-bold text-sm"
              onClick={() => setMobileMenuOpen(false)}
            >
              Explore
            </Link>

            {/* Mobile Categories */}
            <div>
              <button
                onClick={() => setCategoriesOpen(!categoriesOpen)}
                className="w-full text-left px-4 py-2.5 rounded-xl text-foreground hover:bg-primary/5 transition-colors font-medium flex items-center justify-between text-sm"
              >
                Categories
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${categoriesOpen ? 'rotate-180' : ''}`} />
              </button>
              {categoriesOpen && (
                <div className="ml-4 mt-1 space-y-0.5 border-l-2 border-primary/20 pl-4">
                  {categories.map((category) => {
                    const Icon = categoryIcons[category] || Globe;
                    return (
                      <Link
                        key={category}
                        href={`/#category=${category}`}
                        className="flex items-center gap-2.5 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                        onClick={() => {
                          setMobileMenuOpen(false);
                          setCategoriesOpen(false);
                        }}
                      >
                        <Icon className="w-3.5 h-3.5 text-primary/60" />
                        {category}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            <Link
              href="/trending"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-foreground hover:bg-primary/5 transition-colors font-medium text-sm"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Flame className="w-4 h-4 text-orange-500" />
              Trending
            </Link>

            <Link
              href="/saved"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-foreground hover:bg-primary/5 transition-colors font-medium text-sm"
              onClick={() => setMobileMenuOpen(false)}
            >
              Saved
            </Link>

            <Link
              href="/about"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-foreground hover:bg-primary/5 transition-colors font-medium text-sm"
              onClick={() => setMobileMenuOpen(false)}
            >
              About Us
            </Link>

            <Link
              href="/contact"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-foreground hover:bg-primary/5 transition-colors font-medium text-sm"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact Us
            </Link>

            <Link
              href="/admin"
              className="flex items-center gap-2 mx-2 mt-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium text-sm shadow-md shadow-indigo-500/20"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Settings className="w-3.5 h-3.5" />
              Admin
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}