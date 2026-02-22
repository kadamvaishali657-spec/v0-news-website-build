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
        
        // Load user-published articles from localStorage
        const userPublished = localStorage.getItem('user-published-articles');
        const publishedArticles = userPublished ? JSON.parse(userPublished) : [];
        
        // Combine all articles with published articles at the top
        const allArticles = [...publishedArticles, ...articles];
        
        if (allArticles.length === 0) {
          setError('No articles loaded. RSS feeds may be temporarily unavailable. Try again in a moment.');
        }
        
        setArticles(allArticles);
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
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-card to-background border-b border-border py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-balance text-4xl md:text-5xl font-bold text-foreground mb-4">
            Global News Aggregator
            <span className="text-accent"> All In One Place</span>
          </h1>
          <p className="text-balance text-lg text-muted-foreground mb-8 max-w-2xl">
            Discover news from 25+ trusted sources covering Technology, Global News, Business, Sports, Entertainment, Education, and more.
          </p>

          {/* Search Bar */}
          <SearchBar onSearch={handleSearch} />
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex gap-8">
        {/* Sidebar Navigation */}
        <SidebarNav selectedCategory={selectedCategory} onCategorySelect={setSelectedCategory} />

        {/* Main Content */}
        <div className="flex-1 pb-20 md:pb-0">
        {/* Featured Section */}
        {!loading && featuredArticles.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-foreground mb-6">Featured Stories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {featuredArticles.map((article) => (
                <NewsCard key={article.id} article={article} />
              ))}
            </div>
          </section>
        )}

        {/* Category Filter */}
        <section className="mb-8">
          <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase">Filter by category</h3>
          <CategoryFilter selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />
        </section>

        {/* Error State */}
        {error && (
          <div className="bg-red-900/20 border border-red-700 rounded-lg p-4 text-red-200 mb-8">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-accent animate-spin" />
          </div>
        )}

        {/* Articles Grid */}
        {!loading && (
          <>
            <div className="mb-4 text-sm text-muted-foreground">
              Showing {filteredArticles.length === 0 ? '0' : startIdx + 1}-{Math.min(endIdx, filteredArticles.length)} of{' '}
              {filteredArticles.length} articles
            </div>

            {paginatedArticles.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {paginatedArticles.map((article) => (
                    <NewsCard key={article.id} article={article} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                )}
              </>
            ) : (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg">No articles found. Try adjusting your filters.</p>
              </div>
            )}
          </>
        )}
        </div>
      </main>

      {/* Newsletter CTA */}
      <NewsletterCTA />

      {/* Footer */}
      <footer className="bg-card border-t border-border mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2026 JustinNews.tech - Tech news aggregator powered by RSS feeds</p>
            <p className="text-sm mt-2">Content sourced from TechCrunch, The Verge, and NY Times</p>
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
