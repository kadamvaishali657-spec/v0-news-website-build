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
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-sm">JN</span>
            </div>
            <div>
              <Link href="/" className="text-xl font-serif font-bold text-gray-900 hover:text-blue-600 transition-colors block leading-tight">
                JustinNews
              </Link>
              <p className="text-xs text-gray-500">.tech</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <Link 
              href="/" 
              className="px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors font-medium text-sm"
            >
              Home
            </Link>

            {/* Categories Dropdown */}
            <div className="relative group">
              <button className="px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors font-medium flex items-center gap-1 text-sm group-hover:text-blue-600">
                Categories
                <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
              </button>
              <div className="absolute left-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2 z-50">
                {categories.map((category) => (
                  <Link
                    key={category}
                    href={`/#category=${category}`}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors border-l-2 border-transparent hover:border-blue-600"
                  >
                    {category}
                  </Link>
                ))}
              </div>
            </div>

            {/* Additional Links */}
            <Link 
              href="/trending" 
              className="px-3 py-2 text-gray-700 hover:text-red-600 transition-colors font-medium flex items-center gap-1 text-sm"
            >
              <Flame className="w-4 h-4" />
              Trending
            </Link>

            <Link 
              href="/saved" 
              className="px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors font-medium flex items-center gap-1 text-sm"
            >
              <Bookmark className="w-4 h-4" />
              Saved
            </Link>

            <Link 
              href="/search" 
              className="px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors font-medium flex items-center gap-1 text-sm"
            >
              <Search className="w-4 h-4" />
              Search
            </Link>

            <Link 
              href="/settings" 
              className="px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors font-medium flex items-center gap-1 text-sm"
            >
              <Cog className="w-4 h-4" />
              Settings
            </Link>

            <Link 
              href="/newsletter" 
              className="px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors font-medium flex items-center gap-1 text-sm"
            >
              <Mail className="w-4 h-4" />
              Newsletter
            </Link>

            <Link 
              href="/publish" 
              className="px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors font-medium flex items-center gap-1 text-sm"
            >
              <Edit3 className="w-4 h-4" />
              Publish
            </Link>

            <Link 
              href="/support" 
              className="px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors font-medium flex items-center gap-1 text-sm"
            >
              <HelpCircle className="w-4 h-4" />
              Support
            </Link>

            {/* Admin Button */}
            <Link 
              href="/admin" 
              className="flex items-center gap-2 px-3 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium text-sm ml-2"
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
