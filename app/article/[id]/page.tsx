'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Header } from '@/components/header';
import { Loader2 } from 'lucide-react';

export default function ArticlePage() {
  const params = useParams();
  const [redirecting, setRedirecting] = useState(true);

  useEffect(() => {
    try {
      // Get article ID from params
      const articleId = params.id as string;
      
      // Try to get from saved articles first
      const savedArticlesData = localStorage.getItem('saved-articles');
      let article = null;
      
      if (savedArticlesData) {
        const savedArticles = JSON.parse(savedArticlesData);
        article = savedArticles.find((a: any) => a.id === articleId);
      }

      // If article found and has a link, redirect to it
      if (article && article.link) {
        window.location.href = article.link;
        return;
      }

      // Fallback: redirect to home after 2 seconds
      const timer = setTimeout(() => {
        window.location.href = '/';
      }, 2000);

      return () => clearTimeout(timer);
    } catch (error) {
      console.error('[v0] Error retrieving article:', error);
      // Redirect to home on error
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    }
  }, [params]);

  return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-background/50">
        <div className="text-center">
          <div className="inline-block p-4 bg-accent/10 rounded-full mb-4">
            <Loader2 className="w-10 h-10 text-accent animate-spin" />
          </div>
          <p className="text-foreground font-display text-lg">Opening article...</p>
          <p className="text-foreground/60 text-sm mt-2">Redirecting to source</p>
        </div>
      </div>
    </>
  );
}
