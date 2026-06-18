// TradeFiltersSkeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export function TradeFiltersSkeleton() {
  return (
    <Card className="border-slate-200 dark:border-slate-800 p-6">
      <div className="space-y-6">
        {/* Row 1: Fields */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24 bg-slate-200 dark:bg-slate-800" />
            <Skeleton className="h-10 w-full bg-slate-200 dark:bg-slate-800" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-24 bg-slate-200 dark:bg-slate-800" />
            <Skeleton className="h-10 w-full bg-slate-200 dark:bg-slate-800" />
          </div>
          <div className="space-y-2 col-span-1">
            <Skeleton className="h-4 w-32 bg-slate-200 dark:bg-slate-800" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-10 w-full bg-slate-200 dark:bg-slate-800" />
              <Skeleton className="h-4 w-4 bg-slate-200 dark:bg-slate-800 rounded-full" />
              <Skeleton className="h-10 w-full bg-slate-200 dark:bg-slate-800" />
            </div>
          </div>
          <div className="space-y-2 col-span-1">
            <Skeleton className="h-4 w-32 bg-slate-200 dark:bg-slate-800" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-10 w-full bg-slate-200 dark:bg-slate-800" />
              <Skeleton className="h-4 w-4 bg-slate-200 dark:bg-slate-800 rounded-full" />
              <Skeleton className="h-10 w-full bg-slate-200 dark:bg-slate-800" />
            </div>
          </div>
        </div>

        {/* Row 2: Sort Config */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-32 bg-slate-200 dark:bg-slate-800" />
          <div className="flex gap-4">
            <Skeleton className="h-16 w-48 bg-slate-200 dark:bg-slate-800" />
            <Skeleton className="h-16 w-48 bg-slate-200 dark:bg-slate-800" />
          </div>
        </div>

        {/* Row 3: Actions */}
        <div className="flex justify-between items-center pt-4 border-t border-slate-200 dark:border-slate-800 ">
          <Skeleton className="h-10 w-24 bg-slate-200 dark:bg-slate-800" />
          <div className="flex gap-3">
            <Skeleton className="h-10 w-40 bg-slate-200 dark:bg-slate-800" />
            <Skeleton className="h-10 w-24 bg-slate-200 dark:bg-slate-800" />
          </div>
        </div>
      </div>
    </Card>
  );
}
