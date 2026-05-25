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
        <section className="relative overflow-hidden border-b border-border/30">
          <div className="absolute inset-0 mesh-gradient" />
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-indigo-500/10 via-transparent to-transparent pointer-events-none rounded-full blur-3xl" />
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 lg:py-32 text-center">
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30">
                <Bookmark className="w-7 h-7 text-white" />
              </div>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-foreground mb-5">
              Saved <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">Bookmarks</span>
            </h1>
            
            <p className="text-lg md:text-xl text-foreground/70 max-w-2xl mx-auto leading-relaxed font-light">
              Your curated collection of bookmarked articles. Access instantly anytime.
            </p>
          </div>
        </section>
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-full border-3 border-primary/20 border-t-primary animate-spin" />
              </div>
              <p className="text-sm text-foreground/60 animate-pulse font-medium">Loading bookmarks...</p>
            </div>
          ) : savedArticles.length === 0 ? (
            <div className="text-center py-32 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border border-border/40 rounded-2xl p-12 max-w-2xl mx-auto shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 rounded-xl bg-muted/30 flex items-center justify-center mx-auto mb-5">
                <Bookmark className="w-8 h-8 text-foreground/40" />
              </div>
              <p className="text-foreground font-bold text-lg mb-2">No Saved Bookmarks</p>
              <p className="text-sm text-foreground/60 mb-8">Start reading news and tap the bookmark icon to build your collection.</p>
              <a
                href="/"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-sm shadow-lg shadow-indigo-500/20 hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5"
              >
                Browse Latest News
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
              {savedArticles.map((article) => (
                <div key={article.id} className="relative group">
                  <NewsCard article={article} />
                  
                  {/* Delete Button */}
                  <button
                    onClick={() => removeSavedArticle(article.id)}
                    className="absolute top-5 left-5 z-30 p-2.5 rounded-lg bg-destructive/15 border border-destructive/30 text-destructive hover:bg-destructive/25 hover:shadow-lg transition-all duration-200"
                    title="Remove from saved"
                  >
                    <Trash2 className="w-5 h-5" />
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
