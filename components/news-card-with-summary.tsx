'use client';

import { Article } from '@/lib/rss-parser';
import { ExternalLink, Calendar, Bookmark, Share2, ArrowUpRight } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { ArticleSummary } from './article-summary';

interface NewsCardWithSummaryProps {
  article: Article;
  showSummary?: boolean;
}

export function NewsCardWithSummary({ article, showSummary = true }: NewsCardWithSummaryProps) {
  const [imageError, setImageError] = useState(false);
  const [isSaved, setIsSaved] = useState(() => {
    if (typeof window === 'undefined') return false;
    const saved = localStorage.getItem('saved-articles');
    return saved ? JSON.parse(saved).some((a: Article) => a.id === article.id) : false;
  });
  const [showDetails, setShowDetails] = useState(false);

  const formattedDate = new Date(article.pubDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

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
  };

  return (
    <article className="group flex flex-col bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Image Container */}
      {article.image && !imageError && (
        <div className="relative w-full h-40 overflow-hidden bg-gray-100">
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
        <div className="flex items-center justify-between gap-2 text-xs">
          <span className="inline-block px-2.5 py-1 bg-blue-100 text-blue-700 font-medium rounded-full">
            {article.source}
          </span>
          <div className="flex items-center gap-1 text-gray-500">
            <Calendar className="w-3 h-3" />
            {formattedDate}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-gray-900 line-clamp-3 group-hover:text-blue-600 transition-colors">
          {article.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-2">
          {article.description?.replace(/<[^>]*>/g, '')}
        </p>

        {/* AI Summary - Expandable */}
        {showSummary && (
          <div className="my-2">
            <ArticleSummary article={article} />
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 pt-3 border-t border-gray-100 mt-auto">
          <Link
            href={`/article/${encodeURIComponent(article.id)}`}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium text-sm"
          >
            Read
            <ArrowUpRight className="w-3 h-3" />
          </Link>

          <button
            onClick={handleSave}
            className={`p-2 rounded-md transition-colors ${
              isSaved 
                ? 'bg-red-100 text-red-600' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            title={isSaved ? 'Remove from saved' : 'Save article'}
          >
            <Bookmark className="w-4 h-4" fill={isSaved ? 'currentColor' : 'none'} />
          </button>

          <div className="relative group/share">
            <button className="p-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
              <Share2 className="w-4 h-4" />
            </button>
            <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 invisible group-hover/share:opacity-100 group-hover/share:visible transition-all duration-200 py-1 z-50">
              <button
                onClick={() => handleShare('twitter')}
                className="w-full px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 transition-colors text-left font-medium"
              >
                Share on Twitter
              </button>
              <button
                onClick={() => handleShare('linkedin')}
                className="w-full px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 transition-colors text-left font-medium"
              >
                Share on LinkedIn
              </button>
              <button
                onClick={() => handleShare('whatsapp')}
                className="w-full px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 transition-colors text-left font-medium"
              >
                Share on WhatsApp
              </button>
              <div className="border-t border-gray-100"></div>
              <button
                onClick={handleCopyLink}
                className="w-full px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 transition-colors text-left font-medium"
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
