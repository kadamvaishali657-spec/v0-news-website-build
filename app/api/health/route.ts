/**
 * Health check & stats endpoint for monitoring.
 * Returns system status, cache stats, feed health, and uptime.
 */

import { NextResponse } from 'next/server';
import { feedCache, articleCache, searchCache, trendingCache } from '@/lib/server/cache';
import { FEED_CONFIGS } from '@/lib/server/rss-aggregator';

const startTime = Date.now();

export const runtime = 'nodejs';

export async function GET() {
  const uptime = Date.now() - startTime;
  const uptimeSeconds = Math.floor(uptime / 1000);
  const uptimeMinutes = Math.floor(uptimeSeconds / 60);
  const uptimeHours = Math.floor(uptimeMinutes / 60);

  const feedCacheStats = feedCache.getStats();
  const articleCacheStats = articleCache.getStats();
  const searchCacheStats = searchCache.getStats();
  const trendingCacheStats = trendingCache.getStats();

  const memUsage = process.memoryUsage();

  return NextResponse.json({
    status: 'healthy',
    version: '2.0.0',
    uptime: {
      ms: uptime,
      human: `${uptimeHours}h ${uptimeMinutes % 60}m ${uptimeSeconds % 60}s`,
    },
    feeds: {
      configured: FEED_CONFIGS.length,
      cached: feedCacheStats.size,
      categories: [...new Set(FEED_CONFIGS.map(f => f.category).filter(Boolean))],
    },
    cache: {
      feeds: feedCacheStats,
      articles: articleCacheStats,
      search: searchCacheStats,
      trending: trendingCacheStats,
    },
    memory: {
      heapUsedMB: Math.round(memUsage.heapUsed / 1024 / 1024 * 100) / 100,
      heapTotalMB: Math.round(memUsage.heapTotal / 1024 / 1024 * 100) / 100,
      rssMB: Math.round(memUsage.rss / 1024 / 1024 * 100) / 100,
    },
    environment: {
      nodeVersion: process.version,
      groqApiConfigured: !!process.env.GROQ_API_KEY,
    },
    timestamp: new Date().toISOString(),
  }, {
    headers: {
      'Cache-Control': 'no-cache',
    },
  });
}
