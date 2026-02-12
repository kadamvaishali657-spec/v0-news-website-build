import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const maxDuration = 30;

const VALID_FEEDS = [
  'https://feeds.feedburner.com/TechCrunch/',
  'https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml',
  'https://www.theverge.com/rss/index.xml',
  'https://timesofindia.indiatimes.com/rssfeeds/-2128936835.cms',
  'https://news.google.com/rss?hl=en-IN&gl=IN&ceid=IN:en',
];

export async function GET(request: NextRequest) {
  const feedUrl = request.nextUrl.searchParams.get('url');

  if (!feedUrl) {
    return NextResponse.json(
      { error: 'Missing feed URL parameter' },
      { status: 400 }
    );
  }

  // Security: Only allow configured feeds
  if (!VALID_FEEDS.includes(decodeURIComponent(feedUrl))) {
    return NextResponse.json(
      { error: 'Unauthorized feed URL' },
      { status: 403 }
    );
  }

  try {
    console.log(`[RSS Proxy] Fetching: ${feedUrl}`);
    
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
      console.warn(`[RSS Proxy] Feed returned ${response.status} for ${feedUrl}`);
      return NextResponse.json(
        { error: `Feed server returned ${response.status}` },
        { status: response.status }
      );
    }

    const contentType = response.headers.get('content-type') || 'application/rss+xml';
    const text = await response.text();

    if (!text || text.length === 0) {
      console.warn(`[RSS Proxy] Empty content from ${feedUrl}`);
      return NextResponse.json(
        { error: 'Feed returned empty content' },
        { status: 204 }
      );
    }

    console.log(`[RSS Proxy] Successfully fetched ${text.length} bytes from ${feedUrl}`);

    return NextResponse.json({
      content: text,
      contentType,
      url: feedUrl,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[RSS Proxy] Error fetching ${feedUrl}: ${errorMessage}`);

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
