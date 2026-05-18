'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { NewsCard } from '@/components/news-card';
import { Search, Filter, ShieldAlert } from 'lucide-react';
import { Article, fetchAllFeeds, DEFAULT_FEEDS } from '@/lib/rss-parser';

export default function SearchPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSource, setSelectedSource] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [loading, setLoading] = useState(true);
  const [sources, setSources] = useState<string[]>([]);

  useEffect(() => {
    const loadArticles = async () => {
      try {
        // Load articles from feeds
        const feedArticles = await fetchAllFeeds(DEFAULT_FEEDS);

        // Also load saved articles
        let allArticles = feedArticles;
        const savedArticles = localStorage.getItem('saved-articles');
        if (savedArticles) {
          try {
            const saved = JSON.parse(savedArticles);
            // Combine and deduplicate
            allArticles = [...feedArticles, ...saved].filter((a, i, arr) =>
              arr.findIndex(article => article.id === a.id) === i
            );
          } catch (e) {
            console.error('Error loading saved articles:', e);
          }
        }

        setArticles(allArticles);
        // Extract unique sources
        const uniqueSources = [...new Set(allArticles.map(a => a.source))];
        setSources(uniqueSources as string[]);
      } catch (error) {
        console.error('Error loading articles:', error);
      } finally {
        setLoading(false);
      }
    };

    loadArticles();
  }, []);

  useEffect(() => {
    let results = articles;

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(
        a => a.title.toLowerCase().includes(query) ||
          a.description.toLowerCase().includes(query) ||
          a.source.toLowerCase().includes(query)
      );
    }

    // Filter by source
    if (selectedSource !== 'all') {
      results = results.filter(a => a.source === selectedSource);
    }

    // Filter by date range
    const now = new Date();
    if (dateRange !== 'all') {
      const days = dateRange === 'today' ? 1 : dateRange === 'week' ? 7 : 30;
      const cutoffDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
      results = results.filter(a => a.pubDate >= cutoffDate);
    }

    setFilteredArticles(results);
  }, [searchQuery, selectedSource, dateRange, articles]);

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      <div>
        <Header />

        {/* Hero Header */}
        <section className="relative overflow-hidden border-b border-border/40">
          <div className="absolute inset-0 mesh-gradient" />
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-radial from-indigo-500/10 via-transparent to-transparent pointer-events-none" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20">
                <Search className="w-7 h-7 text-white" />
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground mb-4">
              Advanced <span className="gradient-text">Search</span>
            </h1>

            <p className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Query our vast real-time index of technology publications. Filter by publisher source, publishing date range, or keywords.
            </p>
          </div>
        </section>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Search Filters Card */}
          <div className="bg-card/40 backdrop-blur-md border border-border/60 rounded-3xl p-6 md:p-8 mb-8 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5 text-primary" />
                  Search Publications
                </label>
                <input
                  type="text"
                  placeholder="Type title, description keywords, or publisher source name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-muted/40 border border-border/80 text-foreground text-sm focus:border-primary focus:bg-background outline-none transition-all duration-200"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Filter by Source</label>
                  <select
                    value={selectedSource}
                    onChange={(e) => setSelectedSource(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-muted/40 border border-border/80 text-foreground text-sm focus:border-primary focus:bg-background outline-none transition-all duration-200"
                  >
                    <option value="all">All Sources</option>
                    {sources.map(source => (
                      <option key={source} value={source}>{source}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Date Limit</label>
                  <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-muted/40 border border-border/80 text-foreground text-sm focus:border-primary focus:bg-background outline-none transition-all duration-200"
                  >
                    <option value="all">All Time</option>
                    <option value="today">Today Only</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Results Indicators */}
          <div className="mb-6">
            <p className="text-xs sm:text-sm text-muted-foreground">
              Discovered <span className="font-semibold text-foreground">{filteredArticles.length}</span> matching index records
            </p>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
              </div>
              <p className="text-sm text-muted-foreground animate-pulse">Scanning news index databases...</p>
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="text-center py-20 bg-card/40 backdrop-blur-md border border-border/60 rounded-3xl p-8 max-w-xl mx-auto shadow-xl">
              <ShieldAlert className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4 animate-pulse" />
              <p className="text-foreground font-semibold mb-2">No Matching Records</p>
              <p className="text-sm text-muted-foreground">Try adjusting your filters or keyword query criteria to scan a wider scope.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
              {filteredArticles.map((article) => (
                <NewsCard key={article.id} article={article} />
              ))}
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}
