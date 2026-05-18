'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/header';
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
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Bookmark className="w-8 h-8 text-accent" />
            <h1 className="text-4xl font-bold text-foreground">Saved Articles</h1>
          </div>
          <p className="text-muted-foreground">Your collection of bookmarked news articles</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        ) : savedArticles.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-lg border border-border">
            <Bookmark className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground mb-2">No saved articles yet</p>
            <p className="text-sm text-muted-foreground">Start bookmarking articles to save them for later</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedArticles.map((article) => (
              <div key={article.id} className="relative">
                <NewsCard article={article} />
                <button
                  onClick={() => removeSavedArticle(article.id)}
                  className="absolute top-4 right-4 p-2 rounded-lg bg-destructive/20 text-destructive hover:bg-destructive/30 transition-colors"
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
  );
}
