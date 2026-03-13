'use client';

import { useState, useCallback, useRef } from 'react';
import { Article } from '@/lib/rss-parser';

interface CachedSummary {
  articleId: string;
  summary: string;
  keyPoints: string[];
  sentiment: string;
  timestamp: number;
}

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
const CACHE_KEY = 'article-summaries-cache';

/**
 * Custom hook for managing article summaries with caching
 * Prevents redundant API calls for the same articles
 */
export function useSummaries() {
  const [summaries, setSummaries] = useState<Map<string, CachedSummary>>(new Map());
  const [loading, setLoading] = useState(false);
  const cacheRef = useRef<Map<string, CachedSummary>>(new Map());

  // Load cache from localStorage on mount
  const loadCache = useCallback(() => {
    if (typeof window === 'undefined') return;

    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const data: CachedSummary[] = JSON.parse(cached);
        const now = Date.now();

        // Filter out expired entries
        const validEntries = data.filter(entry => now - entry.timestamp < CACHE_DURATION);

        const map = new Map(validEntries.map(entry => [entry.articleId, entry]));
        cacheRef.current = map;
        setSummaries(map);

        // Save cleaned cache
        if (validEntries.length < data.length) {
          localStorage.setItem(CACHE_KEY, JSON.stringify(validEntries));
        }
      }
    } catch (error) {
      console.error('Error loading summary cache:', error);
    }
  }, []);

  // Save cache to localStorage
  const saveCache = useCallback(() => {
    if (typeof window === 'undefined') return;

    try {
      const entries = Array.from(cacheRef.current.values());
      localStorage.setItem(CACHE_KEY, JSON.stringify(entries));
    } catch (error) {
      console.error('Error saving summary cache:', error);
    }
  }, []);

  // Get or generate summary for an article
  const getSummary = useCallback(
    async (article: Article) => {
      // Check if already cached
      if (cacheRef.current.has(article.id)) {
        return cacheRef.current.get(article.id);
      }

      setLoading(true);

      try {
        const response = await fetch('/api/summarize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ article }),
        });

        if (!response.ok) {
          throw new Error('Failed to generate summary');
        }

        const data = await response.json();
        const cached: CachedSummary = {
          articleId: data.articleId,
          summary: data.summary,
          keyPoints: data.keyPoints,
          sentiment: data.sentiment,
          timestamp: Date.now(),
        };

        // Update cache
        cacheRef.current.set(article.id, cached);
        setSummaries(new Map(cacheRef.current));
        saveCache();

        return cached;
      } catch (error) {
        console.error('Error generating summary:', error);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [saveCache]
  );

  // Batch generate summaries for multiple articles
  const generateBatchSummaries = useCallback(
    async (articles: Article[]) => {
      setLoading(true);

      // Filter articles that don't have cached summaries
      const articlesToSummarize = articles.filter(a => !cacheRef.current.has(a.id));

      if (articlesToSummarize.length === 0) {
        setLoading(false);
        return;
      }

      try {
        // Generate summaries sequentially to avoid rate limiting
        for (const article of articlesToSummarize) {
          await getSummary(article);
          // Small delay between requests
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      } catch (error) {
        console.error('Error in batch summarization:', error);
      } finally {
        setLoading(false);
      }
    },
    [getSummary]
  );

  return {
    summaries: Object.fromEntries(summaries),
    loading,
    getSummary,
    generateBatchSummaries,
    loadCache,
  };
}
