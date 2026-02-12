'use client';

import { useEffect } from 'react';

export function AutoRefreshScript() {
  useEffect(() => {
    // Auto-refresh articles every 15 minutes
    const interval = setInterval(() => {
      // Trigger a window update to reload fresh data
      window.dispatchEvent(new Event('refresh-feeds'));
    }, 15 * 60 * 1000); // 15 minutes

    return () => clearInterval(interval);
  }, []);

  return null;
}
