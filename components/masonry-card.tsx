'use client';

import { Article } from '@/lib/rss-parser';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';

interface MasonryCardProps {
  article: Article;
  featured?: boolean;
}

export function MasonryCard({ article, featured = false }: MasonryCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  const cardClass = featured 
    ? 'col-span-1 md:col-span-2 row-span-2'
    : 'col-span-1 row-span-1';

  return (
    <Link href={`/article/${article.id}`}>
      <div
        className={`${cardClass} article-hover relative overflow-hidden bg-gradient-to-br from-card to-card/50 border border-border h-80 md:h-96 ${featured ? 'md:h-full' : ''}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Article Image/Placeholder Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent/30 via-accent/10 to-transparent">
          {article.image && !imageError ? (
            <img 
              src={article.image} 
              alt={article.title}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover transition-transform duration-700 ease-out hover:scale-110"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-foreground/5 to-foreground/10">
              <div className="text-center">
                <div className="text-6xl mb-2">📰</div>
                <p className="text-foreground/40 text-sm">Featured Story</p>
              </div>
            </div>
          )}
        </div>

        {/* Overlay Gradient - Enhanced */}
        <div className={`overlay-gradient transition-all duration-500 ${isHovered ? 'opacity-90' : 'opacity-75'}`} />

        {/* Content Container */}
        <div className="absolute inset-0 flex flex-col justify-between p-6 text-background z-10">
          {/* Category & Source - Animated */}
          <div className="transform transition-all duration-500" style={{ opacity: isHovered ? 1 : 0.8 }}>
            <span className="inline-block text-xs font-display tracking-widest uppercase mb-4 px-3 py-1 bg-accent/90 text-foreground rounded transition-all duration-300">
              {article.category || article.source}
            </span>
          </div>

          {/* Article Title & Description - Enhanced */}
          <div className="group/content">
            <h3 className={`font-display text-2xl md:text-3xl leading-tight mb-3 transition-all duration-500 ${isHovered ? 'text-white' : 'text-background'}`}>
              {article.title}
            </h3>
            <p className={`text-sm transition-all duration-500 line-clamp-3 ${isHovered ? 'opacity-100 text-background/95' : 'opacity-0 text-background/90'}`}>
              {article.description || 'Read the full story'}
            </p>
          </div>

          {/* Footer Info - Floating Effects */}
          <div className="flex items-center justify-between">
            <div className="text-xs text-background/90">
              <p className="font-medium">{new Date(article.pubDate).toLocaleDateString()}</p>
              <p className="text-background/75 text-xs">{article.source}</p>
            </div>
            <ArrowRight className={`w-5 h-5 text-accent transition-all duration-300 ${isHovered ? 'translate-x-2 scale-125' : 'translate-x-0'}`} />
          </div>
        </div>
      </div>
    </Link>
  );
}
