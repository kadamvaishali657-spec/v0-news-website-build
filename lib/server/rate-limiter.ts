/**
 * Simple in-memory rate limiter for API protection.
 * Uses a sliding window counter approach.
 */

interface RateLimitEntry {
  count: number;
  windowStart: number;
}

class RateLimiter {
  private store = new Map<string, RateLimitEntry>();
  private windowMs: number;
  private maxRequests: number;

  constructor(windowMs: number, maxRequests: number) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
  }

  /**
   * Check if a request should be allowed.
   * Returns { allowed, remaining, resetMs }
   */
  check(identifier: string): { allowed: boolean; remaining: number; resetMs: number } {
    const now = Date.now();
    const entry = this.store.get(identifier);

    if (!entry || now - entry.windowStart >= this.windowMs) {
      // New window
      this.store.set(identifier, { count: 1, windowStart: now });
      return {
        allowed: true,
        remaining: this.maxRequests - 1,
        resetMs: this.windowMs,
      };
    }

    if (entry.count >= this.maxRequests) {
      const resetMs = this.windowMs - (now - entry.windowStart);
      return {
        allowed: false,
        remaining: 0,
        resetMs,
      };
    }

    entry.count++;
    return {
      allowed: true,
      remaining: this.maxRequests - entry.count,
      resetMs: this.windowMs - (now - entry.windowStart),
    };
  }

  /**
   * Clean up expired entries.
   */
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      if (now - entry.windowStart >= this.windowMs) {
        this.store.delete(key);
      }
    }
  }
}

// Different rate limiters for different endpoints
export const apiRateLimiter = new RateLimiter(60 * 1000, 60);     // 60 req/min for general API
export const chatRateLimiter = new RateLimiter(60 * 1000, 20);    // 20 req/min for chat
export const searchRateLimiter = new RateLimiter(60 * 1000, 30);  // 30 req/min for search
export const summarizeRateLimiter = new RateLimiter(60 * 1000, 15); // 15 req/min for AI summarization

/**
 * Get rate limit identifier from request (IP-based).
 */
export function getRateLimitId(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  return forwarded?.split(',')[0]?.trim() || realIp || 'unknown';
}

/**
 * Create rate limit headers for the response.
 */
export function rateLimitHeaders(remaining: number, resetMs: number): Record<string, string> {
  return {
    'X-RateLimit-Remaining': remaining.toString(),
    'X-RateLimit-Reset': Math.ceil(resetMs / 1000).toString(),
  };
}

// Run cleanup every 5 minutes
setInterval(() => {
  apiRateLimiter.cleanup();
  chatRateLimiter.cleanup();
  searchRateLimiter.cleanup();
  summarizeRateLimiter.cleanup();
}, 5 * 60 * 1000);
