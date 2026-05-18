'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { NewsCard } from '@/components/news-card';
import { Bookmark, Trash2 } from 'lucide-react';
import { Article } from '@/lib/rss-parser';

export default function SavedArticlesPage() {
  const [savedArticles, setSavedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('saved-articles');
    if (saved) {
      try {
        setSavedArticles(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading saved articles:', e);
      }
    }
    setLoading(false);
  }, []);

  const removeSavedArticle = (articleId: string) => {
    const updated = savedArticles.filter(a => a.id !== articleId);
    setSavedArticles(updated);
    localStorage.setItem('saved-articles', JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      <div>
        <Header />

        {/* Hero Header */}
        <section className="relative overflow-hidden border-b border-border/40">
          <div className="absolute inset-0 mesh-gradient" />
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-radial from-indigo-500/10 via-transparent to-transparent pointer-events-none" />
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20 animate-pulse">
                <Bookmark className="w-7 h-7 text-white" />
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground mb-4">
              Saved <span className="gradient-text">Bookmarks</span>
            </h1>
            
            <p className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Your customized catalog of bookmarked tech articles. Access them instantly, offline, and manage them directly.
            </p>
          </div>
        </section>
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
              </div>
              <p className="text-sm text-muted-foreground animate-pulse">Loading bookmarks...</p>
            </div>
          ) : savedArticles.length === 0 ? (
            <div className="text-center py-20 bg-card/40 backdrop-blur-md border border-border/60 rounded-3xl p-8 max-w-xl mx-auto shadow-xl">
              <Bookmark className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4 animate-pulse" />
              <p className="text-foreground font-semibold mb-2">No Saved Bookmarks</p>
              <p className="text-sm text-muted-foreground mb-6">Start reading tech news and tap the bookmark icon on any card to build your personalized archive.</p>
              <a
                href="/"
                className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold text-xs shadow-md shadow-indigo-500/20 hover:shadow-lg transition-all duration-200"
              >
                Browse Latest News
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
              {savedArticles.map((article) => (
                <div key={article.id} className="relative group">
                  <NewsCard article={article} />
                  
                  {/* Clean Non-Overlapping Delete Button */}
                  <button
                    onClick={() => removeSavedArticle(article.id)}
                    className="absolute top-4 left-4 z-30 p-2.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive hover:bg-destructive/20 hover:shadow-lg transition-all duration-200"
                    title="Remove from saved"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}
