'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Settings, Menu, X, ChevronDown, Flame, Bookmark, Search, Cog, Mail, HelpCircle, Edit3 } from 'lucide-react';

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
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <span className="text-accent-foreground font-bold text-sm">JN</span>
            </div>
            <Link href="/" className="text-2xl font-bold text-foreground hover:text-accent transition-colors">
              JustinNews
              <span className="text-accent">.tech</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            <Link 
              href="/" 
              className="px-4 py-2 rounded-lg text-foreground hover:bg-accent/10 hover:text-accent transition-colors font-medium"
            >
              Home
            </Link>

            {/* Categories Dropdown */}
            <div className="relative group">
              <button className="px-4 py-2 rounded-lg text-foreground hover:bg-accent/10 hover:text-accent transition-colors font-medium flex items-center gap-2">
                Categories
                <ChevronDown className="w-4 h-4" />
              </button>
              <div className="absolute left-0 mt-0 w-48 bg-card border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2 z-50">
                {categories.map((category) => (
                  <Link
                    key={category}
                    href={`/#category=${category}`}
                    className="block px-4 py-2 text-sm text-foreground hover:bg-accent/20 hover:text-accent transition-colors"
                  >
                    {category}
                  </Link>
                ))}
              </div>
            </div>

            {/* Additional Links */}
            <Link 
              href="/trending" 
              className="px-4 py-2 rounded-lg text-foreground hover:bg-accent/10 hover:text-accent transition-colors font-medium flex items-center gap-1"
            >
              <Flame className="w-4 h-4" />
              Trending
            </Link>

            <Link 
              href="/saved" 
              className="px-4 py-2 rounded-lg text-foreground hover:bg-accent/10 hover:text-accent transition-colors font-medium flex items-center gap-1"
            >
              <Bookmark className="w-4 h-4" />
              Saved
            </Link>

            <Link 
              href="/search" 
              className="px-4 py-2 rounded-lg text-foreground hover:bg-accent/10 hover:text-accent transition-colors font-medium flex items-center gap-1"
            >
              <Search className="w-4 h-4" />
              Search
            </Link>

            <Link 
              href="/settings" 
              className="px-4 py-2 rounded-lg text-foreground hover:bg-accent/10 hover:text-accent transition-colors font-medium flex items-center gap-1"
            >
              <Cog className="w-4 h-4" />
              Settings
            </Link>

            <Link 
              href="/newsletter" 
              className="px-4 py-2 rounded-lg text-foreground hover:bg-accent/10 hover:text-accent transition-colors font-medium flex items-center gap-1"
            >
              <Mail className="w-4 h-4" />
              Newsletter
            </Link>

            <Link 
              href="/publish" 
              className="px-4 py-2 rounded-lg text-foreground hover:bg-accent/10 hover:text-accent transition-colors font-medium flex items-center gap-1 bg-accent/20"
            >
              <Edit3 className="w-4 h-4" />
              Publish
            </Link>

            <Link 
              href="/support" 
              className="px-4 py-2 rounded-lg text-foreground hover:bg-accent/10 hover:text-accent transition-colors font-medium flex items-center gap-1"
            >
              <HelpCircle className="w-4 h-4" />
              Support
            </Link>

            {/* Admin Button */}
            <Link 
              href="/admin" 
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-accent-foreground hover:bg-accent/90 transition-colors font-medium ml-2"
            >
              <Settings className="w-4 h-4" />
              Admin
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-accent/10 transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-foreground" />
            ) : (
              <Menu className="w-6 h-6 text-foreground" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 space-y-2 border-t border-border pt-4">
            <Link 
              href="/" 
              className="block px-4 py-2 rounded-lg text-foreground hover:bg-accent/10 hover:text-accent transition-colors font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>

            {/* Mobile Categories */}
            <div>
              <button 
                onClick={() => setCategoriesOpen(!categoriesOpen)}
                className="w-full text-left px-4 py-2 rounded-lg text-foreground hover:bg-accent/10 hover:text-accent transition-colors font-medium flex items-center justify-between"
              >
                Categories
                <ChevronDown className={`w-4 h-4 transition-transform ${categoriesOpen ? 'rotate-180' : ''}`} />
              </button>
              {categoriesOpen && (
                <div className="ml-4 mt-2 space-y-1 border-l border-border pl-4">
                  {categories.map((category) => (
                    <Link
                      key={category}
                      href={`/#category=${category}`}
                      className="block px-4 py-2 text-sm text-foreground hover:text-accent transition-colors"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setCategoriesOpen(false);
                      }}
                    >
                      {category}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link 
              href="/trending" 
              className="block px-4 py-2 rounded-lg text-foreground hover:bg-accent/10 hover:text-accent transition-colors font-medium flex items-center gap-1"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Flame className="w-4 h-4" />
              Trending
            </Link>

            <Link 
              href="/saved" 
              className="block px-4 py-2 rounded-lg text-foreground hover:bg-accent/10 hover:text-accent transition-colors font-medium flex items-center gap-1"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Bookmark className="w-4 h-4" />
              Saved
            </Link>

            <Link 
              href="/search" 
              className="block px-4 py-2 rounded-lg text-foreground hover:bg-accent/10 hover:text-accent transition-colors font-medium flex items-center gap-1"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Search className="w-4 h-4" />
              Search
            </Link>

            <Link 
              href="/settings" 
              className="block px-4 py-2 rounded-lg text-foreground hover:bg-accent/10 hover:text-accent transition-colors font-medium flex items-center gap-1"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Cog className="w-4 h-4" />
              Settings
            </Link>

            <Link 
              href="/newsletter" 
              className="block px-4 py-2 rounded-lg text-foreground hover:bg-accent/10 hover:text-accent transition-colors font-medium flex items-center gap-1"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Mail className="w-4 h-4" />
              Newsletter
            </Link>

            <Link 
              href="/publish" 
              className="block px-4 py-2 rounded-lg text-foreground hover:bg-accent/10 hover:text-accent transition-colors font-medium flex items-center gap-1 bg-accent/20"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Edit3 className="w-4 h-4" />
              Publish
            </Link>

            <Link 
              href="/support" 
              className="block px-4 py-2 rounded-lg text-foreground hover:bg-accent/10 hover:text-accent transition-colors font-medium flex items-center gap-1"
              onClick={() => setMobileMenuOpen(false)}
            >
              <HelpCircle className="w-4 h-4" />
              Support
            </Link>

            <Link 
              href="/admin" 
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-accent-foreground hover:bg-accent/90 transition-colors font-medium mt-4"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Settings className="w-4 h-4" />
              Admin
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
