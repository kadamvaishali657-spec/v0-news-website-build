'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/header';
import { BottomNav } from '@/components/bottom-nav';
import { Article, fetchAllFeeds, DEFAULT_FEEDS } from '@/lib/rss-parser';
import { useArticleAnalytics, logAnalytics } from '@/lib/analytics';
import { ArrowLeft, Bookmark, Share2, ExternalLink, Calendar, Clock } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import Script from 'next/script';

export default function ArticlePage() {
  const params = useParams();
  const articleId = decodeURIComponent(params.id as string);
  
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [userPreferences, setUserPreferences] = useState<any>(null);
  const [feeds] = useState(DEFAULT_FEEDS);

  // Load user preferences
  useEffect(() => {
    const saved = localStorage.getItem('user-preferences');
    if (saved) {
      setUserPreferences(JSON.parse(saved));
    }
  }, []);

  // Fetch article
  useEffect(() => {
    const loadArticle = async () => {
      setLoading(true);
      try {
        const articles = await fetchAllFeeds(feeds);
        const found = articles.find((a) => a.id === articleId);
        
        if (found) {
          setArticle(found);
          
          // Check if saved
          const savedArticles = localStorage.getItem('saved-articles');
          if (savedArticles) {
            const parsed = JSON.parse(savedArticles);
            setIsSaved(parsed.some((a: Article) => a.id === articleId));
          }
        }
      } catch (error) {
        console.error('Error loading article:', error);
      } finally {
        setLoading(false);
      }
    };

    loadArticle();
  }, [articleId, feeds]);

  // Track article view
  useArticleAnalytics(articleId, article?.title || 'Loading...');

  const handleSave = () => {
    try {
      let saved = localStorage.getItem('saved-articles');
      let articles = saved ? JSON.parse(saved) : [];
      
      if (!isSaved && article) {
        articles.push(article);
        setIsSaved(true);
        logAnalytics({
          type: 'article_save',
          data: { articleId, title: article.title },
        });
      } else {
        articles = articles.filter((a: Article) => a.id !== articleId);
        setIsSaved(false);
      }
      
      localStorage.setItem('saved-articles', JSON.stringify(articles));
    } catch (error) {
      console.error('Error saving article:', error);
    }
  };

  const handleShare = (platform: string) => {
    if (!article) return;
    
    const text = `Check out: ${article.title}`;
    const url = typeof window !== 'undefined' ? window.location.href : '';
    
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
    
    if (shareUrl) {
      window.open(shareUrl, '_blank');
      logAnalytics({
        type: 'article_share',
        data: { articleId, platform, title: article.title },
      });
    }
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
      logAnalytics({
        type: 'article_share',
        data: { articleId, platform: 'copy', title: article?.title },
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Header />
        <Loader2 className="w-8 h-8 text-accent animate-spin" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Article not found</h1>
            <Link href="/" className="text-accent hover:text-accent/80 font-medium">
              Return to home
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const formattedDate = new Date(article.pubDate).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const wordCount = (article.title + ' ' + article.description).split(/\s+/).length;
  const readingTime = Math.max(1, Math.round(wordCount / 200));

  // Generate article schema for SEO
  const articleSchema = article ? {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.description,
    image: article.image ? [article.image] : [],
    datePublished: article.pubDate,
    dateModified: article.pubDate,
    author: {
      '@type': 'Organization',
      name: article.source,
    },
    publisher: {
      '@type': 'Organization',
      name: 'JustinNews',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.justinnews.tech/favicon.jpg',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': typeof window !== 'undefined' ? window.location.href : '',
    },
  } : null;

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      {articleSchema && (
        <Script 
          id="article-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
          strategy="afterInteractive"
        />
      )}
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold mb-12 transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to stories
        </Link>

        {/* Article Header */}
        <article className="space-y-10">
          {/* Source & Category */}
          <div className="flex items-center gap-3">
            <span className="px-4 py-2 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 text-xs font-bold rounded-md border border-blue-200">
              {article.source}
            </span>
            {article.category && (
              <span className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-semibold rounded-md">
                {article.category}
              </span>
            )}
          </div>

          {/* Title - Premium Typography */}
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-gray-900 leading-tight text-balance">
            {article.title}
          </h1>

          {/* Article Metadata Bar */}
          <div className="flex flex-wrap items-center gap-6 py-6 border-b border-gray-200">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              <span className="font-medium">{formattedDate}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span className="font-medium">{readingTime} min read</span>
            </div>
            <div className="text-xs text-gray-500 font-medium">
              Last updated: {formattedDate}
            </div>
          </div>

          {/* Article Image */}
          {article.image && (
            <div className="relative w-full h-96 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden shadow-lg">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}

          {/* Description */}
          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-gray-700 leading-8 text-justify font-light">
              {article.description}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 py-8 border-t border-b border-gray-200">
            <button
              onClick={handleSave}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-md font-semibold transition-all duration-300 ${
                isSaved
                  ? 'bg-red-600 text-white shadow-md hover:bg-red-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Bookmark className="w-4 h-4" fill={isSaved ? 'currentColor' : 'none'} />
              {isSaved ? 'Saved' : 'Save Article'}
            </button>

            <div className="relative group">
              <button className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition-colors duration-300 shadow-sm">
                <Share2 className="w-4 h-4" />
                Share
              </button>
              <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2 z-50">
                {userPreferences?.shareSettings?.twitter !== false && (
                  <button
                    onClick={() => handleShare('twitter')}
                    className="w-full px-4 py-2 text-sm text-foreground hover:bg-accent/20 transition-colors text-left"
                  >
                    Share on Twitter
                  </button>
                )}
                {userPreferences?.shareSettings?.linkedin !== false && (
                  <button
                    onClick={() => handleShare('linkedin')}
                    className="w-full px-4 py-2 text-sm text-foreground hover:bg-accent/20 transition-colors text-left"
                  >
                    Share on LinkedIn
                  </button>
                )}
                {userPreferences?.shareSettings?.whatsapp !== false && (
                  <button
                    onClick={() => handleShare('whatsapp')}
                    className="w-full px-4 py-2 text-sm text-foreground hover:bg-accent/20 transition-colors text-left"
                  >
                    Share on WhatsApp
                  </button>
                )}
                <button
                  onClick={handleCopyLink}
                  className="w-full px-4 py-2 text-sm text-foreground hover:bg-accent/20 transition-colors text-left"
                >
                  Copy Link
                </button>
              </div>
            </div>

            <a
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-lg font-medium hover:bg-accent/90 transition-colors"
            >
              Read on Source
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {/* Full Content Note */}
          <div className="bg-accent/10 border border-border rounded-lg p-4">
            <p className="text-sm text-foreground">
              <strong>Note:</strong> The full article content is displayed above. Click "Read on Source" to view the complete article on the original website.
            </p>
          </div>

          {/* Related Articles Placeholder */}
          <div className="mt-12 pt-8 border-t border-border">
            <h2 className="text-2xl font-bold text-foreground mb-6">From the same source</h2>
            <p className="text-muted-foreground">
              Explore more articles from {article.source} on the homepage.
            </p>
            <Link
              href={`/?source=${encodeURIComponent(article.source)}`}
              className="inline-block mt-4 text-accent hover:text-accent/80 font-medium"
            >
              View all from {article.source}
            </Link>
          </div>
        </article>
      </main>

      <BottomNav />
    </div>
  );
}
