import React from "react";

export function HoldingsTableSkeleton() {
  // Mock array to map out 8 layout rows while loading
  const skeletonRows = Array.from({ length: 8 });

  return (
    <div className="space-y-4 animate-pulse">
      {/* 1. Filters Bar Skeleton */}
      <div className="border rounded-xl p-4 flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
        {/* Search input placeholder */}
        <div className="h-10 w-full max-w-xl bg-slate-200 dark:bg-slate-800 rounded-lg" />

        {/* Action dropdowns placeholder */}
        <div className="flex gap-2 items-center">
          <div className="h-10 w-32 bg-slate-200 dark:bg-slate-800 rounded-lg" />
          <div className="h-10 w-24 bg-slate-200 dark:bg-slate-800 rounded-lg" />
        </div>
      </div>

      {/* 2. Main Datagrid Container */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#020817]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse table-auto">
            {/* Table Header Mirror */}
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800">
                <th className="p-4">
                  <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded" />
                </th>
                <th className="p-4">
                  <div className="h-4 w-28 bg-slate-200 dark:bg-slate-800 rounded" />
                </th>
                <th className="p-4">
                  <div className="h-4 w-16 bg-slate-200 dark:bg-slate-800 rounded" />
                </th>
                <th className="p-4">
                  <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded" />
                </th>
                <th className="p-4">
                  <div className="h-4 w-20 bg-slate-200 dark:bg-slate-800 rounded" />
                </th>
                <th className="p-4">
                  <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded" />
                </th>
                <th className="p-4">
                  <div className="h-4 w-28 bg-slate-200 dark:bg-slate-800 rounded" />
                </th>
                <th className="p-4 text-right">
                  <div className="h-4 w-12 bg-slate-200 dark:bg-slate-800 rounded inline-block" />
                </th>
              </tr>
            </thead>

            {/* Table Body Rows Mirror */}
            <tbody className="divide-y divide-slate-100 dark:divide-slate-900">
              {skeletonRows.map((_, index) => (
                <tr
                  key={index}
                  className="hover:bg-slate-50/50 dark:hover:bg-slate-900/20"
                >
                  {/* LAST UPDATED */}
                  <td className="p-4">
                    <div className="h-4 w-20 bg-slate-200 dark:bg-slate-800 rounded" />
                  </td>
                  {/* ASSET / COMPANY */}
                  <td className="p-4">
                    <div className="h-5 w-16 bg-slate-300 dark:bg-slate-700 rounded font-bold" />
                  </td>
                  {/* QUANTITY */}
                  <td className="p-4">
                    <div className="h-4 w-12 bg-slate-200 dark:bg-slate-800 rounded" />
                  </td>
                  {/* AVG. BUY PRICE */}
                  <td className="p-4">
                    <div className="h-4 w-16 bg-slate-200 dark:bg-slate-800 rounded" />
                  </td>
                  {/* COMMISSION */}
                  <td className="p-4">
                    <div className="h-4 w-20 bg-slate-200 dark:bg-slate-800 rounded" />
                  </td>
                  {/* TOTAL INVESTED */}
                  <td className="p-4">
                    <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded" />
                  </td>
                  {/* REALIZED PROFIT */}
                  <td className="p-4">
                    <div className="h-4 w-16 bg-slate-200 dark:bg-slate-800 rounded" />
                  </td>
                  {/* ACTIONS */}
                  <td className="p-4 text-right">
                    <div className="h-4 w-6 bg-slate-200 dark:bg-slate-800 rounded inline-block" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 3. Pagination Footer Skeleton */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50 dark:bg-slate-950/50">
          {/* Metadata counts */}
          <div className="h-4 w-48 bg-slate-200 dark:bg-slate-800 rounded" />

          {/* Control items */}
          <div className="flex gap-4 items-center">
            <div className="h-8 w-32 bg-slate-200 dark:bg-slate-800 rounded-lg" />
            <div className="flex gap-1">
              <div className="h-8 w-8 bg-slate-200 dark:bg-slate-800 rounded" />
              <div className="h-8 w-8 bg-slate-200 dark:bg-slate-800 rounded" />
              <div className="h-8 w-8 bg-slate-200 dark:bg-slate-800 rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
