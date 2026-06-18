"use client";

import React from "react";
import { Search, ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TableFiltersProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  statusFilter: string;
  setStatusFilter: (val: string) => void;
  sortConfig: { key: string; direction: "asc" | "desc" };
  setSortConfig: (config: { key: string; direction: "asc" | "desc" }) => void;
}

export function TableFilters({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  sortConfig,
  setSortConfig,
}: TableFiltersProps) {
  // Combine key and direction to manage the single Select value
  const sortValue = `${sortConfig.key}-${sortConfig.direction}`;

  const handleSortChange = (val: string) => {
    const [key, direction] = val.split("-") as [string, "asc" | "desc"];
    setSortConfig({ key, direction });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 bg-white dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Search by asset or company..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800"
        />
      </div>

      {/* Filter Dropdowns */}
      <div className="flex flex-wrap sm:flex-nowrap gap-2 w-full lg:w-auto">
        {/* Sort Filter */}
        <Select value={sortValue} onValueChange={handleSortChange}>
          <SelectTrigger className="w-full sm:w-[160px] bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <SelectValue placeholder="Sort by" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="lastUpdated-desc">Newest First</SelectItem>
            <SelectItem value="lastUpdated-asc">Oldest First</SelectItem>
            <SelectItem value="realizedProfit-desc">Highest Profit</SelectItem>
            <SelectItem value="totalInvestedAmount-desc">
              Highest Investment
            </SelectItem>
            <SelectItem value="companyName-asc">Name (A-Z)</SelectItem>
          </SelectContent>
        </Select>

        {/* Status Filter */}
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[120px] bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="CLOSED">Closed</SelectItem>
            <SelectItem value="ALL">All Status</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
