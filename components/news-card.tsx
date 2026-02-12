'use client';

import { Article } from '@/lib/rss-parser';
import { ExternalLink, Calendar } from 'lucide-react';
import { useState } from 'react';

interface NewsCardProps {
  article: Article;
}

export function NewsCard({ article }: NewsCardProps) {
  const [imageError, setImageError] = useState(false);

  const formattedDate = new Date(article.pubDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <article className="group h-full flex flex-col bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Image Container */}
      {article.image && !imageError && (
        <div className="relative w-full h-48 overflow-hidden bg-muted">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
            crossOrigin="anonymous"
            loading="lazy"
          />
        </div>
      )}

      {/* Content */}
      <div className="flex-1 flex flex-col p-4 gap-3">
        {/* Source & Date */}
        <div className="flex items-center justify-between gap-2">
          <span className="inline-block px-2 py-1 bg-accent text-accent-foreground text-xs font-medium rounded">
            {article.source}
          </span>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="w-3 h-3" />
            {formattedDate}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-foreground line-clamp-3 group-hover:text-accent transition-colors">
          {article.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2 flex-1">
          {article.description}
        </p>

        {/* Read More Link */}
        <a
          href={article.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 w-fit text-sm font-medium text-accent hover:text-accent/80 transition-colors"
        >
          Read More
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </article>
  );
}
