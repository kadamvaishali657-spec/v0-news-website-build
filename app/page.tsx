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
import { ImmersiveHero } from '@/components/immersive-hero';
import { ImmersiveLoader } from '@/components/immersive-loader';
import { Article, RSSFeed, fetchAllFeeds, DEFAULT_FEEDS } from '@/lib/rss-parser';
import { Newspaper, Globe, TrendingUp, Zap, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

const ARTICLES_PER_PAGE = 12;

export default function HomePage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
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

  // Fetch articles when feeds change
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
          setError('No articles loaded. RSS feeds may be temporarily unavailable.');
        }

        setArticles(articles);
        setCurrentPage(1);
      } catch (err) {
        setError('Failed to load news. Please try again later.');
      } finally {
        setLoading(false);
        // Ensure initial loader shows for at least 3 seconds for effect
        setTimeout(() => setInitialLoad(false), 3000);
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

  if (initialLoad) {
    return <ImmersiveLoader />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <ImmersiveHero />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Featured Section */}
        {!loading && featuredArticles.length > 0 && (
          <section className="mb-16 fade-in-up">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-foreground font-display">Featured Stories</h2>
                <div className="h-1.5 w-20 bg-accent mt-2 rounded-full" />
              </div>
              <Link href="/trending" className="group flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent/80 transition-colors">
                View trending
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredArticles.map((article) => (
                <NewsCard key={article.id} article={article} />
              ))}
            </div>
          </section>
        )}

        {/* Search & Filter Section */}
        <section className="mb-12 glass p-8 rounded-3xl border border-border/40 shadow-xl">
           <div className="max-w-xl mx-auto mb-10">
              <SearchBar onSearch={handleSearch} />
           </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex-1">
               <h3 className="text-xs font-bold text-accent uppercase tracking-widest mb-4">Refine Intelligence</h3>
               <CategoryFilter selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />
            </div>

            <button
              onClick={toggleSummaries}
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all duration-300 shadow-lg ${
                showSummaries
                  ? 'bg-accent text-white shadow-accent/40 scale-105'
                  : 'bg-card border border-border text-foreground hover:border-accent hover:bg-accent/5'
              }`}
            >
              <Sparkles className={`w-4 h-4 ${showSummaries ? 'animate-pulse' : 'text-accent'}`} />
              {showSummaries ? 'AI Summaries Active' : 'Enable AI Summaries'}
            </button>
          </div>
        </section>

        {/* Error State */}
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-6 text-destructive mb-12 flex items-start gap-4">
            <div className="w-6 h-6 rounded-full bg-destructive/20 flex items-center justify-center flex-shrink-0 mt-1">
              <span className="text-sm font-bold">!</span>
            </div>
            <div>
              <p className="font-bold">System Alert</p>
              <p className="text-sm opacity-80 mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Articles Grid */}
        {!loading && (
          <>
            <div className="flex items-center justify-between mb-8">
              <p className="text-sm text-muted-foreground font-medium">
                Found <span className="text-foreground">{filteredArticles.length}</span> results for your query
              </p>
            </div>

            {paginatedArticles.length > 0 ? (
              <>
                <div className={showSummaries ? 'space-y-8 mb-16' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16'}>
                  {paginatedArticles.map((article) => (
                    <div key={article.id} className={showSummaries ? 'bg-card border border-border/40 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500' : ''}>
                      <NewsCard article={article} />
                      {showSummaries && (
                        <div className="px-6 pb-6 pt-4 border-t border-border/20 bg-accent/5 font-serif italic text-foreground/80">
                          <ArticleSummary article={article} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex justify-center mb-16">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-24 glass rounded-3xl">
                <div className="w-20 h-20 rounded-3xl bg-muted flex items-center justify-center mx-auto mb-6">
                  <Newspaper className="w-10 h-10 text-muted-foreground/30" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">No intelligence found</h3>
                <p className="text-muted-foreground max-w-xs mx-auto">Try broadening your search or selecting a different category.</p>
              </div>
            )}
          </>
        )}
      </main>

      <NewsletterCTA />

      <footer className="border-t border-border/40 py-16 bg-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-accent flex items-center justify-center shadow-lg shadow-accent/20">
                <span className="text-white font-bold text-sm">IN</span>
              </div>
              <span className="text-sm font-medium tracking-widest uppercase">
                INFORMED Intelligence &copy; 2026
              </span>
            </div>
            <div className="flex items-center gap-8 text-xs font-bold uppercase tracking-widest text-muted-foreground">
              <Link href="/privacy" className="hover:text-accent transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-accent transition-colors">Terms</Link>
              <Link href="/support" className="hover:text-accent transition-colors">Support</Link>
            </div>
          </div>
        </div>
      </footer>

      <ChatBotWidget articles={articles} />
    </div>
  );
}
