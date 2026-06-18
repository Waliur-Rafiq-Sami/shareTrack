"use client";

import React from "react";

// Skeleton Pulse Component
const Skeleton = ({ className }: { className: string }) => (
  <div className={`animate-pulse bg-slate-800/50 rounded ${className}`} />
);

export default function LedgerSkeleton({ isLoading = true }) {
  if (!isLoading) return null;

  return (
    <div className="min-h-screen dark:bg-[#020817] text-slate-300  font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* 1. TOP CONTROLS SKELETON */}
        <section className="space-y-4 p-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 w-[140px]" />
            <Skeleton className="h-10 w-24" />
          </div>
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-7 w-20 rounded-full" />
            ))}
          </div>
        </section>

        {/* 2. DATA TABLE SKELETON */}
        <div className="bg-[#020817] border border-slate-800 rounded-xl overflow-hidden">
          <div className="h-12 bg-[#020817] border-b border-slate-800 flex items-center px-6 gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-3 flex-1" />
            ))}
          </div>
          <div className="divide-y divide-slate-800/50">
            {[1, 2, 3, 4, 5, 6].map((row) => (
              <div key={row} className="flex items-center px-6 py-4 gap-4">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20 ml-auto" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-24 ml-auto" />
              </div>
            ))}
          </div>
        </div>

        {/* 3. PAGINATION SKELETON */}
        <div className="flex justify-between px-6 py-4 border-t border-slate-800 bg-[#11141D] rounded-xl">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-6 w-32" />
        </div>

        {/* 4. EXPORT CONSOLE SKELETON */}
        <div className="bg-[#11141D] border border-slate-800 rounded-xl p-6 flex justify-between items-center">
          <div className="space-y-2">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-40" />
        </div>
      </div>
    </div>
  );
}
