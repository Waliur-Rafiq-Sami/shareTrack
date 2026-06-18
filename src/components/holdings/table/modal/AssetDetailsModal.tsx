"use client";

import { useState } from "react";
import {
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  ChevronLeft,
  ChevronRight,
  FileText,
  DollarSign,
  ArrowRightLeft,
} from "lucide-react";
import { useShareRecordsQuery } from "@/hooks/useShareRecordsQuery";
import { cn } from "@/lib/utils";
import AssetExportModal from "./AssetExportModal";

// shadcn/ui imports
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { SellAssetModal } from "./SellAssetModal";

// -----------------------------------------------------------------------------
// Enterprise Types & Interfaces
// -----------------------------------------------------------------------------

export interface IActiveHoldingClient {
  _id: string;
  companyName: string;
  totalQuantity: number;
  avgBuyPrice: number;
  totalInvestedAmount: number;
  realizedProfit: number;
  lastUpdated?: string | Date;
}

export interface ITransactionRecordClient {
  _id: string;
  actionType: "BUY" | "SELL" | "DEPOSIT" | "WITHDRAW";
  status: "COMPLETED" | "PENDING" | "CANCELLED";
  transactionDate: string | Date;
  quantity?: number;
  rate?: number;
  grossAmount: number;
  commissionAmount: number;
  netCashImpact: number;
}

interface AssetDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  asset: IActiveHoldingClient | null;
}

// -----------------------------------------------------------------------------
// Formatters
// -----------------------------------------------------------------------------

const formatCurrency = (value: number | undefined) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value || 0);

const formatDate = (dateString: string | Date | undefined) => {
  if (!dateString) return "N/A";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateString));
};

// -----------------------------------------------------------------------------
// Main Component
// -----------------------------------------------------------------------------

export function AssetDetailsModal({
  isOpen,
  onClose,
  asset,
}: AssetDetailsModalProps) {
  const [page, setPage] = useState(1);
  const limit = 5;
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);

  // FIXED: Added ?? null to prevent passing `undefined`
  const { data, isLoading, isError, isFetching } = useShareRecordsQuery({
    companyName: isOpen ? (asset?.companyName ?? null) : null,
    page,
    limit,
    sortOrder: "desc",
  });

  if (!isOpen || !asset) return null;

  // FIXED: Cast via unknown to bypass the ObjectId vs string mismatch
  const records = (data?.data as unknown as ITransactionRecordClient[]) || [];
  const pagination = data?.meta?.pagination;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-2xl rounded-2xl">
          {/* Loading Indicator Bar */}
          {isFetching && (
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 animate-pulse z-50" />
          )}

          {/* Header */}
          <DialogHeader className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-left sm:text-left">
            <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
              {asset.companyName}
              <span className="text-xs font-semibold text-slate-500 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2.5 py-1 rounded-md shadow-sm">
                ASSET LEDGER
              </span>
            </DialogTitle>
            {/* FIXED: Added screen-reader only description to fix Radix accessibility warning */}
            <DialogDescription className="sr-only">
              Asset details and transaction ledger for {asset.companyName}
            </DialogDescription>
          </DialogHeader>

          {/* Scrollable Body */}
          <div
            className={cn(
              "flex-1 overflow-y-auto p-6 space-y-8",
              "[&::-webkit-scrollbar]:w-2",
              "[&::-webkit-scrollbar-track]:bg-slate-100/50 dark:[&::-webkit-scrollbar-track]:bg-slate-900/50",
              "[&::-webkit-scrollbar-thumb]:bg-slate-300 dark:[&::-webkit-scrollbar-thumb]:bg-slate-700",
              "[&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-slate-400 dark:hover:[&::-webkit-scrollbar-thumb]:bg-slate-600",
              "transition-colors",
            )}
          >
            {/* Top Level Holding Statistics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <StatCard
                label="Total Shares Held"
                value={`${asset.totalQuantity || 0} sh`}
              />
              <StatCard
                label="Avg. Buy Price"
                value={formatCurrency(asset.avgBuyPrice)}
              />
              <StatCard
                label="Total Invested"
                value={formatCurrency(asset.totalInvestedAmount)}
              />
              <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-xl border border-emerald-100 dark:border-emerald-800/30">
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-500 uppercase tracking-wider">
                  Realized Profit
                </span>
                <p className="text-lg font-bold text-emerald-700 dark:text-emerald-400 mt-1">
                  {asset.realizedProfit >= 0 ? "+" : ""}
                  {formatCurrency(asset.realizedProfit)}
                </p>
              </div>
            </div>

            <hr className="border-slate-100 dark:border-slate-800" />

            {/* Transaction History Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Activity className="h-4 w-4 text-blue-500" />
                  Transaction History
                </h3>

                {pagination && pagination.totalPages > 1 && (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={!pagination.hasPrevPage || isFetching}
                      className="h-7 w-7 bg-blue-800 border-none dark:hover:bg-blue-700 text-white"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-xs font-medium text-slate-500">
                      {page} / {pagination.totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setPage((p) => p + 1)}
                      disabled={!pagination.hasNextPage || isFetching}
                      className="h-7 w-7 bg-blue-800 border-none dark:hover:bg-blue-700 text-white"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>

              {/* Content Area */}
              <div className="space-y-3">
                {isLoading ? (
                  <TransactionHistorySkeleton />
                ) : isError ? (
                  <div className="text-center p-6 bg-rose-50 dark:bg-rose-900/10 rounded-xl border border-rose-100 dark:border-rose-900/30">
                    <p className="text-sm text-rose-600 dark:text-rose-400">
                      Failed to load transaction history.
                    </p>
                  </div>
                ) : records.length === 0 ? (
                  <div className="text-center p-8 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800">
                    <FileText className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm text-slate-500">
                      No transaction records found.
                    </p>
                  </div>
                ) : (
                  records.map((tx: ITransactionRecordClient) => (
                    <div
                      key={tx._id}
                      className="flex items-center justify-between p-4 text-sm bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={cn(
                            "p-2 rounded-full",
                            tx.actionType === "BUY"
                              ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                              : tx.actionType === "SELL"
                                ? "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
                                : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
                          )}
                        >
                          {tx.actionType === "BUY" ? (
                            <ArrowDownRight className="h-4 w-4" />
                          ) : tx.actionType === "SELL" ? (
                            <ArrowUpRight className="h-4 w-4" />
                          ) : (
                            <ArrowRightLeft className="h-4 w-4" />
                          )}
                        </div>

                        <div>
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="font-bold text-slate-900 dark:text-slate-100">
                              {tx.actionType}
                            </span>
                            <span
                              className={cn(
                                "text-[10px] px-1.5 py-0.5 rounded font-bold uppercase",
                                tx.status === "COMPLETED"
                                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                                  : tx.status === "PENDING"
                                    ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                                    : "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
                              )}
                            >
                              {tx.status}
                            </span>
                          </div>
                          <span className="text-slate-500 text-xs">
                            {formatDate(tx.transactionDate)}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        {tx.quantity && tx.rate ? (
                          <>
                            <p className="font-bold text-slate-900 dark:text-slate-100">
                              {tx.quantity} sh
                            </p>
                            <p className="text-xs text-slate-500 mb-1">
                              @ {formatCurrency(tx.rate)}
                            </p>
                          </>
                        ) : (
                          <p className="font-bold text-slate-900 dark:text-slate-100 mb-1">
                            Cash Transfer
                          </p>
                        )}
                        <p
                          className={cn(
                            "text-xs font-semibold",
                            tx.netCashImpact < 0
                              ? "text-rose-600 dark:text-rose-400"
                              : "text-emerald-600 dark:text-emerald-400",
                          )}
                        >
                          {tx.netCashImpact < 0 ? "" : "+"}
                          {formatCurrency(tx.netCashImpact)} Net
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex flex-wrap gap-3 justify-end items-center">
            <AssetExportModal asset={asset as any} />

            <div
              className="flex items-center justify-end gap-2"
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                size="sm"
                variant="destructive"
                className="px-6 py-5 font-semibold bg-green-600 hover:bg-green-700 text-white"
                onClick={() => setIsSellModalOpen(true)}
                disabled={!asset || asset.totalQuantity <= 0}
              >
                <DollarSign className="w-3 h-3 mr-1" />
                Sell
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <SellAssetModal
        isOpen={isSellModalOpen}
        onClose={() => setIsSellModalOpen(false)}
        asset={asset as any}
      />
    </>
  );
}

// -----------------------------------------------------------------------------
// Helper Components
// -----------------------------------------------------------------------------

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800/60">
      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
        {label}
      </span>
      <p className="text-lg font-black text-slate-900 dark:text-white mt-1">
        {value}
      </p>
    </div>
  );
}

function TransactionHistorySkeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-100 dark:border-slate-800/50"
        >
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800" />
            <div>
              <div className="h-4 w-20 bg-slate-200 dark:bg-slate-800 rounded mb-2" />
              <div className="h-3 w-32 bg-slate-100 dark:bg-slate-800/50 rounded" />
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="h-4 w-16 bg-slate-200 dark:bg-slate-800 rounded mb-2" />
            <div className="h-3 w-24 bg-slate-100 dark:bg-slate-800/50 rounded mb-1" />
            <div className="h-3 w-20 bg-slate-100 dark:bg-slate-800/50 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
