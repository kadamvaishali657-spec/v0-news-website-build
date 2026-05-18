/**
 * Server-side RSS aggregation engine.
 * Fetches, parses, deduplicates, and caches articles from all configured feeds.
 */

import { feedCache, articleCache, CACHE_TTL } from './cache';

export interface ServerArticle {
  id: string;
  title: string;
  description: string;
  link: string;
  pubDate: string; // ISO string for JSON serialization
  image?: string;
  source: string;
  category?: string;
  // Enhanced fields
  readingTimeMinutes: number;
  wordCount: number;
  trendingScore: number;
  breakingScore: number;
  duplicateGroupId?: string;
}

export interface FeedConfig {
  url: string;
  title: string;
  category?: string;
  priority: number; // 1-10, higher = more authoritative
}

export const FEED_CONFIGS: FeedConfig[] = [
  // Global News (highest priority)
  { url: 'https://feeds.bbci.co.uk/news/world/rss.xml', title: 'BBC World News', category: 'Global News', priority: 9 },
  { url: 'https://www.aljazeera.com/xml/rss/all.xml', title: 'Al Jazeera English', category: 'Global News', priority: 8 },
  { url: 'https://feeds.bloomberg.com/markets/news.rss', title: 'Bloomberg News', category: 'Global News', priority: 9 },
  { url: 'https://feeds.reuters.com/news/artsculture', title: 'Reuters News', category: 'Global News', priority: 9 },
  { url: 'https://timesofindia.indiatimes.com/rssfeeds/-2128936835.cms', title: 'Times of India', category: 'Global News', priority: 7 },
  { url: 'https://news.google.com/rss?hl=en-IN&gl=IN&ceid=IN:en', title: 'Google News India', category: 'Global News', priority: 7 },

  // Tech & Innovation
  { url: 'http://feeds.feedburner.com/TechCrunch/', title: 'TechCrunch', category: 'Tech & Innovation', priority: 8 },
  { url: 'https://www.theverge.com/rss/index.xml', title: 'The Verge', category: 'Tech & Innovation', priority: 8 },
  { url: 'https://www.wired.com/feed/rss', title: 'Wired', category: 'Tech & Innovation', priority: 7 },
  { url: 'https://news.ycombinator.com/rss', title: 'Hacker News', category: 'Tech & Innovation', priority: 6 },
  { url: 'https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml', title: 'NY Times Technology', category: 'Tech & Innovation', priority: 9 },

  // Business & Finance
  { url: 'https://feeds.bloomberg.com/technology/news.rss', title: 'Bloomberg Tech', category: 'Business & Finance', priority: 9 },
  { url: 'https://www.forbes.com/feed/', title: 'Forbes', category: 'Business & Finance', priority: 8 },
  { url: 'https://feeds.ft.com/home/rss', title: 'Financial Times', category: 'Business & Finance', priority: 9 },

  // Sports
  { url: 'https://www.espn.com/espn/rss/news', title: 'ESPN Top Headlines', category: 'Sports', priority: 8 },
  { url: 'https://feeds.bbci.co.uk/sport/rss.xml', title: 'BBC Sport', category: 'Sports', priority: 8 },

  // Entertainment & Culture
  { url: 'https://www.rollingstone.com/feed/', title: 'Rolling Stone', category: 'Entertainment & Culture', priority: 7 },
  { url: 'https://variety.com/feed/', title: 'Variety', category: 'Entertainment & Culture', priority: 7 },

  // Learning & Education
  { url: 'https://feeds.feedburner.com/tedtalks_video', title: 'TED Talks', category: 'Learning & Education', priority: 7 },
  { url: 'https://www.khanacademy.org/about/blog/rss.xml', title: 'Khan Academy Blog', category: 'Learning & Education', priority: 6 },

  // Social Media Digest
  { url: 'https://www.reddit.com/r/worldnews/.rss', title: 'Reddit r/worldnews', category: 'Social Media Digest', priority: 5 },

  // Random Interesting
  { url: 'https://www.boredpanda.com/feed/', title: 'Bored Panda', category: 'Random Interesting', priority: 4 },
  { url: 'https://www.mentalfloss.com/rss.xml', title: 'Mental Floss', category: 'Random Interesting', priority: 4 },
];

const VALID_FEED_URLS = FEED_CONFIGS.map(f => f.url);

/**
 * Fetch a single RSS feed with timeout and error handling.
 */
async function fetchSingleFeed(feedConfig: FeedConfig): Promise<ServerArticle[]> {
  const cacheKey = `feed:${feedConfig.url}`;
  const cached = feedCache.get<ServerArticle[]>(cacheKey);
  if (cached) return cached;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const response = await fetch(feedConfig.url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0 Safari/537.36',
        'Accept': 'application/rss+xml, application/atom+xml, application/xml, text/xml, */*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache',
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) return [];

    const text = await response.text();
    if (!text || text.length === 0) return [];

    const articles = parseRSSXML(text, feedConfig);
    feedCache.set(cacheKey, articles, CACHE_TTL.FEED_RAW);
    return articles;
  } catch {
    return [];
  }
}

/**
 * Parse RSS XML into ServerArticle objects. Server-side XML parsing using regex
 * since DOMParser is not available in Node.js.
 */
function parseRSSXML(xml: string, feedConfig: FeedConfig): ServerArticle[] {
  const articles: ServerArticle[] = [];

  // Extract <item> blocks
  const itemRegex = /<item[\s>]([\s\S]*?)<\/item>/gi;
  let match;
  let index = 0;

  while ((match = itemRegex.exec(xml)) !== null && index < 50) {
    try {
      const itemXml = match[1];

      const title = extractTag(itemXml, 'title');
      const link = extractTag(itemXml, 'link');
      const description = extractTag(itemXml, 'description');
      const pubDateStr = extractTag(itemXml, 'pubDate');

      if (!title || !link) continue;

      // Extract image from various sources
      let image: string | undefined;
      const mediaUrl = itemXml.match(/url=["']([^"']+\.(jpg|jpeg|png|gif|webp)[^"']*)/i);
      if (mediaUrl) image = mediaUrl[1];

      if (!image) {
        const imgMatch = (description || '').match(/<img[^>]+src=["']([^"']+)["']/i);
        if (imgMatch) image = imgMatch[1];
      }

      if (!image) {
        const enclosureMatch = itemXml.match(/<enclosure[^>]+url=["']([^"']+)["']/i);
        if (enclosureMatch && /\.(jpg|jpeg|png|gif|webp)/i.test(enclosureMatch[1])) {
          image = enclosureMatch[1];
        }
      }

      const cleanTitle = cleanHTML(title).substring(0, 200);
      const cleanDesc = cleanHTML(description || '').substring(0, 500);
      const wordCount = (cleanDesc || cleanTitle).split(/\s+/).length;
      const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

      const pubDate = pubDateStr ? new Date(pubDateStr) : new Date();
      const validPubDate = isNaN(pubDate.getTime()) ? new Date() : pubDate;

      articles.push({
        id: `${feedConfig.title}-${index}-${validPubDate.getTime()}`,
        title: cleanTitle,
        description: cleanDesc,
        link: link.trim(),
        pubDate: validPubDate.toISOString(),
        image: image && image.trim().length > 0 ? image.trim() : undefined,
        source: feedConfig.title,
        category: feedConfig.category,
        readingTimeMinutes,
        wordCount,
        trendingScore: 0,
        breakingScore: 0,
      });

      index++;
    } catch {
      // Skip malformed items
    }
  }

  return articles;
}

/**
 * Extract text content from an XML tag.
 */
function extractTag(xml: string, tag: string): string | null {
  // Try CDATA first
  const cdataRegex = new RegExp(`<${tag}[^>]*>\\s*<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>\\s*</${tag}>`, 'i');
  const cdataMatch = xml.match(cdataRegex);
  if (cdataMatch) return cdataMatch[1].trim();

  // Try regular content
  const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, 'i');
  const match = xml.match(regex);
  if (match) return match[1].trim();

  return null;
}

/**
 * Clean HTML tags and decode entities from text.
 */
function cleanHTML(text: string): string {
  return text
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Normalize text for comparison (deduplication).
 */
function normalizeForComparison(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Compute similarity between two strings using trigram matching.
 */
function computeSimilarity(a: string, b: string): number {
  const aNorm = normalizeForComparison(a);
  const bNorm = normalizeForComparison(b);

  if (aNorm === bNorm) return 1.0;
  if (aNorm.length < 3 || bNorm.length < 3) return 0;

  const trigramsA = new Set<string>();
  for (let i = 0; i <= aNorm.length - 3; i++) {
    trigramsA.add(aNorm.substring(i, i + 3));
  }

  const trigramsB = new Set<string>();
  for (let i = 0; i <= bNorm.length - 3; i++) {
    trigramsB.add(bNorm.substring(i, i + 3));
  }

  let intersection = 0;
  for (const t of trigramsA) {
    if (trigramsB.has(t)) intersection++;
  }

  const union = trigramsA.size + trigramsB.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

/**
 * Deduplicate articles by detecting similar titles across sources.
 * Groups similar articles and keeps the one from the highest-priority source.
 */
function deduplicateArticles(articles: ServerArticle[]): ServerArticle[] {
  const groups: ServerArticle[][] = [];
  const assigned = new Set<number>();

  for (let i = 0; i < articles.length; i++) {
    if (assigned.has(i)) continue;

    const group: ServerArticle[] = [articles[i]];
    assigned.add(i);

    for (let j = i + 1; j < articles.length; j++) {
      if (assigned.has(j)) continue;

      const similarity = computeSimilarity(articles[i].title, articles[j].title);
      if (similarity > 0.5) {
        group.push(articles[j]);
        assigned.add(j);
      }
    }

    groups.push(group);
  }

  // For each group, pick the article from the highest-priority source
  // and boost its breaking score if it appeared in multiple sources
  return groups.map(group => {
    const feedPriorityMap = new Map(FEED_CONFIGS.map(f => [f.title, f.priority]));

    group.sort((a, b) => {
      const aPriority = feedPriorityMap.get(a.source) || 5;
      const bPriority = feedPriorityMap.get(b.source) || 5;
      return bPriority - aPriority;
    });

    const best = { ...group[0] };
    if (group.length > 1) {
      best.duplicateGroupId = `dup-${group.map(a => a.source).join('-')}`;
      // Multiple sources = potentially breaking
      best.breakingScore = group.length;
    }
    return best;
  });
}

/**
 * Compute trending score for an article.
 * Factors: recency, source authority, title engagement, breaking signals
 */
function computeTrendingScore(article: ServerArticle): number {
  const now = Date.now();
  const pubTime = new Date(article.pubDate).getTime();
  const ageHours = (now - pubTime) / (1000 * 60 * 60);

  // Recency score (exponential decay, max 40 points)
  const recencyScore = Math.max(0, 40 * Math.exp(-ageHours / 12));

  // Source authority (max 20 points)
  const feedConfig = FEED_CONFIGS.find(f => f.title === article.source);
  const authorityScore = (feedConfig?.priority || 5) * 2;

  // Title engagement (max 15 points)
  const titleLength = article.title.length;
  const hasNumbers = /\d/.test(article.title);
  const hasQuestion = article.title.includes('?');
  const engagementScore =
    (titleLength > 40 && titleLength < 120 ? 5 : 0) +
    (hasNumbers ? 3 : 0) +
    (hasQuestion ? 2 : 0) +
    (article.wordCount > 50 ? 5 : 0);

  // Breaking news boost (max 25 points)
  const breakingBoost = Math.min(25, article.breakingScore * 8);

  return recencyScore + authorityScore + engagementScore + breakingBoost;
}

/**
 * Fetch all feeds, deduplicate, score, and return sorted articles.
 * Results are cached for performance.
 */
export async function aggregateAllFeeds(): Promise<ServerArticle[]> {
  const cacheKey = 'all-articles-aggregated';
  const cached = articleCache.get<ServerArticle[]>(cacheKey);
  if (cached) return cached;

  // Fetch all feeds concurrently with a concurrency limit
  const batchSize = 5;
  const allArticles: ServerArticle[] = [];

  for (let i = 0; i < FEED_CONFIGS.length; i += batchSize) {
    const batch = FEED_CONFIGS.slice(i, i + batchSize);
    const results = await Promise.allSettled(
      batch.map(config => fetchSingleFeed(config))
    );

    for (const result of results) {
      if (result.status === 'fulfilled') {
        allArticles.push(...result.value);
      }
    }
  }

  // Deduplicate
  const deduplicated = deduplicateArticles(allArticles);

  // Compute trending scores
  const scored = deduplicated.map(article => ({
    ...article,
    trendingScore: computeTrendingScore(article),
  }));

  // Sort: India news first, then by publication date
  const indiaNewsSources = ['Times of India', 'Google News India'];
  const indiaArticles = scored
    .filter(a => indiaNewsSources.includes(a.source))
    .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
  const otherArticles = scored
    .filter(a => !indiaNewsSources.includes(a.source))
    .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

  const result = [...indiaArticles, ...otherArticles];
  articleCache.set(cacheKey, result, CACHE_TTL.ARTICLES_ALL);
  return result;
}

/**
 * Get trending articles sorted by trending score.
 */
export async function getTrendingArticles(limit = 24): Promise<ServerArticle[]> {
  const cacheKey = `trending-${limit}`;
  const cached = articleCache.get<ServerArticle[]>(cacheKey);
  if (cached) return cached;

  const allArticles = await aggregateAllFeeds();

  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const trending = allArticles
    .filter(a => new Date(a.pubDate).getTime() >= sevenDaysAgo)
    .sort((a, b) => b.trendingScore - a.trendingScore)
    .slice(0, limit);

  articleCache.set(cacheKey, trending, CACHE_TTL.TRENDING);
  return trending;
}

/**
 * Detect breaking news: stories that appear across multiple sources
 * within a short time window.
 */
export async function getBreakingNews(limit = 5): Promise<ServerArticle[]> {
  const cacheKey = `breaking-${limit}`;
  const cached = articleCache.get<ServerArticle[]>(cacheKey);
  if (cached) return cached;

  const allArticles = await aggregateAllFeeds();

  const twoHoursAgo = Date.now() - 2 * 60 * 60 * 1000;
  const breaking = allArticles
    .filter(a =>
      a.breakingScore >= 2 &&
      new Date(a.pubDate).getTime() >= twoHoursAgo
    )
    .sort((a, b) => b.breakingScore - a.breakingScore)
    .slice(0, limit);

  articleCache.set(cacheKey, breaking, CACHE_TTL.BREAKING);
  return breaking;
}

/**
 * Check if a feed URL is in the allowed list.
 */
export function isValidFeedUrl(url: string): boolean {
  return VALID_FEED_URLS.includes(decodeURIComponent(url));
}
