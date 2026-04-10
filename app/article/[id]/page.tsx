'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';

export default function ArticlePage() {
  const params = useParams();

  useEffect(() => {
    // Redirect to home since article links go directly to external sources
    window.location.href = '/';
  }, [params]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-background/50">
      <div className="text-center">
        <div className="inline-block p-4 bg-accent/10 rounded-full mb-4">
          <div className="text-4xl">🔄</div>
        </div>
        <p className="text-foreground font-display text-lg">Redirecting...</p>
      </div>
    </div>
  );
}
