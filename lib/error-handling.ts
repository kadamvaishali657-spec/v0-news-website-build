/**
 * Error handling utilities for the news aggregator
 */

export class FeedError extends Error {
  constructor(
    message: string,
    public readonly feedUrl: string,
    public readonly code: string
  ) {
    super(message);
    this.name = 'FeedError';
  }
}

export function handleFeedError(error: unknown, feedUrl: string): FeedError {
  if (error instanceof FeedError) {
    return error;
  }

  let code = 'UNKNOWN_ERROR';
  let message = 'Failed to fetch feed';

  if (error instanceof TypeError) {
    if (error.message.includes('CORS')) {
      code = 'CORS_ERROR';
      message = 'CORS restrictions prevent accessing this feed. Try using a different feed URL or enable CORS.';
    } else if (error.message.includes('network')) {
      code = 'NETWORK_ERROR';
      message = 'Network error while fetching feed';
    } else if (error.message.includes('fetch')) {
      code = 'FETCH_ERROR';
      message = 'Failed to fetch the feed URL';
    }
  } else if (error instanceof Error) {
    if (error.message.includes('XML')) {
      code = 'PARSE_ERROR';
      message = 'Failed to parse RSS XML format';
    } else if (error.message.includes('timeout')) {
      code = 'TIMEOUT_ERROR';
      message = 'Request timeout - feed took too long to respond';
    }
  }

  return new FeedError(message, feedUrl, code);
}

export const PROXY_SERVICES = [
  'https://api.allorigins.win/raw?url=',
  'https://cors-anywhere.herokuapp.com/',
];

export async function fetchWithFallback(
  url: string,
  maxRetries: number = 2
): Promise<Response> {
  const controllers: AbortController[] = [];
  
  try {
    // Try direct fetch first
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    controllers.push(controller);

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/rss+xml, application/atom+xml, application/xml, text/xml',
        },
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  } catch (directError) {
    console.log(`Direct fetch failed for ${url}, trying proxies...`);

    // Try proxies as fallback
    for (const proxyUrl of PROXY_SERVICES) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        controllers.push(controller);

        const proxiedUrl = proxyUrl + encodeURIComponent(url);
        const response = await fetch(proxiedUrl, {
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
        return response;
      } catch (proxyError) {
        console.warn(`Proxy ${proxyUrl} failed:`, proxyError);
      }
    }

    throw directError;
  }
}

export function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  return new Promise(async (resolve, reject) => {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const result = await fn();
        resolve(result);
        return;
      } catch (error) {
        if (attempt === maxRetries) {
          reject(error);
          return;
        }
        const delay = baseDelay * Math.pow(2, attempt);
        console.log(`Retry attempt ${attempt + 1} after ${delay}ms`);
        await new Promise((r) => setTimeout(r, delay));
      }
    }
  });
}
