'use client';

import { Article } from '@/lib/rss-parser';
import { Calendar, Bookmark, Share2, Clock, ArrowUpRight, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

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
  const [copied, setCopied] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  const formattedDate = new Date(article.pubDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  const timeAgo = getTimeAgo(new Date(article.pubDate));

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
    setShowShareMenu(false);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(article.link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    setShowShareMenu(false);
  };

  return (
    <article className="group h-full flex flex-col bg-card rounded-2xl overflow-hidden card-hover gradient-border border border-border/40 shadow-card">
      {/* Image Container */}
      {article.image && !imageError ? (
        <div className="relative w-full h-48 overflow-hidden bg-muted">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
            onError={() => setImageError(true)}
            crossOrigin="anonymous"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          {/* Reading time badge */}
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg glass text-xs font-medium text-foreground/90 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {readingTime} min
          </div>
        </div>
      ) : (
        <div className="relative w-full h-32 bg-gradient-to-br from-primary/5 via-purple-500/5 to-pink-500/5 flex items-center justify-center">
          <div className="text-4xl font-black gradient-text opacity-20">{article.source.charAt(0)}</div>
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-muted/60 text-xs font-medium text-muted-foreground flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {readingTime} min
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 flex flex-col p-5 gap-3">
        {/* Source & Date */}
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center px-2.5 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-lg">
            {article.source}
          </span>
          <span className="text-xs text-muted-foreground/70">{timeAgo}</span>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-card-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors duration-200">
          {article.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2 flex-1 leading-relaxed">
          {article.description}
        </p>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-3 border-t border-border/40 mt-auto">
          <Link
            href={`/article/${encodeURIComponent(article.id)}`}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 font-medium text-sm shadow-sm hover:shadow-md hover:shadow-indigo-500/20"
          >
            Read Article
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={handleSave}
            className={`p-2.5 rounded-xl transition-all duration-200 ${
              isSaved 
                ? 'bg-pink-500/10 text-pink-500 hover:bg-pink-500/20' 
                : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
            title={isSaved ? 'Remove from saved' : 'Save article'}
          >
            <Bookmark className="w-4 h-4" fill={isSaved ? 'currentColor' : 'none'} />
          </button>

          <div className="relative">
            <button 
              onClick={() => setShowShareMenu(!showShareMenu)}
              className="p-2.5 rounded-xl bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200"
            >
              <Share2 className="w-4 h-4" />
            </button>
            {showShareMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowShareMenu(false)} />
                <div className="absolute right-0 bottom-full mb-2 w-44 bg-card border border-border/60 rounded-xl shadow-xl shadow-black/[0.08] py-1.5 z-50 animate-scale-in">
                  <button
                    onClick={() => handleShare('twitter')}
                    className="w-full px-3.5 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-primary/5 transition-colors text-left"
                  >
                    Share on Twitter
                  </button>
                  <button
                    onClick={() => handleShare('linkedin')}
                    className="w-full px-3.5 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-primary/5 transition-colors text-left"
                  >
                    Share on LinkedIn
                  </button>
                  <button
                    onClick={() => handleShare('whatsapp')}
                    className="w-full px-3.5 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-primary/5 transition-colors text-left"
                  >
                    Share on WhatsApp
                  </button>
                  <div className="border-t border-border/40 my-1" />
                  <button
                    onClick={handleCopyLink}
                    className="w-full px-3.5 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-primary/5 transition-colors text-left flex items-center gap-2"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied!' : 'Copy Link'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
