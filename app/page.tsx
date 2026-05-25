'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  AlertCircle,
  BadgeCheck,
  BarChart3,
  Globe,
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

function countUniqueValuesCaseInsensitive(values: string[]) {
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
      value: countUniqueValuesCaseInsensitive(articles.map((article) => article.source)).toString(),
      hint: 'Cross-publication coverage for balanced context',
    },
    {
      icon: BarChart3,
      label: 'Topic Clusters',
      value: countUniqueValuesCaseInsensitive(articles.map((article) => article.category || article.source)).toString(),
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

      <section className="relative overflow-hidden border-b border-border/30">
        <div className="absolute inset-0 mesh-gradient" />
        <div className="absolute inset-y-0 right-0 w-[620px] h-full bg-gradient-to-l from-indigo-500/15 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-20 left-1/3 w-[400px] h-[400px] bg-gradient-to-br from-purple-500/10 to-transparent rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 lg:py-32">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 text-primary text-xs font-semibold mb-8 tracking-wider uppercase">
              <span className="relative flex h-2 w-2">
                <span className="pulse-dot absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              Live • Professional Intelligence Network
            </div>

            <h1 className="text-balance text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-6 leading-[1.1]">
              Breaking news<br />
              <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">distilled.</span>
            </h1>

            <p className="text-balance text-lg md:text-xl text-foreground/70 mb-10 max-w-3xl leading-relaxed font-light">
              Stay ahead with real-time multi-source news aggregation. Compare narratives, track emerging stories, and make informed decisions faster.
            </p>

            {loading && !articles.length ? (
              <SearchBarSkeleton />
            ) : (
              <SearchBar
                onSearch={handleSearch}
                placeholder="Search stories, topics, sources, keywords..."
              />
            )}

            <div className="flex flex-wrap items-center gap-4 mt-10">
              <Link
                href="/trending"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-sm hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-200 hover:-translate-y-0.5"
              >
                Trending Now
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                onClick={toggleSummaries}
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
                  showSummaries
                    ? 'bg-gradient-to-r from-primary/20 to-accent/20 text-primary border border-primary/40 shadow-lg shadow-primary/10'
                    : 'bg-card/60 border border-border/40 text-foreground/60 hover:text-foreground hover:border-border/60 backdrop-blur-sm'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                {showSummaries ? 'Summaries On' : 'AI Summaries'}
              </button>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 space-y-16">
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {stats.map(({ icon: Icon, label, value, hint }) => (
            <article key={label} className="group rounded-2xl border border-border/40 bg-gradient-to-br from-card/80 to-card/40 p-6 shadow-sm hover:shadow-lg hover:border-primary/20 transition-all duration-300 hover:-translate-y-1 backdrop-blur-sm">
              <div className="flex items-start justify-between mb-4">
                <p className="text-xs uppercase tracking-widest text-foreground/50 font-bold">{label}</p>
                <div className="p-2 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 group-hover:from-primary/20 group-hover:to-accent/20 transition-colors">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
              </div>
              <p className="text-3xl font-black text-foreground mb-2">{value}</p>
              <p className="text-xs text-foreground/60 leading-relaxed font-medium">{hint}</p>
            </article>
          ))}
        </section>

        <section className="grid grid-cols-1 xl:grid-cols-[1.5fr_1fr] gap-6">
          <article className="rounded-2xl border border-border/40 bg-gradient-to-br from-card/80 to-card/40 p-7 backdrop-blur-sm shadow-sm hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-black text-foreground">Lead Story</h2>
                <p className="text-sm text-foreground/60 mt-1">Featured from live network</p>
              </div>
              <Link href="/trending" className="text-sm text-primary font-bold inline-flex items-center gap-2 hover:gap-3 transition-all group">
                See all <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            {loading && !articles.length ? (
              <FeaturedArticlesGridSkeleton count={1} />
            ) : featuredArticle ? (
              <div className="space-y-5">
                <NewsCard article={featuredArticle} />
                {showSummaries && (
                  <div className="rounded-xl border border-border/40 bg-gradient-to-br from-muted/40 to-muted/20 p-5 backdrop-blur-sm">
                    <ArticleSummary article={featuredArticle} />
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-xl bg-muted/30 p-12 text-center text-sm text-foreground/60 border border-border/40">
                No lead story available right now.
              </div>
            )}
          </article>

          <article className="rounded-2xl border border-border/40 bg-gradient-to-br from-card/80 to-card/40 p-7 backdrop-blur-sm shadow-sm hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Live Briefing</h3>
            </div>
            <div className="space-y-3">
              {loading && !articles.length ? (
                <div className="space-y-3">
                  <div className="h-20 rounded-xl bg-muted/30 animate-pulse border border-border/40" />
                  <div className="h-20 rounded-xl bg-muted/30 animate-pulse border border-border/40" />
                  <div className="h-20 rounded-xl bg-muted/30 animate-pulse border border-border/40" />
                </div>
              ) : liveBriefing.length > 0 ? (
                liveBriefing.map((article) => (
                  <Link
                    key={article.id}
                    href={`/article/${encodeURIComponent(article.id)}`}
                    className="block rounded-xl border border-border/40 bg-gradient-to-br from-background/60 to-background/30 p-4 hover:border-primary/30 hover:bg-gradient-to-br hover:from-background/80 hover:to-background/50 transition-all duration-200 group"
                  >
                    <p className="text-xs text-primary font-bold mb-1 uppercase tracking-wider">{article.source}</p>
                    <p className="text-sm font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors">{article.title}</p>
                    <p className="text-xs text-foreground/60 mt-2 line-clamp-1">{article.description}</p>
                  </Link>
                ))
              ) : (
                <p className="text-sm text-foreground/60">No briefing items match current filters.</p>
              )}
            </div>
          </article>
        </section>

        <section className="space-y-8">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <h2 className="text-3xl font-black text-foreground">Explore by Category</h2>
              <p className="text-foreground/60 mt-2 font-medium">Focus coverage by domain</p>
            </div>
            <div className="inline-flex items-center gap-3 text-sm bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl px-4 py-2 border border-border/40">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span className="font-bold text-foreground">{filteredArticles.length.toLocaleString()}</span>
              <span className="text-foreground/60">relevant articles</span>
            </div>
          </div>

          {loading && !articles.length ? (
            <CategoryFilterSkeleton />
          ) : (
            <CategoryFilter selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />
          )}
        </section>

        {error && (
          <section className="rounded-2xl border border-destructive/30 bg-gradient-to-br from-destructive/10 to-destructive/5 p-6 flex items-start gap-4 backdrop-blur-sm">
            <div className="p-3 rounded-lg bg-destructive/20 flex-shrink-0 mt-0.5">
              <AlertCircle className="w-5 h-5 text-destructive" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-destructive">Content refresh issue</p>
              <p className="text-sm text-destructive/80 mt-1">{error}</p>
              <button
                onClick={retry}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-sm font-bold text-destructive hover:text-destructive/80 bg-destructive/10 rounded-lg hover:bg-destructive/20 transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                Retry
              </button>
            </div>
          </section>
        )}

        {loading && articles.length === 0 && (
          <section className="space-y-10">
            <div>
              <h3 className="text-xl font-bold mb-6">Featured Coverage</h3>
              <FeaturedArticlesGridSkeleton count={4} />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-6">Latest Coverage</h3>
              <NewsCardGridSkeleton count={6} />
            </div>
          </section>
        )}

        {!loading && spotlightArticles.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-black text-foreground">Spotlight Stories</h2>
                <p className="text-foreground/60 mt-1 font-medium">Curated coverage from the network</p>
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
            <div className="flex items-center justify-between mb-8 mt-2">
              <div>
                <h2 className="text-3xl font-black text-foreground">Latest Headlines</h2>
                <p className="text-foreground/60 mt-1 font-medium">
                  Showing {filteredArticles.length === 0 ? '0' : startIdx + 1}–{Math.min(endIdx, filteredArticles.length)} of{' '}
                  {filteredArticles.length.toLocaleString()} articles
                </p>
              </div>
            </div>

            {paginatedArticles.length > 0 ? (
              <>
                <div className={showSummaries ? 'space-y-6 mb-12' : 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-12'}>
                  {paginatedArticles.map((article) => (
                    <div
                      key={article.id}
                      className={showSummaries ? 'bg-gradient-to-br from-card/80 to-card/40 border border-border/40 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300' : ''}
                    >
                      <NewsCard article={article} />
                      {showSummaries && (
                        <div className="px-6 pb-6 pt-4 border-t border-border/40 bg-gradient-to-br from-muted/30 to-muted/10">
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
              <div className="text-center py-24 rounded-2xl border border-border/40 bg-gradient-to-br from-card/60 to-card/30 backdrop-blur-sm">
                <div className="w-12 h-12 rounded-xl bg-muted/30 flex items-center justify-center mx-auto mb-4">
                  <Newspaper className="w-6 h-6 text-foreground/40" />
                </div>
                <p className="text-foreground font-bold text-lg">No matching articles found</p>
                <p className="text-foreground/60 text-sm mt-2">Adjust your search terms or category filters.</p>
              </div>
            )}
          </section>
        )}

        {!loading && articles.length === 0 && !error && (
          <section className="text-center py-24 rounded-2xl border border-border/40 bg-gradient-to-br from-card/60 to-card/30 backdrop-blur-sm">
            <div className="w-16 h-16 rounded-2xl bg-muted/30 flex items-center justify-center mx-auto mb-5">
              <Newspaper className="w-8 h-8 text-foreground/40" />
            </div>
            <p className="text-foreground font-bold text-lg">No articles are available right now</p>
            <p className="text-foreground/60 text-sm mt-2">Please check back shortly for the next update cycle.</p>
          </section>
        )}
      </main>

      <NewsletterCTA />

      <footer className="border-t border-border/30 mt-20 bg-gradient-to-b from-background to-background/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <span className="text-white font-black text-sm">IN</span>
              </div>
              <span className="text-sm text-foreground/60 font-medium">© 2026 Informed. All rights reserved.</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-foreground/60 font-medium">
              <span className="hover:text-foreground transition-colors cursor-pointer">Verified aggregation</span>
              <span className="hidden sm:inline text-border/40">•</span>
              <span className="hidden sm:inline hover:text-foreground transition-colors cursor-pointer">Professional grade</span>
            </div>
          </div>
        </div>
      </footer>

      <ChatBotWidget articles={articles} />
    </div>
  );
}
