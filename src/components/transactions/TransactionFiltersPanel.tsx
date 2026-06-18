"use client";

import React, { useState } from "react";
import {
  Search,
  Calendar,
  SlidersHorizontal,
  X,
  ArrowUpRight,
  ArrowDownLeft,
  ArrowRightLeft,
  Wallet,
  Landmark,
  AlertCircle,
  FilterX,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { TransactionFilters } from "@/hooks/useTransactionsLedger";

interface FiltersPanelProps {
  filters: TransactionFilters;
  onFilterChange: (key: keyof TransactionFilters, value: any) => void;
}

export function TransactionFiltersPanel({
  filters,
  onFilterChange,
}: FiltersPanelProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Quick Action Type configurations for the pill tabs
  const actionTypes = [
    { value: "ALL", label: "All Assets", icon: ArrowRightLeft },
    { value: "BUY", label: "Buy", icon: ArrowUpRight },
    { value: "SELL", label: "Sell", icon: ArrowDownLeft },
    { value: "DEPOSIT", label: "Deposit", icon: Wallet },
    { value: "WITHDRAW", label: "Withdraw", icon: Landmark },
  ] as const;

  // --- 1. Validation Engine ---
  const isDateInvalid = Boolean(
    filters.startDate &&
    filters.endDate &&
    new Date(filters.startDate) > new Date(filters.endDate),
  );

  const isRateInvalid = Boolean(
    filters.minRate !== undefined &&
    filters.maxRate !== undefined &&
    filters.minRate > filters.maxRate,
  );

  const isQuantityInvalid = Boolean(
    filters.minQuantity !== undefined &&
    filters.maxQuantity !== undefined &&
    filters.minQuantity > filters.maxQuantity,
  );

  const isImpactInvalid = Boolean(
    filters.minNetImpact !== undefined &&
    filters.maxNetImpact !== undefined &&
    filters.minNetImpact > filters.maxNetImpact,
  );

  // Collect all active errors into a single array for the UI banner
  const validationErrors = [
    ...(isDateInvalid
      ? ["Timeline: Start date cannot be later than end date."]
      : []),
    ...(isRateInvalid
      ? ["Pricing: Minimum rate cannot exceed maximum rate."]
      : []),
    ...(isQuantityInvalid
      ? ["Volume: Minimum quantity cannot exceed maximum quantity."]
      : []),
    ...(isImpactInvalid
      ? ["Impact: Minimum net impact cannot exceed maximum net impact."]
      : []),
  ];

  // --- 2. Active Filter Counter ---
  const advancedKeys: (keyof TransactionFilters)[] = [
    "startDate",
    "endDate",
    "minRate",
    "maxRate",
    "minQuantity",
    "maxQuantity",
    "minNetImpact",
    "maxNetImpact",
  ];

  const activeAdvancedCount = advancedKeys.filter(
    (key) => filters[key] !== undefined && filters[key] !== "",
  ).length;

  const hasAnyFilter =
    activeAdvancedCount > 0 ||
    (filters.search && filters.search.length > 0) ||
    filters.status !== "ALL" ||
    filters.actionType !== "ALL";

  // --- 3. Master Clear Function ---
  const handleClearAll = () => {
    onFilterChange("search", "");
    onFilterChange("status", "ALL");
    onFilterChange("actionType", "ALL");
    onFilterChange("startDate", "");
    onFilterChange("endDate", "");
    onFilterChange("minRate", undefined);
    onFilterChange("maxRate", undefined);
    onFilterChange("minQuantity", undefined);
    onFilterChange("maxQuantity", undefined);
    onFilterChange("minNetImpact", undefined);
    onFilterChange("maxNetImpact", undefined);
  };

  return (
    <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm space-y-4 transition-all duration-300">
      {/* Primary Row: Search, Status, and Options Toggle */}
      <div className="flex flex-col md:flex-row gap-3">
        {/* Master Text Search */}
        <div className="relative flex-1 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-500 transition-colors" />
          <Input
            placeholder="Search by asset name (e.g., AAPL) or transaction ID..."
            value={filters.search || ""}
            onChange={(e) => onFilterChange("search", e.target.value)}
            className="pl-10 h-10 bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-lg focus-visible:ring-indigo-500 transition-all"
          />
          {filters.search && (
            <button
              onClick={() => onFilterChange("search", "")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 p-1 rounded-full transition-all"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>

        {/* Workflow Status Dropdown */}
        <div className="w-full md:w-[180px]">
          <Select
            value={filters.status || "ALL"}
            onValueChange={(val) => onFilterChange("status", val)}
          >
            <SelectTrigger className="h-10 bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-lg transition-colors focus:ring-indigo-500">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800">
              <SelectItem value="ALL">All Statuses</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Action Controls Container */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          {/* Advanced Filters Toggle with Badge */}
          <Button
            variant="outline"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`flex-1 md:flex-none h-10 gap-2 rounded-lg transition-all duration-200 relative ${
              showAdvanced || activeAdvancedCount > 0
                ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-500/30 shadow-sm"
                : "border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300"
            }`}
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span className="text-sm font-medium">Options</span>
            {/* Active Filter Indicator Badge */}
            {activeAdvancedCount > 0 && (
              <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white dark:ring-slate-950 animate-in zoom-in-50">
                {activeAdvancedCount}
              </span>
            )}
          </Button>

          {/* Master Clear Filters Button */}
          {hasAnyFilter && (
            <Button
              variant="ghost"
              onClick={handleClearAll}
              className="h-10 px-3 text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 dark:hover:text-rose-400 rounded-lg transition-colors animate-in fade-in slide-in-from-right-2 border border-red-500/60"
              title="Clear all filters"
            >
              <FilterX className="h-4 w-4 text-red-500 hover:text-red-600" />
            </Button>
          )}
        </div>
      </div>

      {/* Secondary Row: Buy / Sell Quick Tabs */}
      <div className="flex flex-wrap gap-2 pt-1">
        {actionTypes.map(({ value, label, icon: Icon }) => {
          const isActive = (filters.actionType || "ALL") === value;
          return (
            <button
              key={value}
              onClick={() => onFilterChange("actionType", value)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 border ${
                isActive
                  ? "bg-indigo-500 text-white border-indigo-500 shadow-md shadow-indigo-500/20 scale-105"
                  : "bg-slate-50 dark:bg-slate-900/50 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 hover:scale-105"
              }`}
            >
              <Icon className="h-3 w-3" />
              {label}
            </button>
          );
        })}
      </div>

      {/* Advanced Extended Panel Container */}
      {showAdvanced && (
        <div className="mt-4 p-5 rounded-xl bg-slate-50/50 dark:bg-slate-900/20 border border-slate-100 dark:border-slate-800/80 animate-in slide-in-from-top-2 fade-in duration-200 shadow-inner">
          {/* Dynamic Error Banner Engine */}
          {validationErrors.length > 0 && (
            <div className="mb-5 flex flex-col gap-2 p-3 text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-lg dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20 animate-in fade-in slide-in-from-top-1">
              <div className="flex items-center gap-2 font-bold mb-1">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <p>Filter Validation Issues:</p>
              </div>
              <ul className="list-disc pl-8 space-y-1 text-xs font-medium">
                {validationErrors.map((error, idx) => (
                  <li key={idx}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Group 1: Timeline Boundaries */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-widest border-b border-slate-200 dark:border-slate-800 pb-1 flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5 text-indigo-500" /> Timeline
              </h4>
              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                  Start Date
                </label>
                <Input
                  type="date"
                  value={filters.startDate || ""}
                  onChange={(e) => onFilterChange("startDate", e.target.value)}
                  className={`h-9 text-xs transition-colors focus:ring-indigo-500 ${
                    isDateInvalid
                      ? "border-rose-300 dark:border-rose-500/50 focus-visible:ring-rose-500 bg-rose-50/50 dark:bg-rose-500/5"
                      : "bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800"
                  }`}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                  End Date
                </label>
                <Input
                  type="date"
                  value={filters.endDate || ""}
                  onChange={(e) => onFilterChange("endDate", e.target.value)}
                  className={`h-9 text-xs transition-colors focus:ring-indigo-500 ${
                    isDateInvalid
                      ? "border-rose-300 dark:border-rose-500/50 focus-visible:ring-rose-500 bg-rose-50/50 dark:bg-rose-500/5"
                      : "bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800"
                  }`}
                />
              </div>
            </div>

            {/* Group 2: Rate Boundaries */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-widest border-b border-slate-200 dark:border-slate-800 pb-1">
                Pricing Rates
              </h4>
              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                  Min Rate ($)
                </label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={filters.minRate ?? ""}
                  onChange={(e) =>
                    onFilterChange(
                      "minRate",
                      e.target.value ? parseFloat(e.target.value) : undefined,
                    )
                  }
                  className={`h-9 text-xs transition-colors focus:ring-indigo-500 ${
                    isRateInvalid
                      ? "border-rose-300 dark:border-rose-500/50 focus-visible:ring-rose-500 bg-rose-50/50 dark:bg-rose-500/5"
                      : "bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800"
                  }`}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                  Max Rate ($)
                </label>
                <Input
                  type="number"
                  placeholder="No limit"
                  value={filters.maxRate ?? ""}
                  onChange={(e) =>
                    onFilterChange(
                      "maxRate",
                      e.target.value ? parseFloat(e.target.value) : undefined,
                    )
                  }
                  className={`h-9 text-xs transition-colors focus:ring-indigo-500 ${
                    isRateInvalid
                      ? "border-rose-300 dark:border-rose-500/50 focus-visible:ring-rose-500 bg-rose-50/50 dark:bg-rose-500/5"
                      : "bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800"
                  }`}
                />
              </div>
            </div>

            {/* Group 3: Quantity Boundaries */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-widest border-b border-slate-200 dark:border-slate-800 pb-1">
                Asset Volume
              </h4>
              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                  Min Quantity
                </label>
                <Input
                  type="number"
                  placeholder="0"
                  value={filters.minQuantity ?? ""}
                  onChange={(e) =>
                    onFilterChange(
                      "minQuantity",
                      e.target.value ? parseFloat(e.target.value) : undefined,
                    )
                  }
                  className={`h-9 text-xs transition-colors focus:ring-indigo-500 ${
                    isQuantityInvalid
                      ? "border-rose-300 dark:border-rose-500/50 focus-visible:ring-rose-500 bg-rose-50/50 dark:bg-rose-500/5"
                      : "bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800"
                  }`}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                  Max Quantity
                </label>
                <Input
                  type="number"
                  placeholder="No limit"
                  value={filters.maxQuantity ?? ""}
                  onChange={(e) =>
                    onFilterChange(
                      "maxQuantity",
                      e.target.value ? parseFloat(e.target.value) : undefined,
                    )
                  }
                  className={`h-9 text-xs transition-colors focus:ring-indigo-500 ${
                    isQuantityInvalid
                      ? "border-rose-300 dark:border-rose-500/50 focus-visible:ring-rose-500 bg-rose-50/50 dark:bg-rose-500/5"
                      : "bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800"
                  }`}
                />
              </div>
            </div>

            {/* Group 4: Net Impact Boundaries */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-widest border-b border-slate-200 dark:border-slate-800 pb-1">
                Net Cash Impact
              </h4>
              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                  Min Impact ($)
                </label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={filters.minNetImpact ?? ""}
                  onChange={(e) =>
                    onFilterChange(
                      "minNetImpact",
                      e.target.value ? parseFloat(e.target.value) : undefined,
                    )
                  }
                  className={`h-9 text-xs transition-colors focus:ring-indigo-500 ${
                    isImpactInvalid
                      ? "border-rose-300 dark:border-rose-500/50 focus-visible:ring-rose-500 bg-rose-50/50 dark:bg-rose-500/5"
                      : "bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800"
                  }`}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                  Max Impact ($)
                </label>
                <Input
                  type="number"
                  placeholder="50000.00"
                  value={filters.maxNetImpact ?? ""}
                  onChange={(e) =>
                    onFilterChange(
                      "maxNetImpact",
                      e.target.value ? parseFloat(e.target.value) : undefined,
                    )
                  }
                  className={`h-9 text-xs transition-colors focus:ring-indigo-500 ${
                    isImpactInvalid
                      ? "border-rose-300 dark:border-rose-500/50 focus-visible:ring-rose-500 bg-rose-50/50 dark:bg-rose-500/5"
                      : "bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800"
                  }`}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
