import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

// Stat Card Skeleton with animation
export const StatCardSkeleton = ({ className }: SkeletonProps) => (
  <div
    className={cn(
      "bg-card rounded-xl p-4 sm:p-6 border border-border animate-fade-in",
      className
    )}
  >
    <div className="flex items-start justify-between">
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-20" />
        <div className="flex items-center gap-2 pt-1">
          <Skeleton className="h-5 w-12 rounded" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
      <Skeleton className="w-12 h-12 rounded-xl" />
    </div>
  </div>
);

// Table Row Skeleton
export const TableRowSkeleton = ({ columns = 6 }: { columns?: number }) => (
  <tr className="animate-fade-in">
    {Array.from({ length: columns }).map((_, i) => (
      <td key={i} className="p-4">
        <Skeleton className={cn("h-5", i === 0 ? "w-8" : i === 1 ? "w-32" : "w-20")} />
      </td>
    ))}
  </tr>
);

// Full Table Skeleton
export const TableSkeleton = ({
  rows = 5,
  columns = 6,
  className,
}: {
  rows?: number;
  columns?: number;
  className?: string;
}) => (
  <div
    className={cn(
      "bg-card rounded-xl border border-border overflow-hidden",
      className
    )}
  >
    {/* Header */}
    <div className="border-b border-border p-4">
      <div className="flex gap-4">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton
            key={i}
            className={cn("h-4", i === 0 ? "w-8" : i === 1 ? "w-28" : "w-20")}
          />
        ))}
      </div>
    </div>
    {/* Rows */}
    <div className="divide-y divide-border">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="p-4 flex gap-4 items-center"
          style={{ animationDelay: `${i * 50}ms` }}
        >
          {Array.from({ length: columns }).map((_, j) => (
            <Skeleton
              key={j}
              className={cn(
                "h-5",
                j === 0 ? "w-8" : j === 1 ? "w-32" : j === columns - 1 ? "w-16" : "w-20"
              )}
            />
          ))}
        </div>
      ))}
    </div>
  </div>
);

// Chart Skeleton
export const ChartSkeleton = ({ className }: SkeletonProps) => (
  <div
    className={cn(
      "bg-card rounded-xl border border-border p-6 animate-fade-in",
      className
    )}
  >
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-8 w-24 rounded-md" />
      </div>
      <div className="flex items-end gap-2 h-48">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton
            key={i}
            className="flex-1 rounded-t"
            style={{ height: `${30 + Math.random() * 60}%` }}
          />
        ))}
      </div>
      <div className="flex justify-between">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} className="h-3 w-8" />
        ))}
      </div>
    </div>
  </div>
);

// Form Skeleton
export const FormSkeleton = ({ fields = 6 }: { fields?: number }) => (
  <div className="space-y-6 animate-fade-in">
    {Array.from({ length: fields }).map((_, i) => (
      <div key={i} className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-full rounded-md" />
      </div>
    ))}
    <div className="flex gap-3 pt-4">
      <Skeleton className="h-10 w-24 rounded-md" />
      <Skeleton className="h-10 w-20 rounded-md" />
    </div>
  </div>
);

// Dashboard Stats Grid Skeleton
export const DashboardStatsSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    {Array.from({ length: 4 }).map((_, i) => (
      <StatCardSkeleton key={i} />
    ))}
  </div>
);

// Mobile Card Skeleton (for table replacement on mobile)
export const MobileCardSkeleton = () => (
  <div className="bg-card rounded-xl border border-border p-4 space-y-3 animate-fade-in">
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-full" />
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-3 w-36" />
        </div>
      </div>
      <Skeleton className="h-6 w-16 rounded-full" />
    </div>
    <div className="flex items-center justify-between pt-2 border-t border-border">
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-4 w-24" />
    </div>
    <div className="flex gap-2">
      <Skeleton className="h-9 flex-1 rounded-md" />
      <Skeleton className="h-9 w-9 rounded-md" />
    </div>
  </div>
);

// Page Loading Skeleton
export const PageSkeleton = ({ withStats = true }: { withStats?: boolean }) => (
  <div className="space-y-6 animate-fade-in">
    {/* Header */}
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="space-y-1">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-4 w-56" />
      </div>
      <Skeleton className="h-9 w-28 rounded-md" />
    </div>

    {/* Stats */}
    {withStats && <DashboardStatsSkeleton />}

    {/* Filters */}
    <div className="flex flex-col sm:flex-row gap-3">
      <Skeleton className="h-10 flex-1 rounded-md" />
      <Skeleton className="h-10 w-[150px] rounded-md" />
    </div>

    {/* Table */}
    <TableSkeleton rows={5} columns={6} />
  </div>
);
