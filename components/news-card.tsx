'use client';

import { Article } from '@/lib/rss-parser';
import { ExternalLink, Calendar, Bookmark, Share2, Clock } from 'lucide-react';
import { useState } from 'react';

interface NewsCardProps {
  article: Article;
}

export function NewsCard({ article }: NewsCardProps) {
  const [imageError, setImageError] = useState(false);
  const [isSaved, setIsSaved] = useState(() => {
    if (typeof window === 'undefined') return false;
    const saved = localStorage.getItem('saved-articles');
    return saved ? JSON.parse(saved).some((a: Article) => a.id === article.id) : false;
  });

  const formattedDate = new Date(article.pubDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  // Estimate reading time (average 200 words per minute)
  const wordCount = (article.title + ' ' + article.description).split(/\s+/).length;
  const readingTime = Math.max(1, Math.round(wordCount / 200));

  const handleSave = () => {
    let saved = localStorage.getItem('saved-articles');
    let articles = saved ? JSON.parse(saved) : [];
    
    if (!isSaved) {
      articles.push(article);
      setIsSaved(true);
    } else {
      articles = articles.filter((a: Article) => a.id !== article.id);
      setIsSaved(false);
    }
    
    localStorage.setItem('saved-articles', JSON.stringify(articles));
  };

  const handleShare = (platform: string) => {
    const text = `Check out: ${article.title}`;
    const url = article.link;
    
    let shareUrl = '';
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
        break;
    }
    
    if (shareUrl) window.open(shareUrl, '_blank');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(article.link);
    alert('Link copied to clipboard!');
  };

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

        {/* Actions */}
        <div className="flex items-center gap-2 pt-2 border-t border-border">
          <a
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center gap-2 px-3 py-2 bg-accent text-accent-foreground rounded hover:bg-accent/90 transition-colors font-medium text-sm"
          >
            Read Article
            <ExternalLink className="w-4 h-4" />
          </a>

          <button
            onClick={handleSave}
            className={`p-2 rounded transition-colors ${
              isSaved 
                ? 'bg-accent text-accent-foreground' 
                : 'bg-muted text-muted-foreground hover:bg-accent/20'
            }`}
            title={isSaved ? 'Remove from saved' : 'Save article'}
          >
            <Bookmark className="w-4 h-4" fill={isSaved ? 'currentColor' : 'none'} />
          </button>

          <div className="relative group">
            <button className="p-2 rounded bg-muted text-muted-foreground hover:bg-accent/20 transition-colors">
              <Share2 className="w-4 h-4" />
            </button>
            <div className="absolute right-0 mt-1 w-32 bg-card border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-1 z-50">
              <button
                onClick={() => handleShare('twitter')}
                className="w-full px-3 py-2 text-xs text-foreground hover:bg-accent/20 transition-colors text-left"
              >
                Share on Twitter
              </button>
              <button
                onClick={() => handleShare('linkedin')}
                className="w-full px-3 py-2 text-xs text-foreground hover:bg-accent/20 transition-colors text-left"
              >
                Share on LinkedIn
              </button>
              <button
                onClick={() => handleShare('whatsapp')}
                className="w-full px-3 py-2 text-xs text-foreground hover:bg-accent/20 transition-colors text-left"
              >
                Share on WhatsApp
              </button>
              <button
                onClick={handleCopyLink}
                className="w-full px-3 py-2 text-xs text-foreground hover:bg-accent/20 transition-colors text-left"
              >
                Copy Link
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
