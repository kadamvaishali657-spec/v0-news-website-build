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

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-accent hover:text-accent/80 font-medium mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to news
        </Link>

        {/* Article Header */}
        <article className="space-y-8">
          {/* Metadata */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <span className="px-3 py-1 bg-accent text-accent-foreground rounded-full font-medium">
                {article.source}
              </span>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                {formattedDate}
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="w-4 h-4" />
                {readingTime} min read
              </div>
              {article.category && (
                <span className="text-muted-foreground text-xs">
                  {article.category}
                </span>
              )}
            </div>
            
            {/* Last Updated Information */}
            <div className="pt-2 border-t border-border">
              <p className="text-xs text-muted-foreground">
                Published: {formattedDate} | Last updated: {formattedDate}
              </p>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground leading-relaxed text-balance">
            {article.title}
          </h1>

          {/* Article Image */}
          {article.image && (
            <div className="relative w-full h-96 bg-muted rounded-lg overflow-hidden">
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
          <div className="prose prose-invert max-w-none">
            <p className="text-lg text-muted-foreground leading-8 text-justify">
              {article.description}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 py-6 border-t border-b border-border">
            <button
              onClick={handleSave}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                isSaved
                  ? 'bg-accent text-accent-foreground'
                  : 'bg-muted text-foreground hover:bg-accent/20'
              }`}
            >
              <Bookmark className="w-4 h-4" fill={isSaved ? 'currentColor' : 'none'} />
              {isSaved ? 'Saved' : 'Save Article'}
            </button>

            <div className="relative group">
              <button className="flex items-center gap-2 px-4 py-2 bg-muted text-foreground rounded-lg font-medium hover:bg-accent/20 transition-colors">
                <Share2 className="w-4 h-4" />
                Share
              </button>
              <div className="absolute left-0 mt-2 w-40 bg-card border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2 z-50">
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
