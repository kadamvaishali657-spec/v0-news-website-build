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
    <article className="group h-full flex flex-col bg-card/40 backdrop-blur-md rounded-2xl overflow-hidden card-hover border border-white/10 dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:shadow-[0_8px_30px_rgba(99,102,241,0.25)] transition-all duration-500 relative transform hover:-translate-y-2">
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/5 to-transparent pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Image Container */}
      {article.image && !imageError ? (
        <div className="relative w-full h-56 overflow-hidden bg-muted rounded-t-2xl">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
            onError={() => setImageError(true)}
            crossOrigin="anonymous"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500" />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-background to-transparent pointer-events-none" />
          
          {/* Reading time badge */}
          <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md text-xs font-medium text-white/90 flex items-center gap-1.5 border border-white/10 shadow-lg">
            <Clock className="w-3 h-3" />
            {readingTime} min
          </div>
        </div>
      ) : (
        <div className="relative w-full h-40 bg-gradient-to-br from-primary/10 via-purple-500/10 to-pink-500/10 flex items-center justify-center rounded-t-2xl overflow-hidden border-b border-white/5">
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:20px_20px]" />
          <div className="text-6xl font-black bg-clip-text text-transparent bg-gradient-to-br from-indigo-500/30 to-purple-500/30 group-hover:scale-110 transition-transform duration-700">{article.source.charAt(0)}</div>
          <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-background/50 backdrop-blur-md text-xs font-medium text-foreground/80 flex items-center gap-1.5 border border-border/50 shadow-sm">
            <Clock className="w-3 h-3" />
            {readingTime} min
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 flex flex-col px-6 pb-6 pt-4 gap-4 relative z-20">
        {/* Source & Date */}
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-primary/20 to-purple-500/20 text-primary text-[11px] uppercase tracking-wider font-bold rounded-full border border-primary/20">
            {article.source}
          </span>
          <span className="text-xs font-medium text-muted-foreground/80 flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {timeAgo}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-[1.15rem] font-bold text-foreground line-clamp-3 leading-1.4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-400 group-hover:to-purple-400 transition-all duration-300 tracking-tight">
          {article.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-muted-foreground/95 line-clamp-3 flex-1 leading-1.5 opacity-85">
          {article.description}
        </p>

        {/* Actions */}
<div className="flex items-center gap-3 pt-4 border-t border-border/30 mt-auto">
          <Link
            href={`/article/${encodeURIComponent(article.id)}`}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-foreground text-background dark:bg-white dark:text-black rounded-xl hover:bg-primary hover:text-white dark:hover:bg-primary transition-all duration-300 font-semibold text-sm shadow-md hover:shadow-primary/30 group/btn overflow-hidden relative"
          >
            <span className="relative z-10 flex items-center gap-2">
              Read Article
              <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
            </span>
          </Link>

          <button
            onClick={handleSave}
            className={`p-2.5 rounded-xl transition-all duration-300 border ${
              isSaved 
                ? 'bg-pink-500/10 text-pink-500 border-pink-500/20 hover:bg-pink-500/20 hover:shadow-[0_0_15px_rgba(236,72,153,0.3)]' 
                : 'bg-card text-muted-foreground border-border/40 hover:border-foreground/20 hover:text-foreground hover:bg-muted/50'
            }`}
            title={isSaved ? 'Remove from saved' : 'Save article'}
          >
            <Bookmark className="w-4 h-4" fill={isSaved ? 'currentColor' : 'none'} />
          </button>

          <div className="relative">
            <button 
              onClick={() => setShowShareMenu(!showShareMenu)}
              className="p-2.5 rounded-xl bg-card text-muted-foreground border border-border/40 hover:border-foreground/20 hover:text-foreground hover:bg-muted/50 transition-all duration-300"
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
