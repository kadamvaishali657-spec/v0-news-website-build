'use client';

import { useEffect } from 'react';

export function InArticleAd() {
  useEffect(() => {
    try {
      // Trigger AdSense fluid in-article rendering safely
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch (err) {
      console.error('In-Article AdSense error:', err);
    }
  }, []);

  return (
    <div className="w-full my-8 py-6 border-y border-border/60 bg-muted/20 rounded-xl overflow-hidden animate-fade-in">
      <span className="text-[9px] uppercase tracking-widest text-foreground/30 font-display font-semibold block text-center mb-3">
        Recommended Sponsor Link
      </span>
      <div className="w-full flex justify-center max-w-4xl mx-auto px-4">
        <ins
          className="adsbygoogle"
          style={{ display: 'block', textAlign: 'center' }}
          data-ad-layout="in-article"
          data-ad-format="fluid"
          data-ad-client="ca-pub-7901268014546748"
          data-ad-slot="8952434549"
        />
      </div>
    </div>
  );
}
