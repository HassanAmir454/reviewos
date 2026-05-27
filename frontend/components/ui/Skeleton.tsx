import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'rounded bg-bg-elevated relative overflow-hidden',
        'after:absolute after:inset-0 after:translate-x-[-100%]',
        'after:bg-gradient-to-r after:from-transparent after:via-bg-hover/50 after:to-transparent',
        'after:animate-[shimmer_1.5s_infinite]',
        className
      )}
    />
  )
}

export function PRListSkeleton() {
  return (
    <div className="divide-y divide-border-subtle">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="p-4 space-y-2">
          <div className="flex justify-between items-center">
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-3 w-20" />
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-3 w-3/4" />
          <div className="flex justify-between">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-10" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function MetricCardSkeleton() {
  return (
    <div className="bg-bg-elevated rounded-lg border border-border-default p-4 space-y-2">
      <Skeleton className="h-2 w-20" />
      <Skeleton className="h-8 w-16" />
      <Skeleton className="h-2 w-24" />
    </div>
  )
}
