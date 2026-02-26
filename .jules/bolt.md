## 2026-02-11 - Rendering and DOM Optimizations
**Learning:** In a news aggregator with many articles, repeated DOM operations like creating elements for HTML decoding can become a bottleneck. Similarly, unnecessary re-renders of list items (NewsCards) can impact UI responsiveness during search and filtering.
**Action:** Use a memoized/reusable DOM element for string processing and apply React.memo/useMemo to stabilize the component tree and derived data.
