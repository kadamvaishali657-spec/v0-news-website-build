import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const maxDuration = 30;

export async function GET(request: NextRequest) {
  const feedUrl = request.nextUrl.searchParams.get('url');

  if (!feedUrl) {
    return NextResponse.json(
      { error: 'Missing feed URL parameter' },
      { status: 400 }
    );
  }

  // Security Validation: Ensure URL is valid, external, and not an SSRF target
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(decodeURIComponent(feedUrl));
  } catch (e) {
    try {
      parsedUrl = new URL(feedUrl);
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL parameter format' },
        { status: 400 }
      );
    }
  }

  // Enforce HTTP/HTTPS protocols only
  if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
    return NextResponse.json(
      { error: 'Only HTTP and HTTPS protocols are authorized' },
      { status: 403 }
    );
  }

  const hostname = parsedUrl.hostname.toLowerCase();

  // Block local loopbacks and private networks to prevent SSRF
  const isLocalOrPrivate = 
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname === '0.0.0.0' ||
    hostname === '169.254.169.254' || // AWS metadata endpoint
    hostname.startsWith('10.') ||
    hostname.startsWith('192.168.') ||
    !!hostname.match(/^172\.(1[6-9]|2[0-9]|3[0-1])\./); // Private IP Class B

  if (isLocalOrPrivate) {
    return NextResponse.json(
      { error: 'Access to local or private network feeds is unauthorized' },
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
