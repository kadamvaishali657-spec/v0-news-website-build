'use client';

import { useEffect } from 'react';

interface AdSenseUnitProps {
  slotId: string;
  format?: 'auto' | 'rectangle' | 'vertical' | 'horizontal' | 'fluid';
  fullWidth?: boolean;
  className?: string;
}

export function AdSenseUnit({ 
  slotId, 
  format = 'auto', 
  fullWidth = false,
  className = ''
}: AdSenseUnitProps) {
  useEffect(() => {
    try {
      // Push AdSense config
      if (typeof window !== 'undefined') {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      }
    } catch (err) {
      console.error('[v0] AdSense error:', err);
    }
  }, [slotId]);

  return (
    <div className={`flex justify-center my-8 ${className}`}>
      <ins
        className="adsbygoogle"
        style={{
          display: fullWidth ? 'block' : 'inline-block',
          textAlign: 'center',
          width: fullWidth ? '100%' : '300px',
          height: format === 'fluid' ? 'auto' : '250px',
        }}
        data-ad-client="ca-pub-7901268014546748"
        data-ad-slot={slotId}
        data-ad-format={format}
        data-full-width-responsive={fullWidth ? 'true' : 'false'}
      />
    </div>
  );
}
