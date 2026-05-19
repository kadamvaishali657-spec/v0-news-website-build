import { NextRequest, NextResponse } from 'next/server';
import { isValidFeedUrl } from '@/lib/server/rss-aggregator';
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

  const feedUrl = request.nextUrl.searchParams.get('url');

  if (!feedUrl) {
    return NextResponse.json(
      { error: 'Missing feed URL parameter' },
      { status: 400 }
    );
  }

  // Security: Only allow configured feeds
  if (!isValidFeedUrl(feedUrl)) {
    return NextResponse.json(
      { error: 'Unauthorized feed URL' },
      { status: 403 }
    );
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000);

    const response = await fetch(feedUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0 Safari/537.36',
        'Accept': 'application/rss+xml, application/atom+xml, application/xml, text/xml, */*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return NextResponse.json(
        { error: `Feed server returned ${response.status}` },
        { status: response.status }
      );
    }

    const contentType = response.headers.get('content-type') || 'application/rss+xml';
    const text = await response.text();

    if (!text || text.length === 0) {
      return NextResponse.json(
        { error: 'Feed returned empty content' },
        { status: 204 }
      );
    }

    return NextResponse.json({
      content: text,
      contentType,
      url: feedUrl,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    // Return appropriate error based on type
    if (errorMessage.includes('abort')) {
      return NextResponse.json(
        { error: 'Feed request timed out' },
        { status: 504 }
      );
    }

    return NextResponse.json(
      { error: `Failed to fetch feed: ${errorMessage}` },
      { status: 503 }
    );
  }
}
