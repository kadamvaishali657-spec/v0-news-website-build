'use client';

import { useState, useEffect } from 'react';
import { GlobeSelector } from '@/components/globe-selector';
import { MasonryCard } from '@/components/masonry-card';
import { Header } from '@/components/header';
import { Article, fetchAllFeeds, DEFAULT_FEEDS } from '@/lib/rss-parser';
import { Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

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
    return <GlobeSelector articles={articles} onLocationSelect={handleLocationSelect} />;
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
      <div className="relative py-24 px-6 bg-gradient-to-b from-accent/20 to-background overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-80 h-80 bg-accent/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <Link href="/explore">
            <button className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors mb-6 font-display uppercase text-sm tracking-wider">
              <ArrowLeft className="w-4 h-4" />
              Back to Globe
            </button>
          </Link>

          <h1 className="font-display text-5xl md:text-7xl text-foreground mb-4 font-bold">
            {selectedRegion}
          </h1>

          <p className="text-lg text-foreground/70 font-light">
            {filteredArticles.length} breaking stories | Curated from global sources
          </p>
        </div>
      </div>

      {/* Content Reveal Animation */}
      <div className={`max-w-7xl mx-auto px-6 py-24 transition-all duration-700 ${contentRevealing ? 'opacity-0' : 'opacity-100'}`}>
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
          <div className="text-center py-20">
            <p className="text-foreground/60 text-lg">No articles found for this region yet. Try another!</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-6 mt-24">
        <div className="max-w-7xl mx-auto text-center text-foreground/60 text-sm">
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
