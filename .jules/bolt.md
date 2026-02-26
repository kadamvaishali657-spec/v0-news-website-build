## 2026-02-11 - Stable ID Generation & Navigation Performance
**Learning:** Using non-deterministic IDs (like `Date.now()`) for dynamically fetched items in a Next.js application causes navigation failures because the item ID on the index page won't match the re-fetched ID on the detail page. This also degrades React reconciliation performance.
**Action:** Always generate deterministic IDs based on unique content (e.g., URL hash) when dealing with third-party data without server-side persistence.

## 2026-02-11 - DOM-based Text Decoding Optimization
**Learning:** Re-creating a DOM element (like a `textarea`) for every string being decoded (e.g., 200+ articles) is expensive and triggers frequent GC. Reusing a single memoized element is significantly faster.
**Action:** Implement a singleton/memoized element for utility functions that require DOM access for processing.

## 2026-02-11 - In-Memory Cache for Client-Side Aggregators
**Learning:** In a pure client-side aggregator, navigating between Home and Detail pages re-fetches all data by default, causing poor UX and high bandwidth usage.
**Action:** Implement a simple in-memory cache with a TTL (e.g., 5 mins) to provide instant navigation for recently fetched data.

## 2026-02-11 - Navigation Consistency and Search Params
**Learning:** In a multi-page Next.js app, using hash-based filtering (e.g., /#category=...) on the home page only works if the user is *already* on that page. It fails when navigating from other pages (like /settings) because the home page component might not be listening for hash changes.
**Action:** Use URL search parameters (e.g., /?category=...) and sync them via `useSearchParams` in a `useEffect` to ensure consistent cross-page navigation.
