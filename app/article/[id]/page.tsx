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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background via-background/80 to-background/60 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative text-center max-w-md">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-accent/20 to-accent/10 rounded-2xl mb-6 border border-accent/20">
            <Loader2 className="w-8 h-8 text-accent animate-spin" />
          </div>
          <p className="text-foreground font-black text-xl">Opening article</p>
          <p className="text-foreground/60 text-sm mt-3 font-medium">Redirecting to source publication...</p>
          <div className="mt-6 flex items-center justify-center gap-1">
            <div className="w-2 h-2 rounded-full bg-accent/60 animate-pulse" style={{ animationDelay: '0s' }} />
            <div className="w-2 h-2 rounded-full bg-accent/60 animate-pulse" style={{ animationDelay: '0.3s' }} />
            <div className="w-2 h-2 rounded-full bg-accent/60 animate-pulse" style={{ animationDelay: '0.6s' }} />
          </div>
        </div>
      </div>
    </>
  );
}
