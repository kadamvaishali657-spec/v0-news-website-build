'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/header';
import { NewsCard } from '@/components/news-card';
import { Flame } from 'lucide-react';
import { Article, fetchAllFeeds, DEFAULT_FEEDS } from '@/lib/rss-parser';

export default function TrendingPage() {
  const [trendingArticles, setTrendingArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTrending = async () => {
      try {
        const articles = await fetchAllFeeds(DEFAULT_FEEDS);
        // Sort by publication date to show most recent as trending
        const trending = articles
          .sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime())
          .slice(0, 24); // Show top 24 trending articles
        setTrendingArticles(trending);
      } catch (error) {
        console.error('Error loading trending articles:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTrending();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Flame className="w-8 h-8 text-accent" />
            <h1 className="text-4xl font-bold text-foreground">Trending Now</h1>
          </div>
          <p className="text-muted-foreground">The hottest news stories right now</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading trending articles...</p>
          </div>
        ) : trendingArticles.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-lg border border-border">
            <p className="text-muted-foreground">No trending articles available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingArticles.map((article, index) => (
              <div key={article.id} className="relative">
                <div className="absolute -top-3 -left-3 bg-accent text-accent-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
                <NewsCard article={article} />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
