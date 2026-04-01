'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/header';
import { NewsCard } from '@/components/news-card';
import { Flame, TrendingUp } from 'lucide-react';
import { Article } from '@/lib/rss-parser';

export default function TrendingPage() {
  const [trendingArticles, setTrendingArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTrending = async () => {
      try {
        const response = await fetch('/api/articles?mode=trending&limit=24');
        if (response.ok) {
          const data = await response.json();
          const trending: Article[] = (data.articles || []).map((a: Record<string, unknown>) => ({
            id: a.id as string,
            title: a.title as string,
            description: a.description as string,
            link: a.link as string,
            pubDate: new Date(a.pubDate as string),
            image: a.image as string | undefined,
            source: a.source as string,
            category: a.category as string | undefined,
          }));
          setTrendingArticles(trending);
        }
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
      
      {/* Hero Banner */}
      <section className="relative overflow-hidden border-b border-border/40">
        <div className="absolute inset-0 mesh-gradient" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="flex items-center gap-4 mb-3">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 shadow-lg shadow-orange-500/20">
              <Flame className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">Trending Now</h1>
              <p className="text-muted-foreground mt-1">The hottest stories across all categories</p>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-full border-2 border-orange-500/20 border-t-orange-500 animate-spin" />
            </div>
            <p className="text-sm text-muted-foreground animate-pulse">Loading trending articles...</p>
          </div>
        ) : trendingArticles.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-muted/60 flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-muted-foreground/50" />
            </div>
            <p className="text-foreground font-medium mb-1">No trending articles available</p>
            <p className="text-muted-foreground text-sm">Check back later for the latest trends.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
            {trendingArticles.map((article, index) => (
              <div key={article.id} className="relative">
                {/* Ranking Badge */}
                <div className={`absolute -top-2.5 -left-2.5 z-10 w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shadow-lg ${
                  index === 0 ? 'bg-gradient-to-br from-yellow-400 to-amber-500 text-white shadow-amber-500/30' :
                  index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-white shadow-gray-400/30' :
                  index === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-600 text-white shadow-orange-500/30' :
                  'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-indigo-500/20'
                }`}>
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
