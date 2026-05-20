import React from 'react';

/**
 * Skeleton loader for article cards
 */
export function NewsCardSkeleton() {
  return (
    <div className="bg-card border border-border/40 rounded-2xl overflow-hidden shadow-card animate-pulse">
      {/* Image placeholder */}
      <div className="w-full h-48 bg-gradient-to-r from-muted via-muted/50 to-muted shimmer" />

      {/* Content placeholder */}
      <div className="p-4 space-y-3">
        {/* Category badge */}
        <div className="w-20 h-5 bg-muted rounded-full" />

        {/* Title lines */}
        <div className="space-y-2">
          <div className="h-4 bg-muted rounded w-full" />
          <div className="h-4 bg-muted rounded w-5/6" />
          <div className="h-4 bg-muted rounded w-4/6" />
        </div>

        {/* Description lines */}
        <div className="space-y-2 pt-2">
          <div className="h-3 bg-muted rounded w-full" />
          <div className="h-3 bg-muted rounded w-full" />
          <div className="h-3 bg-muted rounded w-3/4" />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-border/30">
          <div className="h-3 bg-muted rounded w-20" />
          <div className="h-3 bg-muted rounded w-16" />
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton loader for featured articles
 */
export function FeaturedArticleSkeleton() {
  return (
    <div className="bg-card border border-border/40 rounded-2xl overflow-hidden shadow-card animate-pulse">
      {/* Large image placeholder */}
      <div className="w-full h-64 bg-gradient-to-r from-muted via-muted/50 to-muted shimmer" />

      {/* Content placeholder */}
      <div className="p-6 space-y-4">
        {/* Category */}
        <div className="w-24 h-5 bg-muted rounded-full" />

        {/* Title */}
        <div className="space-y-2">
          <div className="h-5 bg-muted rounded w-full" />
          <div className="h-5 bg-muted rounded w-5/6" />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <div className="h-3 bg-muted rounded w-full" />
          <div className="h-3 bg-muted rounded w-full" />
        </div>

        {/* Source and date */}
        <div className="flex gap-4 pt-2">
          <div className="h-3 bg-muted rounded w-24" />
          <div className="h-3 bg-muted rounded w-20" />
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton loader grid for article cards
 */
export function NewsCardGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <NewsCardSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * Skeleton loader for featured articles grid
 */
export function FeaturedArticlesGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <FeaturedArticleSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * Skeleton loader for search bar
 */
export function SearchBarSkeleton() {
  return (
    <div className="w-full bg-muted border border-border/40 rounded-xl h-12 animate-pulse" />
  );
}

/**
 * Skeleton loader for category filter
 */
export function CategoryFilterSkeleton() {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="h-10 bg-muted rounded-lg w-24 flex-shrink-0 animate-pulse" />
      ))}
    </div>
  );
}

/**
 * Skeleton loader for article detail/summary view
 */
export function ArticleSummarySkeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      <div className="h-4 bg-muted rounded w-full" />
      <div className="h-4 bg-muted rounded w-full" />
      <div className="h-4 bg-muted rounded w-3/4" />
    </div>
  );
}

/**
 * Skeleton loader for pagination
 */
export function PaginationSkeleton() {
  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-10 w-10 bg-muted rounded-lg animate-pulse" />
      ))}
    </div>
  );
}

/**
 * Skeleton loader for feed status
 */
export function FeedStatusSkeleton() {
  return (
    <div className="h-6 bg-muted rounded-full w-32 animate-pulse" />
  );
}

/**
 * Shimmer effect with animation
 */
export const shimmerStyle = `
  @keyframes shimmer {
    0% {
      background-position: -1000px 0;
    }
    100% {
      background-position: 1000px 0;
    }
  }

  .shimmer {
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    background-size: 1000px 100%;
    animation: shimmer 2s infinite;
  }
`;
