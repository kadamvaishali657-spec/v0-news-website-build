'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/header';
import { NewsCard } from '@/components/news-card';
import { Search, Filter } from 'lucide-react';
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
        const articles = await fetchAllFeeds(DEFAULT_FEEDS);
        setArticles(articles);
        // Extract unique sources
        const uniqueSources = [...new Set(articles.map(a => a.source))];
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
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Search className="w-8 h-8 text-accent" />
            <h1 className="text-4xl font-bold text-foreground">Advanced Search</h1>
          </div>

          {/* Search Filters */}
          <div className="bg-card rounded-lg border border-border p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Search Articles</label>
              <input
                type="text"
                placeholder="Search by title, description, or source..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Source</label>
                <select
                  value={selectedSource}
                  onChange={(e) => setSelectedSource(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  <option value="all">All Sources</option>
                  {sources.map(source => (
                    <option key={source} value={source}>{source}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Date Range</label>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Found <span className="font-semibold text-foreground">{filteredArticles.length}</span> articles
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading articles...</p>
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-lg border border-border">
            <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">No articles found</p>
            <p className="text-sm text-muted-foreground">Try adjusting your search filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
