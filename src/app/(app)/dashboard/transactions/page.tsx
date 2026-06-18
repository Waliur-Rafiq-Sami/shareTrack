"use client";

import { useState } from "react";
import { Info, Database } from "lucide-react";
import {
  useTransactionsLedger,
  TransactionFilters,
} from "@/hooks/useTransactionsLedger";
import { TransactionHeader } from "@/components/transactions/TransactionHeader";
import { TransactionFiltersPanel } from "@/components/transactions/TransactionFiltersPanel";
import { TransactionTable } from "@/components/transactions/TransactionTable";
import { TransactionPagination } from "@/components/transactions/TransactionPagination";
import { TransactionExportButton } from "@/components/transactions/modal/TransactionExportButton";
import LedgerSkeleton from "@/components/skeletons/LedgerMatrixSkeleton";

export default function TransactionsPage() {
  const [filters, setFilters] = useState<TransactionFilters>({
    page: 1,
    limit: 10,
    search: "",
    actionType: "ALL",
    status: "ALL",
    sortBy: "transactionDate",
    sortOrder: "desc",
    startDate: "",
    endDate: "",
  });

  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useTransactionsLedger(filters);

  const updateFilter = (key: keyof TransactionFilters, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      ...(key !== "page" && { page: 1 }),
    }));
  };

  const handleSort = (columnKey: string) => {
    setFilters((prev) => ({
      ...prev,
      sortBy: columnKey,
      sortOrder:
        prev.sortBy === columnKey && prev.sortOrder === "desc" ? "asc" : "desc",
    }));
  };

  // --- Helper: Generate visual summary of active filters for the export panel ---
  const getActiveFiltersSummary = () => {
    const active = [];
    if (filters.search)
      active.push({ label: "Search", value: `"${filters.search}"` });
    if (filters.actionType !== "ALL")
      active.push({ label: "Type", value: filters.actionType });
    if (filters.status !== "ALL")
      active.push({ label: "Status", value: filters.status });
    if (filters.startDate)
      active.push({ label: "From", value: filters.startDate });
    if (filters.endDate) active.push({ label: "To", value: filters.endDate });
    if (filters.minRate !== undefined)
      active.push({ label: "Min Rate", value: `$${filters.minRate}` });
    if (filters.maxRate !== undefined)
      active.push({ label: "Max Rate", value: `$${filters.maxRate}` });
    if (filters.minQuantity !== undefined)
      active.push({ label: "Min Qty", value: filters.minQuantity });
    if (filters.maxQuantity !== undefined)
      active.push({ label: "Max Qty", value: filters.maxQuantity });
    if (filters.minNetImpact !== undefined)
      active.push({ label: "Min Impact", value: `$${filters.minNetImpact}` });
    if (filters.maxNetImpact !== undefined)
      active.push({ label: "Max Impact", value: `$${filters.maxNetImpact}` });
    return active;
  };

  if (isError) {
    return (
      <div className="p-8 text-center bg-rose-500/15 border border-rose-500/30 rounded-xl text-rose-400 font-medium m-6">
        <p className="font-bold">Critical Error Loading Ledger Profiles:</p>
        <p className="text-sm mt-1">
          {error?.message || "Internal database connection failure."}
        </p>
      </div>
    );
  }

  const transactions = response?.data || [];
  const paginationMeta = response?.meta?.pagination;
  const activeFilters = getActiveFiltersSummary();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020817] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <main className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
        {/* Module 1: Dynamic Ledger Counters */}
        <TransactionHeader totalItems={paginationMeta?.totalItems || 0} />
        {/* (Export Button Removed from here) */}

        {isLoading ? (
          <>
            <LedgerSkeleton></LedgerSkeleton>
          </>
        ) : (
          <>
            {/* Module 2: Filter Matrix Controller */}
            <TransactionFiltersPanel
              filters={filters}
              onFilterChange={updateFilter}
            />

            {/* Module 3: Main Data Table Engine */}
            <TransactionTable
              transactions={transactions}
              currentSortBy={filters.sortBy || "transactionDate"}
              currentSortOrder={filters.sortOrder || "desc"}
              onSort={handleSort}
            />

            {/* Module 4: Standard Pagination Clusters */}
            {paginationMeta && paginationMeta.totalPages > 1 && (
              <TransactionPagination
                meta={paginationMeta}
                onPageChange={(targetPage) => updateFilter("page", targetPage)}
                onLimitChange={(targetLimit) =>
                  updateFilter("limit", targetLimit)
                }
              />
            )}

            {/* Module 5: Dynamic Export Console (Bottom Placement) */}
            {transactions.length > 0 && (
              <div className="mt-8 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-6 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm">
                {/* Left side: Export Information & Badges */}
                <div className="space-y-2 flex-1">
                  <h3 className="text-slate-900 dark:text-slate-100 font-semibold flex items-center gap-2 text-lg">
                    <Database className="h-5 w-5 text-indigo-500" />
                    Data Export Console
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-1.5 pb-2">
                    <Info className="h-4 w-4" />
                    Exporting full dataset (ignoring page limits) matching the
                    following criteria:
                  </p>

                  {/* Visual Filter Badges */}
                  <div className="flex flex-wrap gap-2">
                    {activeFilters.length === 0 ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-400">
                        All Records (No filters applied)
                      </span>
                    ) : (
                      activeFilters.map((f, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-xs font-medium text-indigo-700 dark:text-indigo-400"
                        >
                          <span className="opacity-70">{f.label}:</span>{" "}
                          {f.value}
                        </span>
                      ))
                    )}
                  </div>
                </div>

                {/* Right side: The isolated API call button */}
                <div className="w-full md:w-auto shrink-0 border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-800 pt-4 md:pt-0 md:pl-6">
                  <TransactionExportButton filters={filters} />
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
