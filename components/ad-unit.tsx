'use client';

import { useEffect } from 'react';

export function AdUnit() {
  useEffect(() => {
    try {
      // Trigger AdSense rendering inside the window object safely
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch (err) {
      console.error('AdSense initialization error:', err);
    }
  }, []);

  return (
    <div className="w-full flex flex-col items-center my-16 py-8 border-y border-border bg-card/20 animate-fade-in">
      <span className="text-[10px] uppercase tracking-widest text-foreground/40 font-display font-bold mb-3">
        Advertisement
      </span>
      <div className="w-full max-w-5xl flex justify-center overflow-hidden">
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-7901268014546748"
          data-ad-slot="6932775868"
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    </div>
  );
}
