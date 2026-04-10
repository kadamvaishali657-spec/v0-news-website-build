'use client';

import { Article } from '@/lib/rss-parser';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useState } from 'react';

interface MasonryCardProps {
  article: Article;
  featured?: boolean;
}

export function MasonryCard({ article, featured = false }: MasonryCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const cardClass = featured 
    ? 'col-span-1 md:col-span-2 row-span-2'
    : 'col-span-1 row-span-1';

  return (
    <Link href={`/article/${article.id}`}>
      <div
        className={`${cardClass} article-hover relative overflow-hidden bg-card border border-border h-80 md:h-96 ${featured ? 'md:h-full' : ''}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Article Image/Placeholder */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center">
          {article.image && (
            <img 
              src={article.image} 
              alt={article.title}
              className="w-full h-full object-cover transition-transform duration-700 scale-100 group-hover:scale-110"
            />
          )}
        </div>

        {/* Overlay Gradient */}
        <div className={`overlay-gradient transition-opacity duration-500 ${isHovered ? 'opacity-95' : 'opacity-70'}`} />

        {/* Content Container */}
        <div className="absolute inset-0 flex flex-col justify-between p-6 text-background">
          {/* Category & Source */}
          <div>
            <span className="inline-block text-xs font-display tracking-widest uppercase mb-4 text-accent">
              {article.category || article.source}
            </span>
          </div>

          {/* Article Title & Description */}
          <div className="group/content">
            <h3 className="font-display text-2xl md:text-3xl leading-tight mb-3 transition-colors duration-300">
              {article.title}
            </h3>
            <p className="text-sm text-background/90 line-clamp-2 transition-all duration-300 opacity-0 group-hover/content:opacity-100">
              {article.description || 'Discover this story and more insights'}
            </p>
          </div>

          {/* Footer Info */}
          <div className="flex items-center justify-between">
            <div className="text-xs text-background/80">
              <p>{new Date(article.pubDate).toLocaleDateString()}</p>
              <p className="text-background/70">{article.source}</p>
            </div>
            <ArrowRight className={`w-5 h-5 transition-transform duration-300 ${isHovered ? 'translate-x-2' : ''}`} />
          </div>
        </div>
      </div>
    </Link>
  );
}
