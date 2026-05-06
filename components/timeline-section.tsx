'use client';

import { Article } from '@/lib/rss-parser';
import Link from 'next/link';
import { useState, useEffect } from 'react';

interface TimelineSectionProps {
  articles: Article[];
}

export function TimelineSection({ articles }: TimelineSectionProps) {
  const [activeCategory, setActiveCategory] = useState('All');

  // Store articles in sessionStorage for article page access
  useEffect(() => {
    if (typeof window !== 'undefined' && articles.length > 0) {
      sessionStorage.setItem('current-articles', JSON.stringify(articles));
    }
  }, [articles]);

  const categories = ['All', ...new Set(articles.map(a => a.category || a.source))];
  
  const filtered = activeCategory === 'All' 
    ? articles.slice(0, 8)
    : articles.filter(a => (a.category || a.source) === activeCategory).slice(0, 8);

  return (
    <section className="py-24 px-6 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-16">
          <h2 className="section-heading text-foreground mb-8">
            Timeline of <span className="text-accent">Stories</span>
          </h2>
          
          {/* Category Filter */}
          <div className="flex flex-wrap gap-3">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2 font-display text-sm tracking-wider uppercase transition-all duration-300 ${
                  activeCategory === cat
                    ? 'bg-foreground text-background'
                    : 'border border-foreground text-foreground hover:bg-foreground/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Timeline Articles - Enhanced */}
        <div className="space-y-6">
          {filtered.map((article, idx) => (
            <Link 
              key={article.id}
              href={`/article/${article.id}?link=${encodeURIComponent(article.link)}`}
              className="group block"
            >
              <div className="flex gap-8 items-start pb-8 relative">
                {/* Timeline Line & Dot - Animated */}
                <div className="flex-shrink-0 flex flex-col items-center">
                  {/* Animated Number */}
                  <span className="font-display text-4xl font-bold bg-gradient-to-r from-accent to-accent/60 bg-clip-text text-transparent group-hover:from-accent group-hover:to-accent transition-all duration-500">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  {/* Connecting Line */}
                  {idx < filtered.length - 1 && (
                    <div className="w-1 h-12 bg-gradient-to-b from-accent/50 to-border mt-4 group-hover:from-accent group-hover:to-accent/30 transition-colors duration-300" />
                  )}
                </div>

                {/* Border Line */}
                <div className="absolute left-16 top-0 bottom-0 w-0.5 bg-gradient-to-b from-border to-border/30" />

                {/* Content - Enhanced */}
                <div className="flex-1 min-w-0 py-2">
                  <div className="flex gap-3 items-start mb-4 flex-wrap">
                    <span className="text-xs font-display tracking-widest uppercase px-3 py-1 bg-accent/20 text-accent group-hover:bg-accent group-hover:text-foreground transition-all duration-300 rounded">
                      {article.category || article.source}
                    </span>
                    <span className="text-xs text-foreground/60 font-medium">
                      {new Date(article.pubDate).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <h3 className="font-display text-xl md:text-2xl text-foreground mb-3 group-hover:text-accent transition-all duration-300 line-clamp-2">
                    {article.title}
                  </h3>
                  
                  <p className="text-foreground/70 text-sm line-clamp-2 group-hover:text-foreground/90 transition-all duration-300">
                    {article.description || 'Discover this story'}
                  </p>
                </div>

                {/* Arrow Icon - Animated */}
                <div className="text-accent/70 group-hover:text-accent group-hover:translate-x-3 group-hover:scale-125 transition-all duration-300 flex-shrink-0 text-xl">
                  →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
