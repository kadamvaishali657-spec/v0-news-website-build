'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { ArticleSummary } from '@/components/article-summary';
import { InArticleAd } from '@/components/in-article-ad';
import { ChatBotWidget } from '@/components/chatbot-widget';
import { Article, fetchAllFeeds, DEFAULT_FEEDS } from '@/lib/rss-parser';
import { ArrowLeft, ExternalLink, Calendar, Clock, Bookmark, Share2 } from 'lucide-react';
import Link from 'next/link';

export default function ArticlePage() {
  const params = useParams();
  const router = useRouter();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const locateArticle = async () => {
      const articleId = params.id as string;
      
      // 1. Try to find in sessionStorage first
      const sessionArticlesData = sessionStorage.getItem('current-articles');
      if (sessionArticlesData) {
        try {
          const sessionArticles = JSON.parse(sessionArticlesData);
          const matched = sessionArticles.find((a: Article) => a.id === articleId);
          if (matched) {
            setArticle(matched);
            checkIfSaved(matched.id);
            setLoading(false);
            return;
          }
        } catch (e) {
          console.warn('Error reading from sessionStorage:', e);
        }
      }

      // 2. Fallback: Fetch directly from RSS feeds
      try {
        const feedArticles = await fetchAllFeeds(DEFAULT_FEEDS);
        const matched = feedArticles.find((a: Article) => a.id === articleId);
        if (matched) {
          setArticle(matched);
          checkIfSaved(matched.id);
        }
      } catch (error) {
        console.error('Error fetching fallback article:', error);
      } finally {
        setLoading(false);
      }
    };

    locateArticle();
  }, [params.id]);

  const checkIfSaved = (id: string) => {
    const saved = localStorage.getItem('saved-articles');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setIsSaved(parsed.some((a: Article) => a.id === id));
      } catch (e) {
        console.error('Error checking saved state:', e);
      }
    }
  };

  const handleSave = () => {
    if (!article) return;
    const saved = localStorage.getItem('saved-articles');
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-between">
        <Header />
        <div className="flex flex-col items-center justify-center flex-1 gap-4 py-24">
          <div className="w-12 h-12 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
          <p className="text-sm text-muted-foreground animate-pulse font-display">Scanning publication index...</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-between">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center py-24 text-center px-4">
          <h2 className="text-2xl font-bold text-foreground font-display mb-2">Article Not Found</h2>
          <p className="text-muted-foreground mb-6">The article record could not be located in our current index feeds.</p>
          <Link href="/">
            <button className="flex items-center gap-2 px-6 py-3 bg-foreground text-background font-display font-bold uppercase text-xs hover:opacity-85 transition-opacity">
              <ArrowLeft className="w-4 h-4" /> Return to Home
            </button>
          </Link>
        </div>
      </div>
    );
  }

  // Format publication date
  const formattedDate = new Date(article.pubDate).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  // Calculate estimated reading time
  const wordCount = (article.title + ' ' + article.description).split(/\s+/).length;
  const readingTime = Math.max(1, Math.round(wordCount / 200));

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto px-6 py-12 w-full">
        {/* Navigation bar */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 font-display font-semibold group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to feed
        </button>

        {/* Article Metadata */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <span className="px-3 py-1 bg-accent text-accent-foreground text-xs font-bold font-display uppercase tracking-wider rounded">
            {article.source}
          </span>
          {article.category && (
            <span className="px-3 py-1 bg-muted text-muted-foreground text-xs font-bold font-display uppercase tracking-wider rounded">
              {article.category}
            </span>
          )}
          <span className="text-xs text-muted-foreground flex items-center gap-1 font-display">
            <Clock className="w-3.5 h-3.5" /> {readingTime} min read
          </span>
        </div>

        {/* Article Title */}
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight text-foreground font-display mb-6">
          {article.title}
        </h1>

        {/* Date, Author, Actions bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-y border-border mb-10 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>Published {formattedDate}</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleSave}
              className={`flex items-center gap-1.5 hover:text-foreground transition-colors font-display font-semibold ${isSaved ? 'text-accent hover:text-accent/80' : ''}`}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
              {isSaved ? 'Bookmarked' : 'Save'}
            </button>
            <a
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-foreground transition-colors font-display font-semibold"
            >
              <Share2 className="w-4 h-4" /> Share
            </a>
          </div>
        </div>

        {/* Immersive Hero Image */}
        {article.image && (
          <div className="w-full h-[300px] md:h-[480px] overflow-hidden rounded-2xl mb-10 shadow-xl bg-muted border border-border">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-full object-cover"
              crossOrigin="anonymous"
            />
          </div>
        )}

        {/* In-App AI Summary Widget */}
        <div className="mb-10">
          <ArticleSummary article={article} />
        </div>

        {/* Article content block */}
        <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
          {/* First paragraph / snippet of article */}
          <p className="text-xl text-foreground/90 font-serif leading-relaxed mb-8">
            {article.description.split('. ').slice(0, 2).join('. ') + '.'}
          </p>

          {/* New Fluid In-Article Ad Unit */}
          <InArticleAd />

          {/* Remaining description */}
          <p className="text-lg text-foreground/80 font-serif leading-relaxed">
            {article.description.split('. ').slice(2).join('. ')}
          </p>
        </div>

        {/* Read Original Article CTA */}
        <div className="bg-card border border-border rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md mb-16 animate-fade-in">
          <div>
            <h3 className="font-bold text-foreground font-display text-lg mb-1">Continue Reading Full Coverage</h3>
            <p className="text-sm text-muted-foreground">This article was sourced from the global RSS feed of {article.source}.</p>
          </div>
          <a
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 bg-foreground text-background font-display font-bold uppercase text-xs tracking-wider shadow-lg hover:opacity-85 transition-opacity"
          >
            Read Full Coverage at {article.source} <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </main>

      {/* Floating ChatBot Context Widget */}
      <ChatBotWidget articles={[article]} />

      {/* Standard Footer */}
      <footer className="bg-card border-t border-border py-16 px-6">
        <div className="max-w-7xl mx-auto text-center text-foreground/60 text-sm">
          <p>&copy; 2026 INFORMED - Reimagined news experience</p>
          <p className="mt-2">Sourced from global RSS feeds • Powered by AI insights</p>
        </div>
      </footer>
    </div>
  );
}
