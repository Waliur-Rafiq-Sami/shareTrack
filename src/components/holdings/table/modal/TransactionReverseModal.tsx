"use client";

import React, { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  AlertTriangle,
  Loader2,
  ArrowRight,
  ShieldAlert,
  Building2,
  Calendar,
  TrendingUp,
  Coins,
  Wallet,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { TransactionRecord } from "@/hooks/useTransactionsLedger";
import { toast } from "@/lib/toast-service";

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

interface TransactionReverseModalProps {
  transaction: TransactionRecord;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function TransactionReverseModal({
  transaction,
  isOpen,
  onClose,
  onSuccess,
}: TransactionReverseModalProps) {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [confirmText, setConfirmText] = useState("");

  if (!isOpen) return null;

  const reversedCashImpact = transaction.netCashImpact * -1;
  const reversedQuantityImpact = transaction.quantity
    ? transaction.quantity * -1
    : 0;

  const handleReverseSubmit = async () => {
    if (confirmText !== "REVERSE") return;

    setIsSubmitting(true);
    setApiError(null);

    try {
      const response = await fetch("/api/trade/reverse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transactionId: transaction._id }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        toast.error({
          title: "Failed to reverse the transaction.",
        });
        throw new Error(data.message || "Failed to reverse the transaction.");
      }

      // Invalidate relevant queries to refresh data across the app
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["dashboardSummary"] }),
        queryClient.invalidateQueries({ queryKey: ["portfolio"] }),
        queryClient.invalidateQueries({ queryKey: ["holdings"] }),
        queryClient.invalidateQueries({ queryKey: ["shareRecords"] }),
        queryClient.invalidateQueries({ queryKey: ["transactionsLedger"] }),
      ]);

      if (onSuccess) onSuccess();
      onClose();

      toast.success({
        title: `${transaction.actionType} for ${transaction.companyName || "asset"} reversed successfully.`,
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setApiError(err.message);
      } else {
        setApiError("An unexpected system error occurred.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-slate-950/60 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      {/* Modal Container */}
      <div className="w-full max-w-2xl bg-white dark:bg-slate-950 border-t sm:border border-slate-200 dark:border-slate-800 rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[85vh] animate-in slide-in-from-bottom sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300 border-none">
        {/* Header - Compact & Mobile friendly */}
        <div className="relative bg-rose-800 dark:bg-rose-950/20 border-b border-rose-500/10 p-4 sm:p-5 flex items-center gap-3 sm:gap-4">
          <div className="p-2 sm:p-2.5 bg-white/10 dark:bg-rose-500/10 text-white dark:text-rose-400 rounded-lg shrink-0">
            <ShieldAlert className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-base sm:text-lg font-bold text-white dark:text-rose-500 truncate tracking-tight">
              Reverse Transaction
            </h2>
            <p className="text-rose-100 dark:text-rose-400/60 text-xs mt-0.5 font-medium hidden xs:block">
              Immutable ledger rollback action.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white dark:text-slate-400 dark:hover:text-slate-200 p-1 rounded-lg hover:bg-white/10 dark:hover:bg-slate-900 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div
          className="p-4 sm:p-6 space-y-5 overflow-y-auto flex-1 
          /* Custom Scrollbar */ 
          [&::-webkit-scrollbar]:w-1.5 
          [&::-webkit-scrollbar-track]:bg-transparent 
          [&::-webkit-scrollbar-thumb]:bg-slate-200 
          dark:[&::-webkit-scrollbar-thumb]:bg-slate-800 
          [&::-webkit-scrollbar-thumb]:rounded-full"
        >
          {/* Section 1: Original Details */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" /> Original Record
            </h3>

            <div className="grid grid-cols-1 xs:grid-cols-2 gap-2.5">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/60">
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tight mb-0.5">
                  Transaction ID
                </p>
                <p className="font-mono text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">
                  {transaction._id}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/60">
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tight mb-0.5">
                  Execution Date
                </p>
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {formatDate(
                    transaction.transactionDate || transaction.createdAt,
                  )}
                </p>
              </div>
              {transaction.companyName && (
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/60">
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tight mb-0.5 flex items-center gap-1">
                    <Building2 className="h-3 w-3" /> Asset Symbol
                  </p>
                  <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    {transaction.companyName}
                  </p>
                </div>
              )}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/60">
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tight mb-0.5 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" /> Type
                </p>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {transaction.actionType}
                </p>
              </div>
            </div>

            {/* Financial Rows - Stacks on Mobile, Rows on Desktop */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/60 flex sm:flex-col justify-between sm:justify-start items-center sm:items-start">
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tight mb-0.5">
                  Gross Value
                </p>
                <p className="font-mono text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {formatCurrency(transaction.grossAmount)}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/60 flex sm:flex-col justify-between sm:justify-start items-center sm:items-start">
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tight mb-0.5">
                  Fees/Commission
                </p>
                <p className="font-mono text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {formatCurrency(transaction.commissionAmount)}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-indigo-50/60 dark:bg-indigo-500/5 border border-indigo-100 dark:border-indigo-500/10 flex sm:flex-col justify-between sm:justify-start items-center sm:items-start">
                <p className="text-[10px] text-indigo-500 uppercase font-bold tracking-tight mb-0.5">
                  Net Cash Impact
                </p>
                <p className="font-mono text-xs sm:text-sm font-bold text-indigo-600 dark:text-indigo-400">
                  {transaction.netCashImpact > 0 ? "+" : ""}
                  {formatCurrency(transaction.netCashImpact)}
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Reversal Assessment */}
          <div className="bg-amber-50/50 dark:bg-amber-500/5 border border-amber-200/60 dark:border-amber-500/10 rounded-xl p-4 sm:p-5 space-y-3">
            <h4 className="text-amber-800 dark:text-amber-400 font-bold text-xs sm:text-sm flex items-center gap-1.5 uppercase tracking-wider">
              <AlertTriangle className="h-4 w-4 shrink-0 text-amber-500" />{" "}
              Reversal Impact Assessment
            </h4>

            <div className="divide-y divide-amber-200/30 dark:divide-slate-800/60 text-xs space-y-3">
              {/* Cash Adjust */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 bg-amber-100 text-amber-800 dark:bg-amber-500/10 dark:text-amber-400 rounded-lg">
                    <Wallet className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-700 dark:text-slate-300">
                      Global Cash Balance
                    </p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500">
                      Adjustment pipeline status
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 font-mono">
                  <ArrowRight className="h-3.5 w-3.5 text-slate-300 dark:text-slate-700" />
                  <span
                    className={`font-bold ${reversedCashImpact > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}
                  >
                    {reversedCashImpact > 0 ? "+" : ""}
                    {formatCurrency(reversedCashImpact)}
                  </span>
                </div>
              </div>

              {/* Share Adjust */}
              {transaction.companyName && (
                <div className="flex items-center justify-between pt-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 bg-amber-100 text-amber-800 dark:bg-amber-500/10 dark:text-amber-400 rounded-lg">
                      <Coins className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-700 dark:text-slate-300">
                        {transaction.companyName} Volume
                      </p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500">
                        Security asset adjustment
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono">
                    <ArrowRight className="h-3.5 w-3.5 text-slate-300 dark:text-slate-700" />
                    <span
                      className={`font-bold ${reversedQuantityImpact > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}
                    >
                      {reversedQuantityImpact > 0 ? "+" : ""}
                      {reversedQuantityImpact.toLocaleString()} Shrs
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Error Message Section */}
          {apiError && (
            <div className="p-3.5 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 animate-in shake duration-300">
              {apiError}
            </div>
          )}

          {/* Section 3: Input Confirmation */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Security Protocol Confirmation
            </label>
            <div className="p-3.5 bg-slate-50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                To confirm this operation, type{" "}
                <span className="font-mono font-bold text-rose-500 dark:text-rose-400 select-all px-1 bg-rose-500/10 rounded">
                  REVERSE
                </span>{" "}
                below:
              </p>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="Type REVERSE to unlock"
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent font-mono transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
                autoComplete="off"
              />
            </div>
          </div>
        </div>

        {/* Action Footer - Fixed at the bottom, sticky safe on mobile */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 flex flex-col-reverse xs:flex-row justify-end gap-2 shrink-0">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
            className="h-10 w-full xs:w-auto font-semibold dark:bg-slate-950 dark:border-slate-800"
          >
            Cancel
          </Button>
          <Button
            onClick={handleReverseSubmit}
            disabled={isSubmitting || confirmText !== "REVERSE"}
            className="h-10 w-full xs:w-auto bg-rose-600 hover:bg-rose-700 text-white font-bold disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-rose-600/10 transition-all flex items-center justify-center"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Rolling
                back...
              </>
            ) : (
              "Execute Reversal"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
