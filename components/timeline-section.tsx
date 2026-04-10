'use client';

import { Article } from '@/lib/rss-parser';
import Link from 'next/link';
import { useState } from 'react';

interface TimelineSectionProps {
  articles: Article[];
}

export function TimelineSection({ articles }: TimelineSectionProps) {
  const [activeCategory, setActiveCategory] = useState('All');

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

        {/* Timeline Articles */}
        <div className="space-y-8">
          {filtered.map((article, idx) => (
            <Link 
              key={article.id}
              href={`/article/${article.id}`}
              className="group block"
            >
              <div className="flex gap-8 items-start pb-8 border-b border-border hover:border-accent/50 transition-colors duration-300">
                {/* Timeline Number */}
                <div className="flex-shrink-0">
                  <span className="font-display text-3xl text-accent/50 group-hover:text-accent transition-colors duration-300">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex gap-4 items-start mb-3">
                    <span className="text-xs font-display tracking-widest uppercase text-accent flex-shrink-0">
                      {article.category || article.source}
                    </span>
                    <span className="text-xs text-foreground/60 flex-shrink-0">
                      {new Date(article.pubDate).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <h3 className="font-display text-xl md:text-2xl text-foreground mb-2 group-hover:text-accent transition-colors duration-300 line-clamp-2">
                    {article.title}
                  </h3>
                  
                  <p className="text-foreground/70 text-sm line-clamp-2 group-hover:text-foreground/90 transition-colors duration-300">
                    {article.description || 'Read the full story'}
                  </p>
                </div>

                {/* Arrow */}
                <div className="text-accent group-hover:translate-x-2 transition-transform duration-300 flex-shrink-0">
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
