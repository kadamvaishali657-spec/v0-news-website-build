## 2026-02-12 - [RSS Parsing Optimizations]
**Learning:** Implemented a multi-layered optimization for RSS feed handling.
1. **Caching:** Used a global in-memory cache (`globalThis`) for RSS feeds with a 5-minute TTL. Storing it on `globalThis` is crucial in development to prevent cache clears during Hot Module Replacement (HMR).
2. **Stable IDs:** Found that using only a hash of the URL for article IDs can lead to duplicate keys if feeds have multiple entries for the same link. Appending the index (`${hash}-${index}`) provides both the stability needed for React reconciliation and guaranteed uniqueness.
3. **DOM Reuse:** Memoizing a single `textarea` for HTML entity decoding significantly reduces DOM allocation overhead when processing large lists of articles.
**Action:** Use `globalThis` for caches that should survive HMR, and always combine hashes with indices for stable/unique React keys in dynamic lists.
