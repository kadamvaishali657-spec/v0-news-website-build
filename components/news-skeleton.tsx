'use client';

export function NewsCardSkeleton() {
  return (
    <div className="group h-full flex flex-col bg-card border border-border rounded-lg overflow-hidden animate-pulse">
      {/* Image Skeleton */}
      <div className="relative w-full h-48 bg-muted" />

      {/* Content */}
      <div className="flex-1 flex flex-col p-4 gap-3">
        {/* Source & Date Skeleton */}
        <div className="flex items-center justify-between gap-2">
          <div className="h-5 w-16 bg-muted rounded" />
          <div className="h-4 w-24 bg-muted rounded" />
        </div>

        {/* Title Skeleton */}
        <div className="space-y-2">
          <div className="h-5 bg-muted rounded" />
          <div className="h-5 bg-muted rounded w-4/5" />
        </div>

        {/* Description Skeleton */}
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-muted rounded" />
          <div className="h-4 bg-muted rounded w-5/6" />
        </div>

        {/* Read More Skeleton */}
        <div className="h-4 w-20 bg-muted rounded" />
      </div>
    </div>
  );
}

export function NewsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <NewsCardSkeleton key={i} />
      ))}
    </div>
  );
}
