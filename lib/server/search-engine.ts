/**
 * Full-text search engine with fuzzy matching and relevance scoring.
 * Operates on the server-side article cache.
 */

import { ServerArticle, aggregateAllFeeds } from './rss-aggregator';
import { searchCache, CACHE_TTL } from './cache';

export interface SearchResult {
  article: ServerArticle;
  relevanceScore: number;
  matchedFields: string[];
  highlights: { field: string; snippet: string }[];
}

export interface SearchResponse {
  results: SearchResult[];
  totalResults: number;
  query: string;
  took: number; // milliseconds
  suggestions: string[];
}

/**
 * Tokenize and normalize a query string.
 */
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 1);
}

/**
 * Create a highlight snippet around a matched term.
 */
function createHighlight(text: string, query: string, maxLength = 150): string {
  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const idx = lowerText.indexOf(lowerQuery);

  if (idx === -1) return text.substring(0, maxLength) + (text.length > maxLength ? '...' : '');

  const start = Math.max(0, idx - 40);
  const end = Math.min(text.length, idx + query.length + 60);
  let snippet = text.substring(start, end);

  if (start > 0) snippet = '...' + snippet;
  if (end < text.length) snippet = snippet + '...';

  return snippet;
}

/**
 * Compute relevance score for an article against a query.
 */
function scoreArticle(article: ServerArticle, queryTokens: string[], rawQuery: string): { score: number; matchedFields: string[]; highlights: { field: string; snippet: string }[] } {
  let score = 0;
  const matchedFields: string[] = [];
  const highlights: { field: string; snippet: string }[] = [];

  const titleLower = article.title.toLowerCase();
  const descLower = article.description.toLowerCase();
  const sourceLower = article.source.toLowerCase();
  const categoryLower = (article.category || '').toLowerCase();
  const queryLower = rawQuery.toLowerCase();

  // Exact phrase match (highest weight)
  if (titleLower.includes(queryLower)) {
    score += 50;
    matchedFields.push('title');
    highlights.push({ field: 'title', snippet: createHighlight(article.title, rawQuery) });
  }
  if (descLower.includes(queryLower)) {
    score += 25;
    matchedFields.push('description');
    highlights.push({ field: 'description', snippet: createHighlight(article.description, rawQuery) });
  }

  // Token-level matching
  for (const token of queryTokens) {
    if (titleLower.includes(token)) {
      score += 15;
      if (!matchedFields.includes('title')) {
        matchedFields.push('title');
        highlights.push({ field: 'title', snippet: createHighlight(article.title, token) });
      }
    }
    if (descLower.includes(token)) {
      score += 8;
      if (!matchedFields.includes('description')) {
        matchedFields.push('description');
        highlights.push({ field: 'description', snippet: createHighlight(article.description, token) });
      }
    }
    if (sourceLower.includes(token)) {
      score += 5;
      if (!matchedFields.includes('source')) matchedFields.push('source');
    }
    if (categoryLower.includes(token)) {
      score += 5;
      if (!matchedFields.includes('category')) matchedFields.push('category');
    }
  }

  // Fuzzy matching for each token (edit distance <=2)
  if (score === 0) {
    const titleWords = tokenize(article.title);
    for (const token of queryTokens) {
      for (const word of titleWords) {
        if (fuzzyMatch(token, word)) {
          score += 8;
          if (!matchedFields.includes('title_fuzzy')) matchedFields.push('title_fuzzy');
          break;
        }
      }
    }
  }

  // Recency boost (newer articles rank higher for equal relevance)
  const ageHours = (Date.now() - new Date(article.pubDate).getTime()) / (1000 * 60 * 60);
  const recencyBoost = Math.max(0, 5 * Math.exp(-ageHours / 48));
  score += recencyBoost;

  // Source authority boost
  score += (article.trendingScore > 30 ? 3 : 0);

  return { score, matchedFields, highlights };
}

/**
 * Simple fuzzy match using Levenshtein distance.
 * Returns true if edit distance <= 2 for short words, <= 3 for longer words.
 */
function fuzzyMatch(a: string, b: string): boolean {
  if (Math.abs(a.length - b.length) > 3) return false;

  const maxDist = a.length <= 4 ? 1 : 2;
  const distance = levenshteinDistance(a, b);
  return distance <= maxDist;
}

function levenshteinDistance(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }

  return dp[m][n];
}

/**
 * Generate search suggestions based on available article data.
 */
function generateSuggestions(articles: ServerArticle[], queryTokens: string[]): string[] {
  const suggestions = new Set<string>();

  // Collect top categories and sources
  const categories = new Set<string>();
  const sources = new Set<string>();

  for (const article of articles.slice(0, 100)) {
    if (article.category) categories.add(article.category);
    sources.add(article.source);
  }

  // Suggest categories that partially match
  for (const token of queryTokens) {
    for (const cat of categories) {
      if (cat.toLowerCase().includes(token)) {
        suggestions.add(cat);
      }
    }
    for (const src of sources) {
      if (src.toLowerCase().includes(token)) {
        suggestions.add(src);
      }
    }
  }

  return Array.from(suggestions).slice(0, 5);
}

/**
 * Main search function.
 */
export async function searchArticles(
  query: string,
  options: {
    category?: string;
    source?: string;
    limit?: number;
    offset?: number;
    sortBy?: 'relevance' | 'date' | 'trending';
  } = {}
): Promise<SearchResponse> {
  const startTime = Date.now();
  const { category, source, limit = 20, offset = 0, sortBy = 'relevance' } = options;

  // Check cache
  const cacheKey = `search:${query}:${category || ''}:${source || ''}:${sortBy}:${limit}:${offset}`;
  const cached = searchCache.get<SearchResponse>(cacheKey);
  if (cached) return cached;

  const articles = await aggregateAllFeeds();
  const queryTokens = tokenize(query);

  if (queryTokens.length === 0) {
    return {
      results: [],
      totalResults: 0,
      query,
      took: Date.now() - startTime,
      suggestions: [],
    };
  }

  // Pre-filter by category/source if specified
  let pool = articles;
  if (category) {
    pool = pool.filter(a => a.category?.toLowerCase() === category.toLowerCase());
  }
  if (source) {
    pool = pool.filter(a => a.source.toLowerCase() === source.toLowerCase());
  }

  // Score all articles
  const scored: SearchResult[] = [];
  for (const article of pool) {
    const { score, matchedFields, highlights } = scoreArticle(article, queryTokens, query);
    if (score > 0) {
      scored.push({ article, relevanceScore: score, matchedFields, highlights });
    }
  }

  // Sort by requested criteria
  if (sortBy === 'date') {
    scored.sort((a, b) => new Date(b.article.pubDate).getTime() - new Date(a.article.pubDate).getTime());
  } else if (sortBy === 'trending') {
    scored.sort((a, b) => b.article.trendingScore - a.article.trendingScore);
  } else {
    scored.sort((a, b) => b.relevanceScore - a.relevanceScore);
  }

  const totalResults = scored.length;
  const results = scored.slice(offset, offset + limit);
  const suggestions = generateSuggestions(articles, queryTokens);

  const response: SearchResponse = {
    results,
    totalResults,
    query,
    took: Date.now() - startTime,
    suggestions,
  };

  searchCache.set(cacheKey, response, CACHE_TTL.SEARCH_RESULTS);
  return response;
}
