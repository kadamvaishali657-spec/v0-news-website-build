'use client';

import { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/header';
import { SearchBar } from '@/components/search-bar';
import { CategoryFilter } from '@/components/category-filter';
import { NewsCard } from '@/components/news-card';
import { Pagination } from '@/components/pagination';
import { ArticleSummary } from '@/components/article-summary';
import { NewsletterCTA } from '@/components/newsletter-cta';
import { ChatBotWidget } from '@/components/chatbot-widget';
import { Article, RSSFeed, fetchAllFeeds, DEFAULT_FEEDS } from '@/lib/rss-parser';
import { Loader2, Sparkles, Newspaper, TrendingUp, Globe, Zap, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const ARTICLES_PER_PAGE = 12;

export default function HomePage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [feeds, setFeeds] = useState<RSSFeed[]>(DEFAULT_FEEDS);
  const [disabledFeeds, setDisabledFeeds] = useState<string[]>([]);
  const [showSummaries, setShowSummaries] = useState(false);

  // Load feeds and preferences from localStorage
  useEffect(() => {
    const savedFeeds = localStorage.getItem('rss-feeds');
    const savedDisabled = localStorage.getItem('disabled-feeds');
    const savedShowSummaries = localStorage.getItem('show-ai-summaries');
    
    if (savedFeeds) {
      try {
        const parsed = JSON.parse(savedFeeds);
        setFeeds(parsed);
      } catch (e) {
        console.error('Error parsing saved feeds:', e);
      }
    }
    
    if (savedDisabled) {
      try {
        const parsed = JSON.parse(savedDisabled);
        setDisabledFeeds(parsed);
      } catch (e) {
        console.error('Error parsing disabled feeds:', e);
      }
    }

    if (savedShowSummaries) {
      setShowSummaries(JSON.parse(savedShowSummaries));
    }
  }, []);

  // Fetch articles when feeds change (with session caching)
  useEffect(() => {
    const loadArticles = async () => {
      setLoading(true);
      setError(null);
      try {
        const cached = sessionStorage.getItem('articles-session-cache');
        let articles: Article[] = [];
        
        if (cached) {
          try {
            articles = JSON.parse(cached);
          } catch (e) {
            articles = await fetchAllFeeds(feeds);
            sessionStorage.setItem('articles-session-cache', JSON.stringify(articles));
          }
        } else {
          articles = await fetchAllFeeds(feeds);
          sessionStorage.setItem('articles-session-cache', JSON.stringify(articles));
        }
        
        if (articles.length === 0) {
          setError('No articles loaded. RSS feeds may be temporarily unavailable. Try again in a moment.');
        }
        
        setArticles(articles);
        setCurrentPage(1);
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

  // Filter and search articles
  useEffect(() => {
    let result = articles;

    result = result.filter((article) => !disabledFeeds.includes(article.source));

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (article) =>
          article.title.toLowerCase().includes(query) ||
          article.description.toLowerCase().includes(query) ||
          article.source.toLowerCase().includes(query)
      );
    }

    if (selectedCategory !== 'All') {
      result = result.filter((article) => {
        const articleCategory = article.category || article.source || '';
        return articleCategory.toLowerCase().includes(selectedCategory.toLowerCase()) ||
               selectedCategory.toLowerCase().includes(articleCategory.toLowerCase());
      });
    }

    setFilteredArticles(result);
    setCurrentPage(1);
  }, [articles, searchQuery, selectedCategory, disabledFeeds]);

  const startIdx = (currentPage - 1) * ARTICLES_PER_PAGE;
  const endIdx = startIdx + ARTICLES_PER_PAGE;
  const paginatedArticles = filteredArticles.slice(startIdx, endIdx);
  const totalPages = Math.ceil(filteredArticles.length / ARTICLES_PER_PAGE);

  const featuredArticles = articles.slice(0, 4);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  }, []);

  const toggleSummaries = useCallback(() => {
    const newValue = !showSummaries;
    setShowSummaries(newValue);
    localStorage.setItem('show-ai-summaries', JSON.stringify(newValue));
  }, [showSummaries]);

  const stats = [
    { icon: Newspaper, label: 'Articles', value: articles.length.toString() },
    { icon: Globe, label: 'Sources', value: `${feeds.length}+` },
    { icon: TrendingUp, label: 'Categories', value: '8' },
    { icon: Zap, label: 'AI Powered', value: 'Yes' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border/40">
        {/* Background Mesh */}
        <div className="absolute inset-0 mesh-gradient" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-radial from-indigo-500/10 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-radial from-purple-500/10 via-transparent to-transparent" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-3xl">
            {/* Live Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6 fade-in-up">
              <span className="relative flex h-2 w-2">
                <span className="pulse-dot absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Live updates from {feeds.length}+ sources
            </div>

            <h1 className="text-balance text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-5 fade-in-up" style={{ animationDelay: '0.1s' }}>
              Your{' '}
              <span className="gradient-text">Global News</span>
              <br />
              Command Center
            </h1>
            
            <p className="text-balance text-lg md:text-xl text-muted-foreground mb-8 max-w-xl leading-relaxed fade-in-up" style={{ animationDelay: '0.2s' }}>
              Curated intelligence from the world&apos;s most trusted newsrooms, powered by AI summarization.
            </p>

            {/* Search Bar */}
            <div className="fade-in-up" style={{ animationDelay: '0.3s' }}>
              <SearchBar onSearch={handleSearch} />
            </div>

            {/* Stats Row */}
            <div className="flex flex-wrap gap-6 mt-10 fade-in-up" style={{ animationDelay: '0.4s' }}>
              {stats.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-foreground">{value}</div>
                    <div className="text-xs text-muted-foreground">{label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Featured Section */}
        {!loading && featuredArticles.length > 0 && (
          <section className="mb-16 fade-in-up">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">Featured Stories</h2>
                <p className="text-muted-foreground text-sm mt-1">Top picks from our editors</p>
              </div>
              <Link href="/trending" className="group flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                View all
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
              {featuredArticles.map((article) => (
                <NewsCard key={article.id} article={article} />
              ))}
            </div>
          </section>
        )}

        {/* Category & Controls Section */}
        <section className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Browse by Category</h3>
            <button
              onClick={toggleSummaries}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                showSummaries
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/20'
                  : 'bg-card border border-border/60 text-muted-foreground hover:text-foreground hover:border-primary/30'
              }`}
            >
              <Sparkles className={`w-4 h-4 ${showSummaries ? 'text-white/90' : 'text-primary/50'}`} />
              {showSummaries ? 'Hide AI Summaries' : 'Show AI Summaries'}
            </button>
          </div>

          <CategoryFilter selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />
        </section>

        {/* Error State */}
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-5 text-destructive mb-8 flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-destructive/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs font-bold">!</span>
            </div>
            <div>
              <p className="font-medium">Something went wrong</p>
              <p className="text-sm text-destructive/80 mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
              <div className="absolute inset-0 w-12 h-12 rounded-full border-2 border-transparent border-b-purple-500/50 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
            </div>
            <p className="text-sm text-muted-foreground animate-pulse">Loading latest news...</p>
          </div>
        )}

        {/* Articles Grid */}
        {!loading && (
          <>
            <div className="flex items-center justify-between mb-6 mt-8">
              <p className="text-sm text-muted-foreground">
                Showing <span className="font-medium text-foreground">{filteredArticles.length === 0 ? '0' : startIdx + 1}-{Math.min(endIdx, filteredArticles.length)}</span> of{' '}
                <span className="font-medium text-foreground">{filteredArticles.length}</span> articles
              </p>
            </div>

            {paginatedArticles.length > 0 ? (
              <>
                <div className={showSummaries ? 'space-y-6 mb-12' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 stagger-children'}>
                  {paginatedArticles.map((article) => (
                    <div key={article.id} className={showSummaries ? 'bg-card border border-border/40 rounded-2xl overflow-hidden shadow-card card-hover' : ''}>
                      <NewsCard article={article} />
                      {showSummaries && (
                        <div className="px-5 pb-5 pt-3 border-t border-border/30 bg-muted/30">
                          <ArticleSummary article={article} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex justify-center mb-12">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-24">
                <div className="w-16 h-16 rounded-2xl bg-muted/60 flex items-center justify-center mx-auto mb-4">
                  <Newspaper className="w-8 h-8 text-muted-foreground/50" />
                </div>
                <p className="text-foreground font-medium mb-1">No articles found</p>
                <p className="text-muted-foreground text-sm">Try adjusting your search or category filters.</p>
              </div>
            )}
          </>
        )}
      </main>

      {/* Newsletter CTA */}
      <NewsletterCTA />

      {/* Footer */}
      <footer className="border-t border-border/40 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-xs">JN</span>
              </div>
              <span className="text-sm text-muted-foreground">
                &copy; 2026 JustinNews.tech
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <span>Powered by RSS &middot; AI Summaries</span>
              <span className="hidden sm:inline">&middot;</span>
              <span className="hidden sm:inline">TechCrunch &middot; The Verge &middot; NY Times &middot; 20+ more</span>
            </div>
          </div>
        </div>
      </footer>

      {/* AI Chatbot Widget */}
      <ChatBotWidget articles={articles} />
    </div>
  );
}
