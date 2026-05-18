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
        ? 'glass border-b border-border/50 shadow-lg shadow-black/[0.03]'
        : 'bg-background/80 backdrop-blur-sm border-b border-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-glow group-hover:shadow-glow-lg transition-shadow duration-300">
              <span className="text-white font-black text-sm tracking-tight">I</span>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-300 -z-10" />
            </div>
            <span className="text-xl font-bold text-foreground tracking-tight">
              Informed
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {/* Categories Dropdown */}
            <div className="relative group">
              <button className="px-3.5 py-2 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all duration-200 font-medium flex items-center gap-1.5">
                Categories
                <ChevronDown className="w-3.5 h-3.5 transition-transform group-hover:rotate-180 duration-300" />
              </button>
              <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-56 bg-card border border-border/60 rounded-2xl shadow-xl shadow-black/[0.08] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2 z-50 animate-scale-in">
                {categories.map((category) => {
                  const Icon = categoryIcons[category] || Globe;
                  return (
                    <Link
                      key={category}
                      href={`/#category=${category}`}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-primary/5 transition-all duration-150"
                    >
                      <Icon className="w-4 h-4 text-primary/60" />
                      {category}
                    </Link>
                  );
                })}
              </div>
            </div>

            <Link
              href="/trending"
              className="px-3.5 py-2 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all duration-200 font-medium flex items-center gap-1.5"
            >
              <Flame className="w-4 h-4 text-orange-500" />
              Trending
            </Link>

            <Link
              href="/saved"
              className="px-3.5 py-2 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all duration-200 font-medium flex items-center gap-1.5"
            >
              Saved
            </Link>

            <Link
              href="/admin"
              className="ml-2 flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 font-medium text-sm shadow-md shadow-indigo-500/20 hover:shadow-lg hover:shadow-indigo-500/30"
            >
              <Settings className="w-3.5 h-3.5" />
              Admin
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl hover:bg-muted/60 transition-colors"
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
          <nav className="md:hidden pb-4 space-y-1 border-t border-border/50 pt-4 animate-slide-down">
            <Link
              href="/"
              className="block px-4 py-2.5 rounded-xl text-foreground hover:bg-primary/5 transition-colors font-medium text-sm"
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