'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  AlertCircle,
  BadgeCheck,
  BarChart3,
  Globe,
  Loader2,
  Newspaper,
  RefreshCw,
  Sparkles,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { Header } from '@/components/header';
import { SearchBar } from '@/components/search-bar';
import { CategoryFilter } from '@/components/category-filter';
import { NewsCard } from '@/components/news-card';
import { Pagination } from '@/components/pagination';
import { ArticleSummary } from '@/components/article-summary';
import { NewsletterCTA } from '@/components/newsletter-cta';
import { ChatBotWidget } from '@/components/chatbot-widget';
import {
  NewsCardGridSkeleton,
  FeaturedArticlesGridSkeleton,
  SearchBarSkeleton,
  CategoryFilterSkeleton,
} from '@/components/skeleton-loaders';
import { Article, RSSFeed, fetchAllFeeds, DEFAULT_FEEDS } from '@/lib/rss-parser';

const ARTICLES_PER_PAGE = 12;

function useFeedFetching(feeds: RSSFeed[]) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const loadArticles = async () => {
      setLoading(true);
      setError(null);

      try {
        const cacheKey = 'articles-cache';
        const cached = localStorage.getItem(cacheKey);
        const cacheTime = localStorage.getItem(`${cacheKey}-time`);
        const now = Date.now();

        if (cached && cacheTime) {
          const cachedDate = parseInt(cacheTime, 10);
          if (now - cachedDate < 5 * 60 * 1000) {
            try {
              const cachedArticles = JSON.parse(cached);
              if (Array.isArray(cachedArticles) && cachedArticles.length > 0) {
                setArticles(cachedArticles);
                setLoading(false);
                return;
              }
            } catch {
              // Continue with fresh fetch when cache parsing fails
            }
          }
        }

        const freshArticles = await fetchAllFeeds(feeds);

        if (freshArticles.length > 0) {
          localStorage.setItem(cacheKey, JSON.stringify(freshArticles));
          localStorage.setItem(`${cacheKey}-time`, now.toString());
          setArticles(freshArticles);
          return;
        }

        setError('We could not load fresh articles right now. Please try again shortly.');
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(`Unable to load news at this time. ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    };

    if (feeds.length > 0) {
      loadArticles();
    }
  }, [feeds, retryCount]);

  const retry = useCallback(() => {
    setRetryCount((prev) => prev + 1);
  }, []);

  return { articles, loading, error, retry };
}

function useArticleFiltering(
  articles: Article[],
  searchQuery: string,
  selectedCategory: string,
  disabledFeeds: string[]
) {
  return useMemo(() => {
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
        return (
          articleCategory.toLowerCase().includes(selectedCategory.toLowerCase()) ||
          selectedCategory.toLowerCase().includes(articleCategory.toLowerCase())
        );
      });
    }

    return result;
  }, [articles, searchQuery, selectedCategory, disabledFeeds]);
}

function getUniqueCount(values: string[]) {
  return new Set(values.map((value) => value.toLowerCase())).size;
}

export default function HomePage() {
  const [feeds, setFeeds] = useState<RSSFeed[]>(DEFAULT_FEEDS);
  const [disabledFeeds, setDisabledFeeds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [showSummaries, setShowSummaries] = useState(false);

  useEffect(() => {
    try {
      const savedFeeds = localStorage.getItem('rss-feeds');
      if (savedFeeds) {
        setFeeds(JSON.parse(savedFeeds));
      }

      const savedDisabled = localStorage.getItem('disabled-feeds');
      if (savedDisabled) {
        setDisabledFeeds(JSON.parse(savedDisabled));
      }

      const savedShowSummaries = localStorage.getItem('show-ai-summaries');
      if (savedShowSummaries) {
        setShowSummaries(JSON.parse(savedShowSummaries));
      }
    } catch {
      // Ignore localStorage read errors
    }
  }, []);

  const { articles, loading, error, retry } = useFeedFetching(feeds);
  const filteredArticles = useArticleFiltering(articles, searchQuery, selectedCategory, disabledFeeds);

  const startIdx = (currentPage - 1) * ARTICLES_PER_PAGE;
  const endIdx = startIdx + ARTICLES_PER_PAGE;
  const paginatedArticles = filteredArticles.slice(startIdx, endIdx);
  const totalPages = Math.ceil(filteredArticles.length / ARTICLES_PER_PAGE);

  const featuredArticle = articles[0];
  const spotlightArticles = articles.slice(1, 5);
  const liveBriefing = filteredArticles.slice(0, 3);

  const stats = [
    {
      icon: Newspaper,
      label: 'Articles Indexed',
      value: articles.length.toLocaleString(),
      hint: 'Continuously refreshed feed inventory',
    },
    {
      icon: Globe,
      label: 'Source Publications',
      value: getUniqueCount(articles.map((article) => article.source)).toString(),
      hint: 'Cross-publication coverage for balanced context',
    },
    {
      icon: BarChart3,
      label: 'Topic Clusters',
      value: getUniqueCount(articles.map((article) => article.category || article.source)).toString(),
      hint: 'Structured categories to improve discovery',
    },
    {
      icon: BadgeCheck,
      label: 'Update Status',
      value: loading ? 'Syncing' : 'Live',
      hint: 'Near real-time updates from configured feeds',
    },
  ];

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  }, []);

  const toggleSummaries = useCallback(() => {
    const nextValue = !showSummaries;
    setShowSummaries(nextValue);
    localStorage.setItem('show-ai-summaries', JSON.stringify(nextValue));
  }, [showSummaries]);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="relative overflow-hidden border-b border-border/40">
        <div className="absolute inset-0 mesh-gradient" />
        <div className="absolute inset-y-0 right-0 w-[520px] bg-gradient-to-l from-indigo-500/10 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
              <span className="relative flex h-2 w-2">
                <span className="pulse-dot absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              Professional global newsroom briefing
            </div>

            <h1 className="text-balance text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-5">
              Reliable headlines.
              <br />
              <span className="gradient-text">Clear decisions.</span>
            </h1>

            <p className="text-balance text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl leading-relaxed">
              Track major stories, compare sources, and surface key developments faster with a structured,
              premium-grade news experience.
            </p>

            {loading && !articles.length ? (
              <SearchBarSkeleton />
            ) : (
              <SearchBar
                onSearch={handleSearch}
                placeholder="Search by story, topic, publication, or keyword..."
              />
            )}

            <div className="flex flex-wrap items-center gap-3 mt-8">
              <Link
                href="/trending"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium text-sm hover:opacity-95 transition-opacity"
              >
                Explore Trending
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                onClick={toggleSummaries}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
                  showSummaries
                    ? 'bg-primary/15 text-primary border border-primary/30'
                    : 'bg-card border border-border/60 text-muted-foreground hover:text-foreground'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                {showSummaries ? 'AI Summaries Enabled' : 'Enable AI Summaries'}
              </button>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-14">
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {stats.map(({ icon: Icon, label, value, hint }) => (
            <article key={label} className="rounded-2xl border border-border/60 bg-card/80 p-5 shadow-card">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
                <Icon className="w-4 h-4 text-primary" />
              </div>
              <p className="text-2xl font-bold text-foreground">{value}</p>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{hint}</p>
            </article>
          ))}
        </section>

        <section className="grid grid-cols-1 xl:grid-cols-[1.4fr_1fr] gap-6">
          <article className="rounded-2xl border border-border/60 bg-card/80 p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Lead Story</h2>
                <p className="text-sm text-muted-foreground">Editorial spotlight from live feeds</p>
              </div>
              <Link href="/trending" className="text-sm text-primary font-medium inline-flex items-center gap-1">
                See all <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {loading && !articles.length ? (
              <FeaturedArticlesGridSkeleton count={1} />
            ) : featuredArticle ? (
              <div className="space-y-4">
                <NewsCard article={featuredArticle} />
                {showSummaries && (
                  <div className="rounded-xl border border-border/50 bg-muted/40 p-4">
                    <ArticleSummary article={featuredArticle} />
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-xl bg-muted/50 p-8 text-center text-sm text-muted-foreground">
                No lead story available right now.
              </div>
            )}
          </article>

          <article className="rounded-2xl border border-border/60 bg-card/80 p-6">
            <div className="flex items-center gap-2 mb-5">
              <Zap className="w-4 h-4 text-primary" />
              <h3 className="text-lg font-semibold">Live Briefing</h3>
            </div>
            <div className="space-y-3">
              {loading && !articles.length ? (
                <div className="space-y-3">
                  <div className="h-20 rounded-xl bg-muted/50 animate-pulse" />
                  <div className="h-20 rounded-xl bg-muted/50 animate-pulse" />
                  <div className="h-20 rounded-xl bg-muted/50 animate-pulse" />
                </div>
              ) : liveBriefing.length > 0 ? (
                liveBriefing.map((article) => (
                  <Link
                    key={article.id}
                    href={`/article/${encodeURIComponent(article.id)}`}
                    className="block rounded-xl border border-border/50 bg-background/40 p-4 hover:border-primary/30 transition-colors"
                  >
                    <p className="text-xs text-primary font-medium mb-1">{article.source}</p>
                    <p className="text-sm font-semibold text-foreground line-clamp-2">{article.title}</p>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{article.description}</p>
                  </Link>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No briefing items match current filters.</p>
              )}
            </div>
          </article>
        </section>

        <section className="space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Explore by Category</h2>
              <p className="text-sm text-muted-foreground">Focus coverage by domain and monitor what matters most.</p>
            </div>
            <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="w-4 h-4 text-primary" />
              {filteredArticles.length.toLocaleString()} relevant articles
            </div>
          </div>

          {loading && !articles.length ? (
            <CategoryFilterSkeleton />
          ) : (
            <CategoryFilter selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />
          )}
        </section>

        {error && (
          <section className="rounded-2xl border border-destructive/30 bg-destructive/10 p-5 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-destructive">Content refresh issue</p>
              <p className="text-sm text-destructive/80 mt-1">{error}</p>
              <button
                onClick={retry}
                className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-destructive hover:text-destructive/80 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Retry
              </button>
            </div>
          </section>
        )}

        {loading && articles.length === 0 && (
          <section className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Featured Coverage</h3>
              <FeaturedArticlesGridSkeleton count={4} />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Latest Coverage</h3>
              <NewsCardGridSkeleton count={6} />
            </div>
          </section>
        )}

        {!loading && spotlightArticles.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Spotlight Stories</h2>
                <p className="text-sm text-muted-foreground">Handpicked coverage from the live stream.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {spotlightArticles.map((article) => (
                <NewsCard key={article.id} article={article} />
              ))}
            </div>
          </section>
        )}

        {!loading && articles.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6 mt-2">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Latest Headlines</h2>
                <p className="text-sm text-muted-foreground">
                  Showing {filteredArticles.length === 0 ? '0' : startIdx + 1}-{Math.min(endIdx, filteredArticles.length)} of{' '}
                  {filteredArticles.length.toLocaleString()} articles
                </p>
              </div>
            </div>

            {paginatedArticles.length > 0 ? (
              <>
                <div className={showSummaries ? 'space-y-6 mb-10' : 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-10'}>
                  {paginatedArticles.map((article) => (
                    <div
                      key={article.id}
                      className={showSummaries ? 'bg-card border border-border/40 rounded-2xl overflow-hidden shadow-card' : ''}
                    >
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
                  <div className="flex justify-center">
                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20 rounded-2xl border border-border/60 bg-card/60">
                <Loader2 className="w-7 h-7 text-muted-foreground/60 mx-auto mb-3" />
                <p className="text-foreground font-medium">No matching articles found</p>
                <p className="text-muted-foreground text-sm mt-1">Adjust your search terms or category filters.</p>
              </div>
            )}
          </section>
        )}

        {!loading && articles.length === 0 && !error && (
          <section className="text-center py-20 rounded-2xl border border-border/60 bg-card/60">
            <div className="w-14 h-14 rounded-2xl bg-muted/60 flex items-center justify-center mx-auto mb-4">
              <Newspaper className="w-7 h-7 text-muted-foreground/50" />
            </div>
            <p className="text-foreground font-medium">No articles are available right now</p>
            <p className="text-muted-foreground text-sm mt-1">Please check back shortly for the next update cycle.</p>
          </section>
        )}
      </main>

      <NewsletterCTA />

      <footer className="border-t border-border/40 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-xs">IN</span>
              </div>
              <span className="text-sm text-muted-foreground">© 2026 Informed News. All rights reserved.</span>
            </div>
            <div className="flex items-center gap-5 text-sm text-muted-foreground">
              <span>Verified multi-source aggregation</span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline">Professional-grade editorial structure</span>
            </div>
          </div>
        </div>
      </footer>

      <ChatBotWidget articles={articles} />
    </div>
  );
}
