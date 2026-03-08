'use client';

import { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/header';
import { SearchBar } from '@/components/search-bar';
import { CategoryFilter } from '@/components/category-filter';
import { NewsCard } from '@/components/news-card';
import { Pagination } from '@/components/pagination';
import { ChatBot } from '@/components/chatbot';
import { SidebarNav } from '@/components/sidebar-nav';
import { BottomNav } from '@/components/bottom-nav';
import { NewsletterCTA } from '@/components/newsletter-cta';
import { Article, RSSFeed, fetchAllFeeds, DEFAULT_FEEDS } from '@/lib/rss-parser';
import { Loader2 } from 'lucide-react';
import Script from 'next/script';

const ARTICLES_PER_PAGE = 12;

// SEO Schema Markup
const newsAggregatorSchema = {
  '@context': 'https://schema.org',
  '@type': 'NewsMediaOrganization',
  name: 'JustinNews',
  description: 'Premium tech news aggregator with real-time updates from 25+ trusted sources',
  url: 'https://www.justinnews.tech',
  logo: {
    '@type': 'ImageObject',
    url: 'https://www.justinnews.tech/favicon.jpg',
    width: 512,
    height: 512,
  },
  sameAs: [
    'https://twitter.com/JustinNews',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'Customer Support',
    email: 'support@justinnews.tech',
  },
};

export default function HomePage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [feeds, setFeeds] = useState<RSSFeed[]>(DEFAULT_FEEDS);

  // Load feeds from localStorage
  useEffect(() => {
    const savedFeeds = localStorage.getItem('rss-feeds');
    if (savedFeeds) {
      try {
        const parsed = JSON.parse(savedFeeds);
        setFeeds(parsed);
      } catch (e) {
        console.error('Error parsing saved feeds:', e);
      }
    }
  }, []);

  // Fetch articles when feeds change
  useEffect(() => {
    const loadArticles = async () => {
      setLoading(true);
      setError(null);
      try {
        const articles = await fetchAllFeeds(feeds);
        
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

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (article) =>
          article.title.toLowerCase().includes(query) ||
          article.description.toLowerCase().includes(query) ||
          article.source.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (selectedCategory !== 'All') {
      result = result.filter((article) => {
        // First try matching the article's category field
        if (article.category && article.category.toLowerCase() === selectedCategory.toLowerCase()) {
          return true;
        }
        // Fallback to text search in title and description
        const title = article.title.toLowerCase();
        const desc = article.description.toLowerCase();
        const categoryLower = selectedCategory.toLowerCase();
        return title.includes(categoryLower) || desc.includes(categoryLower);
      });
    }

    setFilteredArticles(result);
    setCurrentPage(1);
  }, [articles, searchQuery, selectedCategory]);

  // Paginate articles
  const startIdx = (currentPage - 1) * ARTICLES_PER_PAGE;
  const endIdx = startIdx + ARTICLES_PER_PAGE;
  const paginatedArticles = filteredArticles.slice(startIdx, endIdx);
  const totalPages = Math.ceil(filteredArticles.length / ARTICLES_PER_PAGE);

  // Get featured articles (top 5)
  const featuredArticles = articles.slice(0, 5);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Script 
        id="news-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(newsAggregatorSchema) }}
        strategy="afterInteractive"
      />
      <Header />

      {/* Hero Section */}
      <section className="bg-white border-b border-gray-200 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full text-sm font-semibold mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
              </span>
              <span className="text-blue-700">LIVE: 25+ Premium News Sources</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-gray-900 mb-6 leading-tight">
              Breaking News & Analysis
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl">
              Real-time tech news, business intelligence, and global stories from the world's most trusted publishers. Stay informed with breaking updates and expert insights.
            </p>

            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-6 mb-12 py-8 border-y border-gray-200">
              <div>
                <span className="text-3xl font-bold text-blue-600">25+</span>
                <p className="text-sm text-gray-600 mt-1">Premium Sources</p>
              </div>
              <div>
                <span className="text-3xl font-bold text-green-600">100%</span>
                <p className="text-sm text-gray-600 mt-1">Verified</p>
              </div>
              <div>
                <span className="text-3xl font-bold text-blue-600">1000+</span>
                <p className="text-sm text-gray-600 mt-1">Daily Articles</p>
              </div>
            </div>

            {/* Search Bar */}
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex gap-8">
        {/* Sidebar Navigation */}
        <SidebarNav selectedCategory={selectedCategory} onCategorySelect={setSelectedCategory} />

        {/* Main Content */}
        <div className="flex-1 pb-20 md:pb-0">
        {/* Featured Section */}
        {!loading && featuredArticles.length > 0 && (
          <section className="mb-20">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-serif font-bold text-gray-900">Top Stories</h2>
                <p className="text-gray-600 mt-1">Most read this week</p>
              </div>
              <div className="hidden md:flex items-center gap-2 text-xs font-semibold text-red-600 bg-red-50 px-3 py-2 rounded-full">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute h-full w-full rounded-full bg-red-500 opacity-75"></span>
                  <span className="relative h-2 w-2 rounded-full bg-red-600"></span>
                </span>
                Live
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {featuredArticles.map((article) => (
                <NewsCard key={article.id} article={article} />
              ))}
            </div>
          </section>
        )}

        {/* Category Filter */}
        <section className="mb-12">
          <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">Filter by Category</h3>
          <CategoryFilter selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />
        </section>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800 mb-8">
            <p className="font-semibold">Unable to load articles</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-24">
            <div className="text-center">
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin mx-auto mb-3" />
              <p className="text-gray-600 font-medium">Loading articles...</p>
            </div>
          </div>
        )}

        {/* Articles Grid */}
        {!loading && (
          <>
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                {filteredArticles.length === 0 ? (
                  <span>No articles found</span>
                ) : (
                  <span>
                    Showing {startIdx + 1}–{Math.min(endIdx, filteredArticles.length)} of {filteredArticles.length} articles
                  </span>
                )}
              </p>
            </div>

            {paginatedArticles.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                  {paginatedArticles.map((article) => (
                    <NewsCard key={article.id} article={article} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="mb-12">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20">
                <p className="text-gray-600 text-lg font-medium">No articles found</p>
                <p className="text-gray-500 text-sm mt-2">Try adjusting your search or category filters</p>
              </div>
            )}
          </>
        )}
        </div>
      </main>

      {/* Newsletter CTA */}
      <NewsletterCTA />

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <p className="text-gray-700 font-medium">&copy; 2026 JustinNews.tech</p>
            <p className="text-gray-600 text-sm mt-2">Premium tech news aggregator from 25+ trusted sources</p>
          </div>
        </div>
      </footer>

      {/* Chatbot */}
      <ChatBot articles={articles} />

      {/* Mobile Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
