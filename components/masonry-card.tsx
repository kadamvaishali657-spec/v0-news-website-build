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
    <a 
      href={article.link || `#`}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => {
        if (!article.link) {
          e.preventDefault();
          window.location.href = '/';
        }
      }}
    >
      <div
        className={`${cardClass} article-hover relative overflow-hidden bg-gradient-to-br from-card to-card/50 border border-border/60 h-80 md:h-96 ${featured ? 'md:h-full' : ''} shadow-lg hover:shadow-3xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 group`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Article Image/Placeholder Background */}
        <div className="absolute inset-0">
          {article.image && !imageError ? (
            <img 
              src={article.image} 
              alt={article.title}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover transition-transform duration-700 ease-out"
              style={{ transform: isHovered ? 'scale(1.1)' : 'scale(1)' }}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-accent/40 via-accent/20 to-foreground/10">
              <div className="text-center">
                <div className="text-6xl mb-3 opacity-60">📰</div>
                <p className="text-foreground/50 text-sm font-medium">News Story</p>
              </div>
            </div>
          )}
        </div>

        {/* Dark Overlay Gradient - Premium Layered */}
        <div className={`absolute inset-0 bg-gradient-to-t from-foreground/97 via-foreground/75 to-transparent transition-all duration-500 ${isHovered ? 'opacity-100 via-foreground/80' : 'opacity-80'}`} />
        
        {/* Accent glow on hover */}
        {isHovered && (
          <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-transparent opacity-50 transition-opacity duration-500" />
        )}

        {/* Content Container */}
        <div className="absolute inset-0 flex flex-col justify-between p-5 md:p-6 z-10">
          {/* Category & Source Badge - Premium */}
          <div className="transform transition-all duration-300" style={{ transform: isHovered ? 'translateY(-4px)' : 'translateY(0)' }}>
            <span className="inline-block text-xs font-display tracking-widest uppercase px-4 py-1.5 bg-gradient-to-r from-accent to-accent/80 text-foreground font-bold rounded-full shadow-lg shadow-accent/50 group-hover:shadow-2xl group-hover:shadow-accent/70 transition-all duration-300">
              {article.category || article.source}
            </span>
          </div>

          {/* Article Title & Description - Improved spacing */}
          <div className="flex-1 flex flex-col justify-end">
            <h3 className="font-display text-xl md:text-2xl lg:text-3xl leading-tight mb-3 text-white font-bold line-clamp-3">
              {article.title}
            </h3>
            <p className={`text-xs md:text-sm font-light text-background/90 line-clamp-2 transition-all duration-300 ${isHovered ? 'opacity-100 line-clamp-3' : 'opacity-75'}`}>
              {article.description || 'Click to read the full story'}
            </p>
          </div>

          {/* Footer Info */}
          <div className="flex items-center justify-between pt-3 border-t border-background/20">
            <div className="text-xs text-background/85 font-medium">
              <p>{new Date(article.pubDate).toLocaleDateString()}</p>
              <p className="text-background/70 text-[10px]">{article.source}</p>
            </div>
            <ArrowRight className={`w-5 h-5 text-accent transition-all duration-300 ${isHovered ? 'translate-x-2' : 'translate-x-0'}`} />
          </div>
        </div>
      </div>
    </a>
  );
}
