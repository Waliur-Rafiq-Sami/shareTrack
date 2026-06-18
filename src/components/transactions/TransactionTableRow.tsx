"use client";

import React from "react";
import {
  ArrowUpRight,
  ArrowDownLeft,
  Coins,
  DollarSign,
  History,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RotateCcw,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TransactionRecord } from "@/hooks/useTransactionsLedger";
import { Button } from "@/components/ui/button";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    value,
  );

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

interface RowProps {
  transaction: TransactionRecord;
  onInitiateReverse: (transaction: TransactionRecord) => void;
}

export function TransactionTableRow({
  transaction: tx,
  onInitiateReverse,
}: RowProps) {
  const renderActionBadge = (type: string) => {
    const styles: Record<string, { bg: string; icon: any; label: string }> = {
      BUY: {
        bg: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/20",
        icon: ArrowUpRight,
        label: "Buy",
      },
      SELL: {
        bg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20",
        icon: ArrowDownLeft,
        label: "Sell",
      },
      DEPOSIT: {
        bg: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-500/20",
        icon: Coins,
        label: "Deposit",
      },
      WITHDRAW: {
        bg: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/20",
        icon: DollarSign,
        label: "Withdraw",
      },
    };

    const config = styles[type] || {
      bg: "bg-slate-500/10 text-slate-400",
      icon: History,
      label: type,
    };
    const Icon = config.icon;

    return (
      <Badge
        variant="outline"
        className={`flex items-center gap-1.5 w-fit px-2 py-0.5 rounded-md font-bold text-[11px] ${config.bg}`}
      >
        <Icon className="h-3 w-3 shrink-0" /> {config.label}
      </Badge>
    );
  };

  const renderStatusBadge = (status: string, isReversed: boolean) => {
    if (isReversed) {
      return (
        <Badge
          variant="outline"
          className="bg-rose-500/10 text-rose-500 border-rose-200 dark:border-rose-500/20 gap-1 rounded-md text-[11px] font-semibold"
        >
          <XCircle className="h-3 w-3" /> Reversed
        </Badge>
      );
    }

    switch (status) {
      case "COMPLETED":
        return (
          <Badge
            variant="outline"
            className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20 gap-1 rounded-md text-[11px] font-semibold"
          >
            <CheckCircle2 className="h-3 w-3" /> Completed
          </Badge>
        );
      case "PENDING":
        return (
          <Badge
            variant="outline"
            className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/20 gap-1 rounded-md text-[11px] font-semibold animate-pulse"
          >
            <AlertCircle className="h-3 w-3" /> Pending
          </Badge>
        );
      default:
        return (
          <Badge
            variant="outline"
            className="bg-slate-500/10 text-slate-500 rounded-md text-[11px]"
          >
            {status}
          </Badge>
        );
    }
  };

  return (
    <>
      <tr className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors group">
        {/* Date & Time */}
        <td className="p-4 text-slate-500 dark:text-slate-400 font-mono text-xs whitespace-nowrap">
          {formatDate(tx.transactionDate || tx.createdAt)}
        </td>

        {/* Action Category Badge */}
        <td className="p-4 whitespace-nowrap">
          {renderActionBadge(tx.actionType)}
        </td>

        {/* Company Asset Tracker Profile */}
        <td className="p-4 font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors whitespace-nowrap">
          {tx.companyName || (
            <span className="text-slate-300 dark:text-slate-700 font-normal">
              —
            </span>
          )}
        </td>

        {/* Volume Capacity & Rates pricing */}
        <td className="p-4 text-right font-mono text-xs whitespace-nowrap">
          {tx.quantity ? (
            <div>
              <span className="text-slate-700 dark:text-slate-300 font-semibold">
                {tx.quantity.toLocaleString()}
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 block mt-0.5">
                @ {formatCurrency(tx.rate || 0)}
              </span>
            </div>
          ) : (
            <span className="text-slate-300 dark:text-slate-700">—</span>
          )}
        </td>

        {/* Total Gross Volume Capital Cost */}
        <td className="p-4 text-right font-mono text-sm text-slate-600 dark:text-slate-300 whitespace-nowrap">
          {formatCurrency(tx.grossAmount)}
        </td>

        {/* Internal Operational Cost Fee System */}
        <td className="p-4 text-right font-mono text-sm text-slate-400 dark:text-slate-500 whitespace-nowrap">
          {tx.commissionAmount > 0
            ? formatCurrency(tx.commissionAmount)
            : "$0.00"}
        </td>

        {/* Primary Reconciliation Metric: Net Liquidity Cash Impact */}
        <td
          className={`p-4 text-right font-mono text-sm font-bold whitespace-nowrap ${tx.netCashImpact > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}
        >
          {tx.netCashImpact > 0 ? "+" : ""}
          {formatCurrency(tx.netCashImpact)}
        </td>

        {/* Workflow Phase Processing Tracker */}
        <td className="p-4 text-center whitespace-nowrap">
          {renderStatusBadge(tx.status, tx.isReversed)}
        </td>

        {/* Operations Action Core Controls */}
        {/* <td className="p-4 text-right whitespace-nowrap">
          <Button
            variant="ghost"
            size="sm"
            disabled={tx.isReversed}
            onClick={() => onInitiateReverse(tx)}
            className={`h-8 px-2.5 rounded-lg text-xs gap-1 transition-all ${
              tx.isReversed
                ? "text-slate-300 dark:text-slate-700 cursor-not-allowed bg-transparent"
                : "text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 border border-rose-900/70  hover:border-rose-100 dark:hover:border-rose-900/30"
            }`}
            title={
              tx.isReversed
                ? "This transaction has already been reversed."
                : "Reverse this transaction"
            }
          >
            <RotateCcw className="h-3 w-3" />
            <span className="">Reverse</span>
          </Button>
        </td> */}
        <td className="p-4 text-right whitespace-nowrap">
          <Button
            variant="ghost"
            size="sm"
            disabled={tx.isReversed}
            onClick={() => onInitiateReverse(tx)} // This tells the parent to open the modal!
            className={`h-8 px-2.5 rounded-lg text-xs gap-1 transition-all ${
              tx.isReversed
                ? "text-slate-300 dark:text-slate-700 cursor-not-allowed bg-transparent"
                : "text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 border border-rose-900/70  hover:border-rose-100 dark:hover:border-rose-900/30"
            }`}
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reverse</span>
          </Button>
        </td>
      </tr>
    </>
  );
}
