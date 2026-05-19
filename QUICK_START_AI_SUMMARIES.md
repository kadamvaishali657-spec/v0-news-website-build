# Quick Start: AI Article Summaries

## 60-Second Setup

### 1. Add Summary to Your News Grid

Replace this:
```tsx
<NewsCard article={article} />
```

With this:
```tsx
<NewsCardWithSummary article={article} />
```

Done! Summaries will auto-generate on page load.

### 2. Add Summary to Article Detail Page

```tsx
import { ArticleSummary } from '@/components/article-summary';

export default function ArticlePage() {
  return (
    <>
      <h1>{article.title}</h1>
      <ArticleSummary article={article} />
      <p>{article.description}</p>
    </>
  );
}
```

### 3. Batch Process Multiple Articles

```tsx
import { useSummaries } from '@/hooks/use-summaries';

export function ArticleList() {
  const { summaries, generateBatchSummaries, loadCache } = useSummaries();

  useEffect(() => {
    loadCache();
    generateBatchSummaries(articles);
  }, [articles]);

  return (
    <>
      {articles.map(a => (
        <div key={a.id}>
          <h2>{a.title}</h2>
          {summaries[a.id] && <p>{summaries[a.id].summary}</p>}
        </div>
      ))}
    </>
  );
}
```

## Components

### ArticleSummary
Displays AI summary with loading/error states and expandable details.

**Props:**
- `article: Article` (required)
- `onSummaryReady?: (summary: string) => void` (optional callback)

**Example:**
```tsx
<ArticleSummary article={article} />
```

### NewsCardWithSummary
Full news card with integrated AI summary.

**Props:**
- `article: Article` (required)
- `showSummary?: boolean` (default: true)

**Example:**
```tsx
<NewsCardWithSummary article={article} showSummary={true} />
```

## Hook: useSummaries

Manages caching and batch processing of summaries.

**Usage:**
```tsx
const { summaries, loading, getSummary, generateBatchSummaries, loadCache } = useSummaries();

// Load cache
loadCache();

// Get single summary
const summary = await getSummary(article);

// Batch process
await generateBatchSummaries(articles);
```

## API Endpoint

**POST** `/api/summarize`

**Request:**
```json
{
  "article": {
    "id": "string",
    "title": "string",
    "description": "string"
  }
}
```

**Response:**
```json
{
  "articleId": "string",
  "title": "string",
  "summary": "string",
  "keyPoints": ["string"],
  "sentiment": "positive|neutral|negative"
}
```

## What Gets Generated

Each summary includes:

1. **2-3 Sentence Summary** - Core message captured concisely
2. **2-3 Key Points** - Main insights as bullet list
3. **Sentiment Analysis** - Positive/Neutral/Negative classification

## Performance

| Action | Time |
|--------|------|
| First summary | 2-4 seconds |
| Cached summary | <100ms |
| 10 articles | ~30-40 seconds |

## Caching

- **Auto-cached** in browser localStorage
- **24-hour expiry** - automatic cleanup
- **Survives page refresh**
- **No API calls for repeated articles**

## Error Handling

If API fails, user sees:
- Clear error message
- Fallback to article description
- Option to retry

## Styling

All components use Tailwind CSS with:
- Responsive design
- Sentiment color coding
- Smooth animations
- Mobile optimized

## Environment

**Required:** `GROQ_API_KEY`

Already configured - no action needed.

## Common Issues

| Problem | Fix |
|---------|-----|
| "Failed to generate summary" | Check GROQ_API_KEY, verify internet |
| Slow first load | Normal - wait 2-4 seconds, then cached |
| Summary not showing | Clear browser cache, reload page |
| API errors | Check Groq status, verify API key |

## Files You Need

For quick integration, import from:

```tsx
// Components
import { ArticleSummary } from '@/components/article-summary';
import { NewsCardWithSummary } from '@/components/news-card-with-summary';

// Hook
import { useSummaries } from '@/hooks/use-summaries';

// Types
import { Article } from '@/lib/rss-parser';
```

## Full Documentation

- **Technical Details**: `AI_SUMMARIZATION.md`
- **Code Examples**: `SUMMARIZATION_EXAMPLES.md`
- **Implementation Guide**: `AI_SUMMARIZATION_IMPLEMENTATION.md`

## Support

For detailed help:
1. Check `SUMMARIZATION_EXAMPLES.md` for your use case
2. Read `AI_SUMMARIZATION.md` for technical details
3. Review browser console for specific errors

---

**That's it!** You now have AI-powered article summaries ready to go. 🚀
