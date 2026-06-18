"use client";

import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PaginationMeta {
  totalItems: number;
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface PaginationProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void; // Added to support 10, 20, 50, 100 adjustments
}

export function TransactionPagination({
  meta,
  onPageChange,
  onLimitChange,
}: PaginationProps) {
  const { currentPage, totalPages, itemsPerPage, totalItems } = meta;

  // Generate dynamic page tracking array with ellipses (...)
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const siblingCount = 1; // Number of pages to show on either side of current page

    // If total pages is small, show all pages without ellipses
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const showLeftEllipsis = leftSiblingIndex > 2;
    const showRightEllipsis = rightSiblingIndex < totalPages - 1;

    // Always include first page
    pages.push(1);

    if (showLeftEllipsis) {
      pages.push("...left"); // Unique keys for rendering
    } else if (leftSiblingIndex > 1) {
      for (let i = 2; i < leftSiblingIndex; i++) pages.push(i);
    }

    // Include middle range window
    for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
      if (i !== 1 && i !== totalPages) {
        pages.push(i);
      }
    }

    if (showRightEllipsis) {
      pages.push("...right");
    } else if (rightSiblingIndex < totalPages) {
      for (let i = rightSiblingIndex + 1; i < totalPages; i++) pages.push(i);
    }

    // Always include last page
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="flex flex-col lg:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200 dark:border-slate-800 w-full">
      {/* LEFT CLUSTER: Size Configuration Selector & Total Metrics */}
      <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto justify-between sm:justify-start">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap">
            Rows per page
          </span>
          <Select
            value={String(itemsPerPage)}
            onValueChange={(val) => onLimitChange(Number(val))}
          >
            <SelectTrigger className="h-8 w-[70px] bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-xs rounded-lg focus:ring-1 focus:ring-indigo-500">
              <SelectValue placeholder={itemsPerPage} />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 min-w-[70px]">
              {[10, 20, 50, 100].map((size) => (
                <SelectItem key={size} value={String(size)} className="text-xs">
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <p className="text-xs font-medium text-slate-400 dark:text-slate-500 text-center sm:text-left">
          Showing{" "}
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)}
          </span>{" "}
          to{" "}
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            {Math.min(currentPage * itemsPerPage, totalItems)}
          </span>{" "}
          of{" "}
          <span className="font-bold text-slate-950 dark:text-slate-200">
            {totalItems.toLocaleString()}
          </span>{" "}
          entries
        </p>
      </div>

      {/* RIGHT CLUSTER: Interactive Track Engine Controls */}
      <div className="flex items-center gap-1.5 w-full lg:w-auto justify-center lg:justify-end overflow-x-auto py-1">
        {/* Skip to First Page */}
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === 1}
          onClick={() => onPageChange(1)}
          className="h-8 w-8 p-0 border-slate-200 dark:border-slate-800 rounded-lg hidden sm:flex"
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>

        {/* Step Backward 1 Page */}
        <Button
          variant="outline"
          size="sm"
          disabled={!meta.hasPreviousPage}
          onClick={() => onPageChange(currentPage - 1)}
          className="h-8 w-8 p-0 border-slate-200 dark:border-slate-800 rounded-lg"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* Dynamic Number Track Window Map */}
        <div className="flex items-center gap-1 mx-1">
          {getPageNumbers().map((page, index) => {
            if (typeof page === "string") {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="w-8 text-center text-xs font-bold text-slate-400 select-none tracking-tight"
                >
                  •••
                </span>
              );
            }

            const isCurrent = page === currentPage;

            return (
              <Button
                key={`page-${page}`}
                variant={isCurrent ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(page)}
                className={`h-8 w-8 p-0 rounded-lg text-xs font-mono font-bold transition-all ${
                  isCurrent
                    ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/10 border-indigo-600"
                    : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-400"
                }`}
              >
                {page}
              </Button>
            );
          })}
        </div>

        {/* Step Forward 1 Page */}
        <Button
          variant="outline"
          size="sm"
          disabled={!meta.hasNextPage}
          onClick={() => onPageChange(currentPage + 1)}
          className="h-8 w-8 p-0 border-slate-200 dark:border-slate-800 rounded-lg"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        {/* Skip to Last Page */}
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(totalPages)}
          className="h-8 w-8 p-0 border-slate-200 dark:border-slate-800 rounded-lg hidden sm:flex"
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
