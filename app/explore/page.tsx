'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/header';
import { GlobeSelector } from '@/components/globe-selector';
import { MasonryCard } from '@/components/masonry-card';
import { Article, fetchAllFeeds, DEFAULT_FEEDS } from '@/lib/rss-parser';
import { Loader2, ArrowLeft, Newspaper } from 'lucide-react';

const REGION_KEYWORDS: Record<string, string[]> = {
  'North America': ['usa', 'canada', 'american', 'mexico', 'north america'],
  'Europe': ['europe', 'uk', 'germany', 'france', 'italy', 'spain', 'eu'],
  'Asia Pacific': ['asia', 'china', 'japan', 'korea', 'vietnam', 'thailand', 'pacific'],
  'India': ['india', 'indian', 'delhi', 'mumbai', 'bangalore', 'hyderabad'],
  'Middle East': ['middle east', 'israel', 'palestine', 'saudi', 'uae', 'iran', 'iraq'],
  'South America': ['brazil', 'argentina', 'chile', 'colombia', 'south america'],
  'Africa': ['africa', 'south africa', 'egypt', 'nigeria', 'kenya'],
};

export default function ExplorePage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [contentRevealing, setContentRevealing] = useState(false);

  useEffect(() => {
    const loadArticles = async () => {
      try {
        const data = await fetchAllFeeds(DEFAULT_FEEDS);
        setArticles(data);
      } catch (error) {
        console.error('Error loading articles:', error);
      } finally {
        setLoading(false);
      }
    };

    loadArticles();
  }, []);

  const handleLocationSelect = (region: string) => {
    setSelectedRegion(region);
    setContentRevealing(true);
    setTimeout(() => setContentRevealing(false), 500);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!selectedRegion) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <GlobeSelector articles={articles} onLocationSelect={handleLocationSelect} />
      </div>
    );
  }

  // Filter articles by selected region
  const keywords = REGION_KEYWORDS[selectedRegion] || [];
  const filteredArticles = articles.filter((article) => {
    const searchText = `${article.title} ${article.description}`.toLowerCase();
    return keywords.some((keyword) => searchText.includes(keyword));
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Region Header with Back Button */}
      <div className="relative py-28 md:py-36 px-6 bg-gradient-to-b from-accent/25 via-accent/10 to-background overflow-hidden border-b border-border/30">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/3 w-96 h-96 bg-accent/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <button 
            onClick={() => setSelectedRegion(null)}
            className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors mb-8 font-bold uppercase text-xs tracking-widest group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Globe
          </button>

          <h1 className="text-6xl md:text-7xl lg:text-8xl text-foreground mb-4 font-black">
            {selectedRegion}
          </h1>

          <p className="text-lg md:text-xl text-foreground/70 font-light">
            {filteredArticles.length} breaking stories • Curated from global sources
          </p>
        </div>
      </div>

      {/* Content Reveal Animation */}
      <div className={`max-w-7xl mx-auto px-6 py-16 md:py-20 transition-all duration-700 ${contentRevealing ? 'opacity-0' : 'opacity-100'}`}>
        {filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-max">
            {filteredArticles.slice(0, 12).map((article, idx) => (
              <div
                key={article.id}
                className={idx === 0 ? 'md:col-span-2 md:row-span-2' : ''}
                style={{
                  animation: contentRevealing ? 'none' : `reveal-content 0.6s ease-out ${idx * 50}ms forwards`,
                  opacity: contentRevealing ? 0 : 1,
                }}
              >
                <MasonryCard article={article} featured={idx === 0} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 rounded-2xl border border-border/40 bg-gradient-to-br from-card/60 to-card/30 backdrop-blur-sm">
            <div className="w-12 h-12 rounded-xl bg-muted/30 flex items-center justify-center mx-auto mb-4">
              <Newspaper className="w-6 h-6 text-foreground/40" />
            </div>
            <p className="text-foreground/60 text-lg font-medium">No articles found for this region yet</p>
            <p className="text-foreground/50 text-sm mt-1">Try selecting another region</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-border/30 py-12 px-6 mt-12 bg-gradient-to-b from-background to-background/80">
        <div className="max-w-7xl mx-auto text-center text-foreground/60 text-sm font-medium">
          <p>Explore the world's news through regional perspectives</p>
        </div>
      </footer>

      <style>{`
        @keyframes reveal-content {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
