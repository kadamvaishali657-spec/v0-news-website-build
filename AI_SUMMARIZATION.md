# AI-Powered Article Summarization

This document describes the AI summarization feature integrated into the news aggregator.

## Overview

The summarization system uses **Groq's fast inference API** to generate concise summaries of news articles in real-time. Each summary includes:

- **2-3 sentence summary** capturing the core message
- **2-3 key points** as bullet items
- **Sentiment analysis** (positive, neutral, negative)

## Architecture

### Components

#### 1. **ArticleSummary** (`components/article-summary.tsx`)
- Displays AI-generated summary with expandable detail
- Shows loading state while generating summary
- Error handling with user-friendly messages
- Color-coded sentiment indicators

#### 2. **NewsCardWithSummary** (`components/news-card-with-summary.tsx`)
- Enhanced news card that includes inline AI summary
- Integrates with existing news card functionality
- Optional summary display toggle
- Fully responsive and mobile-optimized

### API Route

#### `app/api/summarize/route.ts`
- **Method**: POST
- **Input**: Article object with title and description
- **Output**: JSON with summary, keyPoints, and sentiment
- **Model**: Groq's llama-3.3-70b-versatile
- **Temperature**: 0.3 (for consistent summaries)
- **Max Tokens**: 300 (concise output)

### Utilities

#### `lib/summarize-utils.ts`
- `buildSummarizationPrompt()` - Creates optimized prompt for Groq
- `parseAISummaryResponse()` - Safely parses AI JSON response

### Hook

#### `hooks/use-summaries.ts`
- `useSummaries()` - Custom hook for summary management
- **Features**:
  - Automatic caching in localStorage (24-hour expiry)
  - Batch processing with rate limit protection
  - Prevents duplicate API calls
  - Efficient cleanup of expired cache

## Usage

### Basic Implementation

```tsx
import { ArticleSummary } from '@/components/article-summary';
import { Article } from '@/lib/rss-parser';

export function ArticleView({ article }: { article: Article }) {
  return (
    <div>
      <h1>{article.title}</h1>
      <ArticleSummary article={article} />
      <p>{article.description}</p>
    </div>
  );
}
```

### Using Enhanced News Card

```tsx
import { NewsCardWithSummary } from '@/components/news-card-with-summary';

export function ArticleGrid({ articles }: { articles: Article[] }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {articles.map(article => (
        <NewsCardWithSummary key={article.id} article={article} showSummary={true} />
      ))}
    </div>
  );
}
```

### Advanced: Batch Summaries

```tsx
'use client';

import { useSummaries } from '@/hooks/use-summaries';
import { useEffect } from 'react';

export function ArticleList({ articles }: { articles: Article[] }) {
  const { summaries, generateBatchSummaries, loadCache } = useSummaries();

  useEffect(() => {
    loadCache();
    generateBatchSummaries(articles);
  }, [articles]);

  return (
    <div>
      {articles.map(article => (
        <div key={article.id}>
          <h2>{article.title}</h2>
          {summaries[article.id] && (
            <p>{summaries[article.id].summary}</p>
          )}
        </div>
      ))}
    </div>
  );
}
```

## Performance Optimizations

### Caching Strategy

- **localStorage-based caching** with 24-hour TTL
- **Automatic cleanup** of expired entries
- **Duplicate request prevention** - same article only summarized once per session
- **Batch processing** with 100ms delays to avoid rate limiting

### Response Time

- **First request**: 2-4 seconds (depends on article length)
- **Cached request**: < 100ms (instant retrieval)
- **Batch of 10 articles**: ~30-40 seconds (sequential with delays)

## Customization

### Adjust Summarization Prompt

Edit `lib/summarize-utils.ts` - `buildSummarizationPrompt()`:

```typescript
export function buildSummarizationPrompt(article: Article): string {
  return `Your custom prompt here...`;
}
```

### Change Cache Duration

In `hooks/use-summaries.ts`:

```typescript
const CACHE_DURATION = 24 * 60 * 60 * 1000; // Modify this value
```

### Modify Groq Model

In `app/api/summarize/route.ts`:

```typescript
model: groq('llama-3.3-70b-versatile'), // Change model here
```

## Environment Variables

Required: `GROQ_API_KEY`

The key is already configured and should be available in your environment.

## Error Handling

### Graceful Failures

- If Groq API fails: Shows error message to user
- If parsing fails: Falls back to article description
- If cache is corrupted: Clears and restarts fresh
- Network timeout: 30-second limit with helpful message

## Response Structure

```json
{
  "articleId": "article-123",
  "title": "Article Title",
  "summary": "2-3 sentence summary capturing core message...",
  "keyPoints": [
    "First key insight from article",
    "Second important point",
    "Third key takeaway"
  ],
  "sentiment": "positive"
}
```

## Styling

The components use Tailwind CSS with these design tokens:

- **Summary container**: Sentiment-based background colors
  - Positive: Green (bg-green-50)
  - Neutral: Gray (bg-gray-50)
  - Negative: Red (bg-red-50)
- **Loading state**: Blue spinner with message
- **Error state**: Red alert with icon
- **Expandable**: Smooth animations on collapse/expand

## Mobile Responsiveness

- Stacked layout on mobile
- Touch-friendly button sizes (44px min-height)
- Optimized padding and margins
- Single-column grid on small screens

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Limitations

- Summaries are not real-time (cached for 24 hours)
- Summary length varies based on article content
- Sentiment is determined by AI (may not reflect user opinion)
- Cache is per-browser, not synced across devices

## Future Enhancements

Potential improvements:

1. **Translation support** - Summarize in multiple languages
2. **Custom summary length** - User-selectable detail levels
3. **Topic extraction** - Auto-generate tags from summaries
4. **User preferences** - Save summary style preferences
5. **Server-side caching** - Database for shared cache across users
6. **Real-time updates** - Refresh summaries when articles update

## Troubleshooting

### "Failed to generate summary"

- Check GROQ_API_KEY environment variable
- Verify network connectivity
- Check Groq API status
- Restart the application

### Summaries not loading

- Clear browser cache (localStorage)
- Check browser console for errors
- Verify article content is not empty
- Check API rate limits

### Slow performance

- Wait for batch processing to complete
- Reduce number of articles being summarized
- Clear old cache entries manually

## Support

For issues or questions about the AI summarization feature, refer to the main project documentation or create an issue in the repository.
