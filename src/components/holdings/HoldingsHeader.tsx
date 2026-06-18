"use client";

import React from "react";
import {
  Briefcase,
  ArrowUpRight,
  Wallet,
  CircleDollarSign,
} from "lucide-react";

interface LedgerOverview {
  netWorth: number;
  totalRealizedProfit: number;
  cashBalance: number;
}

interface HoldingsHeaderStatsCompactProps {
  ledger: LedgerOverview;
  formatCurrency: (value: number) => string;
}

export function HoldingsHeaderStatsCompact({
  ledger,
  formatCurrency,
}: HoldingsHeaderStatsCompactProps) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-4 sm:p-5 border border-slate-200 dark:border-slate-800/80 rounded-2xl bg-white dark:bg-slate-950/40 backdrop-blur-md shadow-sm">
      <div className="flex items-center gap-3 min-w-0">
        <div className="h-10 w-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 shrink-0">
          <Briefcase className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white truncate">
            My Asset Holdings
          </h1>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
              Live automated market position matching
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 sm:flex sm:items-center gap-2 sm:gap-6 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/60 p-2 sm:p-3 rounded-xl w-full lg:w-auto">
        <div className="text-center sm:text-right min-w-0 sm:px-2">
          <div className="flex items-center justify-center sm:justify-end gap-1 text-slate-400 dark:text-slate-500">
            <Wallet className="h-3 w-3 shrink-0" />
            <span className="text-[10px] font-bold uppercase tracking-wider truncate">
              Portfolio Cost
            </span>
          </div>
          <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mt-0.5 font-mono truncate">
            {formatCurrency(ledger.netWorth)}
          </p>
        </div>

        <div className="hidden sm:block h-7 w-[1px] bg-slate-200 dark:bg-slate-800" />

        <div className="text-center sm:text-right min-w-0 sm:px-2">
          <div className="flex items-center justify-center sm:justify-end gap-1 text-emerald-600/70 dark:text-emerald-500/50">
            <ArrowUpRight className="h-3 w-3 shrink-0" />
            <span className="text-[10px] font-bold uppercase tracking-wider truncate">
              Realized PnL
            </span>
          </div>
          <p className="text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 font-mono truncate">
            {formatCurrency(ledger.totalRealizedProfit)}
          </p>
        </div>

        <div className="hidden sm:block h-7 w-[1px] bg-slate-200 dark:bg-slate-800" />

        <div className="text-center sm:text-right min-w-0 sm:px-2">
          <div className="flex items-center justify-center sm:justify-end gap-1 text-amber-600/70 dark:text-amber-500/50">
            <CircleDollarSign className="h-3 w-3 shrink-0" />
            <span className="text-[10px] font-bold uppercase tracking-wider truncate">
              Trading Cash
            </span>
          </div>
          <p className="text-xs sm:text-sm font-bold text-amber-600 dark:text-amber-400 mt-0.5 font-mono truncate">
            {formatCurrency(ledger.cashBalance)}
          </p>
        </div>
      </div>
    </div>
  );
}
