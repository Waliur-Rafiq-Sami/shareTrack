"use client";

import { useState, useEffect, useMemo } from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  hasNextPage: boolean;
}

interface PaginationControlsProps {
  pagination: PaginationData | null;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  limit: number; // NEW
  setLimit: (value: number) => void;
  isLoading: boolean;
  isPlaceholderData: boolean;
}

export default function PaginationControls({
  pagination,
  page,
  setPage,
  limit,
  setLimit,
  isLoading,
  isPlaceholderData,
}: PaginationControlsProps) {
  // 1. Responsive State Tracking (SSR safe)
  const [maxVisible, setMaxVisible] = useState(5); // Default to standard 5

  useEffect(() => {
    const handleResize = () => {
      // xl: 7 items, md/sm: 5 items
      setMaxVisible(window.innerWidth >= 1280 ? 7 : 5);
    };

    handleResize(); // Initialize on client mount
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 2. High-Performance Pagination Generation Logic
  const pageNumbers = useMemo(() => {
    if (!pagination) return [];
    const total = pagination.totalPages;
    const current = pagination.currentPage;

    // If total pages fit within max constraint, just return all of them
    if (total <= maxVisible) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    const pages: (number | string)[] = [];
    const siblingCount = Math.max(0, Math.floor((maxVisible - 5) / 2));

    const leftSiblingIndex = Math.max(current - siblingCount, 1);
    const rightSiblingIndex = Math.min(current + siblingCount, total);

    const showLeftDots = leftSiblingIndex > 2;
    const showRightDots = rightSiblingIndex < total - 1;

    // Condition A: Close to the beginning
    if (!showLeftDots && showRightDots) {
      const leftItems = maxVisible - 2;
      for (let i = 1; i <= leftItems; i++) pages.push(i);
      pages.push("...");
      pages.push(total);
    }
    // Condition B: Close to the end
    else if (showLeftDots && !showRightDots) {
      pages.push(1);
      pages.push("...");
      const rightItems = maxVisible - 2;
      for (let i = total - rightItems + 1; i <= total; i++) pages.push(i);
    }
    // Condition C: Somewhere in the middle
    else if (showLeftDots && showRightDots) {
      pages.push(1);
      pages.push("...");
      const middleItemsCount = maxVisible - 4; // Reserve space for 1, total, and two ellipses
      const middleStart = current - Math.floor(middleItemsCount / 2);
      for (let i = 0; i < middleItemsCount; i++) pages.push(middleStart + i);
      pages.push("...");
      pages.push(total);
    }

    return pages;
  }, [pagination?.currentPage, pagination?.totalPages, maxVisible]);

  // Render Guard
  if (!pagination) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-muted/30 border-t">
      {/* Left Side: Stats & Row Limit Selector */}
      <div className="flex items-center gap-4">
        <span className="text-xs text-muted-foreground font-medium hidden sm:inline-block">
          Showing page {pagination.currentPage} of {pagination.totalPages || 1}{" "}
          ({pagination.totalRecords} total entries)
        </span>
      </div>

      {/* Right Side: Navigation Buttons */}
      <div className="flex items-center gap-1.5">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-medium">
            Rows per page:
          </span>
          <select
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(1);
            }}
            disabled={isLoading || isPlaceholderData}
            className="h-8 w-[70px] rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-2 py-1 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 cursor-pointer disabled:opacity-50"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage((old) => Math.max(old - 1, 1))}
          disabled={page === 1 || isLoading}
          className="h-8 w-8 p-0 bg-background"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* Dynamic Page Index Render Engine */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center gap-1">
            {pageNumbers.map((p, i) =>
              p === "..." ? (
                <div
                  key={`dots-${i}`}
                  className="flex items-center justify-center w-6 h-8 text-muted-foreground"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </div>
              ) : (
                <Button
                  key={`page-${p}`}
                  variant={p === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPage(p as number)}
                  disabled={isLoading || isPlaceholderData}
                  className={cn(
                    "h-8 w-8 p-0 font-medium transition-all shadow-sm",
                    p === page
                      ? "!bg-blue-600 !text-white hover:!bg-blue-700 border-blue-600"
                      : "bg-background text-muted-foreground hover:bg-muted",
                  )}
                >
                  {p}
                </Button>
              ),
            )}
          </div>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            setPage((old) => (pagination.hasNextPage ? old + 1 : old))
          }
          disabled={!pagination.hasNextPage || isPlaceholderData || isLoading}
          className="h-8 w-8 p-0 bg-background"
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
