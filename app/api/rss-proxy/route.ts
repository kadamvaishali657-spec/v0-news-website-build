import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

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
  if (!VALID_FEEDS.includes(feedUrl)) {
    return NextResponse.json(
      { error: 'Unauthorized feed URL' },
      { status: 403 }
    );
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const response = await fetch(feedUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'application/rss+xml, application/atom+xml, application/xml, text/xml, */*',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return NextResponse.json(
        { error: `Feed server returned ${response.status}` },
        { status: response.status }
      );
    }

    const text = await response.text();

    return NextResponse.json({
      content: text,
      contentType: response.headers.get('content-type') || 'application/rss+xml',
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[RSS Proxy] Error fetching ${feedUrl}:`, errorMessage);

    return NextResponse.json(
      { error: `Failed to fetch feed: ${errorMessage}` },
      { status: 503 }
    );
  }
}
