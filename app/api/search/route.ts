/**
 * Full-text search API with fuzzy matching, relevance scoring, and suggestions.
 */

import { NextRequest, NextResponse } from 'next/server';
import { searchArticles } from '@/lib/server/search-engine';
import { searchRateLimiter, getRateLimitId, rateLimitHeaders } from '@/lib/server/rate-limiter';

export const runtime = 'nodejs';
export const maxDuration = 15;

export async function GET(request: NextRequest) {
  // Rate limiting
  const clientId = getRateLimitId(request);
  const rateCheck = searchRateLimiter.check(clientId);
  if (!rateCheck.allowed) {
    return NextResponse.json(
      { error: 'Too many search requests. Please slow down.' },
      { status: 429, headers: rateLimitHeaders(rateCheck.remaining, rateCheck.resetMs) }
    );
  }

  const query = request.nextUrl.searchParams.get('q');
  const category = request.nextUrl.searchParams.get('category') || undefined;
  const source = request.nextUrl.searchParams.get('source') || undefined;
  const sortBy = (request.nextUrl.searchParams.get('sort') || 'relevance') as 'relevance' | 'date' | 'trending';
  const limit = parseInt(request.nextUrl.searchParams.get('limit') || '20');
  const offset = parseInt(request.nextUrl.searchParams.get('offset') || '0');

  if (!query || query.trim().length === 0) {
    return NextResponse.json(
      { error: 'Query parameter "q" is required' },
      { status: 400 }
    );
  }

  if (query.length > 200) {
    return NextResponse.json(
      { error: 'Query is too long (max 200 characters)' },
      { status: 400 }
    );
  }

  try {
    const results = await searchArticles(query.trim(), {
      category,
      source,
      limit: Math.min(limit, 50),
      offset: Math.max(offset, 0),
      sortBy,
    });

    return NextResponse.json(results, {
      headers: {
        ...rateLimitHeaders(rateCheck.remaining, rateCheck.resetMs),
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
      },
    });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Search failed. Please try again.' },
      { status: 500 }
    );
  }
}
