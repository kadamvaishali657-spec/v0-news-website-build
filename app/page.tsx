'use client';
// INFORMED Premium News Aggregation Platform - Fresh Vercel Build Trigger

import { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/header';
import { ImmersiveHero } from '@/components/immersive-hero';
import { MasonryCard } from '@/components/masonry-card';
import { TimelineSection } from '@/components/timeline-section';
import { SearchBar } from '@/components/search-bar';
import { ChatBotWidget } from '@/components/chatbot-widget';
import { ImmersiveLoader } from '@/components/immersive-loader';
import { AppPromotionSection } from '@/components/app-promotion-section';
import { Article, RSSFeed, fetchAllFeeds, DEFAULT_FEEDS } from '@/lib/rss-parser';
import { Loader2, Search, Globe } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [feeds] = useState<RSSFeed[]>(DEFAULT_FEEDS);

  // Fetch articles on mount
  useEffect(() => {
    const loadArticles = async () => {
      setLoading(true);
      setError(null);
      try {
        const articles = await fetchAllFeeds(feeds);
        if (articles.length === 0) {
          setError('No articles loaded. RSS feeds may be temporarily unavailable.');
        }
        setArticles(articles);
        
        // Store articles in sessionStorage for article page access
        if (typeof window !== 'undefined' && articles.length > 0) {
          sessionStorage.setItem('current-articles', JSON.stringify(articles));
        }
      } catch (err) {
        setError('Failed to load news. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (feeds.length > 0) {
      loadArticles();
    }
  }, [feeds]);

  // Filter articles by search query
  const filteredArticles = searchQuery.trim() 
    ? articles.filter(a => 
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : articles;

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  if (loading) {
    return <ImmersiveLoader />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Immersive Hero */}
      <ImmersiveHero />

      {/* Masonry Grid Section */}
      <section className="py-24 px-6 bg-background">
        <div className="max-w-7xl mx-auto">
          {/* Section Header with Search and Explore Button */}
          <div className="mb-16">
            <div className="flex items-end justify-between mb-12 gap-6">
              <h2 className="section-heading text-foreground">
                Breaking <span className="text-accent">Stories</span>
              </h2>
              <Link href="/explore">
                <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-accent to-accent/80 text-foreground font-display uppercase text-sm font-bold tracking-wider hover:shadow-lg transition-all duration-300 hover:scale-105">
                  <Globe className="w-4 h-4" />
                  Explore by Region
                </button>
              </Link>
            </div>

            {/* Interactive Search */}
            <div className="relative max-w-2xl">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search articles..."
                className="w-full px-6 py-4 bg-card border border-border text-foreground placeholder:text-foreground/50 font-display text-lg focus:outline-none focus:border-accent transition-colors duration-300"
              />
              <Search className="absolute right-6 top-1/2 transform -translate-y-1/2 text-accent w-5 h-5" />
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-accent animate-spin" />
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="border-2 border-red-500/50 bg-red-500/10 p-6 text-foreground mb-12">
              <p className="font-display text-lg">{error}</p>
            </div>
          )}

          {/* Masonry Grid - Engaging & Inviting */}
          {!loading && filteredArticles.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-max">
              {filteredArticles.slice(0, 16).map((article, idx) => (
                <div key={article.id} className={idx === 0 ? 'md:col-span-2 md:row-span-2' : ''}>
                  <MasonryCard article={article} featured={idx === 0} />
                </div>
              ))}
            </div>
          )}

          {/* No Results */}
          {!loading && filteredArticles.length === 0 && (
            <div className="text-center py-20">
              <p className="text-foreground/60 text-lg">No articles match your search. Try different keywords.</p>
            </div>
          )}
        </div>
      </section>

      {/* App Promotion Section */}
      <AppPromotionSection />

      {/* Timeline Section */}
      {!loading && articles.length > 0 && (
        <TimelineSection articles={articles} />
      )}

      {/* Footer */}
      <footer className="bg-card border-t border-border py-16 px-6 mt-24">
        <div className="max-w-7xl mx-auto text-center text-foreground/60 text-sm">
          <p>&copy; 2026 INFORMED - Reimagined news experience</p>
          <p className="mt-2">Sourced from global RSS feeds • Powered by AI insights</p>
        </div>
      </footer>

      {/* AI Chatbot Widget */}
      <ChatBotWidget articles={articles} />
    </div>
  );
}
