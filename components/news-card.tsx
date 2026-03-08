'use client';

import { Article } from '@/lib/rss-parser';
import { ExternalLink, Calendar, Bookmark, Share2, Clock, ArrowUpRight } from 'lucide-react';
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
    <article className="group h-full flex flex-col bg-white border border-gray-100 rounded-lg overflow-hidden hover:shadow-2xl transition-all duration-400 hover:border-blue-400 hover:-translate-y-1">
      {/* Image Container */}
      {article.image && !imageError && (
        <div className="relative w-full h-52 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={() => setImageError(true)}
            crossOrigin="anonymous"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 flex flex-col p-6 gap-4">
        {/* Source Badge */}
        <div className="flex items-start justify-between gap-3">
          <span className="inline-block px-3 py-1.5 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 text-xs font-bold rounded-md border border-blue-200">
            {article.source}
          </span>
          <div className="flex items-center gap-1 text-xs text-gray-500 whitespace-nowrap font-medium">
            <Calendar className="w-3 h-3" />
            <span>{formattedDate}</span>
          </div>
        </div>

        {/* Title - Premium Typography */}
        <h3 className="text-lg font-serif font-bold text-gray-900 line-clamp-3 group-hover:text-blue-600 transition-colors leading-tight">
          {article.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-2 flex-1 leading-relaxed prose-sm">
          {article.description}
        </p>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-5 border-t border-gray-100">
          <Link
            href={`/article/${encodeURIComponent(article.id)}`}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-md hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 font-semibold text-sm shadow-sm hover:shadow-md"
          >
            Read Article
            <ArrowUpRight className="w-4 h-4" />
          </Link>

          <button
            onClick={handleSave}
            className={`p-2.5 rounded-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              isSaved 
                ? 'bg-red-600 text-white shadow-md focus:ring-red-500' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 focus:ring-gray-400'
            }`}
            title={isSaved ? 'Remove from saved' : 'Save article'}
          >
            <Bookmark className="w-4 h-4" fill={isSaved ? 'currentColor' : 'none'} />
          </button>

          <div className="relative group">
            <button className="p-2.5 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2">
              <Share2 className="w-4 h-4" />
            </button>
            <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2 z-50">
              <button
                onClick={() => handleShare('twitter')}
                className="w-full px-4 py-2 text-xs text-gray-700 hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus:bg-blue-50 focus:text-blue-700 transition-colors text-left font-medium"
              >
                Share on Twitter
              </button>
              <button
                onClick={() => handleShare('linkedin')}
                className="w-full px-4 py-2 text-xs text-gray-700 hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus:bg-blue-50 focus:text-blue-700 transition-colors text-left font-medium"
              >
                Share on LinkedIn
              </button>
              <button
                onClick={() => handleShare('whatsapp')}
                className="w-full px-4 py-2 text-xs text-gray-700 hover:bg-green-50 hover:text-green-700 focus:outline-none focus:bg-green-50 focus:text-green-700 transition-colors text-left font-medium"
              >
                Share on WhatsApp
              </button>
              <button
                onClick={handleCopyLink}
                className="w-full px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition-colors text-left font-medium border-t border-gray-100"
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
