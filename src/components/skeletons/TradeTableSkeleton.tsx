import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function TradeTableSkeleton() {
  return (
    <div className="w-full space-y-4 border rounded-md p-2 animate-in fade-in duration-500">
      <Table>
        <TableHeader>
          <TableRow>
            {/* 9 columns header */}
            {[...Array(9)].map((_, i) => (
              <TableHead key={i}>
                <div className="h-4 w-12 bg-slate-200 dark:bg-slate-800 animate-pulse rounded" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {/* 8 rows of data */}
          {[...Array(8)].map((_, i) => (
            <TableRow key={i}>
              {[...Array(9)].map((_, j) => (
                <TableCell key={j}>
                  <div className="h-6 w-full bg-slate-200 dark:bg-slate-800 animate-pulse rounded" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination Skeleton */}
      <div className="flex items-center justify-between p-4 border-t">
        <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 animate-pulse rounded" />
        <div className="flex gap-2">
          <div className="h-8 w-8 bg-slate-200 dark:bg-slate-800 animate-pulse rounded" />
          <div className="h-8 w-8 bg-slate-200 dark:bg-slate-800 animate-pulse rounded" />
          <div className="h-8 w-8 bg-slate-200 dark:bg-slate-800 animate-pulse rounded" />
        </div>
      </div>
    </div>
  );
}
