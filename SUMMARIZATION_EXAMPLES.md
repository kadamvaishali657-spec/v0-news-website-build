# Article Summarization Implementation Examples

This document provides practical examples for implementing AI article summaries in your news aggregator.

## Example 1: Simple Article Detail Page

Use `ArticleSummary` component to display summary on article detail page:

```tsx
// app/article/[id]/page.tsx (snippet)

'use client';

import { ArticleSummary } from '@/components/article-summary';
import { Article } from '@/lib/rss-parser';
import { useState, useEffect } from 'react';

export default function ArticleDetailPage({ params }: { params: { id: string } }) {
  const [article, setArticle] = useState<Article | null>(null);

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      {article && (
        <>
          <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
          
          {/* AI Summary Section */}
          <div className="mb-8 p-6 bg-blue-50 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Quick Summary</h2>
            <ArticleSummary article={article} />
          </div>

          {/* Full Article */}
          <article className="prose max-w-none">
            {article.description}
          </article>
        </>
      )}
    </main>
  );
}
```

## Example 2: News Feed with Summaries

Replace standard news cards with summary-enhanced cards:

```tsx
// components/news-feed.tsx

'use client';

import { NewsCardWithSummary } from '@/components/news-card-with-summary';
import { Article } from '@/lib/rss-parser';

interface NewsFeedProps {
  articles: Article[];
  showSummaries?: boolean;
}

export function NewsFeed({ articles, showSummaries = true }: NewsFeedProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.map(article => (
        <NewsCardWithSummary
          key={article.id}
          article={article}
          showSummary={showSummaries}
        />
      ))}
    </div>
  );
}
```

Usage in page:

```tsx
// app/page.tsx (snippet)

import { NewsFeed } from '@/components/news-feed';

export default function HomePage() {
  // ... fetch articles

  return (
    <main>
      <h1>News Feed with AI Summaries</h1>
      <NewsFeed articles={articles} showSummaries={true} />
    </main>
  );
}
```

## Example 3: Batch Summarization for Multiple Articles

Generate summaries for a large list of articles with caching:

```tsx
// components/smart-article-list.tsx

'use client';

import { useSummaries } from '@/hooks/use-summaries';
import { Article } from '@/lib/rss-parser';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface SmartArticleListProps {
  articles: Article[];
}

export function SmartArticleList({ articles }: SmartArticleListProps) {
  const { summaries, loading, loadCache, generateBatchSummaries } = useSummaries();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    loadCache();
  }, []);

  useEffect(() => {
    if (articles.length > 0) {
      generateBatchSummaries(articles);
      // Update progress
      const interval = setInterval(() => {
        const cached = Object.keys(summaries).length;
        setProgress((cached / articles.length) * 100);
      }, 500);
      return () => clearInterval(interval);
    }
  }, [articles]);

  return (
    <div>
      {loading && (
        <div className="mb-4 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-3">
            <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
            <div className="flex-1">
              <p className="font-medium text-blue-900">Generating summaries...</p>
              <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-blue-700 mt-1">
                {Math.round(progress)}% complete
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {articles.map(article => (
          <div key={article.id} className="p-4 border border-gray-200 rounded-lg">
            <h3 className="font-bold text-lg mb-2">{article.title}</h3>
            
            {summaries[article.id] ? (
              <div className="mb-3 p-3 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Summary:</span> {summaries[article.id].summary}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Sentiment: {summaries[article.id].sentiment}
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-400 italic mb-3">Loading summary...</p>
            )}

            <p className="text-sm text-gray-600">{article.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Example 4: Search Results with Summaries

Show summaries in search results to help users find relevant articles:

```tsx
// app/search/page.tsx (snippet)

'use client';

import { ArticleSummary } from '@/components/article-summary';
import { Article } from '@/lib/rss-parser';
import { useState } from 'react';

interface SearchResultProps {
  article: Article;
  query: string;
}

function SearchResult({ article, query }: SearchResultProps) {
  const [showSummary, setShowSummary] = useState(false);

  // Highlight matching text
  const highlightText = (text: string) => {
    const regex = new RegExp(`(${query})`, 'gi');
    return text.split(regex).map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-yellow-200">{part}</mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="p-4 border-b border-gray-200 hover:bg-gray-50">
      <h3 className="font-bold text-lg mb-2">
        {highlightText(article.title)}
      </h3>
      
      <p className="text-sm text-gray-600 mb-3">
        {highlightText(article.description.slice(0, 200))}...
      </p>

      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">{article.source}</span>
        
        <button
          onClick={() => setShowSummary(!showSummary)}
          className="text-blue-600 text-sm font-medium hover:underline"
        >
          {showSummary ? 'Hide' : 'Show'} Summary
        </button>
      </div>

      {showSummary && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <ArticleSummary article={article} />
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  // ... search logic
  const results: Article[] = [];
  const query = '';

  return (
    <main>
      <h1>Search Results</h1>
      <div>
        {results.map(article => (
          <SearchResult key={article.id} article={article} query={query} />
        ))}
      </div>
    </main>
  );
}
```

## Example 5: Trending Articles with Summaries

Show trending articles with AI-generated insights:

```tsx
// components/trending-articles.tsx

'use client';

import { useSummaries } from '@/hooks/use-summaries';
import { Article } from '@/lib/rss-parser';
import { TrendingUp } from 'lucide-react';
import { useEffect } from 'react';

interface TrendingArticlesProps {
  articles: Article[];
}

export function TrendingArticles({ articles }: TrendingArticlesProps) {
  const { summaries, loadCache, generateBatchSummaries } = useSummaries();

  useEffect(() => {
    loadCache();
    generateBatchSummaries(articles.slice(0, 5)); // Summarize top 5
  }, [articles]);

  return (
    <div className="bg-white rounded-lg p-6">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="w-6 h-6 text-red-600" />
        <h2 className="text-2xl font-bold">Trending Now</h2>
      </div>

      <div className="space-y-6">
        {articles.slice(0, 5).map((article, index) => (
          <div key={article.id} className="pb-4 border-b border-gray-100 last:border-0">
            <div className="flex gap-4">
              {/* Rank */}
              <div className="text-3xl font-bold text-red-600 min-w-12">
                #{index + 1}
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-2 line-clamp-2">
                  {article.title}
                </h3>

                {/* AI Summary */}
                {summaries[article.id] && (
                  <p className="text-sm text-gray-600 mb-3 italic">
                    "{summaries[article.id].summary}"
                  </p>
                )}

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{article.source}</span>
                  <span>
                    {new Date(article.pubDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Example 6: Customized Summary Display

Create a custom summary display with additional features:

```tsx
// components/advanced-summary.tsx

'use client';

import { Article } from '@/lib/rss-parser';
import { Loader2, Volume2, Copy, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';

interface AdvancedSummaryProps {
  article: Article;
  onReadAloud?: (text: string) => void;
}

export function AdvancedSummary({ article, onReadAloud }: AdvancedSummaryProps) {
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch('/api/summarize', {
      method: 'POST',
      body: JSON.stringify({ article }),
    })
      .then(r => r.json())
      .then(data => {
        setSummary(data);
        setLoading(false);
      });
  }, [article]);

  const handleCopy = async () => {
    if (summary?.summary) {
      await navigator.clipboard.writeText(summary.summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return <div className="p-4 text-center"><Loader2 className="w-5 h-5 animate-spin" /></div>;
  }

  if (!summary) return null;

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-blue-600" />
          <h4 className="font-bold text-blue-900">AI Insight</h4>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="p-2 hover:bg-blue-200 rounded-md transition-colors"
            title="Copy summary"
          >
            <Copy className="w-4 h-4 text-blue-600" />
          </button>
          {onReadAloud && (
            <button
              onClick={() => onReadAloud(summary.summary)}
              className="p-2 hover:bg-blue-200 rounded-md transition-colors"
              title="Read aloud"
            >
              <Volume2 className="w-4 h-4 text-blue-600" />
            </button>
          )}
        </div>
      </div>

      <p className="text-sm text-blue-900 mb-4 leading-relaxed">
        {summary.summary}
      </p>

      {summary.keyPoints.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-semibold text-blue-800 uppercase mb-2">Key Points</p>
          <ul className="space-y-2">
            {summary.keyPoints.map((point: string, i: number) => (
              <li key={i} className="text-xs text-blue-800 flex gap-2">
                <span className="font-bold">→</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex items-center justify-between text-xs">
        <span className="text-blue-700">
          Sentiment: <span className="font-bold">{summary.sentiment}</span>
        </span>
        {copied && <span className="text-green-600 font-medium">Copied!</span>}
      </div>
    </div>
  );
}
```

## Implementation Tips

1. **Load cache on component mount** - Initialize with `loadCache()` to avoid regenerating summaries
2. **Batch wisely** - Summarize only visible articles, lazy-load as user scrolls
3. **Show loading state** - Always display feedback while generating summaries
4. **Handle failures gracefully** - Provide fallback content if summarization fails
5. **Cache strategically** - Use localStorage for client-side, consider database for shared cache
6. **Rate limit requests** - Sequential processing (as done in useSummaries) prevents API throttling

## Performance Considerations

- First request: 2-4 seconds per article
- Cached lookup: <100ms
- Batch 10 articles: ~30-40 seconds sequential
- Cache size: ~5-10KB per article summary
- localStorage limit: ~5-10MB per domain (plenty for thousands of summaries)

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Summaries not loading | Check GROQ_API_KEY, verify network, check console for errors |
| Slow performance | Wait for batch to complete, cache will speed up repeats |
| Cache bloat | Manually clear localStorage, cache expires after 24 hours |
| API errors | Check Groq status, verify API key, check rate limits |
