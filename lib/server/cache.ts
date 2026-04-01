/**
 * In-memory cache with TTL support for server-side caching.
 * Used for RSS feeds, search indexes, and computed results.
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
  hits: number;
}

class ServerCache {
  private store = new Map<string, CacheEntry<unknown>>();
  private maxSize: number;

  constructor(maxSize = 500) {
    this.maxSize = maxSize;
  }

  get<T>(key: string): T | null {
    const entry = this.store.get(key);
    if (!entry) return null;

    if (Date.now() - entry.timestamp > entry.ttl) {
      this.store.delete(key);
      return null;
    }

    entry.hits++;
    return entry.data as T;
  }

  set<T>(key: string, data: T, ttlMs: number): void {
    // Evict least-used entries if at capacity
    if (this.store.size >= this.maxSize && !this.store.has(key)) {
      this.evictLeastUsed();
    }

    this.store.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlMs,
      hits: 0,
    });
  }

  has(key: string): boolean {
    const entry = this.store.get(key);
    if (!entry) return false;
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.store.delete(key);
      return false;
    }
    return true;
  }

  delete(key: string): void {
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }

  getStats(): { size: number; maxSize: number; keys: string[] } {
    // Clean expired entries first
    for (const [key, entry] of this.store.entries()) {
      if (Date.now() - entry.timestamp > entry.ttl) {
        this.store.delete(key);
      }
    }
    return {
      size: this.store.size,
      maxSize: this.maxSize,
      keys: Array.from(this.store.keys()),
    };
  }

  private evictLeastUsed(): void {
    let minHits = Infinity;
    let evictKey: string | null = null;

    for (const [key, entry] of this.store.entries()) {
      // Also evict expired entries
      if (Date.now() - entry.timestamp > entry.ttl) {
        this.store.delete(key);
        return;
      }
      if (entry.hits < minHits) {
        minHits = entry.hits;
        evictKey = key;
      }
    }

    if (evictKey) {
      this.store.delete(evictKey);
    }
  }
}

// Singleton caches for different purposes
export const feedCache = new ServerCache(100);
export const articleCache = new ServerCache(200);
export const searchCache = new ServerCache(100);
export const trendingCache = new ServerCache(50);

// Cache TTLs
export const CACHE_TTL = {
  FEED_RAW: 5 * 60 * 1000,        // 5 minutes for raw feed content
  ARTICLES_ALL: 3 * 60 * 1000,     // 3 minutes for aggregated articles
  SEARCH_RESULTS: 2 * 60 * 1000,   // 2 minutes for search results
  TRENDING: 5 * 60 * 1000,         // 5 minutes for trending computation
  BREAKING: 60 * 1000,             // 1 minute for breaking news
  HEALTH: 30 * 1000,               // 30 seconds for health checks
} as const;
