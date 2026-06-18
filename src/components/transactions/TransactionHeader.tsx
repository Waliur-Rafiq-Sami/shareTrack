"use client";

import React from "react";
import { History } from "lucide-react";

interface TransactionHeaderProps {
  totalItems: number;
}

export function TransactionHeader({ totalItems }: TransactionHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-4 border-b border-slate-200 dark:border-slate-800">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
          <History className="h-7 w-7 text-indigo-500 shrink-0" />
          Transaction Ledger
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
          An enterprise-grade comprehensive financial audit trail of your
          account operations, assets, and liquidity streams.
        </p>
      </div>
      <div className="bg-slate-100 dark:bg-slate-900 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 self-start sm:self-auto shrink-0 text-center">
        <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">
          Total Ledger Entries
        </span>
        <span className="text-sm font-mono font-bold text-slate-800 dark:text-indigo-400">
          {totalItems.toLocaleString()} rows
        </span>
      </div>
    </div>
  );
}
