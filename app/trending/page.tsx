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
        <section className="relative overflow-hidden border-b border-border/30">
          <div className="absolute inset-0 mesh-gradient" />
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-orange-500/10 via-transparent to-transparent pointer-events-none rounded-full blur-3xl" />
          <div className="absolute -bottom-20 left-1/3 w-[400px] h-[400px] bg-gradient-to-tr from-red-500/10 to-transparent pointer-events-none rounded-full blur-3xl" />
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 lg:py-32 text-center">
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 shadow-lg shadow-orange-500/30 animate-pulse">
                <Flame className="w-6 h-6 text-white" />
              </div>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight text-foreground mb-5">
              Trending <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">Now</span>
            </h1>
            
            <p className="text-lg md:text-xl text-foreground/70 max-w-2xl mx-auto leading-relaxed font-light">
              The most read, shared, and actively discussed articles across our global publication network.
            </p>
          </div>
        </section>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-full border-3 border-orange-500/20 border-t-orange-500 animate-spin" />
              </div>
              <p className="text-sm text-foreground/60 animate-pulse font-medium">Loading trending stories...</p>
            </div>
          ) : trendingArticles.length === 0 ? (
            <div className="text-center py-32 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border border-border/40 rounded-2xl p-12 max-w-2xl mx-auto shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 rounded-xl bg-muted/30 flex items-center justify-center mx-auto mb-5">
                <TrendingUp className="w-7 h-7 text-foreground/40" />
              </div>
              <p className="text-foreground font-bold text-lg">No Trending Articles Available</p>
              <p className="text-foreground/60 text-sm mt-2">Check back shortly as live publications refresh.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
              {trendingArticles.map((article, index) => (
                <div key={article.id} className="relative group">
                  {/* Ranking Badge */}
                  <div className={`absolute -top-3 -left-3 z-30 w-10 h-10 rounded-lg flex items-center justify-center text-xs font-black shadow-lg transition-transform duration-300 group-hover:scale-110 ${
                    index === 0 ? 'bg-gradient-to-br from-yellow-400 to-amber-500 text-white shadow-amber-500/40' :
                    index === 1 ? 'bg-gradient-to-br from-slate-300 to-slate-400 text-white shadow-slate-400/40' :
                    index === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-600 text-white shadow-orange-500/40' :
                    'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-indigo-500/30'
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
