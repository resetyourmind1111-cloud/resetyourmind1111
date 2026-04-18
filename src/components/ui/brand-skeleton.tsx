import { cn } from "@/lib/utils";

interface BrandSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

/** Branded shimmer skeleton — dark gradient on dark bg. */
export function BrandSkeleton({ className, ...props }: BrandSkeletonProps) {
  return <div className={cn("skeleton-shimmer", className)} {...props} />;
}

/** Skeleton card matching our standard content card sizing. */
export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border/30 bg-card/40 p-5 space-y-3",
        className
      )}
    >
      <BrandSkeleton className="h-3 w-24 rounded-full" />
      <BrandSkeleton className="h-6 w-3/4 rounded-md" />
      <BrandSkeleton className="h-4 w-full rounded-md" />
      <BrandSkeleton className="h-4 w-5/6 rounded-md" />
    </div>
  );
}

/** Stack of N skeleton cards. */
export function SkeletonCardList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

/** 2-col grid of skeleton tiles for media libraries. */
export function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl border border-border/30 bg-card/40 p-5 flex items-center gap-4"
        >
          <BrandSkeleton className="w-12 h-12 rounded-xl shrink-0" />
          <div className="flex-1 space-y-2">
            <BrandSkeleton className="h-4 w-3/4 rounded-md" />
            <BrandSkeleton className="h-3 w-1/2 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
}
