'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
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
    <div className="min-h-screen bg-background flex flex-col justify-between">
      <div>
        <Header />
        
        {/* Hero Header */}
        <section className="relative overflow-hidden border-b border-border/40">
          <div className="absolute inset-0 mesh-gradient" />
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-radial from-indigo-500/10 via-transparent to-transparent pointer-events-none" />
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 shadow-lg shadow-orange-500/20 animate-pulse">
                <Flame className="w-7 h-7 text-white" />
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground mb-4">
              Trending <span className="gradient-text">Now</span>
            </h1>
            
            <p className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
              The most read, shared, and highly active news articles parsed across our publication network.
            </p>
          </div>
        </section>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-full border-2 border-orange-500/20 border-t-orange-500 animate-spin" />
              </div>
              <p className="text-sm text-muted-foreground animate-pulse">Loading trending articles...</p>
            </div>
          ) : trendingArticles.length === 0 ? (
            <div className="text-center py-20 bg-card/40 backdrop-blur-md border border-border/60 rounded-3xl p-8 max-w-xl mx-auto shadow-xl">
              <TrendingUp className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4 animate-pulse" />
              <p className="text-foreground font-semibold mb-2">No Trending Articles Available</p>
              <p className="text-sm text-muted-foreground">Check back shortly as live publications refresh.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
              {trendingArticles.map((article, index) => (
                <div key={article.id} className="relative group">
                  {/* Ranking Badge */}
                  <div className={`absolute -top-2.5 -left-2.5 z-30 w-8 h-8 rounded-xl flex items-center justify-center text-xs font-extrabold shadow-lg transition-transform duration-300 group-hover:scale-110 ${
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

      <Footer />
    </div>
  );
}
