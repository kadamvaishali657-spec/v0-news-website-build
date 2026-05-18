/**
 * Server-side articles API with caching, deduplication, and trending scores.
 * Replaces client-side RSS fetching for dramatically better performance.
 */

import { NextRequest, NextResponse } from 'next/server';
import { aggregateAllFeeds, getTrendingArticles, getBreakingNews } from '@/lib/server/rss-aggregator';
import { apiRateLimiter, getRateLimitId, rateLimitHeaders } from '@/lib/server/rate-limiter';

export const runtime = 'nodejs';
export const maxDuration = 30;

export async function GET(request: NextRequest) {
  // Rate limiting
  const clientId = getRateLimitId(request);
  const rateCheck = apiRateLimiter.check(clientId);
  if (!rateCheck.allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please slow down.' },
      { status: 429, headers: rateLimitHeaders(rateCheck.remaining, rateCheck.resetMs) }
    );
  }

  const mode = request.nextUrl.searchParams.get('mode') || 'all';
  const category = request.nextUrl.searchParams.get('category') || undefined;
  const limit = parseInt(request.nextUrl.searchParams.get('limit') || '0') || undefined;

  try {
    let articles;

    switch (mode) {
      case 'trending':
        articles = await getTrendingArticles(limit || 24);
        break;
      case 'breaking':
        articles = await getBreakingNews(limit || 5);
        break;
      case 'all':
      default:
        articles = await aggregateAllFeeds();
        break;
    }

    // Apply category filter if specified
    if (category && category !== 'All') {
      articles = articles.filter(a => {
        const articleCategory = a.category || a.source || '';
        return articleCategory.toLowerCase().includes(category.toLowerCase()) ||
               category.toLowerCase().includes(articleCategory.toLowerCase());
      });
    }

    // Apply limit if specified for 'all' mode
    if (mode === 'all' && limit) {
      articles = articles.slice(0, limit);
    }

    return NextResponse.json({
      articles,
      total: articles.length,
      mode,
      category: category || 'All',
      cachedAt: new Date().toISOString(),
    }, {
      headers: {
        ...rateLimitHeaders(rateCheck.remaining, rateCheck.resetMs),
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    });
  } catch (error) {
    console.error('Articles API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch articles' },
      { status: 500 }
    );
  }
}
