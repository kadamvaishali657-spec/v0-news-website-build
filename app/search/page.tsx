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
            const saved = JSON.parse(savedArticles).map((a: any) => ({
              ...a,
              pubDate: new Date(a.pubDate)
            }));
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
        <section className="relative overflow-hidden border-b border-border/30">
          <div className="absolute inset-0 mesh-gradient" />
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-indigo-500/10 via-transparent to-transparent pointer-events-none rounded-full blur-3xl" />
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 lg:py-32 text-center">
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30">
                <Search className="w-7 h-7 text-white" />
              </div>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-foreground mb-5">
              Advanced <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">Search</span>
            </h1>
            
            <p className="text-lg md:text-xl text-foreground/70 max-w-2xl mx-auto leading-relaxed font-light">
              Query our real-time index by keywords, source, or date range.
            </p>
          </div>
        </section>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          {/* Search Filters Card */}
          <div className="bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border border-border/40 rounded-2xl p-8 md:p-10 mb-12 shadow-sm hover:shadow-lg transition-shadow duration-300 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
            
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-xs font-bold text-foreground/70 uppercase tracking-widest flex items-center gap-2">
                  <Search className="w-4 h-4 text-primary" />
                  Search Articles
                </label>
                <input
                  type="text"
                  placeholder="Search by title, keywords, or publisher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-5 py-4 rounded-lg bg-gradient-to-br from-background/60 to-background/40 border border-border/40 text-foreground text-base placeholder-foreground/40 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:bg-background outline-none transition-all duration-200 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-xs font-bold text-foreground/70 uppercase tracking-widest flex items-center gap-2">
                    <Filter className="w-4 h-4 text-primary" />
                    Filter by Source
                  </label>
                  <select
                    value={selectedSource}
                    onChange={(e) => setSelectedSource(e.target.value)}
                    className="w-full px-5 py-4 rounded-lg bg-gradient-to-br from-background/60 to-background/40 border border-border/40 text-foreground text-base focus:border-primary focus:ring-2 focus:ring-primary/20 focus:bg-background outline-none transition-all duration-200 font-medium"
                  >
                    <option value="all">All Sources</option>
                    {sources.map(source => (
                      <option key={source} value={source}>{source}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-bold text-foreground/70 uppercase tracking-widest flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-primary" />
                    Date Range
                  </label>
                  <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="w-full px-5 py-4 rounded-lg bg-gradient-to-br from-background/60 to-background/40 border border-border/40 text-foreground text-base focus:border-primary focus:ring-2 focus:ring-primary/20 focus:bg-background outline-none transition-all duration-200 font-medium"
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
          <div className="mb-8">
            <p className="text-sm text-foreground/70 font-bold uppercase tracking-wider">
              Results: <span className="text-foreground font-black">{filteredArticles.length}</span> articles found
            </p>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-full border-3 border-primary/20 border-t-primary animate-spin" />
              </div>
              <p className="text-sm text-foreground/60 animate-pulse font-medium">Searching articles...</p>
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="text-center py-32 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border border-border/40 rounded-2xl p-12 max-w-2xl mx-auto shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 rounded-xl bg-muted/30 flex items-center justify-center mx-auto mb-5">
                <ShieldAlert className="w-8 h-8 text-foreground/40" />
              </div>
              <p className="text-foreground font-bold text-lg mb-2">No Results Found</p>
              <p className="text-sm text-foreground/60">Try adjusting your search terms or filters.</p>
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
