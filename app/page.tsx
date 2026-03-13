'use client';

import { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/header';
import { SearchBar } from '@/components/search-bar';
import { CategoryFilter } from '@/components/category-filter';
import { NewsCard } from '@/components/news-card';
import { Pagination } from '@/components/pagination';
import { ArticleSummary } from '@/components/article-summary';
import { NewsletterCTA } from '@/components/newsletter-cta';
import { Article, RSSFeed, fetchAllFeeds, DEFAULT_FEEDS } from '@/lib/rss-parser';
import { Loader2, Sparkles } from 'lucide-react';

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
        // Check session cache first for instant return visits
        const cached = sessionStorage.getItem('articles-session-cache');
        let articles: Article[] = [];
        
        if (cached) {
          try {
            articles = JSON.parse(cached);
          } catch (e) {
            // Invalid cache, refetch
            articles = await fetchAllFeeds(feeds);
            sessionStorage.setItem('articles-session-cache', JSON.stringify(articles));
          }
        } else {
          // No cache, fetch feeds
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

    // Filter out articles from disabled feeds
    result = result.filter((article) => !disabledFeeds.includes(article.source));

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
        const articleCategory = article.category || article.source || '';
        return articleCategory.toLowerCase().includes(selectedCategory.toLowerCase()) ||
               selectedCategory.toLowerCase().includes(articleCategory.toLowerCase());
      });
    }

    // Apply category filter
    if (selectedCategory !== 'All') {
      result = result.filter((article) => {
        const articleCategory = article.category || article.source || '';
        return articleCategory.toLowerCase().includes(selectedCategory.toLowerCase()) ||
               selectedCategory.toLowerCase().includes(articleCategory.toLowerCase());
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
    setCurrentPage(1);
  }, []);

  const toggleSummaries = useCallback(() => {
    const newValue = !showSummaries;
    setShowSummaries(newValue);
    localStorage.setItem('show-ai-summaries', JSON.stringify(newValue));
  }, [showSummaries]);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="bg-white border-b border-gray-200 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-balance text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Global News Aggregator
          </h1>
          <p className="text-balance text-lg text-gray-600 mb-10 max-w-2xl">
            Curated news from 25+ trusted sources.
          </p>

          {/* Search Bar */}
          <SearchBar onSearch={handleSearch} />
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Featured Section */}
        {!loading && featuredArticles.length > 0 && (
          <section className="mb-20 pb-8 border-b border-border">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">Featured Stories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {featuredArticles.map((article) => (
                <NewsCard key={article.id} article={article} />
              ))}
            </div>
          </section>
        )}

        {/* AI Summary Toggle */}
        <section className="mb-8 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Filter by category</h3>
          <button
            onClick={toggleSummaries}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              showSummaries
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            {showSummaries ? 'Hide Summaries' : 'Show AI Summaries'}
          </button>
        </section>

        {/* Category Filter */}
        <section className="mb-12">
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
                <div className={showSummaries ? 'space-y-8 mb-12' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12'}>
                  {paginatedArticles.map((article) => (
                    <div key={article.id} className={showSummaries ? 'bg-white border border-gray-200 rounded-lg overflow-hidden' : ''}>
                      <NewsCard article={article} />
                      {showSummaries && (
                        <div className="px-6 pb-6 pt-2 border-t border-gray-200 bg-gray-50">
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
              <div className="text-center py-20">
                <p className="text-muted-foreground text-lg">No articles found. Try adjusting your filters.</p>
              </div>
            )}
          </>
        )}
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

    </div>
  );
}
