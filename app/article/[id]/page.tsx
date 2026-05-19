'use client';

import { useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { Header } from '@/components/header';
import { Loader2 } from 'lucide-react';

export default function ArticlePage() {
  const params = useParams();
  const searchParams = useSearchParams();

  useEffect(() => {
    try {
      // Get link from query parameters (most reliable method)
      const linkFromQuery = searchParams.get('link');
      
      if (linkFromQuery) {
        try {
          const decodedLink = decodeURIComponent(linkFromQuery);
          // Validate URL format
          new URL(decodedLink);
          // Redirect immediately
          window.location.href = decodedLink;
          return;
        } catch (e) {
          console.log('[v0] Invalid link parameter');
        }
      }

      // Try to get from sessionStorage (articles from current session)
      const sessionArticlesData = sessionStorage.getItem('current-articles');
      if (sessionArticlesData) {
        try {
          const sessionArticles = JSON.parse(sessionArticlesData);
          const articleId = params.id as string;
          const article = sessionArticles.find((a: any) => a.id === articleId);
          
          if (article && article.link) {
            new URL(article.link);
            window.location.href = article.link;
            return;
          }
        } catch (e) {
          console.log('[v0] Error parsing session articles');
        }
      }

      // Fallback: redirect to home after 2 seconds
      const timer = setTimeout(() => {
        window.location.href = '/';
      }, 2000);

      return () => clearTimeout(timer);
    } catch (error) {
      console.error('[v0] Error in article page:', error);
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    }
  }, [params, searchParams]);

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
