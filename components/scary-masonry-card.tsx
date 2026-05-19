'use client';

import { Article } from '@/lib/rss-parser';
import Link from 'next/link';
import { AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

interface ScaryMasonryCardProps {
  article: Article;
  featured?: boolean;
  index?: number;
}

export function ScaryMasonryCard({ article, featured = false, index = 0 }: ScaryMasonryCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [hasScared, setHasScared] = useState(false);
  const [glitchActive, setGlitchActive] = useState(false);

  const cardClass = featured 
    ? 'col-span-1 md:col-span-2 row-span-2'
    : 'col-span-1 row-span-1';

  // Random glitch effect on scroll into view
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasScared && Math.random() > 0.6) {
        setGlitchActive(true);
        setHasScared(true);
        
        // Create unsettling glitch effect
        setTimeout(() => setGlitchActive(false), 600);
      }
    }, { threshold: 0.3 });

    const card = document.getElementById(`card-${index}`);
    if (card) observer.observe(card);

    return () => observer.disconnect();
  }, [hasScared, index]);

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
      id={`card-${index}`}
      data-scary-card
    >
      <div
        className={`${cardClass} relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-black h-80 md:h-96 ${featured ? 'md:h-full' : ''} shadow-2xl transition-all duration-500 transform group`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          animation: glitchActive ? 'scary-glitch 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'none',
        }}
      >
        {/* Dark Image Background */}
        <div className="absolute inset-0">
          {article.image && !imageError ? (
            <img 
              src={article.image} 
              alt={article.title}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover transition-all duration-700"
              style={{ 
                transform: isHovered ? 'scale(1.15) saturate(0.7) brightness(0.6)' : 'scale(1) saturate(1) brightness(0.7)',
                filter: isHovered ? 'blur(2px) grayscale(0.8)' : 'blur(0px) grayscale(0.4)',
              }}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 via-slate-900 to-black">
              <div className="text-center">
                <div className="text-6xl mb-3 opacity-40">⚠️</div>
                <p className="text-slate-400 text-sm font-medium">Breaking News</p>
              </div>
            </div>
          )}
        </div>

        {/* Eerie Red Glow Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t from-red-950/95 via-red-900/60 to-transparent transition-all duration-500 ${isHovered ? 'from-red-950/97 via-red-900/80' : 'from-red-950/85'}`} />
        
        {/* Pulsing Red Vignette on Hover */}
        {isHovered && (
          <div className="absolute inset-0 bg-radial-red-glow opacity-60 animate-pulse-scary" />
        )}

        {/* Glitch Effect Overlay */}
        {glitchActive && (
          <>
            <div className="absolute inset-0 bg-red-600/40 mix-blend-screen" style={{ clipPath: 'polygon(0 40%, 100% 0, 100% 60%, 0 100%)' }} />
            <div className="absolute inset-0 bg-cyan-900/30 mix-blend-screen" style={{ clipPath: 'polygon(0 0, 100% 40%, 100% 100%, 0 60%)' }} />
          </>
        )}

        {/* Content Container */}
        <div className="absolute inset-0 flex flex-col justify-between p-6 z-10">
          {/* Top: Warning Badge */}
          <div className="flex items-center gap-2">
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 bg-red-900/80 border border-red-600 text-red-100 font-display text-xs font-bold tracking-widest uppercase rounded backdrop-blur-sm shadow-lg transition-all duration-300 ${isHovered ? 'shadow-red-600/50 glow-red' : ''}`}>
              <AlertCircle className="w-3 h-3 animate-pulse" />
              Breaking
            </div>
          </div>

          {/* Bottom: Title and Meta */}
          <div className="space-y-3">
            {/* Warning Line */}
            <div className="h-px bg-gradient-to-r from-red-600 via-red-500 to-transparent opacity-60" />

            {/* Title - Dramatic */}
            <div className="space-y-2">
              <h3 className={`font-display text-lg md:text-2xl font-bold text-white leading-tight transition-all duration-300 ${isHovered ? 'text-red-100' : 'text-slate-100'}`}>
                {article.title}
              </h3>
              
              {/* Description - Subtle */}
              {article.description && (
                <p className="text-xs md:text-sm text-slate-300 line-clamp-2 opacity-80">
                  {article.description}
                </p>
              )}
            </div>

            {/* Meta Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-red-900/50">
              <span className="text-xs text-slate-400 font-medium">
                {article.source || 'News Alert'}
              </span>
              <span className="text-xs text-red-400 font-display tracking-wider">
                LIVE
              </span>
            </div>
          </div>
        </div>
      </div>
    </a>
  );
}
