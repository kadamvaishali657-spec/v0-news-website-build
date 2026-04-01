# Testing JustinNews.tech

## Dev Server Setup

```bash
cd /home/ubuntu/repos/v0-news-website-build
npx next dev --port 3000
```

The app runs at `http://localhost:3000`. It takes ~2-3 seconds to compile on first request.

## Key Pages to Test

- `/` — Homepage with hero, search, stats, article grid, newsletter CTA, footer
- `/trending` — Trending articles with ranking badges
- `/admin` — Admin panel showing RSS feed management
- `/saved` — Saved articles (localStorage-based)
- `/api/health` — Health check JSON endpoint
- `/api/articles?mode=all` — Server-side RSS aggregation
- `/api/articles?mode=trending` — Trending articles
- `/api/search?q=...` — Full-text search API

## Dark Mode Toggle

The dark mode toggle is a small icon button in the header between "Saved" and "Admin" buttons. It's a moon icon (light mode) or sun icon (dark mode).

**Important**: The button is very small (w-4 h-4 icon, p-2.5 padding) and sits right next to the Admin button. When clicking via automation, it's easy to accidentally hit Admin instead. Using `document.querySelector('button[title*="dark"]').click()` or `document.querySelector('button[title*="light"]').click()` via JavaScript is more reliable than visual clicking.

Dark mode state is stored in `localStorage` under the key `theme` with values `'dark'` or `'light'`. It falls back to `prefers-color-scheme` system preference if no localStorage value exists.

The `.dark` class is toggled on `document.documentElement` (the `<html>` element). CSS variables in `globals.css` under `.dark` handle all color changes.

## Content Verification

The site aggregates RSS feeds from 23+ sources. Key things to verify for honest content:
- Hero title should say "News from Around the Web" (not exaggerated claims)
- Subtitle should mention "RSS feeds" and specific source names
- Stats bar should show dynamic article/source counts (not hardcoded)
- Search placeholder: "Search articles by title, source, or topic..."
- Section header: "Latest Stories / Most recent articles from all sources"
- Newsletter CTA: "Stay Updated" (not "Never miss a story")

## API Testing

- `GET /api/health` — Returns JSON with status, uptime, cache stats, memory, environment info
- `GET /api/articles?mode=all` — Returns aggregated articles from all RSS feeds
- `GET /api/articles?mode=trending` — Returns trending-scored articles
- `GET /api/search?q=tech` — Returns search results with fuzzy matching
- `POST /api/chat/stream` — SSE streaming chat (requires Groq API key)

## Known Limitations

- Newsletter file persistence (`data/` directory) won't work on Vercel's read-only filesystem
- In-memory cache and rate limiter are per-invocation on serverless (no shared state)
- RSS aggregation fetches 23 feeds in batches of 5 with 15s timeout — may approach 30s limit on cold starts
- Dark mode may flash briefly on page load since it's toggled via useEffect after hydration

## Devin Secrets Needed

- `GROQ_API_KEY` — Required for AI chat and article summarization features (optional for basic testing)
